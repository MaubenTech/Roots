const sqlite3 = require("sqlite3").verbose()
const path = require("path")

const dbPath = path.join(process.cwd(), "rsvp.db")

console.log("Setting up database at:", dbPath)

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error opening database:", err)
    return
  }
  console.log("Connected to SQLite database")
})

db.serialize(() => {
  // Create original rsvps table first
  db.run(
    `
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
    )
  `,
    (err) => {
      if (err) {
        console.error("Error creating rsvps table:", err)
      } else {
        console.log('Table "rsvps" created successfully')
      }
    },
  )

  // Create link_identifiers table (updated structure without is_test column)
  db.run(
    `
    CREATE TABLE IF NOT EXISTS link_identifiers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tracking_number INTEGER,
      uuid TEXT UNIQUE NOT NULL,
      is_vip BOOLEAN NOT NULL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `,
    (err) => {
      if (err) {
        console.error("Error creating link_identifiers table:", err)
      } else {
        console.log('Table "link_identifiers" created successfully')
      }
    },
  )

  // Check if link_identifier_id column exists in rsvps table
  db.all("PRAGMA table_info(rsvps)", (err, columns) => {
    if (err) {
      console.error("Error checking table structure:", err)
      return
    }

    const hasLinkIdentifierColumn = columns.some((col) => col.name === "link_identifier_id")

    if (!hasLinkIdentifierColumn) {
      // Add foreign key column to rsvps table
      db.run(`ALTER TABLE rsvps ADD COLUMN link_identifier_id INTEGER REFERENCES link_identifiers(id)`, (err) => {
        if (err) {
          console.error("Error adding link_identifier_id column:", err)
        } else {
          console.log('Column "link_identifier_id" added to rsvps table')
        }
      })
    } else {
      console.log('Column "link_identifier_id" already exists in rsvps table')
    }
  })

  // Create indexes
  db.run("CREATE INDEX IF NOT EXISTS idx_rsvps_email ON rsvps(email)", (err) => {
    if (err) {
      console.error("Error creating email index:", err)
    } else {
      console.log("Email index created")
    }
  })

  db.run("CREATE INDEX IF NOT EXISTS idx_rsvps_attending ON rsvps(attending)", (err) => {
    if (err) {
      console.error("Error creating attending index:", err)
    } else {
      console.log("Attending index created")
    }
  })

  db.run("CREATE INDEX IF NOT EXISTS idx_link_identifiers_uuid ON link_identifiers(uuid)", (err) => {
    if (err) {
      console.error("Error creating uuid index:", err)
    } else {
      console.log("UUID index created")
    }
  })

  db.run("CREATE INDEX IF NOT EXISTS idx_link_identifiers_vip ON link_identifiers(is_vip)", (err) => {
    if (err) {
      console.error("Error creating vip index:", err)
    } else {
      console.log("VIP index created")
    }
  })

  db.run("CREATE INDEX IF NOT EXISTS idx_link_identifiers_tracking ON link_identifiers(tracking_number)", (err) => {
    if (err) {
      console.error("Error creating tracking number index:", err)
    } else {
      console.log("Tracking number index created")
    }
  })

  db.run("CREATE INDEX IF NOT EXISTS idx_rsvps_link_identifier ON rsvps(link_identifier_id)", (err) => {
    if (err) {
      console.error("Error creating link identifier index:", err)
    } else {
      console.log("Link identifier index created")
    }
  })

  // Check if link_identifiers table is empty and populate it
  db.get("SELECT COUNT(*) as count FROM link_identifiers WHERE uuid NOT LIKE 'test-%'", (err, row) => {
    if (err) {
      console.error("Error checking link_identifiers count:", err)
      return
    }

    if (row.count === 0) {
      console.log("Populating link_identifiers table with initial data...")

      // Production UUIDs (50 total - first 20 VIP, last 30 Regular)
      const productionUuids = [
        "fbf0ae67-c05a-482f-b6ea-5aafb45df8fa",
        "ad484522-ea04-4eac-ad12-76580e5cda30",
        "7d1e59f9-2f4a-46b6-9988-c75cf2c77e6c",
        "5709f3c0-30f0-4164-be35-6e17d3077405",
        "474ab054-a68b-4f57-b5f4-994a596124b7",
        "1ce71c1d-8366-457a-a8a3-0846ec3c1d33",
        "b64f7b4c-57f4-4cc3-bc09-ed0b8c5d02ef",
        "735235bc-b922-4a43-ba82-b2ede1e0e3f3",
        "7bb04c9a-41fc-400c-9e05-070b9884659f",
        "f2175845-57b4-496e-befc-5dfc2d80a10e",
        "f71c61b0-d371-4707-9dd9-a19eed79eb72",
        "10b99cff-49c2-4fab-889a-b559304d29d2",
        "6721b817-b386-4817-8579-1637c82a9a6c",
        "b3a87696-360f-4bea-92b3-270f610cd4a2",
        "adc94b11-c6ae-499c-ae91-3b7821cc6a33",
        "a936478b-9e75-4889-9d55-24a205ba5daf",
        "213b50b8-d29a-4378-82b6-d9e1fe0550c8",
        "b7f88087-b069-431b-a1c6-a519bbb14204",
        "7c747f93-da6d-413e-a21c-b016e17421b2",
        "9cd184f1-dd5b-47ab-9840-31b53fba3ab3",
        "3400727d-7363-44d5-8210-011d08582824",
        "62c22be9-4682-4962-81dc-568350c5de95",
        "5f14538a-f294-4266-b50a-d63b8b047950",
        "fd086636-ff20-4b37-8065-ee1ff851a86d",
        "b5375e88-d239-4984-a933-b7ffe63c72b0",
        "e59bb81b-aac3-4f6a-baae-5735afe9c555",
        "8716cd57-09f0-47e4-8e08-948aae321c28",
        "9a679d57-23ea-4c7c-944f-d86afcb0ac68",
        "273f46ff-8b0a-4ea1-8a25-c0c6cf1f4a00",
        "ffc6def6-07f9-4bbb-aa99-9a73cf3a8b06",
        "15d3bedf-fa46-46af-a80d-6455940f11e9",
        "a520f455-91be-4f21-9d02-915677cf3aaa",
        "2ba40edb-bd5f-4282-afb6-0b59640d02b2",
        "a8983b38-961a-49bc-ae83-29829edfeba0",
        "ccac2002-9bad-4305-9b22-6d8c1547ecd2",
        "44932875-9ff1-497c-9c41-ae3af95bb0ae",
        "65a75f69-553e-4fed-b699-802e3f647497",
        "a8bb6f96-7515-4e7d-b18c-48be7f0c0a4d",
        "5f26b775-8176-42b2-ba9d-fd82f1aaa8bd",
        "5306b1d5-8e83-430f-ad69-442fa06ca310",
        "8a56a583-7505-4881-9d5a-4e76ad557b0f",
        "acd5241f-7860-40ad-af7a-75046ab167bb",
        "258d934d-d24f-483e-b1d6-b701dcd8b7c7",
        "402bec39-4feb-4175-9eb8-0f9968e9c503",
        "9a02459e-987a-4863-8bf6-1ca22ecd56b8",
        "aa292d12-ab23-4cc1-a8aa-1feee8b0a563",
        "83f12eb8-5ca8-4c33-a73e-2dd725dcfa45",
        "8b740e57-ffd3-4511-b091-e823fa115848",
        "2197ee0a-547d-4de9-bce4-a4deaa32dbe0",
        "112f33ed-1877-4231-a171-bd6197087c8f",
      ]

      // Test UUIDs
      const testUuids = [
        { uuid: "test-vip-001-fbf0ae67-c05a-482f-b6ea-5aafb45df8fa", is_vip: 1 },
        { uuid: "test-vip-002-ad484522-ea04-4eac-ad12-76580e5cda30", is_vip: 1 },
        { uuid: "test-vip-003-7d1e59f9-2f4a-46b6-9988-c75cf2c77e6c", is_vip: 1 },
        { uuid: "test-reg-001-e59bb81b-aac3-4f6a-baae-5735afe9c555", is_vip: 0 },
        { uuid: "test-reg-002-8716cd57-09f0-47e4-8e08-948aae321c28", is_vip: 0 },
        { uuid: "test-reg-003-9a679d57-23ea-4c7c-944f-d86afcb0ac68", is_vip: 0 },
      ]

      let insertCount = 0
      const totalInserts = productionUuids.length + testUuids.length

      function checkCompletion() {
        insertCount++
        if (insertCount === totalInserts) {
          console.log(`\n🎉 Setup completed! Inserted ${totalInserts} link identifiers.`)
          console.log(`   - 20 VIP identifiers (with guest privileges) - Tracking #1-20`)
          console.log(`   - 30 Regular identifiers (no guest privileges) - Tracking #21-50`)
          console.log(`   - ${testUuids.length} Test identifiers (for testing)`)
        }
      }

      // Insert Production identifiers (first 20 as VIP, last 30 as Regular)
      productionUuids.forEach((uuid, index) => {
        const trackingNumber = index + 1
        const isVip = index < 20 ? 1 : 0 // First 20 are VIP, last 30 are Regular

        db.run(
          "INSERT INTO link_identifiers (tracking_number, uuid, is_vip) VALUES (?, ?, ?)",
          [trackingNumber, uuid, isVip],
          (err) => {
            if (err) {
              console.error(`Error inserting Production UUID #${trackingNumber}:`, err)
            } else {
              console.log(`✓ Inserted Production UUID #${trackingNumber} (${isVip ? "VIP" : "Regular"})`)
            }
            checkCompletion()
          },
        )
      })

      // Insert Test identifiers
      testUuids.forEach((item, index) => {
        db.run(
          "INSERT INTO link_identifiers (tracking_number, uuid, is_vip) VALUES (?, ?, ?)",
          [index + 1000, item.uuid, item.is_vip], // Use 1000+ for test tracking numbers
          (err) => {
            if (err) {
              console.error(`Error inserting Test UUID ${index + 1}:`, err)
            } else {
              console.log(`✓ Inserted Test UUID ${index + 1} (${item.is_vip ? "VIP" : "Regular"})`)
            }
            checkCompletion()
          },
        )
      })
    } else {
      console.log(`Link identifiers table already has ${row.count} entries`)
    }
  })
})

db.close((err) => {
  if (err) {
    console.error("Error closing database:", err)
  } else {
    console.log("Database connection closed")
    console.log("Database setup completed!")
  }
})
