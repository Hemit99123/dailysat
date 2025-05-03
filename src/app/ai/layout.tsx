"use client"

import { Toaster } from "react-hot-toast"

export default function AILayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Toaster position="top-right" />
      {children}
    </>
  )
} 