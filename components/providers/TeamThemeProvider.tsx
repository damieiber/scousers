'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useTheme } from 'next-themes';
import { hexToOklch } from '@/lib/utils/hexToOklch';

interface TeamColors {
  primaryColor: string | null;
  secondaryColor: string | null;
  name: string | null;
  key: string | null;
  logoUrl: string | null;
}

interface TeamThemeContextType {
  teamColors: TeamColors | null;
  isLoading: boolean;
}

const TeamThemeContext = createContext<TeamThemeContextType>({
  teamColors: null,
  isLoading: true,
});

export function useTeamTheme() {
  return useContext(TeamThemeContext);
}

const CACHE_KEY = 'team-theme-colors';

// Default neutral values to restore when no team is selected
const NEUTRAL_COLORS_LIGHT = {
  '--primary': 'oklch(0.55 0.15 175)',
  '--primary-foreground': 'oklch(1 0 0)',
  '--ring': 'oklch(0.55 0.15 175)',
  '--sidebar-primary': 'oklch(0.55 0.15 175)',
  '--sidebar-ring': 'oklch(0.55 0.15 175)',
  '--chart-1': 'oklch(0.55 0.15 175)',
};

const NEUTRAL_COLORS_DARK = {
  '--primary': 'oklch(0.55 0.15 175)',
  '--primary-foreground': 'oklch(1 0 0)',
  '--ring': 'oklch(0.55 0.15 175)',
  '--sidebar-primary': 'oklch(0.55 0.15 175)',
  '--sidebar-ring': 'oklch(0.55 0.15 175)',
  '--chart-1': 'oklch(0.55 0.15 175)',
};

function applyColorVars(vars: Record<string, string>) {
  const root = document.documentElement;
  Object.entries(vars).forEach(([prop, value]) => {
    root.style.setProperty(prop, value);
  });
}

function clearColorVars() {
  const root = document.documentElement;
  const props = ['--primary', '--primary-foreground', '--ring', '--sidebar-primary', '--sidebar-ring', '--chart-1'];
  props.forEach(prop => root.style.removeProperty(prop));
}

export function TeamThemeProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const { resolvedTheme } = useTheme();
  const [teamColors, setTeamColors] = useState<TeamColors | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // @ts-expect-error - primaryTeamId is added in auth callbacks
  const primaryTeamId = session?.user?.primaryTeamId;

  const applyTeamColors = useCallback((colors: TeamColors, _isDark: boolean) => {
    if (!colors.primaryColor) {
      clearColorVars();
      return;
    }

    const primaryOklch = hexToOklch(colors.primaryColor);

    // For primary-foreground, determine if text should be white or dark
    // based on luminance of the primary color
    const primaryForeground = 'oklch(1 0 0)'; // white works for most team colors

    const vars: Record<string, string> = {
      '--primary': primaryOklch,
      '--primary-foreground': primaryForeground,
      '--ring': primaryOklch,
      '--sidebar-primary': primaryOklch,
      '--sidebar-ring': primaryOklch,
      '--chart-1': primaryOklch,
    };

    applyColorVars(vars);
  }, []);

  // Fetch team colors when session/team changes
  useEffect(() => {
    if (!primaryTeamId) {
      setTeamColors(null);
      clearColorVars();
      setIsLoading(false);
      return;
    }

    // Try cache first for instant paint
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.teamId === primaryTeamId) {
          setTeamColors(parsed.colors);
          applyTeamColors(parsed.colors, resolvedTheme === 'dark');
        }
      }
    } catch { /* ignore */ }

    // Fetch fresh data
    fetch(`/api/team/colors?teamId=${primaryTeamId}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then((colors: TeamColors) => {
        setTeamColors(colors);
        applyTeamColors(colors, resolvedTheme === 'dark');
        // Cache for next visit
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify({ teamId: primaryTeamId, colors }));
        } catch { /* ignore */ }
      })
      .catch(() => {
        setTeamColors(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [primaryTeamId, applyTeamColors, resolvedTheme]);

  // Re-apply colors when dark/light mode changes
  useEffect(() => {
    if (teamColors?.primaryColor) {
      applyTeamColors(teamColors, resolvedTheme === 'dark');
    }
  }, [resolvedTheme, teamColors, applyTeamColors]);

  return (
    <TeamThemeContext.Provider value={{ teamColors, isLoading }}>
      {children}
    </TeamThemeContext.Provider>
  );
}
