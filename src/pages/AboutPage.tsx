import { useState } from 'react';
import { Church, Users, Heart, Book } from 'lucide-react';
import { LocationMap } from '../components/Map/LocationMap';

export const AboutPage = () => {
  const [showMap, setShowMap] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-[#006297] mb-8">About Us</h1>
        {/* <Home className="w-8 h-8 text-[#006297]" /> */}

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl font-semibold mb-4">Our Mission</h2>
            <p className="text-gray-600 mb-6">
              At Lifestream Christian Center, we are committed to sharing God's love,
              building a strong community of believers, and making a positive impact
              in our world through faith, fellowship, and service.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2 text-[#006297]">
                <Church className="w-5 h-5" />
                <span>Worship</span>
              </div>
              <div className="flex items-center space-x-2 text-[#006297]">
                <Users className="w-5 h-5" />
                <span>Community</span>
              </div>
              <div className="flex items-center space-x-2 text-[#006297]">
                <Heart className="w-5 h-5" />
                <span>Service</span>
              </div>
              <div className="flex items-center space-x-2 text-[#006297]">
                <Book className="w-5 h-5" />
                <span>Learning</span>
              </div>
            </div>
          </div>
          <div>
            <img
              src="https://images.unsplash.com/photo-1544427920-c49ccfb85579?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
              alt="Church community"
              className="rounded-lg shadow-xl"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-[#006297] mb-4">Our Vision</h3>
            <p className="text-gray-600">
              To be a beacon of hope and transformation, reaching people with God's
              love and empowering them to live purposeful lives.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-[#006297] mb-4">Our Values</h3>
            <p className="text-gray-600">
              We value authentic worship, biblical teaching, meaningful relationships,
              and compassionate service to others.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-[#006297] mb-4">Our Community</h3>
            <p className="text-gray-600">
              We are a diverse family of believers united in our love for God and
              commitment to serving our community.
            </p>
          </div>
        </div>

        <div className="bg-[#006297] text-white rounded-lg p-8 text-center">
          <h2 className="text-3xl font-semibold mb-4">Join Us This Sunday</h2>
          <p className="text-xl mb-6">Experience the warmth of our community</p>
          <button
            className="bg-[#BAD975] text-[#006297] px-8 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors"
            onClick={() => setShowMap(true)}
          >
            Plan Your Visit
          </button>
        </div>
      </div>

      <LocationMap isOpen={showMap} onClose={() => setShowMap(false)} />
    </div>
  );
};