import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { 
  MdMeditation, 
  MdSpa, 
  MdArrowForward,
  MdLightbulb,
  MdOutlinePsychology,
  MdNaturePeople
} from "react-icons/md";

interface WellnessResourcesProps {
  category?: string;
  limit?: number;
}

export function WellnessResources({ category, limit = 3 }: WellnessResourcesProps) {
  const { data: resources, isLoading } = useQuery({
    queryKey: category 
      ? [`/api/resources/category/${category}`]
      : ['/api/resources'],
  });

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

  const limitedResources = resources?.slice(0, limit);

  if (isLoading) {
    return (
      <Card className="shadow-md border border-gray-100">
        <CardHeader>
          <CardTitle className="text-lg font-medium text-gray-900">Wellness Resources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center mr-3">
                    <Skeleton className="w-4 h-4 rounded-full" />
                  </div>
                  <div className="flex-1">
                    <Skeleton className="h-5 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-md border border-gray-100">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium text-gray-900">Wellness Resources</CardTitle>
        <Link href="/resources">
          <Button variant="ghost" size="sm" className="text-sky-500">
            View all
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {limitedResources && limitedResources.length > 0 ? (
          <div className="space-y-4">
            {limitedResources.map((resource) => (
              <Link key={resource.id} href={`/resources/${resource.id}`}>
                <a className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition duration-300">
                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center mr-3 text-sky-500">
                      {getCategoryIcon(resource.category)}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{resource.title}</h4>
                      <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                        {resource.description}
                      </p>
                      {resource.tags && resource.tags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
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
                </a>
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <p className="text-gray-500">No resources available</p>
          </div>
        )}
        
        {resources && resources.length > limit && (
          <div className="mt-4 text-center">
            <Link href="/resources">
              <Button 
                variant="skyOutline" 
                className="w-full flex items-center justify-center"
              >
                Explore More Resources
                <MdArrowForward className="ml-1" />
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
