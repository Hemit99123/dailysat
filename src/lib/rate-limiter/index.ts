export const runtime = "edge";

import { Ratelimit } from "@upstash/ratelimit";
import { client } from "../redis";

const ratelimit = new Ratelimit({
  redis: client,
  limiter: Ratelimit.tokenBucket(30, "5 m", 30),
});

/* eslint-disable  @typescript-eslint/no-explicit-any */
export const handleRatelimitSuccess = async (session: any | null) => {
  const email = session?.user?.email;

  const { success } = await ratelimit.limit(email as string);
  return success ? "not-reached" : "reached";
};
