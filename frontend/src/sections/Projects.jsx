import { motion } from 'framer-motion';
import GlassCard from '../components/GlassCard';
import { useQuery } from "convex/react";
import { api } from "../../../backend/convex/_generated/api";

const mockProjects = [
  {
    title: 'Loading Projects...',
    description: 'Fetching real-time data from Convex DB...',
    techStack: ['React', 'Convex', 'Tailwind'],
    imageUrl: 'https://images.unsplash.com/photo-1557821552-17105176677c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    liveUrl: '#',
    githubUrl: '#'
  }
];

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.3 }
  }
};

const staggerItem = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300 } }
};

const Projects = () => {
  const projectsData = useQuery(api.projects.get);
  const projects = projectsData || mockProjects;

  return (
    <section id="projects" className="py-24 px-4 max-w-7xl mx-auto">
      {/* Fade Slide up Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-4">Featured <span className="text-primary">Projects</span></h2>
        <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary rounded-full" />
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project, index) => (
          <GlassCard key={project._id || index} className="group overflow-hidden flex flex-col h-full" delay={index * 0.15}>
            <div className="relative h-48 overflow-hidden">
              <div className="absolute inset-0 bg-primary/20 mix-blend-overlay z-10 group-hover:opacity-0 transition-opacity duration-500" />
              <img 
                src={project.imageUrl || 'https://images.unsplash.com/photo-1557821552-17105176677c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'} 
                alt={project.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
            
            <div className="p-6 flex flex-col flex-1">
              <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">{project.title}</h3>
              <p className="text-gray-400 mb-6 flex-1">{project.description}</p>
              
              {/* Stagger Fade Tags */}
              <motion.div 
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="flex flex-wrap gap-2 mb-6"
              >
                {(project.techStack || []).map((tech, i) => (
                  <motion.span 
                    variants={staggerItem}
                    key={i} 
                    className="text-xs font-medium px-2 py-1 rounded-full border border-white/10 bg-white/5 text-gray-300"
                  >
                    {tech}
                  </motion.span>
                ))}
              </motion.div>
              
              <div className="flex gap-4">
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noreferrer" className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1">
                    Live Preview <span className="text-lg">↗</span>
                  </a>
                )}
                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" rel="noreferrer" className="text-sm font-medium hover:text-secondary transition-colors flex items-center gap-1 text-gray-400">
                    Source Code <span className="text-lg">↗</span>
                  </a>
                )}
                {project.pdfUrl && (
                  <a href={project.pdfUrl} target="_blank" rel="noreferrer" className="text-sm font-medium hover:text-white transition-colors flex items-center gap-1 text-gray-500">
                    Doc <span className="text-lg">📄</span>
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

export default Projects;
