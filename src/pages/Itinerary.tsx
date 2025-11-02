import { useState } from "react";
import { MapPin, Plus, Search, Plane, Train, Ship, Car, Bike, Footprints } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import BottomNav from "@/components/BottomNav";
import { Badge } from "@/components/ui/badge";
import { useCitySearch } from "@/hooks/useCitySearch";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const travelModes = [
  { icon: Plane, label: "All" },
  { icon: Plane, label: "Plane" },
  { icon: Train, label: "Train" },
  { icon: Ship, label: "Ferry" },
  { icon: Car, label: "Car" },
  { icon: Bike, label: "Bicycle" },
  { icon: Footprints, label: "Walk" },
];

// Hard-coded flight database
const flightDatabase = [
  {
    id: 1,
    type: "flight",
    airline: "Turkish Airlines",
    price: "$850",
    duration: "18h 50m",
    stops: "1 stop (Istanbul)",
    departure: "10:30 AM",
    arrival: "2:20 PM +1"
  },
  {
    id: 2,
    type: "flight",
    airline: "British Airways",
    price: "$920",
    duration: "19h 15m",
    stops: "1 stop (London)",
    departure: "2:15 PM",
    arrival: "8:30 PM +1"
  },
  {
    id: 3,
    type: "flight",
    airline: "Lufthansa",
    price: "$885",
    duration: "20h 05m",
    stops: "1 stop (Frankfurt)",
    departure: "6:45 AM",
    arrival: "1:50 PM +1"
  }
];

// Hard-coded train database
const trainDatabase = [
  {
    id: 1,
    type: "train",
    operator: "Eurostar",
    price: "$120",
    duration: "2h 30m",
    stops: "Direct",
    departure: "9:15 AM",
    arrival: "11:45 AM",
    class: "Standard Premier"
  },
  {
    id: 2,
    type: "train",
    operator: "SNCF TGV",
    price: "$95",
    duration: "3h 45m",
    stops: "1 stop (Lyon)",
    departure: "11:30 AM",
    arrival: "3:15 PM",
    class: "Second Class"
  },
  {
    id: 3,
    type: "train",
    operator: "Deutsche Bahn ICE",
    price: "$140",
    duration: "4h 20m",
    stops: "Direct",
    departure: "1:45 PM",
    arrival: "6:05 PM",
    class: "First Class"
  },
  {
    id: 4,
    type: "train",
    operator: "Trenitalia",
    price: "$78",
    duration: "5h 10m",
    stops: "2 stops",
    departure: "7:30 AM",
    arrival: "12:40 PM",
    class: "Standard"
  }
];

// Hard-coded ferry database
const ferryDatabase = [
  {
    id: 1,
    type: "ferry",
    operator: "DFDS Seaways",
    price: "$185",
    duration: "16h 30m",
    stops: "Direct",
    departure: "8:00 PM",
    arrival: "12:30 PM +1",
    vessel: "Crown Seaways"
  },
  {
    id: 2,
    type: "ferry",
    operator: "P&O Ferries",
    price: "$95",
    duration: "7h 30m",
    stops: "Direct",
    departure: "10:30 PM",
    arrival: "6:00 AM +1",
    vessel: "Spirit of Britain"
  },
  {
    id: 3,
    type: "ferry",
    operator: "Stena Line",
    price: "$145",
    duration: "12h 15m",
    stops: "Direct",
    departure: "6:45 PM",
    arrival: "7:00 AM +1",
    vessel: "Stena Adventurer"
  },
  {
    id: 4,
    type: "ferry",
    operator: "Brittany Ferries",
    price: "$165",
    duration: "11h 00m",
    stops: "Direct",
    departure: "11:00 PM",
    arrival: "10:00 AM +1",
    vessel: "Pont-Aven"
  }
];

