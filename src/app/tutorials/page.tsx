"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Check, ChevronRight, BookOpen, Calculator, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"

// Topic type definition
type Topic = {
  id: string
  title: string
  icon: React.ReactNode
  color: string
  progress: number
  subtopics: {
    id: string
    title: string
  }[]
}

// Reading topics
const readingTopics: Topic[] = [
  {
    id: "reading-comprehension",
    title: "Reading Comprehension",
    icon: <BookOpen className="h-6 w-6" />,
    color: "bg-blue-500",
    progress: 75,
    subtopics: [
      { id: "main-idea", title: "Main Idea & Purpose" },
      { id: "supporting-details", title: "Supporting Details" },
      { id: "inference", title: "Making Inferences" },
      { id: "author-tone", title: "Author's Tone & Attitude" },
    ],
  },
  {
    id: "vocabulary",
    title: "Vocabulary in Context",
    icon: <BookOpen className="h-6 w-6" />,
    color: "bg-purple-500",
    progress: 50,
    subtopics: [
      { id: "context-clues", title: "Using Context Clues" },
      { id: "word-meanings", title: "Multiple Word Meanings" },
      { id: "connotation", title: "Connotation vs. Denotation" },
      { id: "academic-vocab", title: "Academic Vocabulary" },
    ],
  },
  {
    id: "passage-analysis",
    title: "Passage Analysis",
    icon: <BookOpen className="h-6 w-6" />,
    color: "bg-green-500",
    progress: 25,
    subtopics: [
      { id: "structure", title: "Passage Structure" },
      { id: "argument", title: "Argument Analysis" },
      { id: "evidence", title: "Evidence Evaluation" },
      { id: "comparison", title: "Comparing Passages" },
    ],
  },
  {
    id: "critical-thinking",
    title: "Critical Thinking",
    icon: <BookOpen className="h-6 w-6" />,
    color: "bg-orange-500",
    progress: 10,
    subtopics: [
      { id: "logical-reasoning", title: "Logical Reasoning" },
      { id: "bias-identification", title: "Identifying Bias" },
      { id: "fact-opinion", title: "Fact vs. Opinion" },
      { id: "synthesis", title: "Information Synthesis" },
    ],
  },
]

// Math topics
const mathTopics: Topic[] = [
  {
    id: "algebra",
    title: "Algebra",
    icon: <Calculator className="h-6 w-6" />,
    color: "bg-red-500",
    progress: 90,
    subtopics: [
      { id: "linear-equations", title: "Linear Equations" },
      { id: "quadratic-equations", title: "Quadratic Equations" },
      { id: "inequalities", title: "Inequalities" },
      { id: "functions", title: "Functions & Relations" },
    ],
  },
  {
    id: "geometry",
    title: "Geometry",
    icon: <Calculator className="h-6 w-6" />,
    color: "bg-yellow-500",
    progress: 60,
    subtopics: [
      { id: "angles", title: "Angles & Lines" },
      { id: "triangles", title: "Triangles & Polygons" },
      { id: "circles", title: "Circles & Arcs" },
      { id: "coordinate-geometry", title: "Coordinate Geometry" },
    ],
  },
  {
    id: "data-analysis",
    title: "Data Analysis",
    icon: <Calculator className="h-6 w-6" />,
    color: "bg-teal-500",
    progress: 40,
    subtopics: [
      { id: "statistics", title: "Statistics Basics" },
      { id: "probability", title: "Probability" },
      { id: "data-interpretation", title: "Data Interpretation" },
      { id: "scatter-plots", title: "Scatter Plots & Regression" },
    ],
  },
  {
    id: "advanced-math",
    title: "Advanced Math",
    icon: <Calculator className="h-6 w-6" />,
    color: "bg-indigo-500",
    progress: 15,
    subtopics: [
      { id: "trigonometry", title: "Trigonometry" },
      { id: "complex-numbers", title: "Complex Numbers" },
      { id: "matrices", title: "Matrices" },
      { id: "sequences", title: "Sequences & Series" },
    ],
  },
]

// Topic Circle Component
const TopicCircle = ({
  topic,
  index,
  onClick,
}: {
  topic: Topic
  index: number
  onClick: () => void
}) => {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: index * 0.1 }}
      className="flex flex-col items-center"
    >
      <button
        onClick={onClick}
        className={`relative w-28 h-28 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-blue-300 shadow-lg ${topic.color} transform hover:-translate-y-1`}
        aria-label={`${topic.title} - ${topic.progress}% complete`}
      >
        <div className="absolute inset-0 rounded-full">
          <svg width="100%" height="100%" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke="#ffffff"
              strokeWidth="8"
              strokeDasharray="289.27"
              strokeDashoffset={289.27 * (1 - topic.progress / 100)}
              transform="rotate(-90 50 50)"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
        </div>
        <div className="z-10 text-white">
          {topic.progress === 100 ? (
            <Check className="h-10 w-10" />
          ) : (
            <div className="flex flex-col items-center">
              {topic.icon}
              <span className="text-xl font-bold mt-1">{topic.progress}%</span>
            </div>
          )}
        </div>
      </button>
      <div className="mt-4 text-center">
        <p className="font-bold text-gray-800">{topic.title}</p>
        <p className="text-sm text-gray-500">{topic.subtopics.length} lessons</p>
      </div>
    </motion.div>
  )
}

