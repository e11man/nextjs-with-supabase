'use client';

import { useState, useEffect } from 'react';
import { X, RotateCw, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

type AIOverviewModalProps = {
  onClose: () => void;
};

export function AIOverviewModal({ onClose }: AIOverviewModalProps) {
  const [overview, setOverview] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const generateOverview = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/ai-overview', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to generate overview');
      }

      const data = await response.json();
      setOverview(data.overview);
    } catch (err) {
      setError('Failed to generate AI overview. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Generate AI overview on mount
  useEffect(() => {
    generateOverview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-3xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Sparkles className="w-6 h-6" />
            AI Onboarding Overview
          </h2>
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Analyzing employee tasks...</p>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-md mb-4">
            {error}
            <Button
              onClick={generateOverview}
              variant="link"
              className="ml-4 text-red-800"
            >
              Try Again
            </Button>
          </div>
        )}

        {!isLoading && !error && overview && (
          <div className="prose prose-sm max-w-none">
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg border border-purple-200">
              <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                {overview}
              </div>
            </div>
            
            <div className="mt-6 flex justify-between items-center">
              <Button
                onClick={generateOverview}
                variant="secondary"
              >
                <RotateCw className="w-4 h-4 mr-2" />
                Regenerate
              </Button>
              <Button
                onClick={onClose}
                variant="outline"
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

