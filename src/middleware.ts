import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import handleProtectedRoutes from './lib/middleware/auth/protectedRoute';
import protectedLoginRoutes from './data/protected-routes/protectedLoginRoutes';
import protectedUserRoutes from './data/protected-routes/protectedUserRoutes';

export const middleware = async (request: NextRequest) => {
  const userResponse = await handleProtectedRoutes(request, protectedUserRoutes);
  if (userResponse) return userResponse;
  

  const signinResponse = await handleProtectedRoutes(request, protectedLoginRoutes);
  if (signinResponse) return signinResponse;
  

  return NextResponse.next();
};
