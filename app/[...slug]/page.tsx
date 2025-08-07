"use client"

import { useParams } from "next/navigation"
import { useEffect } from "react"
import HomePage from "../page"

export default function DynamicPage() {
  const params = useParams()

  useEffect(() => {
    // This will be handled by the main page component
    // The slug will be processed there
  }, [params])

  return <HomePage />
}
