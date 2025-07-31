import ArrowSvg from '@/components/common/icons/ArrowSVG'
import { motion } from 'framer-motion'
import Link from 'next/link'
import React from 'react'
import Header from './Header'

const FinalCTA = () => {
  return (
      <section className=" flex justify-center items-center w-full py-20 md:py-32 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />

        <div className="container px-4 md:px-6 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center"
          >
            <Header
              badgeText="Let's go 🚀"
              text="Convinced yet?"
              gradientText="Start now!"
              description="Join hundreds of students who have improved their SAT scores with DailySAT. "
            />
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/practice/math"
                aria-label="Start your math practice"
                className="
                  group inline-flex items-center gap-2
                  rounded-xl px-5 py-3 text-base font-semibold
                  text-white
                  bg-gradient-to-br from-blue-400 to-indigo-300
                  shadow-md shadow-blue-500/20
                  transition-all duration-200
                  hover:shadow-lg hover:shadow-blue-500/30 hover:brightness-110
                  mt-4
                "
              >
                <span className="flex text-center">Start your journey</span>
                <ArrowSvg
                  className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                  stroke="currentColor"
                />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
  )
}

export default FinalCTA
