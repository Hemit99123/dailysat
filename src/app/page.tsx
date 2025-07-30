import Features from '@/components/features/Landing-Page/Features'
import Hero from '@/components/features/Landing-Page/Hero'
import React from 'react'

const LandingPage = () => {
  return (
    <div id="smooth-scrolling">
        <Hero />
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Features />
        </div>
    </div>

  )
}

export default LandingPage
