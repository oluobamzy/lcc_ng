import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, Search, Loader, Tags, AlertCircle } from 'lucide-react';
import { MediaLibrary } from '../../components/MediaLibrary/MediaLibrary';
import { BulkOperations } from '../../components/MediaLibrary/BulkOperations';
import { useAuth } from '../../contexts/AuthContext';
import { verifyFirebaseStorage } from '../../utils/firebase-utils';

// Animation variants
const fadeInAnimation = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6 }
  }
};

// For multi-selection
interface SelectedMediaItem {
  id: string;
  path: string;
  name: string;
}

export default function AdminMediaEnhanced() {
  const [searchTerm, setSearchTerm] = useState('');
  const [mediaType, setMediaType] = useState<string>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedItems, setSelectedItems] = useState<SelectedMediaItem[]>([]);
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Verify Firebase storage connection on component mount
  useEffect(() => {
    const checkStorage = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const result = await verifyFirebaseStorage();
        if (!result.success) {
          setError(`Storage access error: ${result.error}`);
        } else if (result.warning) {
          console.warn(result.warning);
        }
      } catch (err: any) {
        setError(`Error checking storage: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkStorage();
  }, [user]);
  
  // Toggle tag selection
  const toggleTag = (tagId: string) => {
    setSelectedTags(prev => 
      prev.includes(tagId)
        ? prev.filter(t => t !== tagId)
        : [...prev, tagId]
    );
  };

  // Toggle multi-select mode
  const toggleMultiSelectMode = () => {
    setIsMultiSelectMode(prev => !prev);
    if (isMultiSelectMode) {
      clearSelection();
    }
  };

  // Clear selection
  const clearSelection = useCallback(() => {
    setSelectedItems([]);
    if (selectedItems.length > 0) {
      setIsMultiSelectMode(false);
    }
  }, [selectedItems]);

  // Handle item selection for multi-select operations
  const handleItemSelect = useCallback((item: any) => {
    setSelectedItems(prev => {
      const isSelected = prev.some(i => i.id === item.id);
      
      if (isSelected) {
        return prev.filter(i => i.id !== item.id);
      } else {
        return [...prev, { id: item.id, path: item.path, name: item.name }];
      }
    });
  }, []);

  // Handle bulk delete
  const handleBulkDelete = async (fileIds: string[]) => {
    setIsLoading(true);
    setError(null);
    try {
      // In a real app, you'd call your delete API for each file
      console.log('Deleting files:', fileIds);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Here you would make actual API calls to delete the files
      
      // Clear selection after successful delete
      clearSelection();
    } catch (error) {
      console.error('Error deleting files:', error);
      setError('Failed to delete files. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle bulk tagging
  const handleBulkTag = async (fileIds: string[], tags: string[]) => {
    setIsLoading(true);
    setError(null);
    try {
      // In a real app, you'd call your tagging API for each file
      console.log('Tagging files:', fileIds, 'with tags:', tags);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Here you would make actual API calls to add tags to the files
      
      // Clear selection after successful tagging
      clearSelection();
    } catch (error) {
      console.error('Error tagging files:', error);
      setError('Failed to tag files. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Debounce function to limit search term processing
  function debounce<F extends (...args: any[]) => any>(func: F, wait: number) {
    let timeout: ReturnType<typeof setTimeout> | null = null;
    
    return function(...args: Parameters<F>) {
      if (timeout !== null) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(() => func(...args), wait);
    };
  }

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((term: string) => {
      console.log('Searching for:', term);
    }, 300),
    []
  );
  
  // Watch for search term changes
  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);
  
  // Available tags (in a real app, fetch these from your API)
  const availableTags = [
    { id: 'worship', label: 'Worship', count: 12 },
    { id: 'sermon', label: 'Sermons', count: 8 },
    { id: 'youth', label: 'Youth', count: 5 },
    { id: 'event', label: 'Events', count: 15 },
    { id: 'music', label: 'Music', count: 7 },
    { id: 'outreach', label: 'Outreach', count: 4 },
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <motion.h1 
          className="text-3xl font-bold text-[#006297] mb-2"
          initial="hidden"
          animate="visible"
          variants={fadeInAnimation}
        >
          Media Management
        </motion.h1>
        <motion.p 
          className="text-gray-600"
          initial="hidden"
          animate="visible"
          variants={fadeInAnimation}
          transition={{ delay: 0.1 }}
        >
          Upload, organize, and manage your church media.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <motion.div
          className="lg:col-span-1"
          initial="hidden"
          animate="visible"
          variants={fadeInAnimation}
          transition={{ delay: 0.2 }}
        >
          <div className="bg-white p-6 rounded-lg shadow-sm sticky top-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800 flex items-center">
                <Filter className="w-4 h-4 mr-2 text-[#006297]" />
                Filters
              </h3>
              {(mediaType !== 'all' || selectedTags.length > 0 || searchTerm) && (
                <button 
                  onClick={() => {
                    setMediaType('all');
                    setSelectedTags([]);
                    setSearchTerm('');
                  }}
                  className="text-sm text-[#006297] hover:underline"
                >
                  Clear all
                </button>
              )}
            </div>
            
            <div className="relative mb-6">
              <input
                type="text"
                placeholder="Search media..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006297]"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            
            {/* Media Type Filter */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Media Type</h4>
              <div className="flex flex-wrap gap-2">
                <button 
                  className={`px-3 py-1 rounded-full text-sm ${mediaType === 'all' ? 'bg-[#006297] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  onClick={() => setMediaType('all')}
                >
                  All
                </button>
                <button 
                  className={`px-3 py-1 rounded-full text-sm ${mediaType === 'image' ? 'bg-[#006297] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  onClick={() => setMediaType('image')}
                >
                  Photos
                </button>
                <button 
                  className={`px-3 py-1 rounded-full text-sm ${mediaType === 'video' ? 'bg-[#006297] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  onClick={() => setMediaType('video')}
                >
                  Videos
                </button>
              </div>
            </div>
            
            {/* Tags Filter */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Tags className="w-4 h-4 mr-2 text-[#006297]" />
                Categories
              </h4>
              <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
                {availableTags.map(tag => (
                  <label 
                    key={tag.id} 
                    className="flex items-center cursor-pointer hover:bg-gray-50 p-1 rounded"
                  >
                    <input 
                      type="checkbox" 
                      className="form-checkbox h-4 w-4 text-[#006297] rounded"
                      checked={selectedTags.includes(tag.id)}
                      onChange={() => toggleTag(tag.id)}
                    />
                    <span className="ml-2 text-gray-700 text-sm">{tag.label}</span>
                    <span className="ml-auto text-xs text-gray-400">{tag.count}</span>
                  </label>
                ))}
              </div>
            </div>
            
            {/* Bulk Operations Toggle */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Actions</h4>
              <button
                onClick={toggleMultiSelectMode}
                className={`px-4 py-2 w-full flex items-center justify-center rounded-md ${
                  isMultiSelectMode 
                    ? 'bg-[#006297] text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span>{isMultiSelectMode ? 'Cancel Selection' : 'Bulk Select'}</span>
              </button>
            </div>
          </div>
        </motion.div>
        
        {/* Media Content */}
        <motion.div
          className="lg:col-span-3"
          initial="hidden"
          animate="visible"
          variants={fadeInAnimation}
          transition={{ delay: 0.3 }}
        >
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader className="animate-spin text-[#006297] w-8 h-8" />
              <p className="mt-4 text-gray-600">Processing...</p>
            </div>
          ) : error ? (
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="p-4 bg-red-50 text-red-600 rounded-lg flex items-start">
                <AlertCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Error accessing media</p>
                  <p>{error}</p>
                  <p className="mt-2 text-sm">Please check your Firebase configuration and make sure you have proper permissions.</p>
                </div>
              </div>
            </div>
          ) : (
            <MediaLibrary 
              editable={true} 
              selectable={isMultiSelectMode} 
              onSelect={handleItemSelect}
              className="bg-white p-6 rounded-lg shadow-sm"
            />
          )}
        </motion.div>
      </div>
      
      {/* Bulk Operations Panel */}
      <AnimatePresence>
        {selectedItems.length > 0 && (
          <BulkOperations
            selectedFiles={selectedItems}
            onClearSelection={clearSelection}
            onDeleteSelected={handleBulkDelete}
            onTagSelected={handleBulkTag}
          />
        )}
      </AnimatePresence>

      {/* Error Notification (for demonstration, replace with your notification system) */}
      {error && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className="flex items-center bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-md">
            <AlertCircle className="w-5 h-5 mr-3" />
            <div className="text-sm">
              <p className="font-medium">Error</p>
              <p>{error}</p>
            </div>
            <button 
              onClick={() => setError(null)} 
              className="ml-auto text-red-500 hover:text-red-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
