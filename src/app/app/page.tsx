'use client';

import { useState } from "react";
import { FileUpload, type Flashcard } from "@/components/file-upload";
import { FlashcardViewer } from "@/components/flashcard-viewer";
import { Button } from "@/components/ui/button";
import { Upload, Sparkles, BookOpen, Brain } from "lucide-react";

export default function App() {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);

  const handleSuccess = (newFlashcards: Flashcard[]) => {
    setFlashcards(newFlashcards);
  };

  const handleReset = () => {
    setFlashcards([]);
    setIsUploadOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="max-w-7xl mx-auto p-4 sm:p-8">
        {flashcards.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-12">
            {/* Hero Section */}
            <div className="text-center space-y-6 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                <Sparkles className="h-4 w-4" />
                AI-Powered Learning
              </div>
              
              <h1 className="text-5xl sm:text-7xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-primary via-purple-600 to-primary bg-clip-text text-transparent">
                  Flashcard AI
                </span>
              </h1>
              
              <p className="text-xl sm:text-2xl text-muted-foreground leading-relaxed">
                Transform any PDF into interactive flashcards with AI.
                <br />
                Study smarter, learn faster.
              </p>
            </div>

            {/* CTA Button */}
            <div className="flex flex-col items-center gap-4">
              <Button 
                size="lg" 
                onClick={() => setIsUploadOpen(true)}
                className="h-14 px-8 text-lg font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
              >
                <Upload className="mr-2 h-5 w-5" />
                Upload PDF & Get Started
              </Button>
              <p className="text-sm text-muted-foreground">
                Free • No sign-up required • Instant results
              </p>
            </div>

            {/* Features Grid */}
            
          </div>
        ) : (
          <FlashcardViewer flashcards={flashcards} onReset={handleReset} />
        )}

        <FileUpload
          open={isUploadOpen}
          setOpen={setIsUploadOpen}
          onSuccess={handleSuccess}
        />
      </div>
    </div>
  );
}
