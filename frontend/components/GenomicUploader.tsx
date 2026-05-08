"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import axios, { AxiosProgressEvent } from "axios";
import { useRouter } from "next/navigation";

// ─── Types ───────────────────────────────────────────────────────────────────

type UploadStage = "idle" | "uploading" | "analyzing" | "success" | "error";

interface UploadState {
  stage: UploadStage;
  progress: number;
  fileName: string | null;
  fileSize: string | null;
  errorMessage: string | null;
}

interface GenomicUploaderProps {
  /** POST endpoint that accepts multipart/form-data with field name "file" */
  apiEndpoint?: string;
  /** Redirect path after successful upload */
  redirectPath?: string;
  /** Extra form data to attach to the upload */
  extraFields?: Record<string, string>;
  /** Called with the server response on success */
  onSuccess?: (data: unknown) => void;
  /** Called on upload error */
  onError?: (error: string) => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const ACCEPTED_TYPES: Record<string, string[]> = {
  "text/csv": [".csv"],
  "text/plain": [".txt"],
  "text/x-vcard": [".vcf"],
  "application/octet-stream": [".vcf"],
};

const MAX_SIZE_BYTES = 50 * 1024 * 1024; // 50 MB

const ANALYSIS_MESSAGES = [
  "Analyzing genomic mutation patterns...",
  "Parsing variant call format data...",
  "Cross-referencing SNP databases...",
  "Mapping chromosomal positions...",
  "Calculating allele frequencies...",
  "Finalizing biomarker analysis...",
];

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function DNAHelix() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      className="mx-auto"
      aria-hidden="true"
    >
      <motion.path
        d="M12 4 C 20 10, 28 10, 36 4"
        stroke="url(#helix-grad-1)"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
        animate={{ d: ["M12 4 C 20 10, 28 10, 36 4", "M12 4 C 20 -2, 28 -2, 36 4", "M12 4 C 20 10, 28 10, 36 4"] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.path
        d="M12 16 C 20 22, 28 22, 36 16"
        stroke="url(#helix-grad-1)"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
        animate={{ d: ["M12 16 C 20 22, 28 22, 36 16", "M12 16 C 20 10, 28 10, 36 16", "M12 16 C 20 22, 28 22, 36 16"] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
      />
      <motion.path
        d="M12 28 C 20 34, 28 34, 36 28"
        stroke="url(#helix-grad-2)"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
        animate={{ d: ["M12 28 C 20 34, 28 34, 36 28", "M12 28 C 20 22, 28 22, 36 28", "M12 28 C 20 34, 28 34, 36 28"] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
      />
      <motion.path
        d="M12 40 C 20 46, 28 46, 36 40"
        stroke="url(#helix-grad-2)"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
        animate={{ d: ["M12 40 C 20 46, 28 46, 36 40", "M12 40 C 20 34, 28 34, 36 40", "M12 40 C 20 46, 28 46, 36 40"] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
      />
      {/* Rungs */}
      {[10, 22, 34].map((y, i) => (
        <motion.line
          key={i}
          x1="15"
          y1={y}
          x2="33"
          y2={y}
          stroke="rgba(96,165,250,0.4)"
          strokeWidth="1.5"
          strokeLinecap="round"
          animate={{ opacity: [0.3, 0.9, 0.3] }}
          transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.3, ease: "easeInOut" }}
        />
      ))}
      <defs>
        <linearGradient id="helix-grad-1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#a78bfa" />
        </linearGradient>
        <linearGradient id="helix-grad-2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#22d3ee" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function SequenceScanner({ progress }: { progress: number }) {
  return (
    <div className="relative w-full overflow-hidden rounded-lg bg-black/40 border border-cyan-500/20 p-4 font-mono text-xs">
      {/* Scanline */}
      <motion.div
        className="absolute inset-x-0 h-px bg-cyan-400/70 blur-[1px]"
        animate={{ top: ["0%", "100%"] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
      />
      {/* Fake genomic data */}
      {["ATCG GAAC TTAG CCGT AATC GGCA", "GCTA TTCG AAGC CGTA GCAA TTCG", "TACG CCTT AGGA AACC GGTT ATCG"].map(
        (line, i) => (
          <motion.p
            key={i}
            className="tracking-widest text-cyan-400/60 mb-1 last:mb-0"
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
          >
            {line}
          </motion.p>
        )
      )}
      {/* Progress bar */}
      <div className="mt-3 h-1 w-full rounded-full bg-white/10">
        <motion.div
          className="h-1 rounded-full bg-gradient-to-r from-cyan-400 to-violet-500"
          style={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
      <p className="mt-1.5 text-right text-cyan-400/70">{progress}%</p>
    </div>
  );
}

function AnalysisPhase() {
  const [msgIdx, setMsgIdx] = useState(0);

  useState(() => {
    const iv = setInterval(() => setMsgIdx((i) => (i + 1) % ANALYSIS_MESSAGES.length), 1800);
    return () => clearInterval(iv);
  });

  return (
    <div className="flex flex-col items-center gap-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        className="h-12 w-12 rounded-full border-2 border-transparent border-t-cyan-400 border-r-violet-500"
      />
      <AnimatePresence mode="wait">
        <motion.p
          key={msgIdx}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35 }}
          className="text-sm text-cyan-300 text-center font-mono tracking-wide"
        >
          {ANALYSIS_MESSAGES[msgIdx]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function GenomicUploader({
  apiEndpoint = "/api/upload",
  redirectPath = "/dashboard",
  extraFields = {},
  onSuccess,
  onError,
}: GenomicUploaderProps) {
  const router = useRouter();

  const [state, setState] = useState<UploadState>({
    stage: "idle",
    progress: 0,
    fileName: null,
    fileSize: null,
    errorMessage: null,
  });

  // ── File validation ──────────────────────────────────────────────────────
  const validateFile = (file: File): string | null => {
    const ext = file.name.split(".").pop()?.toLowerCase();
    const allowedExt = ["csv", "vcf", "txt"];
    if (!ext || !allowedExt.includes(ext))
      return `Unsupported format ".${ext}". Accepted: .csv, .vcf, .txt`;
    if (file.size > MAX_SIZE_BYTES)
      return `File too large (${formatBytes(file.size)}). Max 50 MB.`;
    return null;
  };

  // ── Upload handler ───────────────────────────────────────────────────────
  const handleUpload = useCallback(
    async (file: File) => {
      const validationError = validateFile(file);
      if (validationError) {
        setState((s) => ({ ...s, stage: "error", errorMessage: validationError }));
        onError?.(validationError);
        return;
      }

      setState({
        stage: "uploading",
        progress: 0,
        fileName: file.name,
        fileSize: formatBytes(file.size),
        errorMessage: null,
      });

      const formData = new FormData();
      formData.append("file", file);
      Object.entries(extraFields).forEach(([k, v]) => formData.append(k, v));

      try {
        const response = await axios.post(apiEndpoint, formData, {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (e: AxiosProgressEvent) => {
            if (e.total) {
              const pct = Math.round((e.loaded / e.total) * 100);
              setState((s) => ({ ...s, progress: pct }));
            }
          },
        });

        // Transition to "analyzing" phase after upload bytes complete
        setState((s) => ({ ...s, stage: "analyzing", progress: 100 }));

        // Simulate brief analysis delay (replace with real polling if needed)
        await new Promise((res) => setTimeout(res, 3200));

        setState((s) => ({ ...s, stage: "success" }));
        onSuccess?.(response.data);

        await new Promise((res) => setTimeout(res, 1000));
        router.push(redirectPath);
      } catch (err: unknown) {
        const msg =
          axios.isAxiosError(err)
            ? err.response?.data?.message ?? err.message
            : "Upload failed. Please try again.";
        setState((s) => ({ ...s, stage: "error", errorMessage: msg }));
        onError?.(msg);
      }
    },
    [apiEndpoint, redirectPath, extraFields, onSuccess, onError, router]
  );

  // ── Dropzone ─────────────────────────────────────────────────────────────
  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    accept: ACCEPTED_TYPES,
    maxSize: MAX_SIZE_BYTES,
    multiple: false,
    disabled: state.stage !== "idle" && state.stage !== "error",
    onDropAccepted: ([file]) => handleUpload(file),
    onDropRejected: ([rej]) => {
      const msg = rej.errors[0]?.message ?? "Invalid file.";
      setState((s) => ({ ...s, stage: "error", errorMessage: msg }));
    },
  });

  const reset = () =>
    setState({ stage: "idle", progress: 0, fileName: null, fileSize: null, errorMessage: null });

  // ── Derived UI flags ─────────────────────────────────────────────────────
  const isIdle = state.stage === "idle" || state.stage === "error";
  const borderColor = isDragReject
    ? "border-red-500"
    : isDragActive
    ? "border-cyan-400"
    : state.stage === "error"
    ? "border-red-500/60"
    : "border-white/10 hover:border-cyan-500/50";

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Glass card */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_0_80px_rgba(96,165,250,0.08)] overflow-hidden"
      >
        {/* Ambient glow top-left */}
        <div className="pointer-events-none absolute -top-20 -left-20 h-60 w-60 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-violet-500/10 blur-3xl" />

        <div className="relative p-8 sm:p-10">
          {/* Header */}
          <div className="mb-8 text-center">
            <DNAHelix />
            <h2 className="mt-4 text-2xl font-semibold tracking-tight text-white font-[family-name:var(--font-display,_'Syne',_sans-serif)]">
              Upload Genomic Data
            </h2>
            <p className="mt-1.5 text-sm text-white/40">
              Supported formats: <span className="text-cyan-400/80">.csv</span>,{" "}
              <span className="text-cyan-400/80">.vcf</span>,{" "}
              <span className="text-cyan-400/80">.txt</span> · Max 50 MB
            </p>
          </div>

          {/* ── IDLE / ERROR – Dropzone ── */}
          <AnimatePresence mode="wait">
            {isIdle && (
              <motion.div
                key="dropzone"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.3 }}
              >
                <div
                  {...getRootProps()}
                  className={`relative flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed px-8 py-14 cursor-pointer transition-colors duration-200 ${borderColor} bg-black/20`}
                >
                  <input {...getInputProps()} />

                  {/* Scan grid overlay */}
                  <div
                    className="pointer-events-none absolute inset-0 rounded-xl opacity-20"
                    style={{
                      backgroundImage:
                        "linear-gradient(rgba(96,165,250,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(96,165,250,0.15) 1px, transparent 1px)",
                      backgroundSize: "32px 32px",
                    }}
                  />

                  {/* Upload icon */}
                  <motion.div
                    animate={isDragActive ? { scale: 1.15 } : { scale: 1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="relative"
                  >
                    <div className="flex h-16 w-16 items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-500/10">
                      <svg
                        className="h-7 w-7 text-cyan-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                        />
                      </svg>
                    </div>
                    {isDragActive && (
                      <motion.div
                        className="absolute inset-0 rounded-full border border-cyan-400/60"
                        animate={{ scale: [1, 1.5], opacity: [0.6, 0] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                      />
                    )}
                  </motion.div>

                  <div className="text-center">
                    <p className="text-sm font-medium text-white/80">
                      {isDragActive ? "Release to upload" : "Drag & drop your file here"}
                    </p>
                    <p className="mt-1 text-xs text-white/40">or</p>
                    <button
                      type="button"
                      className="mt-2 rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-4 py-1.5 text-xs font-medium text-cyan-300 transition hover:bg-cyan-500/20 hover:border-cyan-400"
                    >
                      Browse files
                    </button>
                  </div>
                </div>

                {/* Error message */}
                <AnimatePresence>
                  {state.errorMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mt-4 flex items-start gap-2.5 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3"
                    >
                      <svg
                        className="mt-0.5 h-4 w-4 shrink-0 text-red-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                        />
                      </svg>
                      <p className="text-xs text-red-300">{state.errorMessage}</p>
                      <button
                        onClick={reset}
                        className="ml-auto shrink-0 text-red-400/60 hover:text-red-300 transition"
                        aria-label="Dismiss"
                      >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {/* ── UPLOADING ── */}
            {state.stage === "uploading" && (
              <motion.div
                key="uploading"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex flex-col gap-5"
              >
                {/* File badge */}
                <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/30 px-4 py-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/15 border border-cyan-500/20">
                    <svg className="h-4 w-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-white/90">{state.fileName}</p>
                    <p className="text-xs text-white/40">{state.fileSize}</p>
                  </div>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                    className="h-4 w-4 rounded-full border-2 border-transparent border-t-cyan-400"
                  />
                </div>
                <SequenceScanner progress={state.progress} />
              </motion.div>
            )}

            {/* ── ANALYZING ── */}
            {state.stage === "analyzing" && (
              <motion.div
                key="analyzing"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-6 py-4"
              >
                <AnalysisPhase />
                <SequenceScanner progress={100} />
              </motion.div>
            )}

            {/* ── SUCCESS ── */}
            {state.stage === "success" && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-3 py-6"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.1 }}
                  className="flex h-16 w-16 items-center justify-center rounded-full border border-emerald-400/40 bg-emerald-500/15"
                >
                  <svg className="h-8 w-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
                <p className="text-sm font-medium text-emerald-300">Analysis complete — redirecting to dashboard…</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
