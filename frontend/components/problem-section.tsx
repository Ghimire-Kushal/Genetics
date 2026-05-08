"use client"

import { Clock, AlertTriangle, Database } from "lucide-react"

const problems = [
  {
    icon: Clock,
    title: "Slow Analysis",
    description: "Traditional methods take weeks, delaying critical research decisions.",
  },
  {
    icon: AlertTriangle,
    title: "Error Prone",
    description: "Manual interpretation leads to inconsistencies and missed mutations.",
  },
  {
    icon: Database,
    title: "Data Overload",
    description: "Modern sequencing generates datasets too large for conventional tools.",
  },
]

export function ProblemSection() {
  return (
    <section id="features" className="py-24">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-primary uppercase tracking-wider mb-3">
            The Challenge
          </p>
          <h2 className="text-3xl font-bold text-foreground">
            Genomic Analysis is Complex
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {problems.map((problem, index) => (
            <div
              key={index}
              className="rounded-xl border border-border/50 bg-card/50 p-6"
            >
              <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center mb-4">
                <problem.icon className="h-5 w-5 text-destructive" />
              </div>
              <h3 className="text-base font-semibold text-foreground mb-2">
                {problem.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {problem.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
