import React, { useState } from 'react'
import { FAQ } from '@/types/landing-page/faq'
import ArrowSvg from '@/components/common/icons/ArrowSVG'
import { motion, AnimatePresence } from 'framer-motion'

const FAQItem: React.FC<FAQ> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div
      className={`p-4 rounded-xl cursor-pointer transition-all duration-300
        bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-300
        hover:shadow-md hover:bg-blue-100`}
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
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            className="text-black mt-3 font-figtree overflow-hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            {answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default FAQItem
