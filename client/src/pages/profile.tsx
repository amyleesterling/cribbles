import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import MotionDot from "@/components/ui/motion-dot";
import { type User, type UserPreferences } from "@shared/schema";

// Sample wellnessGoals
const wellnessGoals = [
  { id: "stress-reduction", label: "Stress Reduction" },
  { id: "better-sleep", label: "Better Sleep" },
  { id: "creative-flow", label: "Improve Creative Flow" },
  { id: "mindfulness", label: "Mindfulness Practice" },
  { id: "work-life-balance", label: "Work-Life Balance" },
  { id: "positive-thinking", label: "Positive Thinking" },
  { id: "gratitude", label: "Gratitude Development" },
  { id: "social-connection", label: "Social Connection" }
];

// Sample topics
const topics = [
  { id: "meditation", label: "Meditation" },
  { id: "breathing", label: "Breathing Exercises" },
  { id: "psychology", label: "Positive Psychology" },
  { id: "neuroscience", label: "Neuroscience of Wellbeing" },
  { id: "creativity", label: "Creative Practices" },
  { id: "productivity", label: "Productivity Tips" },
  { id: "nature", label: "Nature Connection" },
  { id: "journaling", label: "Journaling Practices" }
];

export default function Profile() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [isEditing, setIsEditing] = useState(false);
  
  const { data: user, isLoading: isUserLoading } = useQuery<Omit<User, "password">>({ 
    queryKey: ["/api/users/me"] 
  });
  
  const { data: preferences, isLoading: isPreferencesLoading } = useQuery<UserPreferences>({
    queryKey: ["/api/preferences"]
  });
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    bio: "",
    notificationTime: "08:00",
    wellnessGoals: [] as string[],
    topicPreferences: [] as string[]
  });
  
  // Initialize form data when user and preferences load
  useState(() => {
    if (user && preferences) {
      setFormData({
        name: user.name,
        role: user.role || "",
        bio: "",
        notificationTime: preferences.preferences.notificationTime || "08:00",
        wellnessGoals: preferences.preferences.wellnessGoals || [],
        topicPreferences: preferences.preferences.topicPreferences || []
      });
    }
  });
  
  const updatePreferences = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("PATCH", "/api/preferences", {
        preferences: {
          notificationTime: data.notificationTime,
          wellnessGoals: data.wellnessGoals,
          topicPreferences: data.topicPreferences
        }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/preferences"] });
      toast({
        title: "Preferences updated",
        description: "Your profile and preferences have been updated successfully."
      });
      setIsEditing(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update preferences. Please try again.",
        variant: "destructive"
      });
    }
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updatePreferences.mutate(formData);
  };
  
  const handleCheckboxChange = (id: string, category: 'wellnessGoals' | 'topicPreferences') => {
    setFormData(prev => {
      if (prev[category].includes(id)) {
        return {
          ...prev,
          [category]: prev[category].filter(item => item !== id)
        };
      } else {
        return {
          ...prev,
          [category]: [...prev[category], id]
        };
      }
    });
  };
  
  const isLoading = isUserLoading || isPreferencesLoading;
  
  if (isLoading) {
    return (
      <div className="p-4 md:p-6 lg:p-8">
        <div className="mb-6">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-100 rounded w-1/3"></div>
        </div>
        <div className="grid gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-40 bg-white rounded-2xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="font-display font-bold text-2xl md:text-3xl mb-1">Your Profile</h1>
        <p className="text-gray-500">Manage your personal information and preferences</p>
      </div>
      
      <div className="grid gap-6">
        {/* User Profile Card */}
        <Card className="bg-white rounded-2xl shadow-sm border-gray-200/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2 pt-6 px-6">
            <div className="flex items-center">
              <MotionDot />
              <CardTitle className="font-display font-semibold text-xl ml-2">Profile Information</CardTitle>
            </div>
            <Button 
              variant={isEditing ? "outline" : "default"}
              className={isEditing ? "border-skyBlue text-skyBlue" : "bg-skyBlue hover:bg-skyBlue/90 text-white"}
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? "Cancel" : "Edit Profile"}
            </Button>
          </CardHeader>
          
          <CardContent className="p-6">
            {isEditing ? (
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">First Name</Label>
                    <Input 
                      id="name" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="bio">Short Bio</Label>
                    <Textarea 
                      id="bio" 
                      value={formData.bio}
                      onChange={(e) => setFormData({...formData, bio: e.target.value})}
                      placeholder="Tell us a bit about yourself..."
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="notificationTime">Daily Boost Notification Time</Label>
                    <Input 
                      id="notificationTime" 
                      type="time"
                      value={formData.notificationTime}
                      onChange={(e) => setFormData({...formData, notificationTime: e.target.value})}
                    />
                    <p className="text-xs text-gray-500">Choose when you'd like to receive your daily boost</p>
                  </div>
                  
                  <div className="flex justify-end gap-2 mt-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      className="bg-skyBlue hover:bg-skyBlue/90 text-white"
                      disabled={updatePreferences.isPending}
                    >
                      {updatePreferences.isPending ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
                  <div className="w-20 h-20 rounded-full bg-skyBlue/20 flex items-center justify-center text-2xl font-medium text-skyBlue">
                    {user?.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-xl font-medium">{user?.name}</h2>
                    <p className="text-gray-500">Wellness Explorer</p>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Username</h3>
                    <p>{user?.username}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Member Since</h3>
                    <p>{new Date(user?.createdAt || "").toLocaleDateString()}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Daily Boost Time</h3>
                    <p>{preferences?.preferences.notificationTime || "08:00 AM"}</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Wellness Goals Card */}
        <Card className="bg-white rounded-2xl shadow-sm border-gray-200/30">
          <CardHeader className="flex flex-row items-center pb-2 pt-6 px-6">
            <MotionDot />
            <CardTitle className="font-display font-semibold text-xl ml-2">Wellness Goals</CardTitle>
          </CardHeader>
          
          <CardContent className="p-6">
            {isEditing ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {wellnessGoals.map((goal) => (
                  <div key={goal.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`goal-${goal.id}`} 
                      checked={formData.wellnessGoals.includes(goal.id)}
                      onCheckedChange={() => handleCheckboxChange(goal.id, 'wellnessGoals')}
                    />
                    <label 
                      htmlFor={`goal-${goal.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {goal.label}
                    </label>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {preferences?.preferences.wellnessGoals && preferences.preferences.wellnessGoals.length > 0 ? (
                  preferences.preferences.wellnessGoals.map(goalId => {
                    const goal = wellnessGoals.find(g => g.id === goalId);
                    return goal ? (
                      <span key={goalId} className="inline-block py-1 px-3 rounded-full bg-skyBlue/10 text-skyBlue text-sm">
                        {goal.label}
                      </span>
                    ) : null;
                  })
                ) : (
                  <p className="text-gray-500">No wellness goals selected yet. Edit your profile to add some!</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Topic Preferences Card */}
        <Card className="bg-white rounded-2xl shadow-sm border-gray-200/30">
          <CardHeader className="flex flex-row items-center pb-2 pt-6 px-6">
            <MotionDot />
            <CardTitle className="font-display font-semibold text-xl ml-2">Topic Preferences</CardTitle>
          </CardHeader>
          
          <CardContent className="p-6">
            {isEditing ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {topics.map((topic) => (
                  <div key={topic.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`topic-${topic.id}`} 
                      checked={formData.topicPreferences.includes(topic.id)}
                      onCheckedChange={() => handleCheckboxChange(topic.id, 'topicPreferences')}
                    />
                    <label 
                      htmlFor={`topic-${topic.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {topic.label}
                    </label>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {preferences?.preferences.topicPreferences && preferences.preferences.topicPreferences.length > 0 ? (
                  preferences.preferences.topicPreferences.map(topicId => {
                    const topic = topics.find(t => t.id === topicId);
                    return topic ? (
                      <span key={topicId} className="inline-block py-1 px-3 rounded-full bg-sunshineYellow/10 text-gray-700 text-sm">
                        {topic.label}
                      </span>
                    ) : null;
                  })
                ) : (
                  <p className="text-gray-500">No topic preferences selected yet. Edit your profile to add some!</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
