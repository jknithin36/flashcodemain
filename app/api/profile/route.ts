import { auth } from "@/auth";
import User from "@/database/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ success: false, error: "Not authenticated" });

  const user = await User.findById(session.user.id);
  return NextResponse.json({ success: true, data: user });
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ success: false, error: "Not authenticated" });

  const body = await req.json();
  const updated = await User.findByIdAndUpdate(
    session.user.id,
    { ...body },
    { new: true }
  );

  return NextResponse.json({ success: true, data: updated });
}
