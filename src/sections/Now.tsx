import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, MapPin, Code, Search, GitCommit, Gamepad2, Bug, Calendar, Activity } from 'lucide-react';

interface NowData {
  currentTime: string;
  location: string;
  status: string;
  currentActivity: string;
  mood: string;
  bugsCreated: number;
  bugsFixed: number;
  currentlyGoogling: string;
  commitsThisWeek: number;
  recentProjects: string[];
  lastUpdated: string;
}

const Now: React.FC = () => {
  const funnySearches = [
    'why my code not working',
    'how to center a div',
    'is it a feature or a bug',
    'javascript why are you like this',
    'css position absolute vs relative again',
    'git how to undo everything',
    'stackoverflow copy paste best practices',
    'why does this work in chrome but not firefox',
    'how to explain to client that bug is actually feature',
    'typescript error makes no sense help'
  ];

  const [nowData, setNowData] = useState<NowData>({
    currentTime: '',
    location: 'Melaka, Malaysia',
    status: 'Building something cool',
    currentActivity: 'Coding this portfolio',
    mood: '🚀 Motivated',
    bugsCreated: Math.floor(Math.random() * 20) + 15, // 15-34
    bugsFixed: 0, // Will be set to always be lower
    currentlyGoogling: funnySearches[Math.floor(Math.random() * funnySearches.length)],
    commitsThisWeek: 42, // Placeholder for GitHub API
    recentProjects: [
      'Kiezz Portfolio v2.0',
      'AI Task Manager (Kira)',
      'Solar System Visualization'
    ],
    lastUpdated: ''
  });

  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const malaysiaTime = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Kuala_Lumpur',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }).format(now);
      
      const lastUpdated = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Kuala_Lumpur',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(now);

      setNowData(prev => ({
        ...prev,
        currentTime: malaysiaTime,
        lastUpdated
      }));
    };

    // Initialize random data on component mount
    const initializeData = () => {
      const bugsCreated = Math.floor(Math.random() * 20) + 15; // 15-34
      const bugsFixed = Math.floor(bugsCreated * 0.6) + Math.floor(Math.random() * 5); // Always lower
      const currentSearch = funnySearches[Math.floor(Math.random() * funnySearches.length)];
      
      setNowData(prev => ({
        ...prev,
        bugsCreated,
        bugsFixed,
        currentlyGoogling: currentSearch
      }));
    };

    updateTime();
    initializeData();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  const statusCards = [
    {
      icon: <Clock className="w-5 h-5" />,
      label: 'Local Time',
      value: nowData.currentTime,
      subtext: 'Melaka (GMT+8)',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      label: 'Location',
      value: nowData.location,
      subtext: 'Home base',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: <Activity className="w-5 h-5" />,
      label: 'Status',
      value: nowData.status,
      subtext: nowData.mood,
      color: 'from-pink-500 to-rose-500'
    },
    {
      icon: <Code className="w-5 h-5" />,
      label: 'Current Focus',
      value: nowData.currentActivity,
      subtext: 'Deep work mode',
      color: 'from-purple-500 to-indigo-500'
    }
  ];

  return (
    <section id="now" className="section-padding bg-gradient-to-b from-gray-900 to-black">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className={`w-3 h-3 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
            <h2 className="text-4xl md:text-6xl font-bold">
              Now <span className="gradient-text">Live</span>
            </h2>
          </div>
          <div className="w-24 h-1 bg-gradient-to-r from-pink-500 to-red-500 mx-auto mb-8" />
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Real-time glimpse into what I'm currently working on, listening to, and thinking about. 
            Updated automatically because transparency is cool.
          </p>
        </motion.div>

        {/* Status Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {statusCards.map((card, index) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="glass-effect p-6 rounded-lg relative overflow-hidden group"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
              
              <div className={`text-transparent bg-gradient-to-r ${card.color} bg-clip-text mb-3`}>
                {card.icon}
              </div>
              
              <h3 className="text-sm font-medium text-gray-400 mb-2">{card.label}</h3>
              <p className="text-lg font-bold text-white mb-1">{card.value}</p>
              <p className="text-sm text-gray-500">{card.subtext}</p>
            </motion.div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Bugs Created vs Fixed */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <div className="glass-effect p-8 rounded-lg">
              <div className="flex items-center gap-3 mb-6">
                <Bug className="w-6 h-6 text-red-500" />
                <h3 className="text-2xl font-bold">Bugs Created vs. Bugs Fixed</h3>
                <span className="text-2xl">😂</span>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Bug className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-lg font-bold mb-2 text-red-400">Bugs Created</h4>
                  <div className="text-4xl font-bold text-red-500 mb-2">{nowData.bugsCreated}</div>
                  <p className="text-gray-400 text-sm">This week</p>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Code className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-lg font-bold mb-2 text-green-400">Bugs Fixed</h4>
                  <div className="text-4xl font-bold text-green-500 mb-2">{nowData.bugsFixed}</div>
                  <p className="text-gray-400 text-sm">This week</p>
                </div>
              </div>

            </div>
          </motion.div>

          {/* Currently Googling */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="glass-effect p-8 rounded-lg text-center">
              <Search className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-4">Currently Googling</h3>
              <div className="bg-gray-800 rounded-lg p-4 mb-4">
                <p className="text-lg text-gray-300 italic">
                  "{nowData.currentlyGoogling}"
                </p>
              </div>

              <div className="mt-4 flex justify-center gap-1">
                {Array.from({ length: 3 }, (_, i) => (
                  <div
                    key={i}
                    className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Recent Projects & Reading */}
        <div className="grid md:grid-cols-2 gap-8 mt-8">
          {/* Recent Projects */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="glass-effect p-8 rounded-lg">
              <div className="flex items-center gap-3 mb-6">
                <Gamepad2 className="w-6 h-6 text-green-500" />
                <h3 className="text-2xl font-bold">Recent Projects</h3>
              </div>
              <div className="space-y-4">
                {nowData.recentProjects.map((project, index) => (
                  <motion.div
                    key={project}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors"
                  >
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-gray-300">{project}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Commits This Week */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="glass-effect p-8 rounded-lg text-center">
              <div className="flex items-center justify-center gap-3 mb-6">
                <GitCommit className="w-6 h-6 text-green-500" />
                <h3 className="text-2xl font-bold">Commits This Week</h3>
              </div>
              <div className="flex items-center justify-center gap-4">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <GitCommit className="w-8 h-8 text-white" />
                </div>
                <div>
                  <div className="text-4xl font-bold text-green-500 mb-2">{nowData.commitsThisWeek}</div>

                  <div className="flex gap-1 mt-2 justify-center">
                    {Array.from({ length: 7 }, (_, i) => (
                      <div
                        key={i}
                        className={`w-3 h-3 rounded-sm ${
                          i < 5 ? 'bg-green-500' : 'bg-gray-600'
                        }`}
                        title={`Day ${i + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Last Updated */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
            <Calendar className="w-4 h-4" />
            <span>Last updated: {nowData.lastUpdated}</span>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse ml-2" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Now;