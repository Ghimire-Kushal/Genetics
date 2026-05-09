"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AreaChart, Area, BarChart, Bar, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell, Legend,
} from "recharts";

// ─── MOCK DATA ────────────────────────────────────────────────────────────────

const SUMMARY = {
  totalVariants: 24_718,
  pathogenic: 342,
  coverageDepth: "94.7×",
  riskScore: 67,
};

const MUTATION_TIMELINE = [
  { chr: "Jan", snp: 210, indel: 45, sv: 12 },
  { chr: "Feb", snp: 290, indel: 62, sv: 18 },
  { chr: "Mar", snp: 188, indel: 38, sv: 9 },
  { chr: "Apr", snp: 340, indel: 71, sv: 22 },
  { chr: "May", snp: 412, indel: 88, sv: 31 },
  { chr: "Jun", snp: 378, indel: 79, sv: 27 },
  { chr: "Jul", snp: 502, indel: 104, sv: 39 },
  { chr: "Aug", snp: 467, indel: 98, sv: 35 },
  { chr: "Sep", snp: 391, indel: 82, sv: 28 },
  { chr: "Oct", snp: 544, indel: 113, sv: 42 },
  { chr: "Nov", snp: 489, indel: 101, sv: 37 },
  { chr: "Dec", snp: 623, indel: 129, sv: 51 },
];

const CHROMOSOME_BURDEN = [
  { chr: "1", count: 1823 }, { chr: "2", count: 1542 }, { chr: "3", count: 1318 },
  { chr: "4", count: 989 },  { chr: "5", count: 1102 }, { chr: "6", count: 876 },
  { chr: "7", count: 934 },  { chr: "8", count: 711 },  { chr: "9", count: 648 },
  { chr: "10", count: 723 }, { chr: "11", count: 812 }, { chr: "12", count: 698 },
  { chr: "17", count: 1241 },{ chr: "X", count: 445 },  { chr: "Y", count: 88 },
];

const PATHWAY_RADAR = [
  { axis: "Oncogenesis", value: 78 },
  { axis: "DNA Repair", value: 62 },
  { axis: "Apoptosis", value: 45 },
  { axis: "Cell Cycle", value: 83 },
  { axis: "Signaling", value: 70 },
  { axis: "Metabolism", value: 38 },
];

const MUTATION_TYPES = [
  { name: "Missense", value: 11240, pct: 45.5 },
  { name: "Silent",   value: 7416,  pct: 30.0 },
  { name: "Nonsense", value: 2720,  pct: 11.0 },
  { name: "Frameshift", value: 1731, pct: 7.0 },
  { name: "Splice",   value: 991,   pct: 4.0 },
  { name: "Other",    value: 620,   pct: 2.5 },
];

const TYPE_COLORS = ["#22d3ee", "#818cf8", "#f472b6", "#fb923c", "#34d399", "#94a3b8"];

const VARIANTS_TABLE = [
  { id: "VAR-001", gene: "BRCA1", chr: "17q21.31", type: "Missense", impact: "HIGH",   af: "0.0032", clin: "Pathogenic",   consequence: "p.Cys61Gly" },
  { id: "VAR-002", gene: "TP53",  chr: "17p13.1",  type: "Nonsense", impact: "HIGH",   af: "0.0018", clin: "Pathogenic",   consequence: "p.Arg248Ter" },
  { id: "VAR-003", gene: "KRAS",  chr: "12p12.1",  type: "Missense", impact: "HIGH",   af: "0.0041", clin: "Likely Pathogenic", consequence: "p.Gly12Val" },
  { id: "VAR-004", gene: "PTEN",  chr: "10q23.31", type: "Frameshift", impact: "HIGH", af: "0.0009", clin: "Pathogenic",   consequence: "p.Glu7fs" },
  { id: "VAR-005", gene: "MLH1",  chr: "3p22.2",   type: "Splice",   impact: "MOD",    af: "0.0074", clin: "VUS",          consequence: "c.1038+2T>C" },
  { id: "VAR-006", gene: "EGFR",  chr: "7p11.2",   type: "Missense", impact: "MOD",    af: "0.0128", clin: "VUS",          consequence: "p.Thr790Met" },
  { id: "VAR-007", gene: "ATM",   chr: "11q22.3",  type: "Missense", impact: "LOW",    af: "0.0312", clin: "Benign",       consequence: "p.Asp1853Glu" },
  { id: "VAR-008", gene: "CDH1",  chr: "16q22.1",  type: "Silent",   impact: "LOW",    af: "0.1843", clin: "Benign",       consequence: "p.Ala298Ala" },
];

