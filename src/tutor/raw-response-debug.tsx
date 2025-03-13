"use client"

interface RawResponseDebugProps {
  rawResponse: string | null
}

export function RawResponseDebug({ rawResponse }: RawResponseDebugProps) {
  if (!rawResponse) return null

  return (
    <div className="mt-8 border-t pt-4">
      <h3 className="text-lg font-semibold mb-2">Raw AI Response (Debug)</h3>
      <div className="bg-gray-100 p-4 rounded-md overflow-x-auto">
        <pre className="text-xs whitespace-pre-wrap">{rawResponse}</pre>
      </div>
    </div>
  )
}

