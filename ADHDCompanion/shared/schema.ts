import { pgTable, text, serial, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  completed: boolean("completed").default(false).notNull(),
  priority: integer("priority").default(1).notNull(),
});

export const pomodoroSettings = pgTable("pomodoro_settings", {
  id: serial("id").primaryKey(),
  workDuration: integer("work_duration").default(25).notNull(),
  breakDuration: integer("break_duration").default(5).notNull(),
  longBreakDuration: integer("long_break_duration").default(15).notNull(),
  sessionsBeforeLongBreak: integer("sessions_before_long_break").default(4).notNull(),
});

export const moods = pgTable("moods", {
  id: serial("id").primaryKey(),
  mood: integer("mood").notNull(), // 1-5 scale
  energy: integer("energy").notNull(), // 1-5 scale
  focus: integer("focus").notNull(), // 1-5 scale
  notes: text("notes"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  isUser: boolean("is_user").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// Create insert schemas
export const insertTaskSchema = createInsertSchema(tasks).omit({ id: true });
export const insertPomodoroSettingsSchema = createInsertSchema(pomodoroSettings).omit({ id: true });
export const insertMoodSchema = createInsertSchema(moods).omit({ id: true, timestamp: true });
export const insertMessageSchema = createInsertSchema(messages).omit({ id: true, timestamp: true });

// Export types
export type Task = typeof tasks.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;
export type PomodoroSettings = typeof pomodoroSettings.$inferSelect;
export type InsertPomodoroSettings = z.infer<typeof insertPomodoroSettingsSchema>;
export type Mood = typeof moods.$inferSelect;
export type InsertMood = z.infer<typeof insertMoodSchema>;
export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;