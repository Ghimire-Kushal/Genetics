// API Response Types
export interface AnalysisResult {
  id: string;
  fileName: string;
  uploadTime: string;
  analysisTime: string;
  status: 'processing' | 'completed' | 'failed';
  mutations: MutationData[];
  summary: AnalysisSummary;
  insights: AIInsight[];
  riskProfile: RiskProfile;
}

export interface MutationData {
  id: string;
  gene: string;
  mutation: string;
  position: number;
  frequency: number;
  type: 'SNP' | 'INDEL' | 'STRUCTURAL' | 'COPY_NUMBER';
  pathogenicity: 'benign' | 'likely_benign' | 'uncertain' | 'likely_pathogenic' | 'pathogenic';
  consequence: string;
  affectedIndividuals: number;
}

export interface AnalysisSummary {
  totalMutations: number;
  uniqueGenes: number;
  pathogenicCount: number;
  benignCount: number;
  averageFrequency: number;
  sequencingCoverage: number;
  analysisMethod: string;
}

export interface AIInsight {
  id: string;
  title: string;
  description: string;
  type: 'finding' | 'warning' | 'recommendation';
  confidence: number;
  evidence: string[];
}

export interface RiskProfile {
  overallRisk: number;
  riskLevel: 'low' | 'moderate' | 'high' | 'critical';
  keyRisks: string[];
  recommendations: string[];
}

// Component Props Types
export interface UploadFormData {
  file: File;
  fileName: string;
  fileSize: number;
}

export interface DashboardContextType {
  analysisResult: AnalysisResult | null;
  loading: boolean;
  error: string | null;
  uploadFile: (file: File) => Promise<void>;
  analyzeData: () => Promise<void>;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  category?: string;
}

export interface TabConfig {
  id: string;
  label: string;
  icon?: React.ReactNode;
}
