import { SatPlannerForm } from "@/components/plan/sat-planner-form"

export default function PlanPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-gradient-to-r from-blue-400 to-blue-600 text-white py-6 px-4 shadow-md">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold text-center">Personalized SAT Plan</h1>
          <p className="text-center mt-2 max-w-2xl mx-auto text-blue-50">Your personalized daily SAT prep assistant</p>
        </div>
      </header>

      <main className="container mx-auto py-10 px-4">
        <div className="max-w-2xl mx-auto">
          <SatPlannerForm />
        </div>
      </main>

      <footer className="bg-gray-50 py-6 border-t">
        <div className="container mx-auto text-center text-sm text-gray-600">
          <p>© {new Date().getFullYear()} DailySAT. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

