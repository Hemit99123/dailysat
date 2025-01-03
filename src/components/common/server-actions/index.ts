'use server'
import { signOut, signIn } from "@/auth";

export const handleSignIn = async () => { 
        await signIn("google")
}

export const handleSignOut = async () => {
        // Sign out the user
        await signOut({redirectTo: "/unauthorized"});
};
