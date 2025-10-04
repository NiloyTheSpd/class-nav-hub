import { PageContainer } from "@/components/PageContainer";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { User, Moon, Sun, Globe, Accessibility, Bell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@clerk/clerk-react";

const Settings = () => {
  const { user } = useUser();
  const [settings, setSettings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSettings = async () => {
      if (!user) return;
      try {
        const response = await fetch(`/api/settings?userId=${user.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch settings");
        }
        const data = await response.json();
        setSettings(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, [user]);

  const handleSaveSettings = async () => {
    if (!user) return;
    try {
      const response = await fetch(`/api/settings?userId=${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      });
      if (!response.ok) {
        throw new Error("Failed to save settings");
      }
      toast({
        title: "Settings Saved",
        description: "Your preferences have been updated successfully.",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const handleResetSettings = () => {
    // This should ideally reset to default settings from the backend
    // For now, we'll just reset the local state
    setSettings({
      darkMode: false,
      language: "english",
      highContrast: false,
      largerText: false,
      screenReader: false,
      emailNotifications: true,
      sessionReminders: true,
    });
    toast({
      title: "Settings Reset",
      description: "All settings have been reset to default values.",
    });
  };

  if (isLoading) {
    return <PageContainer title="Settings">Loading...</PageContainer>;
  }

  if (error) {
    return <PageContainer title="Settings">{error}</PageContainer>;
  }

  return (
    <PageContainer title="Settings">
      <div className="space-y-6">
        {/* Two-column grid on desktop, stacked on mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile Settings */}
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Settings
              </CardTitle>
              <CardDescription>Manage your account information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user?.imageUrl} alt="Profile" />
                  <AvatarFallback className="text-2xl">{user?.firstName?.[0]}{user?.lastName?.[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg">{user?.firstName} {user?.lastName}</h3>
                  <p className="text-sm text-muted-foreground">{user?.primaryEmailAddress.emailAddress}</p>
                </div>
              </div>
              <Separator />
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  Change Profile Info
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Change Password
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Theme & Appearance */}
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {settings?.darkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                Theme & Appearance
              </CardTitle>
              <CardDescription>Customize the look and feel</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="dark-mode">Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Toggle between light and dark themes
                  </p>
                </div>
                <Switch
                  id="dark-mode"
                  checked={settings?.darkMode}
                  onCheckedChange={(checked) => setSettings({ ...settings, darkMode: checked })}
                />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>Theme Preview</Label>
                <div
                  className={`p-6 rounded-lg border transition-colors ${
                    settings?.darkMode
                      ? "bg-slate-900 border-slate-700 text-slate-100"
                      : "bg-slate-50 border-slate-200 text-slate-900"
                  }`}
                >
                  <p className="font-medium mb-2">Sample Content</p>
                  <p className="text-sm opacity-80">
                    This is how your interface will look with the selected theme.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Language Preferences */}
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Language Preferences
              </CardTitle>
              <CardDescription>Choose your preferred language</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="language">Display Language</Label>
                <Select value={settings?.language} onValueChange={(value) => setSettings({ ...settings, language: value }) }>
                  <SelectTrigger id="language">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="spanish">Spanish</SelectItem>
                    <SelectItem value="french">French</SelectItem>
                    <SelectItem value="german">German</SelectItem>
                    <SelectItem value="chinese">Chinese</SelectItem>
                    <SelectItem value="japanese">Japanese</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button variant="secondary" className="w-full">
                Save Language
              </Button>
            </CardContent>
          </Card>

          {/* Accessibility */}
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Accessibility className="h-5 w-5" />
                Accessibility
              </CardTitle>
              <CardDescription>Customize accessibility features</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="high-contrast"
                  checked={settings?.highContrast}
                  onCheckedChange={(checked) => setSettings({ ...settings, highContrast: checked as boolean })}
                />
                <div className="space-y-0.5">
                  <Label htmlFor="high-contrast" className="cursor-pointer">
                    High Contrast Mode
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Increase contrast for better visibility
                  </p>
                </div>
              </div>
              <Separator />
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="larger-text"
                  checked={settings?.largerText}
                  onCheckedChange={(checked) => setSettings({ ...settings, largerText: checked as boolean })}
                />
                <div className="space-y-0.5">
                  <Label htmlFor="larger-text" className="cursor-pointer">
                    Larger Text
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Increase text size across the app
                  </p>
                </div>
              </div>
              <Separator />
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="screen-reader"
                  checked={settings?.screenReader}
                  onCheckedChange={(checked) => setSettings({ ...settings, screenReader: checked as boolean })}
                />
                <div className="space-y-0.5">
                  <Label htmlFor="screen-reader" className="cursor-pointer">
                    Screen Reader Friendly
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Optimize for screen reader compatibility
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notifications - Full width on larger screens */}
          <Card className="animate-fade-in lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
              <CardDescription>Manage your notification preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive updates and announcements via email
                    </p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={settings?.emailNotifications}
                    onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="session-reminders">Session Reminders</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified before upcoming sessions
                    </p>
                  </div>
                  <Switch
                    id="session-reminders"
                    checked={settings?.sessionReminders}
                    onCheckedChange={(checked) => setSettings({ ...settings, sessionReminders: checked })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-3 justify-end">
              <Button variant="outline" onClick={handleResetSettings}>
                Reset to Default
              </Button>
              <Button onClick={handleSaveSettings}>Save Settings</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};

export default Settings;
