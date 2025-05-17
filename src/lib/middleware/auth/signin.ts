import protectedRoutes from "@/data/protected-routes/protectedLoginRoutes";
import type { NextRequest } from "next/server";
import redirectTo from "../common/redirect";
import { getSessionCookie } from "better-auth/cookies";

const handleSignInRoutes = async (request: NextRequest) => {
    const sessionCookie = await getSessionCookie(request);
  
    if (sessionCookie && protectedRoutes.includes(request.nextUrl.pathname)) {
      return redirectTo(request, '/')
    }
  
    return null;
};
  
export default handleSignInRoutes