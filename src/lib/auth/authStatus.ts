"use server"

import { headers } from "next/headers"
import { auth } from "."

export const determineAuthStatus = async () => {
    const session = await auth.api.getSession({
        headers: await headers() // you need to pass the headers object.
    })

    return session !== null
}