import ArrowSvg from '@/components/common/icons/ArrowSVG';
import Link from 'next/link';
import React from 'react';

const Hero = () => {
  return (
    <div className="relative w-screen h-[calc(100vh-10rem)] flex flex-col items-center justify-center text-center text-blue-900 font-figtree overflow-hidden">
      {/* Background blobs */}
      <div
        className="absolute top-10 left-10 w-72 h-72 rounded-full bg-blue-300 opacity-30 filter blur-3xl animate-blob"
        style={{ animationDelay: '0s' }}
      />
      <div
        className="absolute bottom-20 right-20 w-80 h-80 rounded-full bg-indigo-300 opacity-20 filter blur-3xl animate-blob"
        style={{ animationDelay: '2s' }}
      />
      <div
        className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full bg-purple-300 opacity-25 filter blur-2xl animate-blob"
        style={{ animationDelay: '4s' }}
      />

      {/* Foreground content */}
      <div className="relative z-10 flex items-center text-sm border border-gray-200 bg-white/70 backdrop-blur-sm shadow-sm px-3 py-1 rounded-full text-gray-800 mb-3">
        <div className="bg-blue-500 text-white rounded-full px-2 py-0.5 font-medium shadow">
          💡 Tip
        </div>
        <span className="ml-2 leading-tight font-medium">
          Practice daily. Score higher.
        </span>
      </div>

      <h1 className="relative z-10 text-[45px] sm:text-[70px] font-[600] leading-[1.1em] tracking-[-0.055em]">
        The SATs Preparation Made
      </h1>
      <h1 className="relative z-10 text-[45px] sm:text-[70px] font-[600] leading-[1.1em] tracking-[-0.055em]">
        Simple and Effective.
      </h1>
      <div className="relative z-10 text-lg text-gray-700 p-4 max-w-xl">
        DailySAT is your go-to source. It is made for anyone, anywhere, anytime!
      </div>

      <div className="relative z-10 flex items-center space-x-2">
        <Link
          href="/dashboard"
          className="text-sm bg-blue-500 text-white py-2 px-4 rounded-lg flex items-center group"
        >
          Dashboard
          <ArrowSvg
            className="w-4 h-4 ml-2 transition-transform duration-300 -rotate-45 group-hover:rotate-0"
            stroke="white"
          />
        </Link>

        <Link
          href="/team"
          className="text-sm border border-gray-600 text-black py-2 px-4 rounded-lg flex items-center group"
        >
          View our team
        </Link>
      </div>
    </div>
  );
};

export default Hero;
