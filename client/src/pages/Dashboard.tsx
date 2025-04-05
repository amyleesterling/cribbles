import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { DailyBoost } from "@/components/DailyBoost";
import { MoodTracker } from "@/components/MoodTracker";
import { JournalEntries } from "@/components/JournalEntries";
import { ReflectionPrompt } from "@/components/ReflectionPrompt";
import { WellnessResources } from "@/components/WellnessResources";
import { AIChat } from "@/components/AIChat";

export default function Dashboard() {
  // In a real application, this would come from authentication
  // For this demo, we'll use a hardcoded user ID
  const userId = 1;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
                <p className="mt-1 text-sm text-gray-500">Here's your personalized wellness journey</p>
              </div>
            </div>
          </div>
          
          {/* Daily Boost */}
          <div className="mb-8">
            <DailyBoost userId={userId} />
          </div>
          
          {/* Main Content Grids */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <MoodTracker userId={userId} compact={true} />
            <JournalEntries userId={userId} limit={2} />
            <WellnessResources limit={2} />
          </div>
          
          {/* Reflection and Resources */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ReflectionPrompt userId={userId} />
            <div className="grid grid-cols-1 gap-6">
              <WellnessResources category="meditation" limit={1} />
              <WellnessResources category="affirmations" limit={1} />
            </div>
          </div>
        </div>
      </main>
      
      {/* AI Chat Widget */}
      <AIChat userId={userId} />
    </div>
  );
}
