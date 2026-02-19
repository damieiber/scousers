'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Trophy, Crown, User, LucideIcon } from 'lucide-react';
// import { getUserProfile, updateUserProfile, getAllTeams, getUserFeatures } from '@/lib/supabaseService'; // Removed
import { UserProfile, Team, SubscriptionStatus, Feature } from '@/lib/types';
import TeamSelector from './TeamSelector';
import { useSession } from "next-auth/react"

const profileFormSchema = z.object({
  full_name: z.string().min(2, 'El nombre deb tener al menos 2 caracteres').nullable(),
  email: z.string().email(), 
  primary_team_id: z.string().nullable(),
  secondary_team_ids: z.array(z.string()).nullable(),
});

type ProfileFormData = z.infer<typeof profileFormSchema>;

interface ProfileFormProps {
  userId: string;
}

const SUBSCRIPTION_LABELS: Record<SubscriptionStatus, { label: string; icon: LucideIcon | null; color: string }> = {
  free: { label: 'Gratuito', icon: null, color: 'text-muted-foreground' },
  standard: { label: 'Standard', icon: Trophy, color: 'text-blue-600' },
  plus: { label: 'Plus', icon: Trophy, color: 'text-purple-600' },
  premium: { label: 'Premium', icon: Crown, color: 'text-yellow-600' },
  trial: { label: 'Prueba', icon: Trophy, color: 'text-green-600' },
};

export default function ProfileForm({ userId }: ProfileFormProps) {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      full_name: '',
      email: '',
      primary_team_id: null,
      secondary_team_ids: [],
    },
  });

  const primaryTeamId = watch('primary_team_id');

  /*
  useEffect(() => {
    async function loadData() {
      // TODO: Refactor to use API routes or Server Actions
    }
    loadData();
  }, [userId, setValue]);

  async function onSubmit(data: ProfileFormData) {
     // TODO: Refactor to use API routes or Server Actions
     toast.info("Profile update not recommended yet.");
  }
  */

  // Temporary mock for build
  useEffect(() => {
     setLoading(false);
  }, []);

  async function onSubmit(data: ProfileFormData) {
      toast.info("Updating profile via API is coming soon.");
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const subscriptionInfo = profile ? SUBSCRIPTION_LABELS[profile.subscription_status] : null;
  const SubscriptionIcon = subscriptionInfo?.icon;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Datos Personales
          </CardTitle>
          <CardDescription>
            Información básica de tu cuenta
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              {...register('email')} 
              disabled 
              className="bg-muted"
            />
            <p className="text-xs text-muted-foreground">
              El email no se puede cambiar directamente
            </p>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="full_name">Nombre Completo</Label>
            <Input 
              id="full_name" 
              {...register('full_name')} 
              placeholder="Tu nombre"
            />
            {errors.full_name && (
              <p className="text-sm text-red-500">{errors.full_name.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {SubscriptionIcon && <SubscriptionIcon className={`h-5 w-5 ${subscriptionInfo.color}`} />}
            Plan de Suscripción
          </CardTitle>
          <CardDescription>
            Tu plan actual y características disponibles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label className="text-sm text-muted-foreground">Plan Actual</Label>
              <p className={`text-2xl font-bold ${subscriptionInfo?.color}`}>
                {subscriptionInfo?.label}
              </p>
            </div>

            {profile?.subscription_expires_at && (
              <div>
                <Label className="text-sm text-muted-foreground">Expira el</Label>
                <p className="text-lg">
                  {new Date(profile.subscription_expires_at).toLocaleDateString('es-AR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            )}

            {profile?.subscription_status === 'free' && (
              <div className="rounded-lg bg-muted p-4">
                <p className="text-sm">
                  💡 <strong>Mejorá tu experiencia:</strong> Actualizá a un plan Premium para desbloquear características exclusivas como modo rival, personalización visual y más.
                </p>
              </div>
            )}

            {features.length > 0 && (
              <div>
                <Label className="text-sm text-muted-foreground mb-2 block">Características Activas</Label>
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

      <Card>
        <CardHeader>
          <CardTitle>Equipos Favoritos</CardTitle>
          <CardDescription>
            Seleccioná tu equipo principal para personalizar tu feed de noticias
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="primary_team">Equipo Principal</Label>
            <TeamSelector
              teams={teams}
              value={primaryTeamId}
              onChange={(value) => setValue('primary_team_id', value)}
              placeholder="Seleccioná tu equipo (opcional)"
            />
            <p className="text-sm text-muted-foreground">
              Si no seleccionás un equipo, verás noticias de todos los equipos disponibles
            </p>
          </div>

          <div className="space-y-2 opacity-50">
            <Label htmlFor="secondary_teams" className="flex items-center gap-2">
              Equipos Secundarios
              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">Premium</span>
            </Label>
            <TeamSelector
              teams={teams.filter(t => t.id !== primaryTeamId)}
              value={null}
              onChange={(_value: string | null) => {}}
              placeholder="Disponible en planes Premium"
              disabled
            />
            <p className="text-sm text-muted-foreground">
              En los planes Premium podrás seguir múltiples equipos
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button 
          type="submit" 
          disabled={saving}
          className="bg-primary hover:bg-primary/90 text-white font-bold"
        >
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Guardar Cambios
        </Button>
      </div>
    </form>
  );
}
