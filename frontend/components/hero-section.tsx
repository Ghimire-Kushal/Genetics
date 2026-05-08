'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Upload, Zap, BarChart3 } from 'lucide-react';
import { cn, typography, buttons, animations, layout, cards } from '@/lib/utils';

export function HeroSection() {
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
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className={cn(
      "relative min-h-screen flex items-center justify-center",
      "pt-32 pb-16 overflow-hidden"
    )}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="absolute top-20 left-10 w-72 h-72 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          style={{
            background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))',
          }}
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="absolute top-40 right-10 w-72 h-72 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          style={{
            background: 'linear-gradient(135deg, hsl(var(--secondary)), hsl(var(--accent)))',
          }}
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="absolute -bottom-8 left-20 w-72 h-72 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          style={{
            background: 'linear-gradient(135deg, hsl(var(--accent)), hsl(var(--primary)))',
          }}
        />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={cn(layout.container, "relative z-10 text-center")}
      >
        {/* Main Heading */}
        <motion.h1
          variants={itemVariants}
          className={cn(
            typography.h1,
            "text-gradient-primary mb-6 max-w-4xl mx-auto"
          )}
        >
          AI-Powered Genomic
          <br />
          <motion.span
            initial={{ backgroundPosition: '0% center' }}
            animate={{ backgroundPosition: '100% center' }}
            transition={{ duration: 3, repeat: Infinity }}
            className="inline-block bg-gradient-to-r px-2 py-1 rounded-lg"
            style={{
              backgroundImage: 'linear-gradient(90deg, hsl(var(--primary)), hsl(var(--accent)), hsl(var(--secondary)), hsl(var(--primary)))',
              backgroundSize: '200% auto',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Mutation Analysis
          </motion.span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className={cn(
            typography.bodyLarge,
            "text-muted-foreground mb-12 max-w-2xl mx-auto"
          )}
        >
          Upload genomic datasets, analyze mutation patterns with AI-powered precision,
          and unlock actionable insights with unprecedented accuracy.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => scrollToSection('upload')}
            className={buttons.primaryLarge}
          >
            <Upload className="w-5 h-5 mr-2" />
            Upload Dataset
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => scrollToSection('workflow')}
            className={buttons.secondary}
          >
            <Zap className="w-5 h-5 mr-2" />
            How It Works
          </motion.button>
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-3 gap-8 max-w-2xl mx-auto"
        >
          {[
            { icon: BarChart3, value: '99.7%', label: 'Accuracy' },
            { icon: Zap, value: '10M+', label: 'Mutations' },
            { icon: Upload, value: '50x', label: 'Faster' },
          ].map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5 }}
              className={cn(cards.glass, "text-center")}
            >
              <stat.icon className="w-6 h-6 mx-auto mb-2 text-accent" />
              <div className="text-2xl font-bold text-primary">
                {stat.value}
              </div>
              <div className="text-sm mt-1 text-muted-foreground">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
