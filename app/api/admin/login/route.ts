import { type NextRequest, NextResponse } from "next/server"
import { sign } from "jsonwebtoken"

// Use environment variable for password, with fallback
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "MaubenTech2025!"

// Use environment variable for JWT secret
const JWT_SECRET = process.env.JWT_SECRET

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required")
}

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()

    if (!password) {
      return NextResponse.json({ error: "Password is required" }, { status: 400 })
    }

    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 })
    }

    // Generate JWT token - use non-null assertion since we checked above
    const token = sign(
      {
        admin: true,
        timestamp: Date.now(),
      },
      JWT_SECRET!, // Non-null assertion operator
      { expiresIn: "24h" }, // Token expires in 24 hours
    )

    return NextResponse.json({
      success: true,
      token,
      message: "Login successful",
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
