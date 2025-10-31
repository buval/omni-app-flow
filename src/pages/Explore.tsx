import { useState, useEffect } from "react";
import { Search, TrendingUp, MapPin, Star, Loader2, Clock, ExternalLink, Plane, Building, Palmtree, Mountain } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import BottomNav from "@/components/BottomNav";
import welcomeImage from "@/assets/welcome-travel.jpg";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Destination {
  name: string;
  country: string;
  lat: number;
  lon: number;
  places_count: number;
  image: string | null;
  rating: string;
  visaStatus?: 'free' | 'required' | 'on-arrival';
  stayDuration?: number;
  icon?: string;
}

// Mock visa data - can be replaced with real API later
const enrichWithVisaData = (destinations: Destination[]): Destination[] => {
  const visaData: Record<string, { visaStatus: 'free' | 'required' | 'on-arrival', stayDuration: number }> = {
    'Greece': { visaStatus: 'free', stayDuration: 90 },
    'Switzerland': { visaStatus: 'free', stayDuration: 90 },
    'Japan': { visaStatus: 'free', stayDuration: 90 },
    'Peru': { visaStatus: 'free', stayDuration: 180 },
    'Turkey': { visaStatus: 'required', stayDuration: 0 },
    'Maldives': { visaStatus: 'on-arrival', stayDuration: 30 },
    'Tanzania': { visaStatus: 'on-arrival', stayDuration: 90 },
    'France': { visaStatus: 'free', stayDuration: 90 },
  };

  return destinations.map(dest => ({
    ...dest,
    visaStatus: visaData[dest.country]?.visaStatus || 'free',
    stayDuration: visaData[dest.country]?.stayDuration || 90,
  }));
};

const getDestinationIcon = (name: string) => {
  const iconMap: Record<string, any> = {
    'beach': Palmtree,
    'island': Palmtree,
    'mountain': Mountain,
    'city': Building,
    'default': MapPin,
  };

  const lowerName = name.toLowerCase();
  if (lowerName.includes('beach') || lowerName.includes('island') || lowerName.includes('maldives')) return iconMap.beach;
  if (lowerName.includes('mountain') || lowerName.includes('alps') || lowerName.includes('machu')) return iconMap.mountain;
  if (lowerName.includes('city') || lowerName.includes('tokyo') || lowerName.includes('paris')) return iconMap.city;
  return iconMap.default;
};

const Explore = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [trendingDestinations, setTrendingDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [trendingLoading, setTrendingLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchDestinations();
    fetchTrendingDestinations();
  }, []);

  const fetchTrendingDestinations = async () => {
    try {
      setTrendingLoading(true);
      const { data, error } = await supabase.functions.invoke('fetch-destinations', {
        body: { limit: 4, radius: 30000 }
      });

      if (error) throw error;

      if (data?.destinations) {
        setTrendingDestinations(enrichWithVisaData(data.destinations));
      }
    } catch (error) {
      console.error('Error fetching trending destinations:', error);
    } finally {
      setTrendingLoading(false);
    }
  };

  const fetchDestinations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('fetch-destinations', {
        body: { limit: 9, radius: 50000 }
      });

      if (error) throw error;

      if (data?.destinations) {
        setDestinations(enrichWithVisaData(data.destinations));
      }
    } catch (error) {
      console.error('Error fetching destinations:', error);
      toast({
        title: "Error loading destinations",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getVisaBadge = (status?: 'free' | 'required' | 'on-arrival') => {
    switch (status) {
      case 'free':
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Visa Free</Badge>;
      case 'required':
        return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">Visa Required</Badge>;
      case 'on-arrival':
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Visa On Arrival (including eTA)</Badge>;
      default:
        return null;
    }
  };
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
        {/* Explore as Guest Banner */}
        <Card className="p-4 bg-primary/10 border-primary/20">
          <div className="flex items-center gap-3">
            <Plane className="h-6 w-6 text-primary" />
            <div>
              <h3 className="font-semibold">Explore as Guest</h3>
              <p className="text-sm text-muted-foreground">Browse destinations without signing in</p>
            </div>
          </div>
        </Card>

        {/* Trending Now with Icons */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h2 className="font-bold text-lg">Trending Now</h2>
          </div>
          {trendingLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {trendingDestinations.map((dest, i) => {
                const Icon = getDestinationIcon(dest.name);
                return (
                  <Card
                    key={i}
                    className="p-4 cursor-pointer hover:shadow-lg transition-all hover:scale-105"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">{dest.name}</p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span className="truncate">{dest.country}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Popular Destinations */}
        <div className="space-y-3">
          <h2 className="font-bold text-lg">Popular Destinations</h2>
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {destinations.map((dest, i) => (
                <Card
                  key={i}
                  className="overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                >
                  <div className="relative h-40">
                    <img
                      src={dest.image || welcomeImage}
                      alt={dest.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = welcomeImage;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-3 left-3">
                      <h3 className="font-bold text-white text-lg">{dest.name}</h3>
                      <div className="flex items-center gap-1 text-white/90 text-sm">
                        <MapPin className="h-3 w-3" />
                        <span>{dest.country}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3 space-y-2">
                    {getVisaBadge(dest.visaStatus)}
                    
                    {dest.stayDuration && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>Stay up to {dest.stayDuration} days</span>
                      </div>
                    )}
                    
                    <a 
                      href="#" 
                      className="flex items-center gap-1 text-sm text-primary hover:underline"
                      onClick={(e) => e.preventDefault()}
                    >
                      View official source
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </Card>
              ))}
            </div>
          )}
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
