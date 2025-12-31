import React from 'react';

const Grain = () => {
    return (
        <div className="pointer-events-none fixed inset-0 z-[9999] opacity-[0.05] mix-blend-overlay">
            <div
                className="absolute inset-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"
            ></div>
        </div>
    );
};

export default Grain;
