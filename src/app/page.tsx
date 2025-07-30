"use client";

import Footer from '@/components/common/Footer'
import Features from '@/components/features/Landing-Page/Features'
import Hero from '@/components/features/Landing-Page/Hero'
import Testimonials from '@/components/features/Landing-Page/Testimonials'
import Workshop from '@/components/features/Landing-Page/Workshop';
import React from 'react'

const LandingPage = () => {
  return (
    <div id="smooth-scrolling">
        <Hero />
        <div className="space-y-28 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <Features />
            <Testimonials />
            <Workshop />
        </div>
        <Footer />
    </div>

  )
}

export default LandingPage
