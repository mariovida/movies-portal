import { NextResponse } from "next/server";
import { fetchFromTMDb } from "@/lib/tmdb";

export async function GET() {
  try {
    const data = await fetchFromTMDb("/person/popular", "page=1");
    return NextResponse.json({ results: data.results.slice(0, 4) });
  } catch (error) {
    console.error("Top search error:", error);
    return NextResponse.json({ error: "Failed to fetch top people" }, { status: 500 });
  }
}
