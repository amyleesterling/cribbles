import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, Sparkles, Heart, MessageCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { type User } from "@shared/schema";
import { Link } from "wouter";
import DailyBoostCard from "@/components/dashboard/daily-boost";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

// Daily quotes that rotate
const dailyQuotes = [
  { quote: "The goal of life is to make your heartbeat match the beat of the universe, to match your nature with Nature.", author: "Joseph Campbell" },
  { quote: "Happiness is not something ready-made. It comes from your own actions.", author: "Dalai Lama" },
  { quote: "The present moment is filled with joy and happiness. If you are attentive, you will see it.", author: "Thich Nhat Hanh" },
  { quote: "We are shaped by our thoughts; we become what we think.", author: "Buddha" },
  { quote: "Yesterday I was clever, so I wanted to change the world. Today I am wise, so I am changing myself.", author: "Rumi" },
  { quote: "Life isn't about finding yourself. Life is about creating yourself.", author: "George Bernard Shaw" },
  { quote: "The most beautiful experience we can have is the mysterious.", author: "Albert Einstein" }
];

export default function Dashboard() {
  const { data: user } = useQuery<Omit<User, "password">>({ 
    queryKey: ["/api/users/me"] 
  });
  const [greeting, setGreeting] = useState("");
  const [dailyQuote, setDailyQuote] = useState(dailyQuotes[0]);
  const [companionName, setCompanionName] = useState("Cribbles");
  
  useEffect(() => {
    // Set time-based greeting
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
    
    // Select a quote based on the day of the month (for consistency within a day)
    const today = new Date();
    const dayOfMonth = today.getDate();
    const quoteIndex = dayOfMonth % dailyQuotes.length;
    setDailyQuote(dailyQuotes[quoteIndex]);
  }, []);
  
  return (
    <div className="p-4 md:p-6 lg:p-8">
      {/* Welcome Section with AI Companion Presence */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-skyBlue to-blue-500 flex items-center justify-center text-white overflow-hidden shadow-lg">
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity,
                repeatType: "reverse" 
              }}
            >
              <Heart className="h-8 w-8" />
            </motion.div>
          </div>
          <div className="ml-4">
            <h1 className="font-display font-bold text-2xl md:text-3xl mb-1">
              {greeting}, {user?.name?.split(' ')[0] || 'there'}!
            </h1>
            <p className="text-gray-600">I'm {companionName}, your companion for zenful joy.</p>
          </div>
        </div>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-gray-700 ml-20"
        >
          How are you feeling today? Would you like to chat or find some inspiration?
        </motion.p>
        
        <div className="flex space-x-4 mt-6 ml-20">
          <Link href="/data-chat">
            <Button className="bg-skyBlue hover:bg-skyBlue/90 text-white">
              <MessageCircle className="mr-2 h-4 w-4" /> Let's Chat
            </Button>
          </Link>
          <Link href="/visual-inspiration">
            <Button variant="outline" className="border-skyBlue text-skyBlue hover:bg-skyBlue/10">
              <Sparkles className="mr-2 h-4 w-4" /> Inspire Me
            </Button>
          </Link>
        </div>
      </div>

      {/* Daily Image and Quote */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Daily Image */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="rounded-xl overflow-hidden h-64 shadow-md"
        >
          <div className="h-full w-full bg-gradient-to-br from-skyBlue/30 to-indigo-200 flex items-center justify-center">
            <div className="text-center p-6">
              <p className="text-gray-700 text-lg mb-4">Today's inspiration will appear here</p>
              <p className="text-sm text-gray-600">(OpenAI image generation)</p>
            </div>
          </div>
        </motion.div>
        
        {/* Daily Quote */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="p-6 rounded-xl bg-gradient-to-r from-skyBlue/10 to-skyBlue/5 shadow-sm flex flex-col justify-center"
        >
          <blockquote className="text-xl md:text-2xl italic font-light text-gray-700">
            "{dailyQuote.quote}"
          </blockquote>
          <p className="text-sm text-right mt-4 text-gray-500">— {dailyQuote.author}</p>
        </motion.div>
      </div>
      
      {/* Daily Boost Card */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Today's Reflection</h2>
        <DailyBoostCard />
      </div>
    </div>
  );
}
