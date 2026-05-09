import Link from "next/link";
import { ArrowRight, Database, Dna, FileUp, Microscope, ShieldCheck, Sparkles } from "lucide-react";

const problemPoints = [
  "Variant files are hard to interpret without specialist tooling.",
  "Manual review slows down mutation triage and reporting.",
  "Clinical and research teams need clear summaries from raw genomic data.",
];

const solutionPoints = [
  {
    icon: Database,
    title: "Structured intake",
    text: "Upload CSV or VCF datasets and normalize them into an analysis-ready format.",
  },
  {
    icon: Microscope,
    title: "Mutation signal detection",
    text: "Identify mutation-related fields, variant counts, and risk signals for review.",
  },
  {
    icon: Sparkles,
    title: "Readable summaries",
    text: "Translate technical genomic patterns into a concise report for decision support.",
  },
];

function SequenceField() {
  const rows = [
    "ATCG  BRCA1  c.68_69delAG  chr17",
    "GCTA  TP53   p.R248Q       chr17",
    "TTAG  EGFR   L858R         chr7",
    "CGAT  APOE   rs429358      chr19",
  ];

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden opacity-45">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.08)_1px,transparent_1px)] bg-[size:42px_42px]" />
      <div className="absolute left-1/2 top-0 h-full w-[42rem] -translate-x-1/2">
        <div className="absolute inset-y-0 left-1/2 w-px bg-cyan-300/20" />
        {Array.from({ length: 20 }).map((_, index) => (
          <div
            key={index}
            className="absolute h-px w-40 bg-gradient-to-r from-transparent via-cyan-300/40 to-transparent"
            style={{
              left: `${index % 2 === 0 ? 34 : 42}%`,
              top: `${index * 5 + 2}%`,
              transform: `rotate(${index % 2 === 0 ? 22 : -22}deg)`,
            }}
          />
        ))}
      </div>
      <div className="absolute bottom-14 left-1/2 grid w-[min(92vw,760px)] -translate-x-1/2 gap-2 font-mono text-xs text-cyan-100/35">
        {rows.map((row) => (
          <div key={row} className="border-l border-cyan-300/20 pl-3">
            {row}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-[#070b16] text-white">
      <nav className="fixed inset-x-0 top-0 z-30 border-b border-white/10 bg-[#070b16]/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2 text-sm font-semibold text-white">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-300/25 bg-cyan-300/10">
              <Dna className="h-4 w-4 text-cyan-300" />
            </span>
            GScope AI
          </Link>
          <div className="hidden items-center gap-6 text-sm text-white/60 sm:flex">
            <a href="#problem" className="transition hover:text-cyan-300">Problem</a>
            <a href="#solution" className="transition hover:text-cyan-300">Solution</a>
          </div>
          <Link
            href="/upload"
            className="inline-flex items-center gap-2 rounded-lg bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
          >
            <FileUp className="h-4 w-4" />
            Upload Dataset
          </Link>
        </div>
      </nav>

      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 pt-20 sm:px-6 lg:px-8">
        <SequenceField />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_55%_at_50%_0%,rgba(34,211,238,0.18),transparent_70%)]" />
        <div className="relative z-10 mx-auto max-w-5xl text-center">
          <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-lg border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-cyan-200">
            Bioinformatics mutation analysis
          </div>
          <h1 className="mx-auto max-w-4xl text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
            Turn genomic datasets into clear mutation insights.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-white/65 sm:text-lg">
            GScope AI helps teams upload raw genomic files, detect variant signals, and review a readable analysis report in minutes.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/upload"
              className="inline-flex h-12 items-center gap-2 rounded-lg bg-cyan-400 px-6 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-950/30 transition hover:bg-cyan-300"
            >
              Upload Dataset
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#solution"
              className="inline-flex h-12 items-center rounded-lg border border-white/15 px-6 text-sm font-semibold text-white/75 transition hover:border-cyan-300/40 hover:text-cyan-200"
            >
              See how it works
            </a>
          </div>
        </div>
      </section>

      <section id="problem" className="border-y border-white/10 bg-[#0b1220] px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rose-300/80">Problem statement</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Raw genomic files are rich, but rarely easy to act on.
            </h2>
          </div>
          <div className="grid gap-3">
            {problemPoints.map((point) => (
              <div key={point} className="rounded-lg border border-white/10 bg-white/[0.035] p-4 text-white/70">
                {point}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="solution" className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-300/80">Solution overview</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              A focused workflow for upload, analysis, and review.
            </h2>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {solutionPoints.map((item) => (
              <div key={item.title} className="rounded-lg border border-white/10 bg-[#101827] p-5">
                <item.icon className="h-6 w-6 text-cyan-300" />
                <h3 className="mt-5 text-lg font-semibold text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/60">{item.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-col items-start justify-between gap-4 rounded-lg border border-emerald-300/20 bg-emerald-300/[0.06] p-5 sm:flex-row sm:items-center">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 text-emerald-300" />
              <p className="max-w-2xl text-sm leading-6 text-white/70">
                Uploads are validated for type and size before processing, keeping the workflow predictable for repeated genomic review.
              </p>
            </div>
            <Link
              href="/upload"
              className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-emerald-300 px-4 py-2 text-sm font-bold text-slate-950 transition hover:bg-emerald-200"
            >
              Upload Dataset
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
