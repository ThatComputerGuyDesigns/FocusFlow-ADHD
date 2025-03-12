import { TaskForm } from "@/components/tasks/task-form";
import { TaskList } from "@/components/tasks/task-list";

export default function Tasks() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8">Task Manager</h1>

      <div className="max-w-2xl">
        <TaskForm />
        <div className="mt-8">
          <TaskList />
        </div>
      </div>
    </div>
  );
}
