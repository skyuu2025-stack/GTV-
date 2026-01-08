import React, { useState, useCallback } from 'react';
import Header from './components/Header.tsx';
import Hero from './components/Hero.tsx';
import AssessmentForm from './components/AssessmentForm.tsx';
import ResultsView from './components/ResultsView.tsx';
import PaymentView from './components/PaymentView.tsx';
import AdminDashboard from './components/AdminDashboard.tsx';
import LegalModals from './components/LegalModals.tsx';
import { UserProfile, AssessmentResult } from './types.ts';

const App: React.FC = () => {
  const [view, setView] = useState<'home' | 'assessment' | 'payment' | 'results' | 'admin'>('home');
  const [userTier, setUserTier] = useState<'free' | 'premium'>('free');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [results, setResults] = useState<AssessmentResult | null>(null);
  const [legalModal, setLegalModal] = useState<'terms' | 'privacy' | null>(null);

  const startAssessment = () => setView('assessment');
  
  const handleAssessmentComplete = (res: AssessmentResult, prof: UserProfile) => {
    setResults(res);
    setProfile(prof);
    setUserTier('free');
    setView('results');
  };

  const handleUpgradeIntent = () => {
    setView('payment');
  };

  const handlePaymentSuccess = () => {
    setUserTier('premium');
    setView('results');
  };

  const handleLogoClick = useCallback((count: number) => {
    if (count >= 5) setView('admin');
  }, []);

  const handleGoHome = () => {
    setView('home');
    setUserTier('free');
  };

  return (
    <div className="fixed inset-0 bg-white flex flex-col overflow-hidden animate-fade-in">
      {view !== 'home' && <Header onLogoClick={handleLogoClick} onGoHome={handleGoHome} />}
      
      <main className="flex-grow overflow-hidden relative w-full h-full">
        {view === 'home' && (
          <Hero onStart={startAssessment} onShowLegal={setLegalModal} />
        )}
        {view === 'assessment' && (
          <AssessmentForm onComplete={handleAssessmentComplete} onCancel={() => setView('home')} />
        )}
        {view === 'payment' && profile && (
          <PaymentView 
            profile={profile} 
            onPaymentSuccess={handlePaymentSuccess} 
            onCancel={() => setView('results')} 
            onShowLegal={setLegalModal}
          />
        )}
        {view === 'results' && results && profile && (
          <ResultsView 
            results={results} 
            profile={profile} 
            isPaid={userTier === 'premium'}
            onRestart={handleGoHome} 
            onUpgrade={handleUpgradeIntent}
          />
        )}
        {view === 'admin' && (
          <AdminDashboard onClose={() => setView('home')} />
        )}
      </main>

      {legalModal && (
        <LegalModals type={legalModal} onClose={() => setLegalModal(null)} />
      )}
    </div>
  );
};

export default App;