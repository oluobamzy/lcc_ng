import { useState} from 'react';
import { ArrowRight, Play } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeroProps {
  onJoinUsClick: () => void;
  onExploreClick: () => void;
}

export function Hero({ onJoinUsClick, onExploreClick }: HeroProps) {
  const [showVideo, setShowVideo] = useState(false);
  
  // Create scroll-based animations
  // const { scrollY } = useScroll();
  // const y1 = useTransform(scrollY, [0, 500], [0, 100]);
  // const y2 = useTransform(scrollY, [0, 500], [0, -100]);
  // const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  
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
  
  // const buttonVariants = {
  //   hidden: { opacity: 0, y: 20 },
  //   visible: { 
  //     opacity: 1, 
  //     y: 0,
  //     transition: {
  //       delay: 1,
  //       duration: 0.5
  //     }
  //   },
  //   hover: {
  //     scale: 1.05,
  //     boxShadow: "0px 5px 15px rgba(0,0,0,0.1)"
  //   }
  // };

  return (
    <div className="relative bg-[#006297] text-white overflow-hidden">
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=1350&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 0
        }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1 
              className="text-5xl font-bold leading-tight mb-6"
              variants={itemVariants}
            >
              Welcome to Your Spiritual Home
            </motion.h1>
            <motion.p 
              className="text-xl mb-8"
              variants={itemVariants}
            >
              Join us in worship and experience the transformative power of community and faith.
            </motion.p>
            <motion.div 
              className="flex flex-wrap gap-4"
              variants={itemVariants}
            >
              <motion.button 
                className="bg-[#BAD975] text-[#006297] px-8 py-3 rounded-lg font-semibold 
                  hover:bg-opacity-90 transition-colors flex items-center shadow-lg hover:shadow-xl"
                onClick={onJoinUsClick}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                Join Us Sunday <ArrowRight className="ml-2 w-5 h-5" />
              </motion.button>
              <motion.button 
                className="border-2 border-white px-8 py-3 rounded-lg font-semibold 
                  hover:bg-white hover:text-[#006297] transition-colors shadow-lg hover:shadow-xl"
                onClick={onExploreClick}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                Explore
              </motion.button>
            </motion.div>
          </motion.div>
          <motion.div 
            className="hidden md:block"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <div className="relative rounded-lg shadow-2xl overflow-hidden">
              {!showVideo ? (
                <div className="relative">
                  <img 
                    src="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=1350&q=80" 
                    alt="Church community" 
                    className="rounded-lg w-full h-[480px] object-cover"
                  />
                  <motion.div 
                    className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black bg-opacity-30"
                    onClick={() => setShowVideo(true)}
                    whileHover={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                  >
                    <motion.div 
                      className="bg-white bg-opacity-90 rounded-full p-5 shadow-lg"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <Play className="w-12 h-12 text-[#006297]" />
                    </motion.div>
                  </motion.div>
                </div>
              ) : (
                <iframe 
                  src="https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1" 
                  width="640" 
                  height="480" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                  className="w-full h-[480px]"
                ></iframe>
              )}
            </div>
          </motion.div>
        </div>
      </div>
      
      <motion.div 
        className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
      ></motion.div>
    </div>
  );
}