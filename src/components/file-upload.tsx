import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "./ui/button"
import { Slider } from "./ui/slider"
import { Upload } from "lucide-react"

export interface Flashcard {
  question: string
  answer: string
}

export function FileUpload({
  open,
  setOpen,
  onSuccess,
}: {
  open: boolean
  setOpen: (open: boolean) => void
  onSuccess: (flashcards: Flashcard[]) => void
}) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [numCards, setNumCards] = useState(5)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null)
  }

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file.")
      return
    }

    if (numCards < 1 || numCards > 20) {
      alert("Please select between 1 and 20 cards.")
      return
    }

    setUploading(true)
    const formData = new FormData()
    formData.append("file", file)
    formData.append("numCards", numCards.toString())

    try {
      const res = await fetch("/api/flashcard", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || "Upload failed")
      }

      const data = await res.json()
      
      if (data.flashcards && Array.isArray(data.flashcards)) {
        onSuccess(data.flashcards)
        setFile(null)
        setOpen(false)
      } else {
        throw new Error("Invalid flashcard data received")
      }
    } catch (err) {
      console.error(err)
      alert(err instanceof Error ? err.message : "Error uploading file.")
    } finally {
      setUploading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Upload PDF</DialogTitle>
          <DialogDescription>
            Upload a PDF file and choose how many flashcards to generate.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Select PDF File</label>
            <div className="relative">
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="w-full cursor-pointer rounded-lg border border-input bg-background px-3 py-2 text-sm file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary-foreground hover:file:bg-primary/90"
              />
            </div>
            {file && (
              <p className="text-xs text-muted-foreground">
                Selected: {file.name}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">
                Number of Flashcards
              </label>
              <span className="text-sm font-semibold text-primary">
                {numCards}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Slider
                value={[numCards]}
                onValueChange={(values) => setNumCards(values[0])}
                min={1}
                max={20}
                step={1}
                className="flex-1"
              />
              <input
                type="number"
                min="1"
                max="20"
                value={numCards}
                onChange={(e) => setNumCards(Math.min(20, Math.max(1, parseInt(e.target.value) || 5)))}
                className="w-16 rounded-md border border-input bg-background px-3 py-2 text-sm text-center font-medium focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Generate between 1-20 flashcards from your PDF
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button 
            onClick={handleUpload} 
            disabled={uploading || !file}
            className="w-full sm:w-auto"
            size="lg"
          >
            {uploading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Generating...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Generate Flashcards
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
