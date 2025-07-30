import { Badge } from '@/components/common/Badge'
import React from 'react'

interface HeaderProps {
  badgeText: string
  text: string
  description: string
}

const Header: React.FC<HeaderProps> = ({ badgeText, text, description }) => {
  return (
    <div className="flex items-center justify-center px-4">
        <div className="flex flex-col items-center justify-center text-center max-w-2xl">
            <Badge className="px-4 py-1.5 bg-blue-100 text-blue-700 border-blue-100 rounded-lg mb-4 hover:bg-blue-200 duration-300">
            {badgeText}
            </Badge>
            <h2 className="text-blue-900 text-2xl font-bold tracking-tight leading-tight sm:text-3xl md:text-5xl mb-3">
            {text}
            </h2>
            <p className="mx-auto text-gray-800 leading-relaxed">
            {description}
            </p>
        </div>
    </div>
  )
}

export default Header
