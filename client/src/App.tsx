import { useState, useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";

import Sidebar from "./components/layout/sidebar";
import MobileNav from "./components/layout/mobile-nav";

// Pages
import Dashboard from "@/pages/dashboard";
import DataChat from "@/pages/data-chat";
import VisualInspiration from "@/pages/visual-inspiration";
import Resources from "@/pages/resources";
import Profile from "@/pages/profile";
import NotFound from "@/pages/not-found";
import { type User } from "@shared/schema";

function Router() {
  const [user, setUser] = useState<Omit<User, "password"> | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [location] = useLocation();

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch("/api/users/me");
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load user data. Please refresh the page.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [toast]);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-softWhite">
        <div className="text-skyBlue animate-pulse text-2xl font-display">Loading InsightFlow...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-softWhite">
        <div className="text-skyBlue text-2xl font-display">Please log in</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-softWhite">
      {/* Sidebar - Desktop only */}
      <Sidebar user={user} currentPath={location} />
      
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-softWhite pb-16 lg:pb-0">
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/chat" component={DataChat} />
          <Route path="/visual-inspiration" component={VisualInspiration} />
          <Route path="/resources" component={Resources} />
          <Route path="/profile" component={Profile} />
          <Route component={NotFound} />
        </Switch>
      </main>
      
      {/* Mobile Navigation */}
      <MobileNav currentPath={location} />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