// Subtopic Preview Component
const SubtopicPreview = ({
  topic,
  section,
}: {
  topic: Topic | null
  section: string
}) => {
  const router = useRouter()

  if (!topic) return null

  const navigateToTopic = () => {
    router.push(`/tutorials/${section}/${topic.id}`)
  }

  const navigateToSubtopic = (subtopicIndex: number) => {
    router.push(`/tutorials/${section}/${topic.id}?subtopic=${subtopicIndex}`)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8 bg-white rounded-xl shadow-xl p-6 max-w-4xl mx-auto border-2 border-gray-100"
    >
      <div className="flex items-center mb-6">
        <div className={`w-14 h-14 rounded-full ${topic.color} flex items-center justify-center mr-4 shadow-md`}>
          <div className="text-white">{topic.icon}</div>
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-800">{topic.title}</h3>
          <div className="flex items-center mt-1">
            <Progress value={topic.progress} className="h-3 w-48 rounded-full" />
            <span className="ml-3 font-semibold text-gray-700">{topic.progress}% complete</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {topic.subtopics.map((subtopic, index) => (
          <Card
            key={subtopic.id}
            className="border-2 hover:border-blue-200 transition-all duration-300 hover:shadow-md cursor-pointer"
            onClick={() => navigateToSubtopic(index)}
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3 text-gray-700 font-bold">
                    {index + 1}
                  </div>
                  <h4 className="font-semibold text-gray-800">{subtopic.title}</h4>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 flex justify-end">
        <Button className="font-bold" onClick={navigateToTopic}>
          Start Learning
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  )
}

const LearningPath = ({ topics, onTopicClick }: { topics: Topic[]; onTopicClick: (topic: Topic) => void }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {topics.map((topic, index) => (
        <TopicCircle key={topic.id} topic={topic} index={index} onClick={() => onTopicClick(topic)} />
      ))}
    </div>
  )
}

// Main Tutorials Page Component
export default function TutorialsPage() {
  const [activeTab, setActiveTab] = useState("reading")
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null)

  const handleTopicClick = (topic: Topic) => {
    setSelectedTopic(topic)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4">SAT Tutorials</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Master the SAT with our interactive learning paths. Click on a topic to explore detailed tutorials and
            practice exercises.
          </p>
        </div>

        <Tabs defaultValue="reading" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="grid w-[400px] grid-cols-2">
              <TabsTrigger value="reading" className="text-lg py-3">
                Reading Section
              </TabsTrigger>
              <TabsTrigger value="math" className="text-lg py-3">
                Math Section
              </TabsTrigger>
            </TabsList>
          </div>

          <Card className="border-0 shadow-xl rounded-xl overflow-hidden">
            <TabsContent value="reading" className="mt-0 p-0">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-t-xl border-b">
                <h2 className="text-2xl font-bold text-blue-900 mb-2">Reading Section</h2>
                <p className="text-blue-700">Master critical reading skills needed for SAT success</p>
              </div>
              <div className="bg-white p-4">
                <LearningPath topics={readingTopics} onTopicClick={handleTopicClick} />
              </div>
            </TabsContent>

            <TabsContent value="math" className="mt-0 p-0">
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-t-xl border-b">
                <h2 className="text-2xl font-bold text-purple-900 mb-2">Math Section</h2>
                <p className="text-purple-700">Develop problem-solving skills for SAT math questions</p>
              </div>
              <div className="bg-white p-4">
                <LearningPath topics={mathTopics} onTopicClick={handleTopicClick} />
              </div>
            </TabsContent>
          </Card>
        </Tabs>

        {selectedTopic && <SubtopicPreview topic={selectedTopic} section={activeTab} />}

        <div className="mt-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-8 max-w-4xl mx-auto shadow-xl">
          <h2 className="text-2xl font-bold text-white mb-4">Your Learning Progress</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white bg-opacity-10 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-3">Reading Section</h3>
              <Progress value={40} className="h-4 mb-2 bg-white bg-opacity-20" />
              <div className="flex justify-between">
                <p className="text-white font-bold">40% Complete</p>
                <p className="text-white">8/20 lessons</p>
              </div>
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-3">Math Section</h3>
              <Progress value={55} className="h-4 mb-2 bg-white bg-opacity-20" />
              <div className="flex justify-between">
                <p className="text-white font-bold">55% Complete</p>
                <p className="text-white">11/20 lessons</p>
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-center">
            <Button className="font-bold text-blue-700">
              View Detailed Progress
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}