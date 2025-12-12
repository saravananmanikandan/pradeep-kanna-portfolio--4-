
import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDownRight, Move, Circle, Linkedin, Mail, Twitter, Link } from 'lucide-react';
import { MemoryGame } from './MemoryGame';

// --- Physics Circles Component (Bouncing Balls) ---
const PhysicsCircles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle High DPI displays
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    let width = rect.width;
    let height = rect.height;

    // Physics constants
    const gravity = 0.5;
    const friction = 0.8;
    const mouseForceRadius = 150;

    // Theme colors
    const colors = [
      '#FCD748', // Yellow
      '#917FF0', // Purple
      '#72D2BE', // Aqua
      '#F97F7A', // Red
      '#61ADEB', // Blue
      '#3FAD4B'  // Green
    ];

    class Ball {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      originalRadius: number;

      constructor() {
        this.radius = Math.random() * 20 + 10;
        this.originalRadius = this.radius;
        this.x = Math.random() * (width - this.radius * 2) + this.radius;
        this.y = Math.random() * (height / 2); // Start in top half
        this.vx = (Math.random() - 0.5) * 8;
        this.vy = Math.random() * 5;
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        // Gravity
        this.vy += gravity;

        // Apply velocity
        this.x += this.vx;
        this.y += this.vy;

        // Floor collision
        if (this.y + this.radius > height) {
          this.y = height - this.radius;
          this.vy *= -friction; // Bounce with energy loss

          // Prevent micro-bouncing
          if (Math.abs(this.vy) < gravity * 2) {
            this.vy = 0;
          }
        }
        // Ceiling collision
        else if (this.y - this.radius < 0) {
          this.y = this.radius;
          this.vy *= -friction;
        }

        // Wall collision
        if (this.x + this.radius > width) {
          this.x = width - this.radius;
          this.vx *= -friction;
        } else if (this.x - this.radius < 0) {
          this.x = this.radius;
          this.vx *= -friction;
        }
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        // Shine effect
        ctx.beginPath();
        ctx.arc(this.x - this.radius * 0.3, this.y - this.radius * 0.3, this.radius * 0.2, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
        ctx.fill();
      }

      impulse(mx: number, my: number) {
        const dx = this.x - mx;
        const dy = this.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouseForceRadius) {
          const force = (mouseForceRadius - dist) / mouseForceRadius;
          // Kick up and away
          this.vx += (dx / dist) * force * 15;
          this.vy -= force * 20; // Upward kick
        }
      }
    }

    const balls: Ball[] = [];
    for (let i = 0; i < 15; i++) {
      balls.push(new Ball());
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      balls.forEach(ball => {
        ball.update();
        ball.draw();
      });
      requestAnimationFrame(animate);
    };

    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      width = rect.width;
      height = rect.height;
    };

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      balls.forEach(b => b.impulse(mx, my));
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      // Small nudge on hover
      balls.forEach(b => {
        const dx = b.x - mx;
        const dy = b.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < b.radius + 20) {
          b.vx += (dx / dist) * 1;
          b.vy += (dy / dist) * 1;
        }
      });
    }

    window.addEventListener('resize', handleResize);
    canvas.addEventListener('mousedown', handleClick);
    canvas.addEventListener('mousemove', handleMouseMove);

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousedown', handleClick);
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full bg-transparent cursor-pointer" />;
};

