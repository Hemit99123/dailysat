"use client";

import React from 'react'
import Footer from '@/components/common/Footer'
import FAQ from '@/components/features/Landing-Page/FAQ';
import Features from '@/components/features/Landing-Page/Features'
import FinalCTA from '@/components/features/Landing-Page/FinalCTA';
import Hero from '@/components/features/Landing-Page/Hero'
import Testimonials from '@/components/features/Landing-Page/Testimonials'
import Workshop from '@/components/features/Landing-Page/Workshop';

const LandingPage = () => {
  return (
    <div id="smooth-scrolling">
        <Hero />
        <div className="space-y-28 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <Features />
            <Testimonials />
            <Workshop />
            <FAQ />
            <FinalCTA />
        </div>
        <Footer />
    </div>

  )
}

export default LandingPage
