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
