'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, RotateCcw, Sparkles } from "lucide-react";
import type { Flashcard } from "./file-upload";

interface FlashcardViewerProps {
  flashcards: Flashcard[];
  onReset: () => void;
}

export function FlashcardViewer({ flashcards, onReset }: FlashcardViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'next' | 'prev' | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setDirection('next');
      setShowAnswer(false);
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
        setDirection(null);
      }, 300);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setDirection('prev');
      setShowAnswer(false);
      setTimeout(() => {
        setCurrentIndex(currentIndex - 1);
        setDirection(null);
      }, 300);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        if (currentIndex < flashcards.length - 1) {
          setDirection('next');
          setShowAnswer(false);
          setTimeout(() => {
            setCurrentIndex(prev => prev + 1);
            setDirection(null);
          }, 300);
        }
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (currentIndex > 0) {
          setDirection('prev');
          setShowAnswer(false);
          setTimeout(() => {
            setCurrentIndex(prev => prev - 1);
            setDirection(null);
          }, 300);
        }
      } else if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        setShowAnswer(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, flashcards.length]);

  if (flashcards.length === 0) {
    return null;
  }

  const currentCard = flashcards[currentIndex];
  const progress = ((currentIndex + 1) / flashcards.length) * 100;

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Your Flashcards
          </h2>
          <p className="text-muted-foreground text-sm">
            Click "Show Answer" to reveal the answer
          </p>
        </div>
        <Button variant="outline" onClick={onReset} className="gap-2">
          <RotateCcw className="h-4 w-4" />
          New PDF
        </Button>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">
            Card {currentIndex + 1} of {flashcards.length}
          </span>
          <span className="text-muted-foreground">
            {Math.round(progress)}% Complete
          </span>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-purple-600 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Flashcard Container */}
      <div className="relative min-h-[400px] sm:min-h-[500px]">
        <div
          className={`relative w-full transition-all duration-300 ${
            direction === 'next' ? 'translate-x-8 opacity-0' : ''
          } ${direction === 'prev' ? '-translate-x-8 opacity-0' : ''}`}
        >
          {/* Single Card with Question and Answer */}
          <div className="rounded-2xl p-8 sm:p-12 shadow-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border-2 border-gray-200 dark:border-gray-700">
            <div className="space-y-8">
              {/* Question Section */}
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  <Sparkles className="h-4 w-4" />
                  Question
                </div>
                <div className="text-2xl sm:text-3xl font-bold leading-relaxed text-foreground">
                  {currentCard.question}
                </div>
              </div>

              {/* Show Answer Button or Answer */}
              <div className="space-y-4">
                {!showAnswer ? (
                  <Button
                    onClick={() => setShowAnswer(true)}
                    variant="outline"
                    size="lg"
                    className="w-full h-14 text-base font-medium border-2 border-dashed border-primary/50 hover:border-primary hover:bg-primary/5 transition-all"
                  >
                    <Sparkles className="mr-2 h-5 w-5" />
                    Show Answer
                  </Button>
                ) : (
                  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Divider */}
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-border"></div>
                      </div>
                      <div className="relative flex justify-center">
                        <span className="bg-background px-4 text-sm text-muted-foreground">
                          Answer
                        </span>
                      </div>
                    </div>

                    {/* Answer Section */}
                    <div className="space-y-4 p-6 rounded-xl bg-gradient-to-br from-green-500/5 to-green-600/10 border border-green-500/20">
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-sm font-medium">
                        <Sparkles className="h-4 w-4" />
                        Answer
                      </div>
                      <div className="text-xl sm:text-2xl font-medium leading-relaxed text-foreground">
                        {currentCard.answer}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="lg"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="flex-1 h-14 text-base font-medium transition-all hover:scale-105 disabled:scale-100"
        >
          <ChevronLeft className="mr-2 h-5 w-5" />
          Previous
        </Button>

        <Button
          variant="outline"
          size="lg"
          onClick={handleNext}
          disabled={currentIndex === flashcards.length - 1}
          className="flex-1 h-14 text-base font-medium transition-all hover:scale-105 disabled:scale-100"
        >
          Next
          <ChevronRight className="ml-2 h-5 w-5" />
        </Button>
      </div>

      {/* Card Indicators */}
      <div className="flex items-center justify-center gap-2 py-4">
        {flashcards.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              if (index !== currentIndex) {
                setDirection(index > currentIndex ? 'next' : 'prev');
                setShowAnswer(false);
                setTimeout(() => {
                  setCurrentIndex(index);
                  setDirection(null);
                }, 300);
              }
            }}
            className={`transition-all duration-300 rounded-full ${
              index === currentIndex
                ? "w-10 h-3 bg-gradient-to-r from-primary to-purple-600"
                : "w-3 h-3 bg-muted-foreground/30 hover:bg-muted-foreground/50 hover:scale-125"
            }`}
            aria-label={`Go to card ${index + 1}`}
          />
        ))}
      </div>

      {/* Keyboard Shortcuts Hint */}
      <div className="text-center text-xs text-muted-foreground">
        <p>Use arrow keys to navigate • Space/Enter to show answer</p>
      </div>
    </div>
  );
}
