import {client as rateLimitClient} from "@/lib/performance/rate-limiter/redis"

export const handleAPiHits = async (ip: string) => {
     // Fetch the number of requests (hits) made by this IP from Redis
     let hits = await rateLimitClient.get(ip);

     // If no hits are found, initialize the value to 0 with an expiration time of 5 minutes
     if (hits === null) {
       rateLimitClient.set(ip, "0", "EX", 300);
       hits = "0"; // Start with 0 hits
     }
 
     // Convert the hits to a number
     const numberHits = Number(hits);

     return numberHits
}

export const handleIncreaseAPIHits = async (numberHits: number, ip: string) => {
    const newHits = numberHits + 1;
    await rateLimitClient.set(ip, newHits.toString(), "KEEPTTL");
}