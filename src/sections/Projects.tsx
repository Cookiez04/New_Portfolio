import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github, Play, Smartphone, Globe, Code, Star } from 'lucide-react';

const Projects: React.FC = () => {
  const projects = [
    {
      id: 1,
      title: 'Kira by Kiezz',
      subtitle: 'Personal Finance Manager',
      description: 'A comprehensive financial management application that helps users track expenses, set budgets, and achieve financial goals with an intuitive and modern interface.',
      longDescription: 'Kira is a personal finance management tool built with React and Supabase, designed to help users take control of their financial life through expense tracking, budget planning, and goal setting.',
      image: '/kira-project.png',
      technologies: ['React', 'Supabase', 'Tailwind CSS', 'TypeScript', 'Vercel'],
      features: [
        'Real-time expense tracking',
        'Budget planning and monitoring',
        'Financial goal setting',
        'Interactive charts and analytics',
        'Secure user authentication',
        'Responsive design for all devices'
      ],
      highlights: [
        'Built with React 18 and modern web technologies',
        'Integrated Supabase for real-time data management',
        'Deployed on Vercel with continuous integration'
      ],
      status: 'Live',
      progress: 95,
      demoUrl: 'https://kira-by-kiezz.vercel.app/',
      githubUrl: 'https://github.com/Cookiez04/Kira-by-Kiezz',
      category: 'Web Application'
    },
    {
      id: 2,
      title: 'Solaris',
      subtitle: 'Interactive Solar System Explorer',
      description: 'An interactive 3D solar system simulation built with Three.js, featuring realistic planetary movements, detailed textures, and educational information about celestial bodies.',
      longDescription: 'Solaris is a 3D visualization project that brings the solar system to life in the browser, combining educational content with immersive 3D graphics to create an engaging learning experience.',
      image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=3D%20solar%20system%20visualization%20planets%20orbiting%20sun%20space%20background%20realistic%20textures%20educational%20interface&image_size=landscape_16_9',
      technologies: ['Three.js', 'JavaScript', 'WebGL', 'HTML5', 'CSS3'],
      features: [
        'Realistic planetary orbits and rotations',
        'Interactive camera controls',
        'Detailed planet information panels',
        'Accurate scale and distance ratios',
        'Educational content integration',
        'Smooth 3D animations'
      ],
      highlights: [
        'Built complex 3D visualization system with Three.js',
        'Implemented WebGL-based rendering pipeline',
        'Created educational astronomy content with interactive features'
      ],
      status: 'Live',
      progress: 85,
      demoUrl: 'https://cookiez04.github.io/Solaris/',
      githubUrl: 'https://github.com/Cookiez04/Solaris',
      category: '3D Visualization'
    },
    {
      id: 3,
      title: 'Retro Desktop',
      subtitle: 'Nostalgic Computing Experience',
      description: 'A web-based retro desktop environment that recreates the classic computing experience with modern web technologies. Features include a working file system, retro applications, and nostalgic UI elements.',
      longDescription: 'Retro Desktop is a nostalgic recreation of classic operating systems, built entirely with vanilla web technologies to provide an authentic retro computing experience in the browser.',
      image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=retro%20computer%20desktop%20interface%20vintage%20windows%20classic%20icons%20nostalgic%20UI%20pixelated%20graphics&image_size=landscape_16_9',
      technologies: ['HTML5', 'CSS3', 'JavaScript', 'Local Storage'],
      features: [
        'Interactive desktop environment',
        'Retro-styled applications and games',
        'File system simulation',
        'Nostalgic sound effects and animations',
        'Responsive design for modern devices',
        'Authentic vintage aesthetics'
      ],
      highlights: [
        'Built entirely with vanilla JavaScript and web APIs',
        'Implemented custom window management system',
        'Created authentic retro computing experience'
      ],
      status: 'Live',
      progress: 80,
      demoUrl: 'https://retro-desktop-resume-thingy-idk-what-to-name-this-thing.vercel.app/',
      githubUrl: 'https://github.com/Cookiez04/retro-desktop',
      category: 'Interactive Experience'
    },
    {
      id: 4,
      title: 'Langton\'s Ant',
      subtitle: 'Cellular Automaton Simulation',
      description: 'An interactive implementation of Langton\'s Ant, a two-dimensional universal Turing machine with emergent behavior. Watch as simple rules create complex, unpredictable patterns.',
      longDescription: 'This project demonstrates the fascinating world of cellular automata through Langton\'s Ant algorithm, showcasing how simple mathematical rules can generate complex and beautiful patterns.',
      image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=cellular%20automaton%20grid%20pattern%20black%20white%20squares%20mathematical%20visualization%20algorithmic%20art&image_size=landscape_16_9',
      technologies: ['JavaScript', 'HTML5 Canvas', 'CSS3'],
      features: [
        'Real-time cellular automaton simulation',
        'Interactive controls for speed and reset',
        'Pattern analysis and statistics',
        'Responsive canvas rendering',
        'Educational information about the algorithm',
        'Smooth animation performance'
      ],
      highlights: [
        'Implemented using pure JavaScript and Canvas API',
        'Demonstrates mathematical concepts through visualization',
        'Features smooth real-time animation and user controls'
      ],
      status: 'Live',
      progress: 80,
      demoUrl: 'https://langtons-ant-kiezzy.vercel.app/',
      githubUrl: 'https://github.com/Cookiez04/Langtons-Ant',
      category: 'Algorithm Visualization'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Live':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'In Development':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getCategoryIcon = (category: string) => {
    if (category.includes('AI')) return <Code className="w-4 h-4" />;
    if (category.includes('WebGL')) return <Globe className="w-4 h-4" />;
    if (category.includes('UI/UX')) return <Smartphone className="w-4 h-4" />;
    return <Code className="w-4 h-4" />;
  };

  return (
    <section id="projects" className="section-padding">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-pink-500 to-red-500 mx-auto mb-8" />
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            A showcase of my passion projects, experiments, and professional work. 
            Each project represents a unique challenge and learning experience.
          </p>
        </motion.div>

        <div className="grid gap-12">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className={`grid lg:grid-cols-2 gap-8 items-center ${
                index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
              }`}
            >
              {/* Project Image */}
              <div className={`${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  className="relative group overflow-hidden rounded-lg glow-pink"
                >
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-64 md:h-80 object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>
                      {project.status}
                    </span>
                  </div>
                </motion.div>
              </div>

              {/* Project Details */}
              <div className={`${index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
                <div className="flex items-center gap-2 mb-3">
                  {getCategoryIcon(project.category)}
                  <span className="text-pink-500 text-sm font-medium">{project.category}</span>
                </div>
                
                <h3 className="text-3xl font-bold mb-2">{project.title}</h3>
                <p className="text-xl text-pink-400 mb-4">{project.subtitle}</p>
                <p className="text-gray-300 mb-6 leading-relaxed">{project.description}</p>

                {/* Technologies */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-400 mb-3">TECHNOLOGIES</h4>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="text-xs bg-gray-800 text-gray-300 px-3 py-1 rounded-full border border-gray-700 font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Project Status and Progress */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      project.status === 'Live' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {project.status}
                    </span>
                    <span className="text-sm text-gray-400">{project.progress}% Complete</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                {/* Key Features */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-400 mb-3">KEY FEATURES</h4>
                  <ul className="space-y-2">
                    {project.features.slice(0, 4).map((feature, idx) => (
                      <li key={idx} className="text-gray-300 text-sm flex items-center">
                        <div className="w-1.5 h-1.5 bg-pink-500 rounded-full mr-3" />
                        {feature}
                      </li>
                    ))}
                    {project.features.length > 4 && (
                      <li className="text-sm text-gray-400 italic">
                        +{project.features.length - 4} more features...
                      </li>
                    )}
                  </ul>
                </div>

                {/* Project Highlights */}
                {project.highlights && (
                  <div className="mb-8">
                    <h4 className="text-sm font-semibold text-pink-400 mb-2">Key Achievements</h4>
                    <ul className="space-y-1">
                      {project.highlights.map((highlight, index) => (
                        <li key={index} className="flex items-start gap-2 text-gray-300">
                          <Star className="w-3 h-3 text-yellow-400 mt-1 flex-shrink-0" />
                          <span className="text-xs">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4">
                  {project.status === 'Live' && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary flex items-center gap-2"
                    >
                      <Play className="w-4 h-4" />
                      Live Demo
                    </a>
                  )}
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary flex items-center gap-2"
                  >
                    <Github className="w-4 h-4" />
                    View Code
                  </a>
                  <a
                    href="#contact"
                    className="text-gray-400 hover:text-pink-500 transition-colors flex items-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Learn More
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Projects Teaser */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-20"
        >
          <div className="glass-effect p-8 rounded-lg">
            <h3 className="text-2xl font-bold mb-4">More Projects Coming Soon</h3>
            <p className="text-gray-400 mb-6">
              I'm constantly working on new projects and experiments. 
              Check out my GitHub for the latest updates and contributions.
            </p>
            <a
              href="https://github.com/Cookiez04?tab=repositories"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary inline-flex items-center gap-2"
            >
              <Github className="w-4 h-4" />
              View All Projects
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;