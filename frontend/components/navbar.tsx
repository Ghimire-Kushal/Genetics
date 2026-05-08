'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Dna } from 'lucide-react';
import { cn, buttons, animations } from '@/lib/utils';

export function Navbar() {
  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <motion.nav
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn(
        "fixed top-0 left-0 right-0 z-50",
        "bg-gradient-to-r from-background/95 via-card/90 to-background/95",
        "backdrop-blur-xl border-b border-border/50",
        "shadow-lg shadow-black/10"
      )}
    >
      <div className="container-max">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className={cn(
                "absolute inset-0 rounded-lg blur opacity-75 group-hover:opacity-100 transition-opacity duration-300",
                "bg-gradient-to-r from-primary to-accent"
              )} />
              <div className={cn(
                "relative px-3 py-2 bg-card/80 rounded-lg flex items-center gap-2",
                "border border-border/50 backdrop-blur-sm"
              )}>
                <Dna className="w-5 h-5 text-accent animate-pulse-glow" />
                <span className="font-bold text-lg text-foreground">
                  GeneScope AI
                </span>
              </div>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden sm:flex items-center gap-8">
            <button
              onClick={() => scrollToSection('features')}
              className={cn(
                "text-sm font-medium transition-colors duration-200",
                "text-muted-foreground hover:text-accent",
                "relative group"
              )}
            >
              Features
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-200 group-hover:w-full" />
            </button>

            <button
              onClick={() => scrollToSection('workflow')}
              className={cn(
                "text-sm font-medium transition-colors duration-200",
                "text-muted-foreground hover:text-accent",
                "relative group"
              )}
            >
              How It Works
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-200 group-hover:w-full" />
            </button>
          </div>

          {/* CTA Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => scrollToSection('upload')}
            className={buttons.primary}
          >
            Get Started
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
}
