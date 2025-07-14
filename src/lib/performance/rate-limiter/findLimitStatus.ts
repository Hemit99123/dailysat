import { client } from "@/lib/performance/rate-limiter/redis"

export const handleFindRateLimitStatus = async (email: string | undefined) => {

  if (!email) {
    return false
  }

  // Check if the key exists
  let tokens: string | number | null = await client.get(email);

  if (tokens === null) {
      // If key does not exist, initialize it with 4 tokens and set expiry for 5 minutes
      await client.set(email, 4, { ex: 300 });
      return false; // Not rate-limited since it's the first request
  }

  tokens = Number(tokens);
  console.log(tokens)

  if (tokens > 0) {
      await client.decr(email); // safe operation, keeps expiry
      return false; // Not rate limited
  }

  return true; // Rate limited, use cache
};
