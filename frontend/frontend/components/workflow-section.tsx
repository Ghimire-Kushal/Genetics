'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Upload, Cpu, BarChart3, Brain, ArrowRight } from 'lucide-react';
import { cn, typography, layout, cards, animations } from '@/lib/utils';

const steps = [
  {
    icon: Upload,
    title: 'Upload',
    description: 'Select and upload your genomic dataset',
    number: 1,
  },
  {
    icon: Cpu,
    title: 'Analyze',
    description: 'AI processes millions of variants',
    number: 2,
  },
  {
    icon: BarChart3,
    title: 'Visualize',
    description: 'Interactive mutation patterns',
    number: 3,
  },
  {
    icon: Brain,
    title: 'Insights',
    description: 'AI-generated clinical insights',
    number: 4,
  },
];

export function WorkflowSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section
      id="workflow"
      className={cn(layout.section, "border-t border-border")}
    >
      <div className={layout.container}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-sm font-medium uppercase tracking-widest mb-3 text-accent">
            How It Works
          </p>
          <h2 className={cn(typography.h2, "mb-4")}>
            Data to Insights in Minutes
          </h2>
          <p className={typography.muted}>
            Follow our streamlined workflow to analyze and understand your genomic data
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-4"
        >
          {steps.map((step, index) => (
            <React.Fragment key={index}>
              <motion.div
                variants={itemVariants}
                whileHover={{ y: -8 }}
                className={cn(
                  cards.glowPrimary,
                  "relative p-8 transition-all duration-300",
                  animations.hoverLift
                )}
              >
                {/* Step Number Badge */}
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  viewport={{ once: true }}
                  className={cn(
                    "absolute -top-4 -left-4 w-10 h-10 rounded-full flex items-center justify-center",
                    "font-bold text-primary-foreground bg-gradient-to-r from-primary to-accent"
                  )}
                >
                  {step.number}
                </motion.div>

                {/* Icon */}
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: index * 0.2,
                  }}
                  className={cn(
                    "w-16 h-16 rounded-xl flex items-center justify-center mb-6 mx-auto",
                    "bg-gradient-to-r from-primary/20 to-accent/20"
                  )}
                >
                  <step.icon className="w-8 h-8 text-accent" />
                </motion.div>

                {/* Content */}
                <h3 className={cn(typography.h4, "text-center mb-2")}>
                  {step.title}
                </h3>
                <p className={cn(typography.bodySmall, "text-center")}>
                  {step.description}
                </p>
              </motion.div>

              {/* Arrow Connector */}
              {index < steps.length - 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  viewport={{ once: true }}
                  className="hidden md:flex items-center justify-center"
                >
                  <ArrowRight className="w-6 h-6 text-accent" />
                </motion.div>
              )}
            </React.Fragment>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
