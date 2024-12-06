import { cookies } from 'next/headers';
import redis from './redis';

const getSessionIDCookie = async (): Promise<string | undefined> => {
    // we use the session id to find it within the redis db (the stored session)
    const cookieStore = await cookies();
    return cookieStore.get("session-id")?.value;
};

const createSessionIDCookie = async (): Promise<string> => {
    // create a sessionID and store it in cookie
    // this sessionID will be used to store in redis
    const newSessionId = crypto.randomUUID();
    const cookieStore = await cookies();
    cookieStore.set("session-id", newSessionId);

    return newSessionId
};

export const getSession = async (): Promise<boolean> => {
    const sessionId = await getSessionIDCookie();
    if (!sessionId) {
        return false; // Return false if no sessionId
    }

    const session = await redis.get(`session-${sessionId}`);
    return session !== null; // Return true if session exists, false if it doesn't
};


export const setSession = async (email: string): Promise<boolean> => {
    const sessionId = await createSessionIDCookie();

    // creating the session into the redis database
    await redis.set(`session-${sessionId}`, {email: email });
    await redis.expire(`session-${sessionId}`, 604800); // the session being expired in a week (in seconds)
 
    return true;
};
