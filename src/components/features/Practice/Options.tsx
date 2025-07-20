import { useCalcModeModalStore } from '@/store/calc';
import { calc } from '@/types/practice/calc';
import React from 'react'

interface OptionsProps {
  title: string;
  description: string;
  type: calc;  
}


const Options: React.FC<OptionsProps> = ({ title, description, type}) => {

  const setCalcMode = useCalcModeModalStore((state) => state.setMode)

  const handleChangeMode = () => {
    setCalcMode(type)
  }
  return (
    <div className="flex  rounded-lg border border-gray-300 w-1/2 h-20 cursor-pointer mt-4" onClick={handleChangeMode}>
        <div className="flex flex-col justify-center ml-4">
            <p className="font-bold">{title}</p>
            <p className="text-xs text-gray-500">{description}</p>
        </div>
    </div>
  )
}

export default Options