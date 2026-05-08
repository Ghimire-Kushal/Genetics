"use client"

import { Button } from "@/components/ui/button"
import { Upload, Play } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-20 pb-16">
      {/* Single subtle glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/10 rounded-full blur-[120px]" />

      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
          AI-Powered Genomic
          <br />
          <span className="text-primary">Mutation Analysis</span>
        </h1>

        <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed">
          Analyze genomic datasets, identify mutations, and unlock insights 
          with unprecedented accuracy and speed.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8">
            <Upload className="mr-2 h-4 w-4" />
            Upload Dataset
          </Button>
          <Button size="lg" variant="outline" className="border-border bg-secondary/50 hover:bg-secondary px-8">
            <Play className="mr-2 h-4 w-4" />
            View Demo
          </Button>
        </div>

        <div className="mt-20 grid grid-cols-3 gap-12 max-w-md mx-auto">
          {[
            { value: "99.7%", label: "Accuracy" },
            { value: "10M+", label: "Variants" },
            { value: "50x", label: "Faster" },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl font-bold text-primary">{stat.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
