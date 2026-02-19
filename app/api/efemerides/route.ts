import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Efemeris from '@/lib/models/Efemeris';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get('date'); // Expected format MM-DD or similar? Supabase was flexible. 
    // If dateParam comes as "MM-DD", we might need to filter by day/month fields if they exist, or string match.
    // Looking at the original code: query.eq('date', dateParam). 
    // So 'date' field in DB is a string? 
    // In seed script, Efemeride type likely has 'date'. 

    await dbConnect();

    let query: any = {};
    if (dateParam) {
      query.date = dateParam;
    }

    const efemerides = await Efemeris.find(query).sort({ year: -1 });

    return NextResponse.json({ efemerides });
  } catch (error) {
    console.error('Error loading efemerides:', error);
    return NextResponse.json({ error: 'Failed to load efemerides' }, { status: 500 });
  }
}
