import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronRight, Plane } from "lucide-react";
import welcomeImage from "@/assets/welcome-travel.jpg";

const slides = [
  {
    title: "Welcome",
    description: "TravEZ will help you simplify travel",
    image: welcomeImage,
  },
  {
    title: "Travel made easy with TravEZ",
    description:
      "TravEZ simplifies travelers' transit through borders while travelling on planes, buses, trains, and other forms of public transportation.",
    image: welcomeImage,
  },
  {
    title: "Everything You Need",
    description:
      "Choose one or multiple destinations, and we provide all the info and tips you might need, including visa processes (if required), luggage requirements, schedules, time differences, weather conditions, currency rates, Wi-Fi availability, etc.",
    image: welcomeImage,
  },
];

const Welcome = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      navigate("/home");
    }
  };

  const handleSkip = () => {
    navigate("/home");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Hero Image */}
      <div className="relative h-[45vh] overflow-hidden">
        <img
          src={slides[currentSlide].image}
          alt={slides[currentSlide].title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-8 flex flex-col justify-between">
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-primary/10">
              <Plane className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold">{slides[currentSlide].title}</h1>
          </div>

          <p className="text-lg text-muted-foreground leading-relaxed">
            {slides[currentSlide].description}
          </p>
        </div>

        {/* Navigation */}
        <div className="space-y-4">
          {/* Dots Indicator */}
          <div className="flex justify-center gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? "w-8 bg-primary"
                    : "w-2 bg-muted-foreground/30"
                }`}
              />
            ))}
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <Button
              variant="ghost"
              onClick={handleSkip}
              className="flex-1"
              size="lg"
            >
              Skip
            </Button>
            <Button
              variant="hero"
              onClick={handleNext}
              className="flex-1"
              size="lg"
            >
              {currentSlide === slides.length - 1 ? "Let's Go!" : "Next"}
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          <p className="text-center text-xs text-muted-foreground pt-4">
            © 2023 TravEZ WORLD TRANSIT ADVISORY CORP. All Rights Reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
