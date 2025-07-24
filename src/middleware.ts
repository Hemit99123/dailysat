import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {handleProtectedRoutes, handleSignInRoutes} from '@/lib/middleware/auth/protectedRoute';
import protectedLoginRoutes from './data/protected-routes/protectedLoginRoutes';
import protectedUserRoutes from './data/protected-routes/protectedUserRoutes';
import redirectTo from "@/lib/middleware/redirect";
 

export const middleware = async (request: NextRequest) => {
  const userResponse = await handleProtectedRoutes(request, protectedUserRoutes);
  if (userResponse) return userResponse;
  

  const signinResponse = await handleSignInRoutes(request, protectedLoginRoutes);
  if (signinResponse) return signinResponse;
  
  if (request.nextUrl.pathname === "/practice") return redirectTo(request, "/practice/math")

  return NextResponse.next();
};
