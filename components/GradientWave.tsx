import React, { useEffect, useRef } from 'react';

const GradientWave: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Configuration
        const brandColor = '#651FFF'; // Kanna Blue/Purple
        let width = container.clientWidth;
        let height = container.clientHeight;
        const dpr = window.devicePixelRatio || 1;

        // Wave parameters
        const waves = [
            { y: height * 0.5, length: 0.01, amplitude: 50, speed: 0.02, offset: 0, color: brandColor },
            { y: height * 0.5, length: 0.007, amplitude: 30, speed: 0.015, offset: 2, color: 'rgba(139, 92, 246, 0.5)' }, // Light Violet
            { y: height * 0.5, length: 0.02, amplitude: 20, speed: 0.01, offset: 4, color: 'rgba(101, 31, 255, 0.3)' }  // Low opacity brand
        ];

        let time = 0;
        let mouseX = width / 2;
        let mouseY = height / 2;
        let targetMouseX = width / 2;
        let targetMouseY = height / 2;

        const resize = () => {
            width = container.clientWidth;
            height = container.clientHeight;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            ctx.scale(dpr, dpr);
        };

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            targetMouseX = e.clientX - rect.left;
            targetMouseY = e.clientY - rect.top;
        };

        const handleMouseLeave = () => {
            // Reset to center slowly
            targetMouseX = width / 2;
            targetMouseY = height / 2;
        };

        window.addEventListener('resize', resize);
        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseleave', handleMouseLeave);
        resize();

        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            // Smooth mouse movement
            mouseX += (targetMouseX - mouseX) * 0.05;
            mouseY += (targetMouseY - mouseY) * 0.05;

            // Update Theme Colors dynamically
            const isDark = document.documentElement.classList.contains('dark');
            if (isDark) {
                waves[1].color = 'rgba(167, 139, 250, 0.5)'; // Lighter purple for dark mode
            } else {
                waves[1].color = 'rgba(139, 92, 246, 0.5)'; // Violet for light mode
            }

            waves.forEach((wave, i) => {
                ctx.beginPath();
                ctx.moveTo(0, height);

                for (let x = 0; x < width; x++) {
                    // Interaction: modify amplitude based on distance to mouse
                    const dist = Math.abs(x - mouseX);
                    const mouseEffect = Math.max(0, (1 - dist / 300) * 40); // Localized wave height increase

                    // Wave calculation
                    // y = base_y + sin(x * length + time + offset) * amplitude
                    const sine = Math.sin(x * wave.length + time * wave.speed + wave.offset);
                    const y = wave.y + sine * (wave.amplitude + mouseEffect) + (mouseY - height / 2) * 0.1 * (i + 1); // Parallax-ish effect

                    ctx.lineTo(x, y);
                }

                ctx.lineTo(width, height);
                ctx.lineTo(0, height);
                ctx.closePath();
                ctx.fillStyle = wave.color;
                ctx.fill();
            });

            time += 1;
            requestAnimationFrame(animate);
        };

        const animationId = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('resize', resize);
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('mouseleave', handleMouseLeave);
            cancelAnimationFrame(animationId);
        };
    }, []);

    return (
        <div ref={containerRef} className="w-full h-full bg-transparent relative overflow-hidden">
            <canvas ref={canvasRef} className="block w-full h-full" />

            {/* Optional Overlay Gradient for smoother blending if needed */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none hover:bg-transparent transition-colors duration-500" />
        </div>
    );
};

export default GradientWave;
