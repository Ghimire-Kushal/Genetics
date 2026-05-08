'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { COLORS, COLOR_SEMANTICS } from '@/lib/constants';
import { MutationData } from '@/types';

interface MutationBarChartProps {
  data: MutationData[];
  title?: string;
}

export function MutationBarChart({ data, title }: MutationBarChartProps) {
  const chartData = data.map((m) => ({
    name: m.gene.substring(0, 8),
    frequency: (m.frequency * 100).toFixed(2),
    fullName: m.gene,
  }));

  return (
    <div>
      {title && (
        <h3 style={{ color: COLORS.text }} className="text-lg font-semibold mb-4">
          {title}
        </h3>
      )}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke={COLORS.lightBorder} />
          <XAxis stroke={COLORS.muted} />
          <YAxis stroke={COLORS.muted} />
          <Tooltip
            contentStyle={{
              background: COLORS.cardBg,
              border: `1px solid ${COLORS.lightBorder}`,
              borderRadius: '8px',
              color: COLORS.text,
            }}
          />
          <Bar dataKey="frequency" fill={COLORS.primary} radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

interface PathogenicityPieProps {
  pathogenic: number;
  likely_pathogenic: number;
  uncertain: number;
  likely_benign: number;
  benign: number;
}

export function PathogenicityPieChart({
  pathogenic,
  likely_pathogenic,
  uncertain,
  likely_benign,
  benign,
}: PathogenicityPieProps) {
  const data = [
    { name: 'Pathogenic', value: pathogenic, color: COLOR_SEMANTICS.pathogenic },
    {
      name: 'Likely Pathogenic',
      value: likely_pathogenic,
      color: COLOR_SEMANTICS.likely_pathogenic,
    },
    { name: 'Uncertain', value: uncertain, color: COLOR_SEMANTICS.uncertain },
    {
      name: 'Likely Benign',
      value: likely_benign,
      color: COLOR_SEMANTICS.likely_benign,
    },
    { name: 'Benign', value: benign, color: COLOR_SEMANTICS.benign },
  ];

  return (
    <div>
      <h3 style={{ color: COLORS.text }} className="text-lg font-semibold mb-4">
        Pathogenicity Distribution
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: COLORS.cardBg,
              border: `1px solid ${COLORS.lightBorder}`,
              borderRadius: '8px',
              color: COLORS.text,
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

interface MutationTypeChartProps {
  SNP: number;
  INDEL: number;
  STRUCTURAL: number;
  COPY_NUMBER: number;
}

export function MutationTypeChart({ SNP, INDEL, STRUCTURAL, COPY_NUMBER }: MutationTypeChartProps) {
  const data = [
    { name: 'SNP', value: SNP, color: COLOR_SEMANTICS.SNP },
    { name: 'INDEL', value: INDEL, color: COLOR_SEMANTICS.INDEL },
    { name: 'STRUCTURAL', value: STRUCTURAL, color: COLOR_SEMANTICS.STRUCTURAL },
    { name: 'COPY_NUMBER', value: COPY_NUMBER, color: COLOR_SEMANTICS.COPY_NUMBER },
  ];

  return (
    <div>
      <h3 style={{ color: COLORS.text }} className="text-lg font-semibold mb-4">
        Mutation Types
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={COLORS.lightBorder} />
          <XAxis stroke={COLORS.muted} dataKey="name" />
          <YAxis stroke={COLORS.muted} />
          <Tooltip
            contentStyle={{
              background: COLORS.cardBg,
              border: `1px solid ${COLORS.lightBorder}`,
              borderRadius: '8px',
              color: COLORS.text,
            }}
          />
          <Bar dataKey="value" radius={[8, 8, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

interface FrequencyTrendProps {
  data: { name: string; frequency: number }[];
}

export function FrequencyTrendChart({ data }: FrequencyTrendProps) {
  return (
    <div>
      <h3 style={{ color: COLORS.text }} className="text-lg font-semibold mb-4">
        Mutation Frequency Trend
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={COLORS.lightBorder} />
          <XAxis stroke={COLORS.muted} />
          <YAxis stroke={COLORS.muted} />
          <Tooltip
            contentStyle={{
              background: COLORS.cardBg,
              border: `1px solid ${COLORS.lightBorder}`,
              borderRadius: '8px',
              color: COLORS.text,
            }}
          />
          <Line
            type="monotone"
            dataKey="frequency"
            stroke={COLORS.accent}
            strokeWidth={2}
            dot={{ fill: COLORS.primary, r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
