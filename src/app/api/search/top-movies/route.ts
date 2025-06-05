import { NextRequest, NextResponse } from "next/server";
import { fetchFromTMDb } from "@/lib/tmdb";

export async function GET(req: NextRequest) {
  const page = req.nextUrl.searchParams.get("page") || "1";

  try {
    const data = await fetchFromTMDb("/trending/movie/day", `page=${page}`);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Top movies fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch top movies from TMDB" },
      { status: 500 }
    );
  }
}
