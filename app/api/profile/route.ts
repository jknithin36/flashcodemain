import { auth } from "@/auth";
import User from "@/database/user.model";
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose"; // ✅ ensure this is present

export async function GET(req: NextRequest) {
  const session = await auth();
  console.log("🔍 Session from auth:", session);

  if (!session?.user?.id)
    return NextResponse.json({ success: false, error: "Not authenticated" });

  try {
    await dbConnect(); // ✅ ensure MongoDB is connected
    const user = await User.findById(session.user.id);
    return NextResponse.json({ success: true, data: user });
  } catch (err) {
    console.error("❌ DB fetch error in /api/profile:", err);
    return NextResponse.json({ success: false, error: "Database error" });
  }
}

export async function PATCH(req: NextRequest) {
  const session = await auth();

  if (!session?.user?.id)
    return NextResponse.json({ success: false, error: "Not authenticated" });

  try {
    await dbConnect(); // ✅ make sure it's added here too
    const body = await req.json();
    const updated = await User.findByIdAndUpdate(
      session.user.id,
      { ...body },
      { new: true }
    );

    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    console.error("❌ DB update error in /api/profile:", err);
    return NextResponse.json({ success: false, error: "Update failed" });
  }
}
