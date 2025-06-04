import { NextRequest, NextResponse } from "next/server";
import { fetchFromTMDb } from "@/lib/tmdb";

export async function GET(req: NextRequest) {
  const page = req.nextUrl.searchParams.get("page") || "1";

  const data = await fetchFromTMDb(`/movie/upcoming`, `page=${page}`);
  return NextResponse.json(data);
}
