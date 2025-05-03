// Mock auth implementation
// This is a temporary solution until NextAuth is properly set up

// Mock user session with expanded fields to match dashboard requirements
export const mockSession = {
  user: {
    id: "mock-user-id",
    _id: "mock-user-id-123456",  // Added for referral ID display
    name: "Mock User",
    username: "mockuser",        // Added for username display
    email: "user@example.com",
    image: "https://via.placeholder.com/150",
    isReferred: false,
    createdAt: new Date(2023, 5, 15).toISOString(),  // June 15, 2023
    currency: 500,
    correctAnswered: 75,
    wrongAnswered: 25,
    plan: "free"
  },
  expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
};

import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import type { NextAuthOptions, Session, User as NextAuthUser } from "next-auth";
import type { JWT } from "next-auth/jwt";

// Export the NextAuth configuration for use in middleware
export const authOptions: NextAuthOptions = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  callbacks: {
    async session({ session, token }: { session: Session, token: JWT }) {
      // Only use data available in token and initial session
      if (token.sub && session.user) {
        session.user.id = token.sub; // Use the provider's subject ID as the primary ID in session
        
        // Assign basic info from token if available
        // Ensure these fields exist on the session.user type or use type assertion
        (session.user as any)._id = token.sub; // Match the original pattern for now, potentially revise later
        session.user.name = token.name ?? session.user.name;
        session.user.email = token.email ?? session.user.email;
        session.user.image = token.picture ?? session.user.image;

        // Add other fields from token if needed, or default values
        // DO NOT call handleGetUser here
        // (session.user as any).username = token.username ?? session.user.name?.split(' ')[0].toLowerCase() ?? 'user'; 
        // (session.user as any).currency = token.currency ?? 500; 
        // ... etc. - Add only if these values are reliably in the JWT token, otherwise leave them out
        
      }
      return session;
    },
    async jwt({ token, user }: { token: JWT, user?: NextAuthUser }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,
};

// Export the NextAuth handlers for API routes
export const { handlers, signIn, signOut, auth } = NextAuth(authOptions);

// For backward compatibility
export const getServerSession = auth;

// Mock function to check if user is authenticated
export const isAuthenticated = async () => {
  return true; // Always return true for mock implementation
}; 