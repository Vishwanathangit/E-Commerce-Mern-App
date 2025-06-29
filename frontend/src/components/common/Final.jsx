import React from 'react';

const Final = () => {
    return (
        <div className='flex flex-col items-center justify-center h-screen bg-gray-100'>
            <h1 className='font-bold text-3xl'>Purchase successfully completed</h1>
            <p className='m-2 text-orange-600'>Click below video for more</p>
            <iframe
                width="560"
                height="315"
                src="https://www.youtube.com/embed/xwPQRpiluAM?si=FvEASlWLaKrlcdlQ"
                title="YouTube video player" frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowfullscreen
            >
            </iframe>
        </div>
    );
};

export default Final;
