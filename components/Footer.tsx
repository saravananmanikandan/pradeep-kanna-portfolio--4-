import React from 'react';
import { Linkedin, Mail, ArrowUpRight, MapPin, Phone } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer id="contact" className="bg-[#F5F5F7] dark:bg-brand-black pt-24 pb-0 border-t border-slate-200 dark:border-white/5 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6 mb-24">
        <div className="flex flex-col md:flex-row gap-12 md:gap-24">
          
          {/* Left Side: Brand & Context */}
          <div className="md:w-5/12 flex flex-col justify-between">
            <div>
              <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-slate-900 dark:text-slate-100 tracking-tight">Let's Connect.</h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-md">
                Open for collaborations on Policy Research, Heritage Conservation, and Strategic Tech Initiatives.
              </p>
            </div>
            
            <div className="hidden md:block mt-auto pt-12">
               <div className="text-slate-500 dark:text-slate-500 text-sm">
                  &copy; 2025 Pradeep Kanna Ravichandran.<br/>All Rights Reserved.
               </div>
               <div className="text-slate-400 dark:text-slate-600 text-xs mt-2 font-medium">
                  <a href="https://www.linkedin.com/in/saravanan-manikandan-641bb0212/" target="_blank" rel="noreferrer" className="hover:text-brand-periwinkle transition-colors">
                      Designed and Developed by Saravanan
                  </a>
               </div>
            </div>
          </div>

          {/* Right Side: Contact Info */}
          <div className="md:w-7/12 flex flex-col gap-8">
            
            {/* Direct Contact */}
            <div className="flex flex-col gap-4">
               <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Contact Details</h3>
               
               <a href="mailto:pradeepkanna585@gmail.com" className="group flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 hover:border-accent-red/30 transition-all">
                  <div className="p-3 rounded-full bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 group-hover:bg-accent-red group-hover:text-white transition-colors shrink-0">
                    <Mail size={20} />
                  </div>
                  <span className="text-slate-700 dark:text-slate-200 text-base md:text-lg break-all sm:break-normal font-medium">pradeepkanna585@gmail.com</span>
               </a>

               <a href="tel:+918903518024" className="group flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 hover:border-accent-yellow/30 transition-all">
                  <div className="p-3 rounded-full bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 group-hover:bg-accent-yellow group-hover:text-black transition-colors shrink-0">
                    <Phone size={20} />
                  </div>
                  <span className="text-slate-700 dark:text-slate-200 text-base md:text-lg font-medium">+91 8903518024</span>
               </a>

               <div className="flex items-start gap-4 p-4 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5">
                  <div className="p-3 rounded-full bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 mt-1 shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div className="flex flex-col text-slate-700 dark:text-slate-200 text-base md:text-lg font-medium leading-relaxed">
                    <span className="block mb-1">Pradeep Kanna Ravichandran</span>
                    <span className="text-slate-500 dark:text-slate-400 font-normal">Plot 26, Karthick Nagar, Park Town</span>
                    <span className="text-slate-500 dark:text-slate-400 font-normal">Madurai 625017</span>
                  </div>
               </div>
            </div>

            {/* Social Links */}
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <a href="https://www.linkedin.com/in/pradeep-kanna-302954301/" target="_blank" rel="noreferrer" className="group flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 hover:border-accent-blue/30 transition-all">
                    <div className="flex items-center gap-3">
                        <Linkedin size={20} className="text-slate-400 group-hover:text-accent-blue transition-colors" />
                        <span className="font-medium text-slate-700 dark:text-slate-200">LinkedIn</span>
                    </div>
                    <ArrowUpRight size={18} className="text-slate-300 group-hover:text-accent-blue transition-colors" />
                </a>
                
                <a href="https://topmate.io/pradeep_kanna12/" target="_blank" rel="noreferrer" className="group flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 hover:border-accent-green/30 transition-all">
                    <div className="flex items-center gap-3">
                        <ArrowUpRight size={20} className="text-slate-400 group-hover:text-accent-green transition-colors" />
                        <span className="font-medium text-slate-700 dark:text-slate-200">Topmate</span>
                    </div>
                    <ArrowUpRight size={18} className="text-slate-300 group-hover:text-accent-green transition-colors" />
                </a>
             </div>

          </div>
          
           {/* Mobile Footer Bottom */}
           <div className="md:hidden mt-8 border-t border-slate-200 dark:border-white/5 pt-8">
             <div className="text-slate-500 dark:text-slate-500 text-sm">
                &copy; 2025 Pradeep Kanna Ravichandran.<br/>All Rights Reserved.
             </div>
             <div className="text-slate-400 dark:text-slate-600 text-xs mt-2 font-medium">
                <a href="https://www.linkedin.com/in/saravanan-manikandan-641bb0212/" target="_blank" rel="noreferrer">
                 Designed and Developed by Saravanan
                </a>
             </div>
          </div>

        </div>
      </div>

      {/* Footer Ticker */}
      <div className="w-full bg-brand-periwinkle/5 border-y border-slate-200 dark:border-white/5 py-4 relative overflow-hidden flex items-center">
        <div className="animate-ticker whitespace-nowrap flex gap-16 items-center">
          {[1,2,3,4].map(i => (
             <React.Fragment key={i}>
                <span className="text-slate-500 dark:text-slate-400 font-display text-lg uppercase tracking-wider hover:text-accent-purple transition-colors">Recognition: Invited to PM's Meeting (Feb 2025)</span>
                <span className="w-2 h-2 rounded-full bg-accent-yellow/50"></span>
                <span className="text-slate-500 dark:text-slate-400 font-display text-lg uppercase tracking-wider hover:text-accent-aqua transition-colors">Ministry of Textiles Report</span>
                <span className="w-2 h-2 rounded-full bg-accent-red/50"></span>
                <span className="text-slate-500 dark:text-slate-400 font-display text-lg uppercase tracking-wider hover:text-accent-green transition-colors">Bharat Tex 2025</span>
                <span className="w-2 h-2 rounded-full bg-accent-blue/50"></span>
             </React.Fragment>
          ))}
        </div>
      </div>
    </footer>
  );
};
