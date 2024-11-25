import React, { useState } from 'react';
import { Play, X } from 'lucide-react';
import { MediaItem } from './types';

interface MediaCardProps {
  item: MediaItem;
  onOpen: (item: MediaItem) => void;
}

export function MediaCard({ item, onOpen }: MediaCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="relative aspect-square overflow-hidden rounded-lg cursor-pointer group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onOpen(item)}
    >
      {item.type === 'image' ? (
        <img 
          src={item.url} 
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
      ) : (
        <div className="relative w-full h-full">
          <img 
            src={item.thumbnail || item.url} 
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Play className="w-12 h-12 text-white opacity-80" />
          </div>
        </div>
      )}
      
      {isHovered && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-end transition-opacity duration-300">
          <div className="p-4 text-white w-full">
            <h3 className="text-lg font-semibold truncate">{item.title}</h3>
            {item.description && (
              <p className="text-sm opacity-90 line-clamp-2">{item.description}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}