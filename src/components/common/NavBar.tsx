"use client"

import Link from "next/link"
import { motion, useScroll, useTransform } from "framer-motion"
import { cn } from "@/lib/utils"
import { menuItems } from "@/data/navbar"
import { determineAuthStatus } from "@/lib/auth/authStatus"
import { useEffect, useState } from "react"
import { handleSignIn, handleSignOut } from "@/lib/auth/authAction"

const NavBar = () => {
  const { scrollY } = useScroll()

  const y = useTransform(scrollY, [0, 100], [0, -50])
  const opacity = useTransform(scrollY, [0, 100], [1, 0])
  const [auth, setAuth] = useState(false)

  useEffect(() => {

    const handleAuthStatus = async () => {
      const auth = await determineAuthStatus()
      setAuth(auth)
    }

    handleAuthStatus()
  }, [])


  return (
    <motion.div
      style={{ y, opacity }}
      className={cn(
        "top-0 left-0 right-0 z-50 mx-auto max-w-7xl px-4 py-4 mb-10 mt-2",
      )}
    >
      <nav className="flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-blue-600">
          DailySAT
        </Link>
        <div className="hidden md:flex items-center space-x-8">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={auth ? handleSignOut: handleSignIn}
            className="rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            {auth ? "Log out": "Sign in"}
          </button>
        </div>
      </nav>
    </motion.div>
  )
} 

export default NavBar