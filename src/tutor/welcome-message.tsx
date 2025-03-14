export function WelcomeMessage() {
    return (
      <div className="text-center p-8 max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-4">Welcome to DailySAT AI Tutor!</h2>
        <p className="mb-4 text-muted-foreground">I&apos;m here to help you prepare for the SAT. You can ask me about:</p>
        <ul className="text-left space-y-2 mb-6">
          <li>• SAT format and structure</li>
          <li>• Specific question types</li>
          <li>• Math, Reading, or Writing topics</li>
          <li>• Test-taking strategies</li>
          <li>• Study plans and preparation advice</li>
        </ul>
        <p className="text-sm text-muted-foreground">Type your question below to get started!</p>
      </div>
    )
  }
  
  