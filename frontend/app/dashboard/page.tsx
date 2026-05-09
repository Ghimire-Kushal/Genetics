"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Activity, ArrowLeft, BrainCircuit, Database, Dna, FileUp, ShieldAlert } from "lucide-react";

type Summary = {
  disease?: string;
  risk_level?: string;
  confidence?: string;
  variants_found?: number;
  recommendation?: string;
};

type AnalysisPayload = {
  summary?: Summary;
  dataset_summary?: {
    total_rows?: number;
    total_columns?: number;
    columns?: string[];
    detected_mutation_columns?: string[];
  };
  ai_insights?: string[];
};

const DEMO_ANALYSIS: AnalysisPayload = {
  summary: {
    disease: "Mutation-associated genomic risk",
    risk_level: "Moderate",
    confidence: "78%",
    variants_found: 2,
    recommendation:
      "Mutation-related columns were detected. Review the variants with a genetics specialist and consider confirmatory clinical testing.",
  },
  dataset_summary: {
    total_rows: 1,
    total_columns: 2,
    columns: ["gene", "mutation"],
    detected_mutation_columns: ["gene", "mutation"],
  },
  ai_insights: [
    "Detected mutation-related genomic columns: gene, mutation",
    "Dataset size is manageable for rapid genomic processing.",
    "Gene mutation patterns identified for further clinical interpretation.",
    "Mutation markers detected for clinical review.",
  ],
};

const mutationFrequency = [
  { mutation: "BRCA1 delAG", frequency: 42 },
  { mutation: "TP53 R248Q", frequency: 31 },
  { mutation: "EGFR L858R", frequency: 24 },
  { mutation: "APOE rs429358", frequency: 18 },
  { mutation: "KRAS G12D", frequency: 12 },
];

const geneDistribution = [
  { name: "BRCA1", value: 32, color: "#22d3ee" },
  { name: "TP53", value: 26, color: "#a78bfa" },
  { name: "EGFR", value: 19, color: "#34d399" },
  { name: "KRAS", value: 13, color: "#fbbf24" },
  { name: "Other", value: 10, color: "#60a5fa" },
];

const mutationTrend = [
  { window: "Batch 1", variants: 18, confidence: 58 },
  { window: "Batch 2", variants: 24, confidence: 64 },
  { window: "Batch 3", variants: 21, confidence: 67 },
  { window: "Batch 4", variants: 32, confidence: 72 },
  { window: "Batch 5", variants: 28, confidence: 78 },
  { window: "Batch 6", variants: 36, confidence: 81 },
];

const mutationRows = [
  { gene: "BRCA1", variant: "c.68_69delAG", type: "Deletion", impact: "High", frequency: "42%" },
  { gene: "TP53", variant: "p.R248Q", type: "Missense", impact: "High", frequency: "31%" },
  { gene: "EGFR", variant: "L858R", type: "Substitution", impact: "Moderate", frequency: "24%" },
  { gene: "APOE", variant: "rs429358", type: "SNP", impact: "Moderate", frequency: "18%" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

function parsePercent(value: unknown) {
  const numeric = Number(String(value ?? "0").replace("%", ""));
  return Number.isFinite(numeric) ? numeric : 0;
}

function StatCard({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof Activity;
  label: string;
  value: string;
  tone: string;
}) {
  return (
    <motion.div
      variants={fadeUp}
      className="rounded-lg border border-white/10 bg-white/[0.035] p-5 transition duration-200 hover:-translate-y-0.5 hover:border-cyan-300/25 hover:bg-white/[0.055]"
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/40">{label}</p>
        <span className="rounded-lg border border-white/10 bg-black/20 p-2">
          <Icon className={`h-5 w-5 ${tone}`} />
        </span>
      </div>
      <p className="mt-4 truncate text-2xl font-semibold text-white">{value}</p>
    </motion.div>
  );
}

function LoadingDashboard() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#070b16] px-4 text-white">
      <div className="w-full max-w-md rounded-lg border border-white/10 bg-[#101827]/95 p-6 text-center shadow-2xl shadow-cyan-950/20">
        <motion.div
          className="mx-auto h-12 w-12 rounded-full border-2 border-transparent border-t-cyan-300 border-r-violet-300"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
        />
        <p className="mt-5 text-sm font-semibold text-white">Preparing dashboard</p>
        <p className="mt-1 text-xs text-white/45">Loading mutation charts and AI insights...</p>
      </div>
    </main>
  );
}

