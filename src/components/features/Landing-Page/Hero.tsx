import ArrowSvg from '@/components/common/icons/ArrowSVG';
import Link from 'next/link';
import React from 'react';

const Hero = () => {
  return (
    <div className="w-screen h-[calc(100vh-10rem)] flex flex-col items-center justify-center text-center text-blue-800 font-figtree">
    <div className="flex items-center text-sm border border-gray-200 bg-white/70 backdrop-blur-sm shadow-sm px-3 py-1 rounded-full text-gray-800 mb-3">
    <div className="bg-blue-500 text-white rounded-full px-2 py-0.5 font-medium shadow">
        💡 Tip
    </div>
    <span className="ml-2 leading-tight font-medium">
        Practice daily. Score higher.
    </span>
    </div>
      <h1 className="text-[45px] sm:text-[70px] font-[600] leading-[1.1em] tracking-[-0.055em]">
        The SATs Preparation Made
      </h1>
      <h1 className="text-[45px] sm:text-[70px] font-[600] leading-[1.1em] tracking-[-0.055em]">
        Simple and Effective.
      </h1>
      <div className="text-lg text-gray-700 p-4">
        DailySAT is your go-to source. It is made for anyone, anywhere, anytime!
      </div>

      <div className="flex items-center space-x-2">
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
