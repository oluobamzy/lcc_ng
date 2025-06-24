import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Loader } from 'lucide-react';
import { MediaItem } from './types';

// Helper function to check if URL is from YouTube
function isYouTubeUrl(url: string) {
  return url.includes('youtube.com') || url.includes('youtu.be');
}

// Helper function to extract YouTube video ID
function getYouTubeVideoId(url: string) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

interface MediaCardProps {
  item: MediaItem;
  onOpen: (item: MediaItem) => void;
  small?: boolean; // Added prop to control card size
}

export function MediaCard({ item, onOpen, small = false }: MediaCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Handle touch interactions - show overlay on touch
  const handleTouchStart = () => {
    setIsHovered(true);
  };

  const handleClick = (e: React.MouseEvent | React.TouchEvent) => {
    // Prevent immediate opening on touch start
    if (e.type === 'touchstart') return;
    onOpen(item);
  };

  // Handle image loading
  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  // Handle image error
  const handleImageError = () => {
    setIsError(true);
    setIsLoaded(true); // Consider it "loaded" even if error, to hide loader
  };

  // Define size classes based on small prop
  const sizeClass = small 
    ? "relative aspect-video h-32 overflow-hidden rounded-lg cursor-pointer group" 
    : "relative aspect-square overflow-hidden rounded-lg cursor-pointer group";

  return (
    <motion.div 
      className={sizeClass}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={(e) => e.preventDefault()}
      onClick={handleClick}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      ref={cardRef}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      aria-label={`View ${item.title}`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onOpen(item);
        }
      }}
    >
      {/* Loading state */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <Loader className="w-8 h-8 text-gray-400 animate-spin" />
        </div>
      )}
      
      {/* Error state */}
      {isError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 p-2">
          <svg className="w-10 h-10 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-xs text-gray-500 text-center">Failed to load media</p>
        </div>
      )}
      
      {/* Media content */}
      <div className={`w-full h-full transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        {item.type === 'image' ? (
          <div className="w-full h-full overflow-hidden">
            <img 
              src={item.url} 
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              loading="lazy"
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          </div>
        ) : isYouTubeUrl(item.url) ? ( // YouTube video detection
          <div className="relative w-full h-full overflow-hidden">
            <img 
              src={`https://img.youtube.com/vi/${getYouTubeVideoId(item.url)}/hqdefault.jpg`} 
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              loading="lazy"
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={`bg-red-600 rounded-full ${small ? 'p-2' : 'p-3'}`}>
                <Play className={`${small ? 'w-5 h-5' : 'w-8 h-8'} text-white`} />
              </div>
            </div>
            <div className={`absolute ${small ? 'top-1 right-1' : 'top-2 right-2'} bg-red-600 text-white ${small ? 'text-[0.6rem]' : 'text-xs'} py-0.5 px-2 rounded`}>
              YouTube
            </div>
          </div>
        ) : (
          <div className="relative w-full h-full overflow-hidden">
            <img 
              src={item.thumbnail || item.url} 
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              loading="lazy"
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={`bg-black bg-opacity-50 rounded-full ${small ? 'p-2' : 'p-3'}`}>
                <Play className={`${small ? 'w-5 h-5' : 'w-8 h-8'} text-white`} />
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Info overlay */}
      <motion.div 
        className="absolute inset-0 bg-black bg-opacity-60 flex items-end transition-opacity"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <div className={`${small ? 'p-2' : 'p-4'} text-white w-full`}>
          <h3 className={`${small ? 'text-sm' : 'text-lg'} font-semibold truncate`}>{item.title}</h3>
          {item.description && !small && (
            <p className="text-sm opacity-90 line-clamp-2 mt-1">{item.description}</p>
          )}
          {item.tags && item.tags.length > 0 && !small && (
            <div className="mt-2 flex flex-wrap gap-1">
              {item.tags.slice(0, 2).map(tag => (
                <span 
                  key={tag} 
                  className="inline-flex text-xs bg-white bg-opacity-20 px-2 py-0.5 rounded"
                >
                  {tag}
                </span>
              ))}
              {item.tags.length > 2 && (
                <span className="inline-flex text-xs bg-white bg-opacity-20 px-2 py-0.5 rounded">
                  +{item.tags.length - 2}
                </span>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}