"use client";

import { motion } from "framer-motion";
import { GenomicUploader } from "@/components/GenomicUploader";

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
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: "radial-gradient(rgba(96,165,250,0.5) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <motion.div
        className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent"
        animate={{ top: ["0%", "100%"] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}

const FEATURES = [
  { icon: "Mutation", label: "Mutation Detection" },
  { icon: "Variant", label: "Variant Analysis" },
  { icon: "SNP", label: "SNP Mapping" },
  { icon: "Secure", label: "Validated Uploads" },
];

export default function UploadPage() {
  return (
    <>
      <GridBackground />
      <main className="relative flex min-h-screen flex-col items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="w-full max-w-2xl">
          <div className="mb-10 flex items-center gap-2 font-mono text-xs text-white/30">
            <span className="text-cyan-500/60">GScope</span>
            <span>/</span>
            <span className="text-white/50">Upload</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mb-10 text-center"
          >
            <span className="mb-4 inline-flex items-center gap-2 rounded-lg border border-cyan-500/25 bg-cyan-500/10 px-3.5 py-1 text-xs font-medium text-cyan-300">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
              AI-Powered Genomics Engine
            </span>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Upload Your <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">Dataset</span>
            </h1>
            <p className="mx-auto mt-3 max-w-md text-base leading-relaxed text-white/45">
              Drag in a CSV or VCF file to validate, analyze, and generate dashboard-ready genomic insights.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <GenomicUploader
              apiEndpoint="/api/genomics/upload"
              redirectPath="/dashboard"
              onSuccess={(data) => console.info("[GScope] Upload successful:", data)}
              onError={(err) => console.error("[GScope] Upload error:", err)}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.5 }}
            className="mt-8 flex flex-wrap justify-center gap-2"
          >
            {FEATURES.map((f) => (
              <span
                key={f.label}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/50 backdrop-blur"
              >
                <span className="font-mono text-[10px] text-cyan-300/70">{f.icon}</span>
                {f.label}
              </span>
            ))}
          </motion.div>
        </div>
      </main>
    </>
  );
}
