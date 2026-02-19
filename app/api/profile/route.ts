import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/User';

export async function PUT(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { fullName, primaryTeamId, language } = body;

    await dbConnect();

    const updateData: Record<string, unknown> = {};

    if (fullName !== undefined) {
      updateData.name = fullName;
    }

    if (primaryTeamId !== undefined) {
      updateData.primaryTeamId = primaryTeamId || null;
    }

    if (language && ['es', 'en'].includes(language)) {
      updateData.language = language;
    }

    await User.findOneAndUpdate(
      { email: session.user.email },
      { $set: updateData },
      { new: true }
    );

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
