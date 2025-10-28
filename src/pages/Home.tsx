import { Bell, AlertCircle, ChevronRight, Plane, Hotel, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import heroImage from "@/assets/hero-travel.jpg";
import hotelImage from "@/assets/hotel.jpg";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="relative h-48 overflow-hidden">
        <img src={heroImage} alt="Travel" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-transparent" />
        <div className="absolute top-0 left-0 right-0 p-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white drop-shadow-lg">
              Welcome, Arash
            </h1>
            <button className="p-2 rounded-full bg-white/20 backdrop-blur-md">
              <Bell className="h-6 w-6 text-white" />
            </button>
          </div>
        </div>
      </header>

      <main className="px-4 -mt-8 space-y-6">
        {/* Important Notifications */}
        <Card className="p-4 border-l-4 border-l-primary shadow-lg bg-card">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <h3 className="font-semibold">Important Notifications</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-muted-foreground">•</span>
                  <span>Your flight is rescheduled. <button className="text-primary font-medium">View details</button></span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-muted-foreground">•</span>
                  <span>Vancouver: Extreme weather in Vancouver. <button className="text-primary font-medium">View details</button></span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Upcoming Trip */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Your Upcoming Trips</h2>
          </div>

          <Card 
            className="overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
            onClick={() => navigate("/trip-details")}
          >
            <div className="relative h-48">
              <img src={heroImage} alt="Vancouver" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <Badge className="mb-2 bg-primary text-primary-foreground">Upcoming</Badge>
                <h3 className="text-2xl font-bold">Vancouver</h3>
                <p className="text-sm text-white/90">March 31 - April 7, 2023</p>
              </div>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Plane className="h-4 w-4" />
                <span>Flight AC118 • Dubai to Vancouver</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Hotel className="h-4 w-4" />
                <span>Fairmont Waterfront</span>
              </div>
              <Button variant="hero" className="w-full mt-2">
                View Trip Details
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </Card>
        </div>

        {/* Schedule Another Trip */}
        <Button 
          variant="outline" 
          className="w-full" 
          size="lg"
          onClick={() => navigate("/itinerary")}
        >
          <MapPin className="mr-2 h-5 w-5" />
          Schedule Another Trip
        </Button>

        {/* Promotions */}
        <div className="space-y-3">
          <h2 className="text-xl font-bold">Promotions in Vancouver</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { name: "Fairmont Waterfront", discount: "20% OFF" },
              { name: "Pinnacle Hotel", discount: "15% OFF" },
              { name: "Fairmont Hotel", discount: "25% OFF" },
              { name: "Pan Pacific", discount: "30% OFF" },
            ].map((hotel, i) => (
              <Card key={i} className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                <img 
                  src={hotelImage} 
                  alt={hotel.name} 
                  className="w-full h-24 object-cover"
                />
                <div className="p-2">
                  <p className="text-sm font-medium truncate">{hotel.name}</p>
                  <Badge variant="secondary" className="mt-1 text-xs">{hotel.discount}</Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Home;
