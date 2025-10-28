import { Search, TrendingUp, MapPin, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import BottomNav from "@/components/BottomNav";
import welcomeImage from "@/assets/welcome-travel.jpg";

const destinations = [
  { name: "Paris, France", type: "City", rating: 4.8, image: welcomeImage },
  { name: "Tokyo, Japan", type: "City", rating: 4.9, image: welcomeImage },
  { name: "Dubai, UAE", type: "City", rating: 4.7, image: welcomeImage },
  { name: "London, UK", type: "City", rating: 4.6, image: welcomeImage },
];

const trendingDestinations = [
  "Bali, Indonesia",
  "Santorini, Greece",
  "Maldives",
  "Iceland",
];

const Explore = () => {
  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header with Search */}
      <header className="bg-card border-b border-border p-4 space-y-4">
        <div>
          <h1 className="text-2xl font-bold">Explore</h1>
          <p className="text-sm text-muted-foreground">Discover your next adventure</p>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search destinations, hotels, activities..."
            className="pl-9"
          />
        </div>
      </header>

      <main className="p-4 space-y-6">
        {/* Trending Now */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h2 className="font-bold text-lg">Trending Now</h2>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {trendingDestinations.map((dest, i) => (
              <Badge
                key={i}
                variant="secondary"
                className="px-4 py-2 text-sm whitespace-nowrap cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {dest}
              </Badge>
            ))}
          </div>
        </div>

        {/* Popular Destinations */}
        <div className="space-y-3">
          <h2 className="font-bold text-lg">Popular Destinations</h2>
          <div className="grid gap-4">
            {destinations.map((dest, i) => (
              <Card
                key={i}
                className="overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
              >
                <div className="flex gap-3">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="w-32 h-32 object-cover"
                  />
                  <div className="flex-1 p-3 flex flex-col justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{dest.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {dest.type}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="h-4 w-4 fill-primary text-primary" />
                      <span className="font-medium">{dest.rating}</span>
                      <span className="text-muted-foreground">(2.5k reviews)</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-3">
          <h2 className="font-bold text-lg">Explore by Category</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { name: "Beaches", emoji: "🏖️" },
              { name: "Mountains", emoji: "⛰️" },
              { name: "Cities", emoji: "🏙️" },
              { name: "Adventures", emoji: "🎒" },
            ].map((category, i) => (
              <Card
                key={i}
                className="p-6 text-center cursor-pointer hover:shadow-lg transition-all hover:scale-105"
              >
                <div className="text-4xl mb-2">{category.emoji}</div>
                <p className="font-semibold">{category.name}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Travel Tips */}
        <Card className="p-4 bg-accent/50">
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold mb-2">Travel Tip</h3>
              <p className="text-sm text-muted-foreground">
                Book flights 6-8 weeks in advance for the best deals. Tuesday and Wednesday are typically the cheapest days to fly.
              </p>
            </div>
          </div>
        </Card>
      </main>

      <BottomNav />
    </div>
  );
};

export default Explore;
