import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Hero from './components/Hero';
import AssessmentForm from './components/AssessmentForm';
import ResultsView from './components/ResultsView';
import AdminDashboard from './components/AdminDashboard';
import { UserProfile, AssessmentResult } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<'home' | 'assessment' | 'results' | 'admin'>('home');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [results, setResults] = useState<AssessmentResult | null>(null);

  const startAssessment = () => setView('assessment');
  const showResults = (res: AssessmentResult, prof: UserProfile) => {
    setResults(res);
    setProfile(prof);
    setView('results');
  };

  const handleLogoClick = useCallback((count: number) => {
    if (count >= 5) setView('admin');
  }, []);

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden safe-pt safe-pb">
      <Header onLogoClick={handleLogoClick} onGoHome={() => setView('home')} />
      
      <main className="flex-grow overflow-hidden relative">
        {view === 'home' && <Hero onStart={startAssessment} />}
        {view === 'assessment' && <AssessmentForm onComplete={showResults} onCancel={() => setView('home')} />}
        {view === 'results' && results && profile && (
          <ResultsView results={results} profile={profile} onRestart={() => setView('home')} />
        )}
        {view === 'admin' && <AdminDashboard onClose={() => setView('home')} />}
      </main>

      {view === 'home' && <Footer />}
    </div>
  );
};

export default App;