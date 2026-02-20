'use client';

import { useSession } from 'next-auth/react';
import { useLanguage } from '@/components/providers/LanguageProvider';
import Link from 'next/link';
import { Lock } from 'lucide-react';

interface AuthGateProps {
  children: React.ReactNode;
}

export function AuthGate({ children }: AuthGateProps) {
  const { data: session, status } = useSession();
  const { t } = useLanguage();

  if (status === 'loading') {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-20 flex justify-center">
        <div className="text-muted-foreground">{t.common.loading}</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-md mx-auto text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-muted/50 border border-border flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-black text-foreground uppercase tracking-tight">
            {t.authGate.title}
          </h2>
          <p className="text-muted-foreground">
            {t.authGate.description}
          </p>
          <Link
            href="/login"
            className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors uppercase tracking-wider text-sm"
          >
            {t.authGate.signIn}
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
