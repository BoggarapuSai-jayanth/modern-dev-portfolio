import { motion } from 'framer-motion';

/**
 * ScrollReveal — wraps any content and animates it into view on scroll.
 * direction: 'up' | 'down' | 'left' | 'right'
 */
const directions = {
  up:    { hidden: { opacity: 0, y: 60 },  visible: { opacity: 1, y: 0 } },
  down:  { hidden: { opacity: 0, y: -60 }, visible: { opacity: 1, y: 0 } },
  left:  { hidden: { opacity: 0, x: 80 },  visible: { opacity: 1, x: 0 } },
  right: { hidden: { opacity: 0, x: -80 }, visible: { opacity: 1, x: 0 } },
  zoom:  { hidden: { opacity: 0, scale: 0.85 }, visible: { opacity: 1, scale: 1 } },
  flip:  { hidden: { opacity: 0, rotateX: 30 }, visible: { opacity: 1, rotateX: 0 } },
};

const ScrollReveal = ({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.7,
  className = '',
  once = true,
}) => {
  const variant = directions[direction] || directions.up;

  return (
    <motion.div
      variants={variant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: '-80px' }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;
