'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Dna } from 'lucide-react';
import { cn, typography, layout } from '@/lib/utils';

export function Footer() {
  return (
    <footer className={cn("py-12 border-t border-border")}>
      <div className={layout.container}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Link href="/" className="flex items-center gap-2 group mb-2">
              <div className="p-2 rounded-lg bg-gradient-to-r from-primary to-accent">
                <Dna className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className={cn(typography.h5, "text-foreground")}>
                GeneScope AI
              </span>
            </Link>
            <p className={typography.mutedSmall}>
              AI-powered genomic analysis platform
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4 className={cn(typography.h6, "mb-3")}>
              Product
            </h4>
            <div className="space-y-2">
              {['Features', 'Pricing', 'Documentation', 'API'].map((item) => (
                <Link
                  key={item}
                  href="#"
                  className={cn(
                    "text-sm block transition-colors",
                    "text-muted-foreground hover:text-accent"
                  )}
                >
                  {item}
                </Link>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className={cn(typography.h6, "mb-3")}>
              Legal
            </h4>
            <div className="space-y-2">
              {['Privacy Policy', 'Terms of Service', 'Contact', 'Support'].map((item) => (
                <Link
                  key={item}
                  href="#"
                  className={cn(
                    "text-sm block transition-colors",
                    "text-muted-foreground hover:text-accent"
                  )}
                >
                  {item}
                </Link>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="pt-8 border-t border-border"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className={typography.mutedSmall}>
              &copy; {new Date().getFullYear()} GeneScope AI. All rights reserved.
            </p>
            <div className="flex gap-6">
              {['Twitter', 'GitHub', 'LinkedIn'].map((social) => (
                <Link
                  key={social}
                  href="#"
                  className={cn(
                    "text-sm transition-colors",
                    "text-muted-foreground hover:text-accent"
                  )}
                >
                  {social}
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
