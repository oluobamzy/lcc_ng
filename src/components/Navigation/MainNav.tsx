import { useState, useEffect } from 'react';
import { NavLink as RouterLink, useLocation } from 'react-router-dom';
import { Church, Menu, X, CalendarDays, BookOpen, Tv, Phone, Home, Info, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import lccLogo from '../../../public/assets/lcc.jpg';

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/about', label: 'About', icon: Info },
  { path: '/team', label: 'Team', icon: Users },
  { path: '/events', label: 'Events', icon: CalendarDays },
  { path: '/blog', label: 'Blog', icon: BookOpen },
  { path: '/live', label: 'Live Stream', icon: Tv },
  { path: '/contact', label: 'Contact', icon: Phone },
  { path: '/admin/login', label: 'Portal', icon: Church },
];

export function MainNav() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  return (
    <motion.nav 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-black/20 backdrop-blur-md shadow-lg' : 'bg-transparent'
      } text-gray-800`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <RouterLink to="/" className="flex items-center space-x-2 group">
              <img src={lccLogo} alt="Logo" className="w-32 h-14 group-hover:text-[#BAD975] transition-colors" />

              <span className="text-xl font-bold group-hover:text-[#BAD975] transition-colors">
                {/* Lifestream */}
              </span>
            </RouterLink>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map(({ path, label, icon: Icon }) => (
              <RouterLink
                key={path}
                to={path}
                className={({ isActive }) => `
                  px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-1.5
                  ${isActive 
                    ? 'text-[#BAD975] bg-[#BAD975]/10' 
                    : 'hover:text-[#BAD975] hover:bg-[#BAD975]/5'
                  }
                `}
              >
                <motion.div
                  whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <Icon className="w-4 h-4" />
                </motion.div>
                <span>{label}</span>
                {path === location.pathname && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#BAD975]"
                    layoutId="navbar-indicator"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </RouterLink>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden p-2 rounded-lg hover:bg-[#BAD975]/10 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            whileTap={{ scale: 0.9 }}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="md:hidden bg-[#006297] rounded-lg mx-4 mb-4"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div 
                className="flex flex-col space-y-3 mt-4 pb-4 px-4"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.07
                    }
                  }
                }}
              >
                {navItems.map(({ path, label, icon: Icon }) => (
                  <motion.div
                    key={path}
                    variants={{
                      hidden: { y: 20, opacity: 0 },
                      visible: { y: 0, opacity: 1 }
                    }}
                  >
                    <RouterLink
                      to={path}
                      className={({ isActive }) => `
                        flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 text-white
                        ${isActive 
                          ? 'text-[#BAD975] bg-white/10' 
                          : 'hover:text-[#BAD975] hover:bg-white/10'
                        }
                      `}
                      onClick={() => setIsMobileMenuOpen(false)} // Close menu on link click
                    >
                      <Icon className="w-5 h-5" />
                      <span>{label}</span>
                    </RouterLink>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
