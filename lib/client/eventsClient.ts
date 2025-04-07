"use client";

export async function getEvents() {
  try {
    const res = await fetch("/api/events", { cache: "no-store" });
    const result = await res.json();
    return result;
  } catch (err) {
    return { success: false, error: "Fetch error" };
  }
}
