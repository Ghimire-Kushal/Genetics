'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Clock, AlertTriangle, Database } from 'lucide-react';
import { cn, typography, layout, cards, animations } from '@/lib/utils';

const problems = [
  {
    icon: Clock,
    title: 'Slow Analysis',
    description: 'Traditional methods take weeks, delaying critical research decisions.',
    colorClass: 'text-warning',
    bgClass: 'bg-warning/10',
  },
  {
    icon: AlertTriangle,
    title: 'Error Prone',
    description: 'Manual interpretation leads to inconsistencies and missed mutations.',
    colorClass: 'text-danger',
    bgClass: 'bg-danger/10',
  },
  {
    icon: Database,
    title: 'Data Overload',
    description: 'Modern sequencing generates datasets too large for conventional tools.',
    colorClass: 'text-accent',
    bgClass: 'bg-accent/10',
  },
];

export function ProblemSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
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
    <section id="features" className={cn(layout.section)}>
      <div className={layout.container}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-sm font-medium uppercase tracking-widest mb-3 text-accent">
            The Challenge
          </p>
          <h2 className={cn(typography.h2, "mb-4")}>
            Genomic Analysis is Complex
          </h2>
          <p className={typography.muted}>
            Discover how GeneScope AI solves your biggest challenges
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className={layout.gridCards}
        >
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -8 }}
              className={cn(
                cards.glowPrimary,
                "group cursor-pointer transition-all duration-300 relative overflow-hidden",
                animations.hoverLift
              )}
            >
              {/* Animated background on hover */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileHover={{ opacity: 0.1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className={cn("absolute inset-0", problem.bgClass)}
              />

              {/* Icon */}
              <motion.div
                animate={{ rotate: [0, -10, 10, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  delay: index * 0.2,
                }}
                className={cn(
                  "w-12 h-12 rounded-lg flex items-center justify-center mb-4 relative z-10",
                  problem.bgClass
                )}
              >
                <problem.icon className={cn("w-6 h-6", problem.colorClass)} />
              </motion.div>

              {/* Content */}
              <h3 className={cn(typography.h4, "mb-2 relative z-10")}>
                {problem.title}
              </h3>
              <p className={cn(typography.bodySmall, "relative z-10")}>
                {problem.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
