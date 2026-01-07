"use client"

import { useState } from "react"
import { useTranslation } from "@/hooks/use-translation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Check, Loader2 } from "lucide-react"

type SubmitState = "idle" | "loading" | "success" | "error"

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function FeedbackForm() {
  const { t } = useTranslation()
  const [content, setContent] = useState("")
  const [email, setEmail] = useState("")
  const [touched, setTouched] = useState({ content: false, email: false })
  const [status, setStatus] = useState<SubmitState>("idle")

  const contentValid = content.trim().length >= 30
  const emailValid = emailRegex.test(email.trim())
  const isValid = contentValid && emailValid

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setTouched({ content: true, email: true })
    if (!isValid) return

    setStatus("loading")
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, email }),
      })

      if (!res.ok) {
        throw new Error("Request failed")
      }

      setStatus("success")
      setContent("")
      setEmail("")
      setTouched({ content: false, email: false })
    } catch (error) {
      console.error("Failed to submit feedback", error)
      setStatus("error")
    }
  }

  return (
    <div className="max-w-5xl mx-auto">
      <Card className="shadow-md">
        <CardHeader className="space-y-3">
          <Badge variant="secondary" className="w-fit">
            {t.feedback.badge}
          </Badge>
          <CardTitle className="text-2xl">{t.feedback.title}</CardTitle>
          <CardDescription className="text-base">
            {t.feedback.subtitle}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {status === "success" && (
            <Alert className="border-green-100 dark:border-green-900/60 bg-green-50 dark:bg-green-950/50">
              <Check className="text-green-600" />
              <AlertTitle>{t.feedback.submit.successTitle}</AlertTitle>
              <AlertDescription>{t.feedback.submit.successDescription}</AlertDescription>
            </Alert>
          )}
          {status === "error" && (
            <Alert variant="destructive">
              <AlertTitle>{t.feedback.submit.errorTitle}</AlertTitle>
              <AlertDescription>{t.feedback.submit.errorDescription}</AlertDescription>
            </Alert>
          )}

          <form className="space-y-5" onSubmit={onSubmit}>
            <div className="space-y-2">
              <Label htmlFor="content">{t.feedback.fields.issue}</Label>
              <Textarea
                id="content"
                name="content"
                maxLength={600}
                placeholder={t.feedback.fields.issuePlaceholder}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onBlur={() => setTouched((prev) => ({ ...prev, content: true }))}
                aria-invalid={touched.content && !contentValid}
                className="min-h-32"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span className={touched.content && !contentValid ? "text-destructive" : ""}>
                  {touched.content && !contentValid
                    ? t.feedback.validation.issue
                    : `${content.trim().length}/600`}
                </span>
                <span>{t.feedback.helper.timeline}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{t.feedback.fields.email}</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder={t.feedback.fields.emailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
                aria-invalid={touched.email && !emailValid}
              />
              {touched.email && !emailValid && (
                <p className="text-xs text-destructive">{t.feedback.validation.email}</p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button type="submit" disabled={!isValid || status === "loading"} className="min-w-[180px]">
                {status === "loading" && <Loader2 className="animate-spin" />}
                {status === "loading" ? t.feedback.submit.submitting : t.feedback.submit.button}
              </Button>
              {status === "success" && (
                <Button type="button" variant="ghost" onClick={() => setStatus("idle")}>
                  {t.feedback.submit.successCta}
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
