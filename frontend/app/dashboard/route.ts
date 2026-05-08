import { NextRequest, NextResponse } from "next/server";

// ─── Config ───────────────────────────────────────────────────────────────────
// Disable Next.js body parser so we handle raw stream
export const config = {
  api: { bodyParser: false },
};

// ─── Allowed MIME types ───────────────────────────────────────────────────────
const ALLOWED_MIMES = new Set([
  "text/csv",
  "text/plain",
  "text/x-vcard",
  "application/octet-stream", // VCF files sometimes land here
]);

const ALLOWED_EXTENSIONS = new Set(["csv", "vcf", "txt"]);
const MAX_BYTES = 50 * 1024 * 1024; // 50 MB

// ─── Handler ──────────────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") ?? "";
    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json(
        { success: false, message: "Request must be multipart/form-data." },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json(
        { success: false, message: "No file attached. Expected field: 'file'." },
        { status: 400 }
      );
    }

    // ── Size check ────────────────────────────────────────────────────────
    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { success: false, message: `File exceeds 50 MB limit (received ${(file.size / 1048576).toFixed(1)} MB).` },
        { status: 413 }
      );
    }

    // ── Extension check ───────────────────────────────────────────────────
    const fileName = (file as File).name ?? "unknown";
    const ext = fileName.split(".").pop()?.toLowerCase();
    if (!ext || !ALLOWED_EXTENSIONS.has(ext)) {
      return NextResponse.json(
        { success: false, message: `Unsupported file extension ".${ext ?? "?"}". Allowed: .csv, .vcf, .txt` },
        { status: 415 }
      );
    }

    // ── MIME check (secondary) ────────────────────────────────────────────
    const mime = file.type;
    if (mime && !ALLOWED_MIMES.has(mime)) {
      return NextResponse.json(
        { success: false, message: `Unsupported MIME type "${mime}".` },
        { status: 415 }
      );
    }

    // ── Process file (replace with your actual pipeline) ──────────────────
    // e.g. stream to S3, call analysis microservice, persist to DB, etc.
    const buffer = Buffer.from(await file.arrayBuffer());

    // TODO: replace with your real processing logic, e.g.:
    // const analysisJobId = await genomicsService.enqueue(buffer, { ext, fileName });

    const analysisJobId = `job_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    console.info(`[GeneScope] Received file: ${fileName} (${(file.size / 1024).toFixed(1)} KB), job: ${analysisJobId}`);

    // Suppress unused variable lint warning
    void buffer;

    return NextResponse.json(
      {
        success: true,
        message: "File received and queued for analysis.",
        data: {
          jobId: analysisJobId,
          fileName,
          fileSizeBytes: file.size,
          ext,
          status: "queued",
        },
      },
      { status: 202 }
    );
  } catch (err) {
    console.error("[GeneScope] Upload route error:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error. Please try again." },
      { status: 500 }
    );
  }
}

// Block other methods
export async function GET() {
  return NextResponse.json({ message: "Method not allowed." }, { status: 405 });
}
