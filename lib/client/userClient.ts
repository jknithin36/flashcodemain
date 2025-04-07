"use client";

export async function getLoggedInUser() {
  try {
    const res = await fetch("/api/profile", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    const data = await res.json();
    if (!data.success) console.error("❌ User fetch failed:", data.error);
    return data;
  } catch (err) {
    console.error("❌ Fetch error:", err);
    return { success: false, error: "Fetch failed" };
  }
}

export async function updateUserProfile(profileData: any) {
  try {
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profileData),
    });

    const data = await res.json();
    if (!data.success) console.error("❌ Profile update failed:", data.error);
    return data;
  } catch (err) {
    console.error("❌ Update error:", err);
    return { success: false, error: "Update failed" };
  }
}
