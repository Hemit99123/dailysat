"use server"

import { auth } from "@/lib/auth"

export const determineAuthStatus = async () => {

    // Gets the current session of the user
    const session = await auth()

    if (session) {
            return true
    } else {
            return false
    }
}