"use client"

import NavBar from '@/components/common/NavBar'
import { GlowingButton } from '@/components/features/Landing-Page/GlowingButton'
import { StatsCounter } from '@/components/features/Landing-Page/StatsCounter'
import { ChevronDown } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

const Home = () => {

  const router = useRouter()
  return (
     <div className="flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-white to-purple-100"> {/* Adjusted padding-top to fit navbar */}
      <div className='w-screen'>
      <NavBar />

      </div>
      <section className="w-full min-h-screen flex flex-col items-center pt-36 text-center relative px-4 md:px-6">
        {/* the colorful ball over the content */}
        <div className='absolute inset-0 w-full h-full'>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-3xl" />
          <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] bg-purple-400/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] bg-green-400/20 rounded-full blur-3xl" />
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
      {/* Stats Section */}
      <section className="flex justify-center w-full py-16 bg-white border-y border-gray-100">
        <div className="container px-4 md:px-6 ">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16">
            <StatsCounter value={80000} label="Users Worldwide" />
            <StatsCounter value={3500} label="Practice Questions" />
            <StatsCounter value={95} label="Success Rate" suffix="%" />
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
