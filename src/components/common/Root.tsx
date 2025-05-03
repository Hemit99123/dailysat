"use client"

import React, { ReactNode } from 'react'
import NavBar from './NavBar'
import { usePathname } from 'next/navigation'
import { WalletContextProvider } from './WalletContextProvider'
import { GlobalPowerupProvider } from '../features/layout/GlobalPowerupProvider'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

interface RootProps {
  children: ReactNode
}

const Root: React.FC<RootProps> = ({ children }) => {
  const pathname = usePathname()

  return (
    <WalletContextProvider>
      <GlobalPowerupProvider>
        <div className="layout-container">
          {pathname !== "/" && <NavBar />}
          {children}
          <ToastContainer position="bottom-right" />
        </div>
      </GlobalPowerupProvider>
    </WalletContextProvider>
  )
}

export default Root
