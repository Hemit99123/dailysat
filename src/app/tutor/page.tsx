import Link from "next/link"
import { TutorChat } from "../../tutor/chat"
import { Button } from "@/components/ui/button"

export default function TutorPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">DailySAT AI Tutor</h1>
        <p className="text-center mb-8 text-muted-foreground">
          Ask questions about SAT format, topics, and strategies. Get personalized help from our AI tutor.
        </p>

        <div className="mb-4 flex justify-center space-x-4">
          <Link href="/tutor/test">
            <Button variant="outline" size="sm">
              Check API Configuration
            </Button>
          </Link>
        </div>

        <TutorChat />
      </div>
    </div>
  )
}