const AI_INSIGHTS = [
  {
    priority: "critical",
    title: "BRCA1 Cys61Gly Detected",
    body: "Pathogenic missense variant in BRCA1 at position 17q21.31. Associated with elevated risk of hereditary breast and ovarian cancer (HBOC). Penetrance ~72% by age 80. Consider PARP inhibitor sensitivity testing.",
    tags: ["HBOC", "Oncology", "Hereditary"],
  },
  {
    priority: "high",
    title: "TP53 Hotspot Variant",
    body: "Nonsense mutation at codon 248 — most frequently mutated residue in human cancers. Loss of p53 tumor suppressor function. Recommend Li-Fraumeni syndrome (LFS) workup and surveillance protocol initiation.",
    tags: ["LFS", "Tumor Suppressor", "Surveillance"],
  },
  {
    priority: "medium",
    title: "KRAS G12V — RAS Pathway Activation",
    body: "Activating mutation driving constitutive MAPK/ERK signaling. Conferring resistance to anti-EGFR therapies. MEK inhibitor combinations may restore sensitivity. Allele frequency 0.41% suggests subclonal origin.",
    tags: ["MAPK", "Drug Resistance", "Subclonal"],
  },
  {
    priority: "low",
    title: "MLH1 Splice Variant — Uncertain Significance",
    body: "Intronic splice acceptor change. Functional RNA splicing assay recommended. If pathogenic, mismatch repair deficiency and Lynch syndrome implication. Annual colonoscopy surveillance warranted pending classification.",
    tags: ["Lynch Syndrome", "MMR", "VUS"],
  },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { key: "dashboard", label: "Overview", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { key: "mutations", label: "Variants", icon: "M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" },
  { key: "insights", label: "AI Insights", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
  { key: "pathways", label: "Pathways", icon: "M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" },
  { key: "reports", label: "Reports", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
];

function impactColor(impact: string) {
  if (impact === "HIGH") return "text-rose-400 bg-rose-500/10 border-rose-500/20";
  if (impact === "MOD") return "text-amber-400 bg-amber-500/10 border-amber-500/20";
  return "text-slate-400 bg-slate-500/10 border-slate-500/20";
}

function clinColor(clin: string) {
  if (clin === "Pathogenic") return "text-rose-400";
  if (clin === "Likely Pathogenic") return "text-orange-400";
  if (clin === "VUS") return "text-amber-400";
  return "text-emerald-400";
}

function priorityStyle(p: string) {
  if (p === "critical") return { border: "border-rose-500/40", glow: "bg-rose-500", label: "CRITICAL", labelCls: "text-rose-400 bg-rose-500/10" };
  if (p === "high")     return { border: "border-orange-500/40", glow: "bg-orange-400", label: "HIGH", labelCls: "text-orange-400 bg-orange-500/10" };
  if (p === "medium")   return { border: "border-amber-500/30", glow: "bg-amber-400", label: "MEDIUM", labelCls: "text-amber-400 bg-amber-500/10" };
  return { border: "border-cyan-500/20", glow: "bg-cyan-400", label: "LOW", labelCls: "text-cyan-400 bg-cyan-500/10" };
}

// Animated counter
function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = to / 60;
    const iv = setInterval(() => {
      start += step;
      if (start >= to) { setVal(to); clearInterval(iv); }
      else setVal(Math.floor(start));
    }, 16);
    return () => clearInterval(iv);
  }, [to]);
  return <>{val.toLocaleString()}{suffix}</>;
}

