import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import JournalEntry from "@/components/journal/journal-entry";
import JournalForm from "@/components/journal/journal-form";
import MotionDot from "@/components/ui/motion-dot";
import { type Journal } from "@shared/schema";

export default function JournalPage() {
  const [location, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [showNewForm, setShowNewForm] = useState(false);
  
  const { data: journals, isLoading } = useQuery<Journal[]>({
    queryKey: ["/api/journals"],
  });
  
  const filteredJournals = journals?.filter(journal => 
    journal.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    journal.content.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];
  
  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl md:text-3xl mb-1">Creative Journal</h1>
          <p className="text-gray-500">Document your thoughts, reflections, and creative insights</p>
        </div>
        <Button 
          className="mt-4 sm:mt-0 bg-skyBlue hover:bg-skyBlue/90 text-white"
          onClick={() => setShowNewForm(true)}
        >
          <Plus className="mr-2 h-4 w-4" /> New Journal Entry
        </Button>
      </div>

      {showNewForm ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-white rounded-2xl shadow-sm border-gray-200/30 mb-6">
            <CardHeader className="flex flex-row items-center pb-2 pt-6 px-6">
              <MotionDot />
              <CardTitle className="font-display font-semibold text-xl ml-2">New Journal Entry</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <JournalForm 
                onCancel={() => setShowNewForm(false)} 
                onSuccess={() => {
                  setShowNewForm(false);
                }}
              />
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <>
          <Card className="bg-white rounded-2xl shadow-sm border-gray-200/30 mb-6">
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  className="pl-9 bg-gray-50 border-none"
                  placeholder="Search journal entries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="all" className="mb-6">
            <TabsList className="bg-gray-100">
              <TabsTrigger value="all">All Entries</TabsTrigger>
              <TabsTrigger value="recent">Recent</TabsTrigger>
              <TabsTrigger value="favorites">Favorites</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-6">
              {isLoading ? (
                <div className="grid grid-cols-1 gap-4">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="bg-white rounded-2xl shadow-sm border-gray-200/30">
                      <CardContent className="p-6">
                        <div className="animate-pulse">
                          <div className="h-5 bg-gray-200 rounded w-1/3 mb-2"></div>
                          <div className="h-4 bg-gray-100 rounded w-1/4 mb-4"></div>
                          <div className="h-4 bg-gray-100 rounded w-full mb-2"></div>
                          <div className="h-4 bg-gray-100 rounded w-11/12 mb-2"></div>
                          <div className="h-4 bg-gray-100 rounded w-4/5"></div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : filteredJournals.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {filteredJournals.map((journal) => (
                    <JournalEntry key={journal.id} journal={journal} />
                  ))}
                </div>
              ) : (
                <Card className="bg-white rounded-2xl shadow-sm border-gray-200/30">
                  <CardContent className="p-8 text-center">
                    <div className="mx-auto w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                      <MotionDot className="scale-150" />
                    </div>
                    <h3 className="font-display font-semibold text-xl mb-2">No journal entries yet</h3>
                    <p className="text-gray-500 mb-4">
                      Record your thoughts, creative ideas, and reflections to see them here.
                    </p>
                    <Button 
                      className="bg-skyBlue hover:bg-skyBlue/90 text-white"
                      onClick={() => setShowNewForm(true)}
                    >
                      Create Your First Entry
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="recent" className="mt-6">
              {isLoading ? (
                <div className="animate-pulse">Loading recent entries...</div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {filteredJournals
                    .slice(0, 5)
                    .map((journal) => (
                      <JournalEntry key={journal.id} journal={journal} />
                    ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="favorites" className="mt-6">
              <Card className="bg-white rounded-2xl shadow-sm border-gray-200/30">
                <CardContent className="p-8 text-center">
                  <h3 className="font-display font-semibold text-xl mb-2">Coming Soon</h3>
                  <p className="text-gray-500">
                    You'll soon be able to mark entries as favorites for easier access.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}
