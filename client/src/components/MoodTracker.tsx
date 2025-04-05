import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { IoMdHappy, IoMdSad } from "react-icons/io";
import { MdSentimentSatisfied, MdArrowForward } from "react-icons/md";
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  Area,
  AreaChart
} from "recharts";

const moodOptions = [
  { value: "Joyful", color: "bg-amber-400", icon: <IoMdHappy size={24} className="text-amber-500" /> },
  { value: "Peaceful", color: "bg-sky-300", icon: <MdSentimentSatisfied size={24} className="text-sky-500" /> },
  { value: "Neutral", color: "bg-gray-300", icon: <MdSentimentSatisfied size={24} className="text-gray-500" /> },
  { value: "Stressed", color: "bg-orange-300", icon: <MdSentimentSatisfied size={24} className="text-orange-500 rotate-180" /> },
  { value: "Overwhelmed", color: "bg-red-300", icon: <IoMdSad size={24} className="text-red-500" /> },
];

interface MoodTrackerProps {
  userId: number;
  compact?: boolean;
}

export function MoodTracker({ userId, compact = false }: MoodTrackerProps) {
  const [selectedMood, setSelectedMood] = useState("");
  const [moodScore, setMoodScore] = useState(5);
  const [notes, setNotes] = useState("");

  const { data: moodEntries, isLoading } = useQuery({
    queryKey: [`/api/users/${userId}/mood-entries`],
  });

  const createMoodEntry = useMutation({
    mutationFn: async () => {
      return await apiRequest('POST', '/api/mood-entries', {
        userId,
        mood: selectedMood,
        score: moodScore,
        notes: notes,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/mood-entries`] });
      setSelectedMood("");
      setMoodScore(5);
      setNotes("");
    },
  });

  const chartData = moodEntries?.slice(0, 7).reverse().map(entry => ({
    date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    score: entry.score,
    mood: entry.mood
  })) || [];

  const handleSubmit = () => {
    if (selectedMood) {
      createMoodEntry.mutate();
    }
  };

  if (compact) {
    return (
      <Card className="shadow-md border border-gray-100">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium text-gray-900">Mood Tracker</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-32 flex items-center justify-center">
              <p className="text-gray-500">Loading mood data...</p>
            </div>
          ) : chartData.length > 0 ? (
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <Area 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#38bdf8" 
                    fillOpacity={1} 
                    fill="url(#colorScore)" 
                  />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 10 }} 
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px' }}
                    formatter={(value, name) => [`${value}`, name === 'score' ? 'Mood Score' : name]}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-32 flex items-center justify-center">
              <p className="text-gray-500">No mood data yet. Start tracking your mood!</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-md border border-gray-100">
      <CardHeader>
        <CardTitle className="text-lg font-medium text-gray-900">How are you feeling today?</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-5 gap-2 mb-6">
          {moodOptions.map((mood) => (
            <button
              key={mood.value}
              className={`p-2 rounded-lg flex flex-col items-center justify-center hover:bg-gray-50 transition-colors ${
                selectedMood === mood.value ? 'ring-2 ring-sky-300 bg-sky-50' : ''
              }`}
              onClick={() => setSelectedMood(mood.value)}
            >
              <div className={`w-8 h-8 rounded-full ${mood.color} mb-1 flex items-center justify-center`}>
                {mood.icon}
              </div>
              <span className="text-xs font-medium">{mood.value}</span>
            </button>
          ))}
        </div>

        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>Low</span>
            <span>Intensity</span>
            <span>High</span>
          </div>
          <Slider
            value={[moodScore]}
            min={1}
            max={10}
            step={1}
            onValueChange={(value) => setMoodScore(value[0])}
            className="my-4"
          />
          <div className="flex justify-center">
            <span className="text-lg font-medium">{moodScore}/10</span>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Add notes (optional)
          </label>
          <Textarea
            placeholder="What's contributing to your mood right now?"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="resize-none"
            rows={3}
          />
        </div>

        <Button 
          onClick={handleSubmit} 
          disabled={!selectedMood || createMoodEntry.isPending}
          className="w-full"
          variant="sky"
        >
          {createMoodEntry.isPending ? "Saving..." : "Track My Mood"}
        </Button>

        {moodEntries && moodEntries.length > 0 && (
          <div className="mt-6">
            <h4 className="font-medium text-gray-900 mb-3">Your Mood History</h4>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    domain={[0, 10]} 
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px' }}
                    formatter={(value, name, props) => {
                      const entry = props.payload;
                      return [`${value}/10 - ${entry.mood}`, 'Mood Score'];
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#38bdf8" 
                    strokeWidth={2}
                    dot={{ r: 4, fill: "#38bdf8" }}
                    activeDot={{ r: 6, fill: "#fbbf24" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </CardContent>
      {!compact && (
        <CardFooter className="pt-0">
          <Button 
            variant="ghost" 
            className="ml-auto text-sky-500"
            asChild
          >
            <a href="/mood-history" className="flex items-center">
              View full history
              <MdArrowForward className="ml-1" />
            </a>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
