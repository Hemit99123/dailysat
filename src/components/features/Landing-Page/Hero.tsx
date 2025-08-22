import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ArrowSvg from '@/components/common/icons/ArrowSVG';
import Link from 'next/link';
import { init } from 'next/dist/compiled/webpack/webpack';
import { initialize } from 'next/dist/server/lib/render-server';

const Hero = () => {
  const slides = [
    {
      text: "a 1500+ warrior",
      img: '/doodles/1500-warrior.png',
      alt: 'A person reaching for 1600 sat score',
      pos: "right-[10px] top-[10px]",
      initialRot: -0.3 * 180 / Math.PI,
      finalRot: 0.2 * 180 / Math.PI,
      side: 'right',
    },
    {
      text: 'procrastinating starting studying',
      img: '/doodles/procrastinating-starting-studying.png',
      alt: 'Student distracted by phone instead of studying',
      pos: "left-[30px] top-[30px]",
      initialRot: 0.1 * 180 / Math.PI,
      finalRot: -0.2 * 180 / Math.PI,
      side: 'left',
    },
    {
      text: "not getting SAT math",
      img: '/doodles/cant-get-a-grip-on-sat-math.png',
      alt: 'Student overwhelmed by math problems',
      pos: "right-[10px] top-[10px]",
      initialRot: -0.3 * 180 / Math.PI,
      finalRot: 0 * 180 / Math.PI,
      side: 'right',
    },
    {
      text: "dying on reading and writing",
      img: '/doodles/struggling-sat-english.png',
      alt: 'Student overwhelmed by reading and writing problems',
      pos: "left-[10px] top-1/5",
      initialRot: 0.1 * 180 / Math.PI,
      finalRot: -0.2 * 180 / Math.PI,
      side: 'left',
    }
  ];
  const [index, setIndex] = useState(0);
  const [showMask, setShowMask] = useState(false);

  useEffect(() => {
    const interval = setInterval(
      () => setIndex((i) => (i + 1) % slides.length),
      4000
    );
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const check = () => setShowMask((window.innerWidth || 0) >= 768);
    // initialize and listen for resizes
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
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
        SAT Preparation Made
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
      ><span>Whether you're </span>
        <span
          className="relative inline-flex w-80 h-[2em] items-center justify-center overflow-hidden bg-white/20 border border-white/40 backdrop-blur-md shadow-lg rounded-md px-4 mx-1"
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={slides[index].text}
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '-100%', opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="block w-full text-center"
            >
              {slides[index].text}
            </motion.span>
          </AnimatePresence>
        </span>
        <span>, we've got you with a plan, motivation, support, and results.</span>
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.img
          key={slides[index].img}
          src={slides[index].img}
          alt={slides[index].alt}
          initial={{ scale: 0.9, opacity: 0, rotate: slides[index].initialRot }}
          animate={{ scale: 1, opacity: 0.27, rotate: slides[index].finalRot }}
          exit={{ scale: 0.9, opacity: 0, rotate: slides[index].initialRot}}
          transition={{ duration: 0.5 }}
          style={
            showMask
              ? {
                  WebkitMaskImage:
                    (slides[index].side == "right")
                      ? 'radial-gradient(circle at 50vw 50vh, rgba(0,0,0,1) 0%, rgba(0,0,0,0.6) 35%, rgba(0,0,0,0) 70%)'
                      : 'radial-gradient(circle at 0vw 50vh, rgba(0,0,0,1) 0%, rgba(0,0,0,0.6) 35%, rgba(0,0,0,0) 70%)',
                  maskImage:
                    (slides[index].side == "right")
                      ? 'radial-gradient(circle at 50vw 50vh, rgba(0,0,0,1) 0%, rgba(0,0,0,0.6) 35%, rgba(0,0,0,0) 70%)'
                      : 'radial-gradient(circle at 0vw 50vh, rgba(0,0,0,1) 0%, rgba(0,0,0,0.6) 35%, rgba(0,0,0,0) 70%)',
                  WebkitMaskRepeat: 'no-repeat',
                  maskRepeat: 'no-repeat',
                }
              : {}
          }
          className={"absolute " + slides[index].pos + " z-0 w-[600px] h-auto"}
        />
      </AnimatePresence>
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
          Start Your Journey
          <ArrowSvg
            className="w-4 h-4 ml-2 transition-transform duration-300 -rotate-45 group-hover:rotate-0"
            stroke="white"
          />
        </Link>

        <Link
          href="/#how-it-works"
          className="text-sm border border-gray-600 text-black py-2 px-4 rounded-lg flex items-center group"
        >
          See How It Works
        </Link>
      </motion.div>
    </div>
  );
};

export default Hero;
