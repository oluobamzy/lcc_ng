import React, { useState } from 'react';
import { MediaCard } from './MediaCard';
import { Modal } from './Modal';
import { MediaItem } from './types';

interface GalleryProps {
  items: MediaItem[];
  columns?: 2 | 3 | 4;
}

export function Gallery({ items, columns = 3 }: GalleryProps) {
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);

  return (
    <>
      <div className={`grid gap-4 grid-cols-1 sm:grid-cols-2 ${
        columns === 3 ? 'lg:grid-cols-3' : 
        columns === 4 ? 'lg:grid-cols-4' : ''
      }`}>
        {items.map((item) => (
          <MediaCard
            key={item.id}
            item={item}
            onOpen={setSelectedItem}
          />
        ))}
      </div>
      
      <Modal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </>
  );
}