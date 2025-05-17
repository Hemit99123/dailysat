"use server"

import { headers } from "next/headers"
import { auth } from "."

export const handleSignIn = async () => {
    await auth.api.signInSocial({
        body: {
            provider: "google", 
        }
    })
}

export const handleSignOut = async () => {
    await auth.api.signOut({
        headers: []
    })
}

export const handleGetSession = async () => {
    return await auth.api.getSession({
        headers: await headers() // you need to pass the headers object.
    })
}