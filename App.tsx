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

function App() {
  const [view, setView] = useState<'home' | 'family-history' | 'initiatives' | 'projects'>('home');

  const handleNavigate = (page: 'home' | 'family-history' | 'initiatives' | 'projects', hash?: string) => {
    setView(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    if (page === 'home' && hash) {
      // Allow time for the Home view to render before scrolling to hash
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

export default App;
