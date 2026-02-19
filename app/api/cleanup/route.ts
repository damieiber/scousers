import { NextResponse } from 'next/server';
import { purgeOldArticles } from '@/lib/db';

export async function POST(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const daysOld = 30;
    const result = await purgeOldArticles(daysOld);
    
    const count = result?.count ?? 0;
    return NextResponse.json({ 
      message: `Purge process completed successfully.`,
      deleted_count: count 
    });

  } catch (error) {
    console.error('Failed to run purge process:', error);
    return NextResponse.json({ error: 'Failed to purge old articles.' }, { status: 500 });
  }
}
