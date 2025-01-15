import React, { useState, useEffect } from 'react';

const OptimizedBackground = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Check if we already have a preload link for any of our background images
    const existingPreload = document.querySelector('link[rel="preload"][href*="background"]');
    
    // Only add new preload if we don't already have one
    if (!existingPreload) {
      const isMobile = window.innerWidth < 768;

      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.type = 'image/webp';

      if (isMobile) {
        link.href = '/images/background-mobileSm.webp';
        link.media = '(max-width: 767px)';
      } else {
        link.href = '/images/background-sm.webp';
        link.media = '(min-width: 768px)';
      }

      document.head.appendChild(link);

      return () => {
        if (link.parentNode) {
          link.parentNode.removeChild(link);
        }
      };
    }
  }, []);

  return (
    <>
      {/* Placeholder overlay while the main image loads */}
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
    </>
  );
};

export default OptimizedBackground;
