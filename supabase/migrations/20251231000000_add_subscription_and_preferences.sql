-- Add subscription status and preferences to user_profiles
-- =========================================================

-- Create subscription status enum type
CREATE TYPE subscription_status AS ENUM ('free', 'standard', 'plus', 'premium', 'trial');

-- Add new columns to user_profiles
ALTER TABLE public.user_profiles
  ADD COLUMN subscription_status subscription_status DEFAULT 'free' NOT NULL,
  ADD COLUMN subscription_expires_at TIMESTAMPTZ,
  ADD COLUMN preferences JSONB DEFAULT '{}'::jsonb;

-- Create index on subscription_status for efficient querying
CREATE INDEX idx_user_profiles_subscription_status ON public.user_profiles(subscription_status);

-- Create index on subscription_expires_at for efficient expiration checks
CREATE INDEX idx_user_profiles_subscription_expires_at ON public.user_profiles(subscription_expires_at) WHERE subscription_expires_at IS NOT NULL;

-- Add comment explaining the preferences structure
COMMENT ON COLUMN public.user_profiles.preferences IS 'JSON object storing user feature preferences. Structure will be defined as features are implemented.';

-- Add comment explaining subscription_expires_at
COMMENT ON COLUMN public.user_profiles.subscription_expires_at IS 'Expiration date for trial and paid subscriptions. NULL means no expiration (e.g., for free tier).';
