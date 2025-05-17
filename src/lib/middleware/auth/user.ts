import protectedRoutes from "@/data/protected-routes/protectedUserRoutes";
import type { NextRequest } from "next/server";
import redirectTo from "../common/redirect";
import { getSessionCookie } from "better-auth/cookies";

const handleUserRoutes = async (request: NextRequest) => {
    const sessionCookie = await getSessionCookie(request);
  
    if (!sessionCookie && protectedRoutes.includes(request.nextUrl.pathname)) {
      return redirectTo(request, '/auth/signin')
    }
  
    return null;
};
  
export default handleUserRoutes