import { NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
const BACKEND_ANALYZE_URLS = [
  process.env.GSCOPE_BACKEND_ANALYZE_URL,
  process.env.GENESCOPE_BACKEND_ANALYZE_URL,
  API_BASE_URL ? `${API_BASE_URL}/analyze` : undefined,
  "http://127.0.0.1:8000/analyze",
  "http://127.0.0.1:8001/analyze",
].filter(Boolean) as string[];

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON body." }, { status: 400 });
  }

  let lastError: unknown;

  for (const backendUrl of BACKEND_ANALYZE_URLS) {
    try {
      const backendResponse = await fetch(backendUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await backendResponse.json();

      if (!backendResponse.ok) {
        return NextResponse.json(data, { status: backendResponse.status });
      }

      return NextResponse.json(data);
    } catch (error) {
      lastError = error;
    }
  }

  return NextResponse.json(
    {
      message: "Could not reach the GScope backend analyze API. Start FastAPI on port 8000 or 8001.",
      error: lastError instanceof Error ? lastError.message : "Backend unavailable",
    },
    { status: 502 }
  );
}
