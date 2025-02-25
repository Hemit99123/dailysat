'use server'
import { signIn, signOut } from "@/lib/auth";

export const handleSignIn = async () => { 
        await signIn("google", {redirectTo: "/auth/success"})
}

export const handleSignOut = async () => {
        await signOut({redirectTo: "/auth/signin"});
};
