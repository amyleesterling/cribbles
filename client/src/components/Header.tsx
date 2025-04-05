import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { AiOutlineUser, AiOutlineBell } from "react-icons/ai";
import { MdOutlineLightbulb } from "react-icons/md";

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/">
              <a className="flex-shrink-0 flex items-center">
                <div className="w-8 h-8 rounded-full bg-sky-400 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-amber-400 animate-pulse"></div>
                </div>
                <span className="ml-2 text-xl font-semibold text-gray-900">ZenJoy</span>
              </a>
            </Link>
            <nav className="ml-8 hidden md:flex space-x-6">
              <Link href="/">
                <a className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium">Dashboard</a>
              </Link>
              <Link href="/journal">
                <a className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium">Journal</a>
              </Link>
              <Link href="/resources">
                <a className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium">Resources</a>
              </Link>
              <Link href="/mood-history">
                <a className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium">Mood Tracker</a>
              </Link>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Button variant="ghost" size="icon" className="rounded-full text-gray-600">
                <AiOutlineBell size={20} />
              </Button>
            </div>
            <Link href="/profile">
              <a className="ml-4 flex-shrink-0">
                <Button variant="ghost" size="icon" className="rounded-full text-gray-600">
                  <AiOutlineUser size={20} />
                </Button>
              </a>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
