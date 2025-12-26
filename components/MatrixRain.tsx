
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

        const draw = (currentTime: number) => {
            const deltaTime = currentTime - lastTime;

            requestAnimationFrame(draw);

            if (deltaTime < frameInterval) return;
            lastTime = currentTime - (deltaTime % frameInterval);

            // Semi-transparent black for trail effect
            // Use theme-aware background color in real app, but Matrix is usually dark
            ctx.fillStyle = 'rgba(10, 10, 10, 0.1)';
            ctx.fillRect(0, 0, width, height);

            ctx.font = `${fontSize}px monospace`;

            for (let i = 0; i < drops.length; i++) {
                // Pick a random character
                const text = charArray[Math.floor(Math.random() * charArray.length)];

                const x = i * fontSize;
                const y = drops[i] * fontSize;

                // Distance from mouse
                const dist = Math.hypot(x - mouseX, y - mouseY);
                const isHovered = dist < 100;

                // Color logic
                if (isHovered) {
                    // White/Bright Green near mouse
                    ctx.fillStyle = '#fff';
                    // ctx.shadowBlur = 10;
                    // ctx.shadowColor = '#fff';
                } else {
                    // Standard Green
                    // Randomly vary opacity/brightness for depth
                    const isHead = Math.random() > 0.95;
                    if (isHead) {
                        ctx.fillStyle = '#4ADE80'; // Bright green head
                    } else {
                        ctx.fillStyle = '#0F0'; // Standard green
                    }
                    // ctx.shadowBlur = 0;
                }

                // Draw the character
                ctx.fillText(text, x, y);

                // Reset drop to top randomly after it has crossed the screen
                // or randomly with small chance
                if (y > height && Math.random() > 0.975) {
                    drops[i] = 0;
                }

                // Increment y
                drops[i]++;
            }
        };

        // Need to start the loop
        const animationId = requestAnimationFrame(draw);

        const handleResize = () => {
            if (!container || !canvas) return;
            width = container.clientWidth;
            height = container.clientHeight;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            ctx.scale(dpr, dpr);

            // Re-calculate columns
            const newColumns = Math.ceil(width / fontSize);
            // Preserve existing drops if possible, add new ones if wider
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
        <div ref={containerRef} className="w-full h-full bg-black relative overflow-hidden">
            <canvas
                ref={canvasRef}
                className="block w-full h-full"
            />
            {/* Overlay vignette or scanlines (optional) */}
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%] bg-repeat" />
        </div>
    );
};

export default MatrixRain;
