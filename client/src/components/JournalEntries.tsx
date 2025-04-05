import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MdAdd, MdArrowForward } from "react-icons/md";
import { formatDistanceToNow } from "date-fns";

interface JournalEntriesProps {
  userId: number;
  limit?: number;
}

export function JournalEntries({ userId, limit = 3 }: JournalEntriesProps) {
  const { data: entries, isLoading } = useQuery({
    queryKey: [`/api/users/${userId}/journal-entries`],
  });

  const limitedEntries = entries?.slice(0, limit);

  const getMoodColor = (mood: string) => {
    switch (mood?.toLowerCase()) {
      case 'joyful':
        return 'bg-amber-400';
      case 'peaceful':
        return 'bg-sky-400';
      case 'inspired':
        return 'bg-purple-400';
      case 'focused':
        return 'bg-blue-400';
      case 'neutral':
        return 'bg-gray-400';
      case 'stressed':
        return 'bg-orange-400';
      case 'overwhelmed':
        return 'bg-red-400';
      default:
        return 'bg-gray-400';
    }
  };

  const getCreativityLabel = (score?: number) => {
    if (!score) return null;
    if (score >= 8) return "High creativity";
    if (score >= 5) return "Medium creativity";
    return "Low creativity";
  };

  if (isLoading) {
    return (
      <Card className="shadow-md border border-gray-100">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-medium text-gray-900">Journal & Reflections</CardTitle>
          <Button variant="ghost" size="sm" className="text-sky-500">
            <MdAdd className="mr-1" /> New Entry
          </Button>
        </CardHeader>
        <CardContent>
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 bg-gray-50 rounded-lg mb-4">
              <div className="flex justify-between items-start">
                <Skeleton className="h-5 w-2/3 mb-2" />
                <Skeleton className="h-4 w-16" />
              </div>
              <Skeleton className="h-4 w-full mb-4" />
              <div className="flex items-center">
                <Skeleton className="h-4 w-20 mr-4" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-md border border-gray-100">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium text-gray-900">Journal & Reflections</CardTitle>
        <Link href="/journal/new">
          <Button variant="ghost" size="sm" className="text-sky-500">
            <MdAdd className="mr-1" /> New Entry
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {limitedEntries && limitedEntries.length > 0 ? (
          <div className="space-y-4">
            {limitedEntries.map((entry) => (
              <Link key={entry.id} href={`/journal/${entry.id}`}>
                <a className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition duration-300">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-900">{entry.title}</h4>
                      <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                        {entry.content.substring(0, 120)}
                        {entry.content.length > 120 ? "..." : ""}
                      </p>
                    </div>
                    <span className="text-xs text-gray-400">
                      {formatDistanceToNow(new Date(entry.date), { addSuffix: true })}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center">
                    {entry.mood && (
                      <div className="flex items-center">
                        <span className={`w-2 h-2 rounded-full ${getMoodColor(entry.mood)} mr-2`}></span>
                        <span className="text-xs text-gray-500">{entry.mood}</span>
                      </div>
                    )}
                    {entry.creativityScore && (
                      <div className="ml-4 flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-sky-400 mr-1"
                        >
                          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                        </svg>
                        <span className="text-xs text-gray-500">
                          {getCreativityLabel(entry.creativityScore)}
                        </span>
                      </div>
                    )}
                  </div>
                </a>
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <p className="text-gray-500 mb-4">No journal entries yet</p>
            <Link href="/journal/new">
              <Button variant="skyOutline">Start Journaling</Button>
            </Link>
          </div>
        )}
      </CardContent>
      {entries && entries.length > limit && (
        <CardFooter className="pt-0">
          <Link href="/journal">
            <Button 
              variant="ghost" 
              className="ml-auto text-sky-500 flex items-center"
            >
              View All Entries
              <MdArrowForward className="ml-1" />
            </Button>
          </Link>
        </CardFooter>
      )}
    </Card>
  );
}
