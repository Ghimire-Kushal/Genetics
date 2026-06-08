// Color Palette - GScope AI Design System work 
//constants.ts
export const COLORS = {
  // Base Colors
  background: 'hsl(var(--background))',
  foreground: 'hsl(var(--foreground))',
  card: 'hsl(var(--card))',
  cardForeground: 'hsl(var(--card-foreground))',

  // Primary Colors used for main actions and highlights
  primary: 'hsl(var(--primary))',
  primaryForeground: 'hsl(var(--primary-foreground))',
  primaryHover: 'hsl(var(--primary-hover))',
  primaryActive: 'hsl(var(--primary-active))',

  // Secondary Colors
  secondary: 'hsl(var(--secondary))',
  secondaryForeground: 'hsl(var(--secondary-foreground))',
  secondaryHover: 'hsl(var(--secondary-hover))',
  secondaryActive: 'hsl(var(--secondary-active))',

  // Accent Colors
  accent: 'hsl(var(--accent))',
  accentForeground: 'hsl(var(--accent-foreground))',
  accentHover: 'hsl(var(--accent-hover))',
  accentActive: 'hsl(var(--accent-active))',

  // Semantic Colors
  success: 'hsl(var(--success))',
  successForeground: 'hsl(var(--success-foreground))',
  warning: 'hsl(var(--warning))',
  warningForeground: 'hsl(var(--warning-foreground))',
  danger: 'hsl(var(--danger))',
  dangerForeground: 'hsl(var(--danger-foreground))',

  // Neutral Colors
  muted: 'hsl(var(--muted))',
  mutedForeground: 'hsl(var(--muted-foreground))',
  border: 'hsl(var(--border))',
  input: 'hsl(var(--input))',
  ring: 'hsl(var(--ring))',

  // Glass Effects
  glassBg: 'hsl(var(--glass-bg))',
  glassBorder: 'hsl(var(--glass-border))',

  // Legacy aliases used by older dashboard components
  text: 'hsl(var(--foreground))',
  cardBg: 'hsl(var(--card))',
  lightBorder: 'hsl(var(--border))',
};

// Semantic Color Mappings
export const COLOR_SEMANTICS = {
  pathogenic: '#EF4444',
  likely_pathogenic: '#F59E0B',
  uncertain: '#06B6D4',
  likely_benign: '#10B981',
  benign: '#10B981',
  
  // Risk levels
  critical: '#EF4444',
  high: '#F59E0B',
  moderate: '#06B6D4',
  low: '#10B981',

  // Mutation types
  SNP: '#3B82F6',
  INDEL: '#8B5CF6',
  STRUCTURAL: '#06B6D4',
  COPY_NUMBER: '#F59E0B',
};

// API Endpoints
export const API_ENDPOINTS = {
  upload: '/upload',
  analyze: '/analyze',
  results: '/results',
};

// Animation Durations (ms)
export const ANIMATION_DURATION = {
  fast: 200,
  normal: 400,
  slow: 800,
};

// Mock Data for Development
export const MOCK_ANALYSIS_RESULT = {
  id: 'analysis-001',
  fileName: 'genomic_sample.csv',
  uploadTime: new Date().toISOString(),
  analysisTime: new Date(Date.now() - 5000).toISOString(),
  status: 'completed' as const,
  mutations: [
    {
      id: 'mut-001',
      gene: 'BRCA1',
      mutation: 'c.68_69delAG',
      position: 68,
      frequency: 0.045,
      type: 'INDEL',
      pathogenicity: 'pathogenic',
      consequence: 'frameshift mutation',
      affectedIndividuals: 23,
    },
    {
      id: 'mut-002',
      gene: 'TP53',
      mutation: 'p.R248Q',
      position: 248,
      frequency: 0.032,
      type: 'SNP',
      pathogenicity: 'pathogenic',
      consequence: 'missense mutation',
      affectedIndividuals: 18,
    },
    {
      id: 'mut-003',
      gene: 'EGFR',
      mutation: 'L858R',
      position: 858,
      frequency: 0.028,
      type: 'SNP',
      pathogenicity: 'likely_pathogenic',
      consequence: 'missense mutation',
      affectedIndividuals: 15,
    },
  ],
  summary: {
    totalMutations: 127,
    uniqueGenes: 45,
    pathogenicCount: 34,
    benignCount: 58,
    averageFrequency: 0.0234,
    sequencingCoverage: 98.5,
    analysisMethod: 'DeepVariant + ClinVar annotation',
  },
  insights: [
    {
      id: 'insight-001',
      title: 'High-Risk BRCA1 Mutation Detected',
      description: 'A frameshift mutation in BRCA1 gene was identified with strong clinical significance.',
      type: 'warning',
      confidence: 0.98,
      evidence: ['ClinVar: Pathogenic', 'COSMIC database match', 'Literature support'],
    },
    {
      id: 'insight-002',
      title: 'TP53 Tumor Suppressor Gene Variant',
      description: 'TP53 mutation detected. Regular oncology screening recommended.',
      type: 'finding',
      confidence: 0.96,
      evidence: ['Known cancer association', 'High conservation score'],
    },
  ],
  riskProfile: {
    overallRisk: 0.78,
    riskLevel: 'high' as const,
    keyRisks: ['Hereditary cancer predisposition', 'High mutation burden'],
    recommendations: ['Genetic counseling', 'Enhanced surveillance', 'Consider preventive measures'],
  },
};

// Dataset Upload Config
export const UPLOAD_CONFIG = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  acceptedFormats: ['.csv', '.vcf', '.json', '.txt'],
  acceptedMimeTypes: ['text/csv', 'text/plain', 'application/json'],
};

// Dashboard Tabs
export const DASHBOARD_TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'mutations', label: 'Mutations' },
  { id: 'insights', label: 'AI Insights' },
  { id: 'statistics', label: 'Statistics' },
];

// Workflow Steps
export const WORKFLOW_STEPS = [
  { id: 1, label: 'Upload Dataset', description: 'Select and upload your genomic dataset' },
  { id: 2, label: 'AI Analysis', description: 'Our AI analyzes mutation patterns' },
  { id: 3, label: 'Dashboard', description: 'Visualize comprehensive results' },
  { id: 4, label: 'Insights', description: 'AI-generated insights and recommendations' },
];
