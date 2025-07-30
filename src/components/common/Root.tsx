"use client" // Have to add this directive because Footer has framer-motion

import React from 'react'
import Footer from './Footer'
import NavBar from './NavBar'

interface RootProps {
    childern: React.ReactNode
}
const Root: React.FC<RootProps> = ({ childern }) => {
  return (
    <>
        <NavBar />
          {childern}
        <Footer />
    </>
  )
}

export default Root