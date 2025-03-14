"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"

export default function TestPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")
  const [keyPreview, setKeyPreview] = useState("")

  useEffect(() => {
    async function checkApiKey() {
      try {
        const res = await fetch("/api/test")
        const data = await res.json()

        if (res.ok) {
          setStatus("success")
          setMessage(data.message)
          setKeyPreview(data.keyPreview || "")
        } else {
          setStatus("error")
          setMessage(data.error || "Unknown error")
        }
      } catch (error) {
        setStatus("error")
        setMessage("Failed to check API key status")
        console.error("Error checking API key:", error)
      }
    }

    checkApiKey()
  }, [])

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">DailySAT API Configuration Test</h1>

      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Groq API Key Status</CardTitle>
        </CardHeader>
        <CardContent>
          {status === "loading" && (
            <div className="flex items-center space-x-2">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              <p>Checking API key configuration...</p>
            </div>
          )}

          {status === "success" && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">Success</AlertTitle>
              <AlertDescription className="text-green-700">
                {message}
                {keyPreview && <p className="mt-1 text-sm">Key: {keyPreview}</p>}
              </AlertDescription>
            </Alert>
          )}

          {status === "error" && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {message}
                <p className="mt-2 text-sm">
                  Please check that your GROQ_API_KEY environment variable is correctly set.
                </p>
              </AlertDescription>
            </Alert>
          )}

          <div className="mt-4">
            <Button onClick={() => (window.location.href = "/tutor")} variant="outline">
              Back to Tutor
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

