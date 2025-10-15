"use client";
import { Suspense, useState, useEffect } from "react";
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
  CheckCircle,
  Loader,
} from "lucide-react";
import { useSearchParams } from "next/navigation";

function PaymentRedirect({ paymentData }: { paymentData: any }) {
  const searchParams = useSearchParams();
  const queryParams = new URLSearchParams(paymentData).toString();
  window.location.href = `/thanku?${queryParams}`;
  return null;
}

declare global {
  interface Window {
    Razorpay: any;
  }
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
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  // Load Razorpay script more efficiently
  useEffect(() => {
    if (window.Razorpay) {
      setRazorpayLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => {
      console.log('Razorpay loaded');
      setRazorpayLoaded(true);
    };
    script.onerror = () => {
      console.error('Razorpay failed to load');
      setRazorpayLoaded(false);
    };
    document.body.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const initializeRazorpay = (order: any) => {
    if (!window.Razorpay) {
      throw new Error('Razorpay SDK not loaded');
    }

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Python Wizard",
      description: "Python Wizard Course Enrollment",
      order_id: order.id,
      handler: async function (response: any) {
        try {
          const verificationResponse = await fetch("/api/enroll", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              formData: formData,
            }),
          });

          const verificationResult = await verificationResponse.json();

          if (verificationResult.success) {
            const redirectData = {
              payment_id: response.razorpay_payment_id,
              order_id: response.razorpay_order_id,
              name: encodeURIComponent(formData.name),
              email: encodeURIComponent(formData.email),
              amount: "99.00",
              course: "Python Wizard Course",
            };
            setRedirectData(redirectData);
            setShowRedirect(true);
          } else {
            alert("Payment verification failed. Please contact support.");
            setIsSubmitting(false);
          }
        } catch (error) {
          console.error('Payment verification error:', error);
          alert("Payment verification failed. Please contact support.");
          setIsSubmitting(false);
        }
      },
      prefill: {
        name: formData.name,
        email: formData.email,
        contact: formData.mobile,
      },
      notes: {
        course: "Python Wizard Course",
      },
      theme: {
        color: "#FFD43B",
      },
      modal: {
        ondismiss: function() {
          console.log('Payment modal dismissed');
          setIsSubmitting(false);
        }
      }
    };

    const razorpay = new window.Razorpay(options);
    
    razorpay.on('payment.failed', function (response: any) {
      console.error('Payment failed:', response.error);
      alert(`Payment failed: ${response.error.description}`);
      setIsSubmitting(false);
    });

    return razorpay;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!window.Razorpay) {
      alert("Payment system is loading. Please wait a moment and try again.");
      return;
    }

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
        const razorpay = initializeRazorpay(result.order);
        razorpay.open();
      } else {
        alert(result.message || "Enrollment failed. Please try again.");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Enrollment error:", error);
      alert("Network error. Please check your connection and try again.");
      setIsSubmitting(false);
    }
  };

  // Compact features list
  const features = [
    { icon: <Code className="w-4 h-4" />, text: "50+ Coding Exercises" },
    { icon: <Clock className="w-4 h-4" />, text: "10 Days Learning" },
    { icon: <Target className="w-4 h-4" />, text: "Data Science & AI/ML Foundation" },
    { icon: <Rocket className="w-4 h-4" />, text: "Quick to Advanced" },
  ];

  // More compact payment steps for mobile
  const paymentSteps = [
    { step: 1, title: "Details", icon: <User className="w-4 h-4" /> },
    { step: 2, title: "Order", icon: <CheckCircle className="w-4 h-4" /> },
    { step: 3, title: "Payment", icon: <Shield className="w-4 h-4" /> },
    { step: 4, title: "Access", icon: <Rocket className="w-4 h-4" /> },
  ];

  const isFormValid = formData.name && formData.mobile && formData.email;

  return (
    <>
      {showRedirect && redirectData && (
        <Suspense fallback={<div>Redirecting...</div>}>
          <PaymentRedirect paymentData={redirectData} />
        </Suspense>
      )}
      
      <section className="min-h-screen bg-gradient-to-br from-[#030712] via-[#0c1b3a] to-[#1e1b4b] py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Compact Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full mb-4">
              <Zap className="w-3 h-3 text-[#FFD43B]" />
              <span className="text-white font-semibold text-xs">
                LIMITED SEATS
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              Start Your{" "}
              <span className="bg-gradient-to-r from-[#FFD43B] to-[#FFA500] text-transparent bg-clip-text">
                Python Journey
              </span>
            </h1>

            <p className="text-lg text-gray-300 max-w-xl mx-auto">
              Build Python foundation for Data Science & AI/ML in 10 days!
            </p>

            {!razorpayLoaded && (
              <div className="mt-3 text-yellow-400 text-sm flex items-center justify-center gap-2">
                <Loader className="w-3 h-3 animate-spin" />
                Loading payment system...
              </div>
            )}
          </div>

          {/* Compact Payment Steps */}
          <div className="flex justify-center mb-8">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 w-full max-w-2xl">
              <div className="grid grid-cols-4 gap-2">
                {paymentSteps.map((step, index) => (
                  <div key={step.step} className="text-center">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full mx-auto mb-2 ${
                      index === 0 ? 'bg-[#FFD43B] text-gray-900' : 'bg-white/10 text-white'
                    }`}>
                      {step.icon}
                    </div>
                    <div className="text-white text-xs font-medium">{step.title}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 items-start">
            {/* Compact Enrollment Form */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-white mb-1">
                  Student Information
                </h2>
                <p className="text-gray-400 text-sm">
                  Fill in your details to start learning
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Compact Form Fields */}
                <div className="space-y-3">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-white font-medium text-sm">
                      <User className="w-3 h-3 text-[#FFD43B]" />
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#FFD43B] text-sm transition-all duration-300"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-white font-medium text-sm">
                      <Phone className="w-3 h-3 text-[#FFD43B]" />
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#FFD43B] text-sm transition-all duration-300"
                      placeholder="Enter your mobile number"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-white font-medium text-sm">
                      <Mail className="w-3 h-3 text-[#FFD43B]" />
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#FFD43B] text-sm transition-all duration-300"
                      placeholder="Enter your email address"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-white font-medium text-sm">
                      <MapPin className="w-3 h-3 text-[#FFD43B]" />
                      Address (Optional)
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows={2}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#FFD43B] text-sm transition-all duration-300 resize-none"
                      placeholder="Enter your address (optional)"
                    />
                  </div>
                </div>

                {/* Compact Submit Button */}
                <button
                  type="submit"
                  disabled={!isFormValid || isSubmitting || !razorpayLoaded}
                  className="w-full group relative px-6 py-3 bg-gradient-to-r from-[#FFD43B] to-[#FFA500] rounded-xl font-bold text-gray-900 text-base transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95 shadow-lg overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </div>
                  ) : !razorpayLoaded ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
                      Loading...
                    </div>
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        Pay ₹99 & Enroll
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </>
                  )}
                </button>
              </form>

              {/* Compact Security Note */}
              <div className="mt-4 flex items-center justify-center gap-2 text-gray-400 text-xs">
                <Shield className="w-3 h-3" />
                Secure payment by Razorpay
              </div>
            </div>

            {/* Compact Course Summary */}
            <div className="space-y-4">
              {/* Pricing Card */}
              <div className="bg-gradient-to-br from-[#FFD43B]/10 to-[#FFA500]/10 border border-[#FFD43B]/20 rounded-2xl p-6 backdrop-blur-md">
                <h3 className="text-xl font-bold text-white mb-3">
                  Course Summary
                </h3>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between items-center text-gray-300 text-sm">
                    <span>Original Price</span>
                    <span className="line-through">₹499</span>
                  </div>
                  <div className="flex justify-between items-center text-gray-300 text-sm">
                    <span>Discount</span>
                    <span className="text-green-400">-₹400</span>
                  </div>
                  <div className="flex justify-between items-center text-white font-bold pt-3 border-t border-white/10">
                    <span>Final Price</span>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl text-[#FFD43B]">₹99</span>
                      <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full">
                        80% OFF
                      </span>
                    </div>
                  </div>
                </div>

                {/* Compact Features List */}
                <div className="space-y-2">
                  {features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-gray-300 text-sm"
                    >
                      <div className="text-[#FFD43B] shrink-0">{feature.icon}</div>
                      <span className="leading-tight">{feature.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Combined Security & Access Card */}
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="bg-green-500/20 p-2 rounded-lg inline-flex mb-2">
                      <Shield className="w-4 h-4 text-green-400" />
                    </div>
                    <h4 className="text-white font-bold text-sm mb-1">Secure</h4>
                    <p className="text-gray-400 text-xs">Encrypted payment</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-blue-500/20 p-2 rounded-lg inline-flex mb-2">
                      <Rocket className="w-4 h-4 text-blue-400" />
                    </div>
                    <h4 className="text-white font-bold text-sm mb-1">Instant</h4>
                    <p className="text-gray-400 text-xs">Immediate access</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <footer className="py-8 mt-12 border-t border-gray-800">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <p className="text-gray-400 text-sm">
              Code Beyond Limits. Join the Python Wizard.
            </p>
            <p className="text-xs text-gray-500 mt-2">
              © 2025 digitree labs. All rights reserved.
            </p>
          </div>
        </footer>
      </section>
    </>
  );
}