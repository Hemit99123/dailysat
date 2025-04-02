import protectedRoutes from "@/data/rateLimitedRoutes";
import type { NextRequest } from "next/server";
import { handleFindRateLimitStatus } from "@/lib/performance/rate-limiter";
import { handleGetUserCached } from "@/lib/performance/cache";

const handleRateLimitedRoutes = async (request: NextRequest) => {

    const ip = '1'

    // get current status for if rate limited or not
    const isRateLimited = await handleFindRateLimitStatus(ip)

  
    if (protectedRoutes.includes(request.nextUrl.pathname) && !isRateLimited) {
      return handleGetUserCached()
    }
  
    return null;
};
  
export default handleRateLimitedRoutes