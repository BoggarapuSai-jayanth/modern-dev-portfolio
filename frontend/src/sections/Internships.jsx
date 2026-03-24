import { motion } from 'framer-motion';
import GlassCard from '../components/GlassCard';
import { useQuery } from "convex/react";
import { api } from "../../../backend/convex/_generated/api";

const mockInternships = [{ role: 'Loading Internships', company: 'Connecting to DB', duration: '...', description: '...' }];

const Internships = () => {
  const internshipsData = useQuery(api.internships.get);
  const internships = internshipsData || mockInternships;

  // Make the section optional: hide completely if there are no internships in the database
  if (internshipsData !== undefined && internshipsData.length === 0) return null;

  return (
    <section id="internships" className="py-24 px-4 max-w-7xl mx-auto relative">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="mb-16 text-right"
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-4">Past <span className="text-secondary">Internships</span></h2>
        <div className="w-20 h-1 bg-gradient-to-r from-secondary to-primary rounded-full ml-auto" />
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {internships.map((intern, index) => (
          <div key={intern._id || index} className="group w-full h-[320px] [perspective:1000px]">
             {/* Flip Card Container */}
             <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               transition={{ duration: 0.5, delay: index * 0.1 }}
               className="relative w-full h-full [transform-style:preserve-3d] transition-transform duration-700 ease-in-out group-hover:[transform:rotateY(180deg)]"
             >
                {/* Front Side */}
                <div className="absolute inset-0 backface-hidden [backface-visibility:hidden]">
                  <GlassCard enableSkew={false} className="w-full h-full flex flex-col justify-center items-center text-center p-6 overflow-hidden">
                    {intern.imageUrl ? (
                      <div className="w-full h-28 rounded-xl overflow-hidden mb-4 border border-white/10">
                        <img src={intern.imageUrl} alt={intern.company} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mb-4">
                        <span className="text-3xl">💼</span>
                      </div>
                    )}
                    <h3 className="text-xl font-bold text-white mb-1">{intern.role}</h3>
                    <h4 className="text-secondary font-medium text-sm">{intern.company}</h4>
                    <span className="text-xs text-gray-500 font-medium mt-auto">{intern.duration}</span>
                  </GlassCard>
                </div>

                {/* Back Side */}
                <div className="absolute inset-0 backface-hidden [backface-visibility:hidden] [transform:rotateY(180deg)]">
                  <GlassCard enableSkew={false} className="w-full h-full flex flex-col justify-center items-center text-center p-8 bg-black/60 border-secondary/30">
                    <p className="text-sm text-gray-300 leading-relaxed overflow-y-auto custom-scrollbar flex-1">
                      {intern.description}
                    </p>
                    <span className="mt-4 text-xs bg-white/10 px-4 py-2 rounded-full font-medium inline-block text-white">
                       {intern.duration}
                    </span>
                    {intern.pdfUrl && (
                      <a
                        href={intern.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="mt-3 text-sm text-secondary hover:text-white transition-colors underline bg-secondary/10 px-3 py-1 rounded-full"
                      >
                        View Certificate
                      </a>
                    )}
                  </GlassCard>
                </div>
             </motion.div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Internships;

