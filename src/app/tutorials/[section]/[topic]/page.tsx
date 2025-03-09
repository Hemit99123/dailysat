"use client"

import type { ReactNode } from "react"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, BookOpen, Calculator, Check, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Topic data structure
type TopicData = {
  id: string
  title: string
  description: string
  icon: ReactNode
  color: string
  progress: number
  subtopics: {
    id: string
    title: string
    description: string
    content: string
    completed: boolean
  }[]
}

// Reading topics data
const readingTopicsData: Record<string, TopicData> = {
  "reading-comprehension": {
    id: "reading-comprehension",
    title: "Reading Comprehension",
    description: "Learn to understand and analyze written passages effectively",
    icon: <BookOpen className="h-6 w-6" />,
    color: "bg-blue-500",
    progress: 75,
    subtopics: [
      {
        id: "main-idea",
        title: "Main Idea & Purpose",
        description: "Identify the central theme and author's intent",
        content: `
          <div class="space-y-6">
            <div class="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-md">
              <h3 class="text-blue-700 font-bold text-lg">Learning Objective</h3>
              <p>By the end of this lesson, you'll be able to identify the main idea and author's purpose in SAT reading passages.</p>
            </div>
            
            <h3 class="text-2xl font-bold text-gray-800">Finding the Main Idea</h3>
            <p>The main idea is the central point the author wants to communicate. Think of it as the "big picture" of the passage.</p>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
              <div class="bg-gray-50 p-4 rounded-md border border-gray-200">
                <h4 class="font-semibold text-gray-700 mb-2">Where to Look</h4>
                <ul class="list-disc pl-5 space-y-1">
                  <li>First and last paragraphs</li>
                  <li>Topic sentences (often first sentence of paragraphs)</li>
                  <li>Repeated concepts or themes</li>
                </ul>
              </div>
              <div class="bg-gray-50 p-4 rounded-md border border-gray-200">
                <h4 class="font-semibold text-gray-700 mb-2">Key Questions</h4>
                <ul class="list-disc pl-5 space-y-1">
                  <li>What is this passage primarily about?</li>
                  <li>What point is the author making?</li>
                  <li>What would be a good title for this passage?</li>
                </ul>
              </div>
            </div>
            
            <h3 class="text-2xl font-bold text-gray-800">Understanding Author's Purpose</h3>
            <p>Authors write for specific reasons. Identifying this purpose helps you understand the passage's structure and tone.</p>
            
            <div class="overflow-x-auto my-4">
              <table class="min-w-full bg-white border border-gray-200 rounded-md">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="py-2 px-4 border-b text-left">Purpose</th>
                    <th class="py-2 px-4 border-b text-left">Characteristics</th>
                    <th class="py-2 px-4 border-b text-left">Example Clues</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="py-2 px-4 border-b font-medium">To Inform</td>
                    <td class="py-2 px-4 border-b">Presents facts objectively</td>
                    <td class="py-2 px-4 border-b">Statistics, definitions, explanations</td>
                  </tr>
                  <tr>
                    <td class="py-2 px-4 border-b font-medium">To Persuade</td>
                    <td class="py-2 px-4 border-b">Presents arguments to convince</td>
                    <td class="py-2 px-4 border-b">Strong opinions, calls to action</td>
                  </tr>
                  <tr>
                    <td class="py-2 px-4 border-b font-medium">To Entertain</td>
                    <td class="py-2 px-4 border-b">Engages through storytelling</td>
                    <td class="py-2 px-4 border-b">Narrative elements, humor</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div class="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-md">
              <h3 class="text-yellow-700 font-bold">SAT Tip</h3>
              <p>Main idea questions often include phrases like "primarily concerned with," "mainly discusses," or "central idea."</p>
            </div>
            
            <h3 class="text-2xl font-bold text-gray-800">Practice Example</h3>
            <div class="bg-gray-50 p-5 rounded-lg border border-gray-200 my-4">
              <p class="italic">Read the following paragraph:</p>
              <blockquote class="border-l-4 border-gray-300 pl-4 py-2 my-3 italic">
                The decline of bee populations worldwide has alarmed scientists and environmentalists alike. These insects are responsible for pollinating approximately 75% of the fruits, nuts, and vegetables grown in the United States. Without bees, many crops would fail, threatening food security globally. Recent studies have linked this decline to pesticide use, habitat loss, and climate change, prompting calls for more sustainable agricultural practices and conservation efforts.
              </blockquote>
              
              <div class="mt-4">
                <p class="font-semibold">The main idea of this passage is:</p>
                <div class="space-y-2 mt-2">
                  <div class="flex items-start">
                    <div class="h-6 w-6 flex-shrink-0 rounded-full border border-gray-300 flex items-center justify-center mr-2">A</div>
                    <p>Pesticides are killing bees</p>
                  </div>
                  <div class="flex items-start">
                    <div class="h-6 w-6 flex-shrink-0 rounded-full bg-green-500 text-white flex items-center justify-center mr-2">B</div>
                    <p class="font-medium">The decline of bee populations threatens global food security and requires action</p>
                  </div>
                  <div class="flex items-start">
                    <div class="h-6 w-6 flex-shrink-0 rounded-full border border-gray-300 flex items-center justify-center mr-2">C</div>
                    <p>Scientists are alarmed about environmental changes</p>
                  </div>
                  <div class="flex items-start">
                    <div class="h-6 w-6 flex-shrink-0 rounded-full border border-gray-300 flex items-center justify-center mr-2">D</div>
                    <p>Sustainable agricultural practices are important</p>
                  </div>
                </div>
              </div>
              
              <div class="mt-4 bg-green-50 p-3 rounded-md">
                <p class="text-green-800"><span class="font-bold">Explanation:</span> The passage primarily focuses on the importance of bees for food production and the threats to their population. While pesticides are mentioned as one cause of decline, and sustainable practices as one solution, the central concern is the impact of declining bee populations on food security.</p>
              </div>
            </div>
            
            <div class="flex justify-center my-6">
              <div class="bg-blue-100 rounded-lg p-4 max-w-md">
                <h4 class="font-bold text-center text-blue-800 mb-2">Quick Review</h4>
                <ul class="space-y-2">
                  <li class="flex items-center">
                    <svg class="h-5 w-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    The main idea is the central point of the passage
                  </li>
                  <li class="flex items-center">
                    <svg class="h-5 w-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    Look for repeated concepts and key positions (beginning/end)
                  </li>
                  <li class="flex items-center">
                    <svg class="h-5 w-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    Identify the author's purpose: inform, persuade, or entertain
                  </li>
                </ul>
              </div>
            </div>
          </div>
        `,
        completed: true,
      },
      {
        id: "supporting-details",
        title: "Supporting Details",
        description: "Recognize evidence that reinforces the main idea",
        content: `
          <div class="space-y-6">
            <div class="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-md">
              <h3 class="text-blue-700 font-bold text-lg">Learning Objective</h3>
              <p>Learn to identify and analyze supporting details that strengthen the main idea in SAT passages.</p>
            </div>
            
            <h3 class="text-2xl font-bold text-gray-800">Identifying Supporting Details</h3>
            <p>Supporting details provide evidence, examples, statistics, or explanations that reinforce the main idea. They help readers understand why the main idea is valid or important.</p>
            
            <div class="my-6">
              <img src="/placeholder.svg?height=200&width=600" alt="Supporting Details Diagram" class="rounded-lg mx-auto" />
            </div>
            
            <h3 class="text-2xl font-bold text-gray-800">Types of Supporting Details</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
              <div class="bg-gray-50 p-4 rounded-md border border-gray-200">
                <h4 class="font-semibold text-gray-700 mb-2 flex items-center">
                  <span class="bg-blue-100 text-blue-800 p-1 rounded-full w-6 h-6 inline-flex items-center justify-center mr-2">1</span>
                  Facts & Statistics
                </h4>
                <p class="text-sm">Numerical data that provides concrete evidence</p>
              </div>
              <div class="bg-gray-50 p-4 rounded-md border border-gray-200">
                <h4 class="font-semibold text-gray-700 mb-2 flex items-center">
                  <span class="bg-blue-100 text-blue-800 p-1 rounded-full w-6 h-6 inline-flex items-center justify-center mr-2">2</span>
                  Examples
                </h4>
                <p class="text-sm">Specific instances that illustrate the main point</p>
              </div>
              <div class="bg-gray-50 p-4 rounded-md border border-gray-200">
                <h4 class="font-semibold text-gray-700 mb-2 flex items-center">
                  <span class="bg-blue-100 text-blue-800 p-1 rounded-full w-6 h-6 inline-flex items-center justify-center mr-2">3</span>
                  Expert Opinions
                </h4>
                <p class="text-sm">Statements from authorities that lend credibility</p>
              </div>
            </div>
            
            <div class="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-md">
              <h3 class="text-yellow-700 font-bold">SAT Tip</h3>
              <p>Look for signal phrases like "for example," "for instance," "specifically," or "to illustrate" that often introduce supporting details.</p>
            </div>
            
            <h3 class="text-2xl font-bold text-gray-800">Practice Example</h3>
            <div class="bg-gray-50 p-5 rounded-lg border border-gray-200 my-4">
              <p class="italic">Read the following paragraph:</p>
              <blockquote class="border-l-4 border-gray-300 pl-4 py-2 my-3 italic">
                Exercise has numerous benefits for mental health. A 2018 study published in The Lancet found that people who exercised regularly experienced 43% fewer days of poor mental health compared to those who didn't exercise. Additionally, activities like yoga and tai chi have been shown to reduce stress hormones and increase endorphins, the body's natural mood elevators. Dr. Sarah Johnson, a neuropsychologist at Harvard Medical School, explains that "even a 10-minute walk can stimulate anti-anxiety effects."
              </blockquote>
              
              <div class="mt-4">
                <p class="font-semibold">Which of the following is NOT a supporting detail in this passage?</p>
                <div class="space-y-2 mt-2">
                  <div class="flex items-start">
                    <div class="h-6 w-6 flex-shrink-0 rounded-full border border-gray-300 flex items-center justify-center mr-2">A</div>
                    <p>A study showing 43% fewer days of poor mental health for those who exercise</p>
                  </div>
                  <div class="flex items-start">
                    <div class="h-6 w-6 flex-shrink-0 rounded-full border border-gray-300 flex items-center justify-center mr-2">B</div>
                    <p>The fact that yoga and tai chi reduce stress hormones</p>
                  </div>
                  <div class="flex items-start">
                    <div class="h-6 w-6 flex-shrink-0 rounded-full border border-gray-300 flex items-center justify-center mr-2">C</div>
                    <p>Dr. Johnson's statement about the benefits of a 10-minute walk</p>
                  </div>
                  <div class="flex items-start">
                    <div class="h-6 w-6 flex-shrink-0 rounded-full bg-green-500 text-white flex items-center justify-center mr-2">D</div>
                    <p class="font-medium">A recommendation that everyone should exercise daily for 30 minutes</p>
                  </div>
                </div>
              </div>
              
              <div class="mt-4 bg-green-50 p-3 rounded-md">
                <p class="text-green-800"><span class="font-bold">Explanation:</span> The passage does not mention a recommendation for 30 minutes of daily exercise. All other options are explicitly stated in the passage as supporting details for the main idea that exercise benefits mental health.</p>
              </div>
            </div>
          </div>
        `,
        completed: true,
      },
      {
        id: "inference",
        title: "Making Inferences",
        description: "Draw logical conclusions based on textual evidence",
        content: `
          <h3>What is an Inference?</h3>
          <p>An inference is a conclusion drawn from evidence rather than from explicit statements in the text. It's reading between the lines by combining textual evidence with your own knowledge.</p>
          
          <h3>Steps to Make Valid Inferences</h3>
          <ol>
            <li>Identify the facts or details provided in the text</li>
            <li>Consider what these details suggest when combined</li>
            <li>Apply your background knowledge to interpret the information</li>
            <li>Form a logical conclusion that is supported by the evidence</li>
          </ol>
          
          <h3>Common Inference Types on the SAT</h3>
          <ul>
            <li><strong>Character Feelings/Motivations:</strong> What drives a person's actions or decisions</li>
            <li><strong>Cause and Effect:</strong> Why something happened or what might result</li>
            <li><strong>Predictions:</strong> What might happen next based on given information</li>
            <li><strong>Implied Relationships:</strong> How people, events, or ideas connect</li>
          </ul>
          
          <h3>Practice Example</h3>
          <p>Read the following passage:</p>
          <blockquote>
            As Maria approached the podium, her hands trembled slightly. She glanced at her notecards, then set them aside. The audience of three hundred people fell silent. Maria took a deep breath, squared her shoulders, and began to speak in a clear, steady voice that carried to the back of the auditorium.
          </blockquote>
          <p>Which inference is best supported by the passage?</p>
          <p>A. Maria is an inexperienced public speaker</p>
          <p>B. Maria was initially nervous but overcame her anxiety</p>
          <p>C. Maria forgot what she wanted to say</p>
          <p>D. The audience was bored by Maria's speech</p>
          <p>The correct answer is B. The trembling hands suggest initial nervousness, while setting aside the notecards and speaking in a clear, steady voice indicate she overcame this anxiety.</p>
        `,
        completed: false,
      },
      {
        id: "author-tone",
        title: "Author's Tone & Attitude",
        description: "Recognize the author's perspective and emotional approach",
        content: `
          <h3>Understanding Tone and Attitude</h3>
          <p><strong>Tone</strong> refers to the author's attitude toward the subject or audience, revealed through word choice, punctuation, and sentence structure. It's how the author wants the message to sound.</p>
          
          <h3>Common Tones in SAT Passages</h3>
          <ul>
            <li><strong>Objective:</strong> Neutral, factual, unbiased</li>
            <li><strong>Critical:</strong> Evaluating flaws or shortcomings</li>
            <li><strong>Enthusiastic:</strong> Showing excitement or passion</li>
            <li><strong>Skeptical:</strong> Doubtful or questioning</li>
            <li><strong>Reverent:</strong> Showing deep respect</li>
            <li><strong>Ironic:</strong> Using words to convey the opposite of their literal meaning</li>
            <li><strong>Nostalgic:</strong> Fondly remembering the past</li>
            <li><strong>Urgent:</strong> Conveying importance and immediacy</li>
          </ul>
          
          <h3>Identifying Tone Clues</h3>
          <p>Look for:</p>
          <ul>
            <li><strong>Word choice:</strong> Positive/negative connotations, emotional language</li>
            <li><strong>Sentence structure:</strong> Short sentences may indicate urgency; complex ones might suggest thoughtfulness</li>
            <li><strong>Punctuation:</strong> Exclamation points show excitement; questions might indicate curiosity</li>
            <li><strong>Figurative language:</strong> Metaphors, similes, and analogies reveal attitudes</li>
          </ul>
          
          <h3>Practice Example</h3>
          <p>Read the following paragraph:</p>
          <blockquote>
            The so-called "advances" in artificial intelligence have been lauded by tech enthusiasts as revolutionary breakthroughs. Yet one must wonder: at what cost do these developments come? While machines become increasingly sophisticated, privacy erodes, jobs disappear, and human connection diminishes. Perhaps we should pause before blindly embracing every new algorithm that promises to "improve" our lives.
          </blockquote>
          <p>The author's tone in this passage could best be described as:</p>
          <p>A. Enthusiastic</p>
          <p>B. Objective</p>
          <p>C. Skeptical</p>
          <p>D. Nostalgic</p>
          <p>The correct answer is C. The author questions the value of AI advances, uses quotation marks around "advances" and "improve" to suggest doubt, and points out potential negative consequences.</p>
        `,
        completed: false,
      },
    ],
  },
  vocabulary: {
    id: "vocabulary",
    title: "Vocabulary in Context",
    description: "Master understanding words as they're used in passages",
    icon: <BookOpen className="h-6 w-6" />,
    color: "bg-purple-500",
    progress: 50,
    subtopics: [
      {
        id: "context-clues",
        title: "Using Context Clues",
        description: "Determine word meanings from surrounding text",
        content: "Detailed tutorial content about using context clues...",
        completed: true,
      },
      {
        id: "word-meanings",
        title: "Multiple Word Meanings",
        description: "Navigate words with several possible definitions",
        content: "Detailed tutorial content about multiple word meanings...",
        completed: false,
      },
      {
        id: "connotation",
        title: "Connotation vs. Denotation",
        description: "Distinguish between literal and implied meanings",
        content: "Detailed tutorial content about connotation vs. denotation...",
        completed: false,
      },
      {
        id: "academic-vocab",
        title: "Academic Vocabulary",
        description: "Learn common scholarly terms found on the SAT",
        content: "Detailed tutorial content about academic vocabulary...",
        completed: false,
      },
    ],
  },
}

