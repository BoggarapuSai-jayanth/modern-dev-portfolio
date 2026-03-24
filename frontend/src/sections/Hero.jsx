import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { useQuery } from "convex/react";
import { api } from "../../../backend/convex/_generated/api";

const phraseList = ["Full-Stack Developer", "Problem-Solver", "Team Player", "Fast Learner", "Hard Worker"];
const heroTitle = "Hi, Boggarapu Sai Jayanth".split("");

const scatterContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.2 }
  }
};

const scatterLetter = {
  hidden: { 
    opacity: 0, 
    x: () => Math.random() * 200 - 100, 
    y: () => Math.random() * 200 - 100, 
    rotate: () => Math.random() * 180 - 90 
  },
  visible: { 
    opacity: 1, 
    x: 0, 
    y: 0, 
    rotate: 0, 
    transition: { type: "spring", damping: 10, stiffness: 50 } 
  }
};

const SpaceBackground = () => {
  const [stars, setStars] = useState([]);
  const [meteors, setMeteors] = useState([]);

  useEffect(() => {
    // Generate static stars
    const generatedStars = [...Array(150)].map(() => ({
      left: Math.random() * 100 + "%",
      top: Math.random() * 100 + "%",
      size: Math.random() * 2 + 1 + "px",
      opacity: Math.random() * 0.8 + 0.2,
      animationDelay: Math.random() * 3 + "s",
      animationDuration: Math.random() * 4 + 2 + "s",
    }));
    setStars(generatedStars);

    // Generate meteors
    const generatedMeteors = [...Array(15)].map(() => ({
      left: Math.random() * 120 + "vw", 
      top: (Math.random() * 100 - 50) + "vh", 
      duration: Math.random() * 2 + 1.5 + "s", 
      delay: Math.random() * 5 + "s",
    }));
    setMeteors(generatedMeteors);
  }, []);

  return (
    <>
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes moveMeteor {
          0% { transform: translateX(0); opacity: 0; }
          5% { opacity: 1; }
          70% { opacity: 0; }
          100% { transform: translateX(150vw); opacity: 0; }
        }
        .animate-twinkle {
          animation: twinkle linear infinite;
        }
      `}</style>
      
      {/* Stars Layer */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {stars.map((s, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white animate-twinkle"
            style={{
              left: s.left,
              top: s.top,
              width: s.size,
              height: s.size,
              opacity: s.opacity,
              animationDuration: s.animationDuration,
              animationDelay: s.animationDelay,
            }}
          />
        ))}
      </div>

      {/* Meteors Layer */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {meteors.map((m, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              left: m.left,
              top: m.top,
              transform: "rotate(135deg)",
            }}
          >
            <div
              className="relative flex items-center justify-end"
              style={{
                width: "150px",
                animation: `moveMeteor ${m.duration} linear ${m.delay} infinite`
              }}
            >
              {/* Tail */}
              <div className="h-[1px] w-full bg-gradient-to-r from-transparent to-cyan-300/80" />
              {/* Head */}
              <div className="w-[3px] h-[3px] bg-cyan-300 rounded-full shadow-[0_0_10px_2px_#67e8f9] flex-shrink-0 -ml-[1px]" />
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

const Hero = () => {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const about = useQuery(api.about.get);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhraseIndex((prev) => (prev + 1) % phraseList.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden px-4">
      <SpaceBackground />
      {/* Background elements */}
      <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] bg-primary/20 rounded-full blur-[120px] mix-blend-screen animate-pulse pointer-events-none z-0" />
      <div className="absolute bottom-1/4 right-1/4 w-[30vw] h-[30vw] max-w-[400px] max-h-[400px] bg-secondary/20 rounded-full blur-[100px] mix-blend-screen pointer-events-none z-0" />

      <div className="relative z-10 text-center max-w-4xl mx-auto flex flex-col items-center">
        
        {/* Letter Scatter Title */}
        <motion.h1 
          variants={scatterContainer}
          initial="hidden"
          animate="visible"
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight mb-6 flex flex-wrap justify-center text-white drop-shadow-xl leading-snug"
        >
          {heroTitle.map((char, index) => (
            <motion.span 
              key={index} 
              custom={index} 
              variants={scatterLetter} 
              style={{ paddingRight: char === " " ? "0.3em" : "0.02em" }}
              className="inline-block"
            >
              {char}
            </motion.span>
          ))}
        </motion.h1>

        {/* Typewriter text cycle */}
        <div className="h-[40px] md:h-[60px] flex items-center justify-center overflow-hidden mb-8">
           <AnimatePresence mode="wait">
             <motion.h2
               key={currentPhraseIndex}
               initial={{ y: 20, opacity: 0, filter: 'blur(5px)' }}
               animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
               exit={{ y: -20, opacity: 0, filter: 'blur(5px)' }}
               transition={{ duration: 0.5 }}
               className="text-2xl md:text-4xl text-gray-300 font-medium whitespace-nowrap"
             >
               I'm a <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">{phraseList[currentPhraseIndex]}</span>
               <motion.span
                 animate={{ opacity: [1, 0, 1] }}
                 transition={{ duration: 0.8, repeat: Infinity }}
                 className="inline-block w-[3px] h-[30px] md:h-[40px] bg-primary ml-1 align-middle"
               />
             </motion.h2>
           </AnimatePresence>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="max-w-2xl mx-auto mb-10 text-gray-400 text-lg md:text-xl leading-relaxed"
        >
          Crafting exceptional digital experiences with modern web technologies. 
          Bringing ideas to life through elegant code and stunning design.
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 1.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          {about?.resumeUrl && (
            <a href={about.resumeUrl} target="_blank" rel="noreferrer">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 rounded-xl font-semibold bg-gradient-to-r from-primary to-secondary text-white shadow-lg hover:shadow-primary/40 transition-all"
              >
                📄 Download CV
              </motion.button>
            </a>
          )}
          <a href="#projects">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 rounded-xl font-semibold border border-white/20 text-white hover:bg-white/10 transition-all"
            >
               View My Work
            </motion.button>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
