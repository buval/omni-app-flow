-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles RLS policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Create trips table
CREATE TABLE public.trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  destination TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'active', 'completed', 'cancelled')),
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own trips"
  ON public.trips FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own trips"
  ON public.trips FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own trips"
  ON public.trips FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own trips"
  ON public.trips FOR DELETE
  USING (auth.uid() = user_id);

-- Create flights table
CREATE TABLE public.flights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  flight_number TEXT NOT NULL,
  airline TEXT NOT NULL,
  departure_airport TEXT NOT NULL,
  arrival_airport TEXT NOT NULL,
  departure_time TIMESTAMPTZ NOT NULL,
  arrival_time TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'delayed', 'cancelled', 'completed')),
  gate TEXT,
  terminal TEXT,
  seat TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.flights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view flights for their trips"
  ON public.flights FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.trips 
    WHERE trips.id = flights.trip_id 
    AND trips.user_id = auth.uid()
  ));

CREATE POLICY "Users can create flights for their trips"
  ON public.flights FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.trips 
    WHERE trips.id = flights.trip_id 
    AND trips.user_id = auth.uid()
  ));

CREATE POLICY "Users can update flights for their trips"
  ON public.flights FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.trips 
    WHERE trips.id = flights.trip_id 
    AND trips.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete flights for their trips"
  ON public.flights FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.trips 
    WHERE trips.id = flights.trip_id 
    AND trips.user_id = auth.uid()
  ));

-- Create hotels table
CREATE TABLE public.hotels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  address TEXT,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  confirmation_number TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.hotels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view hotels for their trips"
  ON public.hotels FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.trips 
    WHERE trips.id = hotels.trip_id 
    AND trips.user_id = auth.uid()
  ));

CREATE POLICY "Users can create hotels for their trips"
  ON public.hotels FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.trips 
    WHERE trips.id = hotels.trip_id 
    AND trips.user_id = auth.uid()
  ));

CREATE POLICY "Users can update hotels for their trips"
  ON public.hotels FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.trips 
    WHERE trips.id = hotels.trip_id 
    AND trips.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete hotels for their trips"
  ON public.hotels FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.trips 
    WHERE trips.id = hotels.trip_id 
    AND trips.user_id = auth.uid()
  ));

-- Create border_info table (public data)
CREATE TABLE public.border_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country TEXT NOT NULL UNIQUE,
  visa_required BOOLEAN DEFAULT false,
  visa_type TEXT,
  visa_processing_time TEXT,
  customs_info TEXT,
  travel_alerts TEXT,
  currency TEXT,
  language TEXT,
  timezone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.border_info ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view border info"
  ON public.border_info FOR SELECT
  USING (true);

-- Create travel_tips table (public data)
CREATE TABLE public.travel_tips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  destination TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('transport', 'luggage', 'weather', 'wifi', 'currency', 'general')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.travel_tips ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view travel tips"
  ON public.travel_tips FOR SELECT
  USING (true);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  trip_id UUID REFERENCES public.trips(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info' CHECK (type IN ('info', 'warning', 'alert', 'success')),
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notifications"
  ON public.notifications FOR DELETE
  USING (auth.uid() = user_id);

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_trips_updated_at
  BEFORE UPDATE ON public.trips
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_border_info_updated_at
  BEFORE UPDATE ON public.border_info
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();