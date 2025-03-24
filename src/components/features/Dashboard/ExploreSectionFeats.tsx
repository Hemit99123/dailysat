import React from 'react'
import BookSVG from '../Questions/icons/BookSVG'
import MathSVG from '../Questions/icons/MathSVG'
import Option from './Option'

const ExploreSectionFeats = () => {
  return (
    <><div className="flex items-center pl-5 mt-10">
          <h1 className="pl-3.5 font-bold text-4xl text-blue-900">Practice!</h1>
      </div><div className="lg:px-16 lg:p-6 px-2">
              <div className="grid grids-cols-1 md:grid-cols-3 gap-2 mt-px">
                  <Option
                      icon={<BookSVG />}
                      header="Reading & Writing"
                      redirect="/reading-writing" 
                   />
                  <Option
                      icon={<MathSVG />}
                      header="Math"
                      redirect="/math" 
                   />
              </div>
          </div></> 
   )
}

export default ExploreSectionFeats