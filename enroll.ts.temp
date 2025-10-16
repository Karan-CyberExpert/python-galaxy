import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import crypto from "crypto";
import { generateAdminEmailTemplate, generateAdminPaymentEmailTemplate, generatePaymentEmailTemplate, generateStudentEmailTemplate } from "./email-templates";

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

// Email API configuration
const EMAIL_API_URL = process.env.EMAIL_API_URL || "http://localhost:3000";
const EMAIL_API_KEY = process.env.EMAIL_API_KEY;

// Enhanced email sending function using your API
async function sendEmailViaAPI(emailData: {
  name: string;
  email: string;
  mobile: string;
  address?: string;
  paymentId?: string;
  orderId?: string;
}) {
  if (!EMAIL_API_KEY) {
    console.warn("EMAIL_API_KEY not configured, skipping email sending");
    return { success: false, error: "Email API not configured" };
  }

  try {
    const isPaymentConfirmation = !!emailData.paymentId;

    // Student email
    const studentEmailPayload = {
      to: emailData.email,
      subject: isPaymentConfirmation
        ? "🎉 Payment Confirmed - Welcome to Python Wizard Course!"
        : "🚀 Welcome to Python Wizard Course Enrollment!",
      html: isPaymentConfirmation
        ? generatePaymentEmailTemplate(emailData)
        : generateStudentEmailTemplate(emailData),
      priority: "high",
    };

    // Admin email
    const adminEmailPayload = {
      to: process.env.ADMIN_EMAIL,
      subject: isPaymentConfirmation
        ? `💰 Payment Received - New Enrollment - ${emailData.name}`
        : `🎯 New Python Course Enrollment - ${emailData.name}`,
      html: isPaymentConfirmation
        ? generateAdminPaymentEmailTemplate(emailData)
        : generateAdminEmailTemplate(emailData),
      priority: "normal",
    };

    // Send student email
    const studentResponse = await fetch(`${EMAIL_API_URL}/send-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": EMAIL_API_KEY,
      },
      body: JSON.stringify(studentEmailPayload),
    });

    if (!studentResponse.ok) {
      throw new Error(`Student email failed: ${studentResponse.statusText}`);
    }

    // Send admin email if admin email is configured
    if (process.env.ADMIN_EMAIL) {
      const adminResponse = await fetch(`${EMAIL_API_URL}/send-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": EMAIL_API_KEY,
        },
        body: JSON.stringify(adminEmailPayload),
      });

      if (!adminResponse.ok) {
        console.warn(`Admin email failed: ${adminResponse.statusText}`);
        // Don't fail the entire process if admin email fails
      }
    }

    console.log(`✅ Emails sent successfully via API for: ${emailData.email}`);
    return { success: true, message: "Emails sent successfully" };
  } catch (error) {
    console.error("❌ Email API error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send email via API",
    };
  }
}

