'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface TeamInfo {
  key: string;
  name: string;
  logoUrl: string | null;
}

export function useUserTeamKey(): { teamKey: string | null; teamInfo: TeamInfo | null; loading: boolean } {
  const { data: session } = useSession();
  const [teamInfo, setTeamInfo] = useState<TeamInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function resolve() {
      // @ts-expect-error - primaryTeamId added in auth callbacks
      const teamId = session?.user?.primaryTeamId;
      if (!teamId) {
        setTeamInfo(null);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/team/colors?teamId=${teamId}`);
        if (res.ok) {
          const data = await res.json();
          setTeamInfo({
            key: data.key?.toLowerCase() || '',
            name: data.name || data.key || '',
            logoUrl: data.logoUrl || null,
          });
        }
      } catch {
        setTeamInfo(null);
      }
      setLoading(false);
    }

    resolve();
  }, [session]);

  return {
    teamKey: teamInfo?.key || null,
    teamInfo,
    loading,
  };
}
