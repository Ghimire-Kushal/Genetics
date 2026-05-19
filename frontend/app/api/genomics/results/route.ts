import { NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
const BACKEND_RESULTS_URLS = [
  process.env.GSCOPE_BACKEND_RESULTS_URL,
  process.env.GENESCOPE_BACKEND_RESULTS_URL,
  API_BASE_URL ? `${API_BASE_URL}/results` : undefined,
  "http://127.0.0.1:8000/results",
  "http://127.0.0.1:8001/results",
].filter(Boolean) as string[];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const analysisId = searchParams.get("analysis_id");

  if (!analysisId) {
    return NextResponse.json({ message: "Missing analysis_id." }, { status: 400 });
  }

  let lastError: unknown;

  for (const backendResultsUrl of BACKEND_RESULTS_URLS) {
    try {
      const backendUrl = new URL(backendResultsUrl);
      backendUrl.searchParams.set("analysis_id", analysisId);

      const backendResponse = await fetch(backendUrl);
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
      message: "Could not reach the GScope backend results API. Start FastAPI on port 8000 or 8001.",
      error: lastError instanceof Error ? lastError.message : "Backend unavailable",
    },
    { status: 502 }
  );
}