// Custom tooltip
function GlassTooltip({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-white/10 bg-[#0d1117]/90 backdrop-blur px-3 py-2 text-xs shadow-xl">
      <p className="mb-1.5 font-mono text-white/40">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: p.color }} />
          <span className="text-white/60">{p.name}</span>
          <span className="ml-auto pl-4 font-mono text-white">{p.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}

// ─── PANELS ──────────────────────────────────────────────────────────────────

function SummaryCards() {
  const cards = [
    { label: "Total Variants", value: SUMMARY.totalVariants, icon: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z", color: "cyan", suffix: "" },
    { label: "Pathogenic", value: SUMMARY.pathogenic, icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z", color: "rose", suffix: "" },
    { label: "Coverage Depth", value: 0, icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z", color: "violet", static: "94.7×" },
    { label: "Polygenic Risk", value: SUMMARY.riskScore, icon: "M13 10V3L4 14h7v7l9-11h-7z", color: "amber", suffix: "/100" },
  ];

  const colorMap: Record<string, string> = {
    cyan: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
    rose: "text-rose-400 bg-rose-500/10 border-rose-500/20",
    violet: "text-violet-400 bg-violet-500/10 border-violet-500/20",
    amber: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  };

  return (
    <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
      {cards.map((c, i) => (
        <motion.div
          key={c.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + i * 0.08, duration: 0.5 }}
          className="relative overflow-hidden rounded-xl border border-white/8 bg-white/[0.04] p-5 backdrop-blur"
        >
          <div className="absolute right-3 top-3">
            <div className={`flex h-8 w-8 items-center justify-center rounded-lg border ${colorMap[c.color]}`}>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d={c.icon} />
              </svg>
            </div>
          </div>
          <p className="text-xs font-medium uppercase tracking-widest text-white/30">{c.label}</p>
          <p className="mt-2 font-mono text-2xl font-bold text-white">
            {c.static ?? <Counter to={c.value} suffix={c.suffix} />}
          </p>
        </motion.div>
      ))}
    </div>
  );
}

function MutationTimeline() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.45, duration: 0.5 }}
      className="rounded-xl border border-white/8 bg-white/[0.03] p-5"
    >
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white">Variant Discovery Timeline</h3>
          <p className="text-xs text-white/30">SNP · InDel · SV — monthly accumulation</p>
        </div>
        <div className="flex gap-4 text-xs">
          {[["#22d3ee","SNP"],["#818cf8","InDel"],["#f472b6","SV"]].map(([c,l]) => (
            <span key={l} className="flex items-center gap-1.5 text-white/40">
              <span className="h-2 w-2 rounded-full" style={{ background: c }} />{l}
            </span>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={MUTATION_TIMELINE} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
          <defs>
            {[["snpGrad","#22d3ee"],["indelGrad","#818cf8"],["svGrad","#f472b6"]].map(([id, c]) => (
              <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={c} stopOpacity={0.3} />
                <stop offset="95%" stopColor={c} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="chr" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip content={<GlassTooltip />} />
          <Area type="monotone" dataKey="snp"   name="SNP"   stroke="#22d3ee" fill="url(#snpGrad)"   strokeWidth={1.5} dot={false} />
          <Area type="monotone" dataKey="indel"  name="InDel" stroke="#818cf8" fill="url(#indelGrad)" strokeWidth={1.5} dot={false} />
          <Area type="monotone" dataKey="sv"     name="SV"    stroke="#f472b6" fill="url(#svGrad)"    strokeWidth={1.5} dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

function ChromosomeBurden() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.55, duration: 0.5 }}
      className="rounded-xl border border-white/8 bg-white/[0.03] p-5"
    >
      <h3 className="mb-1 text-sm font-semibold text-white">Chromosomal Mutation Burden</h3>
      <p className="mb-4 text-xs text-white/30">Variant count per chromosome</p>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={CHROMOSOME_BURDEN} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis dataKey="chr" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} axisLine={false} tickLine={false} />
          <Tooltip content={<GlassTooltip />} />
          <Bar dataKey="count" name="Variants" radius={[3, 3, 0, 0]}>
            {CHROMOSOME_BURDEN.map((_, i) => (
              <Cell key={i} fill={i === 12 ? "#22d3ee" : i === 1 ? "#818cf8" : "rgba(99,102,241,0.45)"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

function MutationTypeBreakdown() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.5 }}
      className="rounded-xl border border-white/8 bg-white/[0.03] p-5"
    >
      <h3 className="mb-1 text-sm font-semibold text-white">Mutation Classification</h3>
      <p className="mb-4 text-xs text-white/30">By functional consequence</p>
      <div className="space-y-2.5">
        {MUTATION_TYPES.map((t, i) => (
          <div key={t.name} className="flex items-center gap-3">
            <span className="w-20 shrink-0 text-xs text-white/50">{t.name}</span>
            <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-white/5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${t.pct}%` }}
                transition={{ delay: 0.7 + i * 0.06, duration: 0.7, ease: "easeOut" }}
                className="absolute inset-y-0 left-0 rounded-full"
                style={{ background: TYPE_COLORS[i] }}
              />
            </div>
            <span className="w-10 text-right font-mono text-xs text-white/40">{t.pct}%</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function PathwayRadar() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.65, duration: 0.5 }}
      className="rounded-xl border border-white/8 bg-white/[0.03] p-5"
    >
      <h3 className="mb-1 text-sm font-semibold text-white">Pathway Impact Score</h3>
      <p className="mb-2 text-xs text-white/30">Normalized enrichment per pathway</p>
      <ResponsiveContainer width="100%" height={220}>
        <RadarChart data={PATHWAY_RADAR} margin={{ top: 4, right: 20, bottom: 4, left: 20 }}>
          <PolarGrid stroke="rgba(255,255,255,0.08)" />
          <PolarAngleAxis dataKey="axis" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} />
          <Radar name="Score" dataKey="value" stroke="#22d3ee" fill="#22d3ee" fillOpacity={0.18} strokeWidth={1.5} />
        </RadarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

function AIInsightsPanel() {
  const [expanded, setExpanded] = useState<number | null>(0);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.35, duration: 0.5 }}
      className="flex flex-col rounded-xl border border-white/8 bg-white/[0.03] p-5"
    >
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-violet-500/20">
          <svg className="h-3.5 w-3.5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h3 className="text-sm font-semibold text-white">AI Clinical Insights</h3>
        <span className="ml-auto rounded-full bg-violet-500/15 px-2 py-0.5 text-[10px] font-medium text-violet-300">
          GPT-4o · Live
        </span>
      </div>

      <div className="space-y-2 overflow-y-auto" style={{ maxHeight: 480 }}>
        {AI_INSIGHTS.map((ins, i) => {
          const s = priorityStyle(ins.priority);
          const open = expanded === i;
          return (
            <button
              key={i}
              onClick={() => setExpanded(open ? null : i)}
              className={`w-full rounded-lg border text-left transition-colors duration-150 ${s.border} ${open ? "bg-white/[0.04]" : "bg-transparent hover:bg-white/[0.02]"}`}
            >
              <div className="flex items-start gap-3 p-3">
                <span className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${s.glow}`} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold tracking-wider ${s.labelCls}`}>
                      {s.label}
                    </span>
                    <span className="truncate text-xs font-medium text-white/80">{ins.title}</span>
                  </div>
                  <AnimatePresence>
                    {open && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <p className="mt-2 text-xs leading-relaxed text-white/50">{ins.body}</p>
                        <div className="mt-2.5 flex flex-wrap gap-1.5">
                          {ins.tags.map((t) => (
                            <span key={t} className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] text-white/40">
                              {t}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <svg
                  className={`h-4 w-4 shrink-0 text-white/20 transition-transform ${open ? "rotate-180" : ""}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}

function VariantTable() {
  const [filter, setFilter] = useState<"ALL" | "HIGH" | "MOD" | "LOW">("ALL");
  const rows = filter === "ALL" ? VARIANTS_TABLE : VARIANTS_TABLE.filter((v) => v.impact === filter);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.75, duration: 0.5 }}
      className="rounded-xl border border-white/8 bg-white/[0.03] p-5"
    >
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div>
          <h3 className="text-sm font-semibold text-white">Variant Call Table</h3>
          <p className="text-xs text-white/30">Clinically annotated · VCF v4.3</p>
        </div>
        <div className="ml-auto flex gap-1">
          {(["ALL", "HIGH", "MOD", "LOW"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-md px-3 py-1 text-xs font-medium transition ${
                filter === f ? "bg-cyan-500/20 text-cyan-300" : "text-white/30 hover:text-white/60"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-white/5">
              {["ID", "Gene", "Locus", "Type", "Impact", "AF", "Clinical", "Consequence"].map((h) => (
                <th key={h} className="pb-2 pr-4 text-left font-medium text-white/25 last:pr-0">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {rows.map((v, i) => (
                <motion.tr
                  key={v.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="border-b border-white/[0.03] hover:bg-white/[0.02]"
                >
                  <td className="py-2.5 pr-4 font-mono text-white/40">{v.id}</td>
                  <td className="py-2.5 pr-4 font-semibold text-cyan-400">{v.gene}</td>
                  <td className="py-2.5 pr-4 font-mono text-white/40">{v.chr}</td>
                  <td className="py-2.5 pr-4 text-white/60">{v.type}</td>
                  <td className="py-2.5 pr-4">
                    <span className={`rounded border px-1.5 py-0.5 text-[10px] font-bold tracking-wider ${impactColor(v.impact)}`}>
                      {v.impact}
                    </span>
                  </td>
                  <td className="py-2.5 pr-4 font-mono text-white/40">{v.af}</td>
                  <td className={`py-2.5 pr-4 font-medium ${clinColor(v.clin)}`}>{v.clin}</td>
                  <td className="py-2.5 font-mono text-white/40">{v.consequence}</td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

// ─── SIDEBAR ─────────────────────────────────────────────────────────────────

function Sidebar({ active, setActive, collapsed, setCollapsed }: {
  active: string; setActive: (k: string) => void;
  collapsed: boolean; setCollapsed: (v: boolean) => void;
}) {
  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 220 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="relative flex h-full flex-col border-r border-white/8 bg-[#0a0d14] overflow-hidden"
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 px-4 border-b border-white/8">
        <div className="h-8 w-8 shrink-0 rounded-lg bg-gradient-to-br from-cyan-400 to-violet-500 flex items-center justify-center">
          <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
          </svg>
        </div>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="font-bold tracking-tight text-white text-sm whitespace-nowrap"
          >
            GScope <span className="text-cyan-400">AI</span>
          </motion.span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto shrink-0 text-white/20 hover:text-white/60 transition"
          aria-label="Toggle sidebar"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={collapsed ? "M13 5l7 7-7 7M5 5l7 7-7 7" : "M11 19l-7-7 7-7m8 14l-7-7 7-7"} />
          </svg>
        </button>
      </div>

      {/* Sample info */}
      {!collapsed && (
        <div className="mx-3 mt-4 rounded-lg border border-white/8 bg-white/[0.03] p-3">
          <p className="text-[10px] uppercase tracking-widest text-white/25">Active Sample</p>
          <p className="mt-1 text-xs font-semibold text-white">GS-2024-7741</p>
          <p className="text-[10px] text-white/30">WGS · hg38 · Apr 2024</p>
          <div className="mt-2 h-1 w-full rounded-full bg-white/5">
            <div className="h-1 w-[94%] rounded-full bg-gradient-to-r from-cyan-400 to-violet-500" />
          </div>
          <p className="mt-1 text-right text-[10px] text-cyan-400/70">94.7× depth</p>
        </div>
      )}

      {/* Nav */}
      <nav className="mt-4 flex-1 space-y-0.5 px-2">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.key}
            onClick={() => setActive(item.key)}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
              active === item.key
                ? "bg-cyan-500/10 text-cyan-400"
                : "text-white/30 hover:bg-white/[0.03] hover:text-white/70"
            }`}
          >
            <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
            </svg>
            {!collapsed && <span className="text-xs font-medium">{item.label}</span>}
            {!collapsed && active === item.key && (
              <span className="ml-auto h-1.5 w-1.5 rounded-full bg-cyan-400" />
            )}
          </button>
        ))}
      </nav>

      {/* Bottom user */}
      <div className={`border-t border-white/8 p-3 ${collapsed ? "flex justify-center" : ""}`}>
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 shrink-0 rounded-full bg-gradient-to-br from-violet-400 to-cyan-400 flex items-center justify-center text-[10px] font-bold text-white">
            DR
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-white/70">Dr. Reyes</p>
              <p className="truncate text-[10px] text-white/30">Genomics Lab</p>
            </div>
          )}
        </div>
      </div>
    </motion.aside>
  );
}

// ─── TOP BAR ─────────────────────────────────────────────────────────────────

function TopBar() {
  return (
    <header className="flex h-16 shrink-0 items-center gap-4 border-b border-white/8 bg-[#0a0d14]/80 px-6 backdrop-blur">
      <div>
        <h1 className="text-sm font-semibold text-white">Mutation Analysis Dashboard</h1>
        <p className="text-xs text-white/30">Sample GS-2024-7741 · Last updated 2 min ago</p>
      </div>
      <div className="ml-auto flex items-center gap-3">
        {/* Live badge */}
        <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-medium text-emerald-400">
          <motion.span
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.8, repeat: Infinity }}
            className="h-1.5 w-1.5 rounded-full bg-emerald-400"
          />
          LIVE
        </span>
        <button className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-white/60 transition hover:text-white/90">
          Export VCF
        </button>
        <button className="rounded-lg bg-gradient-to-r from-cyan-500 to-violet-600 px-3 py-1.5 text-xs font-semibold text-white shadow-lg transition hover:opacity-90">
          Full Report
        </button>
      </div>
    </header>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [activeNav, setActiveNav] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className="flex h-screen overflow-hidden font-[family-name:var(--font-mono,'IBM_Plex_Mono',monospace)]"
      style={{
        background: "radial-gradient(ellipse 80% 50% at 20% 0%, rgba(34,211,238,0.06) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 85% 80%, rgba(129,140,248,0.07) 0%, transparent 55%), #080b12",
      }}
    >
      {/* Dot grid ambient */}
      <div
        className="pointer-events-none fixed inset-0 opacity-20"
        style={{
          backgroundImage: "radial-gradient(rgba(99,102,241,0.4) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <Sidebar active={activeNav} setActive={setActiveNav} collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className="relative flex flex-1 flex-col overflow-hidden">
        <TopBar />

        <main className="flex-1 overflow-y-auto p-5">
          <SummaryCards />

          <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-3">
            {/* Left column: charts */}
            <div className="flex flex-col gap-5 xl:col-span-2">
              <MutationTimeline />
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <ChromosomeBurden />
                <PathwayRadar />
              </div>
              <MutationTypeBreakdown />
              <VariantTable />
            </div>

            {/* Right column: AI insights */}
            <div className="xl:col-span-1">
              <AIInsightsPanel />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
