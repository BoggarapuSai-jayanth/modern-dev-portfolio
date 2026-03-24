import { motion } from 'framer-motion';
import GlassCard from '../components/GlassCard';
import { useQuery } from "convex/react";
import { api } from "../../../backend/convex/_generated/api";

const mockTraining = [{ title: 'Loading...', provider: '...', duration: '...', description: '...' }];

const Training = () => {
  const trainingData = useQuery(api.training.get);
  const trainingList = trainingData || mockTraining;

  return (
    <section id="training" className="py-24 px-4 max-w-7xl mx-auto relative">
      <div className="absolute top-1/2 right-[-10%] w-[300px] h-[300px] bg-primary/10 rounded-full blur-[100px] -z-10 mix-blend-screen" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-4">Professional <span className="text-primary">Training</span></h2>
        <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary rounded-full" />
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {trainingList.map((item, index) => (
          <GlassCard key={item._id || index} className="p-8" delay={index * 0.1}>
            <div className="flex flex-col h-full">
              {item.imageUrl && (
                <div className="mb-6 rounded-lg overflow-hidden h-40 border border-white/10">
                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                </div>
              )}
              <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
              <h4 className="text-lg text-primary font-medium mb-4">{item.provider}</h4>
              <p className="text-gray-300 mb-6 flex-1">{item.description}</p>
              <div className="mt-auto flex items-center justify-between">
                <span className="text-xs font-medium px-3 py-1 rounded bg-white/10 text-gray-300">
                  {item.duration}
                </span>
                {item.pdfUrl && (
                  <a href={item.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-secondary hover:text-white transition-colors underline bg-secondary/10 px-3 py-1 rounded-full">
                    View Certificate
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

export default Training;
