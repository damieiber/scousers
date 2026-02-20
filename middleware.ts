import NextAuth from "next-auth"
import { authConfig } from "./auth.config"

export default NextAuth(authConfig).auth((req) => {
  const isLoggedIn = !!req.auth
  const isOnDashboard = req.nextUrl.pathname.startsWith('/dashboard')
  const isOnLogin = req.nextUrl.pathname.startsWith('/login')

  if (isOnDashboard) {
    if (isLoggedIn) return; // allow
    return Response.redirect(new URL('/login', req.nextUrl));
  }
  
  if (isLoggedIn && isOnLogin) {
    return Response.redirect(new URL('/', req.nextUrl));
  }
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
