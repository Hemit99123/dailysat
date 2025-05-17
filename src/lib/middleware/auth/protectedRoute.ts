import type { NextRequest } from "next/server";
import redirectTo from "../redirect";
import { getSessionCookie } from "better-auth/cookies";

export const handleProtectedRoutes = async (request: NextRequest, protectedRoutes: any[]) => {
    const sessionCookie = await getSessionCookie(request);
  
    if (!sessionCookie && protectedRoutes.includes(request.nextUrl.pathname)) {
      return redirectTo(request, '/auth/signin')
    }
  
    return null;
};

// Special case in which logic is slightly different (therefore warrants its own function)
export const handleSignInRoutes = async (request: NextRequest, protectedRoutes: any[]) => {
  const sessionCookie = await getSessionCookie(request);
  
  if (sessionCookie && protectedRoutes.includes(request.nextUrl.pathname)) {
    return redirectTo(request, '/')
  }

  return null;
}