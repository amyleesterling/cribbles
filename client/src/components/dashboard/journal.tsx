import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { type Journal } from "@shared/schema";
import MotionDot from "../ui/motion-dot";
import { Plus } from "lucide-react";

export default function JournalWidget() {
  const { data: journals, isLoading } = useQuery<Journal[]>({
    queryKey: ["/api/journals"],
  });
  
  if (isLoading) {
    return <JournalWidgetSkeleton />;
  }
  
  const recentJournals = journals?.slice(0, 2) || [];
  
  return (
    <Card className="bg-white rounded-2xl shadow-sm border-gray-200/30 h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2 pt-6 px-6">
        <div className="flex items-center">
          <MotionDot />
          <CardTitle className="font-display font-semibold text-xl ml-2">Creative Journal</CardTitle>
        </div>
        <Link href="/journal/new">
          <Button size="sm" className="bg-skyBlue text-white hover:bg-skyBlue/90">
            <Plus className="mr-1 h-4 w-4" /> New Entry
          </Button>
        </Link>
      </CardHeader>
      
      <CardContent className="p-6 pt-0">
        <div className="space-y-4 mb-4">
          {recentJournals.length > 0 ? (
            recentJournals.map((journal) => (
              <JournalEntry key={journal.id} journal={journal} />
            ))
          ) : (
            <div className="p-6 text-center">
              <p className="text-gray-500 mb-2">No journal entries yet</p>
              <Link href="/journal/new">
                <Button variant="outline" size="sm">
                  Create your first entry
                </Button>
              </Link>
            </div>
          )}
        </div>
        
        {recentJournals.length > 0 && (
          <div className="text-center">
            <Link href="/journal">
              <Button variant="link" className="text-skyBlue">
                View All Journal Entries
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface JournalEntryProps {
  journal: Journal;
}

function JournalEntry({ journal }: JournalEntryProps) {
  return (
    <motion.div
      whileHover={{ y: -2, backgroundColor: "rgba(240, 244, 248, 0.5)" }}
      transition={{ duration: 0.2 }}
      className="p-4 border border-gray-200/30 rounded-lg hover:bg-gray-50/50 cursor-pointer"
    >
      <Link href={`/journal/${journal.id}`}>
        <div className="flex justify-between items-center mb-2">
          <div className="font-medium">{journal.title}</div>
          <div className="text-xs text-gray-500">
            {new Date(journal.createdAt).toLocaleString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
              hour12: true
            })}
          </div>
        </div>
        <p className="text-sm text-gray-600 line-clamp-2">
          {journal.content}
        </p>
      </Link>
    </motion.div>
  );
}

function JournalWidgetSkeleton() {
  return (
    <Card className="bg-white rounded-2xl shadow-sm border-gray-200/30 h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2 pt-6 px-6">
        <div className="flex items-center">
          <div className="h-2.5 w-2.5 rounded-full bg-gray-200" />
          <Skeleton className="h-6 w-40 ml-2" />
        </div>
        <Skeleton className="h-9 w-24" />
      </CardHeader>
      
      <CardContent className="p-6 pt-0">
        <div className="space-y-4 mb-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
        
        <div className="text-center">
          <Skeleton className="h-6 w-40 mx-auto" />
        </div>
      </CardContent>
    </Card>
  );
}
