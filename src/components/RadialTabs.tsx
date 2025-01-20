import React from 'react';
import { motion } from 'framer-motion';
import { Home, Brain, Shield, Sword, Activity } from 'lucide-react';

export type TabValue = 'home' | 'physical' | 'offensive' | 'defensive' | 'mental';

// Props interfaces
interface RadialTabsProps {
  activeTab: TabValue;
  onChangeTab: (tab: TabValue) => void;
  averages?: Record<string, number>;
}

interface RadialProgressProps {
  value?: number;
  isActive: boolean;
  children: React.ReactNode;
}

interface TabButtonProps {
  isActive: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  score?: number;
}

interface Tab {
  value: TabValue;
  label: string;
  icon: React.ReactNode;
  score: number;
}

// Utility to merge class names conditionally
const cn = (...classes: (string | boolean | undefined)[]): string => 
  classes.filter(Boolean).join(' ');

// Circular progress component with an icon in the center
const RadialProgress: React.FC<RadialProgressProps> = ({ 
  value = 0, 
  isActive, 
  children 
}) => {
  const percentage = Math.min(Math.max((value / 10) * 100, 0), 100);
  
  return (
    <div className="relative w-16 h-16">
      {/* Background Circle */}
      <div className="absolute inset-0 rounded-full bg-gray-800" />
      
      {/* Progress Circle */}
      <svg className="absolute inset-0 w-full h-full -rotate-90">
        <circle
          cx="32"
          cy="32"
          r="28"
          strokeWidth="3"
          fill="none"
          className="stroke-gray-700"
        />
        <circle
          cx="32"
          cy="32"
          r="28"
          strokeWidth="3"
          fill="none"
          strokeDasharray={`${percentage * 1.76} 176`}
          className={cn(
            "transition-all duration-300",
            isActive ? "stroke-emerald-500" : "stroke-gray-600"
          )}
        />
      </svg>
      
      {/* Icon */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className={cn(
          "p-3 rounded-full transition-colors",
          isActive ? "bg-emerald-500 text-white" : "bg-gray-700 text-gray-300"
        )}>
          {children}
        </div>
      </div>
    </div>
  );
};

// Each radial tab button
const TabButton: React.FC<TabButtonProps> = ({ 
  isActive, 
  onClick, 
  icon, 
  label, 
  score = 0 
}) => {
  return (
    <motion.button
      onClick={onClick}
      className="flex flex-col items-center space-y-2 group"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <RadialProgress value={score} isActive={isActive}>
        {icon}
      </RadialProgress>
      
      <span className={cn(
        "text-xs font-medium transition-colors",
        isActive ? "text-emerald-400" : "text-gray-400 group-hover:text-gray-300"
      )}>
        {label}
      </span>
    </motion.button>
  );
};

// Radial Tabs Navigation Component
const RadialTabs: React.FC<RadialTabsProps> = ({ 
  activeTab = 'home', 
  onChangeTab, 
  averages = {} 
}) => {
  // Safely get the score for each tab
  const getScore = (key: string): number => {
    return (averages && typeof averages[key] === 'number') ? averages[key] : 0;
  };

  // Tabs Configuration
  const TABS: Tab[] = [
    { value: 'home', label: 'Overview', icon: <Home className="w-5 h-5" />, score: getScore('home') },
    { value: 'physical', label: 'Physical', icon: <Activity className="w-5 h-5" />, score: getScore('physical') },
    { value: 'offensive', label: 'Offensive', icon: <Sword className="w-5 h-5" />, score: getScore('offensive') },
    { value: 'defensive', label: 'Defensive', icon: <Shield className="w-5 h-5" />, score: getScore('defensive') },
    { value: 'mental', label: 'Mental', icon: <Brain className="w-5 h-5" />, score: getScore('mental') },
  ];

  return (
    <div className="relative">
      {/* Navigation Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-gray-800" />
      
      {/* Navigation Buttons */}
      <div className="relative px-6 py-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          {TABS.map((tab) => (
            <TabButton
              key={tab.value}
              isActive={activeTab === tab.value}
              onClick={() => onChangeTab(tab.value)}
              icon={tab.icon}
              label={tab.label}
              score={tab.score}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RadialTabs;