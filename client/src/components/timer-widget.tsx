import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Pause, Play, Square, Bell, Volume2, VolumeX } from "lucide-react";

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
  const [isFlashing, setIsFlashing] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize audio on component mount
  useEffect(() => {
    // Create multiple alarm sounds for better browser compatibility
    audioRef.current = new Audio();
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Timer countdown logic
  useEffect(() => {
    if (isPaused || isComplete) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      const newTimer = { ...timer };
      newTimer.remainingSeconds -= 1;

      if (newTimer.remainingSeconds <= 0) {
        setIsComplete(true);
        setIsFlashing(true);
        
        // Trigger completion effects
        handleTimerComplete();
        
        newTimer.remainingSeconds = 0;
      }

      onTimerUpdate(newTimer);
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPaused, isComplete, timer, onTimerUpdate]);

  // Handle timer completion with enhanced alerts
  const handleTimerComplete = async () => {
    // Visual flash effect
    let flashCount = 0;
    const flashInterval = setInterval(() => {
      setIsFlashing(prev => !prev);
      flashCount++;
      if (flashCount >= 6) { // Flash 3 times
        clearInterval(flashInterval);
        setIsFlashing(false);
      }
    }, 300);

    // Browser notification
    if (Notification.permission === 'granted') {
      new Notification('🍳 Timer Complete!', {
        body: `Step ${timer.stepNumber}: ${timer.description}`,
        icon: '/favicon.ico',
        requireInteraction: true,
        tag: `timer-${timer.id}`,
      });
    } else if (Notification.permission === 'default') {
      await Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          new Notification('🍳 Timer Complete!', {
            body: `Step ${timer.stepNumber}: ${timer.description}`,
            icon: '/favicon.ico',
            requireInteraction: true,
            tag: `timer-${timer.id}`,
          });
        }
      });
    }

    // Audio alert with multiple fallbacks
    if (soundEnabled && audioRef.current) {
      try {
        // Kitchen timer sound - a more pleasant bell-like tone
        const audioData = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmETBT2X2e/AciMFL4nN8NuJOQcTYrNmTCYDIHbD7+OWQwwPVK3n8KlZGAg+ltryxHkpBSl+zPLZizEIGGS57OihUQ0NTqXh8bllHgg2jdXzzn0vBSF1xe/glEILElyx6OyrWBUIQ5zd8sFuIAU7k9nwwXIjBSuCzvDciTkIF2euaEwmAyJ2w+/jlkMMD1St5/CpWRgIPpba8sR5KQUpfszy2YsxCBhkuezooVENDU6l4fG5ZR4INo3V8859LwUhdcXv4JRCCxJcsejsq1gVCEOc3fLBbiAFO5PZ8MFyIwUrgs7w3Ik5CBdnrmhMJgMidsrSyV-OOB+a2gAA';
        audioRef.current.src = audioData;
        
        // Play multiple times for attention
        let playCount = 0;
        const playAlarm = () => {
          if (playCount < 3 && soundEnabled) {
            audioRef.current?.play().catch(() => {
              // Fallback: Use Web Audio API for beep
              try {
                const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
                gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
                
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.5);
              } catch (e) {
                console.log('Timer completed - audio not available');
              }
            });
            playCount++;
            if (playCount < 3) {
              setTimeout(playAlarm, 800);
            }
          }
        };
        
        playAlarm();
      } catch (e) {
        console.log('Timer completed for step', timer.stepNumber);
      }
    }

    // Page title notification
    const originalTitle = document.title;
    document.title = '🔔 Timer Complete!';
    setTimeout(() => {
      document.title = originalTitle;
    }, 5000);
  };

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
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    onTimerComplete();
    setIsComplete(false);
    setIsPaused(false);
    setIsFlashing(false);
  };

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
  };

  // Warning states for better UX
  const isWarning = timer.remainingSeconds <= 60 && timer.remainingSeconds > 10 && !isComplete;
  const isCritical = timer.remainingSeconds <= 10 && timer.remainingSeconds > 0;

  return (
    <Card className={`recipe-card border-l-4 transition-all duration-300 ${
      isFlashing 
        ? 'border-l-red-500 bg-red-50 dark:bg-red-950' 
        : isComplete 
        ? 'border-l-green-500' 
        : isCritical 
        ? 'border-l-red-400 animate-pulse' 
        : isWarning 
        ? 'border-l-yellow-400' 
        : 'border-l-primary'
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Bell className={`h-5 w-5 ${isComplete ? 'text-green-600' : 'text-primary'}`} />
            Active Timer
          </CardTitle>
          <div className="flex items-center gap-2">
            {isComplete && (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Complete
              </Badge>
            )}
            {isWarning && !isComplete && (
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                {isCritical ? 'Critical' : 'Warning'}
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSound}
              className="h-8 w-8 p-0"
              title={soundEnabled ? 'Disable sound' : 'Enable sound'}
            >
              {soundEnabled ? (
                <Volume2 className="h-4 w-4" />
              ) : (
                <VolumeX className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-center mb-4">
          <div className={`text-4xl font-bold mb-2 transition-colors duration-300 ${
            isFlashing 
              ? 'text-red-600' 
              : isComplete 
              ? 'text-green-600' 
              : isCritical 
              ? 'text-red-500' 
              : isWarning 
              ? 'text-yellow-600' 
              : 'text-primary'
          }`}>
            {formatTime(timer.remainingSeconds)}
          </div>
          <p className="text-sm text-muted-foreground">
            Step {timer.stepNumber}: {timer.description}
          </p>
          {isWarning && !isComplete && (
            <p className="text-xs text-muted-foreground mt-1">
              {isCritical ? 'Almost done!' : 'Less than a minute remaining'}
            </p>
          )}
        </div>
        
        <Progress 
          value={progress} 
          className={`mb-4 h-2 transition-all duration-300 ${
            isCritical ? 'animate-pulse' : ''
          }`}
        />
        
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
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              Timer Complete! Continue Recipe
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
