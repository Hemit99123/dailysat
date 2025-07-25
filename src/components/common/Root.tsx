import React, { ReactNode } from 'react'
import NavBar from './NavBar'

interface RootProps {
  children: ReactNode
}

const Root: React.FC<RootProps> = ({ children }) => {
  return (
    <div className="layout-container">
      <NavBar />  
      {children}  
    </div>
  )
}

export default Root
