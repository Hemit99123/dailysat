import React from 'react'
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
            <FAQItem 
                key={index}
                question={faq.question}
                answer={faq.answer}
            />
        ))}
        </div>


    </div>
  )
}

export default FAQ