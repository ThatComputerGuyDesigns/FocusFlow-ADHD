import { MoodTracker } from "@/components/mood/mood-tracker";
import { Card } from "@/components/ui/card";

export default function Mood() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8">Mood Tracker</h1>

      <div className="grid lg:grid-cols-2 gap-6">
        <div>
          <Card className="p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4">Track Your Day</h2>
            <p className="text-muted-foreground mb-4">
              Monitor your mood, energy, and focus levels throughout the day. This helps identify patterns and triggers that affect your ADHD symptoms.
            </p>
          </Card>
          <MoodTracker />
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Understanding Your Patterns</h2>
            <ul className="space-y-3 text-muted-foreground">
              <li>• Track when your focus is highest</li>
              <li>• Identify energy peaks and dips</li>
              <li>• Monitor medication effectiveness</li>
              <li>• Recognize emotional triggers</li>
              <li>• Plan activities around your best times</li>
            </ul>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Tips for Better Days</h2>
            <ul className="space-y-3 text-muted-foreground">
              <li>• Start your day with a routine</li>
              <li>• Take regular breaks</li>
              <li>• Stay hydrated and eat regularly</li>
              <li>• Get enough sleep</li>
              <li>• Exercise to boost mood and focus</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
