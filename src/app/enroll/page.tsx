"use client";
import { Suspense, useState } from "react";
import {
  User,
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  Shield,
  Clock,
  Zap,
  Rocket,
  Code,
  Target,
} from "lucide-react";
import { useSearchParams } from "next/navigation";

function PaymentRedirect({ paymentData }: { paymentData: any }) {
  const searchParams = useSearchParams();

  const queryParams = new URLSearchParams(paymentData).toString();
  window.location.href = `/payment?${queryParams}`;

  return null;
}

export default function EnrollPage() {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    address: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRedirect, setShowRedirect] = useState(false);
  const [redirectData, setRedirectData] = useState<any>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/enroll", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        const paymentData = {
          amount: "99.00",
          name: formData.name,
          email: formData.email,
          mobile: formData.mobile,
          orderId: `PYTHON${Date.now()}`,
          course: "Python Wizard Course",
        };

        setRedirectData(paymentData);
        setShowRedirect(true);
      } else {
        alert(result.message || "Enrollment failed. Please try again.");
      }
    } catch (error) {
      console.error("Enrollment error:", error);
      alert("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const features = [
    {
      icon: <Code className="w-5 h-5" />,
      text: "50+ Hands-on Coding Exercises",
    },
    {
      icon: <Clock className="w-5 h-5" />,
      text: "10 Days Intensive Learning",
    },
    {
      icon: <Target className="w-5 h-5" />,
      text: "Perfect Foundation for Data Science & AI/ML",
    },
    {
      icon: <Rocket className="w-5 h-5" />,
      text: "Quick Start to Advanced Python Concepts",
    },
  ];

  const isFormValid = formData.name && formData.mobile && formData.email;

  return (
    <>
      {showRedirect && redirectData && (
        <Suspense fallback={<div>Redirecting...</div>}>
          <PaymentRedirect paymentData={redirectData} />
        </Suspense>
      )}
      <section className="min-h-screen bg-gradient-to-br from-[#030712] via-[#0c1b3a] to-[#1e1b4b] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full mb-6">
              <Zap className="w-4 h-4 text-[#FFD43B]" />
              <span className="text-white font-semibold text-sm">
                LIMITED SEATS AVAILABLE
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">
              Start Your{" "}
              <span className="bg-gradient-to-r from-[#FFD43B] to-[#FFA500] text-transparent bg-clip-text">
                Python Journey
              </span>
            </h1>

            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Build a solid Python foundation for Data Science & AI/ML in just
              10 days!
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Enrollment Form */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 shadow-2xl">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">
                  Student Information
                </h2>
                <p className="text-gray-400">
                  Fill in your details to start learning
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-white font-medium">
                    <User className="w-4 h-4 text-[#FFD43B]" />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFD43B] focus:border-transparent transition-all duration-300"
                    placeholder="Enter your full name"
                  />
                </div>

                {/* Mobile Field */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-white font-medium">
                    <Phone className="w-4 h-4 text-[#FFD43B]" />
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFD43B] focus:border-transparent transition-all duration-300"
                    placeholder="Enter your mobile number"
                  />
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-white font-medium">
                    <Mail className="w-4 h-4 text-[#FFD43B]" />
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFD43B] focus:border-transparent transition-all duration-300"
                    placeholder="Enter your email address"
                  />
                </div>

                {/* Address Field */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-white font-medium">
                    <MapPin className="w-4 h-4 text-[#FFD43B]" />
                    Address (Optional)
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFD43B] focus:border-transparent transition-all duration-300 resize-none"
                    placeholder="Enter your address (optional)"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={!isFormValid || isSubmitting}
                  className="w-full group relative px-8 py-4 bg-gradient-to-r from-[#FFD43B] to-[#FFA500] rounded-2xl font-bold text-gray-900 text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl active:scale-95 shadow-lg overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </div>
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                      <span className="relative z-10 flex items-center justify-center gap-3">
                        Proceed to Payment
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </>
                  )}
                </button>
              </form>

              {/* Security Note */}
              <div className="mt-6 flex items-center justify-center gap-2 text-gray-400 text-sm">
                <Shield className="w-4 h-4" />
                Your information is secure and encrypted
              </div>
            </div>

            {/* Course Summary */}
            <div className="space-y-6">
              {/* Pricing Card */}
              <div className="bg-gradient-to-br from-[#FFD43B]/10 to-[#FFA500]/10 border border-[#FFD43B]/20 rounded-3xl p-8 backdrop-blur-md">
                <h3 className="text-2xl font-bold text-white mb-4">
                  Course Summary
                </h3>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center text-gray-300">
                    <span>Original Price</span>
                    <span className="text-lg line-through">₹499</span>
                  </div>
                  <div className="flex justify-between items-center text-gray-300">
                    <span>Discount</span>
                    <span className="text-lg text-green-400">-₹400</span>
                  </div>
                  <div className="flex justify-between items-center text-white text-xl font-bold pt-4 border-t border-white/10">
                    <span>Final Price</span>
                    <div className="flex items-center gap-2">
                      <span className="text-3xl text-[#FFD43B]">₹99</span>
                      <span className="text-sm bg-green-500 text-white px-2 py-1 rounded-full">
                        80% OFF
                      </span>
                    </div>
                  </div>
                </div>

                {/* Features List */}
                <div className="space-y-3">
                  {features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 text-gray-300"
                    >
                      <div className="text-[#FFD43B]">{feature.icon}</div>
                      <span>{feature.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Learning Path Card */}
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-500/20 p-2 rounded-lg">
                    <Target className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-lg mb-2">
                      Your Learning Path
                    </h4>
                    <p className="text-gray-400 text-sm">
                      This course is your perfect starting point for Data
                      Science & AI/ML. Master Python fundamentals first, then
                      advance to complex topics with confidence.
                    </p>
                  </div>
                </div>
              </div>

              {/* Support Card */}
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-green-500/20 p-2 rounded-lg">
                    <Rocket className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-lg mb-2">
                      Quick Start Program
                    </h4>
                    <p className="text-gray-400 text-sm">
                      Get started immediately after enrollment. Access all
                      materials and begin your Python journey right away.
                    </p>
                  </div>
                </div>
              </div>

              {/* Value Proposition Card */}
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-purple-500/20 p-2 rounded-lg">
                    <Zap className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-lg mb-2">
                      Why Start Here?
                    </h4>
                    <p className="text-gray-400 text-sm">
                      Python is the #1 language for Data Science and AI. Build
                      your foundation strong with this intensive 10-day program.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <footer className="relative z-10 py-12 mt-20 border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="text-gray-400 mb-4">
              Code Beyond Earth. Join the Python Wizard.
            </p>
            <p className="text-sm text-gray-500">
              © 2025 digitree labs. All rights reserved.
            </p>
          </div>
        </footer>
      </section>
    </>
  );
}
