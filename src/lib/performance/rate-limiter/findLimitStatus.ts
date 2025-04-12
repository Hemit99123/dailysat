import { client } from "@/lib/performance/rate-limiter/redis"

export const handleFindRateLimitStatus = async (ip: string) => {
  // Check if the key exists
  let tokens: string | number | null = await client.get(ip);

  if (tokens === null) {
      // If key does not exist, initialize it with 4 tokens and set expiry for 5 minutes
      await client.set(ip, 4, { ex: 300 });
      return false; // Not rate-limited since it's the first request
  }

  tokens = Number(tokens);

  if (tokens > 0) {
      await client.decr(ip); // safe operation, keeps expiry
      return false; // Not rate limited
  }

  return true;
};
