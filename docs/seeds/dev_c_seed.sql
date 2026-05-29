-- Dev C seed data — fixed UUIDs for QR / public-profile development.
--
-- Run in Supabase Dashboard → SQL editor. Idempotent (uses ON CONFLICT).
-- Designed to work against the current profile/contacts/bikes shape (as of
-- v0.0.1-foundation). If Dev A reshapes any of these tables during Days 5-7,
-- this file must be updated to match — diff against src/lib/supabase/types.ts.
--
-- These fixtures bind to a synthetic auth.users row. Email-confirm trigger
-- (handle_new_user) will auto-create a profile for it; we then UPDATE the
-- profile to fill in test medical info.

-- ---- Test user ---------------------------------------------------------
INSERT INTO auth.users (id, email, email_confirmed_at, created_at, updated_at, raw_user_meta_data)
VALUES (
  'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
  'dev-c-test@motoil.local',
  now(),
  now(),
  now(),
  '{}'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- ---- Profile (handle_new_user trigger creates the row; we fill it in) --
UPDATE public.profiles SET
  full_name    = 'ישראל ישראלי',
  teudat_zehut = '000000000',
  blood_type   = 'O+',
  allergies    = ARRAY['פניצילין'],
  medications  = ARRAY[]::text[],
  conditions   = ARRAY['אסטמה'],
  kupat_holim  = 'clalit',
  locale       = 'he'
WHERE id = 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee';

-- Fallback insert in case the trigger didn't fire (e.g. seeding into a
-- project where the trigger was disabled).
INSERT INTO public.profiles (id, full_name, teudat_zehut, blood_type, allergies, medications, conditions, kupat_holim, locale)
VALUES (
  'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
  'ישראל ישראלי', '000000000', 'O+',
  ARRAY['פניצילין'], ARRAY[]::text[], ARRAY['אסטמה'],
  'clalit', 'he'
)
ON CONFLICT (id) DO NOTHING;

-- ---- Emergency contacts ------------------------------------------------
INSERT INTO public.emergency_contacts (id, user_id, name, phone, relation)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee', 'רות ישראלי', '+972501234567', 'אישה'),
  ('22222222-2222-2222-2222-222222222222', 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee', 'דני ישראלי', '+972527654321', 'אח')
ON CONFLICT (id) DO NOTHING;

-- ---- Bike --------------------------------------------------------------
INSERT INTO public.bikes (id, user_id, make, model, year, license_plate)
VALUES (
  '33333333-3333-3333-3333-333333333333',
  'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
  'Yamaha', 'MT-07', 2024, '12-345-67'
)
ON CONFLICT (id) DO NOTHING;

-- ---- Public token (the QR target) --------------------------------------
-- Fixed token so Dev C can hardcode it in dev. RN app will generate a fresh
-- one on user signup; this is purely a development convenience.
INSERT INTO public.public_tokens (id, user_id, token)
VALUES (
  '44444444-4444-4444-4444-444444444444',
  'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
  '55555555-5555-5555-5555-555555555555'
)
ON CONFLICT (id) DO NOTHING;

-- Verify with:
--   SELECT * FROM public.public_tokens WHERE user_id = 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee';
-- And exercise the Edge Function:
--   curl 'https://<ref>.functions.supabase.co/public-profile?token=55555555-5555-5555-5555-555555555555'
