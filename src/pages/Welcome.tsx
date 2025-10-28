import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plane } from "lucide-react";
import welcomeImage from "@/assets/welcome-travel.jpg";

const slides = [
  {
    title: "Welcome",
    description: "TravEZ will help you simplify travel",
  },
  {
    title: "Travel made easy with TravEZ",
    description:
      "TravEZ simplifies travelers' transit through borders while travelling on planes, buses, trains, and other forms of public transportation.",
  },
  {
    title: "Everything You Need",
    description:
      "Choose one or multiple destinations, and we provide all the info and tips you might need, including visa processes (if required), luggage requirements, schedules, time differences, weather conditions, currency rates, Wi-Fi availability, etc.",
  },
];

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Hero Image */}
      <div className="relative h-[40vh] overflow-hidden">
        <img
          src={welcomeImage}
          alt="Welcome to TravEZ"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-8 overflow-y-auto">
        <div className="space-y-8 pb-24">
          {slides.map((slide, index) => (
            <div
              key={index}
              className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-primary/10">
                  <Plane className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold">{slide.title}</h2>
              </div>
              <p className="text-base text-muted-foreground leading-relaxed pl-[60px]">
                {slide.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background via-background to-transparent">
        <Button
          variant="hero"
          onClick={() => navigate("/home")}
          className="w-full"
          size="lg"
        >
          Let's Go!
        </Button>
        <p className="text-center text-xs text-muted-foreground pt-4">
          © 2023 TravEZ WORLD TRANSIT ADVISORY CORP. All Rights Reserved.
        </p>
      </div>
    </div>
  );
};

export default Welcome;
