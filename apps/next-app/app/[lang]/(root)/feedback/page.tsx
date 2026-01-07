"use client"

import { FeedbackForm } from "@/components/feedback/feedback-form"

export default function FeedbackPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container px-4 py-14 lg:py-20 space-y-10">
        <FeedbackForm />
      </div>
    </div>
  )
}
