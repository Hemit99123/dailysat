## 📊 User Data Cache Worflow

The user data is limited to avoid abuse by users on `/dashboard`. It is cached by Redis once rate limit reached to keep data filled. 
<br >
The current algorithm that is employed is the Token Bucket algorithm (basic), look at diagram to understand how it is implemented in DailySAT.
<br >
The code associated to this workflow is implemented on `/src/app/api/auth/get-user/route.ts`

```mermaid
flowchart 
    Start["Start"] --> ReceiveRequest["Receive Request from Middleware"]
    ReceiveRequest --> CheckTokenAvailability{"Does Token Exist in Redis?"}
    CheckTokenAvailability -- No --> RejectRequest["Reject Request"]
    CheckTokenAvailability -- Yes --> ConsumeToken["Decrement Token Count"]
    ConsumeToken --> ProcessRequest["Process Request"]
    ProcessRequest --> End["End"]
    RejectRequest --> CachedData["Use cached data to fill user info (outdated)"]
    CachedData --> End
    subgraph Redis["Redis Auto-Expiration"]
        SetToken["Token Stored with TTL"] --> AutoDelete["Redis Auto-Deletes Token after TTL"]
    end
```