import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { generateImage } from "@/lib/openai";
import { MdRefresh, MdCheck, MdOutlineImage } from "react-icons/md";

interface ReflectionPromptProps {
  userId: number;
}

export function ReflectionPrompt({ userId }: ReflectionPromptProps) {
  const [reflection, setReflection] = useState("");
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const { data: prompt, isLoading: isLoadingPrompt, refetch } = useQuery({
    queryKey: ['/api/reflection-prompts/random'],
  });

  const createReflection = useMutation({
    mutationFn: async () => {
      return await apiRequest('POST', '/api/reflections', {
        userId,
        promptId: prompt.id,
        content: reflection,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/reflections`] });
      setReflection("");
      setGeneratedImage(null);
      refetch();
    },
  });

  const handleGenerateImage = async () => {
    if (!reflection || reflection.length < 10) return;

    setIsGeneratingImage(true);
    try {
      const result = await generateImage(reflection);
      if (result.imageUrl) {
        setGeneratedImage(result.imageUrl);
      }
    } catch (error) {
      console.error("Failed to generate image:", error);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleSaveReflection = () => {
    if (reflection.trim()) {
      createReflection.mutate();
    }
  };

  const handleNewPrompt = () => {
    refetch();
    setReflection("");
    setGeneratedImage(null);
  };

  if (isLoadingPrompt) {
    return (
      <Card className="shadow-md border border-gray-100">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-medium text-gray-900">Today's Reflection</CardTitle>
          <div className="px-2 py-1 bg-sky-50 rounded-full text-xs text-sky-500 font-medium flex items-center">
            <MdRefresh className="mr-1" size={12} />
            <span>Daily</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="p-5 bg-sky-50 rounded-lg border border-sky-100 relative overflow-hidden">
            <Skeleton className="h-5 w-full mb-4" />
            <Skeleton className="h-4 w-4/5 mb-2" />
            <Skeleton className="h-4 w-3/5 mb-6" />
            <Skeleton className="h-24 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-md border border-gray-100">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-medium text-gray-900">Today's Reflection</CardTitle>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleNewPrompt}
          className="text-xs flex items-center text-sky-500 border-sky-200"
        >
          <MdRefresh className="mr-1" size={12} />
          <span>New Prompt</span>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="p-5 bg-sky-50 rounded-lg border border-sky-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-amber-50 rounded-bl-xl opacity-30"></div>
          <h4 className="font-medium text-gray-900 mb-3">{prompt.prompt}</h4>
          {prompt.description && (
            <p className="text-sm text-gray-600 mb-4">{prompt.description}</p>
          )}
          <Textarea
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-300 focus:border-sky-400 focus:outline-none transition duration-300 resize-none"
            rows={4}
            placeholder="Write your reflection here..."
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
          />
          <div className="mt-4 flex justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={handleGenerateImage}
              disabled={isGeneratingImage || reflection.length < 10}
              className="text-sky-500 border-sky-200 flex items-center"
            >
              <MdOutlineImage className="mr-1" />
              {isGeneratingImage ? "Generating..." : "Visualize"}
            </Button>
            <Button
              variant="sky"
              size="sm"
              onClick={handleSaveReflection}
              disabled={!reflection.trim() || createReflection.isPending}
              className="flex items-center"
            >
              <MdCheck className="mr-1" />
              {createReflection.isPending ? "Saving..." : "Save Reflection"}
            </Button>
          </div>
        </div>
        
        {generatedImage && (
          <div className="mt-6">
            <h4 className="font-medium text-gray-900 mb-3">Visual Inspiration</h4>
            <div className="rounded-lg overflow-hidden border border-gray-200">
              <img src={generatedImage} alt="Generated inspiration" className="w-full object-cover" />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
