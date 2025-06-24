import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Info, Trash2, Edit, Check } from 'lucide-react';
import { MediaItem } from './types';

// Helper function to extract YouTube video ID
function getYouTubeVideoId(url: string) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

// Helper function to check if URL is from YouTube
function isYouTubeUrl(url: string) {
  return url.includes('youtube.com') || url.includes('youtu.be');
}

interface ModalProps {
  item: MediaItem | null;
  onClose: () => void;
  editable?: boolean;
  onDelete?: () => void;
}

export function Modal({ item, onClose, editable = false, onDelete }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [editedTags, setEditedTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  // Initialize edit form when editing starts
  useEffect(() => {
    if (item && isEditing) {
      setEditedTitle(item.title || '');
      setEditedDescription(item.description || '');
      setEditedTags(item.tags || []);
    }
  }, [isEditing, item]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isEditing) {
          setIsEditing(false);
        } else {
          onClose();
        }
      }
    };

    // Handle clicks outside the modal content
    const handleOutsideClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        if (isEditing) {
          // Don't close when editing, just stop editing
          setIsEditing(false);
        } else {
          onClose();
        }
      }
    };

    // Lock body scroll when modal is open
    if (item) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [item, onClose, isEditing]);

  // Handle form submission for edits
  const handleSaveChanges = () => {
    // In a real implementation, we'd save these changes to the database
    console.log('Saving changes:', { editedTitle, editedDescription, editedTags });
    
    // Reset editing state
    setIsEditing(false);
  };

  // Add a new tag
  const handleAddTag = () => {
    if (newTag.trim() !== '' && !editedTags.includes(newTag.trim().toLowerCase())) {
      setEditedTags([...editedTags, newTag.trim().toLowerCase()]);
      setNewTag('');
    }
  };

  // Remove a tag
  const handleRemoveTag = (tagToRemove: string) => {
    setEditedTags(editedTags.filter(tag => tag !== tagToRemove));
  };

  // Handle key press in the tag input
  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <AnimatePresence>
      {item && (
        <motion.div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            ref={modalRef}
            className="relative max-w-7xl max-h-[90vh] w-full bg-gray-900 rounded-lg overflow-hidden flex flex-col"
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <div className="absolute top-4 right-4 z-10 flex space-x-2">
              <button
                onClick={() => setShowInfo(!showInfo)}
                className="bg-gray-800 bg-opacity-70 rounded-full p-2 text-white hover:bg-opacity-100 transition-colors"
                aria-label="Toggle information"
                title="Toggle information"
              >
                <Info className="w-5 h-5" />
              </button>
              
              {editable && !isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-gray-800 bg-opacity-70 rounded-full p-2 text-white hover:bg-opacity-100 hover:text-blue-400 transition-colors"
                  aria-label="Edit media"
                  title="Edit"
                >
                  <Edit className="w-5 h-5" />
                </button>
              )}
              
              {editable && isEditing && (
                <button
                  onClick={handleSaveChanges}
                  className="bg-green-600 bg-opacity-70 rounded-full p-2 text-white hover:bg-opacity-100 transition-colors"
                  aria-label="Save changes"
                  title="Save changes"
                >
                  <Check className="w-5 h-5" />
                </button>
              )}
              
              <a 
                href={item.url}
                download
                className="bg-gray-800 bg-opacity-70 rounded-full p-2 text-white hover:bg-opacity-100 transition-colors"
                aria-label="Download media"
                title="Download media"
              >
                <Download className="w-5 h-5" />
              </a>
              
              {editable && onDelete && !isEditing && (
                <button
                  onClick={onDelete}
                  className="bg-gray-800 bg-opacity-70 rounded-full p-2 text-white hover:bg-opacity-100 hover:text-red-500 transition-colors"
                  aria-label="Delete media"
                  title="Delete"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
              
              <button
                onClick={() => {
                  if (isEditing) {
                    setIsEditing(false);
                  } else {
                    onClose();
                  }
                }}
                className="bg-gray-800 bg-opacity-70 rounded-full p-2 text-white hover:bg-opacity-100 hover:text-red-400 transition-colors"
                aria-label="Close modal"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-auto flex items-center justify-center">
              {item.type === 'image' ? (
                <img
                  src={item.url}
                  alt={item.title}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).onerror = null;
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x600?text=Image+Not+Available';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  {isYouTubeUrl(item.url) ? (
                    <div className="relative w-full h-0 pb-[56.25%]">
                      <iframe
                        className="absolute top-0 left-0 w-full h-full"
                        src={`https://www.youtube.com/embed/${getYouTubeVideoId(item.url)}?autoplay=1`}
                        title={item.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  ) : (
                    <video
                      src={item.url}
                      controls
                      autoPlay
                      playsInline
                      className="w-full h-auto max-h-[85vh]"
                      onError={(e) => {
                        const errorEl = document.createElement('div');
                        errorEl.className = 'flex flex-col items-center justify-center p-8 text-white';
                        errorEl.innerHTML = `
                          <svg class="w-16 h-16 text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <p class="text-xl font-semibold">Video playback error</p>
                          <p class="mt-2 text-gray-300">The video cannot be played.</p>
                        `;
                        (e.target as HTMLVideoElement).parentNode?.appendChild(errorEl);
                        (e.target as HTMLVideoElement).style.display = 'none';
                      }}
                    >
                      Your browser does not support the video tag.
                    </video>
                  )}
                </div>
              )}
            </div>
            
            <AnimatePresence>
              {showInfo && (
                <motion.div 
                  className="bg-gray-900 p-4 border-t border-gray-800"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                >
                  {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-400 mb-1">
                          Title
                        </label>
                        <input
                          type="text"
                          id="title"
                          value={editedTitle}
                          onChange={(e) => setEditedTitle(e.target.value)}
                          className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-400 mb-1">
                          Description
                        </label>
                        <textarea
                          id="description"
                          value={editedDescription}
                          onChange={(e) => setEditedDescription(e.target.value)}
                          rows={3}
                          className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          Tags
                        </label>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {editedTags.map(tag => (
                            <span 
                              key={tag}
                              className="inline-flex items-center bg-gray-800 text-gray-300 px-2 py-1 rounded-md text-sm"
                            >
                              {tag}
                              <button
                                onClick={() => handleRemoveTag(tag)}
                                className="ml-1 text-gray-400 hover:text-red-400"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                        <div className="flex">
                          <input
                            type="text"
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            onKeyPress={handleTagKeyPress}
                            placeholder="Add a tag..."
                            className="flex-1 bg-gray-800 border border-gray-700 rounded-l-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <button
                            onClick={handleAddTag}
                            className="bg-blue-600 text-white px-3 rounded-r-md hover:bg-blue-700"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex justify-end space-x-3 pt-2">
                        <button
                          onClick={() => setIsEditing(false)}
                          className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSaveChanges}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h2 className="text-xl font-semibold text-white">{item.title}</h2>
                      {item.description && (
                        <p className="mt-2 text-gray-300">{item.description}</p>
                      )}
                      
                      {/* Display tags if available */}
                      {item.tags && item.tags.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {item.tags.map(tag => (
                            <span 
                              key={tag}
                              className="inline-flex items-center bg-gray-800 text-gray-300 px-2 py-1 rounded-md text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      {/* Display upload date if available */}
                      {item.uploadedAt && (
                        <p className="mt-3 text-xs text-gray-500">
                          Uploaded: {typeof item.uploadedAt === 'string' 
                            ? new Date(item.uploadedAt).toLocaleDateString() 
                            : item.uploadedAt.toLocaleDateString()}
                        </p>
                      )}
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}