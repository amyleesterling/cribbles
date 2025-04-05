import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import MotionDot from "../ui/motion-dot";
import { Activity, RefreshCw } from "lucide-react";
import type { DailyBoost } from "@shared/schema";

export default function DailyBoostCard() {
  const { 
    data: boost, 
    isLoading, 
    isError, 
    refetch 
  } = useQuery<DailyBoost>({ 
    queryKey: ["/api/daily-boost"] 
  });

  const markAsSeen = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("POST", `/api/daily-boost/${id}/seen`, {});
    }
  });

  // Mark boost as seen when component mounts
  useEffect(() => {
    if (boost && !boost.seenAt) {
      markAsSeen.mutate(boost.id);
    }
  }, [boost]);

  if (isLoading) {
    return <DailyBoostSkeleton />;
  }

  if (isError || !boost) {
    return (
      <Card className="bg-white rounded-2xl shadow-sm mb-6 border-gray-200/30">
        <CardContent className="p-6">
          <div className="flex items-center mb-3">
            <MotionDot />
            <h2 className="font-display font-semibold text-xl ml-2">Your Daily Creative Boost</h2>
          </div>
          <p className="text-gray-600">
            Unable to load your daily boost. Please try again later.
          </p>
          <Button 
            variant="outline" 
            className="mt-4" 
            onClick={() => refetch()}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white rounded-2xl shadow-sm mb-6 border-gray-200/30 relative overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between relative z-10">
          <div className="mb-4 md:mb-0 md:pr-8 md:w-2/3">
            <div className="flex items-center mb-3">
              <MotionDot />
              <h2 className="font-display font-semibold text-xl ml-2">Your Daily Creative Boost</h2>
            </div>
            <p className="mb-4 text-gray-600 leading-relaxed">
              "{boost.content}"
            </p>
            <div className="flex flex-wrap items-center gap-2">
              {boost.tags && boost.tags.map((tag, index) => {
                // Alternate tag colors
                const colorClasses = [
                  "bg-skyBlue/10 text-skyBlue",
                  "bg-sunshineYellow/10 text-gray-700",
                  "bg-green-100 text-green-700",
                ];
                const colorClass = colorClasses[index % colorClasses.length];
                
                return (
                  <span 
                    key={index} 
                    className={`inline-block py-1 px-3 rounded-full text-sm ${colorClass}`}
                  >
                    {tag}
                  </span>
                );
              })}
            </div>
          </div>
          
          <div className="md:w-1/3">
            <WaveAnimation />
          </div>
        </div>
        
        {/* Decorative element */}
        <div className="absolute top-0 right-0 opacity-5 pointer-events-none">
          <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="100" r="100" fill="#4AA9FF"/>
          </svg>
        </div>
      </CardContent>
    </Card>
  );
}

function WaveAnimation() {
  return (
    <motion.div
      className="w-full h-40"
      initial={{ y: 10 }}
      animate={{ 
        y: [10, -10, 10]
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        repeatType: "loop",
        ease: "easeInOut"
      }}
    >
      <svg width="100%" height="100%" viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
        <motion.path 
          d="M0,50 C20,30 40,70 60,50 C80,30 100,60 120,50 C140,40 160,80 180,60 C200,40 220,50 240,30" 
          fill="none" 
          stroke="#4AA9FF" 
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
        <motion.circle 
          cx="60" cy="50" r="4" 
          fill="#FFD84A"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        />
        <motion.circle 
          cx="120" cy="50" r="4" 
          fill="#FFD84A"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        />
        <motion.circle 
          cx="180" cy="60" r="4" 
          fill="#FFD84A"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
        />
      </svg>
    </motion.div>
  );
}

function DailyBoostSkeleton() {
  return (
    <Card className="bg-white rounded-2xl shadow-sm mb-6 border-gray-200/30">
      <CardContent className="p-6">
        <div className="flex items-center mb-3">
          <div className="h-2.5 w-2.5 rounded-full bg-gray-200" />
          <Skeleton className="h-6 w-60 ml-2" />
        </div>
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4 mb-4" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      </CardContent>
    </Card>
  );
}
