import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "wouter";
import { formatDistanceToNow } from "date-fns";
import { MdAdd, MdSearch, MdOutlineFilterList } from "react-icons/md";

export default function Journal() {
  // In a real application, this would come from authentication
  const userId = 1;
  const [searchTerm, setSearchTerm] = useState("");

  const { data: journalEntries, isLoading } = useQuery({
    queryKey: [`/api/users/${userId}/journal-entries`],
  });

  const { data: reflections, isLoading: isLoadingReflections } = useQuery({
    queryKey: [`/api/users/${userId}/reflections`],
  });

  const filteredJournalEntries = journalEntries?.filter(entry => 
    entry.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    entry.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredReflections = reflections?.filter(reflection => 
    reflection.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Journal & Reflections</h1>
              <p className="mt-1 text-sm text-gray-500">Capture your thoughts and track your wellness journey</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Link href="/journal/new">
                <Button variant="sky" className="flex items-center">
                  <MdAdd className="mr-1" />
                  New Journal Entry
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-grow">
                <MdSearch className="absolute left-3 top-3 text-gray-400" size={20} />
                <Input 
                  placeholder="Search your entries..." 
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" className="flex items-center">
                <MdOutlineFilterList className="mr-2" />
                Filter
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="journal">
            <TabsList className="mb-6">
              <TabsTrigger value="journal">Journal Entries</TabsTrigger>
              <TabsTrigger value="reflections">Reflections</TabsTrigger>
            </TabsList>
            
            <TabsContent value="journal">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Card key={i} className="animate-pulse">
                      <CardContent className="p-6">
                        <div className="h-5 bg-gray-200 rounded w-3/4 mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
                        <div className="flex items-center">
                          <div className="h-3 w-3 bg-gray-200 rounded-full mr-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-16"></div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : filteredJournalEntries && filteredJournalEntries.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredJournalEntries.map((entry) => (
                    <Link key={entry.id} href={`/journal/${entry.id}`}>
                      <a>
                        <Card className="shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-100">
                          <CardContent className="p-6">
                            <h3 className="font-semibold text-gray-900 mb-2">{entry.title}</h3>
                            <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                              {entry.content}
                            </p>
                            <div className="flex justify-between items-center">
                              <div className="flex items-center">
                                {entry.mood && (
                                  <>
                                    <div className={`w-2 h-2 rounded-full ${getMoodColor(entry.mood)} mr-2`}></div>
                                    <span className="text-xs text-gray-500">{entry.mood}</span>
                                  </>
                                )}
                              </div>
                              <span className="text-xs text-gray-400">
                                {formatDistanceToNow(new Date(entry.date), { addSuffix: true })}
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      </a>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">No journal entries found</p>
                  <Link href="/journal/new">
                    <Button variant="skyOutline">Create Your First Entry</Button>
                  </Link>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="reflections">
              {isLoadingReflections ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2, 3, 4].map((i) => (
                    <Card key={i} className="animate-pulse">
                      <CardContent className="p-6">
                        <div className="h-5 bg-gray-200 rounded w-2/3 mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-4/6 mb-4"></div>
                        <div className="h-3 bg-gray-200 rounded w-24"></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : filteredReflections && filteredReflections.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredReflections.map((reflection) => (
                    <Card key={reflection.id} className="shadow-sm border border-gray-100">
                      <CardContent className="p-6">
                        <p className="text-sm text-gray-600 mb-4">
                          {reflection.content}
                        </p>
                        <span className="text-xs text-gray-400">
                          {formatDistanceToNow(new Date(reflection.date), { addSuffix: true })}
                        </span>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">No reflections found</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
