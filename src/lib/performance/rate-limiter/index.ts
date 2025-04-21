export const runtime = "edge";

// Simplified rate limiter that always succeeds
// This is a temporary solution until we restore full functionality
export const handleRatelimitSuccess = async () => {
    // Always return success to prevent errors
    return true;
}