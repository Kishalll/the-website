import React from 'react';
import GradientBlinds from './GradientBlinds';

// Fixed to the viewport so long pages don't stretch the canvas.
// The overlay keeps headings readable over the bright slats.
const PageBackground = () => (
    <div className="fixed inset-0 z-0 pointer-events-none select-none bg-black">
        <GradientBlinds
            gradientColors={['#ffffff', '#000000']}
            lightColor="#ffffff"
        />
        <div className="absolute inset-0 bg-black/50" />
    </div>
);

export default PageBackground;
