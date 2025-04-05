import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { InspirationGenerator } from "@/components/InspirationGenerator";
import { MdPerson, MdSettings, MdNotifications, MdPrivacyTip, MdOutlineAutoAwesome } from "react-icons/md";

export default function Profile() {
  // In a real app, this would come from authentication
  const userId = 1;
  const { toast } = useToast();
  
  const [formValues, setFormValues] = useState({
    displayName: "",
    email: "",
    bio: ""
  });
  
  const [preferences, setPreferences] = useState({
    dailyBoostTime: "08:00",
    receiveNotifications: true,
    moodReminders: true,
    journalReminders: false,
    theme: "light",
    privacyModeEnabled: false
  });
  
  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: [`/api/users/${userId}`],
    onSuccess: (data) => {
      if (data) {
        setFormValues({
          displayName: data.displayName || "",
          email: data.email || "",
          bio: ""
        });
      }
    }
  });
  
  const { data: userPrefs, isLoading: isLoadingPrefs } = useQuery({
    queryKey: [`/api/users/${userId}/preferences`],
    onSuccess: (data) => {
      if (data?.preferences) {
        setPreferences({
          ...preferences,
          ...data.preferences
        });
      }
    }
  });
  
  const updatePreferences = useMutation({
    mutationFn: async () => {
      return await apiRequest('PUT', `/api/users/${userId}/preferences`, {
        preferences: preferences
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/preferences`] });
      toast({
        title: "Preferences updated",
        description: "Your wellness settings have been saved.",
        variant: "default"
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Could not update preferences. Please try again.",
        variant: "destructive"
      });
    }
  });
  
  const handlePreferenceChange = (key: string, value: any) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const savePreferences = () => {
    updatePreferences.mutate();
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-8">
            <div className="flex items-end">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-sky-100 border-2 border-sky-200 flex items-center justify-center text-sky-500 mr-4 overflow-hidden">
                <MdPerson size={40} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {isLoadingUser ? <Skeleton className="h-8 w-32" /> : user?.displayName || "Your Profile"}
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  Manage your wellness journey settings
                </p>
              </div>
            </div>
          </div>
          
          <Tabs defaultValue="profile">
            <TabsList className="mb-8">
              <TabsTrigger value="profile" className="flex items-center">
                <MdPerson className="mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="preferences" className="flex items-center">
                <MdSettings className="mr-2" />
                Preferences
              </TabsTrigger>
              <TabsTrigger value="inspiration" className="flex items-center">
                <MdOutlineAutoAwesome className="mr-2" />
                Inspiration
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              <Card className="mb-8 shadow-md border border-gray-100">
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Update your profile information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isLoadingUser ? (
                    <>
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-24 w-full" />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="displayName">Display Name</Label>
                        <Input 
                          id="displayName" 
                          value={formValues.displayName}
                          onChange={(e) => setFormValues({...formValues, displayName: e.target.value})}
                          placeholder="Your display name"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          type="email"
                          value={formValues.email}
                          onChange={(e) => setFormValues({...formValues, email: e.target.value})}
                          placeholder="Your email address"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="bio">About Me</Label>
                        <Textarea 
                          id="bio" 
                          value={formValues.bio}
                          onChange={(e) => setFormValues({...formValues, bio: e.target.value})}
                          placeholder="Share a bit about yourself and your wellness goals"
                          rows={4}
                        />
                      </div>
                    </>
                  )}
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button variant="sky">Save Profile</Button>
                </CardFooter>
              </Card>
              
              <Card className="shadow-md border border-gray-100">
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>
                    Manage your account preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input 
                      id="currentPassword" 
                      type="password"
                      placeholder="Enter your current password"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input 
                      id="newPassword" 
                      type="password"
                      placeholder="Enter a new password"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input 
                      id="confirmPassword" 
                      type="password"
                      placeholder="Confirm your new password"
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button variant="sky">Update Password</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="preferences">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="shadow-md border border-gray-100">
                  <CardHeader className="flex flex-row items-center">
                    <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center mr-3 text-sky-500">
                      <MdNotifications size={20} />
                    </div>
                    <div>
                      <CardTitle>Notification Settings</CardTitle>
                      <CardDescription>
                        Customize how and when you receive notifications
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {isLoadingPrefs ? (
                      <>
                        <div className="flex justify-between items-center">
                          <Skeleton className="h-4 w-40" />
                          <Skeleton className="h-5 w-10" />
                        </div>
                        <div className="flex justify-between items-center">
                          <Skeleton className="h-4 w-40" />
                          <Skeleton className="h-5 w-10" />
                        </div>
                        <div className="flex justify-between items-center">
                          <Skeleton className="h-4 w-40" />
                          <Skeleton className="h-5 w-10" />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="dailyBoostTime">Daily Boost Time</Label>
                          <Input 
                            id="dailyBoostTime" 
                            type="time"
                            value={preferences.dailyBoostTime}
                            onChange={(e) => handlePreferenceChange('dailyBoostTime', e.target.value)}
                          />
                          <p className="text-xs text-gray-500">Set the time to receive your daily wellness boost</p>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Receive Notifications</Label>
                            <p className="text-xs text-gray-500">Enable push notifications for important updates</p>
                          </div>
                          <Switch 
                            checked={preferences.receiveNotifications}
                            onCheckedChange={(checked) => handlePreferenceChange('receiveNotifications', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Mood Tracking Reminders</Label>
                            <p className="text-xs text-gray-500">Get gentle reminders to track your mood</p>
                          </div>
                          <Switch 
                            checked={preferences.moodReminders}
                            onCheckedChange={(checked) => handlePreferenceChange('moodReminders', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Journal Reminders</Label>
                            <p className="text-xs text-gray-500">Receive reminders to journal regularly</p>
                          </div>
                          <Switch 
                            checked={preferences.journalReminders}
                            onCheckedChange={(checked) => handlePreferenceChange('journalReminders', checked)}
                          />
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
                
                <Card className="shadow-md border border-gray-100">
                  <CardHeader className="flex flex-row items-center">
                    <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center mr-3 text-sky-500">
                      <MdPrivacyTip size={20} />
                    </div>
                    <div>
                      <CardTitle>Privacy & Appearance</CardTitle>
                      <CardDescription>
                        Control your data and customize your experience
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {isLoadingPrefs ? (
                      <>
                        <div className="flex justify-between items-center">
                          <Skeleton className="h-4 w-40" />
                          <Skeleton className="h-5 w-10" />
                        </div>
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-10 w-full" />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Privacy Mode</Label>
                            <p className="text-xs text-gray-500">Hide sensitive information when not actively using the app</p>
                          </div>
                          <Switch 
                            checked={preferences.privacyModeEnabled}
                            onCheckedChange={(checked) => handlePreferenceChange('privacyModeEnabled', checked)}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Theme</Label>
                          <div className="grid grid-cols-3 gap-2">
                            <Button
                              type="button"
                              variant={preferences.theme === "light" ? "sky" : "outline"}
                              className="h-auto py-6 flex flex-col gap-2"
                              onClick={() => handlePreferenceChange('theme', 'light')}
                            >
                              <div className="w-8 h-8 rounded-full bg-white border border-gray-200"></div>
                              <span className="text-xs">Light</span>
                            </Button>
                            
                            <Button
                              type="button"
                              variant={preferences.theme === "dark" ? "sky" : "outline"}
                              className="h-auto py-6 flex flex-col gap-2"
                              onClick={() => handlePreferenceChange('theme', 'dark')}
                            >
                              <div className="w-8 h-8 rounded-full bg-gray-900 border border-gray-200"></div>
                              <span className="text-xs">Dark</span>
                            </Button>
                            
                            <Button
                              type="button"
                              variant={preferences.theme === "system" ? "sky" : "outline"}
                              className="h-auto py-6 flex flex-col gap-2"
                              onClick={() => handlePreferenceChange('theme', 'system')}
                            >
                              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-gray-900 to-white border border-gray-200"></div>
                              <span className="text-xs">System</span>
                            </Button>
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              <div className="mt-6 flex justify-end">
                <Button 
                  variant="sky" 
                  onClick={savePreferences} 
                  disabled={updatePreferences.isPending}
                  className="flex items-center"
                >
                  {updatePreferences.isPending ? "Saving..." : "Save All Preferences"}
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="inspiration">
              <Card className="shadow-md border border-gray-100">
                <CardHeader>
                  <CardTitle>Visual Inspiration</CardTitle>
                  <CardDescription>
                    Generate calming, inspirational images to boost your wellness journey
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <InspirationGenerator userId={userId} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
