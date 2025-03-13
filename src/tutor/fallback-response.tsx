"use client"

import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

interface FallbackResponseProps {
  onRetry: () => void
}

export function FallbackResponse({ onRetry }: FallbackResponseProps) {
  return (
    <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg my-4">
      <h3 className="font-medium text-amber-800 mb-2">No response received</h3>
      <p className="text-amber-700 mb-3">
        It seems the AI tutor didn&apos;t respond. This could be due to a temporary issue with the connection or the AI
        service.
      </p>
      <Button variant="outline" size="sm" onClick={onRetry} className="flex items-center gap-2">
        <RefreshCw className="h-4 w-4" /> Try Again
      </Button>
    </div>
  )
}

