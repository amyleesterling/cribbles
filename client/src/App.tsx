import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import Journal from "@/pages/Journal";
import Resources from "@/pages/Resources";
import MoodHistory from "@/pages/MoodHistory";
import Profile from "@/pages/Profile";
import { useState, useEffect } from "react";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/journal" component={Journal} />
      <Route path="/journal/:id">
        {params => <Journal />}
      </Route>
      <Route path="/journal/new">
        <Journal />
      </Route>
      <Route path="/resources" component={Resources} />
      <Route path="/resources/:id">
        {params => <Resources />}
      </Route>
      <Route path="/mood-history" component={MoodHistory} />
      <Route path="/profile" component={Profile} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // Adding cloud background effect with subtle animation
  useEffect(() => {
    // Add a subtle cloud-like background animation to the body
    document.body.classList.add('bg-gradient-to-b', 'from-sky-50', 'to-gray-50');
    
    // Clean up
    return () => {
      document.body.classList.remove('bg-gradient-to-b', 'from-sky-50', 'to-gray-50');
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="relative min-h-screen">
        {/* Subtle cloud background pattern */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
          <div className="cloud-pattern w-full h-full"></div>
        </div>
        
        {/* Sunshine dot animation */}
        <div className="fixed top-20 right-20 w-3 h-3 rounded-full bg-amber-400 animate-pulse"></div>
        <div className="fixed bottom-40 left-20 w-2 h-2 rounded-full bg-amber-300 animate-pulse" style={{ animationDelay: '0.7s' }}></div>
        <div className="fixed top-40 left-40 w-2 h-2 rounded-full bg-amber-300 animate-pulse" style={{ animationDelay: '1.3s' }}></div>
        
        <Router />
        <Toaster />
      </div>
      
      <style jsx global>{`
        .cloud-pattern {
          background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxkZWZzPgogICAgPHBhdHRlcm4gaWQ9ImNsb3VkcyIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIHBhdHRlcm5UcmFuc2Zvcm09InNjYWxlKDAuNSkiPgogICAgICA8cGF0aCBmaWxsPSJyZ2JhKDc3LCAxNzEsIDI0NywgMC4wNSkiIGQ9Ik0tMjUgMTAwIEEzMCAzMCAwIDAgMSA1IDEwMCBBMjAgMjAgMCAwIDAgMzUgMTAwIEEyMCAyMCAwIDAgMCA2NSAxMDAgQTIwIDIwIDAgMCAwIDk1IDEwMCBBMjAgMjAgMCAwIDAgMTI1IDEwMCBBMzAgMzAgMCAwIDEgMTU1IDEwMCBMMTU1IDEyMCBMLTI1IDEyMCBaIiAvPgogICAgPC9wYXR0ZXJuPgogIDwvZGVmcz4KICA8cmVjdCBmaWxsPSJ1cmwoI2Nsb3VkcykiIHg9IjAiIHk9IjAiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIC8+Cjwvc3ZnPg==');
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </QueryClientProvider>
  );
}

export default App;
