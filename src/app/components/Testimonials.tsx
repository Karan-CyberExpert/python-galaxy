"use client"
import { useState, useEffect } from 'react';
import { Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Ananya Verma',
    role: 'Student',
    avatar: 'AV',
    text: 'This was my first time learning to code, and I loved it! The teachers explained everything so simply. I even made my first calculator project in Python! Now I actually enjoy coding.',
    color: 'from-[#306998] to-[#4B8BBE]',
  },
  {
    name: 'Aarav Gupta',
    role: 'Student',
    avatar: 'AG',
    text: 'The workshop was so much fun! I never thought programming could be this interesting. The best part was when we made small games using Python. It felt like magic when the code finally worked!',
    color: 'from-[#FFD43B] to-[#FFA500]',
  },
  {
    name: 'Sneha Pandey',
    role: 'Student',
    avatar: 'SP',
    text: 'I joined just out of curiosity, but now Python has become my favorite subject. The mentors were very kind and helped us whenever we got stuck. I can’t wait for the next level workshop!',
    color: 'from-[#4B8BBE] to-[#FFD43B]',
  },
  {
    name: 'Advait Singh',
    role: 'Student',
    avatar: 'AS',
    text: 'I liked how the workshop was practical and not just theory. Every day we learned something new — loops, conditions, lists — and then used it to make cool programs. I feel proud that I can code now.',
    color: 'from-[#FFA500] to-[#FF6B6B]',
  },
  {
    name: 'Meera Nair',
    role: 'Student',
    avatar: 'MN',
    text: 'These 10 days changed how I look at computers. Earlier I only used them for games or school work, but now I understand how apps are made. The teachers made Python super easy to learn!',
    color: 'from-[#FF6B6B] to-[#9D4EDD]',
  },
];

