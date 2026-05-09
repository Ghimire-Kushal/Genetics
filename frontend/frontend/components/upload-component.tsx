'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileCheck, AlertCircle, Loader } from 'lucide-react';
import { COLORS, UPLOAD_CONFIG } from '@/lib/constants';

interface UploadComponentProps {
  onFileSelect: (file: File) => Promise<void>;
  loading?: boolean;
  error?: string | null;
}

export function UploadComponent({ onFileSelect, loading = false, error = null }: UploadComponentProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const processFile = (file: File) => {
    // Validate file
    const isValidFormat = UPLOAD_CONFIG.acceptedFormats.some((format) =>
      file.name.toLowerCase().endsWith(format)
    );
    const isValidSize = file.size <= UPLOAD_CONFIG.maxFileSize;

    if (!isValidFormat || !isValidSize) {
      return;
    }

    setSelectedFile(file);
    setUploadProgress(0);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + Math.random() * 30;
      });
    }, 500);

    // Call parent handler
    onFileSelect(file).finally(() => {
      clearInterval(progressInterval);
      setUploadProgress(100);
    });
  };

  return (
    <section
      id="upload"
      className="relative py-20 px-6"
    >
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: COLORS.text }}>
            Upload Your Genomic Dataset
          </h2>
          <p style={{ color: COLORS.muted }}>
            Support for CSV, VCF, and JSON formats up to 10MB
          </p>
        </motion.div>

        <motion.div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          whileHover={{ borderColor: COLORS.accent }}
          className="relative rounded-2xl p-12 transition-all cursor-pointer"
          style={{
            background: `rgba(18, 26, 47, 0.6)`,
            border: `2px dashed ${dragActive ? COLORS.accent : COLORS.lightBorder}`,
            backdropFilter: 'blur(10px)',
          }}
        >
          <input
            ref={inputRef}
            type="file"
            onChange={handleChange}
            className="hidden"
            accept={UPLOAD_CONFIG.acceptedFormats.join(',')}
            disabled={loading}
          />

          <AnimatePresence mode="wait">
            {!selectedFile ? (
              <motion.div
                key="upload-prompt"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center cursor-pointer"
                onClick={() => inputRef.current?.click()}
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="mb-4 flex justify-center"
                >
                  <div
                    className="p-4 rounded-full"
                    style={{
                      background: `linear-gradient(135deg, ${COLORS.primary}40, ${COLORS.accent}40)`,
                    }}
                  >
                    <Upload className="w-8 h-8" style={{ color: COLORS.accent }} />
                  </div>
                </motion.div>
                <p className="text-lg font-semibold mb-2" style={{ color: COLORS.text }}>
                  Drag and drop your file
                </p>
                <p style={{ color: COLORS.muted }}>
                  or click to select from your computer
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="file-selected"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center"
              >
                {loading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, linear: true }}
                      className="mb-4 flex justify-center"
                    >
                      <div
                        className="p-4 rounded-full"
                        style={{
                          background: `linear-gradient(135deg, ${COLORS.primary}40, ${COLORS.accent}40)`,
                        }}
                      >
                        <Loader className="w-8 h-8" style={{ color: COLORS.accent }} />
                      </div>
                    </motion.div>
                    <p className="text-lg font-semibold mb-2" style={{ color: COLORS.text }}>
                      Analyzing your dataset...
                    </p>
                    <motion.div
                      className="w-full h-2 rounded-full overflow-hidden mt-4"
                      style={{ background: COLORS.cardBg }}
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(uploadProgress, 95)}%` }}
                        className="h-full rounded-full"
                        style={{
                          background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.accent})`,
                        }}
                      />
                    </motion.div>
                    <p className="text-sm mt-2" style={{ color: COLORS.muted }}>
                      {Math.round(uploadProgress)}%
                    </p>
                  </>
                ) : (
                  <>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="mb-4 flex justify-center"
                    >
                      <div
                        className="p-4 rounded-full"
                        style={{
                          background: `linear-gradient(135deg, ${COLORS.success}40, ${COLORS.accent}40)`,
                        }}
                      >
                        <FileCheck className="w-8 h-8" style={{ color: COLORS.success }} />
                      </div>
                    </motion.div>
                    <p className="text-lg font-semibold mb-2" style={{ color: COLORS.text }}>
                      {selectedFile.name}
                    </p>
                    <p style={{ color: COLORS.muted }}>
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedFile(null)}
                      className="mt-4 px-4 py-2 rounded-lg text-sm"
                      style={{
                        background: COLORS.cardBg,
                        color: COLORS.muted,
                        border: `1px solid ${COLORS.lightBorder}`,
                      }}
                    >
                      Choose Different File
                    </motion.button>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4 p-4 rounded-lg flex items-start gap-3"
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: `1px solid rgba(239, 68, 68, 0.3)`,
              }}
            >
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p style={{ color: '#fca5a5' }}>{error}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
