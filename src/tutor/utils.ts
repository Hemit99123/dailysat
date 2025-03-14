import type { Question, TutorResponse } from "./types"

// This function extracts a tutor response from the AI's text
export function extractTutorResponse(text: string): TutorResponse | null {
  try {
    console.log("Raw response:", text)

    // Extract the explanation (everything before "QUESTION:")
    const questionIndex = text.indexOf("QUESTION:")

    if (questionIndex === -1) {
      // If we can't find the QUESTION section, return a default response
      return createDefaultResponseForQuestion(text)
    }

    const explanation = text.substring(0, questionIndex).trim()
    const questionPart = text.substring(questionIndex)

    // Extract the question text
    const questionMatch = questionPart.match(/QUESTION:\s*([^\n]+)/)
    if (!questionMatch) {
      return createDefaultResponseForQuestion(text)
    }

    const questionText = questionMatch[1].trim()

    // Extract the choices
    const choices = extractChoices(questionPart)
    if (choices.length === 0) {
      return createDefaultResponseForQuestion(text)
    }

    // Extract the explanation for the answer
    const explanationMatch = questionPart.match(/EXPLANATION:\s*([^\n]+)/)
    const questionExplanation = explanationMatch ? explanationMatch[1].trim() : "No explanation provided."

    // Extract the hint
    const hintMatch = questionPart.match(/HINT:\s*([^\n]+)/)
    const hint = hintMatch ? hintMatch[1].trim() : "Think about the concepts discussed in the explanation."

    // Create the question object
    const question: Question = {
      text: questionText,
      choices,
      explanation: questionExplanation,
      hint,
    }

    // Return the tutor response
    return {
      explanation,
      question,
    }
  } catch (error) {
    console.error("Error in extractTutorResponse:", error)
    return createDefaultResponseForQuestion(text)
  }
}

// Helper function to extract choices from the question part
function extractChoices(questionPart: string): any[] {
  const choices = []

  // Match all options (A, B, C, D) with their text
  const optionRegex = /([A-D])\.\s*([^\n]+)/g
  let match

  while ((match = optionRegex.exec(questionPart)) !== null) {
    const id = match[1]
    const text = match[2].trim()
    const correct = text.includes("(CORRECT)")

    // Remove the (CORRECT) marker from the text
    const cleanText = text.replace(/\s*$$CORRECT$$\s*/, "")

    choices.push({
      id,
      text: cleanText,
      correct,
    })
  }

  // If we couldn't find any choices, try a different regex
  if (choices.length === 0) {
    const lines = questionPart.split("\n")
    for (const line of lines) {
      const optionMatch = line.match(/^([A-D])\.\s*(.+)$/)
      if (optionMatch) {
        const id = optionMatch[1]
        const text = optionMatch[2].trim()
        const correct = text.includes("(CORRECT)")
        const cleanText = text.replace(/\s*$$CORRECT$$\s*/, "")

        choices.push({
          id,
          text: cleanText,
          correct,
        })
      }
    }
  }

  // Ensure we have exactly one correct answer
  const correctChoices = choices.filter((c) => c.correct)
  if (correctChoices.length !== 1 && choices.length > 0) {
    // If no correct answer or multiple correct answers, make the first one correct
    choices.forEach((c) => (c.correct = false))
    choices[0].correct = true
  }

  // Ensure we have all four choices
  const ids = ["A", "B", "C", "D"]
  for (const id of ids) {
    if (!choices.find((c) => c.id === id)) {
      choices.push({
        id,
        text: `Option ${id}`,
        correct: false,
      })
    }
  }

  return choices
}

// Create a default response when extraction fails
function createDefaultResponseForQuestion(text: string): TutorResponse {
  return {
    explanation: text,
    question: {
      text: "Based on the explanation, what is the correct answer?",
      choices: [
        { id: "A", text: "Option A", correct: true },
        { id: "B", text: "Option B", correct: false },
        { id: "C", text: "Option C", correct: false },
        { id: "D", text: "Option D", correct: false },
      ],
      explanation: "This is the explanation for the correct answer.",
      hint: "Think about the concepts discussed in the explanation.",
    },
  }
}

// This function formats the message content for display
export function formatMessageContent(content: string): string {
  // If the content contains "QUESTION:", only return the part before it
  const questionIndex = content.indexOf("QUESTION:")
  if (questionIndex !== -1) {
    return content.substring(0, questionIndex).trim()
  }

  return content
}

