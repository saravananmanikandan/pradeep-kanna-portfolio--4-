
import React, { useEffect, useRef } from 'react';

const MatrixRain = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = container.clientWidth;
        let height = container.clientHeight;

        // Handle High DPI
        const dpr = window.devicePixelRatio || 1;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);

        // Matrix characters - Katakana + Latin
        const chars = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレゲゼデベペオォコソトノホモヨョロヲゴゾドボポ1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const charArray = chars.split('');

        const fontSize = 16;
        const columns = Math.ceil(width / fontSize);

        // One drop per column, value is current y coordinate
        const drops: number[] = [];
        for (let i = 0; i < columns; i++) {
            drops[i] = Math.random() * -100; // Start above screen randomly
        }

        // Mouse interaction
        let mouseX = -1000;
        let mouseY = -1000;

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouseX = e.clientX - rect.left;
            mouseY = e.clientY - rect.top;
        };

        const handleMouseLeave = () => {
            mouseX = -1000;
            mouseY = -1000;
        };

        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseleave', handleMouseLeave);

        // Animation loop
        let lastTime = 0;
        const fps = 30; // Limit FPS for classic matrix feel
        const frameInterval = 1000 / fps;

        // Palette Colors
        const brandBlue = '#651FFF';
        const colors = {
            light: {
                text: brandBlue,
                head: '#8B5CF6', // Lighter violet
                fade: 'rgba(255, 255, 255, 0.2)',
                highlight: '#111'
            },
            dark: {
                text: brandBlue,
                head: '#A78BFA', // Light purple
                fade: 'rgba(26, 26, 26, 0.2)',
                highlight: '#FFFFFF'
            }
        };

        const draw = (currentTime: number) => {
            const deltaTime = currentTime - lastTime;

            requestAnimationFrame(draw);

            if (deltaTime < frameInterval) return;
            lastTime = currentTime - (deltaTime % frameInterval);

            // Check Theme
            const isDark = document.documentElement.classList.contains('dark');
            const theme = isDark ? colors.dark : colors.light;

            // Fade effect
            ctx.fillStyle = theme.fade;
            ctx.fillRect(0, 0, width, height);

            ctx.font = `${fontSize}px monospace`;

            for (let i = 0; i < drops.length; i++) {
                const text = charArray[Math.floor(Math.random() * charArray.length)];
                const x = i * fontSize;
                const y = drops[i] * fontSize;

                const dist = Math.hypot(x - mouseX, y - mouseY);
                const isHovered = dist < 100;

                if (isHovered) {
                    ctx.fillStyle = theme.highlight;
                } else {
                    const isHead = Math.random() > 0.95;
                    ctx.fillStyle = isHead ? theme.head : theme.text;
                }

                ctx.fillText(text, x, y);

                if (y > height && Math.random() > 0.975) {
                    drops[i] = 0;
                }

                drops[i]++;
            }
        };

        const animationId = requestAnimationFrame(draw);

        const handleResize = () => {
            if (!container || !canvas) return;
            width = container.clientWidth;
            height = container.clientHeight;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            ctx.scale(dpr, dpr);

            const newColumns = Math.ceil(width / fontSize);
            if (newColumns > drops.length) {
                for (let i = drops.length; i < newColumns; i++) {
                    drops[i] = Math.random() * -100;
                }
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', handleResize);
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    return (
        <div ref={containerRef} className="w-full h-full bg-transparent relative overflow-hidden">
            <canvas
                ref={canvasRef}
                className="block w-full h-full"
            />
            {/* Overlay removed */}
        </div>
    );
};

export default MatrixRain;
