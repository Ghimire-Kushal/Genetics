"use client";

import { motion } from "framer-motion";
import { GenomicUploader } from "@/components/GenomicUploader";

// ─── Particle dots (pure CSS, no extra deps) ──────────────────────────────────
function GridBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10"
      style={{
        background:
          "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(96,165,250,0.12) 0%, transparent 70%), radial-gradient(ellipse 60% 40% at 80% 80%, rgba(167,139,250,0.10) 0%, transparent 60%), #06060e",
      }}
    >
      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: "radial-gradient(rgba(96,165,250,0.5) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      {/* Horizontal scan line animation */}
      <motion.div
        className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent"
        animate={{ top: ["0%", "100%"] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}

// ─── Breadcrumb / nav hint ────────────────────────────────────────────────────
function TopBreadcrumb() {
  return (
    <div className="mb-10 flex items-center gap-2 text-xs text-white/30 font-mono">
      <span className="text-cyan-500/60">GeneScope</span>
      <span>/</span>
      <span className="text-white/50">Upload</span>
    </div>
  );
}

// ─── Feature pills ────────────────────────────────────────────────────────────
const FEATURES = [
  { icon: "🔬", label: "Mutation Detection" },
  { icon: "📊", label: "Variant Analysis" },
  { icon: "🧬", label: "SNP Mapping" },
  { icon: "🛡️", label: "End-to-End Encrypted" },
];

function FeaturePills() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.55, duration: 0.5 }}
      className="mt-8 flex flex-wrap justify-center gap-2"
    >
      {FEATURES.map((f) => (
        <span
          key={f.label}
          className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/50 backdrop-blur"
        >
          <span>{f.icon}</span>
          {f.label}
        </span>
      ))}
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function UploadPage() {
  return (
    <>
      <GridBackground />

      <main className="relative min-h-screen flex flex-col items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="w-full max-w-2xl">
          <TopBreadcrumb />

          {/* Page heading */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mb-10 text-center"
          >
            {/* Badge */}
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-500/25 bg-cyan-500/10 px-3.5 py-1 text-xs font-medium text-cyan-300">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
              AI-Powered Genomics Engine
            </span>

            <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl font-[family-name:var(--font-display,'Syne',sans-serif)]">
              Decode Your{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
                Genome
              </span>
            </h1>

            <p className="mt-3 max-w-md mx-auto text-base text-white/40 leading-relaxed">
              Upload your raw genomic file and GeneScope will surface mutation patterns,
              variant calls, and biomarker insights in seconds.
            </p>
          </motion.div>

          {/* Uploader */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <GenomicUploader
              apiEndpoint="/api/genomics/upload"
              redirectPath="/dashboard"
              onSuccess={(data) => console.info("[GeneScope] Upload successful:", data)}
              onError={(err) => console.error("[GeneScope] Upload error:", err)}
            />
          </motion.div>

          <FeaturePills />

          {/* Privacy note */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-6 text-center text-xs text-white/25"
          >
            Your data is encrypted in transit and at rest. We never share genomic data with third parties.
          </motion.p>
        </div>
      </main>
    </>
  );
}
