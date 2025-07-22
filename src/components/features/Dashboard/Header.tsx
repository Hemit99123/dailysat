import React from 'react'
import Image from "next/image";

interface HeaderProps {
    icon: string;
    title: string;
}

const Header: React.FC<HeaderProps> = ({ icon, title }) => {

  return (
      <div className="flex items-center mb-4">
        <div className="p-3 rounded-full flex items-center justify-center">
          <Image src={`/icons/${icon}.png`} width={40} height={40} alt="icon" />
        </div>
        <p className="text-md font-bold text-gray-600 ml-2">{title}</p>
      </div>
  )
}

export default Header