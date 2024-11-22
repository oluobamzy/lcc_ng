import React from 'react';
import { Church, Clock, MapPin, ArrowRight, Calendar, Heart } from 'lucide-react';
//All components use the brand colors (#006297, #BAD975, #FFFFFF) consistently throughout the interface.
export const HomePage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-[#006297] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-2">
              <Church className="w-8 h-8" />
              <span className="text-xl font-bold">Lifestream</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="/" className="hover:text-[#BAD975] transition-colors">Home</a>
              <a href="/about" className="hover:text-[#BAD975] transition-colors">About</a>
              <a href="#" className="hover:text-[#BAD975] transition-colors">Services</a>
              <a href="events" className="hover:text-[#BAD975] transition-colors">Events</a>
              <a href="contact" className="hover:text-[#BAD975] transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative bg-[#006297] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold leading-tight mb-6">Welcome to Your Spiritual Home</h1>
              <p className="text-xl mb-8">Join us in worship and experience the transformative power of community and faith.</p>
              <div className="flex space-x-4">
                <button className="bg-[#BAD975] text-[#006297] px-8 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors flex items-center">
                  Join Us Sunday <ArrowRight className="ml-2 w-5 h-5" />
                </button>
                <button className="border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-[#006297] transition-colors">
                  Watch Online
                </button>
              </div>
            </div>
            <div className="hidden md:block">
              <img 
                src="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                alt="Church community" 
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent"></div>
      </div>

      {/* Rest of the components... */}
    </div>
  );
};