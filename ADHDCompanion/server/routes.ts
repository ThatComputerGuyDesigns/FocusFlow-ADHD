import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { 
  insertTaskSchema, 
  insertPomodoroSettingsSchema, 
  insertMoodSchema,
  insertMessageSchema 
} from "@shared/schema";
import { getAIResponse } from "./ai-chat";

export async function registerRoutes(app: Express) {
  const httpServer = createServer(app);

  // Tasks
  app.get("/api/tasks", async (_req, res) => {
    const tasks = await storage.getTasks();
    res.json(tasks);
  });

  app.post("/api/tasks", async (req, res) => {
    const result = insertTaskSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: "Invalid task data" });
    }
    const task = await storage.createTask(result.data);
    res.status(201).json(task);
  });

  app.patch("/api/tasks/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid task ID" });
    }
    const result = insertTaskSchema.partial().safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: "Invalid task data" });
    }
    const task = await storage.updateTask(id, result.data);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.json(task);
  });

  app.delete("/api/tasks/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid task ID" });
    }
    const success = await storage.deleteTask(id);
    if (!success) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.status(204).end();
  });

  // Pomodoro Settings
  app.get("/api/pomodoro/settings", async (_req, res) => {
    const settings = await storage.getPomodoroSettings();
    res.json(settings);
  });

  app.put("/api/pomodoro/settings", async (req, res) => {
    const result = insertPomodoroSettingsSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: "Invalid settings data" });
    }
    const settings = await storage.updatePomodoroSettings(result.data);
    res.json(settings);
  });

  // Moods
  app.get("/api/moods", async (_req, res) => {
    const moods = await storage.getMoods();
    res.json(moods);
  });

  app.post("/api/moods", async (req, res) => {
    const result = insertMoodSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: "Invalid mood data" });
    }
    const mood = await storage.createMood(result.data);
    res.status(201).json(mood);
  });

  // Chat
  app.get("/api/messages", async (_req, res) => {
    const messages = await storage.getMessages();
    res.json(messages);
  });

  app.post("/api/messages", async (req, res) => {
    const result = insertMessageSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: "Invalid message data" });
    }

    try {
      // Save user message first
      const userMessage = await storage.createMessage({
        content: result.data.content,
        isUser: true,
      });

      // Get AI response
      const aiResponse = await getAIResponse(result.data.content);

      // Save AI response
      const aiMessage = await storage.createMessage({
        content: aiResponse,
        isUser: false,
      });

      res.status(201).json({ userMessage, aiMessage });
    } catch (error) {
      console.error('Chat Error:', error);
      // Even if AI fails, we return the user message
      res.status(201).json({ 
        userMessage: await storage.createMessage({
          content: result.data.content,
          isUser: true,
        }),
        error: "Failed to get AI response"
      });
    }
  });

  return httpServer;
}