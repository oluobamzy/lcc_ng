import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Home, ArrowLeft } from 'lucide-react';

export function UnauthorizedPage() {
  const navigate = useNavigate();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  // Redirect back to homepage after 5 seconds
  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate('/');
    }, 8000);
    
    return () => clearTimeout(timeout);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <motion.div 
        className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="mb-6">
          <ShieldAlert className="w-20 h-20 text-red-500 mx-auto" />
        </motion.div>
        
        <motion.h1 variants={itemVariants} className="text-2xl font-bold text-gray-900 mb-2">
          Access Denied
        </motion.h1>
        
        <motion.p variants={itemVariants} className="text-gray-600 mb-6">
          You don't have permission to access this page. If you believe this is an error, please contact your administrator.
        </motion.p>
        
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </button>
          
          <button 
            onClick={() => navigate('/')}
            className="inline-flex items-center justify-center px-4 py-2 bg-[#006297] text-white rounded-lg hover:bg-opacity-90 transition-colors"
          >
            <Home className="w-4 h-4 mr-2" />
            Go Home
          </button>
        </motion.div>
        
        <motion.p 
          variants={itemVariants} 
          className="text-sm text-gray-500 mt-8"
        >
          You'll be automatically redirected to the homepage in a few seconds...
        </motion.p>
      </motion.div>
    </div>
  );
}
