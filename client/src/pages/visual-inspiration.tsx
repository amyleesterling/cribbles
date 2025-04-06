import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Grid2X2, List, Calendar, Bookmark, ThumbsUp, Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import MotionDot from "@/components/ui/motion-dot";
import ImageGenerator from "@/components/inspiration/image-generator";
import { InspirationImage } from "@shared/schema";

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
  
  // Fetch daily inspiration image
  const { data: dailyImage, isLoading: isLoadingDaily } = useQuery({
    queryKey: ["/api/inspiration/daily"],
    retry: 1,
  });
  
  // Fetch inspiration gallery
  const { data: galleryImages, isLoading: isLoadingGallery } = useQuery({
    queryKey: ["/api/inspiration/gallery"],
    retry: 1,
  });
  
  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="font-display font-bold text-2xl md:text-3xl mb-1">Visual Inspiration</h1>
        <p className="text-gray-500">Generate and explore beautiful AI-generated imagery to spark joy</p>
      </div>
      
      {/* Daily Inspiration Banner */}
      <Card className="bg-white rounded-2xl shadow-sm border-gray-200/30 mb-8 overflow-hidden">
        <div className="relative">
          {isLoadingDaily ? (
            <Skeleton className="w-full h-64" />
          ) : dailyImage ? (
            <>
              <img 
                src={dailyImage.imageUrl} 
                alt="Daily inspiration" 
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
                <h3 className="text-white text-xl font-display font-semibold mb-1">Today's Visual Inspiration</h3>
                <p className="text-white/80 text-sm mb-4">{dailyImage.prompt}</p>
                <div className="flex space-x-2">
                  <Button size="sm" variant="secondary" className="bg-white/20 hover:bg-white/30">
                    <Calendar className="h-4 w-4 mr-1" />
                    Today
                  </Button>
                  <Button size="sm" variant="secondary" className="bg-white/20 hover:bg-white/30">
                    <Bookmark className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="w-full h-64 bg-gray-100 flex items-center justify-center">
              <p className="text-gray-500">Could not load daily inspiration</p>
            </div>
          )}
        </div>
      </Card>
      
      <Tabs defaultValue="generator" className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <TabsList className="bg-gray-100">
            <TabsTrigger value="generator">Image Generator</TabsTrigger>
            <TabsTrigger value="gallery">My Gallery</TabsTrigger>
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
        
        <TabsContent value="gallery" className="mt-2">
          <Card className="bg-white rounded-2xl shadow-sm border-gray-200/30">
            <CardHeader className="flex flex-row items-center pb-2 pt-6 px-6">
              <MotionDot />
              <CardTitle className="font-display font-semibold text-xl ml-2">
                My Inspiration Gallery
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {isLoadingGallery ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <Card key={i} className="overflow-hidden">
                      <Skeleton className="h-48 w-full" />
                      <div className="p-4">
                        <Skeleton className="h-4 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                    </Card>
                  ))}
                </div>
              ) : !galleryImages || galleryImages.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">Your gallery is empty. Generate some inspiration images to see them here!</p>
                  <Button>Generate Your First Image</Button>
                </div>
              ) : (
                <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'space-y-4'}`}>
                  {galleryImages.map((image: InspirationImage) => (
                    <Card key={image.id} className="overflow-hidden">
                      <div className="aspect-video w-full">
                        <img 
                          src={image.imageUrl} 
                          alt={image.prompt} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardContent className="p-4">
                        <p className="text-sm text-gray-600 line-clamp-2">{image.prompt}</p>
                        {image.vibe && (
                          <div className="mt-2">
                            <span className="inline-block bg-skyBlue/10 text-skyBlue text-xs px-2 py-1 rounded">
                              {image.vibe}
                            </span>
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="px-4 py-2 border-t border-gray-100 flex justify-between">
                        <div className="flex space-x-2">
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                            <ThumbsUp className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                            <Share2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <Download className="h-4 w-4" />
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
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
