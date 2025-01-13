import React, { useState, useEffect } from 'react';

const OptimizedBackground = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Preload the next larger image size after component mounts
    const preloadLargerImage = new Image();
    preloadLargerImage.src = '/images/background-lg.webp';
  }, []);

  return (
    <>
      {/* Placeholder while image loads */}
      <div 
        className={`absolute inset-0 bg-gradient-to-b from-gray-800 to-gray-900 transition-opacity duration-500 ${
          loaded ? 'opacity-0' : 'opacity-100'
        }`}
      />

      <picture>
        {/* Desktop WebP variants */}
        <source
          srcSet="/images/background-lg.webp 1920w,
                  /images/background-md.webp 1280w,
                  /images/background-sm.webp 640w"
          sizes="(min-width: 1536px) 1920px,
                 (min-width: 1024px) 1280px,
                 (min-width: 768px) 960px,
                 640px"
          type="image/webp"
          media="(min-width: 768px)"
        />

        {/* Mobile WebP variants */}
        <source
          srcSet="/images/background-mobileLg.webp 1280w,
                  /images/background-mobileMd.webp 960w,
                  /images/background-mobileSm.webp 640w"
          sizes="(min-width: 640px) 960px,
                 640px"
          type="image/webp"
          media="(max-width: 767px)"
        />

        {/* Desktop JPEG fallback */}
        <source
          srcSet="/images/background-lg.jpg 1920w,
                  /images/background-md.jpg 1280w,
                  /images/background-sm.jpg 640w"
          sizes="(min-width: 1536px) 1920px,
                 (min-width: 1024px) 1280px,
                 (min-width: 768px) 960px,
                 640px"
          type="image/jpeg"
          media="(min-width: 768px)"
        />

        {/* Mobile JPEG fallback */}
        <source
          srcSet="/images/background-mobileLg.jpg 1280w,
                  /images/background-mobileMd.jpg 960w,
                  /images/background-mobileSm.jpg 640w"
          sizes="(min-width: 640px) 960px,
                 640px"
          type="image/jpeg"
          media="(max-width: 767px)"
        />

        <img
          src="/images/background-sm.jpg"
          alt="Background"
          className={`absolute inset-0 w-full h-full object-cover opacity-60 transition-opacity duration-500 ${
            loaded ? 'opacity-60' : 'opacity-0'
          }`}
          loading="eager"
          fetchPriority="high"
          width="1920"
          height="1080"
          onLoad={() => setLoaded(true)}
          style={{
            backgroundImage: `url('/images/background-placeholder.webp')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      </picture>

      {/* Preload tags for critical images */}
      <link
        rel="preload"
        as="image"
        href="/images/background-sm.webp"
        type="image/webp"
        media="(max-width: 767px)"
        fetchpriority="high"
      />
      <link
        rel="preload"
        as="image"
        href="/images/background-md.webp"
        type="image/webp"
        media="(min-width: 768px)"
        fetchpriority="high"
      />
    </>
  );
};

export default OptimizedBackground;