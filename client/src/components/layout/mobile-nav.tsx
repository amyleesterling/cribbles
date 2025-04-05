import { Link } from "wouter";
import MotionDot from "../ui/motion-dot";
import { LayoutDashboard, MessageCircle, LineChart, SmilePlus, Menu } from "lucide-react";

type MobileNavProps = {
  currentPath: string;
};

export default function MobileNav({ currentPath }: MobileNavProps) {
  return (
    <>
      {/* Top Navigation - Mobile Only */}
      <nav className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-lg bg-skyBlue flex items-center justify-center mr-3">
            <MotionDot />
          </div>
          <h1 className="font-display font-bold text-xl">InsightFlow</h1>
        </div>
      </nav>
      
      {/* Bottom Navigation - Mobile Only */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-2 flex justify-around items-center z-10">
        <Link 
          href="/" 
          className={`flex flex-col items-center p-2 ${
            currentPath === "/" ? "text-skyBlue" : "text-gray-500"
          }`}
        >
          <LayoutDashboard className="h-5 w-5" />
          <span className="text-xs">Dashboard</span>
        </Link>
        
        <Link 
          href="/chat" 
          className={`flex flex-col items-center p-2 ${
            currentPath === "/chat" ? "text-skyBlue" : "text-gray-500"
          }`}
        >
          <MessageCircle className="h-5 w-5" />
          <span className="text-xs">Chat</span>
        </Link>
        
        <Link 
          href="/insights" 
          className={`flex flex-col items-center p-2 ${
            currentPath === "/insights" ? "text-skyBlue" : "text-gray-500"
          }`}
        >
          <LineChart className="h-5 w-5" />
          <span className="text-xs">Insights</span>
        </Link>
        
        <Link 
          href="/mood" 
          className={`flex flex-col items-center p-2 ${
            currentPath === "/mood" ? "text-skyBlue" : "text-gray-500"
          }`}
        >
          <SmilePlus className="h-5 w-5" />
          <span className="text-xs">Mood</span>
        </Link>
        
        <Link 
          href="/journal" 
          className={`flex flex-col items-center p-2 ${
            currentPath === "/journal" ? "text-skyBlue" : "text-gray-500"
          }`}
        >
          <Menu className="h-5 w-5" />
          <span className="text-xs">More</span>
        </Link>
      </nav>
    </>
  );
}
