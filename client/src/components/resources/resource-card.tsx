import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { FileText, Video, Activity } from "lucide-react";

export interface Resource {
  id: number;
  title: string;
  description: string;
  type: "article" | "video" | "exercise";
  category: string;
  imageUrl: string;
  tags: string[];
}

interface ResourceCardProps {
  resource: Resource;
}

export default function ResourceCard({ resource }: ResourceCardProps) {
  const getActionText = (type: Resource["type"]) => {
    switch (type) {
      case "article": return "Read Article";
      case "video": return "Watch Video";
      case "exercise": return "Start Exercise";
    }
  };
  
  const getIcon = (type: Resource["type"]) => {
    switch (type) {
      case "article": return <FileText className="h-4 w-4 mr-1" />;
      case "video": return <Video className="h-4 w-4 mr-1" />;
      case "exercise": return <Activity className="h-4 w-4 mr-1" />;
    }
  };
  
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="rounded-lg overflow-hidden h-full flex flex-col">
        <div 
          className="w-full h-40 bg-center bg-cover" 
          style={{ backgroundImage: `url(${resource.imageUrl})` }}
        />
        <CardContent className="p-4 flex-grow flex flex-col">
          <div className="mb-1 flex items-center">
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-skyBlue/10 text-skyBlue">
              {resource.category}
            </span>
          </div>
          <h3 className="font-display font-semibold mb-1">{resource.title}</h3>
          <p className="text-sm text-gray-600 mb-2 flex-grow">{resource.description}</p>
          
          <div className="mt-2">
            <div className="flex flex-wrap gap-1 mb-3">
              {resource.tags.map(tag => (
                <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                  {tag}
                </span>
              ))}
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full border-skyBlue text-skyBlue hover:bg-skyBlue/10 hover:text-skyBlue"
            >
              {getIcon(resource.type)}
              {getActionText(resource.type)}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
