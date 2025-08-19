"use client";

import React from "react";
import Footer from "@/components/common/Footer";
import FAQ from "@/components/features/Landing-Page/FAQ";
import Features from "@/components/features/Landing-Page/Features";
import FinalCTA from "@/components/features/Landing-Page/FinalCTA";
import Hero from "@/components/features/Landing-Page/Hero";
import Testimonials from "@/components/features/Landing-Page/Testimonials";
import Workshop from "@/components/features/Landing-Page/Workshop";
import Background from "@/components/features/Landing-Page/Background";

const LandingPage = () => {
  return (
    <div id="smooth-scrolling" className="relative font-figtree overflow-hidden">
      <Background />
      <Hero />
      <div className="space-y-28 max-w-6xl mx-auto px-0.5 lg:px-0">
        <Features />
        <Testimonials />
        <Workshop />
        <FAQ />
        <FinalCTA />
      </div>

      <Footer />
    </div>
  );
};

export default LandingPage;
