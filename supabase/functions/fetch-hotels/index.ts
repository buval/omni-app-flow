import { corsHeaders } from '../_shared/cors.ts';

interface HotelRequest {
  city: string;
  lat: number;
  lon: number;
}

async function fetchHotelImage(hotelName: string): Promise<string> {
  try {
    // Use Unsplash API for real hotel images (free, no API key needed for basic use)
    const response = await fetch(
      `https://source.unsplash.com/800x600/?hotel,${encodeURIComponent(hotelName)}`
    );
    return response.url;
  } catch (error) {
    console.log('Failed to fetch hotel image:', error);
    return '/placeholder.svg';
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { city, lat, lon }: HotelRequest = await req.json();
    
    console.log('Fetching hotels for:', city, lat, lon);

    let apiHotels: any[] = [];

    // Try to fetch from OpenTripMap API, but don't fail if it doesn't work
    try {
      const radius = 5000;
      const response = await fetch(
        `https://api.opentripmap.com/0.1/en/places/radius?radius=${radius}&lon=${lon}&lat=${lat}&kinds=accomodations&format=json&limit=10`
      );

      console.log('API response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('API returned data:', data.length, 'places');
        
        // Fetch images for hotels in parallel
        const hotelsWithImages = await Promise.all(
          data.slice(0, 8).map(async (place: any, index: number) => {
            const hotelName = place.name || `Hotel ${index + 1}`;
            const basePrice = Math.floor(Math.random() * (300 - 80) + 80);
            
            return {
              id: place.xid || `hotel-${index}`,
              name: hotelName,
              image: await fetchHotelImage(hotelName),
              price: basePrice,
              originalPrice: Math.floor(basePrice * 1.3),
              rating: (Math.random() * (1) + 4).toFixed(1),
              reviewCount: Math.floor(Math.random() * 2000) + 100,
              location: city,
              address: place.address || `${city} City Center`,
              amenities: ['Free WiFi', 'Swimming Pool', 'Spa & Wellness', 'Restaurant', 'Bar', 'Gym', 'Room Service', 'Airport Shuttle']
                .sort(() => 0.5 - Math.random())
                .slice(0, Math.floor(Math.random() * 4) + 4),
              description: `Experience luxury and comfort at ${hotelName}. Located in the heart of ${city}, this property offers modern amenities and exceptional service.`,
              distance: place.dist ? `${(place.dist / 1000).toFixed(1)}km from center` : 'City center',
              stars: Math.floor(Math.random() * 2) + 3,
              roomTypes: [
                { type: 'Standard Room', price: basePrice, available: Math.floor(Math.random() * 5) + 1 },
                { type: 'Deluxe Room', price: Math.floor(basePrice * 1.3), available: Math.floor(Math.random() * 3) + 1 },
                { type: 'Suite', price: Math.floor(basePrice * 1.8), available: Math.floor(Math.random() * 2) + 1 }
              ],
              features: ['24/7 Front Desk', 'Non-smoking rooms', 'Family rooms', 'Air conditioning', 'Safe', 'Heating'],
              checkIn: '14:00',
              checkOut: '12:00',
              cancellationPolicy: 'Free cancellation until 24 hours before check-in'
            };
          })
        );
        
        apiHotels = hotelsWithImages;
      } else {
        console.log('API request failed with status:', response.status);
      }
    } catch (apiError) {
      console.log('API fetch error (using fallback data):', apiError);
    }

    // Use API data if available, otherwise use sample data
    const finalHotels = apiHotels.length > 0 ? apiHotels : await Promise.all([
      {
        id: '1',
        name: `Grand Hotel ${city}`,
        image: await fetchHotelImage(`Grand Hotel ${city}`),
        price: 120,
        originalPrice: 156,
        rating: '4.5',
        reviewCount: 1243,
        location: city,
        address: `${city} City Center`,
        amenities: ['Free WiFi', 'Swimming Pool', 'Restaurant', 'Bar', 'Spa & Wellness', 'Gym'],
        description: `Luxury accommodation in the heart of ${city}`,
        distance: 'City center',
        stars: 4,
        roomTypes: [
          { type: 'Standard Room', price: 120, available: 3 },
          { type: 'Deluxe Room', price: 156, available: 2 },
          { type: 'Suite', price: 216, available: 1 }
        ],
        features: ['24/7 Front Desk', 'Non-smoking rooms', 'Air conditioning'],
        checkIn: '14:00',
        checkOut: '12:00',
        cancellationPolicy: 'Free cancellation until 24 hours before check-in'
      },
      {
        id: '2',
        name: `${city} Plaza`,
        image: await fetchHotelImage(`${city} Plaza`),
        price: 95,
        originalPrice: 124,
        rating: '4.2',
        reviewCount: 856,
        location: city,
        address: `${city} Downtown`,
        amenities: ['Free WiFi', 'Gym', 'Bar', 'Room Service'],
        description: `Modern hotel with excellent facilities in ${city}`,
        distance: '0.5km from center',
        stars: 4,
        roomTypes: [
          { type: 'Standard Room', price: 95, available: 4 },
          { type: 'Deluxe Room', price: 124, available: 2 }
        ],
        features: ['24/7 Front Desk', 'Family rooms', 'Safe'],
        checkIn: '15:00',
        checkOut: '11:00',
        cancellationPolicy: 'Free cancellation until 48 hours before check-in'
      },
      {
        id: '3',
        name: `Central ${city} Inn`,
        image: await fetchHotelImage(`Central ${city} Inn`),
        price: 85,
        originalPrice: 111,
        rating: '4.0',
        reviewCount: 564,
        location: city,
        address: `${city} Center`,
        amenities: ['Free WiFi', 'Breakfast', 'Parking'],
        description: `Comfortable and affordable stay in ${city}`,
        distance: '1km from center',
        stars: 3,
        roomTypes: [
          { type: 'Standard Room', price: 85, available: 5 }
        ],
        features: ['Non-smoking rooms', 'Heating', 'Safe'],
        checkIn: '14:00',
        checkOut: '10:00',
        cancellationPolicy: 'Free cancellation until 24 hours before check-in'
      }
    ].map(async (hotel) => ({ ...hotel, image: await fetchHotelImage(hotel.name) })));

    console.log('Returning hotels:', finalHotels.length);

    return new Response(
      JSON.stringify({ hotels: finalHotels }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    );
  } catch (error) {
    console.error('Error fetching hotels:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});
