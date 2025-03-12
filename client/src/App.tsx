import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { Sidebar } from "@/components/layout/sidebar";
import { MainNav } from "@/components/layout/main-nav";
import Dashboard from "@/pages/dashboard";
import Pomodoro from "@/pages/pomodoro";
import Tasks from "@/pages/tasks";
import Mood from "@/pages/mood";
import Resources from "@/pages/resources";
import NotFound from "@/pages/not-found";
import Chat from "@/pages/chat"; // Added import statement

function Router() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <MainNav />
        <main className="flex-1 overflow-y-auto">
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/pomodoro" component={Pomodoro} />
            <Route path="/tasks" component={Tasks} />
            <Route path="/mood" component={Mood} />
            <Route path="/resources" component={Resources} />
            <Route path="/chat" component={Chat} /> {/* Added chat route */}
            <Route component={NotFound} />
          </Switch>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;