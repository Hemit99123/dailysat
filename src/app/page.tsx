import { GlowingButton } from '@/components/features/Landing-Page/GlowingButton'
import { ArrowRight, ChevronDown } from 'lucide-react'
import React from 'react'

const Home = () => {
  return (
    <section className="w-full mt-28 overflow-hidden bg-gradient-to-br  flex items-center justify-center">
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-3xl" />
      </div>

      <div className="relative px-4 md:px-6 flex flex-col items-center justify-center text-center">
        <div className="flex flex-col items-center justify-center space-y-4 mb-8">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-blue-100 px-3 py-1 text-sm text-blue-700 backdrop-blur-md border border-blue-200">
              3,500+ Practice Questions <ArrowRight className="inline h-4 w-4 ml-1" />
            </div>
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
              <h3>SAT Prep</h3>
              <div className="relative">
                <h1 className="block bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent text-5xl sm:text-6xl md:text-7xl lg:text-8xl mt-2">
                  Made Easy
                </h1>
                <div className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full" />
              </div>
            </h1>
          </div>
          <div className="w-full max-w-sm space-y-2">
            <GlowingButton className="w-full h-12 text-lg font-bold">Start Practicing Now</GlowingButton>
          </div>
        </div>
      </div>

      <div
        className="absolute bottom-8 left-0 right-0 flex flex-col items-center justify-center text-center cursor-pointer"
      >
            <span className="text-sm text-gray-500 mb-2 font-medium">Scroll to explore</span>
            <div
              className="bg-blue-100 rounded-full p-2"
            >
              <ChevronDown className="h-6 w-6 text-blue-600" />
            </div>
      </div>
    </section>
  )
}

export default Home
