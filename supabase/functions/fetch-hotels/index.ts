import { corsHeaders } from '../_shared/cors.ts';

interface HotelRequest {
  city: string;
  lat: number;
  lon: number;
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
        
        apiHotels = data.map((place: any, index: number) => ({
          id: place.xid || `hotel-${index}`,
          name: place.name || `Hotel ${index + 1}`,
          image: '/placeholder.svg',
          price: Math.floor(Math.random() * (300 - 80) + 80),
          rating: (Math.random() * (5 - 3.5) + 3.5).toFixed(1),
          location: city,
          amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant'].slice(0, Math.floor(Math.random() * 3) + 2),
          description: `Beautiful hotel in ${city}`,
          distance: place.dist ? `${(place.dist / 1000).toFixed(1)}km from center` : 'City center'
        }));
      } else {
        console.log('API request failed with status:', response.status);
      }
    } catch (apiError) {
      console.log('API fetch error (using fallback data):', apiError);
    }

    // Use API data if available, otherwise use sample data
    const finalHotels = apiHotels.length > 0 ? apiHotels : [
      {
        id: '1',
        name: `Grand Hotel ${city}`,
        image: '/placeholder.svg',
        price: 120,
        rating: '4.5',
        location: city,
        amenities: ['WiFi', 'Pool', 'Restaurant'],
        description: `Luxury accommodation in the heart of ${city}`,
        distance: 'City center'
      },
      {
        id: '2',
        name: `${city} Plaza`,
        image: '/placeholder.svg',
        price: 95,
        rating: '4.2',
        location: city,
        amenities: ['WiFi', 'Gym', 'Bar'],
        description: `Modern hotel with excellent facilities in ${city}`,
        distance: '0.5km from center'
      },
      {
        id: '3',
        name: `Central ${city} Inn`,
        image: '/placeholder.svg',
        price: 85,
        rating: '4.0',
        location: city,
        amenities: ['WiFi', 'Breakfast'],
        description: `Comfortable and affordable stay in ${city}`,
        distance: '1km from center'
      }
    ];

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
