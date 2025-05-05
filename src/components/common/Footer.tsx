import Link from "next/link"
import { Github, Linkedin, Twitter } from "lucide-react"
import { motion } from "framer-motion"

export default function Footer() {
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
