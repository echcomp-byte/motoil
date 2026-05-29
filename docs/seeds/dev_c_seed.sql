-- Dev C seed data — fixed UUIDs for QR / public-profile development.
--
-- Run in Supabase Dashboard → SQL editor against the prod project.
-- Idempotent (ON CONFLICT). Designed to work against the current
-- profile/contacts/bikes shape (v0.0.1-foundation). If Dev A reshapes
-- any of these tables during Days 5-7, this file must be updated to
-- match — diff against src/lib/supabase/types.ts.
--
-- Per PM decision 2026-05-28: all dev/test rows live in prod under a
-- distinct UUID namespace so they are trivially identifiable and
-- removable. Namespace: 00000000-0000-0000-0000-XXXXXXXXXXXX
--
--   001         user / profile
--   1xx         emergency_contacts
--   2xx         bikes
--   3xx         public_tokens (row id)
--   4xx         public_tokens (token value — what goes in the QR URL)
--
-- Cleanup query for after MVP:
--   DELETE FROM public.public_tokens       WHERE id::text LIKE '00000000-0000-0000-0000-%';
--   DELETE FROM public.bikes               WHERE id::text LIKE '00000000-0000-0000-0000-%';
--   DELETE FROM public.emergency_contacts  WHERE id::text LIKE '00000000-0000-0000-0000-%';
--   DELETE FROM public.profiles            WHERE id::text LIKE '00000000-0000-0000-0000-%';
--   DELETE FROM auth.users                 WHERE id::text LIKE '00000000-0000-0000-0000-%';

-- ---- Test user ---------------------------------------------------------
INSERT INTO auth.users (id, email, email_confirmed_at, created_at, updated_at, raw_user_meta_data)
VALUES (
  '00000000-0000-0000-0000-000000000001',
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
WHERE id = '00000000-0000-0000-0000-000000000001';

-- Fallback insert in case the trigger didn't fire (e.g. seeding into a
-- project where the trigger was disabled).
INSERT INTO public.profiles (id, full_name, teudat_zehut, blood_type, allergies, medications, conditions, kupat_holim, locale)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'ישראל ישראלי', '000000000', 'O+',
  ARRAY['פניצילין'], ARRAY[]::text[], ARRAY['אסטמה'],
  'clalit', 'he'
)
ON CONFLICT (id) DO NOTHING;

-- ---- Emergency contacts ------------------------------------------------
-- priority: 0 = called first, 1 = second, etc. (migration 0002)
INSERT INTO public.emergency_contacts (id, user_id, name, phone, relation, priority)
VALUES
  ('00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000001', 'רות ישראלי', '+972501234567', 'אישה', 0),
  ('00000000-0000-0000-0000-000000000102', '00000000-0000-0000-0000-000000000001', 'דני ישראלי', '+972527654321', 'אח', 1)
ON CONFLICT (id) DO NOTHING;

-- ---- Bike --------------------------------------------------------------
-- is_primary: this seed user owns only one bike, so it is the primary.
-- Partial unique index (migration 0002) enforces ≤1 primary per user.
INSERT INTO public.bikes (id, user_id, make, model, year, license_plate, is_primary)
VALUES (
  '00000000-0000-0000-0000-000000000201',
  '00000000-0000-0000-0000-000000000001',
  'Yamaha', 'MT-07', 2024, '12-345-67', true
)
ON CONFLICT (id) DO NOTHING;

-- ---- Public token (the QR target) --------------------------------------
-- Fixed token so Dev C can hardcode it in dev. RN app will generate a fresh
-- one on user signup; this is purely a development convenience.
INSERT INTO public.public_tokens (id, user_id, token)
VALUES (
  '00000000-0000-0000-0000-000000000301',
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000401'
)
ON CONFLICT (id) DO NOTHING;

-- Verify with:
--   SELECT * FROM public.public_tokens WHERE user_id = '00000000-0000-0000-0000-000000000001';
-- And exercise the Edge Function:
--   curl 'https://<ref>.functions.supabase.co/public-profile?token=00000000-0000-0000-0000-000000000401'
