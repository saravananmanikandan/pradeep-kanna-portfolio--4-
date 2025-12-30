import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

import { useContent } from '../context/ContentContext';

// Remove projects variable, access content inside component


export const Experience: React.FC = () => {
  const { content } = useContent();
  if (!content) return null;
  const projects = content.experience.projects;

  return (
    <section id="works" className="py-24 px-6 md:px-12 bg-[#F5F5F7] dark:bg-brand-black relative transition-colors duration-500">
      <div className="max-w-[1400px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="font-display text-4xl font-bold mb-4 text-slate-900 dark:text-slate-100">{content.experience.title}</h2>
          <div className="h-1 w-20 bg-accent-green rounded-full shadow-[0_0_10px_rgba(63,173,75,0.4)]" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 auto-rows-[280px] md:auto-rows-[300px] gap-6 md:gap-8">
          {projects.map((project, i) => (
            <motion.a
              key={i}
              href={project.link}
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className={`
                group relative p-8 md:p-12 rounded-[2.5rem] border border-slate-200 dark:border-white/5 
                bg-gradient-to-br ${project.gradient} backdrop-blur-xl 
                overflow-hidden transition-all duration-500
                flex flex-col justify-between
                shadow-sm hover:shadow-2xl dark:shadow-none
                cursor-pointer
                ${project.className}
                ${project.borderHover}
              `}
            >
              <div className="absolute inset-0 bg-white/20 dark:bg-white/0 group-hover:bg-white/40 dark:group-hover:bg-white/5 transition-colors duration-500" />

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/10 px-3 py-1.5 rounded-full bg-white/50 dark:bg-white/5">
                    {project.role}
                  </span>
                  <div className="p-2 rounded-full bg-white/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-400 dark:text-slate-500 group-hover:text-slate-900 dark:group-hover:text-white group-hover:bg-white dark:group-hover:bg-white/10 transition-all duration-300">
                    <ArrowUpRight size={20} className="transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>
                <h3 className="font-display text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2 tracking-tight">
                  {project.title}
                </h3>
              </div>

              <div className="relative z-10 max-w-[90%]">
                <p className="text-lg text-slate-600 dark:text-slate-400 font-light leading-relaxed group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors">
                  {project.description}
                </p>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};
