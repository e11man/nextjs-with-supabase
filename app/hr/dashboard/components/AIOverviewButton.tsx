'use client';

import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AIOverviewModal } from './AIOverviewModal';

export function AIOverviewButton() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Button 
        onClick={() => setShowModal(true)}
      >
        <Sparkles className="w-4 h-4 mr-2" />
        Generate AI Overview
      </Button>

      {showModal && (
        <AIOverviewModal onClose={() => setShowModal(false)} />
      )}
    </>
  );
}

