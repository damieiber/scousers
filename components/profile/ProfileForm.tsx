'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Trophy, Crown, User, Globe, LucideIcon } from 'lucide-react';
import { UserProfile, SubscriptionStatus, Feature } from '@/lib/types';
import { useSession } from "next-auth/react"
import { useLanguage } from '@/components/providers/LanguageProvider';

interface TeamOption {
  id: string;
  key: string;
  name: string;
  primaryColor: string | null;
  secondaryColor: string | null;
  logoUrl: string | null;
}

// Map team keys to badge images in /public
const TEAM_BADGES: Record<string, string> = {
  liverpool: '/liverpool.png',
  everton: '/everton.png',
};

interface ProfileFormProps {
  userId: string;
}

export default function ProfileForm({ userId }: ProfileFormProps) {
  const { data: session, update: updateSession } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [teams, setTeams] = useState<TeamOption[]>([]);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fullName, setFullName] = useState('');
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const { locale, setLocale, t } = useLanguage();

  // Fetch teams on mount
  useEffect(() => {
    async function fetchData() {
      try {
        const teamsRes = await fetch('/api/team/list');
        if (teamsRes.ok) {
          const teamsData = await teamsRes.json();
          setTeams(teamsData);
        }

        // Set selected team from session
        // @ts-expect-error - primaryTeamId added in auth callbacks
        const teamId = session?.user?.primaryTeamId;
        if (teamId) {
          setSelectedTeamId(teamId);
        }

        // Set name from session
        if (session?.user?.name) {
          setFullName(session.user.name);
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [session]);

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          primaryTeamId: selectedTeamId,
          language: locale,
        }),
      });

      if (res.ok) {
        // Trigger session refresh so TeamThemeProvider picks up the change
        await updateSession();
        toast.success(locale === 'es' ? 'Perfil actualizado' : 'Profile updated');
      } else {
        toast.error(locale === 'es' ? 'Error al guardar' : 'Error saving');
      }
    } catch {
      toast.error(locale === 'es' ? 'Error al guardar' : 'Error saving');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const SUBSCRIPTION_LABELS: Record<SubscriptionStatus, { label: string; icon: LucideIcon | null; color: string }> = {
    free: { label: t.subscriptions.free, icon: null, color: 'text-muted-foreground' },
    standard: { label: t.subscriptions.standard, icon: Trophy, color: 'text-blue-600' },
    plus: { label: t.subscriptions.plus, icon: Trophy, color: 'text-purple-600' },
    premium: { label: t.subscriptions.premium, icon: Crown, color: 'text-yellow-600' },
    trial: { label: t.subscriptions.trial, icon: Trophy, color: 'text-green-600' },
  };

  const subscriptionInfo = profile ? SUBSCRIPTION_LABELS[profile.subscriptionStatus] : null;
  const SubscriptionIcon = subscriptionInfo?.icon;

  return (
    <div className="space-y-6">
      {/* Personal Data */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {t.profile.personalData}
          </CardTitle>
          <CardDescription>
            {t.profile.basicInfo}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="email">{t.profile.email}</Label>
            <Input 
              id="email" 
              value={session?.user?.email || ''} 
              disabled 
              className="bg-muted"
            />
            <p className="text-xs text-muted-foreground">
              {t.profile.emailCantChange}
            </p>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="full_name">{t.profile.fullName}</Label>
            <Input 
              id="full_name" 
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder={t.profile.fullNamePlaceholder}
            />
          </div>
        </CardContent>
      </Card>

      {/* Language Preference */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            {t.profile.language}
          </CardTitle>
          <CardDescription>
            {t.profile.languageDesc}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            <Label>{t.profile.languageLabel}</Label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setLocale('es')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg border-2 font-bold text-sm transition-all duration-200 ${
                  locale === 'es' 
                    ? 'border-primary bg-primary/10 text-primary' 
                    : 'border-border text-muted-foreground hover:border-primary/50'
                }`}
              >
                <img src="/spain.png" alt="España" className="h-5 w-5 rounded-sm object-cover" />
                Español
              </button>
              <button
                type="button"
                onClick={() => setLocale('en')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg border-2 font-bold text-sm transition-all duration-200 ${
                  locale === 'en' 
                    ? 'border-primary bg-primary/10 text-primary' 
                    : 'border-border text-muted-foreground hover:border-primary/50'
                }`}
              >
                <img src="/uk.png" alt="English" className="h-5 w-5 rounded-sm object-cover" />
                English
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subscription Plan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {SubscriptionIcon && <SubscriptionIcon className={`h-5 w-5 ${subscriptionInfo?.color}`} />}
            {t.profile.subscriptionPlan}
          </CardTitle>
          <CardDescription>
            {t.profile.subscriptionDesc}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label className="text-sm text-muted-foreground">{t.profile.currentPlan}</Label>
              <p className={`text-2xl font-bold ${subscriptionInfo?.color}`}>
                {subscriptionInfo?.label || t.subscriptions.free}
              </p>
            </div>

            {profile?.subscriptionExpiresAt && (
              <div>
                <Label className="text-sm text-muted-foreground">{t.profile.expiresOn}</Label>
                <p className="text-lg">
                  {new Date(profile.subscriptionExpiresAt).toLocaleDateString(locale === 'en' ? 'en-US' : 'es-AR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            )}

            {(!profile || profile?.subscriptionStatus === 'free') && (
              <div className="rounded-lg bg-muted p-4">
                <p className="text-sm">
                  {t.profile.upgradeMessage}
                </p>
              </div>
            )}

            {features.length > 0 && (
              <div>
                <Label className="text-sm text-muted-foreground mb-2 block">{t.profile.activeFeatures}</Label>
                <div className="space-y-1">
                  {features.map((feature) => (
                    <div key={feature.id} className="flex items-center gap-2 text-sm">
                      <span className="text-green-600">✓</span>
                      <span className="font-medium">{feature.name}</span>
                      {feature.description && (
                        <span className="text-muted-foreground text-xs">- {feature.description}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Favorite Team - Button style selector */}
      <Card>
        <CardHeader>
          <CardTitle>{t.profile.favoriteTeams}</CardTitle>
          <CardDescription>
            {t.profile.favoriteTeamsDesc}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>{t.profile.primaryTeam}</Label>
            <div className="flex gap-3">
              {teams.map((team) => {
                const isSelected = selectedTeamId === team.id;
                const badgeSrc = TEAM_BADGES[team.key] || null;
                return (
                  <button
                    key={team.id}
                    type="button"
                    onClick={() => setSelectedTeamId(isSelected ? null : team.id)}
                    className={`flex-1 flex flex-col items-center gap-3 py-4 px-4 rounded-lg border-2 font-bold text-sm transition-all duration-200 ${
                      isSelected
                        ? 'border-primary bg-primary/10 text-primary shadow-md'
                        : 'border-border text-muted-foreground hover:border-primary/50'
                    }`}
                    style={isSelected && team.primaryColor ? {
                      borderColor: team.primaryColor,
                      backgroundColor: `${team.primaryColor}15`,
                      color: team.primaryColor,
                    } : undefined}
                  >
                    {badgeSrc ? (
                      <img 
                        src={badgeSrc} 
                        alt={team.name} 
                        className="h-12 w-12 object-contain"
                      />
                    ) : (
                      <div 
                        className="h-12 w-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                        style={{ backgroundColor: team.primaryColor || '#666' }}
                      >
                        {team.name.charAt(0)}
                      </div>
                    )}
                    {team.name}
                  </button>
                );
              })}
            </div>
            <p className="text-sm text-muted-foreground">
              {t.profile.noTeamSelected}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button 
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="bg-primary hover:bg-primary/90 text-white font-bold"
        >
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {t.profile.saveChanges}
        </Button>
      </div>
    </div>
  );
}
