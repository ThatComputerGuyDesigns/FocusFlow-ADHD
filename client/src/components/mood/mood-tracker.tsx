import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { insertMoodSchema, type InsertMood, type Mood } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Brain, Battery, Target } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const getWellnessScore = (mood: number, energy: number, focus: number) => {
  // Calculate average on a scale of 1-5, then convert to percentage
  return Math.round(((mood + energy + focus) / 3 - 1) * 25);
};

const getSuggestions = (mood: number, energy: number, focus: number) => {
  const suggestions: string[] = [];

  if (mood < 3) {
    suggestions.push(
      "Try some quick mindfulness exercises",
      "Take a short walk outside",
      "Listen to uplifting music"
    );
  }

  if (energy < 3) {
    suggestions.push(
      "Take a power nap (15-20 minutes)",
      "Have a healthy snack",
      "Do some light stretching"
    );
  }

  if (focus < 3) {
    suggestions.push(
      "Break tasks into smaller chunks",
      "Use the Pomodoro timer",
      "Find a quiet workspace"
    );
  }

  return suggestions.length > 0 ? suggestions : ["You're doing great! Keep up the good work!"];
};

export function MoodTracker() {
  const form = useForm<InsertMood>({
    resolver: zodResolver(insertMoodSchema),
    defaultValues: {
      mood: 3,
      energy: 3,
      focus: 3,
      notes: "",
    },
  });

  const { data: moods } = useQuery<Mood[]>({
    queryKey: ["/api/moods"],
  });

  const createMood = useMutation({
    mutationFn: async (data: InsertMood) => {
      return apiRequest("POST", "/api/moods", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/moods"] });
      form.reset();
    },
  });

  const currentScore = getWellnessScore(
    form.watch("mood"),
    form.watch("energy"),
    form.watch("focus")
  );

  const currentSuggestions = getSuggestions(
    form.watch("mood"),
    form.watch("energy"),
    form.watch("focus")
  );

  return (
    <div className="space-y-8">
      <Card className="p-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data) => createMood.mutate(data))}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="mood"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Brain className="h-4 w-4 text-primary" />
                    Mood
                  </FormLabel>
                  <FormControl>
                    <Slider
                      min={1}
                      max={5}
                      step={1}
                      value={[field.value]}
                      onValueChange={([value]) => field.onChange(value)}
                      className="py-4"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="energy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Battery className="h-4 w-4 text-primary" />
                    Energy
                  </FormLabel>
                  <FormControl>
                    <Slider
                      min={1}
                      max={5}
                      step={1}
                      value={[field.value]}
                      onValueChange={([value]) => field.onChange(value)}
                      className="py-4"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="focus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-primary" />
                    Focus
                  </FormLabel>
                  <FormControl>
                    <Slider
                      min={1}
                      max={5}
                      step={1}
                      value={[field.value]}
                      onValueChange={([value]) => field.onChange(value)}
                      className="py-4"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="rounded-lg bg-primary/5 p-4 space-y-3 border border-primary/10">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-primary">Wellness Score</h3>
                <span className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  {currentScore}%
                </span>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Suggestions:</p>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  {currentSuggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary/60" />
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="How are you feeling?" 
                      {...field} 
                      value={field.value || ''} 
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button type="submit" disabled={createMood.isPending}>
              Log Mood
            </Button>
          </form>
        </Form>
      </Card>

      {moods && moods.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Mood History</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={moods}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="timestamp"
                  tickFormatter={(time) => new Date(time).toLocaleDateString()}
                />
                <YAxis domain={[1, 5]} />
                <Tooltip />
                <Line type="monotone" dataKey="mood" stroke="#4c51bf" />
                <Line type="monotone" dataKey="energy" stroke="#48bb78" />
                <Line type="monotone" dataKey="focus" stroke="#ed8936" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}
    </div>
  );
}