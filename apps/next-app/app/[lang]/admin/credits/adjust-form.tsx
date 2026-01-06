"use client";

import { useState } from "react";
import { useTranslation } from "@/hooks/use-translation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export function AdjustForm() {
  const { t } = useTranslation();

  const [userId, setUserId] = useState("");
  const [amount, setAmount] = useState("");
  const [action, setAction] = useState<"add" | "deduct">("add");
  const [type, setType] = useState<"bonus" | "refund" | "adjustment">("adjustment");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId || !amount) {
      toast.error(t.admin.credits.form.missingFields);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/credits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          amount: Number(amount),
          action,
          type,
          reason,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Adjust failed");
      }

      toast.success(t.admin.credits.form.success);
      setAmount("");
      setReason("");
    } catch (error) {
      console.error(error);
      toast.error(t.admin.credits.messages.adjustError);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.admin.credits.adjustTitle}</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="userId">{t.admin.credits.form.userId}</Label>
            <Input id="userId" value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="usr_..." />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">{t.admin.credits.form.amount}</Label>
            <Input
              id="amount"
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>{t.admin.credits.form.action}</Label>
            <Select value={action} onValueChange={(value: "add" | "deduct") => setAction(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="add">{t.admin.credits.form.add}</SelectItem>
                <SelectItem value="deduct">{t.admin.credits.form.deduct}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{t.admin.credits.form.type}</Label>
            <Select value={type} onValueChange={(value: "bonus" | "refund" | "adjustment") => setType(value)}>
              <SelectTrigger>
                <SelectValue placeholder={t.admin.credits.form.typePlaceholder} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bonus">bonus</SelectItem>
                <SelectItem value="refund">refund</SelectItem>
                <SelectItem value="adjustment">adjustment</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="reason">{t.admin.credits.form.reason}</Label>
            <Input id="reason" value={reason} onChange={(e) => setReason(e.target.value)} />
          </div>

          <div className="md:col-span-2">
            <Button type="submit" disabled={submitting}>
              {t.admin.credits.form.submit}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
