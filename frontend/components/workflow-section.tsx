"use client"

import { Upload, Cpu, BarChart3, Brain } from "lucide-react"

const steps = [
  {
    icon: Upload,
    title: "Upload",
    description: "VCF, FASTQ, or BAM formats",
  },
  {
    icon: Cpu,
    title: "Analyze",
    description: "AI processes millions of variants",
  },
  {
    icon: BarChart3,
    title: "Visualize",
    description: "Interactive mutation patterns",
  },
  {
    icon: Brain,
    title: "Insights",
    description: "Clinical significance predictions",
  },
]

export function WorkflowSection() {
  return (
    <section id="workflow" className="py-24 border-t border-border/30">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-primary uppercase tracking-wider mb-3">
            How It Works
          </p>
          <h2 className="text-3xl font-bold text-foreground">
            Data to Insights in Minutes
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="w-14 h-14 mx-auto rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <step.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-base font-semibold text-foreground mb-1">
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
