import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertJournalSchema } from "@shared/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

// Extend schema with validations
const journalFormSchema = insertJournalSchema.extend({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  content: z.string().min(5, {
    message: "Journal content must be at least 5 characters.",
  }),
});

type JournalFormValues = z.infer<typeof journalFormSchema>;

interface JournalFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  initialData?: {
    title: string;
    content: string;
  };
}

export default function JournalForm({ onSuccess, onCancel, initialData }: JournalFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<{
    insights: string;
    emotionalTone: string;
    recommendations: string[];
  } | null>(null);
  
  const form = useForm<JournalFormValues>({
    resolver: zodResolver(journalFormSchema),
    defaultValues: {
      userId: 1, // Demo user
      title: initialData?.title || "",
      content: initialData?.content || "",
    },
  });
  
  const createJournal = useMutation({
    mutationFn: async (values: JournalFormValues) => {
      return apiRequest("POST", "/api/journals", values);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/journals"] });
      toast({
        title: "Journal created",
        description: "Your journal entry has been saved.",
      });
      if (onSuccess) onSuccess();
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save journal entry. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  const analyzeJournal = useMutation({
    mutationFn: async (content: string) => {
      return apiRequest("POST", "/api/journals/analyze", { content });
    },
    onMutate: () => {
      setIsAnalyzing(true);
    },
    onSuccess: (data) => {
      setAnalysis(data);
      setIsAnalyzing(false);
    },
    onError: () => {
      setIsAnalyzing(false);
      toast({
        title: "Analysis failed",
        description: "Could not analyze your journal entry.",
        variant: "destructive",
      });
    },
  });
  
  const handleSubmit = (values: JournalFormValues) => {
    createJournal.mutate(values);
  };
  
  const handleAnalyze = () => {
    const content = form.getValues("content");
    if (content.length < 5) {
      toast({
        title: "Content too short",
        description: "Please write more for meaningful analysis.",
        variant: "destructive",
      });
      return;
    }
    analyzeJournal.mutate(content);
  };
  
  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Give your journal entry a title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Journal Entry</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Write your thoughts, reflections, or creative ideas here..." 
                    className="min-h-[200px]"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex flex-col sm:flex-row justify-between gap-3">
            <Button
              type="button"
              variant="outline"
              className="border-skyBlue text-skyBlue hover:bg-skyBlue/10 hover:text-skyBlue"
              onClick={handleAnalyze}
              disabled={isAnalyzing || form.getValues("content").length < 5}
            >
              {isAnalyzing ? "Analyzing..." : "Analyze Entry"}
            </Button>
            
            <div className="flex gap-2">
              {onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                >
                  Cancel
                </Button>
              )}
              <Button 
                type="submit" 
                className="bg-skyBlue hover:bg-skyBlue/90 text-white"
                disabled={createJournal.isPending}
              >
                {createJournal.isPending ? "Saving..." : "Save Entry"}
              </Button>
            </div>
          </div>
        </form>
      </Form>
      
      {analysis && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium mb-2 text-skyBlue">Entry Analysis</h3>
          <div className="mb-3">
            <p className="text-sm text-gray-700">{analysis.insights}</p>
          </div>
          
          <div className="mb-3">
            <p className="text-sm font-medium">Emotional Tone: 
              <span className="ml-2 inline-block py-1 px-2 rounded-full bg-skyBlue/10 text-skyBlue text-xs">
                {analysis.emotionalTone}
              </span>
            </p>
          </div>
          
          {analysis.recommendations.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-1">Recommendations:</p>
              <ul className="text-sm text-gray-700 list-disc pl-5">
                {analysis.recommendations.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
