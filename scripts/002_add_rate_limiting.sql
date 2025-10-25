-- Add rate limiting table for admin login attempts
CREATE TABLE IF NOT EXISTS admin_login_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address TEXT NOT NULL,
  attempted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  success BOOLEAN NOT NULL DEFAULT FALSE
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_admin_login_attempts_ip_time 
ON admin_login_attempts(ip_address, attempted_at DESC);

-- Add stats columns to track portfolio metrics
ALTER TABLE portfolio_series ADD COLUMN IF NOT EXISTS published BOOLEAN DEFAULT TRUE;
ALTER TABLE portfolio_images ADD COLUMN IF NOT EXISTS published BOOLEAN DEFAULT TRUE;
