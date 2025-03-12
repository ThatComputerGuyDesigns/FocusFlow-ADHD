import { useEffect } from "react";
import { useTimerStore } from "@/lib/timer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Pause, RotateCcw, Plus, Minus } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export function TimerDisplay() {
  const {
    timeLeft,
    isRunning,
    isBreak,
    workDuration,
    breakDuration,
    currentSession,
    setWorkDuration,
    startTimer,
    pauseTimer,
    resetTimer,
    tick,
  } = useTimerStore();

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [isRunning, tick]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const totalTime = isBreak ? breakDuration * 60 : workDuration * 60;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  const adjustDuration = (amount: number) => {
    const newDuration = Math.max(5, workDuration + amount);
    setWorkDuration(newDuration);
  };

  return (
    <Card className="bg-gradient-to-br from-background to-primary/5 border-2 border-primary/10">
      <CardContent className="p-8">
        <div className="text-center space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-primary">
              {isBreak ? "Break Time" : "Focus Time"}
            </h2>
            <p className="text-sm text-muted-foreground">
              Session {currentSession + 1}
            </p>
          </div>

          <div className="flex items-center justify-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => adjustDuration(-1)}
              disabled={isRunning || workDuration <= 5}
              className="hover:bg-primary/10"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <div className="text-sm font-medium">
              {workDuration}:{breakDuration} ratio
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => adjustDuration(1)}
              disabled={isRunning}
              className="hover:bg-primary/10"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="text-7xl font-mono font-bold tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            {minutes.toString().padStart(2, "0")}:
            {seconds.toString().padStart(2, "0")}
          </div>

          <Progress 
            value={progress} 
            className="h-2.5 bg-primary/20"
          />

          <div className="flex justify-center gap-4">
            <Button
              size="lg"
              onClick={isRunning ? pauseTimer : startTimer}
              className="w-32 bg-primary/90 hover:bg-primary transition-all duration-200"
            >
              {isRunning ? (
                <Pause className="mr-2 h-5 w-5" />
              ) : (
                <Play className="mr-2 h-5 w-5" />
              )}
              {isRunning ? "Pause" : "Start"}
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={resetTimer}
              className="w-32 border-2"
            >
              <RotateCcw className="mr-2 h-5 w-5" />
              Reset
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}