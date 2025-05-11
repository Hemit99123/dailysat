import Link from "next/link"
import { ArrowRight, Github, Linkedin, Twitter } from "lucide-react"
import { motion } from "framer-motion"
import { useState } from "react"

export default function Footer() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    setIsSubmitted(true)
    // Additional submission logic would go here
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  }

  return (
    <footer className="w-full bg-gradient-to-b from-white to-blue-50 border-t px-6 py-12 md:px-16 md:py-16">
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {/* Company Info */}
        <motion.div variants={itemVariants} className="space-y-4">
          <div className="font-extrabold text-3xl bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            DailySAT
          </div>
          <p className="text-sm text-gray-600 max-w-sm leading-relaxed">
            Empowering students to excel on the SAT with personalized practice, comprehensive materials, and proven strategies.
          </p>
          <div className="flex space-x-4 pt-2">
            <motion.a 
              href="https://github.com/yourusername/dailysat" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-blue-600 transition-transform"
              whileHover={{ scale: 1.2, rotate: 5 }}
            >
              <Github size={22} />
            </motion.a>
            <motion.a 
              href="https://twitter.com/dailysat" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-blue-600 transition-transform"
              whileHover={{ scale: 1.2, rotate: 5 }}
            >
              <Twitter size={22} />
            </motion.a>
            <motion.a 
              href="https://linkedin.com/company/dailysat" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-blue-600 transition-transform"
              whileHover={{ scale: 1.2, rotate: 5 }}
            >
              <Linkedin size={22} />
            </motion.a>
          </div>
        </motion.div>

        {/* Practice Links */}
        <motion.div variants={itemVariants} className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-800">Practice</h3>
          <ul className="space-y-2">
            {[
              { href: "/math", label: "Math Practice" },
              { href: "/reading-writing", label: "Reading & Writing" },
              { href: "/adaptive-practice", label: "Adaptive Practice" },
              { href: "/practice-tests", label: "Practice Tests" },
            ].map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className="text-gray-600 hover:text-blue-600 transition-transform duration-200 hover:translate-x-1 inline-block">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Resources Links */}
        <motion.div variants={itemVariants} className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-800">Resources</h3>
          <ul className="space-y-2">
            {[
              { href: "/dashboard", label: "Dashboard" },
              { href: "/about", label: "About Us" },
              { href: "/team", label: "Our Team" },
              { href: "/blog", label: "Blog" },
              { href: "/tutor", label: "Tutor" },
            ].map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className="text-gray-600 hover:text-blue-600 transition-transform duration-200 hover:translate-x-1 inline-block">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </motion.div>
      </motion.div>

      {/* Newsletter signup portion */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="mb-12"
      >
        <motion.div variants={itemVariants} className="space-y-4 max-w-md">
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">Stay Updated</h3>
          <p className="text-sm text-gray-600">
            Subscribe to our newsletter for tips and updates.
          </p>
          <form onSubmit={handleSubmit} className="mt-2">
            <div className="flex">
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

      {/* Legal/Footer Note */}
      <motion.div 
        className="border-t border-gray-200 pt-6 mt-6 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
      >
        <p>© {new Date().getFullYear()} DailySAT. All rights reserved.</p>
        <div className="mt-2 md:mt-0">
          <Link href="/privacy-policy" className="hover:underline hover:text-blue-600">Privacy Policy</Link>
        </div>
      </motion.div>
    </footer>
  )
}