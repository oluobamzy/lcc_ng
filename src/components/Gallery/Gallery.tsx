import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MediaCard } from './MediaCard';
import { MediaItem } from './types';
import { Modal } from './Modal';

interface GalleryProps {
  items: MediaItem[];
  columns?: number;
  className?: string;
  editable?: boolean;
  onDelete?: (id: string) => void;
  smallCards?: boolean; // Added prop to control card size
}

export function Gallery({ 
  items, 
  columns = 3,
  className = '', 
  editable = false,
  onDelete,
  smallCards = false
}: GalleryProps) {
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Staggered animation for gallery items
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  // Group items into columns for masonry-like layout
  const getColumns = () => {
    const cols = Array(columns).fill([]).map(() => [] as MediaItem[]);
    
    items.forEach((item, i) => {
      cols[i % columns].push(item);
    });
    
    return cols;
  };

  const openModal = (item: MediaItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleDeleteItem = (id: string) => {
    if (onDelete) {
      onDelete(id);
    }
    setIsModalOpen(false);
  };

  return (
    <div className={`w-full ${className}`}>
      {items.length > 0 ? (
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
          style={{ gridTemplateColumns: `repeat(${columns > 3 ? 3 : columns}, 1fr)` }}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {getColumns().map((column, colIndex) => (
            <div key={colIndex} className="flex flex-col gap-4">
              {column.map((item, itemIndex) => (
                <motion.div 
                  key={`${item.id}-${itemIndex}`}
                  variants={itemVariants}
                  layout
                >
                  <MediaCard 
                    item={item} 
                    onOpen={openModal}
                    small={smallCards}
                  />
                </motion.div>
              ))}
            </div>
          ))}
        </motion.div>
      ) : (
        <div className="py-10 text-center text-gray-500">No media items to display.</div>
      )}

      {/* Image/Media Modal */}
      <AnimatePresence>
        {isModalOpen && selectedItem && (
          <Modal 
            item={selectedItem}
            onClose={closeModal}
            editable={editable}
            onDelete={editable && onDelete ? () => handleDeleteItem(selectedItem.id) : undefined}
          />
        )}
      </AnimatePresence>
    </div>
  );
}