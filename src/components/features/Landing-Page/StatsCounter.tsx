import { useEffect, useState } from "react"
import { motion, useAnimation } from "framer-motion"

interface StatsCounterProps {
  value: number
  label: string
  suffix?: string
}

export function StatsCounter({ value, label, suffix = "" }: StatsCounterProps) {
  const [displayValue, setDisplayValue] = useState(0)
  const controls = useAnimation()

  useEffect(() => {
    controls.start({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    })
  }, [controls])

  useEffect(() => {
    let startTime: number
    let animationFrame: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = timestamp - startTime
      const duration = 2000 // 2 seconds

      if (progress < duration) {
        const currentValue = Math.floor((progress / duration) * value)
        setDisplayValue(currentValue)
        animationFrame = requestAnimationFrame(animate)
      } else {
        setDisplayValue(value)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [value])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={controls}
      className="flex md:flex-col items-center justify-center text-center"
    >
        <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-bl from-blue-500 via-blue-400 to-blue-100">
        {displayValue.toLocaleString()}
        {suffix}
        </div>
        <div className="mt-2 text-sm text-gray-500">{label}</div>
    </motion.div>
  )
} 