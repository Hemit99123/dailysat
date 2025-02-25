import { auth } from "@/lib/auth";
import protectedRoutes from "@/data/protected-routes/protectedLoginRoutes";
import type { NextRequest } from "next/server";
import redirectTo from "../common/redirect";

const handleSignInRoutes = async (request: NextRequest) => {
    const session = await auth();
  
    if (session && protectedRoutes.includes(request.nextUrl.pathname)) {
      return redirectTo(request, '/')
    }
  
    return null;
};
  
export default handleSignInRoutes