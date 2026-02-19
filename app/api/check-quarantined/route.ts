import { NextResponse } from 'next/server';
import { getQuarantinedSources, reactivateSource } from '@/lib/db';

const HEALTH_CHECK_TIMEOUT = 10000;

async function isSourceHealthy(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, {
      method: 'HEAD',
      signal: AbortSignal.timeout(HEALTH_CHECK_TIMEOUT),
    });
    return response.ok;
  } catch (error) {
    if (error instanceof Error) {
      console.warn(`  - Health check failed for ${url}: ${error.message}`);
    }
    return false;
  }
}

async function runQuarantineCheck() {
  const quarantinedSources = await getQuarantinedSources();

  if (quarantinedSources.length === 0) {
    return;
  }

  const results = await Promise.allSettled(
    quarantinedSources.map(async (source) => {
      const isHealthy = await isSourceHealthy(source.url);
      if (isHealthy) {
        await reactivateSource(source._id.toString());
        return { source: source.name, status: 'Reactivated' };
      } else {
        return { source: source.name, status: 'Still Quarantined' };
      }
    })
  );
}

export async function POST(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    runQuarantineCheck();
    return NextResponse.json({ message: 'Quarantine check process started successfully.' });
  } catch (error) {
    console.error('Failed to start quarantine check process:', error);
    return NextResponse.json({ error: 'Failed to start quarantine check process.' }, { status: 500 });
  }
}
