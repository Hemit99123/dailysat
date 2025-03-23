
"use client"

import type React from "react"
import { useState } from "react"
import { ChevronDown, ChevronRight } from "lucide-react"
import CTASideBar from './CTASideBar';

import type { Topic } from "@/types/sat-platform/topic"

interface SidebarProps {
  title: string
  svg: React.ReactNode
  topics: Topic[]
  handleTopicClick: (topic: Topic) => void
}

const Sidebar: React.FC<SidebarProps> = ({ title, svg, topics, handleTopicClick }) => {
  const [expandedTopics, setExpandedTopics] = useState<Record<number, boolean>>({})
  const [selectedTopicId, setSelectedTopicId] = useState<number | null>(null)
  const [selectedSubtopicId, setSelectedSubtopicId] = useState<number | null>(null)

  const toggleExpand = (topicId: number) => {
    setExpandedTopics((prev) => ({
      ...prev,
      [topicId]: !prev[topicId],
    }))
  }

  const handleMainTopicClick = (topic: Topic) => {
    if (topic.subtopics && topic.subtopics.length > 0) {
      toggleExpand(topic.id)
    } else {
      setSelectedTopicId(topic.id)
      setSelectedSubtopicId(null)
      handleTopicClick(topic)
    }
  }

  const handleSubtopicClick = (mainTopic: Topic, subtopic: Topic) => {
    setSelectedTopicId(mainTopic.id)
    setSelectedSubtopicId(subtopic.id)
    handleTopicClick(subtopic)
  }

  return (
    <div className="w-full md:w-1/4 bg-white p-4 rounded-lg shadow-md h-full overflow-y-auto">
      <div className="flex items-center gap-2 mb-6">
        {svg}
        <h2 className="text-xl font-bold">{title}</h2>
      </div>

      <div className="space-y-2">
        {topics.map((topic) => (
          <div key={topic.id} className="mb-2">
            <div
              className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors ${
                selectedTopicId === topic.id && !selectedSubtopicId ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"
              }`}
              onClick={() => handleMainTopicClick(topic)}
            >
              <div className="flex items-center">
                <span className="font-medium">{topic.name}</span>
              </div>
              {topic.subtopics && topic.subtopics.length > 0 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleExpand(topic.id)
                  }}
                  className="p-1 rounded-full hover:bg-gray-200"
                >
                  {expandedTopics[topic.id] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button>
              )}
            </div>

            {/* Subtopics */}
            {topic.subtopics && expandedTopics[topic.id] && (
              <div className="ml-4 mt-1 space-y-1 border-l-2 border-gray-200 pl-2">
                {topic.subtopics.map((subtopic) => (
                  <div
                    key={subtopic.id}
                    className={`p-2 rounded-md cursor-pointer transition-colors ${
                      selectedSubtopicId === subtopic.id ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"
                    }`}
                    onClick={() => handleSubtopicClick(topic, subtopic)}
                  >
                    <span className="text-sm">{subtopic.name}</span>
                  </div>
                  
                ))}
                
              </div>
            )}
            
          </div>
          
        ))}
        
      </div>
    
    </div>
  )
}

export default Sidebar

