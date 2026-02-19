-- Activate rival_mode feature
-- =============================
-- This migration enables the rival_mode feature that was previously set to is_active = false

UPDATE public.features 
SET is_active = true 
WHERE key = 'rival_mode';

COMMENT ON TABLE public.features IS 'Defines all available features in the system - rival_mode now activated for F2-2';
