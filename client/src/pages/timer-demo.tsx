import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TimerWidget } from "@/components/timer-widget";
import { Clock, Play } from "lucide-react";

interface Timer {
  id: string;
  stepNumber: number;
  description: string;
  totalMinutes: number;
  remainingSeconds: number;
}

export default function TimerDemo() {
  const [activeTimer, setActiveTimer] = useState<Timer | null>(null);
  const [minutes, setMinutes] = useState(1);
  const [description, setDescription] = useState("Test cooking step");

  const startTimer = () => {
    if (activeTimer) return;
    
    const newTimer: Timer = {
      id: Date.now().toString(),
      stepNumber: 1,
      description,
      totalMinutes: minutes,
      remainingSeconds: minutes * 60,
    };
    
    setActiveTimer(newTimer);
  };

  const handleTimerUpdate = (timer: Timer | null) => {
    setActiveTimer(timer);
  };

  const handleTimerComplete = () => {
    setActiveTimer(null);
  };

  const presetTimers = [
    { minutes: 0.1, description: "Quick test (6 seconds)" },
    { minutes: 1, description: "Boil water" },
    { minutes: 3, description: "Sauté onions" },
    { minutes: 5, description: "Simmer sauce" },
    { minutes: 10, description: "Bake cookies" },
    { minutes: 15, description: "Cook pasta" },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
          <Clock className="h-8 w-8 text-primary" />
          Interactive Recipe Timer Demo
        </h1>
        <p className="text-muted-foreground">
          Test the enhanced timer system with sound alerts, visual notifications, and browser notifications.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Timer Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Start a Timer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Description</label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What are you timing?"
                disabled={!!activeTimer}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Duration (minutes)</label>
              <Input
                type="number"
                min="0.1"
                max="60"
                step="0.1"
                value={minutes}
                onChange={(e) => setMinutes(parseFloat(e.target.value) || 1)}
                disabled={!!activeTimer}
              />
            </div>

            <Button 
              onClick={startTimer} 
              disabled={!!activeTimer}
              className="w-full"
            >
              <Play className="h-4 w-4 mr-2" />
              Start Timer
            </Button>

            <div className="border-t pt-4">
              <p className="text-sm font-medium mb-3">Quick Presets:</p>
              <div className="grid grid-cols-2 gap-2">
                {presetTimers.map((preset, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    disabled={!!activeTimer}
                    onClick={() => {
                      setMinutes(preset.minutes);
                      setDescription(preset.description);
                    }}
                    className="text-xs"
                  >
                    {preset.minutes < 1 ? `${preset.minutes * 60}s` : `${preset.minutes}m`}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features Info */}
        <Card>
          <CardHeader>
            <CardTitle>Timer Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <strong>Visual Alerts:</strong> Color-coded timer states with warning indicators when time is running low
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <strong>Sound Notifications:</strong> Kitchen timer sounds with Web Audio API fallback for better compatibility
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <div>
                  <strong>Browser Notifications:</strong> Push notifications that work even when the tab is not active
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                <div>
                  <strong>Page Title Updates:</strong> Changes browser tab title when timer completes
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                <div>
                  <strong>Multiple Alert Repetition:</strong> Plays sound alerts multiple times to ensure you notice
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                <div>
                  <strong>Sound Toggle:</strong> Enable or disable sound alerts with the volume button
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Timer Display */}
      {activeTimer && (
        <div className="mt-6">
          <TimerWidget
            timer={activeTimer}
            onTimerUpdate={handleTimerUpdate}
            onTimerComplete={handleTimerComplete}
          />
        </div>
      )}

      {/* Usage Instructions */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>How to Test</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
            <li>Allow browser notifications when prompted for the full experience</li>
            <li>Use the "Quick test (6 seconds)" preset to see all features quickly</li>
            <li>Watch for color changes in the final 60 seconds (yellow) and 10 seconds (red)</li>
            <li>Notice the flashing effect, sound alerts, and notifications when timer completes</li>
            <li>Test the pause/resume and stop functionality</li>
            <li>Try toggling sound on/off with the volume button</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}