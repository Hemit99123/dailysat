import ArrowSvg from '@/components/common/icons/ArrowSVG'
import Link from 'next/link'
import React from 'react'

const FinalCTA = () => {
  return (
    <div className="bg-gradient-to-r from-blue-200 via-blue-300 to-blue-400 text-white p-10 rounded-2xl text-center">
      <h1 className="text-4xl md:text-5xl font-bold">
        What are you waiting for? Get started!
      </h1>
      <p className="mt-4 text-white text-lg">
        Start practicing with our comprehensive database of SAT questions
      </p>
      <div className="mt-6 flex justify-center">
        <Link 
          href="/practice/math"
          className="flex items-center bg-blue-200 text-black px-4 py-2 rounded-md font-medium transition-all"
        >
          Start <ArrowSvg className="w-4 h-4 ml-2" stroke="black" />
        </Link>
      </div>
    </div>
  )
}

export default FinalCTA