// Helper function to clean up JSON text
function cleanJsonText(text: string): string {
  try {
    // Remove any non-JSON content before the first {
    const startIndex = text.indexOf("{")
    if (startIndex === -1) return text

    // Remove any content after the last }
    const endIndex = text.lastIndexOf("}")
    if (endIndex === -1) return text.substring(startIndex)

    // Extract the JSON part
    let jsonText = text.substring(startIndex, endIndex + 1)

    // Handle common JSON formatting issues
    jsonText = jsonText
      // Replace escaped quotes with temporary placeholders
      .replace(/\\"/g, "___QUOTE___")
      // Replace unescaped quotes within values
      .replace(/([^\\])"/g, '$1\\"')
      // Restore escaped quotes
      .replace(/___QUOTE___/g, '\\"')
      // Fix missing commas between properties
      .replace(/}(\s*){/g, "},\n{")
      // Fix missing commas between array items
      .replace(/}(\s*)\[/g, "},\n[")
      .replace(/\](\s*){/g, "],\n{")

    // Try to fix common JSON syntax errors
    try {
      JSON.parse(jsonText)
      return jsonText
    } catch (e) {
      // If parsing fails, try more aggressive cleaning
      console.log("Initial JSON cleaning failed, trying more aggressive approach")

      // Try to extract just the explanation and question parts
      const explanationMatch = text.match(/"explanation"\s*:\s*"([^"]+)"/i)
      const questionMatch = text.match(/"question"\s*:\s*(\{[\s\S]*?\})/i)

      if (explanationMatch && questionMatch) {
        const explanation = explanationMatch[1]
        const question = questionMatch[1]

        // Construct a valid JSON object
        return `{"explanation":"${explanation}","question":${question}}`
      }
    }

    return jsonText
  } catch (error) {
    console.error("Error in cleanJsonText:", error)
    return text
  }
}

// This function creates a valid tutor response from text
function createTutorResponseFromText(text: string): TutorResponse | null {
  try {
    console.log("Creating tutor response from text")

    // Extract explanation
    let explanation = ""
    const explanationPatterns = [/"explanation"\s*:\s*"([^"]+)"/i, /explanation:\s*([^{]+)/i]

    for (const pattern of explanationPatterns) {
      const match = text.match(pattern)
      if (match && match[1]) {
        explanation = match[1].trim()
        break
      }
    }

    // If we couldn't find an explanation, use the first part of the text
    if (!explanation) {
      // Use the text up to the first occurrence of "question" or "choices"
      const questionIndex = text.indexOf('"question"')
      const choicesIndex = text.indexOf('"choices"')

      if (questionIndex !== -1 || choicesIndex !== -1) {
        const cutoffIndex = Math.min(
          questionIndex !== -1 ? questionIndex : Number.MAX_SAFE_INTEGER,
          choicesIndex !== -1 ? choicesIndex : Number.MAX_SAFE_INTEGER,
        )

        explanation = text.substring(0, cutoffIndex).trim()
      } else {
        // If we can't find question or choices, use the first 200 characters
        explanation = text.substring(0, Math.min(200, text.length)).trim()
        if (explanation.length === 200) explanation += "..."
      }
    }

    // Extract or create a question
    const question = extractQuestion(text)

    if (!question) {
      // If we couldn't extract a question but have an explanation, create a default question
      if (explanation) {
        return {
          explanation,
          question: {
            text: "Based on the explanation, what is the correct answer?",
            choices: [
              { id: "A", text: "Option A", correct: true },
              { id: "B", text: "Option B", correct: false },
              { id: "C", text: "Option C", correct: false },
              { id: "D", text: "Option D", correct: false },
            ],
            explanation: "This is the explanation for the correct answer.",
            hint: "Here's a hint to help you solve the problem.",
          },
        }
      }
      return null
    }

    return {
      explanation,
      question,
    }
  } catch (error) {
    console.error("Error in createTutorResponseFromText:", error)
    return null
  }
}

