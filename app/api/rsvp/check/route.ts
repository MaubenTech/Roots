import { type NextRequest, NextResponse } from "next/server"
import { Database } from "sqlite3"
import path from "path"

const dbPath = path.join(process.cwd(), "rsvp.db")

function getDatabase() {
  return new Database(dbPath)
}

async function checkExistingRSVP(email: string) {
  return new Promise<any>((resolve, reject) => {
    const db = getDatabase()

    db.get("SELECT * FROM rsvps WHERE email = ? ORDER BY created_at DESC LIMIT 1", [email], (err, row) => {
      if (err) {
        console.error("Database query error:", err)
        reject(err)
      } else {
        resolve(row)
      }
    })

    db.close()
  })
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const existingRSVP = await checkExistingRSVP(email)

    if (existingRSVP) {
      return NextResponse.json({
        exists: true,
        rsvp: existingRSVP,
      })
    } else {
      return NextResponse.json({
        exists: false,
        rsvp: null,
      })
    }
  } catch (error) {
    console.error("Error checking RSVP:", error)
    return NextResponse.json({ error: "Failed to check RSVP" }, { status: 500 })
  }
}
