import React from 'react';
import TermsSection from '../components/legal/TermsSection';
import LegalFooter from '../components/legal/LegalFooter';

export default function Terms() {
  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-6">Terms & Conditions</h1>
        <p className="text-gray-300 mb-6">Please read these terms and conditions carefully before using our service.</p>
        <TermsSection />
      </div>
      <LegalFooter />
    </div>
  );
}