// Batch email sending for multiple recipients (if needed in future)
async function sendBatchEmails(emails: Array<{
  to: string;
  subject: string;
  html: string;
  priority?: "low" | "normal" | "high";
}>) {
  if (!EMAIL_API_KEY) {
    console.warn("EMAIL_API_KEY not configured, skipping batch emails");
    return { success: false, error: "Email API not configured" };
  }

  const results = [];

  for (const email of emails) {
    try {
      const response = await fetch(`${EMAIL_API_URL}/send-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": EMAIL_API_KEY,
        },
        body: JSON.stringify({
          to: email.to,
          subject: email.subject,
          html: email.html,
          priority: email.priority || "normal",
        }),
      });

      results.push({
        to: email.to,
        success: response.ok,
        status: response.status,
      });
    } catch (error) {
      results.push({
        to: email.to,
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  return results;
}

// Check email queue status
async function getEmailQueueStatus() {
  if (!EMAIL_API_KEY) {
    return null;
  }

  try {
    const response = await fetch(`${EMAIL_API_URL}/queue/stats`, {
      headers: {
        "x-api-key": EMAIL_API_KEY,
      },
    });

    if (response.ok) {
      return await response.json();
    }
    return null;
  } catch (error) {
    console.error("Error fetching queue stats:", error);
    return null;
  }
}

// Validation functions
function validateEmail(email: string): { isValid: boolean; message?: string } {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, message: "Please provide a valid email address" };
  }
  return { isValid: true };
}

function validateMobile(mobile: string): {
  isValid: boolean;
  message?: string;
} {
  const cleanMobile = mobile.replace(/\D/g, "");
  const mobileRegex = /^[0-9]{10}$/;
  if (!mobileRegex.test(cleanMobile)) {
    return {
      isValid: false,
      message: "Please provide a valid 10-digit mobile number",
    };
  }
  return { isValid: true };
}

function validateName(name: string): { isValid: boolean; message?: string } {
  if (!name || name.trim().length < 2) {
    return {
      isValid: false,
      message: "Name must be at least 2 characters long",
    };
  }
  if (name.length > 100) {
    return { isValid: false, message: "Name must be less than 100 characters" };
  }
  return { isValid: true };
}

// Create Razorpay Order
export async function POST(request: NextRequest) {
  // Handle CORS preflight
  if (request.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  try {
    const contentType = request.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return NextResponse.json(
        {
          success: false,
          message: "Content-Type must be application/json",
        },
        { status: 400 }
      );
    }

    const body = await request.text();

    if (!body) {
      return NextResponse.json(
        {
          success: false,
          message: "Request body is required",
        },
        { status: 400 }
      );
    }

    let parsedBody;
    try {
      parsedBody = JSON.parse(body);
    } catch (parseError) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid JSON in request body",
        },
        { status: 400 }
      );
    }

    const { name, mobile, email, address } = parsedBody;

    // Comprehensive validation
    if (!name || !mobile || !email) {
      return NextResponse.json(
        {
          success: false,
          message: "Name, mobile, and email are required fields",
        },
        { status: 400 }
      );
    }

    const nameValidation = validateName(name);
    if (!nameValidation.isValid) {
      return NextResponse.json(
        {
          success: false,
          message: nameValidation.message,
        },
        { status: 400 }
      );
    }

    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      return NextResponse.json(
        {
          success: false,
          message: emailValidation.message,
        },
        { status: 400 }
      );
    }

    const mobileValidation = validateMobile(mobile);
    if (!mobileValidation.isValid) {
      return NextResponse.json(
        {
          success: false,
          message: mobileValidation.message,
        },
        { status: 400 }
      );
    }

    // Prepare enrollment data
    const enrollmentData = {
      name: name.trim(),
      mobile: mobile.replace(/\D/g, ""), // Clean mobile number
      email: email.trim().toLowerCase(),
      address: address ? address.trim() : "",
      enrolledAt: new Date().toISOString(),
    };

    // Create Razorpay Order
    const order = await razorpay.orders.create({
      amount: 9900, // ₹99 in paise
      currency: "INR",
      receipt: `PYTHON${Date.now()}`,
      notes: {
        name: enrollmentData.name,
        email: enrollmentData.email,
        mobile: enrollmentData.mobile,
        course: "Python Wizard Course",
      },
    });

    // Send initial enrollment email via API
    if (EMAIL_API_KEY) {
      await sendEmailViaAPI(enrollmentData);
    } else {
      console.warn("EMAIL_API_KEY not configured, skipping enrollment email");
    }

    const responseData = {
      success: true,
      message: "Payment order created successfully",
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
      },
      student: {
        name: enrollmentData.name,
        email: enrollmentData.email,
      },
      emailSent: !!EMAIL_API_KEY,
    };

    return new NextResponse(JSON.stringify(responseData), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("Enrollment processing error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error. Please try again later.",
      },
      { status: 500 }
    );
  }
}

// Verify Payment and Send Confirmation Email
export async function PUT(request: NextRequest) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      formData,
    } = await request.json();

    // Verify payment signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      return NextResponse.json(
        { success: false, message: "Payment verification failed" },
        { status: 400 }
      );
    }

    // Payment successful - Send confirmation emails via API
    const emailData = {
      name: formData.name,
      email: formData.email,
      mobile: formData.mobile,
      address: formData.address,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
    };

    let emailResult;
    if (EMAIL_API_KEY) {
      emailResult = await sendEmailViaAPI(emailData);
    } else {
      console.warn("EMAIL_API_KEY not configured, skipping confirmation email");
      emailResult = { success: false, error: "Email API not configured" };
    }

    // Save payment record (you can implement your database logic here)
    await savePaymentRecord({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      amount: 99.0,
      status: "completed",
      studentName: formData.name,
      studentEmail: formData.email,
      studentMobile: formData.mobile,
      course: "Python Wizard Course",
      emailSent: emailResult.success,
    });

    return NextResponse.json({
      success: true,
      message: "Payment verified successfully",
      paymentId: razorpay_payment_id,
      emailSent: emailResult.success,
      queueStats: await getEmailQueueStatus(),
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { success: false, message: "Payment verification failed" },
      { status: 500 }
    );
  }
}

// Optional: Save payment record
async function savePaymentRecord(paymentData: any) {
  // Implement your database logic here
  console.log("Payment record saved:", paymentData);
  return { success: true };
}

// Health check endpoint with email API status
export async function GET() {
  const isEmailApiConfigured = !!EMAIL_API_KEY;
  const isRazorpayConfigured = !!(
    process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET
  );

  const queueStats = await getEmailQueueStatus();

  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    email: {
      apiConfigured: isEmailApiConfigured,
      apiUrl: EMAIL_API_URL,
      queueStats: queueStats,
    },
    razorpay: {
      configured: isRazorpayConfigured,
    },
    environment: process.env.NODE_ENV || "development",
  });
}