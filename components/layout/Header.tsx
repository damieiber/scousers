"use client";

import Link from 'next/link';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { siteConfig } from '@/lib/config';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { UserNav } from '@/components/layout/UserNav';
import { ChevronDown, Swords, BarChart3, Users, Trophy } from 'lucide-react';
import { useEffect, useState, Suspense } from 'react';
import { useSession } from "next-auth/react"
import { useLanguage } from '@/components/providers/LanguageProvider';

export function Header() {
  return (
    <Suspense fallback={<div className="h-16 bg-primary shadow-md" />}>
      <HeaderContent />
    </Suspense>
  );
}

function HeaderContent() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [hasRivalAccess, setHasRivalAccess] = useState(false);
  const [isLoadingAccess, setIsLoadingAccess] = useState(true);
  const { locale, setLocale, t } = useLanguage();

  const isRivalMode = searchParams.get('mode') === 'rivals';

  useEffect(() => {
    async function checkRivalAccess() {
      setIsLoadingAccess(true);
      if (session?.user) {
         // @ts-expect-error
         const status = session.user.subscription_status;
         if (['premium', 'plus', 'trial'].includes(status)) {
             setHasRivalAccess(true);
         } else {
             setHasRivalAccess(false);
         }
      } else {
        setHasRivalAccess(false);
      }
      setIsLoadingAccess(false);
    }

    checkRivalAccess();
  }, [session]);

  const toggleRivalMode = () => {
    if (pathname === '/feed' || pathname === '/') {
      const targetPath = pathname === '/' ? '/feed' : pathname;
      if (isRivalMode) {
        router.push(targetPath);
      } else {
        router.push(`${targetPath}?mode=rivals`);
      }
    } else {
      router.push('/feed?mode=rivals');
    }
  };

  const toggleLanguage = () => {
    setLocale(locale === 'es' ? 'en' : 'es');
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 bg-primary shadow-md py-3 transition-all duration-300 ease-in-out"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex flex-col">
          <Link href="/" className="group flex items-center gap-2 no-underline">
            <h1 className="font-black text-3xl tracking-tighter text-white italic uppercase transform -skew-x-6 group-hover:scale-105 transition-transform">
              {siteConfig.name}
            </h1>
          </Link>
        </div>
        
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex items-center gap-1">
            {[
              { name: t.nav.home, href: '/' },
              { name: t.nav.feed, href: '/feed' },
              { name: t.nav.matchCenter, href: '/match-center' },
              { name: t.nav.squad, href: '/squad' },
              { name: t.nav.standings, href: '/standings' },
              { name: t.nav.efemerides, href: '/efemerides' },
            ].map((link) => {
              const isActive = pathname === link.href && !isRivalMode;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide transition-all duration-200 ${
                    isActive
                      ? 'bg-white text-primary shadow-sm'
                      : 'text-white/90 hover:text-white hover:bg-white/20'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}

            <DropdownMenu>
              <DropdownMenuTrigger className="px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide transition-all duration-200 text-white/90 hover:text-white hover:bg-white/20 flex items-center gap-1 outline-none">
                {t.nav.club} <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/match-center" className="flex items-center cursor-pointer">
                    <BarChart3 className="mr-2 h-4 w-4" /> {t.nav.matchCenter}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/squad" className="flex items-center cursor-pointer">
                    <Users className="mr-2 h-4 w-4" /> {t.nav.squad}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/standings" className="flex items-center cursor-pointer">
                    <Trophy className="mr-2 h-4 w-4" /> {t.nav.standings}
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {!isLoadingAccess && hasRivalAccess && (
              <button
                onClick={toggleRivalMode}
                className={`px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide transition-all duration-200 flex items-center gap-2 ${
                  isRivalMode
                    ? 'bg-red-500 text-white shadow-sm'
                    : 'text-white/90 hover:text-white hover:bg-white/20'
                }`}
                title={locale === 'es' ? 'Modo Rival: Ver noticias de tus rivales' : 'Rival Mode: View your rivals\' news'}
              >
                <Swords className="h-4 w-4" />
                {t.nav.rival}
              </button>
            )}
          </nav>
          
          <div className="pl-2 border-l border-white/20 flex gap-2 items-center">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-white/90 hover:text-white hover:bg-white/20 transition-all duration-200"
              title={locale === 'es' ? 'Switch to English' : 'Cambiar a Español'}
            >
              <img 
                src={locale === 'es' ? '/spain.png' : '/uk.png'} 
                alt={locale === 'es' ? 'Español' : 'English'} 
                className="h-4 w-4 rounded-sm object-cover" 
              />
              {locale === 'es' ? 'ES' : 'EN'}
            </button>
            <ThemeSwitcher />
            <UserNav />
          </div>

        </div>
      </div>
    </header>
  );
}
