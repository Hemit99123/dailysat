import protectedRoutes from "@/data/protected-routes/protectedUserRoutes";
import type { NextRequest } from "next/server";
import redirectTo from "../common/redirect";
import { handleGetSession } from "@/lib/auth/authActions";

const handleUserRoutes = async (request: NextRequest) => {
    const session = await handleGetSession();
  
    if (!session && protectedRoutes.includes(request.nextUrl.pathname)) {
      return redirectTo(request, '/auth/signin')
    }
  
    return null;
};
  
export default handleUserRoutes