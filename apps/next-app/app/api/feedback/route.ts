import { NextRequest, NextResponse } from "next/server";
import { db } from "@libs/database";
import { feedback } from "@libs/database/schema/feedback";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const content = String(body?.content || "").trim();
    const email = String(body?.email || "").trim();

    if (content.length < 30) {
      return NextResponse.json(
        { message: "Content too short" },
        { status: 400 }
      );
    }

    if (!emailRegex.test(email)) {
      return NextResponse.json({ message: "Invalid email" }, { status: 400 });
    }

    const [inserted] = await db
      .insert(feedback)
      .values({
        content,
        email,
      })
      .returning({
        id: feedback.id,
        createdAt: feedback.createdAt,
      });

    return NextResponse.json(
      {
        id: inserted.id,
        createdAt: inserted.createdAt,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to submit feedback", error);
    return NextResponse.json(
      { message: "Failed to submit feedback" },
      { status: 500 }
    );
  }
}
