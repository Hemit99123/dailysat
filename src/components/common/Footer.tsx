import Link from "next/link"
import { Github, Linkedin, Twitter } from "lucide-react"
import { motion } from "framer-motion"
import { practiceLinks, resourceLinks, dashboardLinks } from "@/data/common/footer-links"

export default function Footer() {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  return (
    <motion.footer 
      className="w-full bg-gradient-to-b from-white to-blue-50 border-t px-6 py-12 md:px-16 md:py-16 mt-12"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariants}
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        {/* Company Info */}
        <motion.div className="space-y-4" variants={itemVariants}>
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
              className="text-gray-500 hover:text-blue-600 transition-colors hover:scale-110 transform duration-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Github size={22} />
            </motion.a>
            <motion.a 
              href="https://twitter.com/dailysat" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-blue-600 transition-colors hover:scale-110 transform duration-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Twitter size={22} />
            </motion.a>
            <motion.a 
              href="https://linkedin.com/company/dailysat" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-blue-600 transition-colors hover:scale-110 transform duration-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Linkedin size={22} />
            </motion.a>
          </div>
        </motion.div>

        {/* Practice Links */}
        <motion.div className="space-y-4" variants={itemVariants}>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-800">Practice</h3>
          <ul className="space-y-2">
            {practiceLinks.map(({ href, label }) => (
              <motion.li key={href} whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                <Link href={href} className="text-gray-600 hover:text-blue-600 transition-colors duration-200 hover:translate-x-1 transform inline-block">
                  {label}
                </Link>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Resources Links */}
        <motion.div className="space-y-4" variants={itemVariants}>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-800">Resources</h3>
          <ul className="space-y-2">
            {resourceLinks.map(({ href, label }) => (
              <motion.li key={href} whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                <Link href={href} className="text-gray-600 hover:text-blue-600 transition-colors duration-200 hover:translate-x-1 transform inline-block">
                  {label}
                </Link>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Dashboard Links */}
        <motion.div className="space-y-4" variants={itemVariants}>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-800">Dashboard</h3>
          <ul className="space-y-2">
            {dashboardLinks.map(({ href, label }) => (
              <motion.li key={href} whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                <Link href={href} className="text-gray-600 hover:text-blue-600 transition-colors duration-200 hover:translate-x-1 transform inline-block">
                  {label}
                </Link>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* Legal/Footer Note */}
      <motion.div 
        className="border-t border-gray-200 pt-6 mt-6 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500"
        variants={itemVariants}
      >
        <p>© {new Date().getFullYear()} DailySAT. All rights reserved.</p>
        <div className="mt-2 md:mt-0">
          <Link href="/privacy-policy" className="hover:underline hover:text-blue-600">Privacy Policy</Link>
        </div>
      </motion.div>
    </motion.footer>
  )
}
