// src/components/SwipeableInsights.jsx

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';

const SWIPE_THRESHOLD = 30;
const VELOCITY_THRESHOLD = 200;

const InsightsCard = ({ title, data, subtitle }) => (
  <div className="bg-gray-800 p-4 rounded-lg shadow-md w-full">
    <div className="text-gray-300 text-xs font-bold uppercase tracking-widest mb-2">
      <span className="font-semibold text-emerald-400">{title}</span>
      {subtitle && (
        <span className="block text-gray-400 text-xs mt-1 normal-case">
          {subtitle}
        </span>
      )}
    </div>
    {data.map(([skillKey, skillValue], index) => (
      <div key={index} className="flex justify-between mb-1">
        <span className="capitalize text-gray-200">
          {skillKey.replace(/_/g, ' ')}
        </span>
        <span className="text-emerald-400 font-semibold">
          {skillValue}/10
        </span>
      </div>
    ))}
  </div>
);

const SwipeableInsights = ({ player }) => { // player is player.skills
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const controls = useAnimation();
  const [containerWidth, setContainerWidth] = useState(0);

  // Define growth targets based on skills
  const growthTargets = [
    ['laying_out', player.laying_out],
    ['endurance', player.endurance],
    ['vertical_leap', player.vertical_leap]
  ];

  useEffect(() => {
    const updateWidth = () => {
      const container = document.querySelector('.insights-container');
      if (container) {
        setContainerWidth(container.offsetWidth);
      }
    };
    
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const getSortedSkills = () => {
    const skillEntries = Object.entries(player).filter(([key, val]) => 
      typeof val === 'number'
    );
    return skillEntries.sort((a, b) => b[1] - a[1]);
  };

  const cards = [
    {
      title: 'Current Growth Targets',
      data: growthTargets
    },
    {
      title: 'Top 3 Strengths',
      data: getSortedSkills().slice(0, 3)
    },
    {
      title: 'Areas for Improvement',
      data: getSortedSkills().reverse().slice(0, 3)
    }
  ];

  const snapToIndex = (index) => {
    controls.start({
      x: -index * containerWidth,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40,
        mass: 0.8,
        restSpeed: 0.5,
        restDelta: 0.5
      }
    }).then(() => {
      setIsDragging(false);
    });
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (event, info) => {
    const swipe = info.offset.x;
    const velocity = info.velocity.x;
    
    const shouldSwipe = Math.abs(swipe) > SWIPE_THRESHOLD || Math.abs(velocity) > VELOCITY_THRESHOLD;
    
    if (shouldSwipe) {
      const direction = swipe > 0 ? -1 : 1;
      const nextIndex = currentIndex + direction;
      
      if (nextIndex >= 0 && nextIndex < cards.length) {
        setCurrentIndex(nextIndex);
        snapToIndex(nextIndex);
      } else {
        snapToIndex(currentIndex);
      }
    } else {
      snapToIndex(currentIndex);
    }
  };

  const handleDotClick = (index) => {
    if (!isDragging) {
      setCurrentIndex(index);
      snapToIndex(index);
    }
  };

  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold uppercase mb-3 text-gray-100">
        Key Insights
      </h2>
      
      <div className="relative insights-container overflow-hidden bg-gray-800 rounded-lg shadow-md">
        <motion.div
          className="flex"
          style={{ width: `${cards.length * 100}%` }}
          drag="x"
          dragConstraints={{
            left: -containerWidth * (cards.length - 1),
            right: 0
          }}
          dragElastic={0.1}
          dragMomentum={false}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          animate={controls}
          initial={{ x: 0 }}
        >
          {cards.map((card, index) => (
            <div
              key={index}
              style={{ width: containerWidth }}
            >
              <InsightsCard {...card} />
            </div>
          ))}
        </motion.div>
      </div>

      {/* Navigation Dots */}
      <div className="flex justify-center mt-4 space-x-3">
        {cards.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`w-2 h-2 rounded-full transition-all duration-200 ${
              index === currentIndex 
                ? 'bg-emerald-400 scale-110' 
                : 'bg-gray-600 hover:bg-gray-500'
            }`}
            disabled={isDragging}
          />
        ))}
      </div>
    </div>
  );
};

export default SwipeableInsights;
