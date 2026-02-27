import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { MessageCircle, Sparkles } from "lucide-react";
import { Link } from "wouter";
import welcomeImage from "@assets/welcome to cribbles.png";

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
      <Card className="max-w-lg w-full bg-white rounded-xl shadow-xl overflow-hidden border-0">
        <div className="relative">
          <img
            src={welcomeImage}
            alt="Mira Solis | The 650 Method"
            className="w-full object-cover"
          />

          <div className="absolute top-4 right-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 backdrop-blur-sm"
              onClick={() => setIsVisible(false)}
            >
              Skip
            </Button>
          </div>
        </div>

        <div className="p-6 text-center">
          <h2 className="text-2xl font-display font-bold mb-1 text-darkGray">Mira Solis</h2>
          <p className="text-sm font-medium text-gray-400 uppercase tracking-widest mb-3">The 650 Method</p>
          <p className="text-darkGray/70 mb-6">
            Your AI wellness companion — powered by the 650 Method. Chat with Mira, track your journey,
            and discover beautiful imagery and wisdom to inspire your best self.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/data-chat">
              <Button className="w-full sm:w-auto cribbles-button-primary">
                <MessageCircle className="mr-2 h-4 w-4" /> Let's Chat
              </Button>
            </Link>
            <Link href="/visual-inspiration">
              <Button className="w-full sm:w-auto cribbles-button-secondary">
                <Sparkles className="mr-2 h-4 w-4" /> Inspire Me
              </Button>
            </Link>
            <Button
              variant="outline"
              className="w-full sm:w-auto mt-2 sm:mt-0 border-vibrantPink text-vibrantPink hover:bg-vibrantPink/10"
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
