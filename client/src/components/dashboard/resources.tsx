import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import MotionDot from "../ui/motion-dot";
import { motion } from "framer-motion";

type Resource = {
  id: number;
  title: string;
  description: string;
  type: "article" | "video" | "exercise";
  imageUrl: string;
};

const resources: Resource[] = [
  {
    id: 1,
    title: "Deep Work for Creatives",
    description: "Based on your focus pattern data",
    type: "article",
    imageUrl: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200&q=80"
  },
  {
    id: 2,
    title: "Advanced Color Theory",
    description: "Recommended for your current projects",
    type: "video",
    imageUrl: "https://images.unsplash.com/photo-1492551557933-34265f7af79e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200&q=80"
  },
  {
    id: 3,
    title: "Creative Collaboration",
    description: "Matches your team workflow data",
    type: "article",
    imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200&q=80"
  }
];

export default function ResourcesWidget() {
  return (
    <Card className="bg-white rounded-2xl shadow-sm border-gray-200/30">
      <CardHeader className="flex flex-row items-center pb-2 pt-6 px-6">
        <MotionDot />
        <CardTitle className="font-display font-semibold text-xl ml-2">Recommended Resources</CardTitle>
      </CardHeader>
      
      <CardContent className="p-6 pt-2">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {resources.map(resource => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

interface ResourceCardProps {
  resource: Resource;
}

function ResourceCard({ resource }: ResourceCardProps) {
  const getActionText = (type: Resource["type"]) => {
    switch (type) {
      case "article": return "Read Article";
      case "video": return "Watch Video";
      case "exercise": return "Start Exercise";
    }
  };
  
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="border border-gray-200/50 rounded-lg overflow-hidden"
    >
      <div 
        className="w-full h-32 bg-center bg-cover" 
        style={{ backgroundImage: `url(${resource.imageUrl})` }}
      />
      <div className="p-3">
        <div className="text-sm font-medium mb-1">{resource.title}</div>
        <p className="text-xs text-gray-500 mb-2">{resource.description}</p>
        <Button variant="link" size="sm" className="text-xs text-skyBlue p-0">
          {getActionText(resource.type)}
        </Button>
      </div>
    </motion.div>
  );
}
