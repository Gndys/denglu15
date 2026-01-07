import { NextRequest, NextResponse } from "next/server";
import { db } from "@libs/database";
import { feedback } from "@libs/database/schema/feedback";
import { desc, sql } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Number(searchParams.get("limit") || 20);
    const offset = Number(searchParams.get("offset") || 0);

    const [data, totalResult] = await Promise.all([
      db
        .select({
          id: feedback.id,
          email: feedback.email,
          content: feedback.content,
          status: feedback.status,
          createdAt: feedback.createdAt,
        })
        .from(feedback)
        .orderBy(desc(feedback.createdAt))
        .limit(limit)
        .offset(offset),
      db
        .select({
          count: sql<number>`count(*)`,
        })
        .from(feedback),
    ]);

    const total = Number(totalResult?.[0]?.count || 0);

    return NextResponse.json({
      feedbacks: data,
      total,
    });
  } catch (error) {
    console.error("Failed to fetch feedbacks", error);
    return NextResponse.json(
      { message: "Failed to fetch feedbacks" },
      { status: 500 }
    );
  }
}