export default function DashboardPage() {
  const [analysis] = useState<AnalysisPayload>(() => {
    if (typeof window === "undefined") {
      return DEMO_ANALYSIS;
    }

    const stored = window.localStorage.getItem("genomicAnalysis");
    if (!stored) {
      return DEMO_ANALYSIS;
    }

    try {
      return JSON.parse(stored) as AnalysisPayload;
    } catch {
      window.localStorage.removeItem("genomicAnalysis");
      return DEMO_ANALYSIS;
    }
  });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), 350);
    return () => window.clearTimeout(timer);
  }, []);

  const summary = analysis.summary ?? DEMO_ANALYSIS.summary!;
  const dataset = analysis.dataset_summary ?? DEMO_ANALYSIS.dataset_summary!;
  const insights = analysis.ai_insights?.length ? analysis.ai_insights : DEMO_ANALYSIS.ai_insights!;
  const confidence = parsePercent(summary.confidence);
  const variantsFound = Number(summary.variants_found ?? dataset.detected_mutation_columns?.length ?? 0);

  const riskScore = useMemo(() => {
    const risk = String(summary.risk_level ?? "Unknown").toLowerCase();
    if (risk.includes("high")) return 86;
    if (risk.includes("moderate")) return 62;
    if (risk.includes("low")) return 28;
    return Math.max(20, Math.min(90, confidence));
  }, [summary.risk_level, confidence]);

  if (!ready) {
    return <LoadingDashboard />;
  }

  return (
    <main className="min-h-screen bg-[#070b16] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 45% at 50% -10%, rgba(34,211,238,0.14), transparent 70%), radial-gradient(ellipse 45% 35% at 90% 70%, rgba(167,139,250,0.12), transparent 65%)",
        }}
      />

      <motion.div
        className="relative mx-auto max-w-7xl"
        initial="hidden"
        animate="visible"
        transition={{ staggerChildren: 0.08 }}
      >
        <motion.header
          variants={fadeUp}
          className="mb-8 flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300/70">
              GScope Dashboard
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Genomic Analysis Overview
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/55">
              Review mutation signals, risk indicators, gene distribution, and AI-generated insights from the latest dataset.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Link
              href="/upload"
              className="inline-flex w-fit items-center gap-2 rounded-lg border border-white/15 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-white/75 transition hover:-translate-y-0.5 hover:border-cyan-300/40 hover:text-cyan-200"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Upload
            </Link>
            <Link
              href="/upload"
              className="inline-flex w-fit items-center gap-2 rounded-lg bg-cyan-400 px-4 py-2 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-950/30 transition hover:-translate-y-0.5 hover:bg-cyan-300"
            >
              <FileUp className="h-4 w-4" />
              Upload New Dataset
            </Link>
          </div>
        </motion.header>

        <motion.section variants={fadeUp} className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard icon={ShieldAlert} label="Risk Level" value={String(summary.risk_level ?? "Unknown")} tone="text-amber-300" />
          <StatCard icon={Activity} label="Confidence" value={String(summary.confidence ?? "0%")} tone="text-emerald-300" />
          <StatCard icon={Dna} label="Variants Found" value={String(variantsFound)} tone="text-cyan-300" />
          <StatCard icon={Database} label="Dataset Rows" value={String(dataset.total_rows ?? 0)} tone="text-violet-300" />
        </motion.section>

        <motion.section variants={fadeUp} className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
          <div className="rounded-lg border border-white/10 bg-[#101827]/95 p-5 shadow-xl shadow-black/10 transition duration-200 hover:border-cyan-300/20">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white">Mutation Frequency</h2>
                <p className="text-sm text-white/45">Observed frequency by mutation marker</p>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mutationFrequency}>
                  <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                  <XAxis dataKey="mutation" stroke="rgba(255,255,255,0.45)" tick={{ fontSize: 12 }} />
                  <YAxis stroke="rgba(255,255,255,0.45)" tick={{ fontSize: 12 }} />
                  <Tooltip
                    cursor={{ fill: "rgba(34,211,238,0.08)" }}
                    contentStyle={{
                      background: "#0b1220",
                      border: "1px solid rgba(255,255,255,0.12)",
                      borderRadius: 8,
                      color: "#fff",
                    }}
                  />
                  <Bar dataKey="frequency" radius={[6, 6, 0, 0]} fill="#22d3ee" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-[#101827]/95 p-5 shadow-xl shadow-black/10 transition duration-200 hover:border-amber-300/20">
            <h2 className="text-lg font-semibold text-white">Risk Indicator</h2>
            <p className="text-sm text-white/45">Composite risk score based on current summary</p>
            <div className="relative mt-3 h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart innerRadius="68%" outerRadius="95%" data={[{ name: "Risk", value: riskScore, fill: "#fbbf24" }]} startAngle={180} endAngle={0}>
                  <RadialBar dataKey="value" cornerRadius={12} background={{ fill: "rgba(255,255,255,0.08)" }} />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pt-14">
                <p className="text-4xl font-bold text-amber-300">{riskScore}%</p>
                <p className="mt-1 text-sm text-white/50">{summary.risk_level ?? "Unknown"} risk</p>
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section variants={fadeUp} className="mt-4 grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          <div className="rounded-lg border border-white/10 bg-[#101827]/95 p-5 shadow-xl shadow-black/10 transition duration-200 hover:border-violet-300/20">
            <h2 className="text-lg font-semibold text-white">Gene Distribution</h2>
            <p className="text-sm text-white/45">Share of detected variants by gene family</p>
            <div className="mt-3 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={geneDistribution} dataKey="value" nameKey="name" innerRadius={58} outerRadius={96} paddingAngle={4}>
                    {geneDistribution.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "#0b1220",
                      border: "1px solid rgba(255,255,255,0.12)",
                      borderRadius: 8,
                      color: "#fff",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {geneDistribution.map((item) => (
                <div key={item.name} className="flex items-center gap-2 text-xs text-white/55">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: item.color }} />
                  {item.name} · {item.value}%
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-[#101827]/95 p-5 shadow-xl shadow-black/10 transition duration-200 hover:border-cyan-300/20">
            <h2 className="text-lg font-semibold text-white">Mutation Trend</h2>
            <p className="text-sm text-white/45">Variant count and confidence across recent batches</p>
            <div className="mt-3 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mutationTrend}>
                  <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                  <XAxis dataKey="window" stroke="rgba(255,255,255,0.45)" tick={{ fontSize: 12 }} />
                  <YAxis stroke="rgba(255,255,255,0.45)" tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      background: "#0b1220",
                      border: "1px solid rgba(255,255,255,0.12)",
                      borderRadius: 8,
                      color: "#fff",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="variants"
                    stroke="#22d3ee"
                    strokeWidth={3}
                    dot={{ r: 4, fill: "#22d3ee", strokeWidth: 0 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="confidence"
                    stroke="#a78bfa"
                    strokeWidth={2}
                    dot={{ r: 3, fill: "#a78bfa", strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-[#101827]/95 p-5 shadow-xl shadow-black/10 transition duration-200 hover:border-emerald-300/20 lg:col-span-2 xl:col-span-1">
            <h2 className="text-lg font-semibold text-white">Mutation Result Table</h2>
            <p className="text-sm text-white/45">Prioritized markers for specialist review</p>
            <div className="mt-5 overflow-x-auto rounded-lg border border-white/10">
              <table className="min-w-[620px] w-full text-left text-sm">
                <thead className="bg-white/[0.04] text-xs uppercase tracking-wide text-white/45">
                  <tr>
                    <th className="px-4 py-3">Gene</th>
                    <th className="px-4 py-3">Variant</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Impact</th>
                    <th className="px-4 py-3 text-right">Frequency</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {mutationRows.map((row) => (
                    <tr key={`${row.gene}-${row.variant}`} className="text-white/70">
                      <td className="px-4 py-3 font-semibold text-cyan-200">{row.gene}</td>
                      <td className="px-4 py-3 font-mono text-xs">{row.variant}</td>
                      <td className="px-4 py-3">{row.type}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-md px-2 py-1 text-xs font-medium ${row.impact === "High" ? "bg-red-400/10 text-red-300" : "bg-amber-400/10 text-amber-300"}`}>
                          {row.impact}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-white">{row.frequency}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.section>

        <motion.section
          variants={fadeUp}
          className="mt-4 rounded-lg border border-cyan-300/20 bg-cyan-300/[0.06] p-5 shadow-xl shadow-cyan-950/10"
        >
          <div className="flex items-center gap-3">
            <BrainCircuit className="h-5 w-5 text-cyan-300" />
            <div>
              <h2 className="text-lg font-semibold text-white">AI Insight Panel</h2>
              <p className="text-sm text-white/45">Suggested interpretation from the analysis pipeline</p>
            </div>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {insights.map((insight) => (
              <div key={insight} className="rounded-lg border border-white/10 bg-[#07111f]/70 p-4 text-sm leading-6 text-white/70">
                {insight}
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-lg border border-white/10 bg-black/20 p-4 text-sm leading-6 text-white/65">
            <span className="font-semibold text-cyan-200">Recommendation: </span>
            {summary.recommendation ?? "Review the detected variants with a qualified specialist."}
          </div>
        </motion.section>
      </motion.div>
    </main>
  );
}
