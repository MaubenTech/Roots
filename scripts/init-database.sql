-- Initialize RSVP database table
CREATE TABLE IF NOT EXISTS rsvps (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  company TEXT,
  attending TEXT NOT NULL,
  has_guests TEXT,
  guest_count INTEGER DEFAULT 0,
  donation TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster email lookups
CREATE INDEX IF NOT EXISTS idx_rsvps_email ON rsvps(email);

-- Create index for attendance status
CREATE INDEX IF NOT EXISTS idx_rsvps_attending ON rsvps(attending);
