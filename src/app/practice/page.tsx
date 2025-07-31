import Link from 'next/link'
import React from 'react'

const Page = () => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md text-center space-y-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          What SAT prep would you like to do?
        </h1>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link 
            href="/practice/math"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition"
          >
            Math
          </Link>
          <Link 
            href="/practice/english"
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition"
          >
            English
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Page
