import { useState } from "react"
import Link from "next/link"
import { Github, Linkedin, Twitter, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

export default function Footer() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Put newsletter logic here or something
    setIsSubmitted(true)
    setTimeout(() => setIsSubmitted(false), 3000)
    setEmail("")
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  }

  return (
    <footer className="w-full bg-gradient-to-b from-white to-blue-50 pt-16 pb-8 border-t">
      <div className="container mx-auto px-4">

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* This part is the company info portion - edit later */}
          <motion.div variants={itemVariants} className="space-y-4">
            <div className="font-bold text-2xl bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              DailySAT
            </div>
            <p className="text-sm text-gray-600 max-w-xs">
              Empowering students to excel on the SAT with personalized practice, comprehensive materials, and proven strategies.
            </p>
            <div className="flex space-x-4 pt-2">
              <motion.a 
                href="https://github.com/yourusername/dailysat" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-blue-600 transition-colors"
                whileHover={{ scale: 1.2, rotate: 5 }}
              >
                <Github size={20} />
              </motion.a>
              <motion.a 
                href="https://twitter.com/dailysat" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-blue-600 transition-colors"
                whileHover={{ scale: 1.2, rotate: 5 }}
              >
                <Twitter size={20} />
              </motion.a>
              <motion.a 
                href="https://linkedin.com/company/dailysat" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-blue-600 transition-colors"
                whileHover={{ scale: 1.2, rotate: 5 }}
              >
                <Linkedin size={20} />
              </motion.a>
            </div>
          </motion.div>

          {/* Leads to the practice stuff */}
          <motion.div variants={itemVariants} className="space-y-4 md:pl-8 lg:pl-12">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">Practice</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/math" className="text-gray-600 hover:text-blue-600 transition-all duration-200 hover:translate-x-1 inline-block">
                  Math Practice
                </Link>
              </li>
              <li>
                <Link href="/reading-writing" className="text-gray-600 hover:text-blue-600 transition-all duration-200 hover:translate-x-1 inline-block">
                  Reading & Writing
                </Link>
              </li>
              <li>
                <Link href="/adaptive-practice" className="text-gray-600 hover:text-blue-600 transition-all duration-200 hover:translate-x-1 inline-block">
                  Adaptive Practice
                </Link>
              </li>
              <li>
                <Link href="/practice-tests" className="text-gray-600 hover:text-blue-600 transition-all duration-200 hover:translate-x-1 inline-block">
                  Practice Tests
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Links to all the other stuff */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/dashboard" className="text-gray-600 hover:text-blue-600 transition-all duration-200 hover:translate-x-1 inline-block">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-600 hover:text-blue-600 transition-all duration-200 hover:translate-x-1 inline-block">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/team" className="text-gray-600 hover:text-blue-600 transition-all duration-200 hover:translate-x-1 inline-block">
                  Our Team
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-600 hover:text-blue-600 transition-all duration-200 hover:translate-x-1 inline-block">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/tutor" className="text-gray-600 hover:text-blue-600 transition-all duration-200 hover:translate-x-1 inline-block">Tutor</Link>
              </li>
            </ul>
          </motion.div>

          {/* Newsletter signup portion. It can be repurposed for other stuff */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">Stay Updated</h3>
            <p className="text-sm text-gray-600">
              Subscribe to our newsletter for tips and updates.
            </p>
            <form onSubmit={handleSubmit} className="mt-2">
              <div className="flex max-w-md">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="px-4 py-2 w-full rounded-l-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <motion.button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r-md transition-colors flex items-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ArrowRight size={16} />
                </motion.button>
              </div>
              {isSubmitted && (
                <motion.p 
                  className="text-green-600 text-sm mt-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  Thanks for subscribing!
                </motion.p>
              )}
            </form>
          </motion.div>
        </motion.div>

        {/* Legal stuff - update it when needed */}
        <motion.div 
          className="pt-8 mt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <p>© {new Date().getFullYear()} DailySAT. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:text-blue-600 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-blue-600 transition-colors">Terms of Service</Link>
            <Link href="/contact" className="hover:text-blue-600 transition-colors">Contact Us</Link>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}