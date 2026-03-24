import { motion } from 'framer-motion';
import { GraduationCap } from 'lucide-react';
import { useQuery } from "convex/react";
import { api } from "../../../backend/convex/_generated/api";

const mockEducation = [
  { 
    degree: 'Loading...', 
    institution: '...', 
    duration: '...', 
    description: '...',
    score: ''
  }
];

const Education = () => {
  const educationData = useQuery(api.education.get);
  const educationList = educationData || mockEducation;

  return (
    <section id="education" className="py-24 px-4 max-w-7xl mx-auto relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-16 text-center"
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-4">Academic <span className="text-secondary">Education</span></h2>
        <div className="w-20 h-1 bg-gradient-to-r from-secondary to-primary rounded-full mx-auto" />
      </motion.div>

      <div className="max-w-4xl mx-auto px-2 md:px-8">
        <div className="relative border-l border-slate-700 ml-4 md:ml-8 space-y-12 pb-4">
          {educationList.map((edu, index) => (
            <motion.div 
              key={edu._id || index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative pl-8 md:pl-12"
            >
              {/* Timeline dot */}
              <div className="absolute top-6 left-[-24px] md:top-8 w-12 h-12 bg-[#0B1120] border border-[#6b21a8] rounded-full flex items-center justify-center text-[#c084fc] shadow-[0_0_15px_rgba(168,85,247,0.15)]">
                <GraduationCap size={20} />
              </div>

              {/* Card */}
              <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 md:p-8 hover:bg-[#131b2f] transition-colors relative">
                {/* Duration */}
                <div className="inline-block px-4 py-1.5 bg-[#2d1b4e] text-[#c084fc] text-sm font-semibold rounded-full mb-4">
                  {edu.duration}
                </div>
                
                {/* Degree */}
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">{edu.degree}</h3>
                
                {/* Description (Field of Study) */}
                {edu.description && (
                  <p className="text-gray-300 font-medium text-lg mb-3">{edu.description}</p>
                )}
                
                {/* Institution */}
                <p className="text-[#00e5ff] text-base md:text-lg mb-6">{edu.institution}</p>
                
                {/* Score */}
                {edu.score && (
                  <div className="inline-flex items-center bg-[#0a0f1c] border border-white/5 rounded-xl px-4 py-2 mt-2">
                    {edu.score.includes(':') ? (
                      <p className="text-gray-400 text-sm md:text-base">
                        <span className="text-white font-bold mr-1">{edu.score.split(':')[0]}:</span> 
                        {edu.score.split(':')[1]}
                      </p>
                    ) : (
                      <p className="text-white font-bold text-sm md:text-base">{edu.score}</p>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Education;