// This function extracts a question from the AI's response text
function extractQuestion(text: string): Question | null {
  try {
    // First, try to find and parse a question object
    try {
      const questionMatch = text.match(/"question"\s*:\s*(\{[\s\S]*?\})/i)
      if (questionMatch) {
        const questionJson = questionMatch[1]
        // Try to parse the question JSON
        try {
          const question = JSON.parse(questionJson)

          if (question.text && Array.isArray(question.choices)) {
            return validateAndFixQuestion(question)
          }
        } catch (parseError) {
          console.error("Failed to parse question JSON:", parseError)
          // Continue to next method
        }
      }
    } catch (parseError) {
      console.error("Failed to extract question object:", parseError)
      // Continue to fallback methods
    }

    // Try to find and parse a question directly
    try {
      const textMatch = text.match(/"text"\s*:\s*"([^"]+)"/i)
      const choicesMatch = text.match(/"choices"\s*:\s*(\[[\s\S]*?\])/i)

      if (textMatch && choicesMatch) {
        const questionText = textMatch[1]
        const choicesJson = choicesMatch[1]

        try {
          const choices = JSON.parse(choicesJson)

          if (Array.isArray(choices)) {
            return validateAndFixQuestion({
              text: questionText,
              choices,
              explanation: extractExplanation(text) || "No explanation provided.",
              hint: extractHint(text) || "Think about the steps needed to solve this problem.",
            })
          }
        } catch (parseError) {
          console.error("Failed to parse choices JSON:", parseError)
          // Continue to next method
        }
      }
    } catch (parseError) {
      console.error("Failed to parse question and choices:", parseError)
      // Continue to fallback methods
    }

    // If we couldn't parse JSON, try to extract the question and choices directly
    return createQuestionFromText(text)
  } catch (error) {
    console.error("Error in extractQuestion:", error)
    return null
  }
}

