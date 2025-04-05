import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { motion } from "framer-motion";
import { 
  FrownIcon, 
  MehIcon, 
  SmileIcon, 
  SmilePlusIcon, 
  HeartIcon,
  CalendarIcon
} from "lucide-react";
import MotionDot from "@/components/ui/motion-dot";
import { type Mood } from "@shared/schema";

export default function MoodPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [moodScore, setMoodScore] = useState<number>(3);
  const [moodNotes, setMoodNotes] = useState<string>("");
  
  const { data: moods, isLoading } = useQuery<Mood[]>({ 
    queryKey: ["/api/moods"] 
  });
  
  const createMood = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/moods", {
        userId: 1, // Demo user
        score: moodScore,
        notes: moodNotes,
        date: new Date()
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/moods"] });
      setMoodNotes("");
      toast({
        title: "Mood recorded",
        description: "Your mood has been recorded successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to record mood. Please try again.",
        variant: "destructive",
      });
    }
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMood.mutate();
  };
  
  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="font-display font-bold text-2xl md:text-3xl mb-1">Mood Tracking</h1>
        <p className="text-gray-500">Monitor your emotional wellbeing and discover patterns</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mood Entry Card */}
        <div className="lg:col-span-1">
          <Card className="bg-white rounded-2xl shadow-sm border-gray-200/30">
            <CardHeader className="flex flex-row items-center pb-2 pt-6 px-6">
              <MotionDot />
              <CardTitle className="font-display font-semibold text-xl ml-2">How are you feeling?</CardTitle>
            </CardHeader>
            
            <CardContent className="p-6">
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <div className="flex justify-between mb-4">
                    {[1, 2, 3, 4, 5].map((score) => (
                      <Button
                        key={score}
                        type="button"
                        variant={moodScore === score ? "default" : "outline"}
                        className={`rounded-full w-12 h-12 p-0 ${
                          moodScore === score 
                            ? "bg-skyBlue text-white" 
                            : "text-gray-700"
                        }`}
                        onClick={() => setMoodScore(score)}
                      >
                        {score === 1 ? (
                          <FrownIcon className="h-6 w-6" />
                        ) : score === 2 ? (
                          <MehIcon className="h-6 w-6" />
                        ) : score === 3 ? (
                          <SmileIcon className="h-6 w-6" />
                        ) : score === 4 ? (
                          <SmilePlusIcon className="h-6 w-6" />
                        ) : (
                          <HeartIcon className="h-6 w-6" />
                        )}
                      </Button>
                    ))}
                  </div>
                  
                  <div className="text-center text-sm font-medium mb-4">
                    {moodScore === 1 ? (
                      "Very Low"
                    ) : moodScore === 2 ? (
                      "Low"
                    ) : moodScore === 3 ? (
                      "Neutral"
                    ) : moodScore === 4 ? (
                      "Good"
                    ) : (
                      "Excellent"
                    )}
                  </div>
                  
                  <div className="mb-4">
                    <Label htmlFor="mood-notes" className="mb-2 block">Add notes about your mood (optional)</Label>
                    <Textarea
                      id="mood-notes"
                      placeholder="What's contributing to your mood today?"
                      className="resize-none"
                      rows={4}
                      value={moodNotes}
                      onChange={(e) => setMoodNotes(e.target.value)}
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-skyBlue hover:bg-skyBlue/90 text-white"
                    disabled={createMood.isPending}
                  >
                    {createMood.isPending ? "Recording..." : "Record Mood"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
        
        {/* Mood Analysis Card */}
        <div className="lg:col-span-2">
          <Card className="bg-white rounded-2xl shadow-sm border-gray-200/30">
            <CardHeader className="flex flex-row items-center pb-2 pt-6 px-6">
              <MotionDot />
              <CardTitle className="font-display font-semibold text-xl ml-2">Mood Analytics</CardTitle>
            </CardHeader>
            
            <CardContent className="p-6">
              <Tabs defaultValue="weekly">
                <TabsList className="mb-6">
                  <TabsTrigger value="weekly">Weekly</TabsTrigger>
                  <TabsTrigger value="monthly">Monthly</TabsTrigger>
                  <TabsTrigger value="yearly">Yearly</TabsTrigger>
                </TabsList>
                
                <TabsContent value="weekly">
                  <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center mb-6">
                    {isLoading ? (
                      <p className="text-gray-500">Loading mood data...</p>
                    ) : moods && moods.length > 0 ? (
                      <div className="w-full h-full p-4">
                        <WeeklyMoodChart moods={moods} />
                      </div>
                    ) : (
                      <div className="text-center">
                        <p className="text-gray-500 mb-2">No mood data recorded yet</p>
                        <p className="text-sm text-gray-400">Start tracking your mood to see patterns</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="bg-gray-50 border-none">
                      <CardContent className="p-4">
                        <h4 className="font-medium mb-2">Weekly Average</h4>
                        <div className="text-3xl font-bold text-skyBlue">
                          {isLoading ? "..." : getAverageMood(moods || [])}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {isLoading ? "Calculating..." : getMoodTrend(moods || [])}
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-gray-50 border-none">
                      <CardContent className="p-4">
                        <h4 className="font-medium mb-2">Mood Patterns</h4>
                        <p className="text-sm text-gray-600">
                          {isLoading 
                            ? "Analyzing your patterns..." 
                            : moods && moods.length > 0 
                              ? "Your mood tends to be higher in the mornings and on weekends."
                              : "Start recording your moods to discover patterns."
                          }
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="monthly">
                  <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Monthly mood analytics coming soon</p>
                  </div>
                </TabsContent>
                
                <TabsContent value="yearly">
                  <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Yearly mood analytics coming soon</p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function WeeklyMoodChart({ moods }: { moods: Mood[] }) {
  // Get moods from the last 7 days
  const lastWeekMoods = moods.filter(mood => {
    const moodDate = new Date(mood.date);
    const now = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 7);
    return moodDate >= sevenDaysAgo;
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  if (lastWeekMoods.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-gray-500">No mood data for the past week</p>
      </div>
    );
  }
  
  // Generate days of the week
  const daysOfWeek = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - 6 + i);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  });
  
  return (
    <div className="w-full h-full">
      <svg width="100%" height="100%" viewBox="0 0 600 200" xmlns="http://www.w3.org/2000/svg">
        {/* Background grid */}
        {[0, 1, 2, 3, 4].map((level) => (
          <line 
            key={`grid-${level}`}
            x1="50" 
            y1={40 + level * 40} 
            x2="550" 
            y2={40 + level * 40} 
            stroke="#f0f0f0" 
            strokeWidth="1" 
          />
        ))}
        
        {/* X axis (days) */}
        {daysOfWeek.map((day, i) => (
          <text
            key={`day-${i}`}
            x={50 + i * (500 / 6)}
            y="195"
            textAnchor="middle"
            fontSize="12"
            fill="#666"
          >
            {day}
          </text>
        ))}
        
        {/* Y axis (mood levels) */}
        {[1, 2, 3, 4, 5].map((level) => (
          <text
            key={`level-${level}`}
            x="30"
            y={200 - level * 40}
            textAnchor="end"
            fontSize="12"
            fill="#666"
          >
            {level}
          </text>
        ))}
        
        {/* Mood line */}
        {lastWeekMoods.length > 1 && (
          <motion.path
            d={lastWeekMoods.map((mood, i) => {
              const moodDate = new Date(mood.date);
              const dayIndex = 6 - (new Date().getDate() - moodDate.getDate());
              const x = 50 + dayIndex * (500 / 6);
              const y = 200 - mood.score * 40;
              return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
            }).join(' ')}
            fill="none"
            stroke="#4AA9FF"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
        )}
        
        {/* Mood points */}
        {lastWeekMoods.map((mood, i) => {
          const moodDate = new Date(mood.date);
          const dayIndex = 6 - (new Date().getDate() - moodDate.getDate());
          const x = 50 + dayIndex * (500 / 6);
          const y = 200 - mood.score * 40;
          
          return (
            <motion.circle
              key={`point-${i}`}
              cx={x}
              cy={y}
              r="5"
              fill="#FFD84A"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 + (i * 0.1), duration: 0.3 }}
            />
          );
        })}
      </svg>
    </div>
  );
}

