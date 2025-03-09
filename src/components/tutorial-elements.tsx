import React from 'react'
import { Check, AlertTriangle, Info, BookOpen, Code, PenTool, Lightbulb } from 'lucide-react'
import { cn } from '@/lib/utils'

export const TutorialHeading = ({ 
  children, 
  className 
}: { 
  children: React.ReactNode
  className?: string
}) => (
  <h2 className={cn("text-2xl font-bold text-gray-900 mt-6 mb-3", className)}>
    {children}
  </h2>
)

export const TutorialSubheading = ({ 
  children, 
  className 
}: { 
  children: React.ReactNode
  className?: string
}) => (
  <h3 className={cn("text-xl font-semibold text-gray-800 mt-5 mb-2", className)}>
    {children}
  </h3>
)

export const TutorialParagraph = ({ 
  children, 
  className 
}: { 
  children: React.ReactNode
  className?: string
}) => (
  <p className={cn("text-gray-700 my-3 leading-relaxed", className)}>
    {children}
  </p>
)

export const TutorialList = ({ 
  items, 
  ordered = false,
  className 
}: { 
  items: React.ReactNode[]
  ordered?: boolean
  className?: string
}) => {
  const ListComponent = ordered ? 'ol' : 'ul'
  return (
    <ListComponent className={cn(
      "my-4 pl-6 space-y-2", 
      ordered ? "list-decimal" : "list-disc",
      className
    )}>
      {items.map((item, index) => (
        <li key={index} className="text-gray-700">{item}</li>
      ))}
    </ListComponent>
  )
}

export const TutorialExample = ({ 
  children, 
  title,
  className 
}: { 
  children: React.ReactNode
  title?: string
  className?: string
}) => (
  <div className={cn("bg-gray-50 border-l-4 border-blue-500 p-4 my-4 rounded-r", className)}>
    {title && <div className="font-semibold mb-2 flex items-center">
      <PenTool className="h-4 w-4 mr-2 text-blue-500" />
      {title}
    </div>}
    <div className="text-gray-700">{children}</div>
  </div>
)

export const TutorialCodeBlock = ({ 
  code, 
  language = "javascript",
  className 
}: { 
  code: string
  language?: string
  className?: string
}) => (
  <div className={cn("my-4", className)}>
    <div className="bg-gray-800 text-gray-200 p-1 text-xs rounded-t flex items-center">
      <Code className="h-3 w-3 mr-1" />
      {language}
    </div>
    <pre className="bg-gray-900 text-gray-100 p-4 rounded-b overflow-x-auto">
      <code>{code}</code>
    </pre>
  </div>
)

export const TutorialCallout = ({ 
  children, 
  type = "info",
  title,
  className 
}: { 
  children: React.ReactNode
  type?: "info" | "warning" | "tip" | "success"
  title?: string
  className?: string
}) => {
  const styles = {
    info: {
      bg: "bg-blue-50",
      border: "border-blue-500",
      icon: <Info className="h-5 w-5 text-blue-500" />,
      title: title || "Information",
      titleColor: "text-blue-700"
    },
    warning: {
      bg: "bg-amber-50",
      border: "border-amber-500",
      icon: <AlertTriangle className="h-5 w-5 text-amber-500" />,
      title: title || "Warning",
      titleColor: "text-amber-700"
    },
    tip: {
      bg: "bg-purple-50",
      border: "border-purple-500",
      icon: <Lightbulb className="h-5 w-5 text-purple-500" />,
      title: title || "Tip",
      titleColor: "text-purple-700"
    },
    success: {
      bg: "bg-green-50",
      border: "border-green-500",
      icon: <Check className="h-5 w-5 text-green-500" />,
      title: title || "Success",
      titleColor: "text-green-700"
    }
  }
  
  const style = styles[type]
  
  return (
    <div className={cn(`${style.bg} border-l-4 ${style.border} p-4 my-4 rounded-r`, className)}>
      <div className={`font-semibold mb-2 flex items-center ${style.titleColor}`}>
        {style.icon}
        <span className="ml-2">{style.title}</span>
      </div>
      <div className="text-gray-700">{children}</div>
    </div>
  )
}

export const TutorialQuiz = ({ 
  question, 
  options,
  answer,
  explanation,
  className 
}: { 
  question: string
  options: string[]
  answer: number
  explanation: string
  className?: string
}) => {
  const [selectedOption, setSelectedOption] = React.useState<number | null>(null)
  const [showExplanation, setShowExplanation] = React.useState(false)
  
  const handleOptionSelect = (index: number) => {
    setSelectedOption(index)
    setShowExplanation(true)
  }
  
  return (
    <div className={cn("border border-gray-200 rounded-lg p-4 my-6", className)}>
      <div className="font-semibold text-lg mb-3 flex items-center">
        <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
        Practice Question
      </div>
      <p className="mb-4 text-gray-800">{question}</p>
      <div className="space-y-2 mb-4">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleOptionSelect(index)}
            className={cn(
              "w-full text-left p-3 rounded border transition-colors",
              selectedOption === null 
                ? "border-gray-200 hover:border-blue-300 hover:bg-blue-50" 
                : selectedOption === index
                  ? index === answer
                    ? "border-green-500 bg-green-50"
                    : "border-red-500 bg-red-50"
                  : index === answer && showExplanation
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 opacity-70"
            )}
          >
            <div className="flex items-start">
              <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center mr-3 text-gray-700 font-medium flex-shrink-0">
                {String.fromCharCode(65 + index)}
              </div>
              <span>{option}</span>
            </div>
          </button>
        ))}
      </div>
      {showExplanation && (
        <div className="bg-blue-50 border border-blue-100 rounded p-3 mt-4">
          <div className="font-medium text-blue-800 mb-1">Explanation:</div>
          <p className="text-gray-700">{explanation}</p>
        </div>
      )}
    </div>
  )
}
