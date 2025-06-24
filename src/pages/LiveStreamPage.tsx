import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Calendar, Clock, ExternalLink } from 'lucide-react';

interface LiveStream {
  id: string;
  title: string;
  description: string;
  youtubeId: string;
  scheduledStartTime: Date;
  thumbnail?: string;
  status: 'upcoming' | 'live' | 'completed';
  views?: number;
  duration?: string;
}

// Animation variants
// const fadeIn = {
//   hidden: { opacity: 0, y: 20 },
//   visible: { 
//     opacity: 1, 
//     y: 0,
//     transition: { duration: 0.6 }
//   }
// };

// Stagger children animation variants
// const staggerContainer = {
//   hidden: { opacity: 0 },
//   visible: {
//     opacity: 1,
//     transition: {
//       staggerChildren: 0.1
//     }
//   }
// };

export const LiveStreamPage = () => {
  const [activeStreams, setActiveStreams] = useState<LiveStream[]>([]);
  const [upcomingStreams, setUpcomingStreams] = useState<LiveStream[]>([]);
  const [pastStreams, setPastStreams] = useState<LiveStream[]>([]);
  const [loading, setLoading] = useState(true);
  // const [selectedStream, setSelectedStream] = useState<LiveStream | null>(null);

  useEffect(() => {
    const fetchStreams = async () => {
      try {
        // Get active streams
        const activeQuery = query(
          collection(db, 'streams'),
          where('status', '==', 'live'),
          orderBy('scheduledStartTime', 'desc')
        );
        
        // Get upcoming streams
        const upcomingQuery = query(
          collection(db, 'streams'),
          where('status', '==', 'upcoming'),
          orderBy('scheduledStartTime', 'asc'),
          limit(5)
        );
        
        // Get past streams
        const pastQuery = query(
          collection(db, 'streams'),
          where('status', '==', 'completed'),
          orderBy('scheduledStartTime', 'desc'),
          limit(6)
        );
        
        const [activeSnapshot, upcomingSnapshot, pastSnapshot] = await Promise.all([
          getDocs(activeQuery),
          getDocs(upcomingQuery),
          getDocs(pastQuery)
        ]);
        
        const mapStreamData = (doc: any) => ({
          id: doc.id,
          ...doc.data(),
          scheduledStartTime: doc.data().scheduledStartTime?.toDate()
        });
        
        setActiveStreams(activeSnapshot.docs.map(mapStreamData));
        setUpcomingStreams(upcomingSnapshot.docs.map(mapStreamData));
        setPastStreams(pastSnapshot.docs.map(mapStreamData));
      } catch (error) {
        console.error('Error fetching streams:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStreams();
  }, []);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Default livestream if none exists in database
  const defaultLiveStream = {
    id: 'default',
    title: 'Sunday Service',
    description: 'Join us for our weekly Sunday worship service.',
    youtubeId: 'jfKfPfyJRdk', // Lofi music livestream as example
    scheduledStartTime: new Date(),
    status: 'live' as const
  };

  // Use default if no active streams
  const currentStream = activeStreams.length > 0 ? activeStreams[0] : defaultLiveStream;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#006297]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-[#006297] mb-8">Live Streams</h1>
        </motion.div>
        
        {/* Current Stream */}
        <motion.div 
          className="mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.7 }}
        >
          <h2 className="text-2xl font-semibold mb-4">
            {activeStreams.length > 0 ? 'Currently Live' : 'Featured Stream'}
          </h2>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="aspect-w-16">
              <iframe
                src={`https://www.youtube.com/embed/${currentStream.youtubeId}?autoplay=1&mute=0`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {currentStream.title}
              </h3>
              <p className="text-gray-600 mb-4">{currentStream.description}</p>
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="w-4 h-4 mr-2" />
                <span>{formatDate(currentStream.scheduledStartTime)}</span>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Upcoming Streams */}
        {upcomingStreams.length > 0 && (
          <motion.div 
            className="mb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.7 }}
          >
            <h2 className="text-2xl font-semibold mb-4">Upcoming Streams</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingStreams.map((stream) => (
                <motion.div
                  key={stream.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {stream.thumbnail ? (
                    <img
                      src={stream.thumbnail}
                      alt={stream.title}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                      <Calendar className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{stream.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{stream.description}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>{formatDate(stream.scheduledStartTime)}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
        
        {/* Past Streams */}
        {pastStreams.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.7 }}
          >
            <h2 className="text-2xl font-semibold mb-4">Past Streams</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastStreams.map((stream) => (
                <motion.div
                  key={stream.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <a 
                    href={`https://www.youtube.com/watch?v=${stream.youtubeId}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block relative"
                  >
                    {stream.thumbnail ? (
                      <img
                        src={stream.thumbnail}
                        alt={stream.title}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                        <Calendar className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <div className="bg-white bg-opacity-90 rounded-full p-3">
                        <ExternalLink className="w-6 h-6 text-[#006297]" />
                      </div>
                    </div>
                  </a>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{stream.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{stream.description}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>{formatDate(stream.scheduledStartTime)}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
