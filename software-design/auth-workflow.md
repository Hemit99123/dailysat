## Authentication Workflow

The authentication will be handled through a **session-based authentication service**. Specifically, we will be employing the better-auth library to abstract most of the logic required to build the authentication. This workflow is purely meant for documentation purposes as the underlying code for authentication is compeletely fulfilled by better-auth.
<br>
The code associated with this workflow is available at `/src/app/api/auth/[..all]`

### Link to Better Auth docs:
https://www.better-auth.com/docs/concepts/session-management

```mermaid
graph TD;
    A[User Requests Login] -->|Redirect to Google SSO| B[Google Authentication]
    B -->|Success: Returns Auth Code| C[Better Auth Handles Auth Code]
    C -->|Requests Token from Google| D[Google OAuth Token Service]
    D -->|Returns Access & ID Token| E[Better Auth Validates Token]
    E -->|Token Valid| F[Create User Session]
    F -->|Store Session in Database| G[Redirect User to Dashboard]
    E -->|Token Invalid| H[Redirect to Login with Error]
    G -->|User Makes Authenticated Request| I[Verify Session Middleware]
    I -->|Session Valid| J[Allow Access to Protected Resource]
    I -->|Session Expired/Invalid| K[Redirect to Login]
```