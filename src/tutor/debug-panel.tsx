"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

interface DebugPanelProps {
  apiKey: string
  messages: { id: string; text: string }[]
}

export function DebugPanel({ apiKey, messages }: DebugPanelProps) {
  const [isOpen, setIsOpen] = useState(false)

  const maskedApiKey = apiKey ? `${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}` : "Not set"

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button variant="outline" size="sm" onClick={() => setIsOpen(!isOpen)} className="bg-background shadow-md">
        {isOpen ? "Close Debug" : "Debug"}
      </Button>

      {isOpen && (
        <div className="bg-background border rounded-lg shadow-lg p-4 mt-2 w-96 max-h-96 overflow-auto">
          <h3 className="font-medium mb-2">Debug Information</h3>

          <div className="mb-4">
            <h4 className="text-sm font-medium">API Key Status</h4>
            <p className="text-xs">
              {apiKey ? "Set" : "Not set"} ({maskedApiKey})
            </p>
          </div>

          <div>
            <h4 className="text-sm font-medium">Messages ({messages.length})</h4>
            <pre className="text-xs mt-1 bg-muted p-2 rounded overflow-auto max-h-40">
              {JSON.stringify(messages, null, 2)}
            </pre>
          </div>

          <div className="mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                console.log("Debug info:", {
                  apiKey: maskedApiKey,
                  messages,
                })
              }}
            >
              Log to Console
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

