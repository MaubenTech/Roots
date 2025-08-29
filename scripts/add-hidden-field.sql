-- Add is_hidden field to rsvps table
ALTER TABLE rsvps ADD COLUMN is_hidden BOOLEAN NOT NULL DEFAULT 0;

-- Create index for hidden field
CREATE INDEX IF NOT EXISTS idx_rsvps_hidden ON rsvps(is_hidden);
