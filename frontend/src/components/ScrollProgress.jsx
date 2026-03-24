import { useScroll, useSpring, motion } from 'framer-motion';

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <motion.div
      style={{ scaleX, transformOrigin: 'left' }}
      className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary via-secondary to-primary z-[9999] rounded-full"
    />
  );
};

export default ScrollProgress;
