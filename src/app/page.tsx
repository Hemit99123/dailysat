"use client"

import { Badge } from '@/components/common/Badge'
import { Button } from '@/components/common/Button'
import { Card, CardContent } from '@/components/common/Card'
import NavBar from '@/components/common/NavBar'
import { FeatureCard3D } from '@/components/features/Landing-Page/FeatureCard3D'
import { GlowingButton } from '@/components/features/Landing-Page/GlowingButton'
import Header from '@/components/features/Landing-Page/Header'
import { ReviewCarousel } from '@/components/features/Landing-Page/ReviewCarousel'
import { ScoreBarGraph } from '@/components/features/Landing-Page/ScoreChart'
import { StatsCounter } from '@/components/features/Landing-Page/StatsCounter'
import { WorkshopCard } from '@/components/features/Landing-Page/WorkshopCard'
import { motion } from 'framer-motion'
import { Award, BookCheck, CheckCircle, ChevronDown, Rocket, Target } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

const Home = () => {

  const router = useRouter()

  const handleRedirectToDashboard = () => {
    router.push("/dashboard")
  }
  
  return (
     <div className="flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-white to-purple-100"> {/* Adjusted padding-top to fit navbar */}
      <div >
      <NavBar />

      </div>
      <section className="w-full min-h-screen flex flex-col items-center pt-36 text-center relative px-4 md:px-6">
        {/* the colorful ball over the content */}
        <div className='absolute inset-0 w-full h-full'>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-3xl" />
          <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] bg-purple-400/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] bg-green-400/20 rounded-full blur-3xl" />
        </div>


        <div className="relative space-y-6">          
          <div className="flex flex-col text-3xl font-extrabold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
            <span className="text-black text-6xl">The SATs</span>
            <span className=" bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">Made Easy</span>
          </div>

          <div className="w-full">
            <GlowingButton className="w-full h-14 text-lg font-bold bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg hover:opacity-90" onClick={handleRedirectToDashboard}>
              Explore DailySAT
            </GlowingButton>
          </div>
        </div>

        <div className="absolute bottom-24 flex flex-col items-center">
          <span className="text-sm text-gray-500 mb-2 font-medium">Scroll to explore</span>
          <div className="bg-blue-100 rounded-full p-2 animate-bounce">
            <ChevronDown className="h-6 w-6 text-blue-600" />
          </div>
        </div>
      </section>

          {/* Why Us Section */}
      <section className="flex flex-col justify-center items-center w-full py-20 md:py-32 bg-white relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-40 to-transparent" />

        <div className="container px-4 md:px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center space-y-4 text-center mb-16"
          >
              <Header 
                badgeText='Why Choose Us'
                text='The Ultimate'
                gradientText='SAT Preparation Resource'
                description='Our mission is to empower students to achieve their best scores by providing an interactive, personalized, and efficient study experience.'
              />
          </motion.div>

          {/* Why Us Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <FeatureCard3D
                icon={<BookCheck className="h-6 w-6 text-blue-600" />}
                title="Comprehensive Question Bank"
                description="Access 3,500+ questions covering all SAT topics and difficulty levels."
                color="blue"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <FeatureCard3D
                icon={<Target className="h-6 w-6 text-purple-600" />}
                title="Personalized Learning"
                description="Adaptive practice that focuses on your specific areas for improvement."
                color="purple"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <FeatureCard3D
                icon={<Award className="h-6 w-6 text-green-600" />}
                title="Proven Results"
                description="Our students consistently achieve 1550+ scores on their SAT exams."
                color="green"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <FeatureCard3D
                icon={<Rocket className="h-6 w-6 text-orange-600" />}
                title="Stress-Free Environment"
                description="Practice at your own pace in a supportive, no-pressure learning space."
                color="orange"
              />
            </motion.div>
          </div>
        </div>
      </section>

          {/* Score Improvement Section */}
      <section className="flex justify-center w-full py-20 md:py-32 bg-gradient-to-br from-blue-50 to-indigo-50  relative overflow-hidden">
        <div className="container px-4 md:px-6 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <Badge className="px-3 py-1 bg-indigo-100 text-indigo-700 border-indigo-200 rounded-full">Results</Badge>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                <span className="bg-gradient-to-r from-indigo-500 to-blue-500 bg-clip-text text-transparent">
                  Boost your SAT score
                </span>
              </h2>
              <p className="text-gray-500 md:text-xl">
                Our students see an average improvement of 150+ points after completing our comprehensive practice
                program.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1 bg-green-100 p-1 rounded-full">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Personalized Practice</h3>
                    <p className="text-sm text-gray-500">Adaptive tests that focus on your weak areas</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-1 bg-green-100 p-1 rounded-full">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Detailed Analytics</h3>
                    <p className="text-sm text-gray-500">Track your progress and identify improvement areas</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-1 bg-green-100 p-1 rounded-full">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Expert Strategies</h3>
                    <p className="text-sm text-gray-500">Learn proven techniques from 1500+ scorers</p>
                  </div>
                </div>
              </div>

              <Button className="mt-6" size="lg" onClick={handleRedirectToDashboard}>
                Start Your Journey
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-3xl blur-3xl opacity-20" />
              <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-xl rounded-3xl overflow-hidden">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-6">Average Score Improvement</h3>
                  <div className="h-80">
                    <ScoreBarGraph />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="flex justify-center w-full py-16 bg-white border-t border-b border-gray-300">
        <div className="container px-4 md:px-6 ">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16">
            <StatsCounter value={80000} label="Visitors Worldwide" />
            <StatsCounter value={3500} label="Practice Questions" />
            <StatsCounter value={95} label="Success Rate" suffix="%" />
          </div>
        </div>
      </section>


      {/* Workshops Section */}
      <section className="flex justify-center w-full bg-white py-20 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />

        <div className="container px-4 md:px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center space-y-4 text-center mb-16"
          >
            <Header 
              badgeText='Workshops'
              text='Learning Together,'
              gradientText='Growing Together'
              description='We love educating, sharing, and learning! We encourage students to work together and bring eachother up as they prepare for this rigorous exam. By insituting numerous workshops, we cultivate a postive and supported environment.'
            />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <WorkshopCard
                image="https://images.unsplash.com/photo-1580519542036-c47de6196ba5?q=80&w=2942&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                title="Post-Secondary Education and Finances"
                partner="DailySAT x StockSavvy"
                attendees="60+"
                description="Hosted a workshop on post-secondary education and finances, helping students understand the financial aspects of college planning."
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <WorkshopCard
                image="https://plus.unsplash.com/premium_photo-1688700437975-0ea63cfa59e1?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                title="Broadcasting and Content Development"
                partner="DailySAT x FTN Broadcasting"
                attendees="1000+"
                description="Collaborated with a broadcasting network with in-house content developments to reach a wider audience of students preparing for the SAT."
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section with Infinite Carousel */}
      <section className="flex justify-center items-center w-full py-20 md:py-32 bg-gradient-to-br from-indigo-50 to-blue-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />

        <div className="container px-4 md:px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center space-y-4 text-center mb-16"
          >
            <Header 
              badgeText='Testimonials'
              text='What our Students Say'
              description='Header from students who have imporved their SAT scores with DailySAT.'
            />
          </motion.div>

          {/* Multi-row Infinite Carousel */}
          <ReviewCarousel />
        </div>
      </section>

            {/* CTA Section */}
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
              badgeText='Ready?'
              text='Convinced yet?'
              gradientText='Boost your SAT score!'
              description='Join thousands of students who have improved thier SAT scores with DailySAT. '
            
            />
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <GlowingButton className="w-44 mt-3" onClick={handleRedirectToDashboard}>Start your journey</GlowingButton>
            </div>
          </motion.div>
        </div>
      </section>

            {/* Footer */}
      <footer className="flex justify-center items-center w-full border-t bg-white py-12">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4 px-4 md:px-6">
          <div className="flex items-center gap-2">
            <div className="font-bold text-xl bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              DailySAT
            </div>
          </div>
          <div className="text-xs text-gray-500">© 2025 DailySAT. All rights reserved.</div>
        </div>
      </footer>
    </div>
  )
}

export default Home
