import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';

const FogBlob = ({ top, left, width, height, gradientClass }) => {
    const controls = useAnimation();

    useEffect(() => {
        let isMounted = true;

        const animateProcedurally = async () => {
            while (isMounted) {
                const randomX = (Math.random() - 0.5) * 80;       // -40% to +40% shift
                const randomY = (Math.random() - 0.5) * 70;       // -35% to +35% shift
                const randomScale = 0.35 + Math.random() * 0.80;  // Scales between 0.35x and 1.15x
                const randomRotate = (Math.random() - 0.5) * 160; // Rotation -80deg to +80deg
                const randomOpacity = 0.25 + Math.random() * 0.35; // Pulses between thin mist (0.25) and dense vapor (0.60)
                const randomDuration = 1.6 + Math.random() * 2.2;  // Rapid fluid pacing (1.6s - 3.8s per leg)

                await controls.start({
                    x: `${randomX}%`,
                    y: `${randomY}%`,
                    scale: randomScale,
                    rotate: randomRotate,
                    opacity: randomOpacity,
                    transition: {
                        duration: randomDuration,
                        ease: 'easeInOut',
                    },
                });
            }
        };

        animateProcedurally();

        return () => {
            isMounted = false;
        };
    }, [controls]);

    return (
        <motion.div
            style={{ willChange: 'transform, opacity' }}
            animate={controls}
            className={`absolute rounded-full transform-gpu ${top} ${left} ${width} ${height} ${gradientClass}`}
        />
    );
};

const FogBackground = () => {
    const blobConfigs = [
        // --- Top Section ---
        { top: 'top-[0%]', left: 'left-[2%]', width: 'w-[48rem]', height: 'h-[48rem]', gradientClass: 'bg-gradient-to-r from-white/45 via-zinc-100/25 to-transparent' },
        { top: 'top-[4%]', left: 'left-[30%]', width: 'w-[24rem]', height: 'h-[24rem]', gradientClass: 'bg-gradient-to-tr from-slate-100/40 via-white/20 to-transparent' },
        { top: 'top-[3%]', left: 'right-[2%]', width: 'w-[45rem]', height: 'h-[45rem]', gradientClass: 'bg-gradient-to-l from-stone-100/45 via-gray-100/25 to-transparent' },
        
        // --- Upper-Mid Section ---
        { top: 'top-[18%]', left: 'left-[15%]', width: 'w-[50rem]', height: 'h-[50rem]', gradientClass: 'bg-gradient-to-tr from-zinc-100/40 via-white/20 to-transparent' },
        { top: 'top-[24%]', left: 'right-[10%]', width: 'w-[48rem]', height: 'h-[48rem]', gradientClass: 'bg-gradient-to-bl from-white/45 via-slate-100/25 to-transparent' },
        { top: 'top-[28%]', left: 'right-[38%]', width: 'w-[26rem]', height: 'h-[26rem]', gradientClass: 'bg-gradient-to-r from-gray-100/40 via-white/20 to-transparent' },
        
        // --- Mid Section ---
        { top: 'top-[42%]', left: 'left-[5%]', width: 'w-[52rem]', height: 'h-[52rem]', gradientClass: 'bg-gradient-to-br from-white/45 via-stone-100/25 to-transparent' },
        { top: 'top-[46%]', left: 'left-[42%]', width: 'w-[28rem]', height: 'h-[28rem]', gradientClass: 'bg-gradient-to-tr from-zinc-100/40 via-slate-100/20 to-transparent' },
        { top: 'top-[52%]', left: 'right-[5%]', width: 'w-[50rem]', height: 'h-[50rem]', gradientClass: 'bg-gradient-to-bl from-white/45 via-gray-100/25 to-transparent' },
        
        // --- Lower Section ---
        { top: 'top-[66%]', left: 'left-[10%]', width: 'w-[48rem]', height: 'h-[48rem]', gradientClass: 'bg-gradient-to-r from-slate-100/40 via-zinc-100/20 to-transparent' },
        { top: 'top-[72%]', left: 'left-[45%]', width: 'w-[25rem]', height: 'h-[25rem]', gradientClass: 'bg-gradient-to-bl from-white/45 via-zinc-100/25 to-transparent' },
        { top: 'top-[76%]', left: 'right-[8%]', width: 'w-[48rem]', height: 'h-[48rem]', gradientClass: 'bg-gradient-to-tl from-stone-100/40 via-neutral-100/20 to-transparent' },
        
        // --- Bottom Section ---
        { top: 'top-[88%]', left: 'left-[6%]', width: 'w-[50rem]', height: 'h-[50rem]', gradientClass: 'bg-gradient-to-tr from-white/45 via-slate-100/25 to-transparent' },
        { top: 'top-[92%]', left: 'right-[15%]', width: 'w-[45rem]', height: 'h-[42rem]', gradientClass: 'bg-gradient-to-tl from-zinc-100/40 via-white/20 to-transparent' },
    ];

    return (
        <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden bg-black w-full h-full">
            <div className="absolute inset-0 w-full h-full blur-[50px]">
                {blobConfigs.map((config, index) => (
                    <FogBlob key={index} {...config} />
                ))}
            </div>
            {/* Precision Bottom Shield */}
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-b from-transparent via-black/80 to-black pointer-events-none z-10" />
        </div>
    );
};

export default FogBackground;