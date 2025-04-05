import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { type Journal } from "@shared/schema";
import { CalendarIcon, Clock, ChevronRight } from "lucide-react";

interface JournalEntryProps {
  journal: Journal;
  preview?: boolean;
}

export default function JournalEntry({ journal, preview = true }: JournalEntryProps) {
  // Format the date
  const formattedDate = new Date(journal.createdAt).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });
  
  // Format the time
  const formattedTime = new Date(journal.createdAt).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
  
  // For previews, show a truncated version of the content
  const content = preview 
    ? journal.content.length > 200 
      ? `${journal.content.substring(0, 200)}...` 
      : journal.content
    : journal.content;
  
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="bg-white rounded-2xl shadow-sm border-gray-200/30 overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
            <h3 className="font-display font-semibold text-lg">{journal.title}</h3>
            <div className="flex items-center text-gray-500 text-sm mt-1 md:mt-0">
              <CalendarIcon className="h-3.5 w-3.5 mr-1" />
              <span className="mr-3">{formattedDate}</span>
              <Clock className="h-3.5 w-3.5 mr-1" />
              <span>{formattedTime}</span>
            </div>
          </div>
          
          <p className="text-gray-600 mb-4 whitespace-pre-line">
            {content}
          </p>
          
          {preview && (
            <div className="flex justify-end">
              <Link href={`/journal/${journal.id}`}>
                <Button variant="ghost" size="sm" className="text-skyBlue hover:text-skyBlue hover:bg-skyBlue/10">
                  Read More <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
