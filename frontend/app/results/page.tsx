"use client";

import { useState } from "react";

function cleanRecommendation(value: unknown) {
  const fallback = "No recommendation available";
  const recommendation = String(value ?? fallback);
  const errorIndex = recommendation.search(/AI medical insight generation|Error code:|Details:/i);

  if (errorIndex === -1) {
    return recommendation;
  }

  const cleaned = recommendation.slice(0, errorIndex).trim();
  return cleaned || fallback;
}

export default function ResultsPage() {
  const [data] = useState<Record<string, unknown> | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }

    const stored = window.localStorage.getItem("genomicResult");

    if (!stored || stored === "undefined") {
      window.localStorage.removeItem("genomicResult");
      return null;
    }

    try {
      const parsed = JSON.parse(stored) as Record<string, unknown>;
      return {
        ...parsed,
        recommendation: cleanRecommendation(parsed.recommendation),
      };
    } catch {
      window.localStorage.removeItem("genomicResult");
      return null;
    }
  });

  if (!data) {
    return (
      <main className="min-h-screen bg-[#070b16] text-white flex items-center justify-center px-6">
        <div className="rounded-lg border border-white/10 bg-white/[0.04] px-5 py-4 text-sm text-white/60">
          No analysis results yet. Upload a genomic file to generate a report.
        </div>
      </main>
    );
  }

  const resultRows = [
    ["Disease", String(data.disease ?? "Unknown"), "text-white"],
    ["Risk Level", String(data.risk_level ?? "Unknown"), "text-amber-300"],
    ["Confidence", String(data.confidence ?? "0%"), "text-emerald-300"],
    ["Variants Found", String(data.variants_found ?? "Unknown"), "text-cyan-300"],
  ];
  const recommendation = cleanRecommendation(data.recommendation);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#070b16] px-4 py-10 text-white sm:px-6 lg:px-8">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% -10%, rgba(6,182,212,0.14), transparent 70%), radial-gradient(ellipse 40% 35% at 85% 70%, rgba(139,92,246,0.12), transparent 65%)",
        }}
      />
      <div className="relative flex w-full max-w-4xl justify-center">
        <section className="w-full rounded-xl border border-white/10 bg-[#101827]/95 p-6 shadow-2xl shadow-cyan-950/20 sm:p-8">
          <div className="mb-7 flex flex-col gap-3 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-cyan-300/70">
                GScope Report
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-cyan-300 sm:text-4xl">
                Genomic Analysis Results
              </h1>
            </div>
            <span className="w-fit rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
              Analysis complete
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {resultRows.map(([label, value, valueClass]) => (
              <div
                key={label}
                className="rounded-lg border border-white/10 bg-white/[0.035] px-4 py-3"
              >
                <p className="text-xs font-medium uppercase tracking-wide text-white/45">{label}</p>
                <p className={`mt-1 text-xl font-semibold ${valueClass}`}>{value}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-lg border border-cyan-400/20 bg-cyan-400/[0.06] p-5">
            <p className="text-sm font-semibold text-cyan-200">Recommendation</p>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-white/70">
              {recommendation}
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
