import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { type User } from "@shared/schema";

import DailyBoostCard from "@/components/dashboard/daily-boost";
import { ProgressInsight, ScoreInsight, GridInsight } from "@/components/dashboard/insight-card";
import MoodTracker from "@/components/dashboard/mood-tracker";
import JournalWidget from "@/components/dashboard/journal";
import ResourcesWidget from "@/components/dashboard/resources";

export default function Dashboard() {
  const { data: user } = useQuery<Omit<User, "password">>({ 
    queryKey: ["/api/users/me"] 
  });
  const [greeting, setGreeting] = useState("");
  
  useEffect(() => {
    const hours = new Date().getHours();
    let timeGreeting = "Hello";
    
    if (hours < 12) {
      timeGreeting = "Good morning";
    } else if (hours < 18) {
      timeGreeting = "Good afternoon";
    } else {
      timeGreeting = "Good evening";
    }
    
    setGreeting(timeGreeting);
  }, []);
  
  return (
    <div className="p-4 md:p-6 lg:p-8">
      {/* Welcome Section */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-bold text-2xl md:text-3xl mb-1">
            {greeting}, {user?.name?.split(' ')[0] || 'there'}!
          </h1>
          <p className="text-gray-500">Here's what's happening with your wellness journey today</p>
        </div>
        <div className="hidden sm:block">
          <Button variant="outline" className="mr-2 border-skyBlue text-skyBlue hover:bg-skyBlue/10">
            <RefreshCw className="mr-2 h-4 w-4" /> Refresh Data
          </Button>
          <Button className="bg-skyBlue hover:bg-skyBlue/90 text-white">
            <Plus className="mr-2 h-4 w-4" /> New Analysis
          </Button>
        </div>
      </div>

      {/* Daily Boost Card */}
      <DailyBoostCard />
      
      {/* Data Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <ProgressInsight 
          title="Project Completion" 
          progress={85} 
          label="Monthly Goal" 
          trend={{ value: 12, isPositive: true }}
          description="You're ahead of schedule by 12% compared to last month."
        />
        
        <ScoreInsight 
          title="Creative Flow" 
          score={7.8} 
          trend={{ value: 1.2, isPositive: true }}
          description="Your flow score is improving. Longer uninterrupted work sessions detected."
        />
        
        <GridInsight 
          title="Inspiration Sources" 
          items={[
            { label: "Pinterest", value: "", percent: 42 },
            { label: "Behance", value: "", percent: 27 },
            { label: "Books", value: "", percent: 18 },
            { label: "Nature", value: "", percent: 13 },
          ]}
          description="Digital sources dominate your inspiration inputs."
        />
      </div>
      
      {/* Mood and Journal Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <MoodTracker />
        <JournalWidget />
      </div>
      
      {/* Resources Section */}
      <ResourcesWidget />
    </div>
  );
}
