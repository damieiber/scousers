'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
// import { supabase } from '@/lib/supabaseService'; // Removed
import ProfileForm from '@/components/profile/ProfileForm';
import { useSession } from "next-auth/react"

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [userId, setUserId] = useState<string | null>(null);
  const loading = status === "loading";

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (session?.user) {
      setUserId(session.user.id || null);
    }
  }, [session, status, router]);

  if (loading || !userId) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mi Perfil</h1>
          <p className="text-muted-foreground mt-2">
            Configurá tus preferencias y personalizá tu experiencia
          </p>
        </div>

        <ProfileForm userId={userId} />
      </div>
    </div>
  );
}
