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
        // Using GeoDB Cities API (free tier, no API key needed)
        const response = await fetch(
          `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${encodeURIComponent(query)}&limit=5&sort=-population`,
          {
            headers: {
              'X-RapidAPI-Key': 'demo', // Using demo key for basic functionality
              'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
            }
          }
        );
        
        if (!response.ok) {
          // Fallback to OpenStreetMap Nominatim (completely free)
          const nominatimResponse = await fetch(
            `https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(query)}&format=json&limit=5`,
            {
              headers: {
                'User-Agent': 'TravelApp/1.0'
              }
            }
          );
          const nominatimData = await nominatimResponse.json();
          const formattedCities = nominatimData.map((item: any, index: number) => ({
            id: index,
            name: item.name,
            country: item.display_name.split(',').pop()?.trim() || '',
            region: item.display_name.split(',')[1]?.trim(),
            lat: item.lat,
            lon: item.lon
          }));
          setCities(formattedCities);
        } else {
          const data = await response.json();
          const formattedCities = data.data?.map((city: any) => ({
            id: city.id,
            name: city.name,
            country: city.country,
            region: city.region,
            lat: city.latitude?.toString(),
            lon: city.longitude?.toString()
          })) || [];
          setCities(formattedCities);
        }
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
