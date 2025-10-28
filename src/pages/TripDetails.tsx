import { ChevronLeft, Plane, Hotel, Car, Luggage, Download } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import { Separator } from "@/components/ui/separator";

const TripDetails = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="flex items-center gap-3 p-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-accent rounded-full transition-colors"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <div>
            <h1 className="text-xl font-bold">Trip Details</h1>
            <p className="text-sm text-muted-foreground">Vancouver, March 2023</p>
          </div>
        </div>
      </header>

      <main className="p-4 space-y-6">
        {/* Flight Information */}
        <Card className="overflow-hidden">
          <div className="bg-primary/10 p-4 flex items-center gap-3">
            <div className="p-3 rounded-full bg-primary/20">
              <Plane className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Flight Information</h2>
              <p className="text-sm text-muted-foreground">Flight AC118</p>
            </div>
          </div>
          
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Departing</p>
                <p className="font-semibold">March 31, 2023</p>
                <p className="text-sm text-primary">08:00 AM</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Route</p>
                <p className="font-semibold">Dubai → Vancouver</p>
                <Badge variant="secondary" className="mt-1">Direct</Badge>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Check-In</p>
                <p className="font-semibold">Before 7:00 AM</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Boarding Time</p>
                <p className="font-semibold">7:15 AM</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Seat</p>
                <p className="font-semibold">A01</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Operated by</p>
                <p className="font-semibold">Air Canada</p>
              </div>
            </div>

            <Button variant="hero" className="w-full mt-4">
              <Download className="mr-2 h-4 w-4" />
              Download Boarding Pass
            </Button>
          </div>
        </Card>

        {/* Accommodation */}
        <Card className="overflow-hidden">
          <div className="bg-accent p-4 flex items-center gap-3">
            <div className="p-3 rounded-full bg-background">
              <Hotel className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Accommodation</h2>
              <p className="text-sm text-muted-foreground">7 nights</p>
            </div>
          </div>
          
          <div className="p-4 space-y-3">
            <div>
              <p className="font-semibold text-lg">Fairmont Waterfront</p>
              <p className="text-sm text-muted-foreground">900 Canada Pl, Vancouver</p>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Check-In</p>
                <p className="font-semibold">March 31, 3:00 PM</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Check-Out</p>
                <p className="font-semibold">April 7, 11:00 AM</p>
              </div>
            </div>

            <Button variant="outline" className="w-full">
              View Hotel Details
            </Button>
          </div>
        </Card>

        {/* Transportation */}
        <Card className="p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Car className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-lg font-bold">Transportation</h2>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Airport Transfer</span>
              <span className="font-medium">Booked</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Rental Car</span>
              <Button variant="link" className="h-auto p-0">Add Service</Button>
            </div>
          </div>
        </Card>

        {/* Luggage Requirements */}
        <Card className="p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Luggage className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-lg font-bold">Luggage Requirements</h2>
          </div>
          
          <div className="space-y-3 text-sm">
            <div>
              <p className="font-medium mb-1">Checked Baggage</p>
              <p className="text-muted-foreground">2 pieces, max 23kg each</p>
            </div>
            <div>
              <p className="font-medium mb-1">Carry-On</p>
              <p className="text-muted-foreground">1 piece, max 10kg</p>
            </div>
          </div>
        </Card>
      </main>

      <BottomNav />
    </div>
  );
};

export default TripDetails;
