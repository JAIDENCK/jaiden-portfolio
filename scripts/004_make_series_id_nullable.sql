-- Make series_id nullable in portfolio_images to allow unassigned photos
ALTER TABLE portfolio_images
ALTER COLUMN series_id DROP NOT NULL;

-- Add index for faster queries on unassigned photos
CREATE INDEX idx_portfolio_images_series_id_null ON portfolio_images (series_id) WHERE series_id IS NULL;
