import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Clock, CheckSquare, LineChart, BookOpen, LayoutDashboard, MessageSquare } from "lucide-react";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/pomodoro", label: "Pomodoro", icon: Clock },
  { href: "/tasks", label: "Tasks", icon: CheckSquare },
  { href: "/mood", label: "Mood Tracker", icon: LineChart },
  { href: "/resources", label: "Resources", icon: BookOpen },
  { href: "/chat", label: "AI Chat", icon: MessageSquare }, // Added AI Chat item
];

export function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="h-screen w-72 bg-sidebar py-8 px-4 flex flex-col gap-4 border-r border-sidebar-border shadow-lg">
      <div className="px-4 mb-8">
        <h1 className="text-3xl font-black bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Focus Flow
        </h1>
        <p className="text-sm font-medium text-sidebar-foreground/60 mt-1">
          ADHD Productivity Assistant
        </p>
      </div>

      <nav className="space-y-2 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 py-6 text-base transition-all duration-200",
                  isActive
                    ? "bg-primary/10 hover:bg-primary/15 text-primary shadow-sm"
                    : "hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                )}
              >
                <Icon className={cn(
                  "h-5 w-5 transition-transform",
                  isActive && "scale-110"
                )} />
                <span className={cn(
                  "font-medium",
                  isActive && "font-semibold"
                )}>{item.label}</span>
              </Button>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto px-4">
        <div className="rounded-lg bg-sidebar-accent/10 p-4 space-y-3">
          <h3 className="font-semibold text-primary">Need Help?</h3>
          <p className="text-sm text-sidebar-foreground/70">
            Check out our resources section for ADHD management tips and guides.
          </p>
        </div>
      </div>
    </div>
  );
}