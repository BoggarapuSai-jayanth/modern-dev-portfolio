import { motion } from 'framer-motion';
import { useQuery } from "convex/react";
import { api } from "../../../backend/convex/_generated/api";

const mockAbout = {
  text: "Loading real-time description from Convex DB...",
  imageUrl: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
};

const About = () => {
  const aboutData = useQuery(api.about.get);
  const about = aboutData || mockAbout;

  return (
    <section id="about" className="py-24 px-4 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row gap-16 items-center">
        
        {/* Fade Slide Up Image */}
        <motion.div 
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.2 }}
          className="w-full md:w-5/12 aspect-[4/5] relative"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-secondary/30 rounded-2xl blur-3xl transform -rotate-6" />
          <div className="w-full h-full rounded-2xl overflow-hidden glass relative border border-white/10 z-10 p-2">
            <img 
              src={about.imageUrl || mockAbout.imageUrl} 
              alt="Profile" 
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
        </motion.div>

        <div className="w-full md:w-7/12">
          {/* Fade Slide Up Heading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">About <span className="text-primary">Me</span></h2>
            <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary rounded-full mb-8" />
          </motion.div>
          
          {/* Clip Reveal Bio */}
          <motion.div
            initial={{ clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)", opacity: 0 }}
            whileInView={{ clipPath: "polygon(0 0%, 100% 0%, 100% 100%, 0 100%)", opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.33, 1, 0.68, 1], delay: 0.3 }}
            className="text-gray-300 leading-relaxed text-lg mb-10 whitespace-pre-wrap"
          >
            {about.text}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
