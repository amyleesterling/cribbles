import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProgressInsight, ScoreInsight, GridInsight } from "@/components/dashboard/insight-card";
import { motion } from "framer-motion";

export default function Insights() {
  const [activeTab, setActiveTab] = useState("wellness");
  
  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="font-display font-bold text-2xl md:text-3xl mb-1">Insights & Analytics</h1>
        <p className="text-gray-500">Track your progress and discover patterns in your wellness journey</p>
      </div>
      
      <Tabs defaultValue="wellness" value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="bg-gray-100">
          <TabsTrigger value="wellness">Wellness</TabsTrigger>
          <TabsTrigger value="creativity">Creativity</TabsTrigger>
          <TabsTrigger value="productivity">Productivity</TabsTrigger>
        </TabsList>
        
        <TabsContent value="wellness" className="mt-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              <ScoreInsight
                title="Overall Wellbeing"
                score={8.2}
                trend={{ value: 0.8, isPositive: true }}
                description="Your wellbeing score has been steadily increasing over the past month."
              />
              
              <ScoreInsight
                title="Stress Level"
                score={3.5}
                maxScore={10}
                trend={{ value: 1.2, isPositive: true }}
                description="Lower stress levels detected. Your meditation practices are working!"
              />
              
              <ProgressInsight
                title="Mindfulness Goals"
                progress={75}
                label="Weekly mindfulness minutes"
                description="You've spent 150 minutes on mindfulness activities this week."
              />
            </div>
            
            <Card className="bg-white rounded-2xl shadow-sm border-gray-200/30 mb-6">
              <CardContent className="p-6">
                <h3 className="font-display font-semibold text-lg mb-4">Wellness Trends (Last 30 Days)</h3>
                <div className="h-72 w-full bg-gray-50 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Wellness trend chart will appear here</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
        
        <TabsContent value="creativity" className="mt-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              <ScoreInsight
                title="Creative Flow"
                score={7.8}
                trend={{ value: 1.2, isPositive: true }}
                description="Your creative flow state duration has increased."
              />
              
              <GridInsight
                title="Inspiration Sources"
                items={[
                  { label: "Pinterest", value: "", percent: 42 },
                  { label: "Behance", value: "", percent: 27 },
                  { label: "Books", value: "", percent: 18 },
                  { label: "Nature", value: "", percent: 13 }
                ]}
                description="Digital sources dominate your inspiration inputs."
              />
              
              <ProgressInsight
                title="Idea Implementation"
                progress={65}
                label="Ideas brought to life"
                description="You've implemented 13 out of 20 ideas from your idea journal."
              />
            </div>
          </motion.div>
        </TabsContent>
        
        <TabsContent value="productivity" className="mt-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              <ProgressInsight
                title="Project Completion"
                progress={85}
                label="Monthly Goal"
                trend={{ value: 12, isPositive: true }}
                description="You're ahead of schedule by 12% compared to last month."
              />
              
              <ScoreInsight
                title="Focus Score"
                score={8.5}
                trend={{ value: 0.7, isPositive: true }}
                description="Your ability to maintain focus has improved."
              />
              
              <GridInsight
                title="Productive Hours"
                items={[
                  { label: "Morning", value: "", percent: 45 },
                  { label: "Afternoon", value: "", percent: 30 },
                  { label: "Evening", value: "", percent: 20 },
                  { label: "Night", value: "", percent: 5 }
                ]}
                description="Morning hours are your most productive time."
              />
            </div>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
