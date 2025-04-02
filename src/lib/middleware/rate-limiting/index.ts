import protectedRoutes from "@/data/rateLimitedRoutes";
import type { NextRequest } from "next/server";
import redirectTo from "../common/redirect";
import { handleFindRateLimitStatus } from "@/lib/performance/rate-limiter";
import { handleGetUser } from "@/lib/auth/getUser";
import { handleGetUserCached } from "@/lib/performance/cache";

const handleRateLimitedRoutes = async (request: NextRequest) => {

    let ip = '1'

    // get current status for if rate limited or not
    const isRateLimited = await handleFindRateLimitStatus(ip)

  
    if (protectedRoutes.includes(request.nextUrl.pathname) && !isRateLimited) {
      return handleGetUserCached()
    }
  
    return null;
};
  
export default handleRateLimitedRoutes