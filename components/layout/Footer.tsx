'use client';

import React from 'react';
import { useLanguage } from '@/components/providers/LanguageProvider';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-card text-card-foreground py-2 mt-auto border-t-4 border-primary">
      <div className="container mx-auto px-4 flex flex-col items-center justify-center text-center">
        <h3 className="text-xl font-bold mb-1 tracking-tight">FanNews River Plate</h3>
        <p className="text-muted-foreground text-xs max-w-md mb-2">
          {t.footer.description}
        </p>
        <div className="text-[10px] text-muted-foreground/60">
          &copy; {new Date().getFullYear()} FanNews. {t.footer.allRightsReserved}
        </div>
      </div>
    </footer>
  );
}
