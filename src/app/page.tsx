"use client"
import StarField from "./components/StarField";
import HeroSection from "./components/HeroSection";
import CourseHighlights from "./components/CourseHighlights";
import Testimonials from "./components/Testimonials";
import PricingSection from "./components/PricingSection";

function App() {
  return (
    <div className="relative min-h-screen bg-[#030712]">
      <StarField />
      <HeroSection />
      <CourseHighlights />
      <Testimonials />
      <PricingSection />

      <footer className="relative z-10 py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-400 mb-4">
            Code Beyond Limits. Join the Python Wizard.
          </p>
          <p className="text-sm text-gray-500">
            © 2025 digitree labs. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
