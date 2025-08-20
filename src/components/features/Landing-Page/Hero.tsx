import React from 'react';
import { motion } from 'framer-motion';
import ArrowSvg from '@/components/common/icons/ArrowSVG';
import Link from 'next/link';

const Hero = () => {
  return (
    <div className="relative w-screen h-[calc(100vh-5rem)] flex flex-col items-center justify-center text-center text-blue-900 font-figtree overflow-hidden">
      {/* Foreground content */}
      <motion.div
        className="relative z-10 flex items-center text-sm border border-gray-200 bg-white/70 backdrop-blur-sm shadow-sm px-3 py-1 rounded-full text-gray-800 mb-3"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <div className="bg-blue-500 text-white rounded-full px-2 py-0.5 font-medium shadow">
          💡 Tip
        </div>
        <span className="ml-2 leading-tight font-medium">
          Practice daily. Score higher.
        </span>
      </motion.div>

      <motion.h1
        className="relative z-10 text-[45px] sm:text-[70px] font-[600] leading-[1.1em] tracking-[-0.055em]"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        viewport={{ once: true }}
      >
        SATs Preparation Made
      </motion.h1>
      <motion.h1
        className="relative z-10 text-[45px] sm:text-[70px] font-[600] leading-[1.1em] tracking-[-0.055em]"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true }}
      >
        Simple and Effective.
      </motion.h1>

      <motion.div
        className="relative z-10 text-lg text-gray-700 p-4 max-w-xl"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        viewport={{ once: true }}
      >
        DailySAT is your go-to source. It is made for anyone, anywhere, anytime!
      </motion.div>

      <motion.div
        className="relative z-10 flex items-center space-x-2"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        viewport={{ once: true }}
      >
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
      </motion.div>
    </div>
  );
};

export default Hero;
