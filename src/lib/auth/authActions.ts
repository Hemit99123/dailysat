"use server"

import { headers } from "next/headers"
import { auth } from "."

export const handleGetSession = async () => {
    return await auth.api.getSession({
        headers: await headers() // you need to pass the headers object.
    })
}