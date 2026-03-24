import { motion } from 'framer-motion';
import GlassCard from '../components/GlassCard';
import { useQuery } from "convex/react";
import { api } from "../../../backend/convex/_generated/api";

const mockCertificates = [{ title: 'Loading...', issuer: '...', date: '...', link: '#' }];

const Certificates = () => {
  const certificatesData = useQuery(api.certificates.get);
  const certificates = certificatesData || mockCertificates;

  return (
    <section id="certificates" className="py-24 px-4 max-w-7xl mx-auto relative">
      <div className="absolute top-0 left-[-10%] w-[400px] h-[400px] bg-primary/10 rounded-full blur-[120px] -z-10 mix-blend-screen" />

      {/* Fade Slide Up Header */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-4">Certificates<span className="text-primary"></span></h2>
        <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary rounded-full" />
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {certificates.map((cert, index) => (
          <GlassCard key={cert._id || index} className="p-0 group overflow-hidden flex flex-col cursor-pointer hover:shadow-[0_0_30px_rgba(109,40,217,0.3)] transition-shadow duration-300" delay={index * 0.1}>
            <a href={cert.pdfUrl || cert.imageUrl || "#"} target="_blank" download rel="noreferrer" className="block w-full h-48 relative overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10">
              {cert.imageUrl ? (
                <img src={cert.imageUrl} alt={cert.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <span className="text-5xl mb-2">🎓</span>
                  <span className="text-sm font-medium text-gray-300">Certificate</span>
                </div>
              )}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                <span className="bg-primary/80 hover:bg-primary px-4 py-2 rounded-lg text-white font-medium flex items-center gap-2 transition-colors">
                  {cert.pdfUrl ? 'View PDF' : 'View Image'} <span className="text-lg">📄</span>
                </span>
              </div>
            </a>
            
            <div className="p-6 flex flex-col flex-1 relative z-10 bg-black/40">
              <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">{cert.title}</h3>
              <p className="text-gray-400 mb-6">{cert.issuer}</p>
              
              <div className="mt-auto flex justify-between items-center">
                <span className="text-sm text-gray-400 font-medium bg-white/5 border border-white/10 px-3 py-1 rounded-md">{cert.date}</span>
                
                {cert.link && cert.link !== '#' && (
                  <a href={cert.link} target="_blank" rel="noreferrer" className="text-primary hover:text-white transition-colors text-sm font-medium flex items-center gap-1 z-20 relative pointer-events-auto bg-primary/10 px-3 py-1 rounded hover:bg-primary/30">
                    Verify <span className="text-lg">↗</span>
                  </a>
                )}
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </section>
  );
};

export default Certificates;
