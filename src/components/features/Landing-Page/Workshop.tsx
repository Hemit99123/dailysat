import React from 'react'
import { motion } from 'motion/react'
import Header from './Header'
import { WorkshopCard } from './WorkshopCard'

const Workshop = () => {
  return (
    <div>
      <Header
        badgeText="Workshops"
        text="Learning,"
        gradientText="Growing together."
        description="We love educating, sharing, and learning! The best way to do this is hosting workshops for the DailySAT community."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
  )
}

export default Workshop
