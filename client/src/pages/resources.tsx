import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import MotionDot from "@/components/ui/motion-dot";
import ResourceList from "@/components/resources/resource-list";

// Resource categories
const categories = [
  "All Resources",
  "Mindfulness",
  "Sleep",
  "Stress Management",
  "Motivation",
  "Creative Flow"
];

// Resources data
const resourcesData = [
  {
    id: 1,
    title: "Deep Work for Creatives",
    description: "Learn how to achieve focused work sessions to boost your creative output.",
    type: "article",
    category: "Creative Flow",
    imageUrl: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200&q=80",
    tags: ["focus", "productivity", "creativity"]
  },
  {
    id: 2,
    title: "The Science of Better Sleep",
    description: "Discover research-backed techniques to improve your sleep quality and duration.",
    type: "video",
    category: "Sleep",
    imageUrl: "https://images.unsplash.com/photo-1455642305367-68834a9d4386?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200&q=80",
    tags: ["sleep", "health", "recovery"]
  },
  {
    id: 3,
    title: "5-Minute Mindfulness Exercises",
    description: "Quick mindfulness practices you can integrate into your daily routine.",
    type: "exercise",
    category: "Mindfulness",
    imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200&q=80",
    tags: ["mindfulness", "meditation", "quick-practice"]
  },
  {
    id: 4,
    title: "Managing Creative Burnout",
    description: "Strategies to recognize and recover from creative exhaustion.",
    type: "article",
    category: "Stress Management",
    imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200&q=80",
    tags: ["burnout", "recovery", "self-care"]
  },
  {
    id: 5,
    title: "Finding Your Flow State",
    description: "The psychology behind achieving flow and how to enter this optimal state more often.",
    type: "video",
    category: "Creative Flow",
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200&q=80",
    tags: ["flow", "psychology", "creativity"]
  },
  {
    id: 6,
    title: "Breathing Techniques for Calm",
    description: "Simple breathing exercises to reduce anxiety and restore balance.",
    type: "exercise",
    category: "Stress Management",
    imageUrl: "https://images.unsplash.com/photo-1516900448138-f5804a0dc8a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200&q=80",
    tags: ["breathing", "anxiety", "relaxation"]
  },
  {
    id: 7,
    title: "The Neuroscience of Happiness",
    description: "Understanding what happens in your brain when you experience joy.",
    type: "article",
    category: "Motivation",
    imageUrl: "https://images.unsplash.com/photo-1454486837617-ce8e1ba5ebfe?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200&q=80",
    tags: ["neuroscience", "happiness", "wellbeing"]
  },
  {
    id: 8,
    title: "Setting Meaningful Goals",
    description: "How to create goals that align with your values and drive lasting motivation.",
    type: "video",
    category: "Motivation",
    imageUrl: "https://images.unsplash.com/photo-1453738773917-9c3eff1db985?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200&q=80",
    tags: ["goals", "motivation", "planning"]
  }
];

export default function ResourcesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Resources");
  
  const filteredResources = resourcesData.filter(resource => {
    const matchesSearch = 
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = 
      activeCategory === "All Resources" || 
      resource.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="font-display font-bold text-2xl md:text-3xl mb-1">Wellness Resources</h1>
        <p className="text-gray-500">Discover science-backed content to support your wellbeing journey</p>
      </div>
      
      <Card className="bg-white rounded-2xl shadow-sm border-gray-200/30 mb-6">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              className="pl-9 bg-gray-50 border-none"
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="all" className="mb-6">
        <TabsList className="bg-gray-100 mb-4 flex flex-wrap">
          {categories.map(category => (
            <TabsTrigger 
              key={category} 
              value={category.toLowerCase().replace(/\s+/g, '-')}
              onClick={() => setActiveCategory(category)}
              className="whitespace-nowrap"
            >
              {category}
            </TabsTrigger>
          ))}
        </TabsList>
        
        <TabsContent value="all" className="mt-2">
          <Card className="bg-white rounded-2xl shadow-sm border-gray-200/30">
            <CardHeader className="flex flex-row items-center pb-2 pt-6 px-6">
              <MotionDot />
              <CardTitle className="font-display font-semibold text-xl ml-2">
                {activeCategory === "All Resources" 
                  ? "All Resources" 
                  : `${activeCategory} Resources`}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ResourceList resources={filteredResources} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
