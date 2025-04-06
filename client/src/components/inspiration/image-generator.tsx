import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookmarkPlus, 
  Download, 
  Loader2, 
  RefreshCw, 
  Save, 
  Sparkles,
  Heart,
  Sun,
  Moon,
  TreePine,
  Waves,
  Flower2
} from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectLabel, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { queryClient } from "@/lib/queryClient";

interface ImageGeneratorProps {
  samplePrompts?: string[];
}

export default function ImageGenerator({ samplePrompts = [] }: ImageGeneratorProps) {
  const { toast } = useToast();
  const [prompt, setPrompt] = useState("");
  const [vibe, setVibe] = useState("calm");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [generatedImageData, setGeneratedImageData] = useState<{
    id?: number;
    imageUrl: string;
    prompt: string;
  } | null>(null);
  
  const generateImage = async (customPrompt?: string) => {
    const finalPrompt = customPrompt || prompt;
    
    if (!finalPrompt) {
      toast({
        title: "Empty prompt",
        description: "Please enter a description for your inspiration image.",
        variant: "destructive",
      });
      return;
    }
    
    setIsGenerating(true);
    
    try {
      const response = await apiRequest("POST", "/api/inspiration", {
        prompt: finalPrompt,
        vibe: vibe
      });
      
      const data = await response.json();
      setGeneratedImageData(data);
      
      // Invalidate the gallery query to refresh gallery view
      queryClient.invalidateQueries({ queryKey: ["/api/inspiration/gallery"] });
      
      toast({
        title: "Image generated",
        description: "Your inspiration image has been created and saved to your gallery.",
      });
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "Could not generate the image. Please try again.",
        variant: "destructive",
      });
      console.error("Image generation error:", error);
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    generateImage();
  };
  
  const handleDownload = () => {
    if (!generatedImageData?.imageUrl) return;
    
    const link = document.createElement("a");
    link.href = generatedImageData.imageUrl;
    link.download = `cribbles-inspiration-${new Date().getTime()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const getVibeIcon = (vibeType: string) => {
    switch(vibeType) {
      case "calm": return <Waves className="h-4 w-4 mr-2" />;
      case "joyful": return <Sun className="h-4 w-4 mr-2" />;
      case "serene": return <Moon className="h-4 w-4 mr-2" />;
      case "natural": return <TreePine className="h-4 w-4 mr-2" />;
      case "loving": return <Heart className="h-4 w-4 mr-2" />;
      case "peaceful": return <Flower2 className="h-4 w-4 mr-2" />;
      default: return <Waves className="h-4 w-4 mr-2" />;
    }
  };
  
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="prompt">Describe what you'd like to visualize</Label>
            <Textarea
              id="prompt"
              placeholder="A peaceful ocean scene with gentle waves under a bright blue sky..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="h-32 resize-none"
            />
          </div>
          
          <div>
            <Label htmlFor="vibe" className="mb-2 block">Select the vibe for your image</Label>
            <Select value={vibe} onValueChange={setVibe}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a vibe" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Image Vibe</SelectLabel>
                  <SelectItem value="calm">
                    <div className="flex items-center">
                      <Waves className="h-4 w-4 mr-2" />
                      <span>Calm</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="joyful">
                    <div className="flex items-center">
                      <Sun className="h-4 w-4 mr-2" />
                      <span>Joyful</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="serene">
                    <div className="flex items-center">
                      <Moon className="h-4 w-4 mr-2" />
                      <span>Serene</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="natural">
                    <div className="flex items-center">
                      <TreePine className="h-4 w-4 mr-2" />
                      <span>Natural</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="loving">
                    <div className="flex items-center">
                      <Heart className="h-4 w-4 mr-2" />
                      <span>Loving</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="peaceful">
                    <div className="flex items-center">
                      <Flower2 className="h-4 w-4 mr-2" />
                      <span>Peaceful</span>
                    </div>
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          
          <Button
            type="submit"
            className="w-full bg-skyBlue hover:bg-skyBlue/90 text-white"
            disabled={isGenerating || !prompt}
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" /> Generate Image
              </>
            )}
          </Button>
          
          <div>
            <p className="text-sm text-gray-500 mb-2">Try one of these prompts:</p>
            <div className="grid grid-cols-1 gap-2">
              {samplePrompts.map((samplePrompt, index) => (
                <Button
                  key={index}
                  type="button"
                  variant="outline"
                  size="sm"
                  className="justify-start text-left h-auto py-2 text-xs"
                  onClick={() => {
                    setPrompt(samplePrompt);
                    generateImage(samplePrompt);
                  }}
                  disabled={isGenerating}
                >
                  {samplePrompt}
                </Button>
              ))}
            </div>
          </div>
        </form>
      </div>
      
      <div className="flex flex-col items-center justify-center">
        <div className="w-full h-64 md:h-80 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center mb-4">
          <AnimatePresence mode="wait">
            {isGenerating ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center"
              >
                <Loader2 className="animate-spin h-10 w-10 text-skyBlue mb-2 mx-auto" />
                <p className="text-gray-500">Creating your inspiration...</p>
              </motion.div>
            ) : generatedImageData ? (
              <motion.img
                key="image"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                src={generatedImageData.imageUrl}
                alt="Generated inspiration"
                className="w-full h-full object-contain"
              />
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center p-4"
              >
                <Sparkles className="h-10 w-10 text-gray-300 mb-2 mx-auto" />
                <p className="text-gray-500">Your inspiration image will appear here</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {generatedImageData && (
          <>
            <div className="w-full mb-4">
              <div className="flex items-center">
                {getVibeIcon(vibe)}
                <span className="text-sm font-medium">{vibe.charAt(0).toUpperCase() + vibe.slice(1)} Vibe</span>
              </div>
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">{generatedImageData.prompt}</p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => generateImage()}
                disabled={isGenerating || !prompt}
              >
                <RefreshCw className="mr-2 h-4 w-4" /> Regenerate
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleDownload}
              >
                <Download className="mr-2 h-4 w-4" /> Download
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
