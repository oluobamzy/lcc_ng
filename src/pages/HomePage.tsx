import React, { useEffect, useState, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';
import { HeroEnhanced } from '../components/Hero/HeroEnhanced';
import { Gallery } from '../components/Gallery/Gallery';
import { CallToAction } from '../components/CallToAction';
import { MediaItem } from '../components/Gallery/types';
import { ArrowRight, Calendar, ChevronRight, ChevronDown, Clock, Loader, MapPin, Play } from 'lucide-react';
import { getBunmiAkinyosolaVideos } from '../utils/youtube-utils';
import { FeaturedYouTubeVideo } from '../components/LiveStreamEnhanced/FeaturedYouTubeVideo';

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

// Sample upcoming events for homepage
const upcomingEvents = [
  {
    id: '1',
    title: 'Sunday Service',
    date: 'May 12, 2025',
    time: '10:00 AM',
    location: 'Main Sanctuary',
    imageUrl: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=1350&q=80'
  },
  {
    id: '2',
    title: 'Prayer Revival',
    date: 'May 15, 2025',
    time: '7:00 PM',
    location: 'Prayer Chapel',
    imageUrl: 'https://images.unsplash.com/photo-1507036066871-b7e8032b3dea?auto=format&fit=crop&w=1350&q=80'
  },
  {
    id: '3',
    title: 'Youth Conference',
    date: 'May 18-20, 2025',
    time: 'All Day',
    location: 'Community Hall',
    imageUrl: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1350&q=80'
  }
];

// Mission statement and values data
const missionData = {
  mission: "Our mission is to bring men and women to the saving knowledge of Christ and the membership of the local church. Raising churches in every tribe, language, and nations Ultimately Raising Disciples for our our Lord Jesus",
  values: [
    {
      title: "Our Vision",
      description: "To be a beacon of hope and transformation, reaching people with God's love and helping them become uncompromising and devoted followers of Christ."
    },
    {
      title: "Our Values",
      description: "We value an atmosphere of faith, love, excellence, purpose, and accountability."
    },
    {
      title: "Our Community",
      description: "We are a diverse family of believers, united by our love for God and dedicated to serving Him and making a positive impact in our community."
    },
    {
      title: "Our Foundation",
      description: "Built on worship, community, service, and learning - the four pillars that guide our ministry and fellowship."
    }
  ]
};

// Custom counter component to handle animation typing issues
interface CounterProps {
  from: number;
  to: number;
  duration?: number;
  delay?: number;
  controls: any; // AnimationControls from framer-motion
}

const Counter: React.FC<CounterProps> = ({ from, to, duration = 2, delay = 0, controls }) => {
  const [count, setCount] = useState(from);
  
  useEffect(() => {
    let startTime: number;
    let animationFrame: number;
    
    const updateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      
      if (progress < 1) {
        setCount(Math.floor(from + (to - from) * progress));
        animationFrame = requestAnimationFrame(updateCount);
      } else {
        setCount(to);
      }
    };
    
    if (controls) {
      const timer = setTimeout(() => {
        animationFrame = requestAnimationFrame(updateCount);
      }, delay * 1000);
      
      return () => {
        clearTimeout(timer);
        cancelAnimationFrame(animationFrame);
      };
    }
  }, [from, to, duration, delay, controls]);
  
  return <>{count}</>;
};

// Section component that animates when scrolled into view
interface AnimatedSectionProps {
  children: React.ReactNode;
  delay?: number;
}

const AnimatedSection: React.FC<AnimatedSectionProps> = ({ children, delay = 0 }) => {
  const controls = useAnimation();
  // Create a specific ref for this element
  const sectionRef = useRef<HTMLDivElement>(null);
  // TypeScript fix: use destructuring for useInView
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true
  });
  
  // Connect the refs
  useEffect(() => {
    if (sectionRef.current) {
      // This is a proper way to handle the callback ref
      if (typeof ref === 'function') {
        ref(sectionRef.current);
      }
    }
  }, [ref]);

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={sectionRef}
      initial="hidden"
      animate={controls}
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