// Math topics data
const mathTopicsData: Record<string, TopicData> = {
  algebra: {
    id: "algebra",
    title: "Algebra",
    description: "Master equations, functions, and algebraic relationships",
    icon: <Calculator className="h-6 w-6" />,
    color: "bg-red-500",
    progress: 90,
    subtopics: [
      {
        id: "linear-equations",
        title: "Linear Equations",
        description: "Solve and graph equations in the form y = mx + b",
        content: `
          <div class="space-y-6">
            <div class="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
              <h3 class="text-red-700 font-bold text-lg">Learning Objective</h3>
              <p>Master solving and graphing linear equations in the form y = mx + b for SAT math questions.</p>
            </div>
            
            <h3 class="text-2xl font-bold text-gray-800">Understanding Linear Equations</h3>
            <p>A linear equation is a first-degree equation that forms a straight line when graphed. The standard form is y = mx + b, where:</p>
            
            <div class="flex flex-col md:flex-row gap-6 my-6 justify-center">
              <div class="bg-gray-50 p-4 rounded-md border border-gray-200 flex-1 max-w-xs">
                <h4 class="font-semibold text-gray-700 mb-2 text-center">Slope (m)</h4>
                <div class="flex justify-center">
                  <div class="bg-red-100 p-3 rounded-md">
                    <p class="text-center font-mono text-lg">m = rise/run</p>
                  </div>
                </div>
                <p class="text-sm mt-3 text-center">Measures the steepness of the line</p>
              </div>
              <div class="bg-gray-50 p-4 rounded-md border border-gray-200 flex-1 max-w-xs">
                <h4 class="font-semibold text-gray-700 mb-2 text-center">Y-intercept (b)</h4>
                <div class="flex justify-center">
                  <div class="bg-red-100 p-3 rounded-md">
                    <p class="text-center font-mono text-lg">b = y when x = 0</p>
                  </div>
                </div>
                <p class="text-sm mt-3 text-center">Where the line crosses the y-axis</p>
              </div>
            </div>
            
            <h3 class="text-2xl font-bold text-gray-800">Graphing Linear Equations</h3>
            <p>To graph a linear equation:</p>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-4">
              <div>
                <ol class="space-y-3 list-decimal pl-5">
                  <li>
                    <span class="font-medium">Find the y-intercept (b)</span>
                    <p class="text-sm">Plot the point (0, b) on the y-axis</p>
                  </li>
                  <li>
                    <span class="font-medium">Use the slope (m) to find another point</span>
                    <p class="text-sm">From the y-intercept, move right by the denominator of m and up by the numerator</p>
                  </li>
                  <li>
                    <span class="font-medium">Draw a line through the points</span>
                    <p class="text-sm">Extend the line in both directions</p>
                  </li>
                </ol>
              </div>
              <div class="flex justify-center items-center">
                <img src="/placeholder.svg?height=200&width=300" alt="Graphing a Linear Equation" class="rounded-lg" />
              </div>
            </div>
            
            <div class="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-md">
              <h3 class="text-yellow-700 font-bold">SAT Tip</h3>
              <p>When given two points, you can find the slope using the formula: m = (y₂ - y₁)/(x₂ - x₁)</p>
            </div>
            
            <h3 class="text-2xl font-bold text-gray-800">Solving Linear Equations</h3>
            <p>To solve a linear equation for x:</p>
            
            <div class="bg-gray-50 p-5 rounded-lg border border-gray-200 my-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 class="font-semibold text-gray-700 mb-3">Steps to Solve</h4>
                  <ol class="space-y-2 list-decimal pl-5">
                    <li>Move all terms with variables to one side</li>
                    <li>Move all constants to the other side</li>
                    <li>Combine like terms</li>
                    <li>Divide both sides by the coefficient of the variable</li>
                  </ol>
                </div>
                <div>
                  <h4 class="font-semibold text-gray-700 mb-3">Example</h4>
                  <div class="space-y-2 font-mono">
                    <p>3x + 5 = 2x - 7</p>
                    <p>3x - 2x = -7 - 5</p>
                    <p>x = -12</p>
                  </div>
                </div>
              </div>
            </div>
            
            <h3 class="text-2xl font-bold text-gray-800">Practice Example</h3>
            <div class="bg-gray-50 p-5 rounded-lg border border-gray-200 my-4">
              <p class="font-semibold">Find the equation of the line that passes through the points (2, 5) and (4, 9).</p>
              
              <div class="mt-4 space-y-4">
                <div class="bg-white p-3 rounded border border-gray-200">
                  <p class="font-medium">Step 1: Find the slope</p>
                  <p class="font-mono mt-2">m = (9 - 5)/(4 - 2) = 4/2 = 2</p>
                </div>
                
                <div class="bg-white p-3 rounded border border-gray-200">
                  <p class="font-medium">Step 2: Use point-slope form</p>
                  <p class="font-mono mt-2">y - y₁ = m(x - x₁)</p>
                  <p class="font-mono">y - 5 = 2(x - 2)</p>
                </div>
                
                <div class="bg-white p-3 rounded border border-gray-200">
                  <p class="font-medium">Step 3: Convert to slope-intercept form</p>
                  <p class="font-mono mt-2">y - 5 = 2x - 4</p>
                  <p class="font-mono">y = 2x + 1</p>
                </div>
              </div>
              
              <div class="mt-4 bg-green-50 p-3 rounded-md">
                <p class="text-green-800"><span class="font-bold">Answer:</span> y = 2x + 1</p>
              </div>
            </div>
            
            <div class="flex justify-center my-6">
              <div class="bg-red-100 rounded-lg p-4 max-w-md">
                <h4 class="font-bold text-center text-red-800 mb-2">Key Takeaways</h4>
                <ul class="space-y-2">
                  <li class="flex items-center">
                    <svg class="h-5 w-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    Linear equations have the form y = mx + b
                  </li>
                  <li class="flex items-center">
                    <svg class="h-5 w-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    The slope (m) represents the rate of change
                  </li>
                  <li class="flex items-center">
                    <svg class="h-5 w-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    The y-intercept (b) is where the line crosses the y-axis
                  </li>
                </ul>
              </div>
            </div>
          </div>
        `,
        completed: true,
      },
      {
        id: "quadratic-equations",
        title: "Quadratic Equations",
        description: "Master equations in the form ax² + bx + c = 0",
        content: `
          <div class="space-y-6">
            <div class="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
              <h3 class="text-red-700 font-bold text-lg">Learning Objective</h3>
              <p>Learn to solve quadratic equations using multiple methods and understand their applications on the SAT.</p>
            </div>
            
            <h3 class="text-2xl font-bold text-gray-800">Understanding Quadratic Equations</h3>
            <p>A quadratic equation is a second-degree polynomial equation in the form ax² + bx + c = 0, where a ≠ 0.</p>
            
            <div class="my-6 flex justify-center">
              <img src="/placeholder.svg?height=200&width=400" alt="Parabola Graph" class="rounded-lg" />
            </div>
            
            <h3 class="text-2xl font-bold text-gray-800">Solving Methods</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
              <div class="bg-gray-50 p-4 rounded-md border border-gray-200">
                <h4 class="font-semibold text-gray-700 mb-2 text-center">Factoring</h4>
                <div class="bg-red-100 p-3 rounded-md">
                  <p class="text-center font-mono text-sm">ax² + bx + c = 0</p>
                  <p class="text-center font-mono text-sm">(px + q)(rx + s) = 0</p>
                  <p class="text-center font-mono text-sm">x = -q/p or x = -s/r</p>
                </div>
                <p class="text-xs mt-2 text-center">Best for equations that factor easily</p>
              </div>
              
              <div class="bg-gray-50 p-4 rounded-md border border-gray-200">
                <h4 class="font-semibold text-gray-700 mb-2 text-center">Quadratic Formula</h4>
                <div class="bg-red-100 p-3 rounded-md">
                  <p class="text-center font-mono text-sm">x = (-b ± √(b² - 4ac))/2a</p>
                </div>
                <p class="text-xs mt-2 text-center">Works for any quadratic equation</p>
              </div>
              
              <div class="bg-gray-50 p-4 rounded-md border border-gray-200">
                <h4 class="font-semibold text-gray-700 mb-2 text-center">Completing the Square</h4>
                <div class="bg-red-100 p-3 rounded-md">
                  <p class="text-center font-mono text-sm">x² + bx + c = 0</p>
                  <p class="text-center font-mono text-sm">x² + bx + (b/2)² = (b/2)² - c</p>
                  <p class="text-center font-mono text-sm">(x + b/2)² = (b/2)² - c</p>
                </div>
                <p class="text-xs mt-2 text-center">Useful for converting to vertex form</p>
              </div>
            </div>
            
            <div class="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-md">
              <h3 class="text-yellow-700 font-bold">SAT Tip</h3>
              <p>The discriminant (b² - 4ac) tells you about the solutions:</p>
              <ul class="list-disc pl-5 mt-2 space-y-1">
                <li>If b² - 4ac > 0: Two real solutions</li>
                <li>If b² - 4ac = 0: One real solution (repeated)</li>
                <li>If b² - 4ac < 0: Two complex solutions (no real solutions)</li>
              </ul>
            </div>
            
            <h3 class="text-2xl font-bold text-gray-800">Practice Example</h3>
            <div class="bg-gray-50 p-5 rounded-lg border border-gray-200 my-4">
              <p class="font-semibold">Solve the quadratic equation: 2x² - 7x - 4 = 0</p>
              
              <div class="mt-4 space-y-4">
                <div class="bg-white p-3 rounded border border-gray-200">
                  <p class="font-medium">Method 1: Factoring</p>
                  <div class="font-mono mt-2 space-y-1">
                    <p>2x² - 7x - 4 = 0</p>
                    <p>(2x + 1)(x - 4) = 0</p>
                    <p>x = -1/2 or x = 4</p>
                  </div>
                </div>
                
                <div class="bg-white p-3 rounded border border-gray-200">
                  <p class="font-medium">Method 2: Quadratic Formula</p>
                  <div class="font-mono mt-2 space-y-1">
                    <p>a = 2, b = -7, c = -4</p>
                    <p>x = (-(-7) ± √((-7)² - 4(2)(-4)))/2(2)</p>
                    <p>x = (7 ± √(49 + 32))/4</p>
                    <p>x = (7 ± √81)/4</p>
                    <p>x = (7 ± 9)/4</p>
                    <p>x = 4 or x = -1/2</p>
                  </div>
                </div>
              </div>
              
              <div class="mt-4 bg-green-50 p-3 rounded-md">
                <p class="text-green-800"><span class="font-bold">Answer:</span> x = -1/2 or x = 4</p>
              </div>
            </div>
            
            <div class="flex justify-center my-6">
              <div class="bg-red-100 rounded-lg p-4 max-w-md">
                <h4 class="font-bold text-center text-red-800 mb-2">Key Takeaways</h4>
                <ul class="space-y-2">
                  <li class="flex items-center">
                    <svg class="h-5 w-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    Quadratic equations have the form ax² + bx + c = 0
                  </li>
                  <li class="flex items-center">
                    <svg class="h-5 w-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    Multiple solving methods: factoring, quadratic formula, completing the square
                  </li>
                  <li class="flex items-center">
                    <svg class="h-5 w-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    A quadratic equation can have 0, 1, or 2 real solutions
                  </li>
                </ul>
              </div>
            </div>
          </div>
        `,
        completed: true,
      },
      {
        id: "inequalities",
        title: "Inequalities",
        description: "Solve and graph expressions with <, >, ≤, ≥",
        content: `
          <div class="space-y-6">
            <div class="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
              <h3 class="text-red-700 font-bold text-lg">Learning Objective</h3>
              <p>Master solving and graphing linear inequalities for the SAT math section.</p>
            </div>
            
            <h3 class="text-2xl font-bold text-gray-800">Understanding Inequalities</h3>
            <p>Inequalities compare expressions using the symbols <, >, ≤, or ≥ instead of equals signs.</p>
            
            <div class="overflow-x-auto my-4">
              <table class="min-w-full bg-white border border-gray-200 rounded-md">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="py-2 px-4 border-b text-left">Symbol</th>
                    <th class="py-2 px-4 border-b text-left">Meaning</th>
                    <th class="py-2 px-4 border-b text-left">Example</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="py-2 px-4 border-b font-medium">&lt;</td>
                    <td class="py-2 px-4 border-b">Less than</td>
                    <td class="py-2 px-4 border-b">x &lt; 5</td>
                  </tr>
                  <tr>
                    <td class="py-2 px-4 border-b font-medium">&gt;</td>
                    <td class="py-2 px-4 border-b">Greater than</td>
                    <td class="py-2 px-4 border-b">x &gt; 3</td>
                  </tr>
                  <tr>
                    <td class="py-2 px-4 border-b font-medium">≤</td>
                    <td class="py-2 px-4 border-b">Less than or equal to</td>
                    <td class="py-2 px-4 border-b">x ≤ 7</td>
                  </tr>
                  <tr>
                    <td class="py-2 px-4 border-b font-medium">≥</td>
                    <td class="py-2 px-4 border-b">Greater than or equal to</td>
                    <td class="py-2 px-4 border-b">x ≥ 2</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <h3 class="text-2xl font-bold text-gray-800">Solving Linear Inequalities</h3>
            <p>Solving inequalities is similar to solving equations, with one important difference:</p>
            
            <div class="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-md my-4">
              <h3 class="text-yellow-700 font-bold">Important Rule</h3>
              <p>When you multiply or divide both sides of an inequality by a negative number, you must reverse the inequality symbol.</p>
              <div class="font-mono mt-2">
                <p>If x &lt; 5, then -x &gt; -5</p>
              </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-4">
              <div>
                <h4 class="font-semibold text-gray-700 mb-3">Steps to Solve</h4>
                <ol class="space-y-2 list-decimal pl-5">
                  <li>Isolate the variable on one side</li>
                  <li>Perform the same operations on both sides</li>
                  <li>Remember to flip the inequality sign when multiplying or dividing by a negative number</li>
                </ol>
              </div>
              <div>
                <h4 class="font-semibold text-gray-700 mb-3">Example</h4>
                <div class="space-y-2 font-mono bg-gray-50 p-3 rounded">
                  <p>-2x + 3 &lt; 7</p>
                  <p>-2x &lt; 4</p>
                  <p>x &gt; -2</p>
                  <p class="text-sm text-gray-500">(Note: We flipped the sign when dividing by -2)</p>
                </div>
              </div>
            </div>
            
            <h3 class="text-2xl font-bold text-gray-800">Graphing Inequalities</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-4">
              <div>
                <h4 class="font-semibold text-gray-700 mb-3">On a Number Line</h4>
                <ul class="space-y-3">
                  <li class="flex items-start">
                    <span class="bg-red-100 text-red-800 p-1 rounded-full w-6 h-6 inline-flex items-center justify-center mr-2 flex-shrink-0">•</span>
                    <div>
                      <p class="font-medium">Open circle (○) for &lt; or &gt;</p>
                      <p class="text-sm">Shows the endpoint is not included</p>
                    </div>
                  </li>
                  <li class="flex items-start">
                    <span class="bg-red-100 text-red-800 p-1 rounded-full w-6 h-6 inline-flex items-center justify-center mr-2 flex-shrink-0">•</span>
                    <div>
                      <p class="font-medium">Closed circle (●) for ≤ or ≥</p>
                      <p class="text-sm">Shows the endpoint is included</p>
                    </div>
                  </li>
                  <li class="flex items-start">
                    <span class="bg-red-100 text-red-800 p-1 rounded-full w-6 h-6 inline-flex items-center justify-center mr-2 flex-shrink-0">•</span>
                    <div>
                      <p class="font-medium">Shade in the direction of the solution</p>
                      <p class="text-sm">Left for &lt; or ≤, right for &gt; or ≥</p>
                    </div>
                  </li>
                </ul>
              </div>
              <div class="flex justify-center items-center">
                <img src="/placeholder.svg?height=100&width=300" alt="Inequality on Number Line" class="rounded-lg" />
              </div>
            </div>
            
            <h3 class="text-2xl font-bold text-gray-800">Practice Example</h3>
            <div class="bg-gray-50 p-5 rounded-lg border border-gray-200 my-4">
              <p class="font-semibold">Solve and graph the inequality: 3(x - 2) + 4 ≥ 2x + 1</p>
              
              <div class="mt-4 space-y-4">
                <div class="bg-white p-3 rounded border border-gray-200">
                  <p class="font-medium">Step 1: Expand the left side</p>
                  <p class="font-mono mt-2">3x - 6 + 4 ≥ 2x + 1</p>
                  <p class="font-mono">3x - 2 ≥ 2x + 1</p>
                </div>
                
                <div class="bg-white p-3 rounded border border-gray-200">
                  <p class="font-medium">Step 2: Isolate variable terms</p>
                  <p class="font-mono mt-2">3x - 2x ≥ 1 + 2</p>
                  <p class="font-mono">x ≥ 3</p>
                </div>
                
                <div class="flex justify-center mt-4">
                  <img src="/placeholder.svg?height=80&width=300" alt="Inequality Graph Solution" class="rounded-lg" />
                </div>
              </div>
              
              <div class="mt-4 bg-green-50 p-3 rounded-md">
                <p class="text-green-800"><span class="font-bold">Answer:</span> x ≥ 3</p>
                <p class="text-green-800 text-sm">The solution includes all values of x that are greater than or equal to 3.</p>
              </div>
            </div>
          </div>
        `,
        completed: true,
      },
      {
        id: "functions",
        title: "Functions & Relations",
        description: "Understand input-output relationships and function notation",
        content: `
          <div class="space-y-6">
            <div class="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
              <h3 class="text-red-700 font-bold text-lg">Learning Objective</h3>
              <p>Master function concepts, notation, and applications for the SAT math section.</p>
            </div>
            
            <h3 class="text-2xl font-bold text-gray-800">What is a Function?</h3>
            <p>A function is a relation that assigns exactly one output to each input. Think of it as a machine that takes an input, performs an operation, and produces a unique output.</p>
            
            <div class="flex justify-center my-6">
              <div class="bg-gray-50 p-5 rounded-lg border border-gray-200 max-w-md">
                <div class="flex items-center justify-center">
                  <div class="text-center px-4">
                    <p class="font-medium">Input</p>
                    <p class="text-sm">(x)</p>
                  </div>
                  <div class="text-center px-6 py-3 bg-red-100 rounded-lg mx-4">
                    <p class="font-medium">Function</p>
                    <p class="text-sm">f(x)</p>
                  </div>
                  <div class="text-center px-4">
                    <p class="font-medium">Output</p>
                    <p class="text-sm">f(x) = y</p>
                  </div>
                </div>
              </div>
            </div>
            
            <h3 class="text-2xl font-bold text-gray-800">Function Notation</h3>
            <p>Function notation uses the form f(x) to represent the output when x is the input.</p>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-4">
              <div class="bg-gray-50 p-4 rounded-md border border-gray-200">
                <h4 class="font-semibold text-gray-700 mb-2">Example</h4>
                <div class="font-mono space-y-2">
                  <p>If f(x) = 2x + 3, then:</p>
                  <p>f(4) = 2(4) + 3 = 11</p>
                  <p>f(0) = 2(0) + 3 = 3</p>
                  <p>f(-1) = 2(-1) + 3 = 1</p>
                </div>
              </div>
              <div class="bg-gray-50 p-4 rounded-md border border-gray-200">
                <h4 class="font-semibold text-gray-700 mb-2">Finding Inputs</h4>
                <div class="font-mono space-y-2">
                  <p>If f(x) = 2x + 3 and f(a) = 7, then:</p>
                  <p>2a + 3 = 7</p>
                  <p>2a = 4</p>
                  <p>a = 2</p>
                </div>
              </div>
            </div>
            
            <div class="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-md">
              <h3 class="text-yellow-700 font-bold">SAT Tip</h3>
              <p>The SAT often tests function composition. If f(x) and g(x) are functions, then:</p>
              <ul class="list-disc pl-5 mt-2">
                <li>(f ∘ g)(x) = f(g(x)): Apply g first, then apply f to the result</li>
                <li>(g ∘ f)(x) = g(f(x)): Apply f first, then apply g to the result</li>
              </ul>
            </div>
            
            <h3 class="text-2xl font-bold text-gray-800">Domain and Range</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-4">
              <div class="bg-gray-50 p-4 rounded-md border border-gray-200">
                <h4 class="font-semibold text-gray-700 mb-2 text-center">Domain</h4>
                <p class="text-center">The set of all possible input values (x)</p>
                <div class="mt-3 bg-red-100 p-2 rounded-md">
                  <p class="text-sm text-center">Restrictions: Values that make denominators zero or negative values under even roots</p>
                </div>
              </div>
              <div class="bg-gray-50 p-4 rounded-md border border-gray-200">
                <h4 class="font-semibold text-gray-700 mb-2 text-center">Range</h4>
                <p class="text-center">The set of all possible output values (y)</p>
                <div class="mt-3 bg-red-100 p-2 rounded-md">
                  <p class="text-sm text-center">Example: The range of f(x) = x² is [0, ∞) because squares are never negative</p>
                </div>
              </div>
            </div>
            
            <h3 class="text-2xl font-bold text-gray-800">Practice Example</h3>
            <div class="bg-gray-50 p-5 rounded-lg border border-gray-200 my-4">
              <p class="font-semibold">If f(x) = x² - 3x and g(x) = 2x + 1, find (f ∘ g)(2).</p>
              
              <div class="mt-4 space-y-4">
                <div class="bg-white p-3 rounded border border-gray-200">
                  <p class="font-medium">Step 1: Find g(2)</p>
                  <p class="font-mono mt-2">g(2) = 2(2) + 1 = 5</p>
                </div>
                
                <div class="bg-white p-3 rounded border border-gray-200">
                  <p class="font-medium">Step 2: Find f(g(2)) = f(5)</p>
                  <p class="font-mono mt-2">f(5) = 5² - 3(5)</p>
                  <p class="font-mono">f(5) = 25 - 15 = 10</p>
                </div>
              </div>
              
              <div class="mt-4 bg-green-50 p-3 rounded-md">
                <p class="text-green-800"><span class="font-bold">Answer:</span> (f ∘ g)(2) = 10</p>
              </div>
            </div>
            
            <div class="flex justify-center my-6">
              <div class="bg-red-100 rounded-lg p-4 max-w-md">
                <h4 class="font-bold text-center text-red-800 mb-2">Key Takeaways</h4>
                <ul class="space-y-2">
                  <li class="flex items-center">
                    <svg class="h-5 w-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    A function assigns exactly one output to each input
                  </li>
                  <li class="flex items-center">
                    <svg class="h-5 w-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    f(x) notation represents the output when x is the input
                  </li>
                  <li class="flex items-center">
                    <svg class="h-5 w-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    Domain is the set of valid inputs; range is the set of possible outputs
                  </li>
                </ul>
              </div>
            </div>
          </div>
        `,
        completed: false,
      },
    ],
  },
  // Keep other math topics as they are
}

