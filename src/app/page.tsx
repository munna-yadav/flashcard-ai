import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <span className="text-xl font-bold">Study Spark</span>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight">
              Welcome to the
              <span className="block text-primary mt-2">Flashcard Generator</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Transform your PDFs into interactive flashcards powered by AI. 
              Study smarter, not harder.
            </p>
          </div>

          <div className="flex gap-4">
            <Button asChild size="lg">
              <Link href="/app">Get Started</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-4xl">
            <div className="p-6 rounded-lg border bg-card">
              <h3 className="font-semibold text-lg mb-2">Upload PDF</h3>
              <p className="text-sm text-muted-foreground">
                Simply upload your study material in PDF format
              </p>
            </div>
            <div className="p-6 rounded-lg border bg-card">
              <h3 className="font-semibold text-lg mb-2">AI Generation</h3>
              <p className="text-sm text-muted-foreground">
                Our AI creates relevant flashcards automatically
              </p>
            </div>
            <div className="p-6 rounded-lg border bg-card">
              <h3 className="font-semibold text-lg mb-2">Study & Review</h3>
              <p className="text-sm text-muted-foreground">
                Navigate through cards and test your knowledge
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}