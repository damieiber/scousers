'use client';

import { useSession } from 'next-auth/react';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { BarChart3, Users, Trophy, CalendarDays, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function FeaturesTeaser() {
  const { data: session } = useSession();
  const { t } = useLanguage();

  if (session) return null;

  const features = [
    {
      title: t.nav.matchCenter,
      description: t.featuresTeaser.matchCenterDesc,
      icon: <BarChart3 className="w-8 h-8 text-primary mb-4" />,
    },
    {
      title: t.nav.squad,
      description: t.featuresTeaser.squadDesc,
      icon: <Users className="w-8 h-8 text-primary mb-4" />,
    },
    {
      title: t.nav.standings,
      description: t.featuresTeaser.standingsDesc,
      icon: <Trophy className="w-8 h-8 text-primary mb-4" />,
    },
    {
      title: t.nav.efemerides,
      description: t.featuresTeaser.efemeridesDesc,
      icon: <CalendarDays className="w-8 h-8 text-primary mb-4" />,
    },
  ];

  return (
    <section className="py-12 border-t border-border mt-12">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-3xl font-black text-foreground mb-4 tracking-tight uppercase">
          {t.featuresTeaser.title}
        </h2>
        <p className="text-muted-foreground text-lg">
          {t.featuresTeaser.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {features.map((feature, i) => (
          <div key={i} className="bg-card border border-border rounded-xl p-6 shadow-sm hover:border-primary/50 transition-colors">
            {feature.icon}
            <h3 className="text-xl font-bold text-foreground mb-2">{feature.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </div>

      <div className="text-center">
        <Link
          href="/login"
          className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-primary hover:bg-primary/90 rounded-full transition-all duration-300 shadow-lg hover:shadow-primary/30 transform hover:-translate-y-1"
        >
          {t.featuresTeaser.cta}
          <ArrowRight className="ml-2 w-5 h-5" />
        </Link>
      </div>
    </section>
  );
}
