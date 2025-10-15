"use client";
import { Code, Rocket, Zap, Star, Users, Clock, Link } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function HeroSection() {
  const router = useRouter();
  const [strikePrice, setStrikePrice] = useState(true);
  const [showFlash, setShowFlash] = useState(false);
  const [positions, setPositions] = useState<{ top: string; left: string }[]>(
    []
  );

  const codeSnippets = [
    'print("Hello Galaxy!")',
    "for planet in solar_system:",
    "def launch_mission():",
    "import antigravity",
    "class SpaceShip:",
    "data = [1, 2, 3, 4, 5]",
  ];

  const pythonPatterns = [
    "🐍", "📚", "🚀", "⚡", "💻", "🔢", "📊", "🤖",
    "{}", "[]", "()", ":", "=", "#", "_", "*"
  ];

  const handleClick = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/enroll';
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setStrikePrice(false);
      setShowFlash(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const randomPositions = codeSnippets.map(() => ({
      top: `${Math.random() * 80}%`,
      left: `${Math.random() * 80}%`,
    }));
    setPositions(randomPositions);
  }, [codeSnippets]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Enhanced Python-themed Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#306998] via-[#1e1b4b] to-[#4B8BBE]" />
      
      {/* Python Logo Pattern Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_#FFD43B_1px,_transparent_0)] bg-[length:40px_40px] animate-pulse-slow" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_21px_21px,_#306998_1px,_transparent_0)] bg-[length:40px_40px] animate-pulse-slow" style={{animationDelay: '1s'}} />
      </div>

      {/* Animated Python-themed Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Python Logos */}
        {[...Array(8)].map((_, i) => (
          <div
            key={`python-${i}`}
            className="absolute text-2xl opacity-5 animate-float-slow"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 3}s`,
              animationDuration: `${20 + i * 2}s`,
            }}
          >
            🐍
          </div>
        ))}

        {/* Binary Rain Effect */}
        {[...Array(20)].map((_, i) => (
          <div
            key={`binary-${i}`}
            className="absolute text-[#FFD43B] font-mono text-xs opacity-20 animate-binary-rain"
            style={{
              top: '-20px',
              left: `${(i * 5)}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${15 + Math.random() * 10}s`,
            }}
          >
            {Math.random() > 0.5 ? '1' : '0'}
          </div>
        ))}

        {/* Circuit Board Lines */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FFD43B] to-transparent animate-pulse" />
          <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#306998] to-transparent animate-pulse" style={{animationDelay: '1s'}} />
          <div className="absolute top-3/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#4B8BBE] to-transparent animate-pulse" style={{animationDelay: '2s'}} />
        </div>

        {/* Geometric Python Patterns */}
        <div className="absolute inset-0">
          {[...Array(12)].map((_, i) => (
            <div
              key={`pattern-${i}`}
              className="absolute border border-[#FFD43B] opacity-10 animate-spin-slow"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${20 + Math.random() * 100}px`,
                height: `${20 + Math.random() * 100}px`,
                borderRadius: i % 3 === 0 ? '50%' : '0%',
                animationDelay: `${i * 2}s`,
                animationDuration: `${30 + i * 3}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Floating code snippets */}
      <div className="absolute inset-0 overflow-hidden">
        {codeSnippets.map((code, i) => (
          <div
            key={i}
            className="absolute text-[#306998] font-mono text-xs md:text-sm opacity-30 animate-drift"
            style={{
              top: positions[i]?.top ?? "0%",
              left: positions[i]?.left ?? "0%",
              animationDelay: `${i * 2}s`,
              animationDuration: `${40 + i * 5}s`,
            }}
          >
            {code}
          </div>
        ))}
      </div>

      {/* Hero Text & CTA */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 text-center">
        {/* Sale Badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 md:px-6 md:py-3 rounded-full mb-6 md:mb-8 animate-float">
          <Zap className="w-4 h-4 md:w-5 md:h-5 text-[#FFD43B]" />
          <span className="text-white font-semibold text-xs md:text-sm">
            LIMITED TIME MAGIC OFFER
          </span>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold mb-4 md:mb-6 leading-tight">
          <span className="text-white block">Become a</span>
          <span className="bg-gradient-to-r from-[#00D4FF] via-[#4B8BBE] via-[#FFD43B] to-[#FF0080] text-transparent bg-clip-text animate-gradient bg-[length:200%_auto] drop-shadow-lg">
            Python Wizard
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-6 md:mb-8 max-w-3xl mx-auto leading-relaxed">
          From Zero to Hero in 10 Days — Master Python, Build Projects, and Land
          Opportunities!
        </p>

        {/* Improved Pricing Section */}
        <div className="flex flex-col items-center gap-3 mb-8 md:mb-12">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="relative">
              {strikePrice ? (
                <div className="text-2xl md:text-3xl font-bold text-red-400/70 line-through">
                  ₹499
                </div>
              ) : (
                <div className="text-2xl md:text-3xl font-bold text-red-400/50 line-through animate-fadeOut">
                  ₹499
                </div>
              )}
            </div>

            <div
              className={`text-4xl md:text-5xl font-black transition-all duration-500 ${
                showFlash ? "text-[#FFD43B] scale-105 text-glow" : "text-white"
              }`}
            >
              ₹99
            </div>
          </div>

          {/* Savings Badge */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-3 py-1 rounded-full">
            <span className="text-white font-bold text-sm">Save 80%</span>
          </div>
        </div>

        {/* Flash Sale Banner */}
        {showFlash && (
          <div className="inline-flex items-center gap-2 bg-[#FFD43B]/20 backdrop-blur-md border border-[#FFD43B]/30 px-4 py-2 rounded-lg mb-6 md:mb-8 animate-pulse">
            <Star className="w-4 h-4 text-[#FFD43B]" />
            <span className="text-[#FFD43B] font-bold text-sm">
              FLASH SALE • LIMITED SEATS
            </span>
          </div>
        )}

        {/* Enhanced CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center">
          {/* Primary CTA - Neumorphic with Gradient */}
          <button
            onClick={handleClick}
            className="group relative px-8 py-4 md:px-12 md:py-5 bg-gradient-to-r from-[#FFD43B] to-[#FFA500] rounded-2xl font-bold text-gray-900 text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl active:scale-95 shadow-lg overflow-hidden"
          >
            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

            <span className="relative z-10 flex items-center gap-2 md:gap-3">
              <Rocket className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-y-[-2px] transition-transform" />
              Enroll Now
            </span>
          </button>
        </div>

        {/* Enhanced Stats - Mobile Optimized */}
        <div className="mt-8 md:mt-12 grid grid-cols-3 gap-3 md:flex md:justify-center md:gap-8 text-center px-2">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg md:rounded-xl p-3 md:p-4 hover:bg-white/10 transition-all duration-300 hover:scale-105 min-h-[80px] md:min-h-[100px] flex flex-col justify-center w-full">
            <Code className="w-4 h-4 md:w-6 md:h-6 text-[#FFD43B] mx-auto mb-1 md:mb-2" />
            <div className="text-sm md:text-xl font-bold text-[#FFD43B]">
              50+
            </div>
            <div className="text-xs text-gray-400 mt-1 leading-tight">
              Coding Exercises
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg md:rounded-xl p-3 md:p-4 hover:bg-white/10 transition-all duration-300 hover:scale-105 min-h-[80px] md:min-h-[100px] flex flex-col justify-center w-full">
            <div className="text-sm md:text-xl font-bold text-[#FFD43B]">
              ⭐4.9
            </div>
            <div className="text-xs text-gray-400 mt-1 leading-tight">
              Course Rating
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg md:rounded-xl p-3 md:p-4 hover:bg-white/10 transition-all duration-300 hover:scale-105 min-h-[80px] md:min-h-[100px] flex flex-col justify-center w-full">
            <Zap className="w-4 h-4 md:w-6 md:h-6 text-[#FFD43B] mx-auto mb-1 md:mb-2" />
            <div className="text-sm md:text-xl font-bold text-[#FFD43B]">
              10 Days
            </div>
            <div className="text-xs text-gray-400 mt-1 leading-tight">
              Quick Results
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#030712] to-transparent" />
    </section>
  );
}