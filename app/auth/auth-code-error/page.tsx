'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AuthCodeErrorPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/');
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10 p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="text-2xl">Error de Autenticación</CardTitle>
          <CardDescription>
            Hubo un problema al procesar tu inicio de sesión
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Esto puede ocurrir por varias razones:
          </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>El enlace de autenticación expiró o ya fue usado.</li>
              <li>La configuración de redirección necesita ajustes.</li>
              <li>Tal vez ya iniciaste sesión correctamente en segundo plano.</li>
            </ul>
          <p className="text-sm text-muted-foreground">
            Serás redirigido automáticamente al inicio en unos segundos...
          </p>
          <div className="flex gap-2">
            <Button 
              onClick={() => router.push('/login')} 
              className="flex-1"
            >
              Intentar de nuevo
            </Button>
            <Button 
              onClick={() => router.push('/')} 
              variant="outline"
              className="flex-1"
            >
              Ir al inicio
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
