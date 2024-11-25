import React from 'react';
import { ArrowRight } from 'lucide-react';

interface HeroProps {
  onJoinUsClick: () => void;
  onExploreClick: () => void;
}

export function Hero({ onJoinUsClick, onExploreClick }: HeroProps) {
  return (
    <div className="relative bg-[#006297] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl font-bold leading-tight mb-6">
              Welcome to Your Spiritual Home
            </h1>
            <p className="text-xl mb-8">
              Join us in worship and experience the transformative power of community and faith.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                className="bg-[#BAD975] text-[#006297] px-8 py-3 rounded-lg font-semibold 
                  hover:bg-opacity-90 transition-colors flex items-center shadow-lg hover:shadow-xl"
                onClick={onJoinUsClick}
              >
                Join Us Sunday <ArrowRight className="ml-2 w-5 h-5" />
              </button>
              <button 
                className="border-2 border-white px-8 py-3 rounded-lg font-semibold 
                  hover:bg-white hover:text-[#006297] transition-colors shadow-lg hover:shadow-xl"
                onClick={onExploreClick}
              >
                Explore
              </button>
            </div>
          </div>
          <div className="hidden md:block">
            <img 
              src="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=1350&q=80" 
              alt="Church community" 
              className="rounded-lg shadow-xl transform hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent"></div>
    </div>
  );
}