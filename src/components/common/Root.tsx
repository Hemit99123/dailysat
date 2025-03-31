"use client"

import React, { ReactNode } from 'react'
import NavBar from './NavBar'
import { usePathname } from 'next/navigation'

interface RootProps {
  children: ReactNode
}

const Root: React.FC<RootProps> = ({ children }) => {

  const pathname = usePathname()

  return (
    <div className="layout-container">
      {pathname !== "/" &&
        <NavBar />  
      }
      {children}  
    </div>
  )
}

export default Root
