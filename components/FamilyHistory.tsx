import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, BookOpen, Globe } from 'lucide-react';
import { useContent } from '../context/ContentContext';

const iconMap: Record<string, any> = {
  BookOpen,
  Globe,
  Calendar
};

const TimelineItem = ({
  year,
  title,
  desc,
  iconName,
  align,
  accentColorClass
}: {
  year: string;
  title: string;
  desc: string;
  iconName: string;
  align: 'left' | 'right';
  accentColorClass: string;
}) => {
  const Icon = iconMap[iconName] || Calendar;

  return (
    <div className={`flex flex-col md:flex-row items-center gap-8 md:gap-16 w-full ${align === 'right' ? 'md:flex-row-reverse' : ''}`}>
      {/* Content Side */}
      <motion.div
        initial={{ opacity: 0, x: align === 'left' ? -50 : 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className={`flex-1 text-center ${align === 'left' ? 'md:text-right' : 'md:text-left'}`}
      >
        <div className={`inline-flex items-center gap-2 mb-2 ${align === 'left' ? 'md:flex-row-reverse' : 'md:flex-row'} justify-center md:justify-start`}>
          <span className={`px-3 py-1 rounded-full bg-white dark:bg-brand-sepia/10 ${accentColorClass} text-sm font-semibold border border-slate-200 dark:border-brand-sepia/20`}>
            {year}
          </span>
        </div>
        <h3 className="font-display text-3xl font-bold text-slate-800 dark:text-[#E6DCCD] mb-4">{title}</h3>
        <p className="font-sans text-slate-600 dark:text-[#A89F91] leading-relaxed text-lg">{desc}</p>
      </motion.div>

      {/* Center Line & Icon */}
      <div className="relative flex flex-col items-center">
        <div className="w-px h-24 bg-gradient-to-b from-transparent to-slate-300 dark:to-brand-sepia/50"></div>
        <div className={`p-4 rounded-full bg-white dark:bg-[#1a1612] border-2 border-slate-200 dark:border-brand-sepia/50 z-10 shadow-xl ${accentColorClass}`}>
          <Icon size={24} />
        </div>
        <div className="w-px h-24 bg-gradient-to-b from-slate-300 dark:from-brand-sepia/50 to-transparent"></div>
      </div>

      {/* Spacer for alignment */}
      <div className="flex-1 hidden md:block"></div>
    </div>
  );
};

export const FamilyHistory: React.FC = () => {
  const { content } = useContent();

  if (!content) return null;

  const { hero, timeline, quote } = content.familyHistory;

  return (
    <div className="min-h-screen bg-[#EAE5DE] dark:bg-[#0F0E0D] transition-colors duration-500 pt-32 pb-24 overflow-x-hidden w-full">
      {/* Hero Section of Page */}
      <section className="relative px-6 mb-24 text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand-sepia/5 dark:bg-brand-sepia/10 blur-[120px] rounded-full pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-4xl mx-auto"
        >
          <span className="block font-display text-brand-sepia dark:text-[#A89F91] uppercase tracking-[0.2em] text-sm mb-6">
            {hero.label}
          </span>
          <h1 className="font-display text-5xl md:text-7xl font-bold text-slate-900 dark:text-[#E6DCCD] mb-8 leading-tight whitespace-pre-line">
            {hero.title}
          </h1>
          <p className="font-sans text-xl md:text-2xl text-slate-600 dark:text-[#A89F91] max-w-2xl mx-auto font-light leading-relaxed mb-12">
            {hero.description}
          </p>

          {hero.image && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative max-w-2xl mx-auto rounded-2xl overflow-hidden shadow-2xl border-4 border-white/50 dark:border-white/5"
            >
              <img
                src={hero.image}
                alt="Family History"
                className="w-full h-auto object-cover grayscale opacity-90 hover:grayscale-0 hover:opacity-100 transition-all duration-700"
              />
            </motion.div>
          )}
        </motion.div>
      </section>

      {/* Timeline Section */}
      <section className="max-w-6xl mx-auto px-6 relative mt-24">
        {/* Continuous Center Line Background */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-brand-sepia/10 dark:bg-white/5 -translate-x-1/2 hidden md:block"></div>

        <div className="flex flex-col gap-12">
          {timeline.map((item, index) => (
            <TimelineItem
              key={index}
              year={item.year}
              title={item.title}
              desc={item.desc}
              iconName={item.icon}
              align={item.align as 'left' | 'right'}
              accentColorClass={item.accentColorClass}
            />
          ))}
        </div>
      </section>

      {/* Quote Section */}
      <section className="max-w-4xl mx-auto px-6 mt-32 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="p-12 border border-brand-sepia/20 rounded-3xl bg-brand-sepia/5 dark:bg-white/5"
        >
          <p className="font-display text-2xl md:text-3xl italic text-slate-800 dark:text-[#D6CFC7] leading-relaxed">
            "{quote}"
          </p>
        </motion.div>
      </section>
    </div>
  );
};