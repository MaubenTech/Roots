import { type NextRequest, NextResponse } from "next/server"
import { Database } from "sqlite3"
import { verify } from "jsonwebtoken"
import path from "path"

const dbPath = path.join(process.cwd(), "rsvp.db")
const JWT_SECRET = process.env.JWT_SECRET

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required")
}

function getDatabase() {
  return new Database(dbPath)
}

// Verify admin authentication
function verifyAdmin(request: NextRequest) {
  const authHeader = request.headers.get("authorization")

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return false
  }

  const token = authHeader.substring(7)

  try {
    const decoded = verify(token, JWT_SECRET!) as any
    return decoded.admin === true
  } catch (error) {
    return false
  }
}

// Delete RSVP
async function deleteRSVP(id: string) {
  return new Promise<boolean>((resolve, reject) => {
    const db = getDatabase()

    db.run("DELETE FROM rsvps WHERE id = ?", [id], function (err) {
      if (err) {
        console.error("Database delete error:", err)
        reject(err)
      } else {
        console.log(`RSVP deleted successfully. Rows affected: ${this.changes}`)
        resolve(this.changes > 0)
      }
    })

    db.close()
  })
}

// Update RSVP
async function updateRSVP(id: string, data: any) {
  return new Promise<boolean>((resolve, reject) => {
    const db = getDatabase()

    db.run(
      `UPDATE rsvps SET 
        full_name = ?, email = ?, phone = ?, company = ?, 
        attending = ?, has_guests = ?, guest_count = ?, donation = ?
      WHERE id = ?`,
      [
        data.full_name,
        data.email,
        data.phone,
        data.company || "",
        data.attending,
        data.has_guests || "",
        data.guest_count || 0,
        data.donation || "",
        id,
      ],
      function (err) {
        if (err) {
          console.error("Database update error:", err)
          reject(err)
        } else {
          console.log(`RSVP updated successfully. Rows affected: ${this.changes}`)
          resolve(this.changes > 0)
        }
      },
    )

    db.close()
  })
}

// DELETE endpoint
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Verify admin authentication
    if (!verifyAdmin(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = params

    if (!id) {
      return NextResponse.json({ error: "RSVP ID is required" }, { status: 400 })
    }

    const deleted = await deleteRSVP(id)

    if (deleted) {
      return NextResponse.json({ success: true, message: "RSVP deleted successfully" })
    } else {
      return NextResponse.json({ error: "RSVP not found" }, { status: 404 })
    }
  } catch (error) {
    console.error("Error deleting RSVP:", error)
    return NextResponse.json({ error: "Failed to delete RSVP" }, { status: 500 })
  }
}

// PUT endpoint
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Verify admin authentication
    if (!verifyAdmin(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = params
    const data = await request.json()

    if (!id) {
      return NextResponse.json({ error: "RSVP ID is required" }, { status: 400 })
    }

    // Validate required fields
    if (!data.full_name || !data.email || !data.phone || !data.attending) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate guest count limit
    if (data.has_guests === "yes" && data.guest_count > 1) {
      return NextResponse.json(
        {
          error: "Maximum of 1 guest allowed per attendee",
        },
        { status: 400 },
      )
    }

    const updated = await updateRSVP(id, data)

    if (updated) {
      return NextResponse.json({ success: true, message: "RSVP updated successfully" })
    } else {
      return NextResponse.json({ error: "RSVP not found" }, { status: 404 })
    }
  } catch (error) {
    console.error("Error updating RSVP:", error)
    return NextResponse.json({ error: "Failed to update RSVP" }, { status: 500 })
  }
}
