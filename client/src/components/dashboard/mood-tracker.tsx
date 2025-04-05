import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { apiRequest } from "@/lib/queryClient";
import { motion } from "framer-motion";
import { type Mood } from "@shared/schema";
import MotionDot from "../ui/motion-dot";
import { 
  FrownIcon, 
  MehIcon, 
  SmileIcon, 
  SmilePlusIcon, 
  HeartIcon,
  ChevronRight,
  ChevronLeft
} from "lucide-react";

export default function MoodTracker() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  
  const queryClient = useQueryClient();
  
  const { data: moods, isLoading } = useQuery<Mood[]>({ 
    queryKey: ["/api/moods"] 
  });
  
  const createMood = useMutation({
    mutationFn: async (score: number) => {
      return apiRequest("POST", "/api/moods", {
        userId: 1, // Demo user
        score,
        date: new Date()
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/moods"] });
    }
  });
  
  // Filter moods to get the last 7 days
  const recentMoods = moods?.filter(mood => {
    const moodDate = new Date(mood.date);
    const now = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 7);
    return moodDate >= sevenDaysAgo;
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  // Get mood for the selected date
  const moodForSelectedDate = moods?.find(mood => {
    const moodDate = new Date(mood.date);
    return moodDate.toDateString() === selectedDate.toDateString();
  });
  
  // Generate week dates
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - 6 + i);
    return date;
  });
  
  const handleMoodSelect = (score: number) => {
    setSelectedMood(score);
    createMood.mutate(score);
  };
  
  const moveDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 1);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    setSelectedDate(newDate);
  };
  
  if (isLoading) {
    return <MoodTrackerSkeleton />;
  }
  
  return (
    <Card className="bg-white rounded-2xl shadow-sm border-gray-200/30">
      <CardHeader className="flex flex-row items-center justify-between pb-2 pt-6 px-6">
        <div className="flex items-center">
          <MotionDot />
          <CardTitle className="font-display font-semibold text-xl ml-2">Creative Mood Tracking</CardTitle>
        </div>
        <Button variant="link" size="sm" className="text-skyBlue">
          View Full History
        </Button>
      </CardHeader>
      
      <CardContent className="p-6 pt-0">
        <div className="w-full h-36 relative mb-4">
          <svg width="100%" height="100%" viewBox="0 0 300 100" xmlns="http://www.w3.org/2000/svg">
            {/* Background grid lines */}
            <line x1="0" y1="25" x2="300" y2="25" stroke="#f0f0f0" strokeWidth="1" />
            <line x1="0" y1="50" x2="300" y2="50" stroke="#f0f0f0" strokeWidth="1" />
            <line x1="0" y1="75" x2="300" y2="75" stroke="#f0f0f0" strokeWidth="1" />
            
            {/* Mood line */}
            {recentMoods && recentMoods.length > 1 && (
              <motion.path
                d={recentMoods.map((mood, index) => {
                  const x = (index / (recentMoods.length - 1)) * 300;
                  // Invert score so 5 is at the top, 1 at the bottom
                  const y = 100 - (mood.score * 20);
                  return `${index === 0 ? 'M' : 'L'} ${x},${y}`;
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
            
            {/* Highlight dots */}
            {recentMoods?.map((mood, index) => {
              const x = (index / Math.max(recentMoods.length - 1, 1)) * 300;
              // Invert score so 5 is at the top, 1 at the bottom
              const y = 100 - (mood.score * 20);
              
              return (
                <motion.circle
                  key={index}
                  cx={x}
                  cy={y}
                  r="4"
                  fill="#FFD84A"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 + (index * 0.1), duration: 0.3 }}
                />
              );
            })}
          </svg>
        </div>
        
        <div className="grid grid-cols-7 gap-1 text-center mb-6">
          {weekDates.map((date, index) => {
            const isToday = date.toDateString() === new Date().toDateString();
            const isSelected = date.toDateString() === selectedDate.toDateString();
            const dateHasMood = moods?.some(mood => {
              const moodDate = new Date(mood.date);
              return moodDate.toDateString() === date.toDateString();
            });
            
            return (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                className={`p-2 flex flex-col items-center ${
                  isSelected 
                    ? 'bg-skyBlue/10 text-skyBlue' 
                    : isToday 
                      ? 'border border-skyBlue/30' 
                      : ''
                } ${dateHasMood ? 'font-semibold' : ''}`}
                onClick={() => setSelectedDate(date)}
              >
                <div className="text-xs">{date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                <div className="text-xs font-medium">{date.getDate()}</div>
              </Button>
            );
          })}
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-2">
            <Button 
              size="icon" 
              variant="outline" 
              className="h-8 w-8 rounded-full"
              onClick={() => moveDate('prev')}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <p className="text-sm text-gray-600">
              {selectedDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'short', 
                day: 'numeric' 
              })}
            </p>
            
            <Button 
              size="icon" 
              variant="outline" 
              className="h-8 w-8 rounded-full"
              onClick={() => moveDate('next')}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          <p className="text-sm text-gray-600 mb-2 text-center">
            {moodForSelectedDate 
              ? `Mood: ${getMoodLabel(moodForSelectedDate.score)}` 
              : "How's your creative energy today?"}
          </p>
          
          <div className="flex justify-between">
            {[1, 2, 3, 4, 5].map((score) => (
              <Button
                key={score}
                variant="ghost"
                size="icon"
                className={`rounded-full p-3 ${
                  moodForSelectedDate?.score === score 
                    ? 'bg-skyBlue/10 text-skyBlue'
                    : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => handleMoodSelect(score)}
                disabled={createMood.isPending}
              >
                {getMoodIcon(score)}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function getMoodIcon(score: number) {
  switch (score) {
    case 1: return <FrownIcon className="h-6 w-6" />;
    case 2: return <MehIcon className="h-6 w-6" />;
    case 3: return <SmileIcon className="h-6 w-6" />;
    case 4: return <SmilePlusIcon className="h-6 w-6" />;
    case 5: return <HeartIcon className="h-6 w-6" />;
    default: return <SmileIcon className="h-6 w-6" />;
  }
}

function getMoodLabel(score: number) {
  switch (score) {
    case 1: return "Very Low";
    case 2: return "Low";
    case 3: return "Neutral";
    case 4: return "Good";
    case 5: return "Excellent";
    default: return "Unknown";
  }
}

function MoodTrackerSkeleton() {
  return (
    <Card className="bg-white rounded-2xl shadow-sm border-gray-200/30">
      <CardHeader className="flex flex-row items-center justify-between pb-2 pt-6 px-6">
        <div className="flex items-center">
          <div className="h-2.5 w-2.5 rounded-full bg-gray-200" />
          <Skeleton className="h-6 w-40 ml-2" />
        </div>
        <Skeleton className="h-6 w-24" />
      </CardHeader>
      
      <CardContent className="p-6 pt-0">
        <Skeleton className="h-36 w-full mb-4" />
        
        <div className="grid grid-cols-7 gap-1 text-center mb-6">
          {Array.from({ length: 7 }).map((_, index) => (
            <Skeleton key={index} className="h-14 w-full" />
          ))}
        </div>
        
        <Skeleton className="h-6 w-full mb-2" />
        
        <div className="flex justify-between">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-10 w-10 rounded-full" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
