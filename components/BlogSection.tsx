import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Loader2 } from 'lucide-react';
import { BlogPost } from '../types';

export const BlogSection: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('https://pradeepkanna.com/wp-json/wp/v2/posts?per_page=3');
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        console.error("Error fetching blog posts:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <section id="blog" className="py-24 px-6 bg-[#F5F5F7] dark:bg-brand-black border-t border-slate-200 dark:border-white/5 transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-12">
            <div>
                <h2 className="font-display text-4xl font-bold mb-2 text-slate-900 dark:text-slate-100">Thoughts & Insights</h2>
                <p className="text-slate-500 dark:text-slate-400">Latest from the blog</p>
            </div>
            <a href="https://pradeepkanna.com" target="_blank" rel="noreferrer" className="hidden md:flex items-center gap-2 text-brand-periwinkle hover:text-slate-900 dark:hover:text-white transition-colors text-sm font-medium">
                View all <ArrowRight size={16} />
            </a>
        </div>

        {loading ? (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="animate-spin text-slate-500" size={32} />
            </div>
        ) : error ? (
            <div className="text-center py-12 border border-slate-200 dark:border-white/5 rounded-2xl bg-white/5">
                <p className="text-slate-400">Unable to load latest posts.</p>
                <a href="https://pradeepkanna.com" target="_blank" rel="noreferrer" className="text-brand-periwinkle mt-2 inline-block">Visit Blog directly</a>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {posts.map((post, index) => (
                    <motion.a 
                        key={post.id}
                        href={post.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="group flex flex-col justify-between p-8 rounded-2xl bg-white border border-slate-200 dark:bg-white/[0.02] dark:border-white/5 hover:border-brand-periwinkle/50 dark:hover:bg-white/[0.05] dark:hover:border-brand-periwinkle/30 transition-all duration-300 h-[300px] shadow-sm hover:shadow-md dark:shadow-none"
                    >
                        <div>
                            <p className="text-xs text-brand-periwinkle/90 dark:text-brand-periwinkle/70 mb-4">{new Date(post.date).toLocaleDateString()}</p>
                            <h3 
                                className="font-display text-xl font-bold text-slate-800 dark:text-slate-200 mb-4 line-clamp-3 group-hover:text-brand-periwinkle transition-colors"
                                dangerouslySetInnerHTML={{ __html: post.title.rendered }} 
                            />
                            <div 
                                className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 font-light leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }} 
                            />
                        </div>
                        <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mt-6 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                            READ ARTICLE <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
                        </div>
                    </motion.a>
                ))}
            </div>
        )}
      </div>
    </section>
  );
};