"use client"
import { useState, useEffect } from 'react';
import { Check, Lock, Unlock, Zap, Clock, Rocket, Star, Sparkles, Target } from 'lucide-react';

export default function PricingSection() {
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [showPrice, setShowPrice] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59,
  });

  useEffect(() => {
    const lines = [
      '> Initializing Python Wizard Bootcamp...',
      '> Loading magic spells (code)...',
      '> Checking wizard availability...',
      '> Standard Price: ₹499',
      '> MAGIC: Special Spell Detected!',
      '> Casting discount charm...',
      '> Final Price: ₹99 Only!',
      '> Magic offer activated ✨',
    ];


    let index = 0;
    const interval = setInterval(() => {
      if (index < lines.length) {
        setTerminalLines((prev) => [...prev, lines[index]]);
        if (index === lines.length - 1) {
          setShowPrice(true);
        }
        index++;
      } else {
        clearInterval(interval);
      }
    }, 400);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { hours: prev.hours, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const features = [
    'Complete Python Basics',
    'Hands-on Coding Projects',
    'AI/ML Foundation',
    'Lifetime Access',
    'Build Real Applications',
    "language hinglish conersational"
  ];

  return (
    <section className="relative py-12 md:py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#030712] via-[#1a103d] to-[#030712]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent"></div>
      
      {/* Floating elements - reduced for mobile */}
      <div className="absolute top-10 left-5 animate-float">
        <Sparkles className="w-6 h-6 text-[#FFD43B]" />
      </div>
      <div className="absolute bottom-20 right-5 animate-float" style={{ animationDelay: '2s' }}>
        <Star className="w-5 h-5 text-[#306998]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4">
        <div className="text-center mb-8 md:mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#306998] to-[#FFD43B] text-gray-900 px-4 py-1 rounded-full text-xs font-bold mb-3">
            <Rocket className="w-3 h-3" />
            LIMITED TIME OFFER
          </div>
          <h2 className="text-3xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-[#FFD43B] via-[#306998] to-[#9D4EDD] text-transparent bg-clip-text">
              Start Coding Magic
            </span>
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Learn Python for less than your daily coffee!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 items-start max-w-2xl mx-auto">
          <div className="glass-dark rounded-2xl p-8 font-mono text-sm border border-[#306998]/30 relative overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#306998]/5 to-[#FFD43B]/5 animate-pulse"></div>
            
            <div className="flex items-center gap-2 mb-6 relative z-10">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse"></div>
                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
              </div>
              <span className="text-gray-400 ml-4">python_wizard_console.py</span>
            </div>

            <div className="space-y-2 min-h-[300px] relative z-10">
              {terminalLines.map((line, index) => (
                <div
                  key={index}
                  className={`${
                    line.includes('MAGIC') || line.includes('₹99')
                      ? 'text-[#FFD43B] font-bold animate-pulse'
                      : line.includes('₹499')
                      ? 'text-red-400 line-through opacity-70'
                      : line.includes('✨')
                      ? 'text-purple-400 font-bold'
                      : 'text-green-400'
                  } transition-all duration-300`}
                >
                  {line}
                </div>
              ))}
              <div className="text-green-400 animate-pulse">_</div>
            </div>

            {/* Progress section */}
            <div className="mt-8 pt-8 border-t border-gray-700/50 relative z-10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-400">Wizard Spots Available:</span>
                <span className="text-[#FFD43B] font-bold flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  07 / 100
                </span>
              </div>
              <div className="w-full bg-gray-800/50 rounded-full h-3 overflow-hidden backdrop-blur-sm">
                <div
                  className="h-full bg-gradient-to-r from-[#FFD43B] to-[#FFA500] rounded-full transition-all duration-1000 relative overflow-hidden"
                  style={{ width: '93%' }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Simplified Pricing Card */}
          <div className="glass rounded-2xl p-6 relative overflow-hidden border border-[#FFD43B]/20">
            {/* Sale Badge */}
            <div className="absolute top-0 right-0 bg-gradient-to-br from-[#FFD43B] to-[#FFA500] px-4 py-1 text-gray-900 font-bold text-xs rounded-bl-2xl">
              <Zap className="w-3 h-3 inline mr-1" />
              SALE
            </div>

            {/* Pricing */}
            <div className="mt-4 mb-6 text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="text-xl text-red-400 line-through opacity-50">
                  ₹499
                </div>
                <div className="relative">
                  <div className="text-4xl font-black text-[#FFD43B] bg-gradient-to-r from-[#FFD43B] to-[#FFA500] text-transparent bg-clip-text">
                    ₹99
                  </div>
                </div>
              </div>

              {/* Timer */}
              <div className="flex items-center justify-center gap-2 text-gray-300 mb-3">
                <Clock className="w-4 h-4 text-[#FFD43B]" />
                <span className="text-sm">Ends in:</span>
              </div>

              <div className="flex justify-center gap-2 mb-6">
                {[
                  { value: timeLeft.hours, label: 'H' },
                  { value: timeLeft.minutes, label: 'M' },
                  { value: timeLeft.seconds, label: 'S' }
                ].map((item, index) => (
                  <div key={index} className="glass-dark px-3 py-2 rounded-lg text-center min-w-[50px] border border-[#FFD43B]/20">
                    <div className="text-lg font-bold text-[#FFD43B] font-mono">
                      {String(item.value).padStart(2, '0')}
                    </div>
                    <div className="text-xs text-gray-400">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Features - Simplified */}
            <div className="space-y-2 mb-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#306998] to-[#FFD43B] flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-white" strokeWidth={3} />
                  </div>
                  <span className="text-gray-200 text-sm">{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <button className="w-full py-4 bg-gradient-to-r from-[#FFD43B] to-[#FFA500] rounded-xl font-bold text-lg text-gray-900 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2">
              <Unlock className="w-5 h-5" />
              <span>Start Learning Now</span>
            </button>

            {/* Security */}
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
                <Lock className="w-3 h-3" />
                Secure payment • 7-day guarantee
              </p>
            </div>
          </div>
        </div>

        {/* Bottom CTA - Simplified */}
        <div className="mt-12 text-center">
          <p className="text-lg text-gray-300 mb-2">
            Your coding journey starts here! ✨
          </p>
          <p className="text-gray-400 text-sm max-w-2xl mx-auto">
            Join thousands learning Python and opening doors to AI, ML, and endless possibilities.
          </p>
        </div>
      </div>

      <style jsx>{`
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .glass {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .glass-dark {
          background: rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
      `}</style>
    </section>
  );
}