export const Hero: React.FC = () => {
  const [isPolaroidHovered, setIsPolaroidHovered] = useState(false);

  // Name Animation Variants
  const containerVars = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const letterVars = {
    hidden: { y: 100, opacity: 0, rotate: 10 },
    visible: {
      y: 0,
      opacity: 1,
      rotate: 0,
      transition: { type: 'spring', stiffness: 100, damping: 10 },
    },
  };

  const name = "Pradeep Kanna.".split("");

  const scrollToInitiatives = () => {
    const element = document.getElementById('initiatives');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="min-h-screen bg-[#F5F5F7] dark:bg-[#111] pt-24 pb-8 px-2 md:px-4 flex flex-col font-sans overflow-hidden transition-colors duration-500">

      <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 auto-rows-[minmax(0,auto)]">

        {/* --- Top Row: Identity (Full Width) --- */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="md:col-span-12 h-[55vh] min-h-[400px] bg-white dark:bg-[#1A1A1A] rounded-[2rem] border border-slate-200 dark:border-white/5 relative flex items-center justify-center overflow-hidden group shadow-xl dark:shadow-2xl transition-colors duration-500"
        >
          {/* Background Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

          {/* Subtle Gradient Glow behind name */}
          <div className="absolute inset-0 bg-gradient-to-tr from-brand-periwinkle/10 via-transparent to-brand-sepia/5 opacity-50 pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center text-center pointer-events-none px-4">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-3 mb-4 md:mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-accent-green shadow-[0_0_10px_rgba(63,173,75,0.5)]"></span>
              <p className="font-mono text-sm md:text-base text-slate-500 dark:text-white/50 tracking-widest uppercase">Hello, I'm</p>
            </motion.div>

            {/* Enhanced Name Animation */}
            <motion.div
              className="font-display font-bold text-slate-900 dark:text-white leading-[0.9] tracking-tighter mix-blend-screen overflow-hidden flex flex-wrap justify-center"
              style={{ fontSize: 'clamp(3rem, 12vw, 10rem)' }} // Responsive sizing
              variants={containerVars}
              initial="hidden"
              animate="visible"
            >
              {name.map((char, index) => (
                <motion.span
                  key={index}
                  variants={letterVars}
                  className={`inline-block ${char === " " ? "w-[3vw]" : ""} ${index > 7 ? 'text-accent-aqua' : 'text-slate-900 dark:text-white'}`}
                  style={{
                    textShadow: '0 0 30px rgba(163,180,214,0.2)'
                  }}
                >
                  {char}
                </motion.span>
              ))}
            </motion.div>
          </div>

          {/* Draggable Polaroid */}
          <motion.div
            drag
            dragConstraints={{ left: -300, right: 300, top: -200, bottom: 200 }}
            whileHover={{ scale: 1.05, rotate: 2, cursor: 'grab' }}
            whileDrag={{ scale: 1.1, rotate: 0, cursor: 'grabbing' }}
            onMouseEnter={() => setIsPolaroidHovered(true)}
            onMouseLeave={() => setIsPolaroidHovered(false)}
            className="absolute right-[5%] md:right-[15%] top-[20%] w-56 md:w-72 p-3 pb-12 bg-white shadow-2xl rotate-[6deg] hidden md:block cursor-grab active:cursor-grabbing hover:z-20 transition-transform border border-slate-100 dark:border-none"
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-12 bg-accent-blue/30 rotate-12 backdrop-blur-sm z-20 rounded-sm"></div>
            <div className="w-full aspect-[4/5] bg-slate-200 overflow-hidden relative grayscale hover:grayscale-0 transition-all duration-500">
              <img
                src="https://pradeepkanna.com/wp-content/uploads/2025/02/IMG_20250115_113152600_HDR-scaled.jpg"
                alt="Pradeep"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          {/* Decorative Elements */}
          <div className="absolute top-10 left-10 text-slate-300 dark:text-white/10 hidden md:block animate-pulse">
            <Move size={24} />
          </div>
        </motion.div>


        {/* --- Bottom Row: Roles & Interactive --- */}

        {/* Box 1: Roles Description & Socials - Responsive Update */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="md:col-span-5 min-h-[300px] md:h-[300px] bg-white dark:bg-[#1A1A1A] rounded-[2rem] p-6 md:p-10 flex flex-col justify-between border border-slate-200 dark:border-white/5 group relative overflow-hidden shadow-xl"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent-purple/5 dark:bg-accent-purple/10 rounded-full blur-[80px] group-hover:bg-accent-purple/10 dark:group-hover:bg-accent-purple/20 transition-colors" />

          <div className="relative z-10 flex flex-col gap-4">
            <div>
              <h3 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-white leading-tight mb-1">
                Engineer. Journalist. Historian.
              </h3>
              <p className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-slate-300 dark:text-white/30 leading-tight">
                Startup Generalist.
              </p>
            </div>

            {/* Social Icons */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <a
                href="https://linkedin.com/in/pradeepkanna"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-white/5 hover:bg-[#0077b5] hover:text-white dark:hover:bg-[#0077b5] text-slate-500 dark:text-slate-400 transition-all duration-300"
                title="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
              <a
                href="mailto:pradeepkanna585@gmail.com"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-white/5 hover:bg-accent-red hover:text-white dark:hover:bg-accent-red text-slate-500 dark:text-slate-400 transition-all duration-300"
                title="Email"
              >
                <Mail size={18} />
              </a>
              <a
                href="https://x.com/kannatweets"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-white/5 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black text-slate-500 dark:text-slate-400 transition-all duration-300"
                title="Twitter / X"
              >
                <Twitter size={18} />
              </a>
              <a
                href="https://topmate.io/pradeep_kanna12/"
                target="_blank"
                rel="noreferrer"
                className="h-10 px-4 flex items-center justify-center rounded-full bg-slate-100 dark:bg-white/5 hover:bg-accent-green hover:text-white dark:hover:bg-accent-green text-slate-500 dark:text-slate-400 transition-all duration-300 group/topmate"
                title="Topmate"
              >
                <img
                  src="https://topmate.io/_next/image?url=%2Fimages%2Fcommon%2Ftopmate-light.svg&w=384&q=75"
                  alt="Topmate"
                  className="h-4 w-auto opacity-70 group-hover/topmate:opacity-100 transition-opacity dark:invert-0 invert group-hover/topmate:invert-0"
                />
              </a>
            </div>
          </div>

          <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 mt-6 md:mt-auto">
            <span className="px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-slate-200 dark:border-white/10 text-[10px] md:text-xs font-mono text-slate-500 dark:text-white/50 uppercase tracking-wider group-hover:bg-slate-50 dark:group-hover:bg-white/5 transition-colors whitespace-nowrap">
              Based in India
            </span>

            {/* Blog Button */}
            <button
              onClick={scrollToInitiatives}
              className="flex items-center gap-2 md:gap-3 pl-3 pr-1.5 py-1.5 md:pl-4 md:pr-2 md:py-2 rounded-full bg-slate-100 dark:bg-white/5 hover:bg-brand-periwinkle hover:text-white dark:hover:bg-brand-periwinkle group/btn transition-all duration-300 cursor-pointer"
            >
              <span className="text-xs md:text-sm font-medium text-slate-900 dark:text-white group-hover/btn:text-white whitespace-nowrap">Read Blog</span>
              <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-white dark:bg-white/10 flex items-center justify-center text-slate-900 dark:text-white group-hover/btn:bg-white/20 group-hover/btn:text-white transition-all">
                <ArrowDownRight size={14} className="md:w-4 md:h-4" />
              </div>
            </button>
          </div>
        </motion.div>

        {/* Box 2: Physics Circles (Bouncing Balls) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="md:col-span-4 h-[300px] bg-white dark:bg-[#111111] rounded-[2rem] overflow-hidden border border-slate-200 dark:border-white/5 relative group shadow-xl transition-colors duration-500"
        >
          <div className="absolute top-6 left-6 z-10 bg-white/40 dark:bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-slate-200 dark:border-white/10 pointer-events-none transition-opacity opacity-100 group-hover:opacity-0">
            <span className="text-xs font-bold text-slate-800 dark:text-white/80 tracking-wider flex items-center gap-2">
              <Circle size={12} className="text-accent-yellow fill-accent-yellow" />
              GRAVITY
            </span>
          </div>
          <PhysicsCircles />
        </motion.div>

        {/* Box 3: Memory Game (History Sequences) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="hidden md:block md:col-span-3 h-[300px] bg-slate-50 dark:bg-[#1A1A1A] rounded-[2rem] overflow-hidden border border-slate-200 dark:border-white/5 shadow-xl transition-colors duration-500"
        >
          <MemoryGame />
        </motion.div>

      </div>
    </section>
  );
};
