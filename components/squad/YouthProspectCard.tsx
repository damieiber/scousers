'use client';

import { YouthProspect } from '@/lib/services/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, GraduationCap } from 'lucide-react';
import { useLanguage } from '@/components/providers/LanguageProvider';

interface YouthProspectCardProps {
  prospect: YouthProspect;
}

export function YouthProspectCard({ prospect }: YouthProspectCardProps) {
  const { t } = useLanguage();

  return (
    <Card className="border-border bg-card shadow-sm overflow-hidden relative">
      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full -mr-8 -mt-8 blur-2xl"></div>
      
      <CardHeader className="pb-2 relative z-10">
        <CardTitle className="flex items-center gap-2 text-lg font-black uppercase tracking-tight">
          <GraduationCap className="w-5 h-5 text-primary" />
          {t.squad.youthProspect}
        </CardTitle>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="bg-muted/30 rounded-xl p-4 border border-border/50">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-yellow-500" />
            <span className="text-xs font-bold text-primary uppercase tracking-wider">{t.squad.prospectOfWeek}</span>
          </div>
          
          <h3 className="text-2xl font-black text-foreground leading-none mb-1">{prospect.name}</h3>
          <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase mb-4">
            <span>{prospect.category}</span>
            <span>•</span>
            <span>{prospect.position}</span>
          </div>

          <div className="bg-background/80 rounded-lg p-3 mb-3 border border-border/50">
            <span className="block text-lg font-black text-foreground">{prospect.stats}</span>
            <span className="text-[10px] text-muted-foreground uppercase font-bold">{t.squad.standoutPerformance}</span>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed">
            {prospect.description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
