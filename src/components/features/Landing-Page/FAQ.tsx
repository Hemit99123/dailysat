import React from 'react'
import { motion } from 'framer-motion'
import Header from './Header'
import FAQItem from './FAQItem'
import { faqs } from '@/data/landing-page/faqs'

const FAQ = () => {
  return (
    <div>
      <Header 
        badgeText='FAQs'
        text="We've Got the Answers"
        description='Quick questions about the DailySAT web platform'
      />

      <div className='space-y-4'>
        {faqs.map((faq, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <FAQItem 
              question={faq.question}
              answer={faq.answer}
            />
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default FAQ
