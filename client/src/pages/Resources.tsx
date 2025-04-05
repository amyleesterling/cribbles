import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "wouter";
import { MdSearch, MdMeditation, MdSpa, MdLightbulb, MdOutlinePsychology, MdNaturePeople } from "react-icons/md";

export default function Resources() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: resources, isLoading } = useQuery({
    queryKey: ['/api/resources'],
  });

  const filteredResources = resources?.filter(resource => 
    resource.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resource.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (resource.tags && resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  const categories = resources 
    ? [...new Set(resources.map(resource => resource.category))]
    : [];

  const getCategoryIcon = (categoryName: string) => {
    switch (categoryName.toLowerCase()) {
      case 'meditation':
        return <MdMeditation size={20} />;
      case 'mindfulness':
        return <MdSpa size={20} />;
      case 'affirmations':
        return <MdLightbulb size={20} />;
      case 'lifestyle':
        return <MdNaturePeople size={20} />;
      default:
        return <MdOutlinePsychology size={20} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Wellness Resources</h1>
            <p className="mt-1 text-sm text-gray-500">Discover science-backed strategies for your wellbeing</p>
          </div>
          
          <div className="mb-6">
            <div className="relative">
              <MdSearch className="absolute left-3 top-3 text-gray-400" size={20} />
              <Input 
                placeholder="Search resources..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <Tabs defaultValue="all">
            <TabsList className="mb-6">
              <TabsTrigger value="all">All Resources</TabsTrigger>
              {categories.map(category => (
                <TabsTrigger key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </TabsTrigger>
              ))}
            </TabsList>
            
            <TabsContent value="all">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Card key={i} className="animate-pulse">
                      <CardContent className="p-6">
                        <div className="flex items-start">
                          <div className="w-8 h-8 rounded-full bg-gray-200 mr-3"></div>
                          <div className="flex-1">
                            <div className="h-5 bg-gray-200 rounded w-3/4 mb-4"></div>
                            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
                            <div className="flex gap-1">
                              <div className="h-6 bg-gray-200 rounded w-16"></div>
                              <div className="h-6 bg-gray-200 rounded w-16"></div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : filteredResources && filteredResources.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredResources.map((resource) => (
                    <Link key={resource.id} href={`/resources/${resource.id}`}>
                      <a>
                        <Card className="shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-100 h-full">
                          <CardContent className="p-6">
                            <div className="flex items-start">
                              <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center mr-3 text-sky-500">
                                {getCategoryIcon(resource.category)}
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900 mb-2">{resource.title}</h3>
                                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                                  {resource.description}
                                </p>
                                {resource.tags && resource.tags.length > 0 && (
                                  <div className="flex flex-wrap gap-1">
                                    {resource.tags.map((tag, i) => (
                                      <span 
                                        key={i}
                                        className="px-2 py-0.5 text-xs bg-white border border-gray-200 rounded-full text-gray-600"
                                      >
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </a>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">No resources found matching your search</p>
                </div>
              )}
            </TabsContent>
            
            {categories.map(category => (
              <TabsContent key={category} value={category}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredResources
                    ?.filter(resource => resource.category === category)
                    .map((resource) => (
                      <Link key={resource.id} href={`/resources/${resource.id}`}>
                        <a>
                          <Card className="shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-100 h-full">
                            <CardContent className="p-6">
                              <div className="flex items-start">
                                <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center mr-3 text-sky-500">
                                  {getCategoryIcon(resource.category)}
                                </div>
                                <div>
                                  <h3 className="font-semibold text-gray-900 mb-2">{resource.title}</h3>
                                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                                    {resource.description}
                                  </p>
                                  {resource.tags && resource.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1">
                                      {resource.tags.map((tag, i) => (
                                        <span 
                                          key={i}
                                          className="px-2 py-0.5 text-xs bg-white border border-gray-200 rounded-full text-gray-600"
                                        >
                                          {tag}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </a>
                      </Link>
                    ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </main>
    </div>
  );
}
