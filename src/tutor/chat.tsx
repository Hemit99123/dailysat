"use client"

import type React from "react"
import { useChat } from "ai/react"
import { useState, useRef, useEffect } from "react"
import { WelcomeMessage } from "./welcome-message"
import { StructuredResponse } from "./structured-response"
import { parseTutorResponse, createDefaultResponse } from "./utils"
import type { TutorResponse } from "./types"
import { Send, AlertTriangle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function TutorChat() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [structuredResponses, setStructuredResponses] = useState<Map<string, TutorResponse>>(new Map())
  const [rawResponse, setRawResponse] = useState<string | null>(null)
  const [showDebug, setShowDebug] = useState(false)
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set())

  const { messages, input, handleInputChange, handleSubmit, isLoading, reload, setMessages } = useChat({
    api: "/api/chat",
    onError: (err) => {
      console.error("Chat error:", err)
      setErrorMessage(err.message || "An error occurred while communicating with the AI tutor.")
    },
    onResponse: (response) => {
      // Check if the response is successful
      if (!response.ok) {
        setErrorMessage(`Server error: ${response.statusText}`)
      } else {
        setErrorMessage(null)
      }
    },
    onFinish: (message) => {
      // Process the message once it's fully complete
      if (message.role === "assistant") {
        processCompleteMessage(message)
      }
    },
  })

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, errorMessage, structuredResponses])

  // Process a complete message from the assistant
  const processCompleteMessage = (message: { id: string; role: string; content: string }) => {
    console.log("Processing complete message:", message.id)

    // Mark this message as being processed
    setProcessingIds((prev) => {
      const newSet = new Set(prev)
      newSet.add(message.id)
      return newSet
    })

    // Store the raw response for debugging
    setRawResponse(message.content)

    try {
      console.log("Full message content:", message.content)

      // Parse the structured response
      const parsedResponse = parseTutorResponse(message.content)

      if (parsedResponse) {
        console.log("Successfully parsed response:", parsedResponse)
        // Store the structured response with the message ID
        setStructuredResponses((prev) => {
          const newMap = new Map(prev)
          newMap.set(message.id, parsedResponse)
          return newMap
        })
      } else {
        console.warn("Failed to parse response, using default")
        // Use default response if parsing fails
        setStructuredResponses((prev) => {
          const newMap = new Map(prev)
          newMap.set(message.id, createDefaultResponse())
          return newMap
        })
      }
    } catch (error) {
      console.error("Error parsing response:", error)
      // Use default response if an error occurs
      setStructuredResponses((prev) => {
        const newMap = new Map(prev)
        newMap.set(message.id, createDefaultResponse())
        return newMap
      })
    } finally {
      // Remove this message from the processing set
      setProcessingIds((prev) => {
        const newSet = new Set(prev)
        newSet.delete(message.id)
        return newSet
      })
    }
  }

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrorMessage(null)

    try {
      await handleSubmit(e)
    } catch (err) {
      if (err instanceof Error) {
        setErrorMessage(err.message)
      } else {
        setErrorMessage("An error occurred while sending your message.")
      }
      console.error("Error submitting message:", err)
    }
  }

  const handleRetry = () => {
    setErrorMessage(null)
    reload()
  }

  const handleStartOver = () => {
    setErrorMessage(null)
    setStructuredResponses(new Map())
    setRawResponse(null)
    setProcessingIds(new Set())
    setMessages([])
  }

  // Check if a message is still being processed
  const isMessageProcessing = (messageId: string) => {
    return isLoading || processingIds.has(messageId)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] max-w-3xl mx-auto border rounded-lg shadow-sm overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4" ref={chatContainerRef}>
        {messages.length === 0 ? (
          <WelcomeMessage />
        ) : (
          <div className="space-y-6">
            {messages.map((message) => (
              <div key={message.id}>
                {/* User message */}
                {message.role === "user" && (
                  <div className="flex justify-end mb-4">
                    <div className="bg-primary text-primary-foreground rounded-lg p-4 max-w-[80%]">
                      {message.content}
                    </div>
                  </div>
                )}

                {/* Assistant message */}
                {message.role === "assistant" && (
                  <div className="mb-6">
                    {isMessageProcessing(message.id) ? (
                      <div className="bg-muted rounded-lg p-6 flex flex-col items-center justify-center">
                        <Loader2 className="h-6 w-6 animate-spin text-primary mb-2" />
                        <p className="text-sm text-muted-foreground">Processing response... This may take a moment.</p>
                      </div>
                    ) : structuredResponses.has(message.id) ? (
                      <StructuredResponse response={structuredResponses.get(message.id)!} />
                    ) : (
                      <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                        <p className="text-amber-800">
                          Unable to format response. Please try asking your question again.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            {errorMessage && (
              <Alert variant="destructive" className="my-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  {errorMessage}
                  <div className="mt-2 flex space-x-2">
                    <Button variant="outline" size="sm" onClick={handleRetry}>
                      Try Again
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleStartOver}>
                      Start Over
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* Debug panel for raw response */}
            {rawResponse && (
              <div className="mt-8 border-t pt-4">
                <Button variant="ghost" size="sm" onClick={() => setShowDebug(!showDebug)} className="mb-2">
                  {showDebug ? "Hide Debug Info" : "Show Debug Info"}
                </Button>

                {showDebug && (
                  <div className="bg-gray-100 p-4 rounded-md overflow-x-auto">
                    <h3 className="text-sm font-semibold mb-2">Raw AI Response</h3>
                    <pre className="text-xs whitespace-pre-wrap">{rawResponse}</pre>
                  </div>
                )}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className="border-t p-4 bg-background">
        <form onSubmit={handleFormSubmit} className="flex space-x-2">
          <input
            className="flex-1 min-w-0 border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            value={input}
            onChange={handleInputChange}
            placeholder="Ask about SAT topics, strategies, or practice questions..."
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Sending..." : <Send className="h-4 w-4" />}
          </Button>
        </form>
        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
            <Loader2 className="h-3 w-3 animate-spin" />
            <span>Generating response... This may take a few seconds.</span>
          </div>
        )}
      </div>
    </div>
  )
}

