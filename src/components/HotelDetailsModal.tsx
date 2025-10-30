import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Star, MapPin, Check, Clock, Ban, Wifi, Users, Coffee } from "lucide-react";

interface HotelDetailsModalProps {
  hotel: any;
  open: boolean;
  onClose: () => void;
}

const HotelDetailsModal = ({ hotel, open, onClose }: HotelDetailsModalProps) => {
  if (!hotel) return null;

  const amenityIcons: any = {
    'Free WiFi': Wifi,
    'Swimming Pool': Users,
    'Restaurant': Coffee,
    'Bar': Coffee,
    'Gym': Users,
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{hotel.name}</DialogTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{hotel.address}</span>
            <span>•</span>
            <span>{hotel.distance}</span>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Image */}
          <div className="relative h-64 rounded-lg overflow-hidden">
            <img 
              src={hotel.image} 
              alt={hotel.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4">
              <Badge className="bg-primary text-primary-foreground">
                {'⭐'.repeat(hotel.stars)}
              </Badge>
            </div>
          </div>

          {/* Rating & Reviews */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <div className="bg-primary text-primary-foreground px-2 py-1 rounded font-bold">
                {hotel.rating}
              </div>
              <div className="flex flex-col">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-4 w-4 ${i < Math.floor(parseFloat(hotel.rating)) ? 'fill-primary text-primary' : 'text-muted'}`} 
                    />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">{hotel.reviewCount} reviews</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold mb-2">About this property</h3>
            <p className="text-muted-foreground">{hotel.description}</p>
          </div>

          <Separator />

          {/* Amenities */}
          <div>
            <h3 className="font-semibold mb-3">Popular Amenities</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {hotel.amenities.map((amenity: string) => {
                const Icon = amenityIcons[amenity] || Check;
                return (
                  <div key={amenity} className="flex items-center gap-2 text-sm">
                    <Icon className="h-4 w-4 text-primary" />
                    <span>{amenity}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* Room Types */}
          <div>
            <h3 className="font-semibold mb-3">Room Options</h3>
            <div className="space-y-3">
              {hotel.roomTypes?.map((room: any) => (
                <div key={room.type} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium">{room.type}</h4>
                      <p className="text-sm text-muted-foreground">
                        {room.available} {room.available === 1 ? 'room' : 'rooms'} left at this price
                      </p>
                    </div>
                    <div className="text-right">
                      {hotel.originalPrice && (
                        <p className="text-sm text-muted-foreground line-through">
                          ${hotel.originalPrice}
                        </p>
                      )}
                      <p className="text-2xl font-bold text-primary">${room.price}</p>
                      <p className="text-xs text-muted-foreground">per night</p>
                    </div>
                  </div>
                  <Button className="w-full mt-2" variant="default">
                    Reserve Room
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Policies */}
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Clock className="h-4 w-4 text-primary" />
                <h4 className="font-medium">Check-in</h4>
              </div>
              <p className="text-sm text-muted-foreground">{hotel.checkIn}</p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Clock className="h-4 w-4 text-primary" />
                <h4 className="font-medium">Check-out</h4>
              </div>
              <p className="text-sm text-muted-foreground">{hotel.checkOut}</p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Ban className="h-4 w-4 text-primary" />
                <h4 className="font-medium">Cancellation</h4>
              </div>
              <p className="text-sm text-muted-foreground">{hotel.cancellationPolicy}</p>
            </div>
          </div>

          {/* Features */}
          {hotel.features && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold mb-3">Property Features</h3>
                <div className="flex flex-wrap gap-2">
                  {hotel.features.map((feature: string) => (
                    <Badge key={feature} variant="secondary">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HotelDetailsModal;
