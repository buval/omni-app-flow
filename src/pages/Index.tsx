import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Compass, LogIn, MapPin, Calendar, Users } from "lucide-react";
import heroImage from "@/assets/hero-travel.jpg";
import welcomeImage from "@/assets/welcome-travel.jpg";
import hotelImage from "@/assets/hotel.jpg";

const Index = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      navigate("/welcome");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const features = [
    {
      icon: MapPin,
      title: "Discover Destinations",
      description: "Explore amazing places around the world"
    },
    {
      icon: Calendar,
      title: "Plan Your Trip",
      description: "Create detailed itineraries day-by-day"
    },
    {
      icon: Users,
      title: "Share & Collaborate",
      description: "Share trips with friends and family"
    }
  ];

  const popularDestinations = [
    { name: "Santorini", country: "Greece", image: welcomeImage },
    { name: "Swiss Alps", country: "Switzerland", image: heroImage },
    { name: "Tokyo", country: "Japan", image: hotelImage },
    { name: "Maldives", country: "Maldives", image: welcomeImage },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-[70vh] overflow-hidden">
        <img
          src={heroImage}
          alt="Travel"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-background" />
        <div className="absolute inset-0 flex items-center justify-center text-center px-4">
          <div className="space-y-6 max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold text-white">
              Plan Your Dream Journey
            </h1>
            <p className="text-lg md:text-xl text-white/90">
              Discover amazing destinations, create detailed itineraries, and make unforgettable memories
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => navigate("/login")}
                size="lg"
                className="text-lg px-8"
              >
                Get Started
              </Button>
              <Button
                onClick={() => navigate("/explore")}
                size="lg"
                variant="outline"
                className="text-lg px-8 bg-white/10 backdrop-blur-sm text-white border-white/20 hover:bg-white/20"
              >
                <Compass className="mr-2 h-5 w-5" />
                Explore as Guest
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Everything You Need to Travel
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <Card key={i} className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <feature.icon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Popular Destinations */}
      <div className="container max-w-6xl mx-auto px-4 py-16 bg-accent/30">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Popular Destinations
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularDestinations.map((dest, i) => (
            <Card 
              key={i} 
              className="overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105"
              onClick={() => navigate("/explore")}
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 text-center">
                <h3 className="font-semibold text-lg">{dest.name}</h3>
                <p className="text-sm text-muted-foreground">{dest.country}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="container max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Ready to Start Your Adventure?
        </h2>
        <p className="text-lg text-muted-foreground mb-8">
          Join thousands of travelers planning their perfect trips with Travez
        </p>
        <Button
          onClick={() => navigate("/login")}
          size="lg"
          className="text-lg px-12"
        >
          <LogIn className="mr-2 h-5 w-5" />
          Sign In to Get Started
        </Button>
      </div>
    </div>
  );
};

export default Index;
