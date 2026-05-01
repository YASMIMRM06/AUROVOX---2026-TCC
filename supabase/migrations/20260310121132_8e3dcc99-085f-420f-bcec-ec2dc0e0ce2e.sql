
-- Fix favorite_cards RLS: drop restrictive policies and recreate as permissive
DROP POLICY IF EXISTS "Users can delete their own favorites" ON public.favorite_cards;
DROP POLICY IF EXISTS "Users can insert their own favorites" ON public.favorite_cards;
DROP POLICY IF EXISTS "Users can view their own favorites" ON public.favorite_cards;

CREATE POLICY "Users can view their own favorites" ON public.favorite_cards FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own favorites" ON public.favorite_cards FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own favorites" ON public.favorite_cards FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Add more profile fields
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS date_of_birth date;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS gender text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS caregiver_name text DEFAULT '';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone text DEFAULT '';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS diagnosis text DEFAULT '';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS preferred_communication text DEFAULT '';

-- Create the update_updated_at trigger if missing
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
