import { useState } from 'react';
import { ArrowRight, Play } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface HeroProps {
  onJoinUsClick: () => void;
  onExploreClick: () => void;
}

export function HeroEnhanced({ onJoinUsClick, onExploreClick }: HeroProps) {
  const [showVideo, setShowVideo] = useState(false);
  
  // Create scroll-based animations
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 100]);
  const y2 = useTransform(scrollY, [0, 500], [0, -100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  
  // Text animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { 
        type: "spring",
        stiffness: 100,
        duration: 0.8, 
        ease: "easeOut"
      }
    }
  };
  
  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        delay: 1,
        duration: 0.5
      }
    },
    hover: {
      scale: 1.05,
      boxShadow: "0px 5px 15px rgba(0,0,0,0.1)"
    }
  };

  return (
    <motion.div 
      className="relative bg-[#006297] text-white overflow-hidden"
      style={{ opacity }}
    >
      <motion.div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=1350&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 0,
          y: y1
        }}
      />
      
      {/* Animated decorative elements */}
      <motion.div 
        className="absolute top-10 left-10 w-64 h-64 rounded-full bg-[#BAD975] opacity-10 blur-3xl"
        animate={{ 
          scale: [1, 1.2, 1],
          x: [0, 10, 0],
          y: [0, 15, 0]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
      
      <motion.div 
        className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-[#BAD975] opacity-10 blur-3xl"
        animate={{ 
          scale: [1, 1.1, 1],
          x: [0, -20, 0],
          y: [0, -10, 0]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <motion.span 
                className="inline-block px-3 py-1 bg-[#BAD975]/20 text-[#BAD975] rounded-full text-sm font-medium mb-4"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                Welcome to Lifestream Church
              </motion.span>
            </motion.div>
            
            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
            >
              Experience Worship, Word and Faith <br />
              <span className="text-[#BAD975] relative">
                Like Never Before
                <motion.span 
                  className="absolute bottom-1 left-0 w-full h-1 bg-[#BAD975]/40 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 1, duration: 1 }}
                />
              </span>
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              className="text-xl md:text-2xl mb-8 text-gray-100"
            >
              Join our vibrant community for inspiring worship, meaningful connections, and spiritual growth.
            </motion.p>
            
            <motion.div 
              variants={itemVariants}
              className="flex flex-wrap gap-4"
              initial="hidden"
              animate="visible"
            >
              <motion.button
                onClick={onJoinUsClick}
                className="bg-[#BAD975] text-[#006297] px-6 py-3 rounded-lg font-semibold flex items-center shadow-lg hover:shadow-xl transition-shadow"
                variants={buttonVariants}
                whileHover="hover"
                whileTap={{ scale: 0.95 }}
              >
                <span>Join Us Sunday</span>
                <motion.div
                  initial={{ x: 0 }}
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                >
                  <ArrowRight className="ml-2 w-5 h-5" />
                </motion.div>
              </motion.button>
              
              <motion.button
                onClick={onExploreClick}
                className="border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:bg-opacity-10 transition-colors"
                variants={buttonVariants}
                whileHover="hover"
                whileTap={{ scale: 0.95 }}
              >
                Explore Our Ministries
              </motion.button>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="md:flex justify-end hidden"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            style={{ y: y2 }}
          >
            <div className="relative w-full max-w-lg">
              <motion.div 
                className="absolute -top-4 -left-4 w-full h-full rounded-lg bg-[#BAD975]"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              />
              
              <motion.div 
                className="bg-white w-full aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-2xl relative z-10"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  {showVideo ? (
                    <iframe
                      className="absolute inset-0 w-full h-full"
                      src="https://www.youtube.com/embed/vQfwV5LVJwY?autoplay=1"
                      title="Bunmi Akinyosola Ministries"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <>
                      <img 
                        src="https://img.youtube.com/vi/vQfwV5LVJwY/maxresdefault.jpg" 
                        alt="Bunmi Akinyosola Ministries"
                        className="object-cover w-full h-full"
                      />
                      <motion.div 
                        className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center"
                        initial={{ backgroundColor: "rgba(0,0,0,0.3)" }}
                        whileHover={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                      >
                        <motion.button 
                          onClick={() => setShowVideo(true)}
                          className="w-20 h-20 bg-[#BAD975] rounded-full flex items-center justify-center transition-opacity focus:outline-none group"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          animate={{ 
                            boxShadow: [
                              "0px 0px 0px 0px rgba(186,217,117,0.2)", 
                              "0px 0px 0px 20px rgba(186,217,117,0)", 
                              "0px 0px 0px 0px rgba(186,217,117,0.2)"
                            ]
                          }}
                          transition={{ 
                            duration: 2, 
                            ease: "easeInOut", 
                            repeat: Infinity 
                          }}
                        >
                          <Play className="w-10 h-10 text-[#006297] transform translate-x-0.5" fill="currentColor" />
                        </motion.button>
                      </motion.div>
                    </>
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
