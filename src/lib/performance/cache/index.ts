import { auth } from "@/lib/auth";
import { handleGetUser } from "@/lib/auth/getUser";

// Simplified cache implementation that just calls the user retrieval directly
// This is a temporary solution until we restore full Redis caching functionality
export const handleGetUserCached = async () => {
    const session = await auth();
    
    if (!session?.user?.email) {
        // Return a default user object if no session
        return {
            _id: "default_user_id",
            email: "user@example.com",
            name: "User",
            image: "https://via.placeholder.com/150",
            isReferred: false,
            currency: 0,
            correctAnswered: 0,
            wrongAnswered: 0,
            createdAt: new Date().toISOString(),
            username: "user"
        };
    }
    
    // Just use the direct user retrieval function
    return handleGetUser(session);
};