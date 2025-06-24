import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Calendar, Clock, ExternalLink, Info, Loader2, Play } from 'lucide-react';

// Types for streams
interface Stream {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  dateTime: string;
  status: 'upcoming' | 'live' | 'past';
  youtubeId: string;
  duration?: string;
  views?: number;
}

// Sample data - in a real app, this would come from Firebase
const sampleStreams: Stream[] = [
  {
    id: '1',
    title: 'Sunday Morning Service',
    description: 'Join us for our weekly worship service with Pastor James preaching on "Finding Peace in Troubled Times".',
    thumbnailUrl: 'https://images.unsplash.com/photo-1528605105345-5344ea20e269?auto=format&fit=crop&w=1350&q=80',
    dateTime: 'May 14, 2023 10:00 AM',
    status: 'live',
    youtubeId: 'jfKfPfyJRdk', // Lofi hip hop radio - beats to relax/study to as a placeholder
    views: 1243
  },
  {
    id: '2',
    title: 'Special Prayer Night',
    description: 'A night of prayer and intercession for our community and world.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1455849318743-b2233052fcff?auto=format&fit=crop&w=1350&q=80',
    dateTime: 'May 16, 2023 7:00 PM',
    status: 'upcoming',
    youtubeId: ''
  },
  {
    id: '3',
    title: 'Youth Conference 2023',
    description: 'Annual youth conference focused on empowering the next generation of leaders.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1350&q=80',
    dateTime: 'May 20-22, 2023',
    status: 'upcoming',
    youtubeId: ''
  },
  {
    id: '4',
    title: 'Easter Sunday Service',
    description: 'Celebrate the resurrection with our special Easter service.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1601274359162-12afc4a1ee4d?auto=format&fit=crop&w=1350&q=80',
    dateTime: 'April 17, 2023 10:00 AM',
    status: 'past',
    youtubeId: 'dQw4w9WgXcQ', // Easter sermon placeholder
    duration: '1:24:36',
    views: 3621
  },
  {
    id: '5',
    title: 'Good Friday Service',
    description: 'A solemn reflection on the sacrifice of Jesus Christ.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1461452380005-a85a6992a3e9?auto=format&fit=crop&w=1350&q=80',
    dateTime: 'April 15, 2023 7:00 PM',
    status: 'past',
    youtubeId: 'dQw4w9WgXcQ', // Good Friday service placeholder
    duration: '1:12:15',
    views: 2845
  }
];

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6 }
  }
};

