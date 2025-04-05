import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Grid2X2, List } from "lucide-react";
import MotionDot from "@/components/ui/motion-dot";
import ImageGenerator from "@/components/inspiration/image-generator";

// Placeholder quotes for inspiration
const inspirationQuotes = [
  {
    id: 1,
    quote: "The present moment is filled with joy and happiness. If you are attentive, you will see it.",
    author: "Thich Nhat Hanh"
  },
  {
    id: 2,
    quote: "You are the sky. Everything else is just the weather.",
    author: "Pema Chödrön"
  },
  {
    id: 3,
    quote: "The mind is everything. What you think you become.",
    author: "Buddha"
  },
  {
    id: 4,
    quote: "Happiness is not something ready-made. It comes from your own actions.",
    author: "Dalai Lama XIV"
  },
  {
    id: 5,
    quote: "Every moment is a fresh beginning.",
    author: "T.S. Eliot"
  }
];

// Sample prompts for image generation
const samplePrompts = [
  "A peaceful mountain lake at sunrise with gentle mist",
  "An open field of sunflowers under a bright blue sky",
  "A serene garden path with cherry blossoms falling gently",
  "Ocean waves gently rolling onto a pristine beach at sunset",
  "A cozy reading nook with soft lighting and rain on the window"
];

export default function VisualInspiration() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="font-display font-bold text-2xl md:text-3xl mb-1">Visual Inspiration</h1>
        <p className="text-gray-500">Generate visual inspiration for your creative journey</p>
      </div>
      
      <Tabs defaultValue="generator" className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <TabsList className="bg-gray-100">
            <TabsTrigger value="generator">Image Generator</TabsTrigger>
            <TabsTrigger value="quotes">Mindfulness Quotes</TabsTrigger>
          </TabsList>
          
          <div className="flex space-x-2">
            <button
              className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-skyBlue text-white' : 'bg-gray-100 text-gray-600'}`}
              onClick={() => setViewMode('grid')}
            >
              <Grid2X2 className="h-4 w-4" />
            </button>
            <button
              className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-skyBlue text-white' : 'bg-gray-100 text-gray-600'}`}
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        <TabsContent value="generator" className="mt-2">
          <Card className="bg-white rounded-2xl shadow-sm border-gray-200/30">
            <CardHeader className="flex flex-row items-center pb-2 pt-6 px-6">
              <MotionDot />
              <CardTitle className="font-display font-semibold text-xl ml-2">
                Generate Visual Inspiration
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ImageGenerator samplePrompts={samplePrompts} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="quotes" className="mt-2">
          <Card className="bg-white rounded-2xl shadow-sm border-gray-200/30">
            <CardHeader className="flex flex-row items-center pb-2 pt-6 px-6">
              <MotionDot />
              <CardTitle className="font-display font-semibold text-xl ml-2">
                Mindfulness Quotes
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'space-y-4'}>
                {inspirationQuotes.map((item) => (
                  <Card key={item.id} className="bg-gray-50 border-none">
                    <CardContent className="p-6">
                      <blockquote className="text-lg font-display mb-2">
                        "{item.quote}"
                      </blockquote>
                      <footer className="text-right text-sm text-gray-500">
                        — {item.author}
                      </footer>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