export function HomePage() {
  const navigate = useNavigate();
  // Animation controls
  const statsControls = useAnimation();
  const statsRef = useRef<HTMLDivElement>(null);
  
  // State for YouTube videos from Bunmi Akinyosola Ministries
  const [channelVideos, setChannelVideos] = useState<MediaItem[]>([]);
  const [isLoadingVideos, setIsLoadingVideos] = useState(true);
  
  // State to manage the number of videos displayed
  const [visibleVideos, setVisibleVideos] = useState(4);

  // Fetch videos on component mount
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setIsLoadingVideos(true);
        const videos = await getBunmiAkinyosolaVideos();
        setChannelVideos(videos);
      } catch (error) {
        console.error('Error fetching videos:', error);
      } finally {
        setIsLoadingVideos(false);
      }
    };
    
    fetchVideos();
  }, []);
  
  // Only using YouTube videos from the channel
  const sampleMedia: MediaItem[] = channelVideos;

  // Load more videos handler
  const handleLoadMoreVideos = () => {
    setVisibleVideos(channelVideos.length);
  };
  
  // Stats animations are handled when the section comes into view
  
  const handleJoinUsClick = () => navigate('/events');
  const handleExploreClick = () => navigate('/about');
  const handleLiveStreamClick = () => navigate('/live');
  // TypeScript fix: use destructuring for useInView
  const { ref: refStatsInView, inView: statsInView } = useInView({
    triggerOnce: true,
    threshold: 0.5
  });

  // Connect the refs
  useEffect(() => {
    if (statsRef.current) {
      // This is a proper way to handle the callback ref
      if (typeof refStatsInView === 'function') {
        refStatsInView(statsRef.current);
      }
    }
  }, [refStatsInView]);
  
  useEffect(() => {
    if (statsInView) {
      statsControls.start('visible');
    }
  }, [statsControls, statsInView]);

  return (
    <div className="min-h-screen bg-white">
      {/* Add padding for fixed navbar */}
      <div className="pt-20">
        <HeroEnhanced 
          onJoinUsClick={handleJoinUsClick}
          onExploreClick={handleExploreClick}
        />
        
        {/* Mission and Values Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection>
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-[#006297] mb-4">Our Mission</h2>
                <div className="w-24 h-1 bg-[#BAD975] mx-auto mb-8"></div>
                <p className="max-w-3xl mx-auto text-lg text-gray-700">
                  {missionData.mission}
                </p>
              </div>
            </AnimatedSection>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {missionData.values.map((value, index) => (
                <AnimatedSection key={index} delay={index * 0.2}>
                  <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-all h-full flex flex-col">
                    <div className="w-12 h-12 bg-[#006297]/10 rounded-full flex items-center justify-center mb-4">
                      <div className="w-8 h-8 bg-[#006297] rounded-full flex items-center justify-center text-white font-bold">
                        {index + 1}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-[#006297] mb-2">{value.title}</h3>
                    <p className="text-gray-600 flex-grow">{value.description}</p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
        
        {/* Live Stream Section */}
        <section className="py-20 bg-[#006297] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <AnimatedSection>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Join Us Live This Sunday</h2>
                <p className="text-xl mb-8 text-white/80">
                  Can't make it in person? Watch our services live from anywhere in the world.
                </p>
                <motion.button
                  className="bg-[#BAD975] text-[#006297] px-6 py-3 rounded-lg font-semibold flex items-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLiveStreamClick}
                >
                  <Play className="mr-2 w-5 h-5" />
                  Watch Live Stream
                </motion.button>
              </AnimatedSection>
              
              <AnimatedSection delay={0.3}>
                <div className="relative overflow-hidden rounded-lg shadow-xl">
                  <div className="aspect-w-16 aspect-h-9">
                    <img 
                      src="https://images.unsplash.com/photo-1519834079387-98bdd88954ce?auto=format&fit=crop&w=1350&q=80" 
                      alt="Live stream preview"
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <motion.div 
                      className="w-20 h-20 bg-[#BAD975] rounded-full flex items-center justify-center"
                      whileHover={{ scale: 1.1 }}
                    >
                      <Play className="w-10 h-10 text-[#006297]" fill="currentColor" />
                    </motion.div>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>
        
        {/* Stats Section */}
        <section className="py-16 bg-gray-50">
          <div 
            ref={statsRef} 
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <motion.div
                className="text-center"
                variants={fadeIn}
                initial="hidden"
                animate={statsControls}
                custom={1}
                transition={{ delay: 0.1 }}
              >
                <motion.div 
                  className="text-5xl font-bold text-[#006297] mb-2"
                  initial={{ opacity: 0 }}
                  animate={statsControls ? { opacity: 1 } : {}}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <Counter from={0} to={15} duration={2} delay={0.1} controls={statsControls} />+
                </motion.div>
                <p className="text-gray-600">Years of Service</p>
              </motion.div>
              
              <motion.div
                className="text-center"
                variants={fadeIn}
                initial="hidden"
                animate={statsControls}
                custom={2}
                transition={{ delay: 0.3 }}
              >
                <motion.div 
                  className="text-5xl font-bold text-[#006297] mb-2"
                  initial={{ opacity: 0 }}
                  animate={statsControls ? { opacity: 1 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <Counter from={0} to={1200} duration={2} delay={0.3} controls={statsControls} />+
                </motion.div>
                <p className="text-gray-600">Members</p>
              </motion.div>
              
              <motion.div
                className="text-center"
                variants={fadeIn}
                initial="hidden"
                animate={statsControls}
                custom={3}
                transition={{ delay: 0.5 }}
              >
                <motion.div 
                  className="text-5xl font-bold text-[#006297] mb-2" 
                  initial={{ opacity: 0 }}
                  animate={statsControls ? { opacity: 1 } : {}}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <Counter from={0} to={40} duration={2} delay={0.5} controls={statsControls} />+
                </motion.div>
                <p className="text-gray-600">Ministries</p>
              </motion.div>
              
              <motion.div
                className="text-center"
                variants={fadeIn}
                initial="hidden"
                animate={statsControls}
                custom={4}
                transition={{ delay: 0.7 }}
              >
                <motion.div 
                  className="text-5xl font-bold text-[#006297] mb-2"
                  initial={{ opacity: 0 }}
                  animate={statsControls ? { opacity: 1 } : {}}
                  transition={{ duration: 0.5, delay: 0.7 }}
                >
                  <Counter from={0} to={12} duration={2} delay={0.7} controls={statsControls} />K+
                </motion.div>
                <p className="text-gray-600">Lives Impacted</p>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* Latest Media Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection>
              <div className="flex justify-between items-center mb-12">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-[#006297]">
                    Latest Media
                  </h2>
                  <p className="text-gray-600 mt-2">Explore our recent sermons and events</p>
                </div>
                
                <motion.button
                  whileHover={{ x: 5 }}
                  whileTap={{ x: -2 }}
                  className="text-[#006297] font-medium flex items-center"
                  onClick={() => navigate('/media')}
                >
                  View all 
                  <ChevronRight className="w-4 h-4 ml-1" />
                </motion.button>
              </div>
            </AnimatedSection>
            
            <AnimatedSection delay={0.1}>
              {channelVideos.length > 0 ? (
                <FeaturedYouTubeVideo video={channelVideos[0]} height="40%" />
              ) : (
                <div className="aspect-video bg-gray-100 flex items-center justify-center rounded-lg">
                  <div className="text-center">
                    <Loader className="w-10 h-10 text-[#006297] animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Loading featured video...</p>
                  </div>
                </div>
              )}
            </AnimatedSection>
            
            <AnimatedSection delay={0.2}>
              {isLoadingVideos ? (
                <div className="py-10 text-center">
                  <Loader className="w-10 h-10 text-[#006297] animate-spin mx-auto mb-4" />
                  <p className="text-gray-600">Loading videos from Bunmi Akinyosola Ministries...</p>
                </div>
              ) : (
                <div>
                  <Gallery items={sampleMedia.slice(0, visibleVideos)} columns={4} smallCards={true} />
                  
                  {/* Load More Button - only show if there are more videos to load */}
                  {visibleVideos < sampleMedia.length && (
                    <div className="mt-8 text-center">
                      <motion.button
                        onClick={handleLoadMoreVideos}
                        className="bg-[#006297] text-white px-6 py-3 rounded-lg font-medium inline-flex items-center"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Load More
                        <ChevronDown className="ml-2 w-5 h-5" />
                      </motion.button>
                    </div>
                  )}
                </div>
              )}
            </AnimatedSection>
          </div>
        </section>
        
        {/* Upcoming Events Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection>
              <div className="flex justify-between items-center mb-12">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-[#006297]">
                    Upcoming Events
                  </h2>
                  <p className="text-gray-600 mt-2">Join us for these special gatherings</p>
                </div>
                
                <motion.button
                  whileHover={{ x: 5 }}
                  whileTap={{ x: -2 }}
                  className="text-[#006297] font-medium flex items-center"
                  onClick={() => navigate('/events')}
                >
                  View all 
                  <ChevronRight className="w-4 h-4 ml-1" />
                </motion.button>
              </div>
            </AnimatedSection>
            
            <div className="grid md:grid-cols-3 gap-8">
              {upcomingEvents.map((event, index) => (
                <AnimatedSection key={event.id} delay={index * 0.15}>
                  <motion.div 
                    className="bg-white rounded-lg shadow-md overflow-hidden"
                    whileHover={{ y: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={event.imageUrl} 
                        alt={event.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-[#006297] mb-3">{event.title}</h3>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-gray-600">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Clock className="w-4 h-4 mr-2" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <MapPin className="w-4 h-4 mr-2" />
                          <span>{event.location}</span>
                        </div>
                      </div>
                      
                      <motion.button
                        className="text-[#006297] font-medium flex items-center"
                        whileHover={{ x: 5 }}
                        whileTap={{ x: -2 }}
                        onClick={() => navigate(`/events/${event.id}`)}
                      >
                        Learn more
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </motion.button>
                    </div>
                  </motion.div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
        
        {/* Get Connected CTA */}
        <AnimatedSection>
          <div className="mt-16">
            <CallToAction
              title="Join Our Community"
              description="Experience the warmth and fellowship of our church family"
              buttonText="Get Connected"
              onButtonClick={() => navigate('/contact')}
            />
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}
