import { Switch, Route, useLocation } from "wouter";
import { type User } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/layout/sidebar";
import MobileNav from "@/components/layout/mobile-nav";
import Dashboard from "@/pages/dashboard";
import Journal from "@/pages/journal";
import Mood from "@/pages/mood";
import DataChat from "@/pages/data-chat";
import Insights from "@/pages/insights";
import Profile from "@/pages/profile";
import Resources from "@/pages/resources";
import VisualInspiration from "@/pages/visual-inspiration";
import WonderLibrary from "@/pages/wonder-library";
import WellnessLibrary from "@/pages/wellness-library";
import YouTubeFeed from "@/pages/youtube-feed";
import Subscribe from "@/pages/subscribe";
import NotFound from "@/pages/not-found";

function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { data: user } = useQuery<Omit<User, "password">>({
    queryKey: ["/api/users/me"],
  });

  return (
    <div className="flex h-screen overflow-hidden">
      {user && <Sidebar user={user} currentPath={location} />}
      <div className="flex-1 flex flex-col overflow-hidden">
        {user && <MobileNav currentPath={location} />}
        <main className="flex-1 overflow-y-auto bg-[#FFF9F9]">
          {children}
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/journal" component={Journal} />
        <Route path="/mood" component={Mood} />
        <Route path="/chat" component={DataChat} />
        <Route path="/data-chat" component={DataChat} />
        <Route path="/insights" component={Insights} />
        <Route path="/profile" component={Profile} />
        <Route path="/resources" component={Resources} />
        <Route path="/inspiration" component={VisualInspiration} />
        <Route path="/visual-inspiration" component={VisualInspiration} />
        <Route path="/wonder-library" component={WonderLibrary} />
        <Route path="/wellness-library" component={WellnessLibrary} />
        <Route path="/youtube-feed" component={YouTubeFeed} />
        <Route path="/subscribe" component={Subscribe} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

export default App;
