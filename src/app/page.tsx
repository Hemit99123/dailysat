import { GlowingButton } from '@/components/features/Landing-Page/GlowingButton'
import { ArrowRight, ChevronDown } from 'lucide-react'
import React from 'react'

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center"> {/* Adjusted padding-top to fit navbar */}
      <section className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col items-center pt-32 text-center relative px-4 md:px-6">
        <div className="absolute inset-0 w-full h-full">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-3xl" />
        </div>

        <div className="relative space-y-6">
          <div className="inline-block rounded-lg bg-blue-100 px-3 py-1 text-sm text-blue-700 backdrop-blur-md border border-blue-200">
            3,500+ Practice Questions <ArrowRight className="inline h-4 w-4 ml-1" />
          </div>
          
          <div className="flex flex-col text-3xl font-extrabold tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl">
            <span className="text-black text-6xl">SAT Prep</span>
            <span className=" bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">Made Easy</span>
          </div>

          <div className="w-full">
            <GlowingButton className="w-full h-14 text-lg font-bold bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg hover:opacity-90">
              Start Practicing Now
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
