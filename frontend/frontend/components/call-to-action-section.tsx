'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { cn, typography, buttons, layout } from '@/lib/utils';

interface CallToActionSectionProps {
  onUploadClick: () => void;
}

export function CallToActionSection({ onUploadClick }: CallToActionSectionProps) {
  return (
    <section className={cn(layout.section, "relative")}>
      <div className={cn(layout.container, "text-center")}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {/* Badge */}
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6",
              "bg-primary/10 border border-primary/20 backdrop-blur-sm"
            )}
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              Ready to Analyze Your Genomic Data?
            </span>
          </motion.div>

          {/* Heading */}
          <h2 className={cn(typography.h2, "mb-6")}>
            Start Your AI-Powered Analysis Today
          </h2>

          {/* Description */}
          <p className={cn(typography.bodyLarge, "mb-8 max-w-2xl mx-auto text-muted-foreground")}>
            Upload your genomic dataset and unlock unprecedented insights with our advanced AI algorithms.
            Get results in minutes, not weeks.
          </p>

          {/* CTA Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onUploadClick}
            className={buttons.primaryLarge}
          >
            Begin Analysis
            <ArrowRight className="w-5 h-5 ml-2" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}