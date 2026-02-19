import { Metadata } from 'next';
import Link from 'next/link';
import { AuthForm } from '@/components/auth/AuthForm';

export const metadata: Metadata = {
  title: 'Login - FanNews',
  description: 'Inicia sesión en tu cuenta de FanNews',
};

export default function LoginPage() {
  return (
    <div className="container relative h-[800px] flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <Link
        href="/"
        className={"absolute left-4 top-4 md:left-8 md:top-8 text-sm font-bold hover:text-primary transition-colors"}
      >
        Wait, I need to check if button variants are available in ui/button or I should just use standard classes.
        I will use standard classes for now to be safe.
        ← Volver
      </Link>
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
        <div className="absolute inset-0 bg-black" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent opacity-80" />
        
        <div className="relative z-20 flex items-center text-lg font-medium">
            <span className="font-black tracking-tighter text-2xl">FAN<span className="text-primary">NEWS</span></span>
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &quot;La mejor forma de seguir a tu equipo. Noticias personalizadas, efemérides y estadísticas en un solo lugar.&quot;
            </p>
          </blockquote>
        </div>
      </div>
      <div className="p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Bienvenido
            </h1>
            <p className="text-sm text-muted-foreground">
              Ingresa tu email para entrar a tu cuenta
            </p>
          </div>
          <AuthForm />
        </div>
      </div>
    </div>
  );
}
