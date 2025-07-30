import React, { useState } from 'react'
import { FAQ } from '@/types/landing-page/faq'
import ArrowSvg from '@/components/common/icons/ArrowSVG'
import { motion } from 'framer-motion'

const FAQItem: React.FC<FAQ> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div
      className="p-4 border border-blue-400 rounded-md cursor-pointer"
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className="flex justify-between items-center">
        <p className="text-blue-900 font-figtree font-medium">{question}</p>
        <ArrowSvg
          className={`w-5 h-5 transform transition-transform duration-300 ${
            isOpen ? '-rotate-90' : 'rotate-90'
          }`}
          stroke="#1e3a8a"
        />
      </div>
    {isOpen && (
        <motion.div
            className="text-blue-700 mt-2 font-figtree"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
            {answer}
        </motion.div>
    )}
    </div>
  )
}

export default FAQItem
