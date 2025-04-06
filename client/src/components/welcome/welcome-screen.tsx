import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { MessageCircle, Sparkles } from "lucide-react";
import { Link } from "wouter";
import welcomeImage from "../../assets/welcome-cribbles.png";

export default function WelcomeScreen() {
  const [isVisible, setIsVisible] = useState(true);
  
  // Hide welcome screen after 3 days
  useEffect(() => {
    const lastShown = localStorage.getItem("welcomeScreenLastShown");
    if (lastShown) {
      const daysSinceLastShown = (Date.now() - parseInt(lastShown)) / (1000 * 60 * 60 * 24);
      if (daysSinceLastShown < 3) {
        setIsVisible(false);
        return;
      }
    }
    localStorage.setItem("welcomeScreenLastShown", Date.now().toString());
  }, []);
  
  if (!isVisible) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
    >
      <Card className="max-w-lg w-full bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="relative">
          <img 
            src={welcomeImage} 
            alt="Welcome to Cribbles" 
            className="w-full object-cover"
          />
          
          <div className="absolute top-4 right-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-700 hover:bg-white/20"
              onClick={() => setIsVisible(false)}
            >
              Skip
            </Button>
          </div>
        </div>
        
        <div className="p-6 text-center">
          <h2 className="text-2xl font-display font-bold mb-2">Your Friend for Zenful Joy</h2>
          <p className="text-gray-600 mb-6">
            Cribbles is your personal companion who will chat with you, learn about your life,
            and provide beautiful imagery and wisdom to inspire wonder and joy.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/data-chat">
              <Button className="w-full sm:w-auto bg-skyBlue hover:bg-skyBlue/90 text-white">
                <MessageCircle className="mr-2 h-4 w-4" /> Let's Chat
              </Button>
            </Link>
            <Link href="/visual-inspiration">
              <Button variant="outline" className="w-full sm:w-auto border-skyBlue text-skyBlue hover:bg-skyBlue/10">
                <Sparkles className="mr-2 h-4 w-4" /> Inspire Me
              </Button>
            </Link>
            <Button 
              variant="ghost" 
              className="w-full sm:w-auto mt-2 sm:mt-0"
              onClick={() => setIsVisible(false)}
            >
              Continue to Dashboard
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}