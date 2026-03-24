import { motion } from 'framer-motion';
import { useQuery } from "convex/react";
import { api } from "../../../backend/convex/_generated/api";

const mockSkills = [
  { name: 'React', category: 'Frontend' },
  { name: 'Node.js', category: 'Backend' },
  { name: 'Loading...', category: 'Tools' },
];

const tagVariants = {
  hidden: { opacity: 0, scale: 0.7, y: 10 },
  visible: (i) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.35, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }
  })
};

const groupByCategory = (skills) =>
  skills.reduce((acc, skill) => {
    const cat = skill.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

const Skills = () => {
  const skillsData = useQuery(api.skills.get);
  const skills = skillsData || mockSkills;
  const grouped = groupByCategory(skills);

  return (
    <section id="skills" className="py-24 px-4 max-w-7xl mx-auto relative">
      <div className="absolute top-1/2 left-[-10%] w-[300px] h-[300px] bg-primary/10 rounded-full blur-[100px] -z-10 mix-blend-screen" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-16 text-right"
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-4">Technical <span className="text-secondary">Skills</span></h2>
        <div className="w-20 h-1 bg-gradient-to-r from-secondary to-primary rounded-full ml-auto" />
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Object.entries(grouped).map(([category, catSkills], catIndex) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: catIndex * 0.1 }}
            whileHover={{ 
              y: -6,
              boxShadow: '0 20px 50px rgba(109,40,217,0.25)',
              borderColor: 'rgba(168,85,247,0.5)'
            }}
            className="relative glass rounded-2xl border border-white/10 p-6 transition-all duration-300 group"
          >
            {/* Category title */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(168,85,247,0.8)] group-hover:scale-150 transition-transform duration-300" />
              <h3 className="text-base font-bold text-white uppercase tracking-widest">{category}</h3>
            </div>

            {/* Floating skill tags */}
            <div className="flex flex-wrap gap-2">
              {catSkills.map((skill, idx) => (
                <motion.span
                  key={skill._id || idx}
                  custom={idx}
                  variants={tagVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.1, backgroundColor: 'rgba(168,85,247,0.3)' }}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium bg-white/5 border border-white/10 text-gray-200 cursor-default transition-colors"
                >
                  {skill.name}
                </motion.span>
              ))}
            </div>

            {/* Subtle glow that shows on card hover */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Skills;
