'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AIInsight } from '@/types';
import { COLORS } from '@/lib/constants';
import { AlertCircle, TrendingUp, Lightbulb } from 'lucide-react';

interface InsightsDisplayProps {
  insights: AIInsight[];
}

export function InsightsDisplay({ insights }: InsightsDisplayProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4 },
    },
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertCircle className="w-5 h-5" />;
      case 'recommendation':
        return <Lightbulb className="w-5 h-5" />;
      default:
        return <TrendingUp className="w-5 h-5" />;
    }
  };

  const getColorForType = (type: string) => {
    switch (type) {
      case 'warning':
        return { bg: 'rgba(245, 158, 11, 0.1)', border: COLORS.warning, text: COLORS.warning };
      case 'recommendation':
        return { bg: 'rgba(139, 92, 246, 0.1)', border: COLORS.secondary, text: COLORS.secondary };
      default:
        return { bg: 'rgba(59, 130, 246, 0.1)', border: COLORS.primary, text: COLORS.primary };
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      {insights.map((insight) => {
        const colors = getColorForType(insight.type);
        return (
          <motion.div
            key={insight.id}
            variants={itemVariants}
            whileHover={{ x: 8 }}
            className="p-4 rounded-lg transition-all"
            style={{
              background: colors.bg,
              borderLeft: `3px solid ${colors.border}`,
            }}
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5" style={{ color: colors.text }}>
                {getIconForType(insight.type)}
              </div>
              <div className="flex-1">
                <p
                  className="font-semibold text-sm"
                  style={{ color: COLORS.text }}
                >
                  {insight.title}
                </p>
                <p
                  className="text-sm mt-1"
                  style={{ color: COLORS.muted }}
                >
                  {insight.description}
                </p>
                <div className="mt-2 flex items-center gap-4 text-xs">
                  <span style={{ color: colors.text }}>
                    Confidence: {(insight.confidence * 100).toFixed(0)}%
                  </span>
                  {insight.evidence.length > 0 && (
                    <span style={{ color: COLORS.muted }}>
                      {insight.evidence.length} evidence
                    </span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
