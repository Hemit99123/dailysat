"use client"

import { GlowingButton } from '@/components/features/Landing-Page/GlowingButton'
import { ChevronDown } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

const Home = () => {

  const router = useRouter()
  return (
    <div className="flex flex-col items-center justify-center"> {/* Adjusted padding-top to fit navbar */}
      <section className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col items-center pt-36 text-center relative px-4 md:px-6">
        <div className="absolute inset-0 w-full h-full">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-3xl" />
        </div>

        <div className="relative space-y-6">          
          <div className="flex flex-col text-3xl font-extrabold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
            <span className="text-black text-6xl">The SATs</span>
            <span className=" bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">Made Easy</span>
          </div>

          <div className="w-full">
            <GlowingButton className="w-full h-14 text-lg font-bold bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg hover:opacity-90" onClick={() => router.push("/dashboard")}>
              Explore DailySAT
            </GlowingButton>
          </div>
        </div>

        <div className="absolute bottom-24 flex flex-col items-center">
          <span className="text-sm text-gray-500 mb-2 font-medium">Scroll to explore</span>
          <div className="bg-blue-100 rounded-full p-2 animate-bounce">
            <ChevronDown className="h-6 w-6 text-blue-600" />
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