// This function creates a valid question object from text
function createQuestionFromText(text: string): Question | null {
  try {
    // Extract the question text
    let questionText = ""
    const questionPatterns = [
      /"text"\s*:\s*"([^"]+)"/i,
      /question:\s*([^{]+)/i,
      /Solve for x in the equation ([^"]+)/i,
      /Find the value of x in ([^"]+)/i,
      /What is the value of x in ([^"]+)/i,
      /Solve the equation ([^"]+)/i,
      /Simplify the expression ([^"]+)/i,
      /Calculate ([^"]+)/i,
      /Evaluate ([^"]+)/i,
    ]

    for (const pattern of questionPatterns) {
      const match = text.match(pattern)
      if (match && match[1]) {
        questionText = match[1].trim()
        break
      }
    }

    // If we couldn't find a specific question, look for a question-like sentence
    if (!questionText) {
      const sentences = text.split(/[.!?]/)
      for (const sentence of sentences) {
        if (
          sentence.includes("?") ||
          sentence.toLowerCase().includes("solve") ||
          sentence.toLowerCase().includes("find") ||
          sentence.toLowerCase().includes("calculate") ||
          sentence.toLowerCase().includes("what is")
        ) {
          questionText = sentence.trim()
          break
        }
      }
    }

    // If we still don't have a question, return null
    if (!questionText) {
      return null
    }

    // Create default choices
    const choices = [
      { id: "A", text: "x = 10", correct: true },
      { id: "B", text: "x = 5", correct: false },
      { id: "C", text: "x = 0", correct: false },
      { id: "D", text: "x = -5", correct: false },
    ]

    // Try to extract actual choices from the text
    const choiceTexts = extractChoiceTexts(text)
    if (choiceTexts.length > 0) {
      // Replace default choice texts with extracted ones
      for (let i = 0; i < Math.min(choiceTexts.length, choices.length); i++) {
        choices[i].text = choiceTexts[i]
      }
    }

    // Try to determine which choice is correct
    const correctIndex = determineCorrectChoice(text)
    if (correctIndex !== -1) {
      // Reset all choices to incorrect
      choices.forEach((c) => (c.correct = false))
      // Set the determined correct choice
      if (correctIndex < choices.length) {
        choices[correctIndex].correct = true
      } else {
        choices[0].correct = true
      }
    }

    // Extract or create explanation and hint
    const explanation =
      extractExplanation(text) ||
      "To solve this problem, isolate the variable by performing the same operation on both sides of the equation."

    const hint = extractHint(text) || "Remember to use inverse operations to isolate the variable."

    return {
      text: questionText,
      choices,
      explanation,
      hint,
    }
  } catch (error) {
    console.error("Error in createQuestionFromText:", error)
    return null
  }
}

// Helper function to extract choice texts from the AI's response
function extractChoiceTexts(text: string): string[] {
  const choiceTexts: string[] = []

  // Try to match patterns like "text": "choice text"
  const textMatches = Array.from(text.matchAll(/"text"\s*:\s*"([^"]+)"/gi))
  if (textMatches.length > 0) {
    textMatches.forEach((match) => {
      if (match[1]) choiceTexts.push(match[1])
    })
  }

  // If we couldn't find choices that way, try other patterns
  if (choiceTexts.length === 0) {
    // Try to match patterns like A. choice text or A) choice text
    const choicePattern = /([A-D])[.)\s]\s*([^,\n]+)/gi
    let match
    while ((match = choicePattern.exec(text)) !== null) {
      choiceTexts.push(match[2].trim())
    }
  }

  // If we still don't have choices, try to extract any x = something patterns
  if (choiceTexts.length === 0) {
    const xValuePattern = /x\s*=\s*(-?\d+)/gi
    let match
    while ((match = xValuePattern.exec(text)) !== null) {
      choiceTexts.push(`x = ${match[1]}`)
    }
  }

  return choiceTexts
}

// Helper function to determine which choice is correct
function determineCorrectChoice(text: string): number {
  // Try to find patterns indicating the correct answer
  const correctPatterns = [
    /correct answer is ([A-D])/i,
    /answer is ([A-D])/i,
    /([A-D]) is correct/i,
    /"correct"\s*:\s*true/i,
  ]

  for (const pattern of correctPatterns) {
    const match = text.match(pattern)
    if (match && match[1]) {
      // Convert A, B, C, D to 0, 1, 2, 3
      return match[1].charCodeAt(0) - 65
    }
  }

  // If we find "correct": true near a choice, use that
  const correctTrueIndex = text.indexOf('"correct": true')
  if (correctTrueIndex !== -1) {
    // Look for the nearest id before this
    const idPattern = /"id"\s*:\s*"([A-D])"/gi
    let lastId = null
    let match

    while ((match = idPattern.exec(text)) !== null) {
      if (match.index < correctTrueIndex) {
        lastId = match[1]
      } else {
        break
      }
    }

    if (lastId) {
      return lastId.charCodeAt(0) - 65
    }
  }

  return -1 // Couldn't determine
}

// Helper function to extract explanation
function extractExplanation(text: string): string | null {
  const explanationPatterns = [/"explanation"\s*:\s*"([^"]+)"/i, /explanation:\s*([^"]+?)(?=\s*"hint"|$)/i]

  for (const pattern of explanationPatterns) {
    const match = text.match(pattern)
    if (match && match[1]) {
      return match[1].trim()
    }
  }

  return null
}

// Helper function to extract hint
function extractHint(text: string): string | null {
  const hintPatterns = [/"hint"\s*:\s*"([^"]+)"/i, /hint:\s*([^"]+?)(?=\s*"explanation"|$)/i]

  for (const pattern of hintPatterns) {
    const match = text.match(pattern)
    if (match && match[1]) {
      return match[1].trim()
    }
  }

  return null
}

// Validate and fix a question object to ensure it meets our requirements
function validateAndFixQuestion(question: any): Question {
  // Ensure question has all required fields
  if (!question.text) {
    question.text = "Based on the previous explanation, what is the correct answer?"
  }

  // Ensure choices array exists
  if (!Array.isArray(question.choices) || question.choices.length === 0) {
    question.choices = [
      { id: "A", text: "x = 10", correct: true },
      { id: "B", text: "x = 5", correct: false },
      { id: "C", text: "x = 0", correct: false },
      { id: "D", text: "x = -5", correct: false },
    ]
  } else if (question.choices.length < 4) {
    // Add missing choices
    while (question.choices.length < 4) {
      question.choices.push({
        id: String.fromCharCode(65 + question.choices.length),
        text: `Option ${String.fromCharCode(65 + question.choices.length)}`,
        correct: false,
      })
    }
  }

  // Ensure each choice has id, text, and correct properties
  question.choices.forEach((choice: any, index: number) => {
    if (!choice.id) {
      choice.id = String.fromCharCode(65 + index)
    }
    if (!choice.text) {
      choice.text = `Option ${choice.id}`
    }
    if (typeof choice.correct !== "boolean") {
      choice.correct = index === 0
    }
  })

  // Ensure exactly one correct answer
  const correctChoices = question.choices.filter((c: any) => c.correct)
  if (correctChoices.length !== 1) {
    // Reset all to false
    question.choices.forEach((c: any) => (c.correct = false))
    // Set the first one to true
    question.choices[0].correct = true
  }

  // Ensure explanation and hint exist
  if (!question.explanation) {
    question.explanation =
      "To solve this problem, isolate the variable by performing the same operation on both sides of the equation."
  }

  if (!question.hint) {
    question.hint = "Remember to use inverse operations to isolate the variable."
  }

  return question as Question
}

// Validate and fix a tutor response object
function validateAndFixTutorResponse(response: any): TutorResponse {
  // Ensure explanation exists
  if (!response.explanation) {
    response.explanation = "Let me help you understand this concept."
  }

  // Ensure question exists and is valid
  if (!response.question) {
    response.question = {
      text: "Based on the explanation, what is the correct answer?",
      choices: [
        { id: "A", text: "Option A", correct: true },
        { id: "B", text: "Option B", correct: false },
        { id: "C", text: "Option C", correct: false },
        { id: "D", text: "Option D", correct: false },
      ],
      explanation: "This is the explanation for the correct answer.",
      hint: "Here's a hint to help you solve the problem.",
    }
  } else {
    response.question = validateAndFixQuestion(response.question)
  }

  return response as TutorResponse
}

// This function attempts to extract valid JSON from a string
export function extractValidJson(text: string): string | null {
  try {
    // Find the first opening brace
    const startIndex = text.indexOf("{")
    if (startIndex === -1) {
      console.log("No opening brace found in response")
      return null
    }

    // Find the last closing brace
    const endIndex = text.lastIndexOf("}")
    if (endIndex === -1 || endIndex <= startIndex) {
      console.log("No closing brace found in response or invalid JSON structure")
      return null
    }

    // Extract the potential JSON
    const jsonCandidate = text.substring(startIndex, endIndex + 1)

    // Try to parse it to validate
    try {
      JSON.parse(jsonCandidate)
      console.log("Valid JSON extracted")
      return jsonCandidate
    } catch (parseError) {
      console.error("Extracted text is not valid JSON:", parseError)

      // Try to clean the JSON and parse again
      const cleanedJson = cleanJsonText(jsonCandidate)
      try {
        JSON.parse(cleanedJson)
        console.log("Valid JSON extracted after cleaning")
        return cleanedJson
      } catch (cleanError) {
        console.error("Failed to parse even after cleaning:", cleanError)
        return null
      }
    }
  } catch (error) {
    console.error("Failed to extract valid JSON:", error)
    return null
  }
}

// Update the parseTutorResponse function in utils.ts

// Parse the AI response into a structured TutorResponse
export function parseTutorResponse(text: string): TutorResponse | null {
  try {
    console.log("Parsing response of length:", text.length)

    // Wait for a complete response - check if it ends with a closing brace
    if (!text.trim().endsWith("}")) {
      console.warn("Response appears incomplete - doesn't end with }")
      // If we still have a valid JSON somewhere in the text, try to extract it
    }

    // Try to extract valid JSON
    const jsonText = extractValidJson(text)
    if (!jsonText) {
      console.error("No valid JSON found in response")
      return createDefaultResponse()
    }

    // Parse the JSON
    const parsed = JSON.parse(jsonText)

    // Check if the parsed object has the expected properties
    if (!parsed || typeof parsed !== "object") {
      console.error("Invalid response structure - not an object", parsed)
      return createDefaultResponse()
    }

    // Create a response with default values for missing properties
    const response: TutorResponse = {
      basicAnswer: parsed.basicAnswer || "No answer provided.",
      followUpQuestion: parsed.followUpQuestion || "No follow-up question provided.",
      options: {
        A: parsed.options?.A || "Option A",
        B: parsed.options?.B || "Option B",
        C: parsed.options?.C || "Option C",
        D: parsed.options?.D || "Option D",
      },
      explanation: parsed.explanation || "No explanation provided.",
      correctAnswer: parsed.correctAnswer || "A",
      hints: {
        hint1: parsed.hints?.hint1 || "No hint provided.",
        hint2: parsed.hints?.hint2 || "No hint provided.",
        hint3: parsed.hints?.hint3 || "No hint provided.",
      },
    }

    // Validate correctAnswer is one of A, B, C, D
    if (!["A", "B", "C", "D"].includes(response.correctAnswer)) {
      response.correctAnswer = "A"
    }

    return response
  } catch (error) {
    console.error("Error parsing tutor response:", error)
    return createDefaultResponse()
  }
}

// Create a default response when parsing fails
export function createDefaultResponse(): TutorResponse {
  return {
    basicAnswer: "I'm sorry, I couldn't generate a proper response. Please try asking your question again.",
    followUpQuestion: "Would you like to try a different question?",
    options: {
      A: "Yes, let me try again",
      B: "No, I'll ask something else",
      C: "Let me rephrase my question",
      D: "I need help with a different topic",
    },
    explanation: "Sometimes the AI might have trouble understanding or processing certain questions.",
    correctAnswer: "A",
    hints: {
      hint1: "Try asking a more specific question",
      hint2: "Break down complex questions into simpler parts",
      hint3: "Provide context about what you're trying to learn",
    },
  }
}

