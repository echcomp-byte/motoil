-- 0002_widget_snapshot_fields.sql
--
-- Adds the columns the lockscreen widget snapshot (Dev B, issue #2) consumes:
--   - bikes.is_primary           : marks exactly-one primary motorcycle per user
--   - emergency_contacts.priority: explicit display order for the first-N truncation
--
-- Forward-only. No backfill needed: defaults preserve the prior behaviour
-- (no bike is primary; all contacts compare equal in priority).
--
-- RLS: both tables already enforce user_id = auth.uid() on every operation.
-- This migration does not change RLS — new columns are reachable through
-- the same row-level policies.
--
-- Note for app code (PR #3+):
--   To switch the primary bike, demote the current primary FIRST, then promote
--   the new one — even within a single transaction. The partial unique index
--   below is checked row-by-row at write time, so a promote-before-demote
--   ordering momentarily has two primaries and raises a unique violation.

-- bikes -----------------------------------------------------------------------

ALTER TABLE public.bikes
  ADD COLUMN is_primary boolean NOT NULL DEFAULT false;

-- Exactly-one primary per user, enforced at the DB.
-- Partial index: only rows where is_primary=true contribute to uniqueness,
-- so any number of non-primary bikes can coexist for the same user.
CREATE UNIQUE INDEX bikes_one_primary_per_user
  ON public.bikes (user_id)
  WHERE is_primary = true;

-- emergency_contacts ----------------------------------------------------------

-- Lower priority = higher rank: 0 is called first, 1 second, etc.
-- Default 0 means existing rows all sort equal until the user re-orders.
ALTER TABLE public.emergency_contacts
  ADD COLUMN priority int NOT NULL DEFAULT 0;

-- A negative priority would never make sense and would never make it into the
-- snapshot — reject at the DB so a bug in app code surfaces immediately.
ALTER TABLE public.emergency_contacts
  ADD CONSTRAINT emergency_contacts_priority_nonneg CHECK (priority >= 0);

-- Index suffices for "list this user's contacts in priority order".
CREATE INDEX emergency_contacts_user_priority
  ON public.emergency_contacts (user_id, priority);
