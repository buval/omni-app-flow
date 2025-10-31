import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Compass, LogIn } from "lucide-react";
import heroImage from "@/assets/hero-travel.jpg";

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

  return (
    <div className="min-h-screen bg-background">
      <div className="relative h-[60vh] overflow-hidden">
        <img
          src={heroImage}
          alt="Travel"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-background" />
        <div className="absolute inset-0 flex items-center justify-center text-center px-4">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold text-white">
              Discover Your Next Adventure
            </h1>
            <p className="text-lg md:text-xl text-white/90">
              Explore destinations, plan trips, and create memories
            </p>
          </div>
        </div>
      </div>

      <div className="container max-w-md mx-auto px-4 -mt-16 relative z-10">
        <Card className="p-6 space-y-4">
          <Button
            onClick={() => navigate("/explore")}
            size="lg"
            className="w-full"
            variant="default"
          >
            <Compass className="mr-2 h-5 w-5" />
            Explore as Guest
          </Button>
          
          <Button
            onClick={() => navigate("/login")}
            size="lg"
            className="w-full"
            variant="outline"
          >
            <LogIn className="mr-2 h-5 w-5" />
            Sign In
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Start exploring destinations or sign in to save your trips
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Index;
