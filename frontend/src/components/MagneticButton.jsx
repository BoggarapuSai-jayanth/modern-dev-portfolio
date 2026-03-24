import { useRef, useState } from 'react';
import { motion } from 'framer-motion';

const MagneticButton = ({ children, onClick, className = "", variant = "primary" }) => {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.2, y: middleY * 0.2 });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  const baseClasses = "relative px-8 py-4 rounded-full font-medium transition-colors overflow-hidden inline-flex items-center justify-center";
  const variants = {
    primary: "bg-primary text-white shadow-[0_0_20px_rgba(109,40,217,0.3)] hover:bg-primary/90",
    secondary: "bg-white/5 text-white border border-white/10 backdrop-blur-md hover:bg-white/10"
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]} ${className}`}
      whileTap={{ scale: 0.95 }}
    >
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
};

export default MagneticButton;
