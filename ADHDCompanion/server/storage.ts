import { 
  type Task, type InsertTask,
  type PomodoroSettings, type InsertPomodoroSettings,
  type Mood, type InsertMood,
  type Message, type InsertMessage
} from "@shared/schema";

export interface IStorage {
  // Tasks
  getTasks(): Promise<Task[]>;
  getTask(id: number): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, task: Partial<InsertTask>): Promise<Task | undefined>;
  deleteTask(id: number): Promise<boolean>;

  // Pomodoro Settings
  getPomodoroSettings(): Promise<PomodoroSettings>;
  updatePomodoroSettings(settings: InsertPomodoroSettings): Promise<PomodoroSettings>;

  // Moods
  getMoods(): Promise<Mood[]>;
  createMood(mood: InsertMood): Promise<Mood>;

  // Messages
  getMessages(): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
}

export class MemStorage implements IStorage {
  private tasks: Map<number, Task>;
  private pomodoroSettings: PomodoroSettings;
  private moods: Map<number, Mood>;
  private taskId: number = 1;
  private moodId: number = 1;
  private messages: Map<number, Message>;
  private messageId: number = 1;

  constructor() {
    this.tasks = new Map();
    this.moods = new Map();
    this.messages = new Map();
    this.pomodoroSettings = {
      id: 1,
      workDuration: 25,
      breakDuration: 5,
      longBreakDuration: 15,
      sessionsBeforeLongBreak: 4,
    };
  }

  async getTasks(): Promise<Task[]> {
    return Array.from(this.tasks.values());
  }

  async getTask(id: number): Promise<Task | undefined> {
    return this.tasks.get(id);
  }

  async createTask(task: InsertTask): Promise<Task> {
    const newTask: Task = { 
      id: this.taskId++, 
      title: task.title,
      description: task.description ?? null,
      completed: task.completed ?? false,
      priority: task.priority ?? 1
    };
    this.tasks.set(newTask.id, newTask);
    return newTask;
  }

  async updateTask(id: number, task: Partial<InsertTask>): Promise<Task | undefined> {
    const existing = this.tasks.get(id);
    if (!existing) return undefined;

    const updated = { ...existing, ...task };
    this.tasks.set(id, updated);
    return updated;
  }

  async deleteTask(id: number): Promise<boolean> {
    return this.tasks.delete(id);
  }

  async getPomodoroSettings(): Promise<PomodoroSettings> {
    return this.pomodoroSettings;
  }

  async updatePomodoroSettings(settings: InsertPomodoroSettings): Promise<PomodoroSettings> {
    this.pomodoroSettings = { ...this.pomodoroSettings, ...settings };
    return this.pomodoroSettings;
  }

  async getMoods(): Promise<Mood[]> {
    return Array.from(this.moods.values());
  }

  async createMood(mood: InsertMood): Promise<Mood> {
    const newMood: Mood = { 
      id: this.moodId++, 
      mood: mood.mood,
      energy: mood.energy,
      focus: mood.focus,
      notes: mood.notes ?? null,
      timestamp: new Date()
    };
    this.moods.set(newMood.id, newMood);
    return newMood;
  }

  async getMessages(): Promise<Message[]> {
    return Array.from(this.messages.values());
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const newMessage: Message = { 
      id: this.messageId++, 
      content: message.content,
      isUser: message.isUser,
      timestamp: new Date()
    };
    this.messages.set(newMessage.id, newMessage);
    return newMessage;
  }
}

export const storage = new MemStorage();