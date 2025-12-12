import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Loader2, Play } from 'lucide-react';
import { ProjectPost } from '../types';

export const ProjectsPage: React.FC = () => {
    const [projects, setProjects] = useState<ProjectPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                // Fetch projects with embedded media to get the featured image
                const response = await fetch('https://pradeepkanna.com/wp-json/wp/v2/project?_embed');
                if (!response.ok) throw new Error('Failed to fetch projects');
                const data = await response.json();
                setProjects(data);
            } catch (err) {
                console.error("Error fetching projects:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    // Helper to extract image URL
    const getImageUrl = (project: ProjectPost) => {
        if (project._embedded && project._embedded['wp:featuredmedia'] && project._embedded['wp:featuredmedia'][0]) {
            return project._embedded['wp:featuredmedia'][0].source_url;
        }
        return null;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F5F5F7] dark:bg-brand-black">
                <Loader2 className="animate-spin text-brand-periwinkle" size={48} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F5F5F7] dark:bg-brand-black pt-32 pb-24 px-6 transition-colors duration-500">
            {/* Header */}
            <div className="max-w-7xl mx-auto mb-20 text-center">
                <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="font-display text-5xl md:text-7xl font-bold text-slate-900 dark:text-white mb-6"
                >
                    Projects.
                </motion.h1>
                <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto"
                >
                    A collection of technical, cultural, and social initiatives.
                </motion.p>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project, index) => {
                    // Use ACF data if available, fallback to standard WP fields
                    const title = project.acf.title || project.title.rendered;
                    const description = project.acf.description || project.content.rendered.replace(/<[^>]+>/g, '');
                    const url = project.acf.url || project.link;
                    const imageUrl = getImageUrl(project);

                    return (
                        <motion.a 
                            key={project.id}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative flex flex-col bg-white dark:bg-[#1A1A1A] rounded-[2rem] overflow-hidden border border-slate-200 dark:border-white/5 hover:border-brand-periwinkle/50 dark:hover:border-brand-periwinkle/50 hover:shadow-2xl transition-all duration-500"
                        >
                            {/* Image Container */}
                            <div className="relative h-64 overflow-hidden bg-slate-100 dark:bg-white/5">
                                {imageUrl ? (
                                    <img 
                                        src={imageUrl} 
                                        alt={title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-slate-200 dark:bg-white/10">
                                        <Play className="text-slate-400 dark:text-white/20 w-16 h-16" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />
                                
                                <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/80 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                                    <ArrowUpRight size={20} className="text-slate-900 dark:text-white" />
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-8 flex flex-col flex-grow">
                                <h3 
                                    className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-3"
                                    dangerouslySetInnerHTML={{ __html: title }}
                                />
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm line-clamp-4 flex-grow">
                                    {description}
                                </p>
                                
                                <div className="mt-6 pt-6 border-t border-slate-100 dark:border-white/5 flex items-center text-sm font-medium text-brand-periwinkle group-hover:text-accent-blue transition-colors">
                                    View Project <ArrowUpRight size={16} className="ml-2" />
                                </div>
                            </div>
                        </motion.a>
                    );
                })}
            </div>
        </div>
    );
};
