import { useEffect, useState, useRef } from "react";
import { Bell, AlertCircle, ChevronRight, Plane, Hotel, MapPin, Plus, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import heroImage from "@/assets/hero-travel.jpg";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { useCitySearch } from "@/hooks/useCitySearch";
import HotelDetailsModal from "@/components/HotelDetailsModal";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [trips, setTrips] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState<any>(null);
  const [cityQuery, setCityQuery] = useState("");
  const [cityPopoverOpen, setCityPopoverOpen] = useState(false);
  const [promotions, setPromotions] = useState<any[]>([]);
  const [loadingHotels, setLoadingHotels] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState<any>(null);
  const [hotelModalOpen, setHotelModalOpen] = useState(false);
  const { cities, loading: citiesLoading } = useCitySearch(cityQuery);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (cityPopoverOpen) {
      // Ensure the input keeps focus when the popover opens
      inputRef.current?.focus();
    }
  }, [cityPopoverOpen]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();
      
      setProfile(profileData);

      const { data: tripsData } = await supabase
        .from('trips')
        .select('*, flights(*), hotels(*)')
        .eq('user_id', user?.id)
        .eq('status', 'upcoming')
        .order('start_date', { ascending: true })
        .limit(3);
      
      setTrips(tripsData || []);

      const { data: notificationsData } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user?.id)
        .eq('is_read', false)
        .order('created_at', { ascending: false })
        .limit(3);
      
      setNotifications(notificationsData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCitySelect = async (city: any) => {
    setSelectedCity(city);
    setCityQuery("");
    setCityPopoverOpen(false);
    setLoadingHotels(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('fetch-hotels', {
        body: {
          city: city.name,
          lat: parseFloat(city.lat || '0'),
          lon: parseFloat(city.lon || '0')
        }
      });

      if (error) throw error;
      
      setPromotions(data.hotels || []);
    } catch (error) {
      console.error('Error fetching hotels:', error);
      setPromotions([]);
    } finally {
      setLoadingHotels(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="relative h-48 overflow-hidden">
        <img src={heroImage} alt="Travel" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-transparent" />
        <div className="absolute top-0 left-0 right-0 p-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white drop-shadow-lg">
              Welcome, {profile?.full_name?.split(' ')[0] || 'Traveler'}
            </h1>
            <button className="p-2 rounded-full bg-white/20 backdrop-blur-md relative">
              <Bell className="h-6 w-6 text-white" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-destructive text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="px-4 pt-4 space-y-6">
        {/* Important Notifications */}
        {notifications.length > 0 && (
          <Card className="p-4 border-l-4 border-l-primary shadow-lg bg-card">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <h3 className="font-semibold">Important Notifications</h3>
                <div className="space-y-2 text-sm">
                  {notifications.map((notif) => (
                    <div key={notif.id} className="flex items-start gap-2">
                      <span className="text-muted-foreground">•</span>
                      <span>{notif.message}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Upcoming Trip */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Your Upcoming Trips</h2>
          </div>

          {trips.length === 0 ? (
            <Card className="p-8 text-center">
              <Plane className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-semibold mb-2">No trips planned yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Start planning your next adventure!
              </p>
              <Button
                variant="hero"
                onClick={() => navigate("/itinerary")}
              >
                <Plus className="mr-2 h-4 w-4" />
                Plan Your First Trip
              </Button>
            </Card>
          ) : (
            trips.map((trip) => (
              <Card 
                key={trip.id}
                className="overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                onClick={() => navigate("/trip-details")}
              >
                <div className="relative h-48">
                  <img 
                    src={trip.image_url || heroImage} 
                    alt={trip.destination} 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <Badge className="mb-2 bg-primary text-primary-foreground">{trip.status}</Badge>
                    <h3 className="text-2xl font-bold">{trip.destination}</h3>
                    <p className="text-sm text-white/90">
                      {new Date(trip.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(trip.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  {trip.flights?.[0] && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Plane className="h-4 w-4" />
                      <span>Flight {trip.flights[0].flight_number} • {trip.flights[0].departure_airport} to {trip.flights[0].arrival_airport}</span>
                    </div>
                  )}
                  {trip.hotels?.[0] && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Hotel className="h-4 w-4" />
                      <span>{trip.hotels[0].name}</span>
                    </div>
                  )}
                  <Button variant="hero" className="w-full mt-2">
                    View Trip Details
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Schedule Another Trip */}
        <Button 
          variant="outline" 
          className="w-full" 
          size="lg"
          onClick={() => navigate("/itinerary")}
        >
          <MapPin className="mr-2 h-5 w-5" />
          {trips.length === 0 ? 'Plan Your First Trip' : 'Schedule Another Trip'}
        </Button>

        {/* City Selector */}
        <div className="space-y-3">
          <h2 className="text-xl font-bold">Explore Hotel Promotions</h2>
          <Popover open={cityPopoverOpen} onOpenChange={setCityPopoverOpen}>
            <PopoverTrigger asChild>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none z-10" />
                <Input
                  ref={inputRef}
                  placeholder="Select a city..."
                  aria-label="Select a city"
                  value={selectedCity ? `${selectedCity.name}, ${selectedCity.country}` : cityQuery}
                  onChange={(e) => {
                    setCityQuery(e.target.value);
                    setSelectedCity(null);
                    setCityPopoverOpen(true);
                  }}
                  onFocus={() => setCityPopoverOpen(true)}
                  className="pl-10 text-foreground"
                />
              </div>
            </PopoverTrigger>
            <PopoverContent className="z-50 bg-popover border w-[var(--radix-popover-trigger-width)] p-0" align="start" onOpenAutoFocus={(e) => e.preventDefault()}>
              <div className="max-h-[300px] overflow-y-auto">
                {citiesLoading ? (
                  <div className="p-4 text-sm text-muted-foreground text-center">
                    Searching cities...
                  </div>
                ) : cities.length > 0 ? (
                  cities.map((city) => (
                    <button
                      key={city.id}
                      className="w-full px-4 py-3 text-left hover:bg-accent transition-colors border-b last:border-b-0"
                      onClick={() => handleCitySelect(city)}
                    >
                      <div className="font-medium">{city.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {city.region ? `${city.region}, ${city.country}` : city.country}
                      </div>
                    </button>
                  ))
                ) : cityQuery ? (
                  <div className="p-4 text-sm text-muted-foreground text-center">
                    No cities found
                  </div>
                ) : (
                  <div className="p-4 text-sm text-muted-foreground text-center">
                    Start typing to search cities
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Hotels - Only visible after city selection */}
        {selectedCity && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Hotels in {selectedCity.name}</h2>
              <Badge variant="secondary">{promotions.length} properties</Badge>
            </div>
            
            {loadingHotels ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : promotions.length > 0 ? (
              <div className="space-y-3">
                {promotions.map((hotel) => (
                  <Card 
                    key={hotel.id} 
                    className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
                    onClick={() => {
                      setSelectedHotel(hotel);
                      setHotelModalOpen(true);
                    }}
                  >
                    <div className="flex gap-3">
                      <div className="relative w-32 h-32 flex-shrink-0">
                        <img 
                          src={hotel.image} 
                          alt={hotel.name} 
                          className="w-full h-full object-cover"
                        />
                        {hotel.originalPrice && (
                          <Badge className="absolute top-2 left-2 bg-destructive text-destructive-foreground">
                            {Math.round(((hotel.originalPrice - hotel.price) / hotel.originalPrice) * 100)}% OFF
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex-1 p-3 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between mb-1">
                            <div>
                              <h3 className="font-semibold line-clamp-1">{hotel.name}</h3>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                                <MapPin className="h-3 w-3" />
                                <span className="line-clamp-1">{hotel.distance}</span>
                              </div>
                            </div>
                            {hotel.stars && (
                              <Badge variant="outline" className="ml-2">
                                {'⭐'.repeat(hotel.stars)}
                              </Badge>
                            )}
                          </div>
                          
                          <div className="flex flex-wrap gap-1 mt-2">
                            {hotel.amenities?.slice(0, 3).map((amenity: string) => (
                              <Badge key={amenity} variant="secondary" className="text-xs">
                                {amenity}
                              </Badge>
                            ))}
                            {hotel.amenities?.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{hotel.amenities.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-end justify-between mt-2">
                          <div className="flex items-center gap-1">
                            <div className="bg-primary text-primary-foreground px-1.5 py-0.5 rounded text-xs font-bold">
                              {hotel.rating}
                            </div>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`h-3 w-3 ${i < Math.floor(parseFloat(hotel.rating)) ? 'fill-primary text-primary' : 'text-muted'}`} 
                                />
                              ))}
                            </div>
                            <span className="text-xs text-muted-foreground">
                              ({hotel.reviewCount})
                            </span>
                          </div>
                          
                          <div className="text-right">
                            {hotel.originalPrice && (
                              <p className="text-xs text-muted-foreground line-through">
                                ${hotel.originalPrice}
                              </p>
                            )}
                            <div className="flex items-baseline gap-1">
                              <span className="text-xl font-bold text-primary">${hotel.price}</span>
                              <span className="text-xs text-muted-foreground">/night</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">No hotels found</p>
            )}
          </div>
        )}
      </main>

      <HotelDetailsModal 
        hotel={selectedHotel}
        open={hotelModalOpen}
        onClose={() => setHotelModalOpen(false)}
      />

      <BottomNav />
    </div>
  );
};

export default Home;
