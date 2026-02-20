'use client';

import Link from 'next/link';
import { AuthForm } from '@/components/auth/AuthForm';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { siteConfig } from '@/lib/config';

export default function LoginPage() {
  const { t } = useLanguage();

  return (
    <div className="flex items-center justify-center px-4 py-10" style={{ minHeight: 'calc(100vh - 4rem)' }}>
      <div className="w-full max-w-[820px] rounded-2xl overflow-hidden shadow-2xl border border-border flex">
        {/* Left panel — Hero */}
        <div className="hidden md:flex md:w-[40%] relative bg-gradient-to-br from-primary via-primary/90 to-primary/70 p-8 flex-col justify-between">
          <Link href="/" className="inline-block">
            <h2 className="font-black text-2xl tracking-tighter text-white italic uppercase transform -skew-x-6">
              {siteConfig.name}
            </h2>
          </Link>

          <div className="space-y-3">
            <div className="flex gap-2">
              {['⚽', '📊', '📰'].map((emoji, i) => (
                <div key={i} className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-sm border border-white/10">
                  {emoji}
                </div>
              ))}
            </div>
            <p className="text-sm text-white/85 font-medium leading-relaxed">
              &quot;{t.footer.description}&quot;
            </p>
          </div>

          <div className="flex gap-5 text-white/60 text-[10px] font-medium">
            <div className="text-center">
              <div className="text-lg font-black text-white">2</div>
              <div className="uppercase tracking-wider">Teams</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-black text-white">12+</div>
              <div className="uppercase tracking-wider">Sources</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-black text-white">AI</div>
              <div className="uppercase tracking-wider">Powered</div>
            </div>
          </div>
        </div>

        {/* Right panel — Form */}
        <div className="flex-1 bg-background p-8 flex flex-col justify-center">
          <div className="w-full max-w-[340px] mx-auto space-y-5">
            <div className="md:hidden text-center">
              <Link href="/">
                <h2 className="font-black text-2xl tracking-tighter text-foreground italic uppercase transform -skew-x-6 inline-block">
                  {siteConfig.name}
                </h2>
              </Link>
            </div>

            <div className="space-y-1 text-center">
              <h1 className="text-2xl font-black text-foreground tracking-tight">
                {t.auth.login}
              </h1>
              <p className="text-muted-foreground text-xs">
                {t.footer.description}
              </p>
            </div>

            <AuthForm />

            <div className="text-center">
              <Link
                href="/"
                className="text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                ← {t.newsDetail.backToHome}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
