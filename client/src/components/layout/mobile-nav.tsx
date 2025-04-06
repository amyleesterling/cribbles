import { Link } from "wouter";
import MotionDot from "../ui/motion-dot";
import { Home, MessageCircle, ImageIcon, FileText, Menu } from "lucide-react";

type MobileNavProps = {
  currentPath: string;
};

export default function MobileNav({ currentPath }: MobileNavProps) {
  return (
    <>
      {/* Top Navigation - Mobile Only */}
      <nav className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-skyBlue/20">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-lg cribbles-gradient flex items-center justify-center mr-3">
            <MotionDot />
          </div>
          <h1 className="font-display font-bold text-xl text-darkGray">Cribbles</h1>
        </div>
      </nav>
      
      {/* Bottom Navigation - Mobile Only */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-skyBlue/20 p-2 flex justify-around items-center z-10">
        <Link 
          href="/" 
          className={`flex flex-col items-center p-2 ${
            currentPath === "/" ? "text-skyBlue font-medium" : "text-darkGray/60 hover:text-darkGray"
          }`}
        >
          <Home className="h-5 w-5" />
          <span className="text-xs mt-1">Home</span>
        </Link>
        
        <Link 
          href="/data-chat" 
          className={`flex flex-col items-center p-2 ${
            currentPath === "/data-chat" ? "text-vibrantPink font-medium" : "text-darkGray/60 hover:text-darkGray"
          }`}
        >
          <MessageCircle className="h-5 w-5" />
          <span className="text-xs mt-1">Chat</span>
        </Link>
        
        <Link 
          href="/visual-inspiration" 
          className={`flex flex-col items-center p-2 ${
            currentPath === "/visual-inspiration" ? "text-goldenYellow font-medium" : "text-darkGray/60 hover:text-darkGray"
          }`}
        >
          <ImageIcon className="h-5 w-5" />
          <span className="text-xs mt-1">Inspire</span>
        </Link>
        
        <Link 
          href="/resources" 
          className={`flex flex-col items-center p-2 ${
            currentPath === "/resources" ? "text-skyBlue font-medium" : "text-darkGray/60 hover:text-darkGray"
          }`}
        >
          <FileText className="h-5 w-5" />
          <span className="text-xs mt-1">Library</span>
        </Link>
      </nav>
    </>
  );
}