// Stagger children animation variants
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export function LiveStreamPageEnhanced() {
  const [selectedStream, setSelectedStream] = useState<Stream | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'live' | 'upcoming' | 'past'>('live');

  // Function to filter streams by status
  const getStreamsByStatus = (status: 'live' | 'upcoming' | 'past'): Stream[] => {
    return sampleStreams.filter(stream => stream.status === status);
  };

  // Get current live stream if available
  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      const liveStreams = getStreamsByStatus('live');
      if (liveStreams.length > 0) {
        setSelectedStream(liveStreams[0]);
      }
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Format views with commas
  const formatViews = (views: number): string => {
    return views.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Section component that animates when scrolled into view
  const AnimatedSection: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => {
    // Use a ref with proper TypeScript support for framer-motion
    const [sectionRef, inView] = useInView({
      threshold: 0.3,
      triggerOnce: true
    });

    return (
      <motion.div
        ref={sectionRef as any}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={{
          hidden: { opacity: 0, y: 30 },
          visible: { 
            opacity: 1, 
            y: 0,
            transition: { 
              duration: 0.8, 
              ease: "easeOut",
              delay 
            } 
          }
        }}
      >
        {children}
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <motion.div 
          className="text-center mb-12"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1 }
          }}
        >
          <motion.h1 
            className="text-4xl md:text-5xl font-bold text-[#006297] mb-4"
            variants={{
              hidden: { opacity: 0, y: -20 },
              visible: { 
                opacity: 1,
                y: 0,
                transition: { duration: 0.6 }
              }
            }}
          >
            Live Stream
          </motion.h1>
          <motion.div
            className="w-24 h-1 bg-[#BAD975] mx-auto mb-6"
            variants={{
              hidden: { width: 0 },
              visible: { 
                width: 96,
                transition: { duration: 0.8, delay: 0.2 }
              }
            }}
          ></motion.div>
          <motion.p 
            className="text-xl text-gray-600 max-w-3xl mx-auto"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { 
                opacity: 1, 
                y: 0,
                transition: { duration: 0.6, delay: 0.3 }
              }
            }}
          >
            Join us live or watch our past services and events from anywhere in the world.
          </motion.p>
        </motion.div>

        {/* Main Content Area */}
        <div className="grid md:grid-cols-3 gap-10">
          {/* Current Stream Column (2/3 width) */}
          <div className="md:col-span-2">
            <motion.div
              className="bg-white rounded-xl shadow-lg overflow-hidden"
              variants={fadeIn}
              initial="hidden"
              animate="visible"
            >
              {isLoading ? (
                <div className="aspect-w-16 aspect-h-9 bg-gray-200 flex items-center justify-center">
                  <Loader2 className="w-12 h-12 text-[#006297] animate-spin" />
                </div>
              ) : selectedStream ? (
                <div>
                  {/* Video Player */}
                  <div className="aspect-w-16 aspect-h-9">
                    <iframe
                      src={`https://www.youtube.com/embed/${selectedStream.youtubeId}?autoplay=1&rel=0`}
                      title={selectedStream.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    ></iframe>
                  </div>
                  
                  {/* Video Details */}
                  <div className="p-6">
                    <h2 className="text-2xl font-bold text-[#006297] mb-2">{selectedStream.title}</h2>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>{selectedStream.dateTime}</span>
                      </div>
                      
                      {selectedStream.views && (
                        <div className="flex items-center">
                          <Play className="w-4 h-4 mr-1" />
                          <span>{formatViews(selectedStream.views)} views</span>
                        </div>
                      )}
                      
                      {selectedStream.status === 'live' && (
                        <div className="flex items-center">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse mr-1.5"></span>
                            Live Now
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <p className="text-gray-600 mb-6">{selectedStream.description}</p>
                    
                    <a 
                      href={`https://www.youtube.com/watch?v=${selectedStream.youtubeId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-[#006297] hover:text-[#BAD975] transition-colors"
                    >
                      <span>Watch on YouTube</span>
                      <ExternalLink className="w-4 h-4 ml-1" />
                    </a>
                  </div>
                </div>
              ) : (
                <div className="aspect-w-16 aspect-h-9 bg-gray-100 flex flex-col items-center justify-center p-8 text-center">
                  <Info className="w-12 h-12 text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-500 mb-2">No Live Stream Available</h3>
                  <p className="text-gray-400 mb-4">Check our upcoming streams to see when we'll be live next.</p>
                  <motion.button
                    className="bg-[#006297] text-white px-5 py-2.5 rounded-lg font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTab('upcoming')}
                  >
                    View Upcoming
                  </motion.button>
                </div>
              )}
            </motion.div>
          </div>

          {/* Streams List Column (1/3 width) */}
          <div className="md:col-span-1">
            <motion.div
              className="bg-white rounded-xl shadow-lg overflow-hidden"
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 }}
            >
              {/* Tabs */}
              <div className="flex border-b">
                <button
                  className={`flex-1 py-4 text-center font-medium transition-colors ${
                    activeTab === 'live' 
                      ? 'text-[#006297] border-b-2 border-[#006297]' 
                      : 'text-gray-500 hover:text-[#006297]'
                  }`}
                  onClick={() => setActiveTab('live')}
                >
                  Live
                </button>
                <button
                  className={`flex-1 py-4 text-center font-medium transition-colors ${
                    activeTab === 'upcoming' 
                      ? 'text-[#006297] border-b-2 border-[#006297]' 
                      : 'text-gray-500 hover:text-[#006297]'
                  }`}
                  onClick={() => setActiveTab('upcoming')}
                >
                  Upcoming
                </button>
                <button
                  className={`flex-1 py-4 text-center font-medium transition-colors ${
                    activeTab === 'past' 
                      ? 'text-[#006297] border-b-2 border-[#006297]' 
                      : 'text-gray-500 hover:text-[#006297]'
                  }`}
                  onClick={() => setActiveTab('past')}
                >
                  Past
                </button>
              </div>

              {/* Stream List */}
              <motion.div 
                className="max-h-[600px] overflow-y-auto"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                {getStreamsByStatus(activeTab).length > 0 ? (
                  getStreamsByStatus(activeTab).map((stream) => (
                    <motion.div
                      key={stream.id}
                      className={`p-4 border-b last:border-b-0 cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedStream?.id === stream.id ? 'bg-gray-50' : ''
                      }`}
                      onClick={() => {
                        if (stream.status !== 'upcoming') {
                          setSelectedStream(stream);
                        }
                      }}
                      variants={fadeIn}
                    >
                      <div className="flex">
                        <div className="w-24 h-16 relative rounded-md overflow-hidden flex-shrink-0 mr-3">
                          <img 
                            src={stream.thumbnailUrl} 
                            alt={stream.title}
                            className="w-full h-full object-cover"
                          />
                          {stream.status === 'live' && (
                            <div className="absolute bottom-1 right-1 bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded">
                              LIVE
                            </div>
                          )}
                          {stream.status === 'past' && stream.duration && (
                            <div className="absolute bottom-1 right-1 bg-black bg-opacity-70 text-white text-xs px-1.5 py-0.5 rounded">
                              {stream.duration}
                            </div>
                          )}
                        </div>
                        <div className="flex-grow">
                          <h4 className="font-medium text-gray-800 mb-1 line-clamp-2">{stream.title}</h4>
                          <div className="flex items-center text-xs text-gray-500">
                            <Clock className="w-3.5 h-3.5 mr-1" />
                            <span>{stream.dateTime}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <p className="text-gray-500">No {activeTab} streams available.</p>
                  </div>
                )}
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Newsletter signup section */}
        <AnimatedSection delay={0.4}>
          <div className="mt-16 bg-[#006297] text-white rounded-xl shadow-lg p-8 md:p-10">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Never Miss a Live Stream</h2>
              <p className="text-lg text-white/80 max-w-2xl mx-auto">
                Subscribe to our newsletter to get notifications about upcoming live streams and events.
              </p>
            </div>
            
            <div className="max-w-lg mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-grow px-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#BAD975]"
                />
                <motion.button
                  className="bg-[#BAD975] text-[#006297] px-6 py-3 rounded-lg font-semibold whitespace-nowrap"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Subscribe
                </motion.button>
              </div>
              <p className="text-sm text-white/60 mt-4 text-center">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}
