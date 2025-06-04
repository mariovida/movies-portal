import { NextRequest, NextResponse } from "next/server";
import { fetchFromTMDb } from "@/lib/tmdb";

export async function GET(req: NextRequest) {
  const type = req.nextUrl.searchParams.get("type") || "movie";
  const page = req.nextUrl.searchParams.get("page") || "1";

  const allowedTypes = ["movie", "tv", "person"];
  const safeType = allowedTypes.includes(type) ? type : "movie";

  const data = await fetchFromTMDb(`/${safeType}/popular`, `page=${page}`);
  return NextResponse.json(data);
}
