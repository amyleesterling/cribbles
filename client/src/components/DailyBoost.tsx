import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MdOutlineLightbulb, MdOutlineInsights } from "react-icons/md";

interface DailyBoostProps {
  userId: number;
}

export function DailyBoost({ userId }: DailyBoostProps) {
  const { data: dailyBoost, isLoading } = useQuery({
    queryKey: [`/api/users/${userId}/daily-boost`],
  });

  if (isLoading) {
    return (
      <Card className="shadow-md border border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 opacity-10 bg-amber-200 rounded-bl-full"></div>
        <CardHeader>
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
              <MdOutlineLightbulb className="text-amber-500" size={24} />
            </div>
            <CardTitle className="ml-4 text-lg font-medium text-gray-900">Your Daily Boost</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mt-2 p-4 bg-sky-50 rounded-lg border border-sky-100">
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-100">
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-5/6" />
          </div>
          <div className="mt-4 flex items-center text-sm text-gray-500">
            <MdOutlineInsights className="text-sky-400 mr-2" />
            <span>Personalized based on your interactions</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-md border border-gray-100 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 opacity-10 bg-amber-200 rounded-bl-full"></div>
      <CardHeader>
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
            <MdOutlineLightbulb className="text-amber-500" size={24} />
          </div>
          <CardTitle className="ml-4 text-lg font-medium text-gray-900">Your Daily Boost</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mt-2 p-4 bg-sky-50 rounded-lg border border-sky-100">
          <p className="text-gray-800 font-medium">
            {dailyBoost?.affirmation || "You are worthy of peace and joy in your life."}
          </p>
        </div>
        <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-100">
          <div className="flex">
            <MdOutlineLightbulb className="text-amber-500 mr-2 flex-shrink-0 mt-1" />
            <p className="text-gray-700">
              {dailyBoost?.tip || "Take a moment to breathe deeply and check in with yourself throughout the day."}
            </p>
          </div>
        </div>
        <div className="mt-4 flex items-center text-sm text-gray-500">
          <MdOutlineInsights className="text-sky-400 mr-2" />
          <span>Personalized based on your interactions</span>
        </div>
      </CardContent>
    </Card>
  );
}
