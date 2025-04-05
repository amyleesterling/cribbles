import { Link } from "wouter";
import MotionDot from "../ui/motion-dot";
import { type User } from "@shared/schema";

// Icons
import { 
  Home, 
  MessageCircle, 
  Sparkles, 
  ImageIcon, 
  FileText 
} from "lucide-react";

type SidebarProps = {
  user: Omit<User, "password">;
  currentPath: string;
};

export default function Sidebar({ user, currentPath }: SidebarProps) {
  const navItems = [
    { path: "/", label: "Home", icon: <Home className="mr-3 h-5 w-5" /> },
    { path: "/chat", label: "Conversations", icon: <MessageCircle className="mr-3 h-5 w-5" /> },
  ];

  const toolItems = [
    { path: "/visual-inspiration", label: "Visual Inspiration", icon: <ImageIcon className="mr-3 h-5 w-5" /> },
    { path: "/resources", label: "Wonder Library", icon: <FileText className="mr-3 h-5 w-5" /> },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-200">
      <div className="p-6">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-lg bg-skyBlue flex items-center justify-center mr-3">
            <MotionDot />
          </div>
          <h1 className="font-display font-bold text-xl">ZenfulJoy</h1>
        </div>
      </div>
      
      <nav className="flex-1 px-4 py-2">
        <div className="mb-8">
          <p className="text-sm uppercase text-gray-400 font-medium mb-4 px-3">Main</p>
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              href={item.path}
              className={`flex items-center mb-3 px-3 py-2 rounded-lg ${
                currentPath === item.path 
                  ? "bg-skyBlue text-white" 
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
        
        <div className="mb-8">
          <p className="text-sm uppercase text-gray-400 font-medium mb-4 px-3">Tools</p>
          {toolItems.map((item) => (
            <Link 
              key={item.path} 
              href={item.path}
              className={`flex items-center mb-3 px-3 py-2 rounded-lg ${
                currentPath === item.path 
                  ? "bg-skyBlue text-white" 
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
      
      <div className="p-6 mt-auto">
        <div className="bg-gray-50 rounded-2xl p-4">
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 rounded-full bg-skyBlue/20 flex items-center justify-center mr-3 text-skyBlue">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-medium">{user.name}</p>
              <p className="text-xs text-gray-500">{user.role || "Wellness Explorer"}</p>
            </div>
          </div>
          <Link href="/profile" className="block w-full py-2 rounded-lg text-sm border border-gray-200 hover:bg-gray-100 text-center">
            View Profile
          </Link>
        </div>
      </div>
    </aside>
  );
}
