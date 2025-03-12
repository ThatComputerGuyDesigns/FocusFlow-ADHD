import { create } from 'zustand';

type TimerState = {
  timeLeft: number;
  isRunning: boolean;
  isBreak: boolean;
  currentSession: number;
  workDuration: number;
  breakDuration: number;
  setWorkDuration: (duration: number) => void;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  tick: () => void;
};

export const useTimerStore = create<TimerState>((set, get) => ({
  timeLeft: 5 * 60, // Default 5 minutes
  isRunning: false,
  isBreak: false,
  currentSession: 0,
  workDuration: 5, // Default 5 minutes
  breakDuration: 1, // Default 1 minute (5:1 ratio)

  setWorkDuration: (duration) => {
    // Maintain 5:1 ratio - break is always workDuration/5
    set({ 
      workDuration: duration,
      breakDuration: Math.max(1, Math.round(duration / 5))
    });
    if (!get().isRunning && !get().isBreak) {
      set({ timeLeft: duration * 60 });
    }
  },

  startTimer: () => set({ isRunning: true }),

  pauseTimer: () => set({ isRunning: false }),

  resetTimer: () => {
    const { workDuration } = get();
    set({
      timeLeft: workDuration * 60,
      isRunning: false,
      isBreak: false,
      currentSession: 0,
    });
  },

  tick: () => {
    const state = get();
    if (state.timeLeft <= 0) {
      const nextIsBreak = !state.isBreak;
      const nextSession = state.isBreak ? state.currentSession + 1 : state.currentSession;

      const nextDuration = nextIsBreak ? state.breakDuration : state.workDuration;

      set({
        timeLeft: nextDuration * 60,
        isBreak: nextIsBreak,
        currentSession: nextSession,
      });

      // Play notification sound
      new Audio('/notification.mp3').play().catch(() => {});
    } else {
      set({ timeLeft: state.timeLeft - 1 });
    }
  },
}));