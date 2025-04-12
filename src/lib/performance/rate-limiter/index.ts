import { handleFindRateLimitStatus } from "@/lib/performance/rate-limiter/findLimitStatus";
import { handleGetUserCached } from "@/lib/performance/cache";

const handleRateLimitedRoutes = async () => {

    const ip = '1'

    // get current status for if rate limited or not
    const isRateLimited = await handleFindRateLimitStatus(ip)

  
    if (isRateLimited) {
      return handleGetUserCached()
    }
  
    return null;
};
  
export default handleRateLimitedRoutes 