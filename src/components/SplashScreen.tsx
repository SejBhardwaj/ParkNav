
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [showMadeWith, setShowMadeWith] = useState(false);
  const [showTagline, setShowTagline] = useState(false);

  useEffect(() => {
    // Show tagline after logo animation
    const taglineTimer = setTimeout(() => {
      setShowTagline(true);
    }, 1000);
    
    // Show "Made with" attribution after tagline
    const madeWithTimer = setTimeout(() => {
      setShowMadeWith(true);
    }, 2000);

    // Complete the splash screen after animations
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 3500);

    return () => {
      clearTimeout(taglineTimer);
      clearTimeout(madeWithTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-white to-blue-50 flex flex-col items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center justify-center"
      >
        <motion.img 
          src="/lovable-uploads/1ce864bd-c704-4b48-82f3-14aacb08f6cf.png" 
          alt="ParkNav Logo" 
          className="w-40 h-40 object-contain mb-4"
          animate={{ 
            scale: [1, 1.05, 1],
            rotate: [0, 2, 0, -2, 0]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 3,
            ease: "easeInOut"
          }}
        />
        <motion.h1 
          className="text-3xl font-bold mb-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <span className="text-parknav-orange">Park</span>
          <span className="text-parknav-blue">Nav</span>
          <span className="text-parknav-orange"> Delhi</span>
        </motion.h1>
        
        {showTagline && (
          <motion.p 
            className="text-gray-600 text-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Park Smarter, Not Harder
          </motion.p>
        )}
      </motion.div>

      {showMadeWith && (
        <motion.div 
          className="absolute bottom-6 flex items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-sm text-gray-500 mr-2">Made with</p>
          <img 
            src="/lovable-uploads/5c58be01-df6a-418f-8565-56cc52b85419.png" 
            alt="Alpha Logo" 
            className="h-6"
          />
        </motion.div>
      )}
      
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-parknav-orange to-parknav-blue"
        initial={{ scaleX: 0, transformOrigin: "left" }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.5, duration: 3 }}
      />
    </div>
  );
};

export default SplashScreen;
