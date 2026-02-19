import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Team from '@/lib/models/Team';

export async function GET() {
  try {
    await dbConnect();
    const teams = await Team.find({ isAvailable: true })
      .select('key name primaryColor secondaryColor logoUrl')
      .sort({ name: 1 });

    const result = teams.map(t => ({
      id: t._id.toString(),
      key: t.key,
      name: t.name,
      primaryColor: t.primaryColor || null,
      secondaryColor: t.secondaryColor || null,
      logoUrl: t.logoUrl || null,
    }));

    return NextResponse.json(result);
  } catch {
    return NextResponse.json([], { status: 500 });
  }
}
