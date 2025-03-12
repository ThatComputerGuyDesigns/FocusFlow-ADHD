import { TaskList } from "@/components/tasks/task-list";
import { TimerDisplay } from "@/components/pomodoro/timer-display";
import { MoodTracker } from "@/components/mood/mood-tracker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, CheckSquare, LineChart } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-8 space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Welcome to Focus Flow
        </h1>
        <p className="text-lg text-muted-foreground">
          Your ADHD-friendly productivity companion
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <section className="space-y-6">
          <Card className="overflow-hidden border-2 border-primary/10 shadow-lg">
            <CardHeader className="space-y-1 bg-primary/5">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <CardTitle>Current Focus Session</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <TimerDisplay />
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-2 border-primary/10 shadow-lg">
            <CardHeader className="space-y-1 bg-primary/5">
              <div className="flex items-center gap-2">
                <CheckSquare className="h-5 w-5 text-primary" />
                <CardTitle>Today's Tasks</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <TaskList />
            </CardContent>
          </Card>
        </section>

        <section className="space-y-6">
          <Card className="overflow-hidden border-2 border-primary/10 shadow-lg">
            <CardHeader className="space-y-1 bg-primary/5">
              <div className="flex items-center gap-2">
                <LineChart className="h-5 w-5 text-primary" />
                <CardTitle>Quick Mood Check</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <MoodTracker />
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}