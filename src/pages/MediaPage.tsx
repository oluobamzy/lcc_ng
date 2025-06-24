import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { MediaItem, MediaType } from '../components/Gallery/types';
import { Gallery } from '../components/Gallery/Gallery';
import { Search, Filter, Loader, Tags, X } from 'lucide-react';
import { ref as storageRef, listAll, getDownloadURL, getMetadata } from 'firebase/storage';
import { storage } from '../lib/firebase';

// Animation variants
const fadeInAnimation = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6 }
  }
};

// Enhanced sample media data with tags
const sampleMedia: MediaItem[] = [
  {
    id: 'youtube-1',
    type: 'video',
    url: 'https://www.youtube.com/watch?v=QKrwiHg4A2o',
    thumbnail: 'https://img.youtube.com/vi/QKrwiHg4A2o/maxresdefault.jpg',
    title: 'Echoes of Faith',
    description: 'A spiritual journey through music and word',
    tags: ['worship', 'music', 'sermon']
  },
  {
    id: '1',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800',
    title: 'Sunday Service',
    description: 'Worship together as a community',
    tags: ['worship', 'service', 'sunday']
  },
  {
    id: '2',
    type: 'video',
    url: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=800',
    title: 'Latest Sermon',
    description: 'Finding Peace in Troubled Times',
    tags: ['sermon', 'teaching']
  },
  {
    id: '3',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800',
    title: 'Youth Conference',
    description: 'Building the next generation of leaders',
    tags: ['youth', 'conference', 'event']
  },
  {
    id: '4',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1508252592163-5d3c3c559387?auto=format&fit=crop&q=80&w=800',
    title: 'Community Outreach',
    description: 'Serving our local community',
    tags: ['outreach', 'community', 'service']
  },
  {
    id: '5',
    type: 'video',
    url: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1515089836238-772a92501177?auto=format&fit=crop&q=80&w=800',
    title: 'Bible Study Series',
    description: 'Exploring the Gospel of John',
    tags: ['bible study', 'teaching']
  },
  {
    id: '6',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1445633629932-0029acc44e88?auto=format&fit=crop&q=80&w=800',
    title: 'Worship Night',
    description: 'An evening of praise and worship',
    tags: ['worship', 'music', 'prayer']
  }
];

// This is now handled dynamically by availableTags

