import { useState, useEffect } from "react";

interface City {
  id: number;
  name: string;
  country: string;
  region?: string;
  lat?: string;
  lon?: string;
}

export const useCitySearch = (query: string) => {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.length < 2) {
      setCities([]);
      return;
    }

    const searchCities = async () => {
      setLoading(true);
      try {
        // Use OpenStreetMap Nominatim API (completely free, no API key needed)
        const nominatimResponse = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=10&addressdetails=1`,
          {
            headers: {
              'User-Agent': 'TravelApp/1.0'
            }
          }
        );

        if (!nominatimResponse.ok) {
          throw new Error('Failed to fetch cities');
        }

        const nominatimData = await nominatimResponse.json();
        
        // Filter for cities and towns only
        const cityResults = nominatimData.filter((item: any) => 
          ['city', 'town', 'village', 'municipality'].includes(item.type) ||
          ['city', 'town', 'village', 'municipality'].includes(item.addresstype)
        );

        const formattedCities = cityResults.map((item: any, index: number) => {
          // Extract city name and country from display_name
          const parts = item.display_name.split(',').map((p: string) => p.trim());
          const cityName = item.address?.city || item.address?.town || item.address?.village || item.name || parts[0];
          const country = item.address?.country || parts[parts.length - 1];
          const region = item.address?.state || item.address?.region || parts[1];

          return {
            id: item.place_id || index,
            name: cityName,
            country: country,
            region: region !== cityName ? region : undefined,
            lat: item.lat,
            lon: item.lon
          };
        });

        // Remove duplicates based on name and country
        const uniqueCities = formattedCities.filter((city: any, index: number, self: any[]) =>
          index === self.findIndex((c: any) => c.name === city.name && c.country === city.country)
        );

        setCities(uniqueCities);
      } catch (error) {
        console.error('Error fetching cities:', error);
        setCities([]);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(searchCities, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  return { cities, loading };
};
