import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import SessionProvider from '@/components/auth/SessionProvider';
import { LanguageProvider } from '@/components/providers/LanguageProvider';
import { TeamThemeProvider } from '@/components/providers/TeamThemeProvider';

import { ThemeProvider } from '@/components/layout/ThemeProvider';

const inter = Inter({ subsets: ['latin'] });


export const metadata: Metadata = {
  title: 'AI-Powered Fan Hub - River Plate MVP',
  description: 'Tu portal de noticias y contenido curado por IA para el hincha de River Plate.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='es' suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <TeamThemeProvider>
              <LanguageProvider>
                <div className='min-h-screen flex flex-col bg-background font-sans antialiased selection:bg-primary/20 selection:text-primary'>
                  <Header />
                  <main className='w-full max-w-7xl mx-auto flex-grow px-4 sm:px-6 lg:px-8 pb-8 pt-12 sm:pt-16'>
                    {children}
                  </main>
                  <Footer />
                </div>
              </LanguageProvider>
            </TeamThemeProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
