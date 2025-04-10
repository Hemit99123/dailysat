import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import handleUserRoutes from '@/lib/middleware/auth/user';
import handleSignInRoutes from './lib/middleware/auth/signin';
import handleRateLimitedRoutes from './lib/middleware/rate-limiting';

export const middleware = async (request: NextRequest) => {
  const userResponse = await handleUserRoutes(request);
  if (userResponse) return userResponse;

  const signinResponse = await handleSignInRoutes(request);
  if (signinResponse) return signinResponse;

  const rateLimitResponse = await handleRateLimitedRoutes(request);
  if (rateLimitResponse) return rateLimitResponse;

  // If none of the pre-checks match, move to the request
  return NextResponse.next();
};
