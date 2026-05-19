import axios, { AxiosInstance } from 'axios';
import { AnalysisResult } from '@/types';

// API Client Singleton
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://genetics-jqlc.onrender.com';

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// API Service Functions
export const apiService = {
  // Upload genomic dataset
  async uploadDataset(file: File): Promise<{
    upload_id: string;
    analysis_id: string;
    file: { original_name: string; stored_name: string; size_bytes: number; extension: string };
  }> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  // Analyze uploaded dataset
  async analyzeDataset(analysisId: string): Promise<{ analysis_id: string; status: string }> {
    const response = await apiClient.post('/analyze', {
      analysis_id: analysisId,
      upload_id: analysisId,
    });
    return response.data;
  },

  // Get analysis results
  async getAnalysisResults(analysisId: string): Promise<AnalysisResult> {
    const response = await apiClient.get('/results', {
      params: { analysis_id: analysisId },
    });
    return response.data;
  },

  // Poll for analysis status
  async pollAnalysisStatus(analysisId: string, interval = 2000, maxRetries = 150): Promise<AnalysisResult> {
    for (let i = 0; i < maxRetries; i++) {
      try {
        const result = await this.getAnalysisResults(analysisId);
        if (result.status === 'completed' || result.status === 'failed') {
          return result;
        }
      } catch (error) {
        console.error('Error polling analysis status:', error);
      }

      // Wait before next poll
      await new Promise((resolve) => setTimeout(resolve, interval));
    }

    throw new Error('Analysis polling timeout exceeded');
  },
};

export default apiService;
