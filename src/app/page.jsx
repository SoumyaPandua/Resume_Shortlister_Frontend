'use client';

import { useState } from 'react';
import ResumeUploader from '@/components/ResumeUploader';
import JDUploader from '@/components/JDUploader';
import UploadProgress from '@/components/UploadProgress';
import ResultsSummary from '@/components/ResultsSummary';
import ResultTable from '@/components/ResultTable';
import toast from 'react-hot-toast';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  const [resumes, setResumes] = useState([]);
  const [jd, setJd] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [analysisResults, setAnalysisResults] = useState([]);

  const handleAnalyze = async () => {
    if (!resumes.length || !jd) {
      toast.error('Please upload resumes and a job description!');
      return;
    }

    const formData = new FormData();
    resumes.forEach(file => formData.append('resumes', file));
    formData.append('jd', jd);

    try {
      setLoading(true);
      setUploadProgress(0);

      // Simulate progress manually
      let fakeProgress = 0;
      const interval = setInterval(() => {
        fakeProgress += 10;
        setUploadProgress(fakeProgress);
        if (fakeProgress >= 90) clearInterval(interval);
      }, 100);

      const response = await axios.post('/api/analyze', formData);

      clearInterval(interval);
      setUploadProgress(100);

      const { results } = response.data;
      setAnalysisResults(results);
      toast.success('Analysis completed!');
    } catch (err) {
      console.error(err);
      toast.error('Error analyzing resumes!');
    } finally {
      setLoading(false);
      setTimeout(() => setUploadProgress(0), 1000);
      setResumes([]); // Reset resume uploader
      setJd(null);     // Reset JD uploader
    }
  };

  return (
    <main className="p-6 max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Resume Shortlister</h1>

      <div className="grid md:grid-cols-2 gap-4">
        <ResumeUploader setFiles={setResumes} />
        <JDUploader setFile={setJd} />
      </div>

      <UploadProgress progress={uploadProgress} />

      <button
        onClick={handleAnalyze}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded disabled:opacity-50"
        disabled={loading}
      >
        {loading ? 'Waiting for response...' : 'Analyze Resumes'}
      </button>

      {analysisResults.length > 0 && (
        <>
          <ResultsSummary results={analysisResults} />
          <ResultTable results={analysisResults} />
          <div className="mt-4 text-right">
            <Button asChild variant="link">
              <Link href="/history">Watch History</Link>
            </Button>
          </div>
        </>
      )}
    </main>
  );
}
