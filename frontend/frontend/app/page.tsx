'use client';

import { useRouter } from 'next/navigation';
import { DNABackground } from "@/components/dna-background"
import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { CallToActionSection } from "@/components/call-to-action-section"
import { ProblemSection } from "@/components/problem-section"
import { WorkflowSection } from "@/components/workflow-section"
import { Footer } from "@/components/footer"
import { UploadComponent } from "@/components/upload-component"

export default function Home() {
  const router = useRouter();

  const handleUpload = async (file: File) => {
    try {
      // For demo purposes, redirect to dashboard after a short delay
      // In production, this would upload the file first
      console.log("File uploaded:", file.name);
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  const scrollToUpload = () => {
    const element = document.getElementById('upload');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden">
      <DNABackground />
      <Navbar />
      <HeroSection />
      <CallToActionSection onUploadClick={scrollToUpload} />
      <ProblemSection />
      <WorkflowSection />
      <UploadComponent onFileSelect={handleUpload} />
      <Footer />
    </main>
  )
}