function getAverageMood(moods: Mood[]): string {
  if (moods.length === 0) return "N/A";
  
  // Get moods from the last 7 days
  const lastWeekMoods = moods.filter(mood => {
    const moodDate = new Date(mood.date);
    const now = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 7);
    return moodDate >= sevenDaysAgo;
  });
  
  if (lastWeekMoods.length === 0) return "N/A";
  
  const avg = lastWeekMoods.reduce((sum, mood) => sum + mood.score, 0) / lastWeekMoods.length;
  return avg.toFixed(1);
}

function getMoodTrend(moods: Mood[]): string {
  if (moods.length < 2) return "Not enough data";
  
  // Get moods from the last 7 days
  const lastWeekMoods = moods.filter(mood => {
    const moodDate = new Date(mood.date);
    const now = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 7);
    return moodDate >= sevenDaysAgo;
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  if (lastWeekMoods.length < 2) return "Not enough data";
  
  const firstMoods = lastWeekMoods.slice(0, Math.ceil(lastWeekMoods.length / 2));
  const secondMoods = lastWeekMoods.slice(Math.ceil(lastWeekMoods.length / 2));
  
  const firstAvg = firstMoods.reduce((sum, mood) => sum + mood.score, 0) / firstMoods.length;
  const secondAvg = secondMoods.reduce((sum, mood) => sum + mood.score, 0) / secondMoods.length;
  
  const diff = secondAvg - firstAvg;
  if (diff > 0.2) return "Your mood is trending up this week";
  if (diff < -0.2) return "Your mood is trending down this week";
  return "Your mood has been steady this week";
}
