import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Menu, X } from 'lucide-react';

interface NavbarProps {
  currentView: 'home' | 'family-history' | 'initiatives' | 'projects';
  onNavigate: (view: 'home' | 'family-history' | 'initiatives' | 'projects', hash?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate }) => {
  const [isDark, setIsDark] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (document.documentElement.classList.contains('dark')) {
      setIsDark(true);
    } else {
      setIsDark(false);
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  };

  const navItems = [
    { name: 'Home', action: () => onNavigate('home') },
    { name: 'Family History', action: () => onNavigate('family-history') },
    { name: 'Projects', action: () => onNavigate('projects') },
    { name: 'Initiatives', action: () => onNavigate('initiatives') },
    { name: 'Contact', action: () => {
      const footer = document.getElementById('contact');
      if (footer) footer.scrollIntoView({ behavior: 'smooth' });
    }},
  ];

  return (
    <header className="fixed top-6 inset-x-0 z-50 flex justify-center px-4 pointer-events-none">
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`
          pointer-events-auto
          flex items-center gap-6 px-6 py-3 rounded-2xl border transition-all duration-300
          ${isScrolled 
            ? 'bg-white/80 dark:bg-brand-black/80 border-slate-200 dark:border-white/10 backdrop-blur-md shadow-2xl' 
            : 'bg-transparent border-transparent'}
        `}
      >
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={item.action}
              className={`text-sm font-medium transition-colors relative group ${
                (currentView === 'family-history' && item.name === 'Family History') || 
                (currentView === 'initiatives' && item.name === 'Initiatives') ||
                (currentView === 'projects' && item.name === 'Projects') ||
                (currentView === 'home' && item.name === 'Home')
                ? 'text-brand-periwinkle'
                : 'text-slate-600 dark:text-slate-400 hover:text-brand-periwinkle dark:hover:text-brand-periwinkle'
              }`}
            >
              {item.name}
              <span className={`absolute -bottom-1 left-0 h-px bg-brand-periwinkle transition-all duration-300 ${
                 (currentView === 'family-history' && item.name === 'Family History') || 
                 (currentView === 'initiatives' && item.name === 'Initiatives') ||
                 (currentView === 'projects' && item.name === 'Projects') ||
                 (currentView === 'home' && item.name === 'Home')
                 ? 'w-full'
                 : 'w-0 group-hover:w-full'
              }`} />
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-slate-600 dark:text-slate-300"
            aria-label="Toggle Theme"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          
          <button 
            className="md:hidden p-2 text-slate-600 dark:text-slate-300"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="pointer-events-auto absolute top-20 left-4 right-4 bg-white/95 dark:bg-brand-black/95 border border-slate-200 dark:border-white/10 backdrop-blur-xl rounded-2xl p-6 md:hidden flex flex-col gap-4 shadow-2xl"
        >
           {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => {
                item.action();
                setMobileMenuOpen(false);
              }}
              className="text-lg font-medium text-slate-800 dark:text-slate-300 hover:text-brand-periwinkle text-left"
            >
              {item.name}
            </button>
          ))}
        </motion.div>
      )}
    </header>
  );
};
