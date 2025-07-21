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
  link_identifier_id INTEGER REFERENCES link_identifiers(id),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create link_identifiers table (updated structure)
CREATE TABLE IF NOT EXISTS link_identifiers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tracking_number INTEGER,
  uuid TEXT UNIQUE NOT NULL,
  is_vip BOOLEAN NOT NULL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_rsvps_email ON rsvps(email);
CREATE INDEX IF NOT EXISTS idx_rsvps_attending ON rsvps(attending);
CREATE INDEX IF NOT EXISTS idx_rsvps_link_identifier ON rsvps(link_identifier_id);
CREATE INDEX IF NOT EXISTS idx_link_identifiers_uuid ON link_identifiers(uuid);
CREATE INDEX IF NOT EXISTS idx_link_identifiers_vip ON link_identifiers(is_vip);
CREATE INDEX IF NOT EXISTS idx_link_identifiers_tracking ON link_identifiers(tracking_number);
