import { type NextRequest, NextResponse } from "next/server"
import { verify } from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required")
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 })
    }

    const token = authHeader.substring(7) // Remove "Bearer " prefix

    try {
      const decoded = verify(token, JWT_SECRET!) as any // Non-null assertion operator

      if (!decoded.admin) {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 })
      }

      return NextResponse.json({ success: true, valid: true })
    } catch (jwtError) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 })
    }
  } catch (error) {
    console.error("Token verification error:", error)
    return NextResponse.json({ error: "Verification failed" }, { status: 500 })
  }
}
