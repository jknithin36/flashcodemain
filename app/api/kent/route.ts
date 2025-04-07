// /app/api/kent/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Magazine from "@/database/magazine.model";
import ImportantDate from "@/database/importantDate.model";
import Event from "@/database/event.model"; // ✅ add event model

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");

  await dbConnect();

  try {
    if (type === "magazine") {
      const magazines = await Magazine.find().sort({ createdAt: -1 });
      return NextResponse.json({ magazines });
    }

    if (type === "important-dates") {
      const dates = await ImportantDate.find();

      const semesterWise = {
        spring: dates.filter((d) => d.semester === "Spring2025"),
        summer: dates.filter((d) => d.semester === "Summer2025"),
        fall: dates.filter((d) => d.semester === "Fall2025"),
      };

      return NextResponse.json(semesterWise);
    }

    if (type === "events") {
      const events = await Event.find().sort({ date: 1 }); // sorted by upcoming
      return NextResponse.json({ events });
    }

    return NextResponse.json(
      { message: "Invalid type provided." },
      { status: 400 }
    );
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
