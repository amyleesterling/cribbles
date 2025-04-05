import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, Sparkles } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { type User } from "@shared/schema";

import DailyBoostCard from "@/components/dashboard/daily-boost";
import JournalWidget from "@/components/dashboard/journal";
import ResourcesWidget from "@/components/dashboard/resources";
import { motion } from "framer-motion";

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
          <p className="text-gray-500">A new day of inspiration and personal growth awaits</p>
        </div>
        <div className="hidden sm:block">
          <Button className="bg-skyBlue hover:bg-skyBlue/90 text-white">
            <Sparkles className="mr-2 h-4 w-4" /> Inspire Me
          </Button>
        </div>
      </div>

      {/* Daily Boost Card */}
      <DailyBoostCard />
      
      {/* Philosophical Quote */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="p-6 mb-6 bg-gradient-to-r from-skyBlue/10 to-skyBlue/5 rounded-xl"
      >
        <blockquote className="text-xl md:text-2xl italic font-light text-gray-700">
          "The goal of life is to make your heartbeat match the beat of the universe, to match your nature with Nature."
        </blockquote>
        <p className="text-sm text-right mt-2 text-gray-500">— Joseph Campbell</p>
      </motion.div>
      
      {/* Journal Section */}
      <div className="mb-6">
        <JournalWidget />
      </div>
      
      {/* Resources Section */}
      <ResourcesWidget />
    </div>
  );
}
