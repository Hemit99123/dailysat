import { auth } from "@/lib/auth";
import protectedRoutes from "@/data/protected-routes/protectedUserRoutes";
import type { NextRequest } from "next/server";
import redirectTo from "../common/redirect";

const handleUserRoutes = async (request: NextRequest) => {
    const session = await auth();
  
    if (!session && protectedRoutes.includes(request.nextUrl.pathname)) {
      return redirectTo(request, '/auth/signin')
    }
  
    return null;
};
  
export default handleUserRoutes