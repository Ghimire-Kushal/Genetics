'use client';

import { useState, useCallback } from 'react';
import { AnalysisResult } from '@/types';
import apiService from '@/lib/api';

export function useAnalysis() {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  const uploadFile = useCallback(async (file: File) => {
    try {
      setLoading(true);
      setError(null);
      setCurrentStep(1);

      const uploadResponse = await apiService.uploadDataset(file);
      const { uploadId } = uploadResponse;

      setCurrentStep(2);
      const analysisResponse = await apiService.analyzeDataset(uploadId);
      const { analysisId } = analysisResponse;

      setCurrentStep(3);
      const results = await apiService.pollAnalysisStatus(analysisId);
      
      setAnalysisResult(results);
      setCurrentStep(4);
      setLoading(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred during analysis';
      setError(errorMessage);
      setLoading(false);
    }
  }, []);

  const resetAnalysis = useCallback(() => {
    setAnalysisResult(null);
    setLoading(false);
    setError(null);
    setCurrentStep(0);
  }, []);

  return {
    analysisResult,
    loading,
    error,
    currentStep,
    uploadFile,
    resetAnalysis,
  };
}

export function useScrollPosition() {
  const [scrollY, setScrollY] = useState(0);

  const handleScroll = useCallback(() => {
    setScrollY(window.scrollY);
  }, []);

  return { scrollY, handleScroll };
}

export function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  const handleResize = useCallback(() => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, []);

  return { windowSize, handleResize };
}