export function MediaPage() {
  // Use a regular ref for the div element
  const contentRef = useRef<HTMLDivElement | null>(null);
  // Use the intersection observer hook
  const { ref: inViewRef, inView } = useInView({ 
    threshold: 0.1, 
    triggerOnce: true 
  });
  
  // Connect the refs - we'll use a callback ref approach
  const setRefs = (node: HTMLDivElement | null) => {
    // Update the regular ref
    contentRef.current = node;
    
    // Update the inView ref if it's a function
    if (typeof inViewRef === 'function') {
      inViewRef(node);
    }
    // If it's a MutableRefObject, update its current property
    else if (inViewRef && 'current' in inViewRef) {
      inViewRef.current = node;
    }
  };
  
  const [media, setMedia] = useState<MediaItem[]>([...sampleMedia]);
  const [searchTerm, setSearchTerm] = useState('');
  const [mediaType, setMediaType] = useState<'all' | MediaType>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((term: string) => {
      // Filter logic will be applied in the filteredMedia computed value
      console.log('Searching for:', term);
    }, 300),
    []
  );
  
  // Watch for search term changes
  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);

  // Fetch media from Firebase
  const fetchFirebaseMedia = async () => {
    try {
      setIsLoading(true);
      setLoadingProgress(0);
      const mediaRef = storageRef(storage, 'media');
      const result = await listAll(mediaRef);
      
      const totalItems = result.items.length;
      console.log(`Found ${totalItems} items in Firebase storage.`);
      let loadedItems = 0;
      
      const filePromises = result.items.map(async (item) => {
        // Get file metadata for tags and other info
        let fileMetadata;
        try {
          fileMetadata = await getMetadata(item);
        } catch (err) {
          console.warn(`Could not get metadata for ${item.name}:`, err);
        }
        
        // Extract custom metadata or use empty object
        const customMetadata = fileMetadata?.customMetadata || {};
        
        // Get tags from metadata or default to empty array
        let tags: string[] = [];
        if (customMetadata.tags) {
          try {
            tags = JSON.parse(customMetadata.tags);
          } catch (e) {
            // If tags can't be parsed, try to split by comma
            tags = customMetadata.tags.split(',').map(tag => tag.trim());
          }
        }

        const url = await getDownloadURL(item);
        loadedItems++;
        setLoadingProgress(Math.round((loadedItems / result.items.length) * 100));
        
        let fileType: MediaType = 'image'; // Default to image
        let thumbnail = url;
        
        // Try to determine file type from name or contentType
        if (fileMetadata?.contentType?.startsWith('video/') || 
            item.name.toLowerCase().match(/\.(mp4|mov|avi|wmv)$/)) {
          fileType = 'video';
        }
        
        // For videos, we would ideally generate a thumbnail
        if (fileType === 'video') {
          // Using a placeholder thumbnail for now
          thumbnail = customMetadata.thumbnail || 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=800';
        }
        
        // Create a title from the filename if not in metadata
        const title = customMetadata.title || 
          item.name.split('.')[0].replace(/-|_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        
        return {
          id: item.name,
          type: fileType,
          url,
          thumbnail: fileType === 'video' ? thumbnail : url,
          title,
          description: customMetadata.description || ``,
          tags: tags,
          uploadedAt: fileMetadata?.timeCreated ? new Date(fileMetadata.timeCreated) : new Date(),
          size: fileMetadata?.size || 0
        };
      });

      let firebaseMedia = await Promise.all(filePromises);
      
      // Sort by uploaded date (newest first)
      firebaseMedia = firebaseMedia.sort((a, b) => {
        const dateA = a.uploadedAt instanceof Date ? a.uploadedAt : new Date(a.uploadedAt || 0);
        const dateB = b.uploadedAt instanceof Date ? b.uploadedAt : new Date(b.uploadedAt || 0);
        return dateB.getTime() - dateA.getTime();
      });
      
      // Combine sample media with Firebase media for demo purposes
      // In production, you'd likely only use Firebase media
      // Ensure YouTube videos appear at the top by sorting after combining
      const combinedMedia = [...sampleMedia, ...firebaseMedia];
      const sortedMedia = combinedMedia.sort((a, b) => {
        // First sort by placing YouTube videos at the top
        const isAYoutube = a.url?.includes('youtube.com') || a.url?.includes('youtu.be');
        const isBYoutube = b.url?.includes('youtube.com') || b.url?.includes('youtu.be');
        
        if (isAYoutube && !isBYoutube) return -1;
        if (!isAYoutube && isBYoutube) return 1;
        
        // Then by date if both are same type
        const dateA = a.uploadedAt instanceof Date ? a.uploadedAt : new Date(a.uploadedAt || 0);
        const dateB = b.uploadedAt instanceof Date ? b.uploadedAt : new Date(b.uploadedAt || 0);
        return dateB.getTime() - dateA.getTime();
      });
      
      setMedia(sortedMedia);
    } catch (error) {
      console.error('Error fetching Firebase media:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchFirebaseMedia();
  }, []);

  // Toggle tag selection
  const toggleTag = (tagId: string) => {
    setSelectedTags(prev => 
      prev.includes(tagId)
        ? prev.filter(t => t !== tagId)
        : [...prev, tagId]
    );
  };
  
  // Calculate available tags and counts from current media
  const availableTags = useMemo(() => {
    const tagCounts: Record<string, number> = {};
    
    media.forEach(item => {
      if (item.tags) {
        item.tags.forEach(tag => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      }
    });
    
    return Object.entries(tagCounts)
      .map(([id, count]) => ({ 
        id, 
        label: id.charAt(0).toUpperCase() + id.slice(1), 
        count 
      }))
      .sort((a, b) => b.count - a.count);
  }, [media]);
  
  // Filter media by search term, category, and tags
  const filteredMedia = useMemo(() => {
    return media.filter((item) => {
      // Filter by search term
      const matchesSearch = searchTerm === '' || 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // Filter by media type
      const matchesType = mediaType === 'all' || item.type === mediaType;
      
      // Filter by selected tags
      const matchesTags = selectedTags.length === 0 || 
        (item.tags && selectedTags.some(tag => item.tags?.includes(tag)));
      
      return matchesSearch && matchesType && matchesTags;
    });
  }, [media, searchTerm, mediaType, selectedTags]);

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

  /* Removed unused formatDate function */
  
  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setMediaType('all');
    setSelectedTags([]);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div 
        className="flex flex-col md:flex-row justify-between items-center mb-12"
        ref={setRefs}
      >
        <motion.div 
          className="mb-6 md:mb-0"
          variants={fadeInAnimation}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <h1 className="text-4xl font-bold text-[#006297]">Media Library</h1>
          <p className="text-gray-600 mt-2">Explore messages, photos, and videos from our church</p>
        </motion.div>
        
        {/* Search */}
        <motion.div
          className="w-full md:w-auto"
          variants={fadeInAnimation}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          transition={{ delay: 0.1 }}
        >
          <div className="relative">
            <input
              type="text"
              placeholder="Search media..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-80 pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006297]"
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
        </motion.div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <motion.div
          className="lg:col-span-1"
          variants={fadeInAnimation}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
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
                  onClick={clearFilters}
                  className="text-sm text-[#006297] hover:underline"
                >
                  Clear all
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
          </div>
        </motion.div>
        
        {/* Gallery Content */}
        <div className="lg:col-span-3">
          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader className="animate-spin text-[#006297] w-8 h-8" />
              <div className="mt-4 w-48">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#006297]" 
                    style={{ width: `${loadingProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-center text-gray-600 mt-2">
                  Loading media... {loadingProgress}%
                </p>
              </div>
            </div>
          )}
          
          {/* Results Count */}
          {!isLoading && (
            <div className="mb-6">
              <p className="text-sm text-gray-600">
                {filteredMedia.length > 0 
                  ? `Showing ${filteredMedia.length} results ${searchTerm ? `for "${searchTerm}"` : ''}` 
                  : 'No media found matching your criteria'}
              </p>
            </div>
          )}
          
          {/* Gallery Section */}
          {!isLoading && (
            <motion.div
              variants={fadeInAnimation}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              transition={{ delay: 0.3 }}
            >
              {filteredMedia.length > 0 ? (
                <Gallery items={filteredMedia} columns={2} />
              ) : (
                <div className="text-center py-16 bg-white rounded-lg shadow-sm">
                  <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">No media found</h3>
                  <p className="text-gray-600 mb-6">
                    Try adjusting your search or filter criteria
                  </p>
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 bg-[#006297] text-white rounded-lg hover:bg-opacity-90 transition-colors"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
