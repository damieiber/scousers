-- Create Features System for dynamic subscription management
-- ===========================================================

-- 1. Create features table
-- =========================
CREATE TABLE public.features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create subscription_features junction table
-- ===============================================
CREATE TABLE public.subscription_features (
  subscription_status subscription_status NOT NULL,
  feature_id UUID REFERENCES public.features(id) ON DELETE CASCADE,
  PRIMARY KEY (subscription_status, feature_id)
);

-- 3. Enable RLS on features table
-- ================================
ALTER TABLE public.features ENABLE ROW LEVEL SECURITY;

-- Public can view active features
CREATE POLICY "Features are viewable by everyone"
  ON public.features FOR SELECT
  USING (is_active = true);

-- 4. Enable RLS on subscription_features table
-- =============================================
ALTER TABLE public.subscription_features ENABLE ROW LEVEL SECURITY;

-- Public can view subscription features
CREATE POLICY "Subscription features are viewable by everyone"
  ON public.subscription_features FOR SELECT
  USING (true);

-- 5. Seed initial features for MVP
-- =================================
INSERT INTO public.features (key, name, description, is_active) VALUES
  ('secondary_teams', 'Equipos Secundarios', 'Permite seguir múltiples equipos además del principal', false),
  ('custom_notifications', 'Notificaciones Personalizadas', 'Configuración avanzada de notificaciones', false),
  ('rival_mode', 'Modo Rival', 'Visualización de noticias de equipos rivales', false),
  ('ad_free', 'Sin Publicidad', 'Experiencia sin anuncios publicitarios', false)
ON CONFLICT (key) DO NOTHING;

-- 6. Assign features to subscription tiers
-- =========================================
-- Free tier: no additional features (just basic access)

-- Trial tier: all premium features for testing
INSERT INTO public.subscription_features (subscription_status, feature_id)
SELECT 'trial', id FROM public.features WHERE key IN ('secondary_teams', 'custom_notifications', 'rival_mode', 'ad_free')
ON CONFLICT DO NOTHING;

-- Standard tier: basic premium features
INSERT INTO public.subscription_features (subscription_status, feature_id)
SELECT 'standard', id FROM public.features WHERE key IN ('ad_free')
ON CONFLICT DO NOTHING;

-- Plus tier: includes standard + more features
INSERT INTO public.subscription_features (subscription_status, feature_id)
SELECT 'plus', id FROM public.features WHERE key IN ('ad_free', 'custom_notifications')
ON CONFLICT DO NOTHING;

-- Premium tier: all features
INSERT INTO public.subscription_features (subscription_status, feature_id)
SELECT 'premium', id FROM public.features WHERE key IN ('secondary_teams', 'custom_notifications', 'rival_mode', 'ad_free')
ON CONFLICT DO NOTHING;

-- Add helpful comments
COMMENT ON TABLE public.features IS 'Defines all available features in the system that can be assigned to subscription tiers';
COMMENT ON TABLE public.subscription_features IS 'Junction table mapping features to subscription tiers';
COMMENT ON COLUMN public.features.is_active IS 'Global toggle to enable/disable a feature across all subscription tiers';
