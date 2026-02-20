import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  trustHost: true,
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      const isOnLogin = nextUrl.pathname.startsWith('/login');

      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect to login
      }
      
      if (isLoggedIn && isOnLogin) {
        return Response.redirect(new URL('/', nextUrl));
      }
      
      return true;
    },
    // We can define other callbacks here if they don't depend on DB
    // e.g. jwt, session (basic props)
  },
  providers: [], // Providers added in auth.ts
} satisfies NextAuthConfig;
