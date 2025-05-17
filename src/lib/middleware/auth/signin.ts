import type { NextRequest } from "next/server";
import redirectTo from "../common/redirect";
import { getSessionCookie } from "better-auth/cookies";

const handleProtectedRoutes = async (request: NextRequest, protectedRoutes: any[]) => {
    const sessionCookie = await getSessionCookie(request);
  
    if (sessionCookie && protectedRoutes.includes(request.nextUrl.pathname)) {
      return redirectTo(request, '/')
    }
  
    return null;
};
  
export default handleProtectedRoutes