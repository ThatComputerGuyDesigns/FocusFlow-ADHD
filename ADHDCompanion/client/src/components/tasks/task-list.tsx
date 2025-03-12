import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { Task } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export function TaskList() {
  const { data: tasks, isLoading } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });

  const toggleTask = useMutation({
    mutationFn: async (task: Task) => {
      return apiRequest("PATCH", `/api/tasks/${task.id}`, {
        completed: !task.completed,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
    },
  });

  const deleteTask = useMutation({
    mutationFn: async (taskId: number) => {
      return apiRequest("DELETE", `/api/tasks/${taskId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
    },
  });

  if (isLoading) {
    return <div>Loading tasks...</div>;
  }

  return (
    <div className="space-y-4">
      {tasks?.map((task) => (
        <Card key={task.id} className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Checkbox
              checked={task.completed}
              onCheckedChange={() => toggleTask.mutate(task)}
            />
            <span className={task.completed ? "line-through text-muted-foreground" : ""}>
              {task.title}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => deleteTask.mutate(task.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </Card>
      ))}
    </div>
  );
}
