import { TimerDisplay } from "@/components/pomodoro/timer-display";
import { Card } from "@/components/ui/card";

export default function Pomodoro() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8">Pomodoro Timer</h1>

      <div className="max-w-2xl mx-auto">
        <TimerDisplay />

        <Card className="mt-8 p-6">
          <h2 className="text-xl font-semibold mb-4">Tips for Focus</h2>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>Find a quiet workspace</li>
            <li>Clear your desk of distractions</li>
            <li>Use noise-canceling headphones if needed</li>
            <li>Take regular breaks to maintain energy</li>
            <li>Stay hydrated and comfortable</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
