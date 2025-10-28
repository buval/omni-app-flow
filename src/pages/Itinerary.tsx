import { useState } from "react";
import { MapPin, Plus, Search, Plane, Train, Ship, Car, Bike, Footprints } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import BottomNav from "@/components/BottomNav";
import { Badge } from "@/components/ui/badge";

const travelModes = [
  { icon: Plane, label: "All" },
  { icon: Plane, label: "Plane" },
  { icon: Train, label: "Train" },
  { icon: Ship, label: "Ferry" },
  { icon: Car, label: "Car" },
  { icon: Bike, label: "Bicycle" },
  { icon: Footprints, label: "Walk" },
];

const Itinerary = () => {
  const [origin, setOrigin] = useState("Tehran, Iran");
  const [destination, setDestination] = useState("Vancouver, Canada");
  const [selectedMode, setSelectedMode] = useState("All");

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-card border-b border-border p-4">
        <h1 className="text-2xl font-bold">Plan Your Journey</h1>
        <p className="text-sm text-muted-foreground">Create your perfect itinerary</p>
      </header>

      <main className="p-4 space-y-6">
        {/* Location Selection */}
        <Card className="p-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="origin">Current Location</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="origin"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="destination">Destination</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
              <Input
                id="destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <Button variant="outline" className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Add One More Destination
          </Button>
        </Card>

        {/* Travel Mode Selection */}
        <div className="space-y-3">
          <h2 className="font-semibold">Preferred Travel Mode</h2>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {travelModes.map((mode) => {
              const Icon = mode.icon;
              const isSelected = selectedMode === mode.label;
              return (
                <button
                  key={mode.label}
                  onClick={() => setSelectedMode(mode.label)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all flex-shrink-0 min-w-[80px] ${
                    isSelected
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <Icon className="h-6 w-6" />
                  <span className="text-xs font-medium">{mode.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Search Results */}
        <Card className="p-4">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-semibold text-lg">{origin} → {destination}</h3>
              <p className="text-sm text-muted-foreground mt-1">18 hr 50 min+</p>
              <Badge variant="secondary" className="mt-2">Connecting (1 or more stops)</Badge>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Airlines</p>
              <p className="text-sm">Turkish Airlines, British Airways, Lufthansa, etc.</p>
            </div>

            <Button variant="hero" className="w-full">
              <Search className="mr-2 h-4 w-4" />
              See Results on Google Flights
            </Button>
          </div>
        </Card>

        {/* Travel Tips */}
        <Card className="p-4 bg-accent/50">
          <h3 className="font-semibold mb-3">Travel Tips</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>Visa required for Canadian entry - apply 2-3 weeks in advance</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>Time difference: 11.5 hours behind Tehran</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>Currency: CAD (1 CAD ≈ 28,000 IRR)</span>
            </li>
          </ul>
        </Card>
      </main>

      <BottomNav />
    </div>
  );
};

export default Itinerary;
