"use client"
import { Code2, Database, Globe, Bot, FolderKanban, Users, Zap, Clock, Target, CheckCircle } from 'lucide-react';
import { useState } from 'react';

const modules = [
  {
    icon: Code2,
    title: 'Python Fundamentals',
    description: 'Master variables, loops, functions & core syntax',
    color: 'from-[#306998] to-[#4B8BBE]',
    details: 'Start from absolute zero - no prior experience needed. Learn through interactive coding exercises and build your first programs.',
    benefits: ['Write your first Python program', 'Understand programming logic', 'Debug common errors confidently']
  },
  {
    icon: Database,
    title: 'Data Handling',
    description: 'Lists, dictionaries & practical data manipulation',
    color: 'from-[#4B8BBE] to-[#FFD43B]',
    details: 'Learn to store and organize data like a pro. Perfect for beginners who want to work with real-world data.',
    benefits: ['Store multiple data types', 'Access and modify data easily', 'Build data-driven applications']
  },
  {
    icon: Globe,
    title: 'Real-World Projects',
    description: 'Build practical applications from day one',
    color: 'from-[#FFD43B] to-[#FFA500]',
    details: 'Apply your skills immediately by building projects you can show to employers and add to your portfolio.',
    benefits: ['Calculator app', 'Number guessing game', 'Simple automation scripts']
  },
  {
    icon: Bot,
    title: 'Automation Basics',
    description: 'Automate boring tasks with simple scripts',
    color: 'from-[#FFA500] to-[#FF6B6B]',
    details: 'Save hours of manual work by learning how to automate repetitive tasks - the most in-demand Python skill for beginners.',
    benefits: ['File organization', 'Data entry automation', 'Email automation basics']
  },
  {
    icon: FolderKanban,
    title: 'Portfolio Building',
    description: 'Create 3+ projects for your resume',
    color: 'from-[#FF6B6B] to-[#9D4EDD]',
    details: 'By the end, you\'ll have a complete portfolio that proves your Python skills to potential employers or clients.',
    benefits: ['Complete project documentation', 'GitHub portfolio', 'Ready-to-showcase work']
  },
  {
    icon: Users,
    title: 'Community Access',
    description: 'Join our exclusive coding community',
    color: 'from-[#9D4EDD] to-[#306998]',
    details: 'Get lifetime access to our private Discord community where you can network, get help, and collaborate with other learners.',
    benefits: ['24/7 peer support', 'Expert Q&A sessions', 'Collaboration opportunities']
  },
];

export default function CourseHighlights() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="relative py-20 md:py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#030712] via-[#0a0e27] to-[#030712]"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Enhanced Header with Stronger CTA */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FFD43B]/20 to-[#FFA500]/20 border border-[#FFD43B]/30 px-4 py-2 rounded-full mb-6">
            <Zap className="w-4 h-4 text-[#FFD43B]" />
            <span className="text-[#FFD43B] font-bold text-sm">BEGINNER FRIENDLY • ZERO EXPERIENCE NEEDED</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-[#306998] via-[#4B8BBE] to-[#FFD43B] text-transparent bg-clip-text">
              From Absolute Zero to Python Hero
            </span>
          </h2>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
            Stop feeling overwhelmed by coding! Our step-by-step approach makes Python so simple, 
            <span className="text-[#FFD43B] font-semibold"> you'll be writing real programs in just 2 days</span> - guaranteed!
          </p>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-6 md:gap-12 text-gray-400 mb-8">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#FFD43B]" />
              <span>Just 1-2 hours/day</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-[#FFD43B]" />
              <span>10-Day Mastery Path</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-[#FFD43B]" />
              <span>Hands-On Projects</span>
            </div>
          </div>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 perspective-1000">
          {modules.map((module, index) => {
            const Icon = module.icon;
            const isHovered = hoveredIndex === index;

            return (
              <div
                key={index}
                className="relative group"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div
                  className={`relative h-full bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 md:p-8 transition-all duration-500 cursor-pointer ${
                    isHovered ? 'scale-105 -translate-y-2 border-[#FFD43B]/30' : 'hover:scale-102 hover:border-gray-600'
                  }`}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${module.color} opacity-5 rounded-2xl transition-opacity duration-500 ${
                      isHovered ? 'opacity-15' : ''
                    }`}
                  ></div>

                  <div className="relative z-10">
                    {/* Icon */}
                    <div
                      className={`w-14 h-14 rounded-xl bg-gradient-to-br ${module.color} flex items-center justify-center mb-6 transition-transform duration-500 ${
                        isHovered ? 'scale-110 rotate-6' : ''
                      }`}
                    >
                      <Icon className="w-7 h-7 text-white" strokeWidth={2} />
                    </div>

                    {/* Title & Description */}
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-3">{module.title}</h3>
                    <p className="text-gray-300 mb-4 font-medium">{module.description}</p>

                    {/* Expanded Details */}
                    <div
                      className={`overflow-hidden transition-all duration-500 ${
                        isHovered ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <div className="pt-4 border-t border-gray-700">
                        <p className="text-gray-300 mb-4 text-sm leading-relaxed">{module.details}</p>
                        
                        {/* Benefits List */}
                        <div className="space-y-2">
                          {module.benefits.map((benefit, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-[#FFD43B] flex-shrink-0" />
                              <span className="text-gray-300 text-sm">{benefit}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Hover Glow */}
                  <div
                    className={`absolute inset-0 rounded-2xl transition-opacity duration-500 ${
                      isHovered ? 'opacity-100' : 'opacity-0'
                    }`}
                    style={{
                      boxShadow: `0 0 40px rgba(48, 105, 152, 0.3), 0 0 80px rgba(255, 212, 59, 0.1)`,
                    }}
                  ></div>
                </div>

                {/* Outer Glow */}
                <div
                  className="absolute -inset-4 blur-xl opacity-0 transition-opacity duration-500 -z-10"
                  style={{
                    background: `linear-gradient(to bottom right, ${module.color})`,
                    opacity: isHovered ? 0.1 : 0,
                  }}
                ></div>
              </div>
            );
          })}
        </div>

        {/* Strong Bottom CTA - Hidden on Mobile
        <div className="mt-16 text-center hidden md:block">
          <div className="bg-gradient-to-r from-[#306998]/20 to-[#FFD43B]/20 backdrop-blur-sm border border-[#FFD43B]/20 rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              🚀 Start Your Coding Journey Today!
            </h3>
            <p className="text-gray-300 text-lg mb-6 max-w-2xl mx-auto">
              Join <span className="text-[#FFD43B] font-bold">10,000+ beginners</span> who transformed from complete beginners to confident Python developers in just 10 days.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="px-8 py-4 bg-gradient-to-r from-[#FFD43B] to-[#FFA500] rounded-2xl font-bold text-gray-900 text-lg hover:scale-105 transition-transform duration-300 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Enroll Now - Limited Seats
              </button>
            </div>
          </div>
        </div> */}
      </div>
    </section>
  );
}