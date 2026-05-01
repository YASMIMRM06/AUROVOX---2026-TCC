
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS blood_type text DEFAULT '',
  ADD COLUMN IF NOT EXISTS allergies text DEFAULT '',
  ADD COLUMN IF NOT EXISTS medications text DEFAULT '',
  ADD COLUMN IF NOT EXISTS emergency_contact text DEFAULT '',
  ADD COLUMN IF NOT EXISTS emergency_phone text DEFAULT '',
  ADD COLUMN IF NOT EXISTS address text DEFAULT '',
  ADD COLUMN IF NOT EXISTS institution text DEFAULT '',
  ADD COLUMN IF NOT EXISTS therapist_name text DEFAULT '',
  ADD COLUMN IF NOT EXISTS health_insurance text DEFAULT '',
  ADD COLUMN IF NOT EXISTS sensory_sensitivities text DEFAULT '',
  ADD COLUMN IF NOT EXISTS routine_notes text DEFAULT '';
