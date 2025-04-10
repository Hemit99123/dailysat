import {client as rateLimitClient} from "@/lib/performance/rate-limiter/redis"

export const handleFindRateLimitStatus = async (ip: string) => {
  // Check if the key exists
  let tokens: string | number | null = await rateLimitClient.get(ip);

  if (tokens === null) {
      // If key does not exist, initialize it with 4 tokens and set expiry for 5 minutes
      await rateLimitClient.set(ip, "4", "EX", 300); // 300 seconds = 5 minutes
      return false; // Not rate-limited since it's the first request
  }

  tokens = Number(tokens);

  if (tokens >= 3) {
      const oneTokenLess = tokens - 1;
      await rateLimitClient.set(ip, oneTokenLess.toString());
      return true; // Rate limited
  }

  return false; // Not rate-limited
};
