import { NextResponse } from "next/server";

const MAX_SIZE_BYTES = 50 * 1024 * 1024;
const ALLOWED_EXTENSIONS = new Set(["csv", "vcf"]);
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
const BACKEND_UPLOAD_URLS = [
  process.env.GSCOPE_BACKEND_UPLOAD_URL,
  process.env.GENESCOPE_BACKEND_UPLOAD_URL,
  API_BASE_URL ? `${API_BASE_URL}/upload` : undefined,
  "https://genetics-jqlc.onrender.com/upload",
  "http://127.0.0.1:8000/upload",
  "http://127.0.0.1:8001/upload",
].filter(Boolean) as string[];

export async function POST(request: Request) {
  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ message: "Invalid multipart form data." }, { status: 400 });
  }

  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ message: 'Missing upload field "file".' }, { status: 400 });
  }

  const extension = file.name.split(".").pop()?.toLowerCase();

  if (!extension || !ALLOWED_EXTENSIONS.has(extension)) {
    return NextResponse.json(
      { message: "Unsupported file type. Accepted formats: .csv, .vcf." },
      { status: 415 }
    );
  }

  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json({ message: "File too large. Max size is 50 MB." }, { status: 413 });
  }

  let lastError: unknown;

  for (const backendUrl of BACKEND_UPLOAD_URLS) {
    try {
      const backendFormData = new FormData();
      backendFormData.append("file", file);

      const backendResponse = await fetch(backendUrl, {
        method: "POST",
        body: backendFormData,
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
      message: "Could not reach the GScope backend. Start FastAPI on port 8000 or 8001.",
      error: lastError instanceof Error ? lastError.message : "Backend unavailable",
    },
    { status: 502 }
  );
}