export default function Testimonials() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleAvatarClick = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const handleAvatarInteraction = (index: number) => {
    setHoveredIndex(index);
  };

  const handleAvatarLeave = () => {
    setHoveredIndex(null);
  };

  return (
    <section className="relative py-12 md:py-24 overflow-hidden" aria-labelledby="testimonials-heading">
      <div className="absolute inset-0 bg-gradient-to-b from-[#030712] via-[#1e1b4b] to-[#030712]"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 id="testimonials-heading" className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6">
            <span className="bg-gradient-to-r from-[#FFD43B] to-[#306998] text-transparent bg-clip-text">
              Meet Our Python Wizards
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto px-4">
            Hear from students who mastered Python magic
          </p>
        </div>

        {/* Mobile Orbit Layout */}
        <div className="lg:hidden relative h-[300px] sm:h-[400px] flex items-center justify-center">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-64 sm:h-64 rounded-full bg-gradient-to-br from-[#306998]/20 to-[#FFD43B]/20 blur-2xl"></div>

          <div className="relative w-full h-full max-w-md mx-auto">
            {testimonials.map((testimonial, index) => {
              const isActive = activeIndex === index;

              return (
                <div
                  key={index}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                  style={{
                    animation: `mobileOrbit ${20 + index * 2}s linear infinite`,
                    animationDelay: `${-index * 4}s`,
                  }}
                >
                  <div
                    className={`relative transition-all duration-500 ${
                      isActive ? 'scale-125 z-[100]' : 'scale-100 z-10'
                    }`}
                  >
                    <button
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br ${testimonial.color} flex items-center justify-center cursor-pointer transition-all duration-300 ${
                        isActive ? 'ring-3 ring-white/50' : ''
                      }`}
                      onClick={() => handleAvatarClick(index)}
                      aria-label={`Read testimonial from ${testimonial.name}`}
                      aria-expanded={isActive}
                    >
                      <span className="text-white font-bold text-sm sm:text-base">
                        {testimonial.avatar}
                      </span>
                    </button>

                    {isActive && (
                      <div
                        className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-64 sm:w-72 glass-dark rounded-2xl p-4 animate-float z-[1000]"
                        style={{
                          animationDuration: '3s',
                        }}
                        role="dialog"
                        aria-labelledby={`testimonial-${index}-name`}
                      >
                        <Quote className="w-5 h-5 sm:w-6 sm:h-6 text-[#FFD43B] mb-2" />
                        <p className="text-white text-xs sm:text-sm mb-3 leading-relaxed">
                          {testimonial.text}
                        </p>
                        <div className="border-t border-gray-700 pt-2">
                          <p id={`testimonial-${index}-name`} className="text-white font-semibold text-sm">
                            {testimonial.name}
                          </p>
                          <p className="text-gray-400 text-xs">{testimonial.role}</p>
                        </div>
                        <div className="absolute -inset-1 bg-gradient-to-br from-[#306998]/30 to-[#FFD43B]/30 blur-xl -z-10 rounded-2xl"></div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-0">
            <div className="glass px-4 py-3 sm:px-6 sm:py-4 rounded-2xl backdrop-blur-xl">
              <p className="text-xl sm:text-2xl font-bold text-white mb-1">1000+</p>
              <p className="text-gray-400 text-xs sm:text-sm">Python Wizards</p>
            </div>
          </div>
        </div>

        {/* Desktop Orbit Layout */}
        <div className="hidden lg:block relative h-[500px] lg:h-[600px] flex items-center justify-center">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 lg:w-96 lg:h-96 rounded-full bg-gradient-to-br from-[#306998]/20 to-[#FFD43B]/20 blur-3xl"></div>

          <div className="relative w-full h-full max-w-2xl mx-auto">
            {testimonials.map((testimonial, index) => {
              const isHovered = hoveredIndex === index;
              const isActive = activeIndex === index;

              return (
                <div
                  key={index}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                  style={{
                    animation: `orbit ${30 + index * 2}s linear infinite`,
                    animationDelay: `${-index * 5}s`,
                  }}
                  onMouseEnter={() => handleAvatarInteraction(index)}
                  onMouseLeave={handleAvatarLeave}
                >
                  <div
                    className={`relative transition-all duration-500 ${
                      isHovered || isActive ? 'scale-150 z-[100]' : 'scale-100 z-10'
                    }`}
                  >
                    <button
                      className={`w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-gradient-to-br ${testimonial.color} flex items-center justify-center cursor-pointer transition-all duration-300 ${
                        isHovered || isActive ? 'ring-4 ring-white/50' : ''
                      }`}
                      onClick={() => handleAvatarClick(index)}
                      onFocus={() => handleAvatarInteraction(index)}
                      onBlur={handleAvatarLeave}
                      aria-label={`Read testimonial from ${testimonial.name}`}
                      aria-expanded={isActive}
                    >
                      <span className="text-white font-bold text-lg lg:text-xl">
                        {testimonial.avatar}
                      </span>
                    </button>

                    {(isHovered || isActive) && (
                      <div
                        className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-72 lg:w-80 glass-dark rounded-2xl p-4 lg:p-6 animate-float z-[1000]"
                        style={{
                          animationDuration: '3s',
                        }}
                        role="dialog"
                        aria-labelledby={`testimonial-${index}-name`}
                      >
                        <Quote className="w-6 h-6 lg:w-8 lg:h-8 text-[#FFD43B] mb-2 lg:mb-3" />
                        <p className="text-white text-xs lg:text-sm mb-3 lg:mb-4 leading-relaxed">
                          {testimonial.text}
                        </p>
                        <div className="border-t border-gray-700 pt-2 lg:pt-3">
                          <p id={`testimonial-${index}-name`} className="text-white font-semibold text-sm lg:text-base">
                            {testimonial.name}
                          </p>
                          <p className="text-gray-400 text-xs lg:text-sm">{testimonial.role}</p>
                        </div>
                        <div className="absolute -inset-1 bg-gradient-to-br from-[#306998]/30 to-[#FFD43B]/30 blur-xl -z-10 rounded-2xl"></div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-0">
            <div className="glass px-6 py-4 lg:px-8 lg:py-6 rounded-2xl backdrop-blur-xl">
              <p className="text-2xl lg:text-4xl font-bold text-white mb-1 lg:mb-2">1000+</p>
              <p className="text-gray-400 text-sm lg:text-base">Python Wizards</p>
            </div>
          </div>
        </div>

        <div className="mt-12 md:mt-16 text-center">
          <p className="text-lg md:text-2xl text-gray-300 mb-4 px-4">
            {isMobile 
              ? 'Tap on the avatars to read their stories' 
              : 'Hover over the avatars to read their stories'
            }
          </p>
          <div className="flex justify-center gap-1 md:gap-2">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-[#FFD43B] text-xl md:text-2xl">⭐</span>
            ))}
          </div>
          <p className="text-gray-400 mt-2 text-sm md:text-base">Average rating from 10,000+ Python Wizards</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes orbit {
          0% {
            transform: translate(-50%, -50%) rotate(0deg) translateX(200px) rotate(0deg);
          }
          100% {
            transform: translate(-50%, -50%) rotate(360deg) translateX(200px) rotate(-360deg);
          }
        }

        @keyframes mobileOrbit {
          0% {
            transform: translate(-50%, -50%) rotate(0deg) translateX(120px) rotate(0deg);
          }
          100% {
            transform: translate(-50%, -50%) rotate(360deg) translateX(120px) rotate(-360deg);
          }
        }

        @media (min-width: 640px) {
          @keyframes mobileOrbit {
            0% {
              transform: translate(-50%, -50%) rotate(0deg) translateX(140px) rotate(0deg);
            }
            100% {
              transform: translate(-50%, -50%) rotate(360deg) translateX(140px) rotate(-360deg);
            }
          }
        }

        .glass {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .glass-dark {
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </section>
  );
}