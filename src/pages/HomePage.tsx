import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Hero } from '../components/Hero/Hero';
import { Gallery } from '../components/Gallery/Gallery';
import { CallToAction } from '../components/CallToAction';
import { MediaItem } from '../components/Gallery/types';

const sampleMedia: MediaItem[] = [
  {
    id: '1',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800',
    title: 'Music Festival',
    description: 'Live performance at sunset'
  },
  {
    id: '2',
    type: 'video',
    url: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=800',
    title: 'Nature Documentary',
    description: 'Beautiful scenes from nature'
  },
  {
    id: '3',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800',
    title: 'Concert Lights',
    description: 'Amazing light show during the concert'
  }
];

export function HomePage() {
  const navigate = useNavigate();

  const handleJoinUsClick = () => navigate('/events');
  const handleExploreClick = () => navigate('/about');

  return (
    <div className="min-h-screen bg-white">
      <Hero 
        onJoinUsClick={handleJoinUsClick}
        onExploreClick={handleExploreClick}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-4xl font-bold text-center mb-12 text-[#006297]">
          Latest Media
        </h2>
        <Gallery items={sampleMedia} columns={3} />
        
        <div className="mt-16">
          <CallToAction
            title="Join Us This Sunday"
            description="Experience the warmth of our community"
            buttonText="Plan Your Visit"
            onButtonClick={handleJoinUsClick}
          />
        </div>
      </div>
    </div>
  );
}