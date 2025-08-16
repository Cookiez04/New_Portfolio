import React from 'react';
import { motion } from 'framer-motion';
import { Code, Database, Globe, Smartphone, Server, GitBranch, Monitor, Settings, Palette, Box, Zap, Cloud, Container } from 'lucide-react';

const About: React.FC = () => {
  const skillCategories = {
    'Frontend': [
      { name: 'React', icon: <Code className="w-4 h-4" />, level: 5, color: 'text-blue-400' },
      { name: 'TypeScript', icon: <Code className="w-4 h-4" />, level: 3, color: 'text-blue-600' },
      { name: 'Next.js', icon: <Code className="w-4 h-4" />, level: 4, color: 'text-gray-400' },
      { name: 'Tailwind CSS', icon: <Palette className="w-4 h-4" />, level: 5, color: 'text-cyan-400' },
      { name: 'Three.js', icon: <Box className="w-4 h-4" />, level: 3, color: 'text-green-400' }
    ],
    'Backend': [
      { name: 'Node.js', icon: <Server className="w-4 h-4" />, level: 4, color: 'text-green-500' },
      { name: 'Python', icon: <Zap className="w-4 h-4" />, level: 4, color: 'text-yellow-400' },
      { name: 'PHP', icon: <Server className="w-4 h-4" />, level: 3, color: 'text-purple-400' }
    ],
    'Database': [
      { name: 'PostgreSQL', icon: <Database className="w-4 h-4" />, level: 4, color: 'text-blue-500' },
      { name: 'Supabase', icon: <Database className="w-4 h-4" />, level: 4, color: 'text-emerald-400' }
    ],
    'Tools & DevOps': [
      { name: 'Git', icon: <GitBranch className="w-4 h-4" />, level: 5, color: 'text-orange-500' },
      { name: 'Vercel', icon: <Cloud className="w-4 h-4" />, level: 4, color: 'text-gray-400' }
    ],
    'Languages': [
      { name: 'JavaScript', icon: <Code className="w-4 h-4" />, level: 5, color: 'text-yellow-400' },
      { name: 'TypeScript', icon: <Code className="w-4 h-4" />, level: 3, color: 'text-blue-600' },
      { name: 'Python', icon: <Code className="w-4 h-4" />, level: 4, color: 'text-yellow-400' },
      { name: 'C++', icon: <Code className="w-4 h-4" />, level: 1, color: 'text-blue-500' }
    ]
  };

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: JSX.Element } = {
      'Frontend': <Monitor className="w-5 h-5" />,
      'Backend': <Server className="w-5 h-5" />,
      'Database': <Database className="w-5 h-5" />,
      'Tools & DevOps': <Settings className="w-5 h-5" />,
      'Languages': <Code className="w-5 h-5" />
    };
    return icons[category] || <Code className="w-5 h-5" />;
  };

  const experience = [
    {
      title: 'Student at UiTM Jasin',
      company: 'Universiti Teknologi MARA (UiTM) Jasin',
      period: 'October 2022 until February 2025',
      description: 'Pursuing Diploma in Computer Science with focus on software development and programming fundamentals.',
      highlights: ['Strong academic performance', 'Active participation in programming projects', 'Developed foundational skills in multiple programming languages']
    },
    {
      title: 'Internship at UTeM',
      company: 'Universiti Teknikal Malaysia Melaka (UTeM)',
      period: 'October 2024 until February 2025',
      description: 'Gained practical experience in software development and university system maintenance.',
      highlights: ['Hands-on experience with real-world projects', 'Collaborated with development teams', 'Applied academic knowledge in professional environment']
    },
    {
      title: 'Unemployed/Self-Employed',
      company: 'Freelance Work',
      period: 'February 2025 until July 2025',
      description: 'Focused on commissions, DataAnnotation, and Outlier projects while seeking full-time opportunities.',
      highlights: ['Completed various freelance projects', 'Gained experience in data annotation', 'Maintained technical skills through continuous learning']
    },
    {
      title: 'Junior Programmer at UTeM',
      company: 'Universiti Teknikal Malaysia Melaka (UTeM)',
      period: 'July 2025 until present',
      description: 'Working with ASP.NET for university system development and maintenance.',
      highlights: ['Developing university management systems', 'Working with ASP.NET framework', 'Contributing to institutional technology infrastructure']
    }
  ];

  return (
    <section id="about" className="section-padding bg-gray-900/50">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            About <span className="gradient-text">Me</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-pink-500 to-red-500 mx-auto mb-8" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Bio Section */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >          
            <h3 className="text-2xl font-bold mb-6 text-pink-500">Who I Am</h3>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                Hey there! I'm Ahmad Zuhairy, but most people know me as <span className="text-pink-500 font-semibold">Kiezz</span>. 
                I'm a Computer Science student at UTeM who's passionate about turning 
                complex problems into elegant solutions. I love building things that 
                work beautifully and occasionally make people go "wait, how did you do that?"
              </motion.p>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
              >
                When I'm not wrestling with code, you'll find me exploring the latest 
                tech trends, contributing to open source projects, or probably making 
                terrible programming jokes that only other developers appreciate. 
                I believe the best code is not just functional, but also tells a story.
              </motion.p>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
              >
                My journey in tech started with curiosity and evolved into a deep love for creating digital experiences 
                that matter. I specialize in modern web technologies, with a particular fondness for React, Next.js, 
                and the endless possibilities of Three.js for creating immersive web experiences.
              </motion.p>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                viewport={{ once: true }}
              >
                I'm always excited about new challenges and love collaborating with fellow developers to build 
                something amazing. Let's create the future, one line of code at a time! 🚀
              </motion.p>
            </div>

            {/* Cookie Mascot */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="flex justify-center mb-8"
            >
              <div className="relative w-64 h-64 group">
                <img 
                  src="/src/assets/Mascot/Whisk_cd93094613 - Edited.png" 
                  alt="Kiezz Cookie Mascot" 
                  className="w-64 h-64 object-contain hover:scale-110 transition-all duration-300 group-hover:opacity-0"
                />
                <img 
                  src="/src/assets/Mascot/shocked_hover.png" 
                  alt="Shocked Kiezz Cookie Mascot" 
                  className="absolute top-0 left-0 w-64 h-64 object-contain hover:scale-110 transition-all duration-300 opacity-0 group-hover:opacity-100"
                />
              </div>
            </motion.div>
          </motion.div>

          {/* Skills Grid */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold mb-6 text-pink-500">Skills & Technologies</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(skillCategories).map(([category, categorySkills], categoryIndex) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * categoryIndex }}
                  viewport={{ once: true }}
                  className="glass-effect p-6 rounded-lg"
                >
                  <h4 className="text-xl font-semibold text-pink-500 mb-4 flex items-center gap-2">
                    {getCategoryIcon(category)}
                    {category}
                  </h4>
                  <div className="space-y-3">
                    {categorySkills.map((skill, skillIndex) => (
                      <motion.div
                        key={skill.name}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.05 * skillIndex }}
                        viewport={{ once: true }}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <span className={`text-lg ${skill.color}`}>{skill.icon}</span>
                          <span className="text-gray-300">{skill.name}</span>
                        </div>
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className={`w-2 h-2 rounded-full ${
                                i < skill.level ? 'bg-pink-500' : 'bg-gray-600'
                              }`}
                            />
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Professional Experience */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <h3 className="text-2xl font-bold mb-8 text-center text-pink-500">Professional Experience</h3>
          <div className="space-y-8">
            {experience.map((exp, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="glass-effect p-6 rounded-lg"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <h4 className="text-xl font-bold text-white">{exp.title}</h4>
                    <p className="text-pink-500 font-medium">{exp.company}</p>
                  </div>
                  <span className="text-gray-400 font-mono text-sm">{exp.period}</span>
                </div>
                <p className="text-gray-300 mb-4">{exp.description}</p>
                <div className="flex flex-wrap gap-2">
                  {exp.highlights.map((highlight) => (
                    <span
                      key={highlight}
                      className="text-xs bg-gray-700 text-gray-300 px-3 py-1 rounded-full"
                    >
                      {highlight}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;