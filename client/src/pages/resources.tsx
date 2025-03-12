import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

const resources = [
  {
    category: "Understanding ADHD",
    items: [
      {
        title: "CHADD - National Resource on ADHD",
        description: "Comprehensive information and support for individuals with ADHD",
        url: "https://chadd.org/"
      },
      {
        title: "ADDitude Magazine",
        description: "Expert guidance and strategies for living with ADHD",
        url: "https://www.additudemag.com/"
      }
    ]
  },
  {
    category: "Productivity Techniques",
    items: [
      {
        title: "Understanding the Pomodoro Technique",
        description: "Learn how to break work into focused intervals",
        url: "https://francescocirillo.com/pages/pomodoro-technique"
      },
      {
        title: "Body Doubling",
        description: "Working alongside others to maintain focus",
        url: "https://add.org/body-doubling/"
      }
    ]
  },
  {
    category: "Self-Care & Wellness",
    items: [
      {
        title: "Mindfulness for ADHD",
        description: "Meditation and mindfulness practices for better focus",
        url: "https://www.mindful.org/mindfulness-for-adhd/"
      },
      {
        title: "Sleep Hygiene Tips",
        description: "Improving sleep quality with ADHD",
        url: "https://www.sleepfoundation.org/mental-health/adhd-and-sleep"
      }
    ]
  }
];

export default function Resources() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8">ADHD Resources</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((section) => (
          <Card key={section.category} className="p-6">
            <h2 className="text-2xl font-semibold mb-4">{section.category}</h2>
            <div className="space-y-4">
              {section.items.map((item) => (
                <div key={item.title} className="space-y-2">
                  <h3 className="font-medium">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => window.open(item.url, '_blank')}
                  >
                    Visit Resource
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <Card className="mt-8 p-6">
        <h2 className="text-2xl font-semibold mb-4">Using This App Effectively</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Task Management</h3>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Break large tasks into smaller steps</li>
              <li>Prioritize tasks by importance</li>
              <li>Use the Pomodoro timer for focused work</li>
              <li>Track completed tasks for motivation</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">Mood Tracking</h3>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Log your mood daily</li>
              <li>Note patterns in focus and energy</li>
              <li>Use insights to plan your day</li>
              <li>Share patterns with healthcare providers</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
