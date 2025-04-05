import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { generateImage } from "@/lib/openai";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { MdOutlineImage, MdAutoAwesome, MdOutlineLightbulb, MdOutlineShare } from "react-icons/md";

interface InspirationGeneratorProps {
  userId: number;
}

export function InspirationGenerator({ userId }: InspirationGeneratorProps) {
  const [prompt, setPrompt] = useState("");
  const [generatingImage, setGeneratingImage] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [imageHistory, setImageHistory] = useState<Array<{prompt: string, imageUrl: string}>>([]);
  const { toast } = useToast();

  // Prompt suggestions for inspiration
  const promptSuggestions = [
    "A peaceful mountain lake at sunrise with gentle mist",
    "A field of sunflowers under a bright blue sky",
    "A serene zen garden with smooth stones and raked sand",
    "Gentle ocean waves rolling onto a pristine beach",
    "A cozy reading nook with soft blankets by a window"
  ];

  const handleGenerateImage = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Please enter a prompt",
        description: "Describe what kind of inspirational image you'd like to see",
        variant: "destructive"
      });
      return;
    }

    setGeneratingImage(true);
    try {
      const result = await generateImage(prompt);
      if (result.imageUrl) {
        setGeneratedImage(result.imageUrl);
        setImageHistory(prev => [{ prompt, imageUrl: result.imageUrl }, ...prev].slice(0, 5));
        toast({
          title: "Image created",
          description: "Your inspirational image has been generated",
          variant: "default"
        });
      }
    } catch (error) {
      console.error("Error generating image:", error);
      toast({
        title: "Image generation failed",
        description: "There was an error creating your image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setGeneratingImage(false);
    }
  };

  const usePromptSuggestion = (suggestion: string) => {
    setPrompt(suggestion);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-700">Describe what you'd like to visualize</h3>
          <Textarea
            placeholder="Describe a calming or inspirational scene..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="h-24 resize-none"
          />
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Prompt suggestions</h4>
          <div className="flex flex-wrap gap-2">
            {promptSuggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="text-xs border-sky-200 text-sky-700 hover:bg-sky-50"
                onClick={() => usePromptSuggestion(suggestion)}
              >
                {suggestion.length > 30 ? suggestion.substring(0, 27) + '...' : suggestion}
              </Button>
            ))}
          </div>
        </div>

        <Button
          variant="sky"
          onClick={handleGenerateImage}
          disabled={generatingImage || !prompt.trim()}
          className="w-full flex items-center justify-center"
        >
          {generatingImage ? (
            <>Generating...</>
          ) : (
            <>
              <MdOutlineImage className="mr-2" />
              Generate Inspirational Image
            </>
          )}
        </Button>
      </div>

      {generatingImage && (
        <div className="flex flex-col items-center justify-center p-10 border-2 border-dashed border-sky-200 rounded-lg bg-sky-50">
          <div className="animate-spin text-sky-500 mb-4">
            <svg
              className="w-10 h-10"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
          <p className="text-sky-700 text-sm font-medium">Creating your vision...</p>
          <p className="text-sky-600 text-xs mt-2">This may take a few moments</p>
        </div>
      )}

      {!generatingImage && generatedImage && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          <div className="border rounded-lg overflow-hidden bg-white shadow-md">
            <img 
              src={generatedImage} 
              alt="Generated inspiration" 
              className="w-full h-auto object-cover" 
            />
            <div className="p-4 flex justify-between items-center">
              <div className="flex items-center text-sm text-gray-600">
                <MdOutlineLightbulb className="mr-2 text-amber-400" />
                <span className="line-clamp-1">{prompt}</span>
              </div>
              <Button variant="ghost" size="sm" className="text-sky-600">
                <MdOutlineShare size={18} />
              </Button>
            </div>
          </div>
          
          <div className="flex justify-center">
            <Button 
              variant="outline" 
              className="border-amber-300 text-amber-600 hover:bg-amber-50 flex items-center"
              onClick={() => setPrompt("")}
            >
              <MdAutoAwesome className="mr-2" />
              Create Another
            </Button>
          </div>
        </motion.div>
      )}

      {imageHistory.length > 0 && (
        <div className="mt-8">
          <h3 className="text-sm font-medium text-gray-700 mb-4">Your Recent Inspirations</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {imageHistory.map((item, index) => (
              <Card key={index} className="overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="aspect-w-16 aspect-h-9 bg-gray-100">
                  <img 
                    src={item.imageUrl} 
                    alt={`Inspiration ${index + 1}`} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-3">
                  <p className="text-xs text-gray-600 line-clamp-1">{item.prompt}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
