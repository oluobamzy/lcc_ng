import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { MediaItem } from './types';

interface ModalProps {
  item: MediaItem | null;
  onClose: () => void;
}

export function Modal({ item, onClose }: ModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300"
      >
        <X className="w-8 h-8" />
      </button>
      
      <div className="max-w-7xl max-h-[90vh] w-full mx-4">
        {item.type === 'image' ? (
          <img
            src={item.url}
            alt={item.title}
            className="w-full h-auto max-h-[85vh] object-contain"
          />
        ) : (
          <video
            src={item.url}
            controls
            autoPlay
            className="w-full h-auto max-h-[85vh]"
          >
            Your browser does not support the video tag.
          </video>
        )}
        
        <div className="mt-4 text-white">
          <h2 className="text-xl font-semibold">{item.title}</h2>
          {item.description && (
            <p className="mt-2 text-gray-300">{item.description}</p>
          )}
        </div>
      </div>
    </div>
  );
}