// Combined data
const allTopicsData = {
  reading: readingTopicsData,
  math: mathTopicsData,
}

// Update the TopicPage component to handle subtopic parameter from URL
export default function TopicPage() {
  const params = useParams()
  const router = useRouter()
  const section = params.section as string
  const topicId = params.topic as string

  // Get the subtopic from the URL query parameter
  const searchParams = new URLSearchParams(window.location.search)
  const subtopicParam = searchParams.get("subtopic")

  // Initialize state with the subtopic from URL or default to 0
  const [activeSubtopic, setActiveSubtopic] = useState(subtopicParam ? Number.parseInt(subtopicParam) : 0)

  // Get topic data based on section and topic ID
  const topicData = allTopicsData[section as "reading" | "math"]?.[topicId]

  // Set up effect to handle URL changes
  useEffect(() => {
    if (subtopicParam) {
      const subtopicIndex = Number.parseInt(subtopicParam)
      if (!isNaN(subtopicIndex) && subtopicIndex >= 0 && subtopicIndex < topicData?.subtopics.length) {
        setActiveSubtopic(subtopicIndex)
      }
    }
  }, [subtopicParam, topicData])

  if (!topicData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Topic not found</h1>
          <Button onClick={() => router.push("/tutorials")}>Return to Tutorials</Button>
        </div>
      </div>
    )
  }

  const handleSubtopicChange = (index: number) => {
    setActiveSubtopic(index)
    // Update URL without full page reload
    const url = new URL(window.location.href)
    url.searchParams.set("subtopic", index.toString())
    window.history.pushState({}, "", url)
  }

  const handleComplete = () => {
    // In a real app, you would update the completion status in your database
    alert("Congratulations! You have completed this subtopic.")
  }

  const handleBack = () => {
    router.push("/tutorials")
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <Button variant="outline" onClick={handleBack} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Learning Path
        </Button>

        <div className="flex items-center mb-6">
          <div className={`w-16 h-16 rounded-full ${topicData.color} flex items-center justify-center mr-4 shadow-lg`}>
            <div className="text-white">{topicData.icon}</div>
          </div>
          <div>
            <h1 className="text-3xl font-bold">{topicData.title}</h1>
            <p className="text-gray-600">{topicData.description}</p>
          </div>
        </div>

        <div className="flex items-center mb-8">
          <Progress value={topicData.progress} className="h-3 w-64 mr-3" />
          <span className="font-semibold text-gray-700">{topicData.progress}% complete</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <Card className="shadow-lg border-2">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
                <CardTitle>Subtopics</CardTitle>
                <CardDescription>Complete all subtopics to master this skill</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <ul className="divide-y">
                  {topicData.subtopics.map((subtopic, index) => (
                    <li key={subtopic.id}>
                      <button
                        onClick={() => handleSubtopicChange(index)}
                        className={`w-full text-left p-4 flex items-center justify-between hover:bg-gray-50 transition-colors ${
                          activeSubtopic === index ? "bg-blue-50 border-l-4 border-blue-500" : ""
                        }`}
                      >
                        <div className="flex items-center">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                              subtopic.completed ? "bg-green-500" : "bg-gray-200"
                            }`}
                          >
                            {subtopic.completed ? <Check className="h-4 w-4 text-white" /> : index + 1}
                          </div>
                          <div>
                            <p className="font-medium">{subtopic.title}</p>
                            <p className="text-xs text-gray-500">{subtopic.description}</p>
                          </div>
                        </div>
                        <ChevronRight
                          className={`h-5 w-5 text-gray-400 ${activeSubtopic === index ? "transform rotate-90" : ""}`}
                        />
                      </button>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            <Card className="shadow-xl border-0">
              <CardHeader className={`${topicData.color} text-white`}>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-2xl">{topicData.subtopics[activeSubtopic].title}</CardTitle>
                  <Badge variant="outline" className="text-white border-white">
                    {activeSubtopic + 1} of {topicData.subtopics.length}
                  </Badge>
                </div>
                <CardDescription className="text-white opacity-90">
                  {topicData.subtopics[activeSubtopic].description}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: topicData.subtopics[activeSubtopic].content }}
                />
              </CardContent>
              <CardFooter className="flex justify-between bg-gray-50 p-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    if (activeSubtopic > 0) {
                      handleSubtopicChange(activeSubtopic - 1)
                    }
                  }}
                  disabled={activeSubtopic === 0}
                >
                  Previous
                </Button>
                <Button
                  className={topicData.subtopics[activeSubtopic].completed ? "bg-green-500 hover:bg-green-600" : ""}
                  onClick={handleComplete}
                >
                  {topicData.subtopics[activeSubtopic].completed ? "Already Completed ✓" : "Mark as Complete"}
                </Button>
                <Button
                  onClick={() => {
                    if (activeSubtopic < topicData.subtopics.length - 1) {
                      handleSubtopicChange(activeSubtopic + 1)
                    }
                  }}
                  disabled={activeSubtopic === topicData.subtopics.length - 1}
                >
                  Next
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

