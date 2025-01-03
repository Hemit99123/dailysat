"use server"

import {auth} from "@/auth"

export const determineAuthStatus = async () => {

        // Gets the current session of the user
    const session = await auth()

    if (session) {
            return true
    } else {
            return false
    }
}