import protectedRoutes from "@/data/protected-routes/protectedLoginRoutes";
import type { NextRequest } from "next/server";
import redirectTo from "../common/redirect";
import { handleGetSession } from "@/lib/auth/authActions";

const handleSignInRoutes = async (request: NextRequest) => {
    const session = await handleGetSession();
  
    if (session && protectedRoutes.includes(request.nextUrl.pathname)) {
      return redirectTo(request, '/')
    }
  
    return null;
};
  
export default handleSignInRoutes