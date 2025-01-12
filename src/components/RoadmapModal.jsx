import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Trophy, Target, Calendar, 
  Dumbbell, Wind, Users, CheckCircle2
} from 'lucide-react';

const ActionTarget = ({ icon: Icon, title, frequency, progress, total, tags }) => (
  <div className="bg-gray-700/50 rounded-lg p-4 space-y-2">
    <div className="flex items-start gap-3">
      <div className="mt-1">
        <Icon className="w-5 h-5 text-emerald-400" />
      </div>
      <div className="flex-1">
        <h4 className="font-medium text-gray-200">{title}</h4>
        <p className="text-sm text-gray-400">{frequency}</p>
        
        {/* Progress Section */}
        <div className="mt-2">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Progress</span>
            <span>{progress} / {total}</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-1.5">
            <div 
              className="bg-emerald-400 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${(progress / total) * 100}%` }}
            />
          </div>
        </div>

        {/* Tags */}
        <div className="mt-2 flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span 
              key={index}
              className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-700 text-emerald-400"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Completion Status */}
      {progress >= total && (
        <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
      )}
    </div>
  </div>
);

const RoadmapModal = ({ isOpen, onClose, player }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
      >
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25 }}
          className="absolute bottom-0 left-0 right-0 bg-gray-900 rounded-t-2xl max-h-[90vh] overflow-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-gray-900/95 backdrop-blur-sm p-4 border-b border-gray-800 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Development Roadmap</h2>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-gray-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 space-y-6">
            {/* Weekly Action Targets */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-medium text-gray-400">THIS WEEK'S TARGETS</h3>
              </div>
              <div className="space-y-3">
                <ActionTarget 
                  icon={Dumbbell}
                  title="Endurance Training"
                  frequency="3 sessions per week"
                  progress={2}
                  total={3}
                  tags={['Sprints', 'Distance Running', 'HIIT']}
                />
                
                <ActionTarget 
                  icon={Wind}
                  title="Focused Throwing Practice"
                  frequency="3 hours per week"
                  progress={1.5}
                  total={3}
                  tags={['Breaking the Mark', 'Release Points', 'Quick Release']}
                />

                <ActionTarget 
                  icon={Users}
                  title="Joint Training Session"
                  frequency="1 session this week"
                  progress={0}
                  total={1}
                  tags={['Handler Movement', 'Field Vision', 'Team Dynamics']}
                />
              </div>
            </section>

            {/* Monthly Goals */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-medium text-gray-400">MONTHLY GOALS</h3>
              </div>
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 mt-2" />
                  <div>
                    <h4 className="font-medium text-gray-200">Master New Throws</h4>
                    <p className="text-sm text-gray-400">Focus on specialty throws and situations</p>
                    <div className="mt-2">
                      <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>Progress</span>
                        <span>60%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-1.5">
                        <div className="bg-emerald-400 h-1.5 rounded-full w-3/5" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Development Path */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <Trophy className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-medium text-gray-400">DEVELOPMENT PATH</h3>
              </div>
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 mt-2" />
                  <div>
                    <h4 className="font-medium text-gray-200">Handler Certification</h4>
                    <p className="text-sm text-gray-400">Complete advanced handler training program</p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Action Buttons */}
          <div className="sticky bottom-0 bg-gray-900/95 backdrop-blur-sm p-4 border-t border-gray-800">
            <div className="flex gap-3">
              <button className="flex-1 bg-gray-800 text-white py-3 rounded-lg font-medium">
                Log Progress
              </button>
              <button className="flex-1 bg-emerald-500 text-white py-3 rounded-lg font-medium">
                Complete Target
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default RoadmapModal;