const Itinerary = () => {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [selectedMode, setSelectedMode] = useState("All");
  const [originQuery, setOriginQuery] = useState("");
  const [destinationQuery, setDestinationQuery] = useState("");
  const [originOpen, setOriginOpen] = useState(false);
  const [destinationOpen, setDestinationOpen] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  const { cities: originCities, loading: originLoading } = useCitySearch(originQuery);
  const { cities: destinationCities, loading: destinationLoading } = useCitySearch(destinationQuery);

  const handleSearch = async () => {
    if (!origin || !destination) {
      return;
    }
    
    setLoading(true);
    setShowResults(true);
    
    // Mock results based on selected travel mode
    setTimeout(() => {
      let results: any[] = [];
      
      if (selectedMode === "All") {
        results = [...flightDatabase, ...trainDatabase, ...ferryDatabase];
      } else if (selectedMode === "Plane") {
        results = flightDatabase;
      } else if (selectedMode === "Train") {
        results = trainDatabase;
      } else if (selectedMode === "Ferry") {
        results = ferryDatabase;
      } else {
        results = flightDatabase; // Default to flights for other modes
      }
      
      setSearchResults(results);
      setLoading(false);
    }, 1500);
  };

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
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Popover open={originOpen && originQuery.length >= 2} onOpenChange={setOriginOpen}>
                <PopoverTrigger asChild>
                  <div className="relative w-full">
                    <Input
                      id="origin"
                      value={origin}
                      onChange={(e) => {
                        setOrigin(e.target.value);
                        setOriginQuery(e.target.value);
                        setOriginOpen(true);
                      }}
                      onFocus={() => {
                        if (origin.length >= 2) {
                          setOriginQuery(origin);
                          setOriginOpen(true);
                        }
                      }}
                      onBlur={() => setTimeout(() => setOriginOpen(false), 200)}
                      className="pl-9"
                      placeholder="Search for a city..."
                      autoComplete="off"
                    />
                  </div>
                </PopoverTrigger>
                <PopoverContent 
                  className="w-[var(--radix-popover-trigger-width)] p-0" 
                  align="start"
                  onOpenAutoFocus={(e) => e.preventDefault()}
                >
                  <Command>
                    <CommandList>
                      {originLoading && <CommandEmpty>Loading cities...</CommandEmpty>}
                      {!originLoading && originCities.length === 0 && originQuery.length >= 2 && (
                        <CommandEmpty>No cities found.</CommandEmpty>
                      )}
                      <CommandGroup>
                        {originCities.map((city) => (
                          <CommandItem
                            key={city.id}
                            value={`${city.name}, ${city.country}`}
                            onSelect={(value) => {
                              setOrigin(value);
                              setOriginOpen(false);
                            }}
                          >
                            <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span>{city.name}, {city.country}</span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="destination">Destination</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary pointer-events-none" />
              <Popover open={destinationOpen && destinationQuery.length >= 2} onOpenChange={setDestinationOpen}>
                <PopoverTrigger asChild>
                  <div className="relative w-full">
                    <Input
                      id="destination"
                      value={destination}
                      onChange={(e) => {
                        setDestination(e.target.value);
                        setDestinationQuery(e.target.value);
                        setDestinationOpen(true);
                      }}
                      onFocus={() => {
                        if (destination.length >= 2) {
                          setDestinationQuery(destination);
                          setDestinationOpen(true);
                        }
                      }}
                      onBlur={() => setTimeout(() => setDestinationOpen(false), 200)}
                      className="pl-9"
                      placeholder="Search for a city..."
                      autoComplete="off"
                    />
                  </div>
                </PopoverTrigger>
                <PopoverContent 
                  className="w-[var(--radix-popover-trigger-width)] p-0" 
                  align="start"
                  onOpenAutoFocus={(e) => e.preventDefault()}
                >
                  <Command>
                    <CommandList>
                      {destinationLoading && <CommandEmpty>Loading cities...</CommandEmpty>}
                      {!destinationLoading && destinationCities.length === 0 && destinationQuery.length >= 2 && (
                        <CommandEmpty>No cities found.</CommandEmpty>
                      )}
                      <CommandGroup>
                        {destinationCities.map((city) => (
                          <CommandItem
                            key={city.id}
                            value={`${city.name}, ${city.country}`}
                            onSelect={(value) => {
                              setDestination(value);
                              setDestinationOpen(false);
                            }}
                          >
                            <MapPin className="mr-2 h-4 w-4 text-primary" />
                            <span>{city.name}, {city.country}</span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
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

        {/* Search Button */}
        {origin && destination && !showResults && (
          <Button 
            variant="default" 
            className="w-full" 
            size="lg"
            onClick={handleSearch}
          >
            <Search className="mr-2 h-4 w-4" />
            See Results
          </Button>
        )}

        {/* Search Results */}
        {showResults && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">{origin} → {destination}</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedMode !== "All" ? `${selectedMode} options` : "All travel options"}
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowResults(false)}
              >
                New Search
              </Button>
            </div>

            {loading ? (
              <Card className="p-8">
                <div className="flex flex-col items-center justify-center space-y-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <p className="text-sm text-muted-foreground">Searching for best options...</p>
                </div>
              </Card>
            ) : (
              <div className="space-y-3">
                {searchResults.map((result) => {
                  const Icon = result.type === "train" ? Train : result.type === "ferry" ? Ship : Plane;
                  const operatorName = result.airline || result.operator;
                  const extraInfo = result.class || result.vessel || "";
                  
                  return (
                    <Card key={`${result.type}-${result.id}`} className="p-4 hover:border-primary transition-colors cursor-pointer">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Icon className="h-4 w-4 text-primary" />
                            <p className="font-semibold">{operatorName}</p>
                            {extraInfo && (
                              <Badge variant="secondary" className="text-xs">{extraInfo}</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{result.stops}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-primary">{result.price}</p>
                          <p className="text-xs text-muted-foreground">per person</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-border">
                        <div>
                          <p className="text-sm font-medium">{result.departure}</p>
                          <p className="text-xs text-muted-foreground">Departure</p>
                        </div>
                        <div className="flex-1 mx-4">
                          <div className="h-px bg-border relative">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2">
                              <p className="text-xs text-muted-foreground">{result.duration}</p>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{result.arrival}</p>
                          <p className="text-xs text-muted-foreground">Arrival</p>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        )}

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
