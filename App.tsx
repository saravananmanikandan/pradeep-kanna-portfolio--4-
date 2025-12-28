import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Experience } from './components/Experience';
import { Initiatives } from './components/Initiatives';
import { FamilyHistory } from './components/FamilyHistory';
import { InitiativesPage } from './components/InitiativesPage';
import { ProjectsPage } from './components/ProjectsPage';
import { Footer } from './components/Footer';
import { ContentProvider, useContent } from './context/ContentContext';
import { Loader2 } from 'lucide-react';

function AppContent() {
  const [view, setView] = useState<'home' | 'family-history' | 'initiatives' | 'projects'>('home');
  const { loading, error } = useContent();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F5F7] dark:bg-brand-black text-slate-500 dark:text-slate-400">
        <Loader2 className="animate-spin" size={40} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F5F7] dark:bg-brand-black text-red-500">
        <p>Error loading configuration: {error}</p>
      </div>
    );
  }

  const handleNavigate = (page: 'home' | 'family-history' | 'initiatives' | 'projects', hash?: string) => {
    setView(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (page === 'home' && hash) {
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  return (
    <div className="bg-[#F5F5F7] dark:bg-brand-black min-h-screen text-slate-900 dark:text-slate-200 selection:bg-brand-periwinkle/30 selection:text-brand-black dark:selection:text-white transition-colors duration-500">
      <Navbar currentView={view} onNavigate={handleNavigate} />

      <main>
        {view === 'home' ? (
          <>
            <Hero />
            <About />
            <Experience />
            <Initiatives onNavigate={handleNavigate} />
          </>
        ) : view === 'family-history' ? (
          <FamilyHistory />
        ) : view === 'initiatives' ? (
          <InitiativesPage />
        ) : (
          <ProjectsPage />
        )}
      </main>

      <Footer />
    </div>
  );
}

function App() {
  return (
    <ContentProvider>
      <AppContent />
    </ContentProvider>
  );
}

export default App;
