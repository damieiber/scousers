import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Team from '@/lib/models/Team';

export async function GET(request: NextRequest) {
  const teamId = request.nextUrl.searchParams.get('teamId');

  if (!teamId) {
    return NextResponse.json({ error: 'teamId is required' }, { status: 400 });
  }

  try {
    await dbConnect();
    const team = await Team.findById(teamId).select('name key primaryColor secondaryColor logoUrl');

    if (!team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    return NextResponse.json({
      name: team.name,
      key: team.key,
      primaryColor: team.primaryColor || null,
      secondaryColor: team.secondaryColor || null,
      logoUrl: team.logoUrl || null,
    });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch team' }, { status: 500 });
  }
}
