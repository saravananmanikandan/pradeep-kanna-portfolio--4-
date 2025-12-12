import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Loader2, ArrowUpRight, BookOpen } from 'lucide-react';
import { BlogPost } from '../types';

// Helper to extract image src from content string
const extractImage = (content: string) => {
    const imgRegex = /<img[^>]+src="([^">]+)"/;
    const match = content.match(imgRegex);
    return match ? match[1] : null;
};

// Helper to clean text
const stripHtml = (html: string) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
};

const ContentCard: React.FC<{ item: BlogPost; type: 'event' | 'article' | 'recent' }> = ({ item, type }) => {
    const imageUrl = item.content?.rendered ? extractImage(item.content.rendered) : null;
    const cleanExcerpt = item.excerpt?.rendered 
        ? stripHtml(item.excerpt.rendered) 
        : item.content?.rendered 
            ? stripHtml(item.content.rendered).substring(0, 150) + '...'
            : '';

    // Prioritize ACF post_url for articles
    const linkUrl = item.acf?.post_url || item.link;
    
    // Only articles (Hindu) should link out. Events are static.
    const isClickable = type === 'article';
    const Wrapper = isClickable ? motion.a : motion.div;
    const wrapperProps = isClickable ? {
        href: linkUrl,
        target: "_blank",
        rel: "noopener noreferrer"
    } : {};

    return (
        <Wrapper 
            {...wrapperProps}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`
                group block relative bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 
                overflow-hidden transition-all duration-500
                ${isClickable ? 'hover:border-brand-periwinkle/50 dark:hover:border-brand-periwinkle/50 cursor-pointer' : ''}
                ${type === 'recent' ? 'md:col-span-2 md:flex md:h-[400px]' : 'h-full flex flex-col'}
                ${type !== 'recent' ? 'rounded-2xl' : 'rounded-3xl'}
            `}
        >
            {/* Image Section */}
            {imageUrl && (
                <div className={`
                    relative overflow-hidden bg-slate-100 dark:bg-white/5
                    ${type === 'recent' ? 'md:w-1/2 h-64 md:h-full' : 'h-48 w-full'}
                `}>
                    <img 
                        src={imageUrl} 
                        alt="Featured" 
                        className={`w-full h-full object-cover transition-transform duration-700 ${isClickable ? 'group-hover:scale-105' : ''}`}
                    />
                    {isClickable && <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60" />}
                </div>
            )}

            {/* Content Section */}
            <div className={`
                p-8 flex flex-col justify-between relative
                ${type === 'recent' ? (imageUrl ? 'md:w-1/2' : 'w-full') : 'flex-1'}
                ${!imageUrl && type !== 'recent' ? 'h-[300px]' : ''}
            `}>
                <div>
                     <div className="flex justify-between items-center mb-4">
                        <span className="text-xs font-bold tracking-widest uppercase text-brand-periwinkle">
                            {new Date(item.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                        </span>
                        {type === 'recent' && (
                             <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider bg-brand-periwinkle/10 text-brand-periwinkle rounded-full">
                                New
                             </span>
                        )}
                    </div>

                    <h3 className={`font-display font-bold text-slate-900 dark:text-slate-100 mb-4 ${isClickable ? 'group-hover:text-brand-periwinkle' : ''} transition-colors ${type === 'recent' ? 'text-3xl' : 'text-xl'}`}>
                        <span dangerouslySetInnerHTML={{ __html: item.title.rendered }} />
                    </h3>

                    <p className="text-slate-600 dark:text-slate-400 font-light leading-relaxed line-clamp-4">
                        {cleanExcerpt}
                    </p>
                </div>

                {isClickable && (
                    <div className="mt-8 flex items-center gap-2 text-sm font-medium text-slate-900 dark:text-white">
                        Read Story <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                )}
            </div>
        </Wrapper>
    );
};

export const InitiativesPage: React.FC = () => {
    const [data, setData] = useState<{
        recentEvents: BlogPost[];
        events: BlogPost[];
        hindu: BlogPost[];
    }>({ recentEvents: [], events: [], hindu: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                // Fetch generous amounts to show "all content"
                const [recentRes, eventsRes, hinduRes] = await Promise.all([
                    fetch('https://pradeepkanna.com/wp-json/wp/v2/recent_events?per_page=10'),
                    fetch('https://pradeepkanna.com/wp-json/wp/v2/events?per_page=10'),
                    fetch('https://pradeepkanna.com/wp-json/wp/v2/hindu_article?per_page=10')
                ]);

                setData({
                    recentEvents: await recentRes.json(),
                    events: await eventsRes.json(),
                    hindu: await hinduRes.json()
                });
            } catch (e) {
                console.error("Failed to fetch initiatives", e);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, []);

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
                    Initiatives.
                </motion.h1>
                <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto"
                >
                    A comprehensive archive of events, media features, and published works bridging policy and culture.
                </motion.p>
            </div>

            <div className="max-w-7xl mx-auto space-y-32">
                
                {/* Recent Events Section */}
                {data.recentEvents.length > 0 && (
                    <section>
                         <div className="flex items-center gap-4 mb-12">
                            <h2 className="font-display text-3xl font-bold text-slate-900 dark:text-white">Recent Highlights</h2>
                            <div className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {data.recentEvents.map((item) => (
                                <ContentCard key={item.id} item={item} type="recent" />
                            ))}
                        </div>
                    </section>
                )}

                {/* Events Section */}
                <section>
                    <div className="flex items-center gap-4 mb-12">
                        <h2 className="font-display text-3xl font-bold text-slate-900 dark:text-white">Public Events</h2>
                        <div className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {data.events.map((item) => (
                            <ContentCard key={item.id} item={item} type="event" />
                        ))}
                    </div>
                </section>

                {/* The Hindu Section */}
                <section>
                    <div className="flex items-center gap-4 mb-12">
                        <h2 className="font-display text-3xl font-bold text-slate-900 dark:text-white">The Hindu</h2>
                        <div className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {data.hindu.map((item) => (
                            <ContentCard key={item.id} item={item} type="article" />
                        ))}
                    </div>
                </section>

                {/* Medium Section Banner */}
                <section className="relative rounded-3xl overflow-hidden bg-slate-900 dark:bg-white/5 border border-slate-800 dark:border-white/10 p-12 md:p-24 text-center">
                    <div className="absolute inset-0 bg-gradient-to-r from-brand-periwinkle/20 to-purple-500/20 mix-blend-overlay" />
                    <div className="relative z-10">
                        <BookOpen size={48} className="text-white mx-auto mb-6 opacity-80" />
                        <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-6">Read on Medium</h2>
                        <p className="text-slate-300 text-lg max-w-2xl mx-auto mb-10">
                            For deeper dives into technology policy and historical analysis, follow my long-form writing on Medium.
                        </p>
                        <a 
                            href="https://medium.com/@pr.kanna95" 
                            target="_blank" 
                            rel="noreferrer"
                            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-slate-900 rounded-full font-bold hover:bg-brand-periwinkle hover:text-white transition-colors duration-300"
                        >
                            Visit Medium Profile <ArrowUpRight size={20} />
                        </a>
                    </div>
                </section>

            </div>
        </div>
    );
};
