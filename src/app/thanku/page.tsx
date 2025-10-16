"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle, Mail, Phone, Users, MessageCircle, Zap } from "lucide-react";

// -------------------------------
// Inner component that uses useSearchParams()
// -------------------------------
function ThankYouContent() {
  const searchParams = useSearchParams();
  const [paymentDetails, setPaymentDetails] = useState({
    name: "",
    email: "",
    paymentId: "",
    orderId: "",
    amount: "",
    course: "",
  });

  useEffect(() => {
    const name = searchParams.get("name");
    const email = searchParams.get("email");
    const paymentId = searchParams.get("payment_id");
    const orderId = searchParams.get("order_id");
    const amount = searchParams.get("amount");
    const course = searchParams.get("course");

    setPaymentDetails({
      name: decodeURIComponent(name || ""),
      email: decodeURIComponent(email || ""),
      paymentId: paymentId || "",
      orderId: orderId || "",
      amount: amount || "99.00",
      course: course || "Python Wizard Course",
    });
  }, [searchParams]);

  const whatsappGroupLink = "https://chat.whatsapp.com/F5gOiysIWwb2Sm3WyRqDGT";

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-8 sm:pt-0">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#030712] via-[#0c1b3a] to-[#1e1b4b]" />

      {/* Animated Stars Background */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 w-full py-8 sm:py-0">
        <div className="text-center mb-6 sm:mb-8">
          {/* Success Icon */}
          <div className="flex justify-center mb-4 sm:mb-6">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-3 sm:p-4 rounded-full shadow-2xl">
              <CheckCircle className="w-8 h-8 sm:w-12 sm:h-12 text-white" />
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-3 sm:mb-4 px-2">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-[#FFD43B] to-[#FFA500] text-transparent bg-clip-text">
              Python Wizard
            </span>
            !
          </h1>

          <p className="text-base sm:text-lg text-gray-300 mb-4 sm:mb-6 px-2">
            Hello{" "}
            <span className="text-[#FFD43B]">{paymentDetails.name}</span>, your
            enrollment is confirmed!
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Payment Details */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl sm:rounded-2xl p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-[#FFD43B]" />
              Payment Details
            </h2>

            <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Amount:</span>
                <span className="text-[#FFD43B] font-bold text-base sm:text-lg">
                  ₹{paymentDetails.amount}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Course:</span>
                <span className="text-white text-right">
                  {paymentDetails.course}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Payment ID:</span>
                <span className="text-white font-mono text-xs truncate ml-2 max-w-[120px] sm:max-w-none">
                  {paymentDetails.paymentId}
                </span>
              </div>
            </div>
          </div>

          {/* Support Info */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl sm:rounded-2xl p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
              <Users className="w-4 h-4 sm:w-5 sm:h-5 text-[#FFD43B]" />
              What's Next?
            </h2>

            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-start gap-2 sm:gap-3">
                <Phone className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-white text-sm font-semibold">
                    24-Hour Support Call
                  </p>
                  <p className="text-gray-400 text-xs">
                    Our team will call you within 24 hours
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2 sm:gap-3">
                <Mail className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-white text-sm font-semibold">
                    Email Updates
                  </p>
                  <p className="text-gray-400 text-xs break-words">
                    Sent to {paymentDetails.email}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* WhatsApp Group */}
        <div className="bg-gradient-to-r from-green-500/20 to-emerald-600/20 border border-green-500/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="text-center">
            <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-400 mx-auto mb-2 sm:mb-3" />
            <h3 className="text-white font-bold text-base sm:text-lg mb-2">
              Join Student Community
            </h3>
            <p className="text-gray-300 text-xs sm:text-sm mb-3 sm:mb-4 px-2">
              Connect with fellow learners, get instant help, and grow together
            </p>
            <a
              href={whatsappGroupLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-105 shadow-lg text-sm sm:text-base"
            >
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              Join WhatsApp Group
            </a>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-4 sm:mb-6">
          <button
            onClick={() => (window.location.href = "/")}
            className="px-4 sm:px-6 py-2 sm:py-3 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-lg sm:rounded-xl hover:bg-white/20 transition-all duration-300 hover:scale-105 text-sm sm:text-base"
          >
            Return Home
          </button>

          <a
            href={`mailto:${paymentDetails.email}`}
            className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-[#FFD43B] to-[#FFA500] text-gray-900 font-semibold rounded-lg sm:rounded-xl hover:scale-105 transition-all duration-300 text-center text-sm sm:text-base"
          >
            Check Email
          </a>
        </div>

        {/* Support Note */}
        <div className="text-center">
          <p className="text-gray-400 text-xs sm:text-sm px-2">
            Need help? Email us at{" "}
            <span className="text-[#FFD43B]">digitreelab@gmail.com</span>
          </p>
        </div>
      </div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-24 sm:h-32 bg-gradient-to-t from-[#030712] to-transparent" />
    </section>
  );
}

// -------------------------------
// Outer component that provides Suspense
// -------------------------------
export default function ThankYouPage() {
  return (
    <Suspense fallback={<div className="text-white text-center p-10">Loading...</div>}>
      <ThankYouContent />
    </Suspense>
  );
}
