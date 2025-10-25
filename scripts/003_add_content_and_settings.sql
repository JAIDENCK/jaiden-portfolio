-- Add site content table for editable page content
CREATE TABLE IF NOT EXISTS site_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add site settings table for theme customization
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insert default content
INSERT INTO site_content (key, value) VALUES
  ('hero_title', 'Jaiden Dill-Jackson'),
  ('hero_subtitle', 'Student Photographer'),
  ('hero_description', 'Capturing moments through aviation, landscapes, and portrait photography'),
  ('about_intro', 'I''m a 16-year-old student photographer based in the UK, passionate about capturing the world through my lens.'),
  ('about_specializations', 'Aviation Photography, Landscape Photography, Portrait & Model Photography'),
  ('about_approach', 'My approach combines technical precision with artistic vision, creating images that tell compelling stories.'),
  ('contact_note', 'Available for commissions and collaborations. Let''s create something amazing together.')
ON CONFLICT (key) DO NOTHING;

-- Insert default theme settings
INSERT INTO site_settings (key, value) VALUES
  ('accent_color', '#e50914'),
  ('dark_grey_1', '#0a0a0a'),
  ('dark_grey_2', '#1c1c1c'),
  ('light_grey', '#e6e6e6')
ON CONFLICT (key) DO NOTHING;
