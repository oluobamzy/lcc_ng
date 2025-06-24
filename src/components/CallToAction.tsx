import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface CallToActionProps {
  title: string;
  description: string;
  buttonText: string;
  onButtonClick?: () => void;
  variant?: 'primary' | 'secondary';
  className?: string;
}

export function CallToAction({
  title,
  description,
  buttonText,
  onButtonClick,
  variant = 'primary',
  className = ''
}: CallToActionProps) {
  const isPrimary = variant === 'primary';
  
  return (
    <div className={`${className} relative overflow-hidden ${
      isPrimary 
        ? 'bg-[#006297] text-white' 
        : 'bg-[#BAD975] text-[#006297]'
    } rounded-lg p-10 md:p-12 text-center shadow-2xl`}>
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-white/10"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-white/10"></div>
      </div>
      
      <div className="relative z-10">
        <motion.h2 
          className="text-3xl md:text-4xl font-bold mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {title}
        </motion.h2>
        
        <motion.p 
          className="text-xl mb-8 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {description}
        </motion.p>
        
        <motion.button 
          onClick={onButtonClick}
          className={`${
            isPrimary 
              ? 'bg-[#BAD975] text-[#006297] hover:bg-white' 
              : 'bg-[#006297] text-white hover:bg-[#00507a]'
          } px-8 py-4 rounded-lg font-semibold transition-colors flex items-center space-x-2 mx-auto`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <span>{buttonText}</span>
          <ArrowRight className="w-5 h-5 ml-2" />
        </motion.button>
      </div>
    </div>
  );
}