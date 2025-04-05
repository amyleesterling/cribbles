import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, subDays, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek } from "date-fns";
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  Area,
  AreaChart,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { MoodTracker } from "@/components/MoodTracker";
import { MdCalendarMonth, MdOutlineInsights } from "react-icons/md";

export default function MoodHistory() {
  // In a real application, this would come from authentication
  const userId = 1;
  const [timeRange, setTimeRange] = useState("week");

  const getDateRange = () => {
    const now = new Date();
    switch (timeRange) {
      case "week":
        return {
          startDate: startOfWeek(now),
          endDate: endOfWeek(now)
        };
      case "month":
        return {
          startDate: startOfMonth(now),
          endDate: endOfMonth(now)
        };
      case "3months":
        return {
          startDate: subMonths(now, 3),
          endDate: now
        };
      default:
        return {
          startDate: subDays(now, 7),
          endDate: now
        };
    }
  };

  const { startDate, endDate } = getDateRange();

  const { data: moodEntries, isLoading } = useQuery({
    queryKey: [`/api/users/${userId}/mood-entries/range`, { 
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    }],
  });

  const chartData = moodEntries?.map(entry => ({
    date: format(new Date(entry.date), 'MMM dd'),
    score: entry.score,
    mood: entry.mood
  })) || [];

  const moodCounts = moodEntries?.reduce((acc, entry) => {
    acc[entry.mood] = (acc[entry.mood] || 0) + 1;
    return acc;
  }, {}) || {};

  const pieData = Object.keys(moodCounts).map(mood => ({
    name: mood,
    value: moodCounts[mood]
  }));

  const MOOD_COLORS = {
    'Joyful': '#fbbf24',
    'Peaceful': '#38bdf8',
    'Neutral': '#9ca3af',
    'Stressed': '#fb923c',
    'Overwhelmed': '#f87171',
    'Inspired': '#a78bfa',
    'Focused': '#60a5fa'
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Mood Tracking</h1>
              <p className="mt-1 text-sm text-gray-500">Track and analyze your emotional wellbeing over time</p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-2">
              <MdCalendarMonth className="text-gray-400" />
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select time range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="3months">Last 3 Months</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="md:col-span-2">
              <Card className="shadow-md border border-gray-100">
                <CardHeader>
                  <CardTitle>Mood Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="h-64 flex items-center justify-center">
                      <p className="text-gray-500">Loading mood data...</p>
                    </div>
                  ) : chartData.length > 0 ? (
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                          <defs>
                            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.8} />
                              <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.1} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis 
                            dataKey="date" 
                            tick={{ fontSize: 12 }}
                          />
                          <YAxis 
                            domain={[0, 10]} 
                            tick={{ fontSize: 12 }}
                            tickFormatter={(value) => `${value}`}
                          />
                          <Tooltip 
                            contentStyle={{ borderRadius: '8px' }}
                            formatter={(value, name, props) => {
                              const entry = props.payload;
                              return [`${value}/10 - ${entry.mood}`, 'Mood Score'];
                            }}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="score" 
                            stroke="#38bdf8" 
                            fillOpacity={1}
                            fill="url(#colorScore)" 
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="h-64 flex items-center justify-center">
                      <p className="text-gray-500">No mood data for this time period</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card className="shadow-md border border-gray-100">
                <CardHeader>
                  <CardTitle>Mood Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="h-64 flex items-center justify-center">
                      <p className="text-gray-500">Loading mood data...</p>
                    </div>
                  ) : pieData.length > 0 ? (
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={MOOD_COLORS[entry.name] || `#${Math.floor(Math.random()*16777215).toString(16)}`} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => [`${value} entries`, 'Count']} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="h-64 flex items-center justify-center">
                      <p className="text-gray-500">No mood data for this time period</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Insights Card */}
          <Card className="shadow-md border border-gray-100 mb-8">
            <CardHeader className="flex flex-row items-center">
              <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center mr-3 text-sky-500">
                <MdOutlineInsights size={20} />
              </div>
              <CardTitle>Mood Insights</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p className="text-gray-500">Analyzing your mood patterns...</p>
              ) : chartData.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 bg-sky-50 rounded-lg border border-sky-100">
                    <h3 className="font-medium text-gray-900 mb-2">Average Mood</h3>
                    <p className="text-3xl font-bold text-sky-500">
                      {(chartData.reduce((sum, entry) => sum + entry.score, 0) / chartData.length).toFixed(1)}
                      <span className="text-sm font-normal text-gray-500 ml-1">/10</span>
                    </p>
                    <p className="mt-2 text-sm text-gray-600">Your average mood score for this period</p>
                  </div>
                  
                  <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
                    <h3 className="font-medium text-gray-900 mb-2">Most Common Mood</h3>
                    <p className="text-xl font-bold text-amber-500">
                      {Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0][0]}
                    </p>
                    <p className="mt-2 text-sm text-gray-600">Your predominant emotional state</p>
                  </div>
                  
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                    <h3 className="font-medium text-gray-900 mb-2">Mood Stability</h3>
                    <p className="text-xl font-bold text-purple-500">
                      {(() => {
                        const scores = chartData.map(entry => entry.score);
                        const variance = scores.reduce((sum, score) => sum + Math.pow(score - scores.reduce((a, b) => a + b, 0) / scores.length, 2), 0) / scores.length;
                        const stability = 10 - Math.min(Math.sqrt(variance) * 2, 10);
                        return `${stability.toFixed(1)}/10`;
                      })()}
                    </p>
                    <p className="mt-2 text-sm text-gray-600">How consistent your mood has been</p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">Track your mood to see insights</p>
              )}
            </CardContent>
          </Card>
          
          {/* Track New Mood */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <MoodTracker userId={userId} />
            
            <Card className="shadow-md border border-gray-100">
              <CardHeader>
                <CardTitle>Recent Entries</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="p-4 bg-gray-50 rounded-lg animate-pulse">
                        <div className="flex justify-between items-start">
                          <div className="h-5 bg-gray-200 rounded w-1/3 mb-2"></div>
                          <div className="h-4 bg-gray-200 rounded w-16"></div>
                        </div>
                        <div className="h-4 bg-gray-200 rounded w-5/6 mb-2"></div>
                      </div>
                    ))}
                  </div>
                ) : moodEntries && moodEntries.length > 0 ? (
                  <div className="space-y-4 max-h-[400px] overflow-y-auto">
                    {moodEntries.slice(0, 5).map((entry) => (
                      <div key={entry.id} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center">
                            <div className={`w-3 h-3 rounded-full ${MOOD_COLORS[entry.mood] ? `bg-[${MOOD_COLORS[entry.mood]}]` : 'bg-gray-400'} mr-2`}></div>
                            <span className="font-medium">{entry.mood} ({entry.score}/10)</span>
                          </div>
                          <span className="text-xs text-gray-400">
                            {format(new Date(entry.date), 'MMM dd, h:mm a')}
                          </span>
                        </div>
                        {entry.notes && (
                          <p className="mt-2 text-sm text-gray-600">{entry.notes}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No mood entries found</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
