import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { radius = 50000, limit = 10, kinds = 'interesting_places,tourist_facilities' } = await req.json();
    const apiKey = Deno.env.get('OPENTRIPMAP_API_KEY');

    if (!apiKey) {
      throw new Error('OpenTripMap API key not configured');
    }

    console.log('Fetching destinations from OpenTripMap');

    // Popular cities coordinates to fetch from
    const cities = [
      { name: 'Paris', lat: 48.8566, lon: 2.3522, country: 'France' },
      { name: 'Tokyo', lat: 35.6762, lon: 139.6503, country: 'Japan' },
      { name: 'Dubai', lat: 25.2048, lon: 55.2708, country: 'UAE' },
      { name: 'London', lat: 51.5074, lon: -0.1278, country: 'UK' },
      { name: 'New York', lat: 40.7128, lon: -74.0060, country: 'USA' },
      { name: 'Bali', lat: -8.3405, lon: 115.0920, country: 'Indonesia' },
      { name: 'Rome', lat: 41.9028, lon: 12.4964, country: 'Italy' },
      { name: 'Barcelona', lat: 41.3851, lon: 2.1734, country: 'Spain' },
      { name: 'Santorini', lat: 36.3932, lon: 25.4615, country: 'Greece' },
      { name: 'Maldives', lat: 3.2028, lon: 73.2207, country: 'Maldives' },
      { name: 'Iceland', lat: 64.1466, lon: -21.9426, country: 'Iceland' },
      { name: 'Swiss Alps', lat: 46.5197, lon: 7.9869, country: 'Switzerland' },
      { name: 'Machu Picchu', lat: -13.1631, lon: -72.5450, country: 'Peru' },
      { name: 'Sydney', lat: -33.8688, lon: 151.2093, country: 'Australia' },
      { name: 'Singapore', lat: 1.3521, lon: 103.8198, country: 'Singapore' },
      { name: 'Bangkok', lat: 13.7563, lon: 100.5018, country: 'Thailand' },
      { name: 'Istanbul', lat: 41.0082, lon: 28.9784, country: 'Turkey' },
      { name: 'Amsterdam', lat: 52.3676, lon: 4.9041, country: 'Netherlands' },
      { name: 'Rio de Janeiro', lat: -22.9068, lon: -43.1729, country: 'Brazil' },
      { name: 'Prague', lat: 50.0755, lon: 14.4378, country: 'Czech Republic' },
    ];

    const destinationsPromises = cities.slice(0, limit).map(async (city) => {
      const url = `https://api.opentripmap.com/0.1/en/places/radius?radius=${radius}&lon=${city.lon}&lat=${city.lat}&kinds=${kinds}&limit=5&apikey=${apiKey}`;
      
      console.log(`Fetching places for ${city.name}`);
      const response = await fetch(url);
      
      if (!response.ok) {
        console.error(`Failed to fetch places for ${city.name}:`, response.status);
        return null;
      }

      const places = await response.json();
      
      // Get image for the main place if available
      let imageUrl = null;
      if (places.length > 0 && places[0].xid) {
        const detailUrl = `https://api.opentripmap.com/0.1/en/places/xid/${places[0].xid}?apikey=${apiKey}`;
        const detailResponse = await fetch(detailUrl);
        if (detailResponse.ok) {
          const details = await detailResponse.json();
          imageUrl = details.preview?.source || details.image || null;
        }
      }

      return {
        name: city.name,
        country: city.country,
        lat: city.lat,
        lon: city.lon,
        places_count: places.length,
        image: imageUrl,
        rating: (Math.random() * 0.5 + 4.5).toFixed(1), // Mock rating 4.5-5.0
      };
    });

    const destinations = (await Promise.all(destinationsPromises)).filter(d => d !== null);

    console.log(`Successfully fetched ${destinations.length} destinations`);

    return new Response(JSON.stringify({ destinations }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in fetch-destinations function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
