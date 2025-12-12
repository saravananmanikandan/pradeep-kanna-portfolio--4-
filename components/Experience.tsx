import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const projects = [
  {
    title: "YNOS Venture Engine",
    role: "Chief of Staff",
    description: "Guiding the Indian startup ecosystem under Prof. Thillai Rajan.",
    className: "md:col-span-2 md:row-span-2", 
    gradient: "from-accent-blue/10 to-slate-50 dark:from-accent-blue/20 dark:to-slate-900/20",
    borderHover: "hover:border-accent-blue"
  },
  {
    title: "India Speaks Ai",
    role: "Election Tech & Outreach",
    description: "Managed strategic partnerships for the June 2024 Election Cycle.",
    className: "md:col-span-1 md:row-span-2",
    gradient: "from-accent-purple/10 to-slate-50 dark:from-accent-purple/20 dark:to-slate-900/20",
    borderHover: "hover:border-accent-purple"
  },
  {
    title: "Yellow Bag Foundation",
    role: "Sustainability Lead",
    description: "Empowering women self-help groups & promoting sustainable living globally.",
    className: "md:col-span-2 md:row-span-1",
    gradient: "from-accent-yellow/10 to-amber-50 dark:from-accent-yellow/20 dark:to-amber-900/10",
    borderHover: "hover:border-accent-yellow"
  },
  {
    title: "Pick Your Trail",
    role: "Experience Manager",
    description: "Enhancing international travel experiences.",
    className: "md:col-span-1 md:row-span-1",
    gradient: "from-accent-aqua/10 to-slate-50 dark:from-accent-aqua/20 dark:to-slate-900/20",
    borderHover: "hover:border-accent-aqua"
  },
  {
    title: "The Hindu Metroplus",
    role: "Journalism",
    description: "Travel, Lifestyle, & Tamil Heritage.",
    className: "md:col-span-1 md:row-span-1",
    gradient: "from-accent-red/10 to-slate-50 dark:from-accent-red/20 dark:to-slate-900/20",
    borderHover: "hover:border-accent-red"
  },
];

export const Experience: React.FC = () => {
  return (
    <section id="works" className="py-24 px-6 bg-[#F5F5F7] dark:bg-brand-black relative transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="font-display text-4xl font-bold mb-4 text-slate-900 dark:text-slate-100">Selected Works</h2>
          <div className="h-1 w-20 bg-accent-green rounded-full shadow-[0_0_10px_rgba(63,173,75,0.4)]" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-[200px] gap-4">
          {projects.map((project, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`
                group relative p-8 rounded-3xl border border-slate-200 dark:border-white/5 
                bg-gradient-to-br ${project.gradient} backdrop-blur-xl 
                overflow-hidden transition-all duration-500
                flex flex-col justify-between
                shadow-sm hover:shadow-xl dark:shadow-none
                ${project.className}
                ${project.borderHover}
              `}
            >
              <div className="absolute inset-0 bg-white/40 dark:bg-white/0 group-hover:bg-white/60 dark:group-hover:bg-white/5 transition-colors duration-500" />
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-500 border border-slate-200 dark:border-white/5 px-2 py-1 rounded-md bg-white/50 dark:bg-transparent">
                    {project.role}
                  </span>
                  <ArrowUpRight className="text-slate-400 dark:text-slate-500 group-hover:text-slate-900 dark:group-hover:text-white transition-colors opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 duration-300" />
                </div>
                <h3 className="font-display text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                  {project.title}
                </h3>
              </div>

              <div className="relative z-10">
                <p className="text-slate-600 dark:text-slate-400 font-light leading-relaxed group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors">
                  {project.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
