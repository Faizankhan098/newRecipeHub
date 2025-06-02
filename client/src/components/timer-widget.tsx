import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Pause, Play, Square } from "lucide-react";

interface Timer {
  id: string;
  stepNumber: number;
  description: string;
  totalMinutes: number;
  remainingSeconds: number;
}

interface TimerWidgetProps {
  timer: Timer;
  onTimerUpdate: (timer: Timer | null) => void;
  onTimerComplete: () => void;
}

export function TimerWidget({ timer, onTimerUpdate, onTimerComplete }: TimerWidgetProps) {
  const [isPaused, setIsPaused] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (isPaused || isComplete) return;

    const interval = setInterval(() => {
      onTimerUpdate((prevTimer) => {
        if (!prevTimer || prevTimer.remainingSeconds <= 0) {
          return prevTimer;
        }

        const newRemainingSeconds = prevTimer.remainingSeconds - 1;
        
        if (newRemainingSeconds <= 0) {
          setIsComplete(true);
          
          // Request notification permission and show notification
          if (Notification.permission === 'granted') {
            new Notification('Timer Complete!', {
              body: `Step ${prevTimer.stepNumber}: ${prevTimer.description}`,
              icon: '/favicon.ico',
            });
          } else if (Notification.permission === 'default') {
            Notification.requestPermission().then((permission) => {
              if (permission === 'granted') {
                new Notification('Timer Complete!', {
                  body: `Step ${prevTimer.stepNumber}: ${prevTimer.description}`,
                  icon: '/favicon.ico',
                });
              }
            });
          }

          // Play audio alert
          try {
            const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmETBT2X2e/AciMFL4nN8NuJOQcTYrNmTCYD');
            audio.play().catch(() => {
              // Fallback for browsers that don't allow audio
              console.log('Timer completed for step', prevTimer.stepNumber);
            });
          } catch (e) {
            console.log('Timer completed for step', prevTimer.stepNumber);
          }

          return {
            ...prevTimer,
            remainingSeconds: 0,
          };
        }

        return {
          ...prevTimer,
          remainingSeconds: newRemainingSeconds,
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, isComplete, onTimerUpdate]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const totalSeconds = timer.totalMinutes * 60;
  const progress = ((totalSeconds - timer.remainingSeconds) / totalSeconds) * 100;

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleStop = () => {
    onTimerComplete();
    setIsComplete(false);
    setIsPaused(false);
  };

  return (
    <Card className="recipe-card border-l-4 border-l-primary">
      <CardHeader>
        <CardTitle className="text-lg">Active Timer</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center mb-4">
          <div className={`text-4xl font-bold mb-2 ${isComplete ? 'text-green-600' : 'text-primary'}`}>
            {formatTime(timer.remainingSeconds)}
          </div>
          <p className="text-sm text-muted-foreground">
            Step {timer.stepNumber}: {timer.description}
          </p>
        </div>
        
        <Progress value={progress} className="mb-4" />
        
        <div className="flex space-x-2">
          {!isComplete ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handlePause}
                className="flex-1"
              >
                {isPaused ? (
                  <>
                    <Play className="h-4 w-4 mr-1" />
                    Resume
                  </>
                ) : (
                  <>
                    <Pause className="h-4 w-4 mr-1" />
                    Pause
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleStop}
                className="flex-1"
              >
                <Square className="h-4 w-4 mr-1" />
                Stop
              </Button>
            </>
          ) : (
            <Button
              onClick={handleStop}
              className="w-full recipe-button-secondary"
            >
              Timer Complete! ✓
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
