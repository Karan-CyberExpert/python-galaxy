import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import SMTPPool from "nodemailer/lib/smtp-pool";
import Razorpay from "razorpay";
import crypto from "crypto";

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

// Email queue for handling multiple requests
interface EmailTask {
  id: string;
  data: {
    name: string;
    email: string;
    mobile: string;
    address?: string;
    paymentId?: string;
    orderId?: string;
  };
  attempts: number;
  createdAt: Date;
}

class EmailQueue {
  private queue: EmailTask[] = [];
  private isProcessing = false;
  private maxAttempts = 3;
  private retryDelay = 5000; // 5 seconds

  async add(task: Omit<EmailTask, "id" | "attempts" | "createdAt">) {
    const emailTask: EmailTask = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      data: task.data,
      attempts: 0,
      createdAt: new Date(),
    };

    this.queue.push(emailTask);
    console.log(`📧 Email task added to queue: ${emailTask.id}`);

    if (!this.isProcessing) {
      this.processQueue();
    }
  }

  private async processQueue() {
    if (this.isProcessing || this.queue.length === 0) return;

    this.isProcessing = true;

    while (this.queue.length > 0) {
      const task = this.queue[0];

      try {
        console.log(
          `🔄 Processing email task: ${task.id} (Attempt ${task.attempts + 1})`
        );
        await sendEmailDirect(task.data);

        // Success - remove from queue
        this.queue.shift();
        console.log(`✅ Email sent successfully: ${task.id}`);
      } catch (error) {
        task.attempts++;

        if (task.attempts >= this.maxAttempts) {
          // Max attempts reached - remove from queue
          this.queue.shift();
          console.error(
            `❌ Email failed after ${this.maxAttempts} attempts: ${task.id}`,
            error
          );
        } else {
          // Retry after delay
          console.log(
            `⏳ Retrying email ${task.id} in ${this.retryDelay}ms (Attempt ${task.attempts})`
          );
          await this.delay(this.retryDelay);
        }
      }
    }

    this.isProcessing = false;
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  getQueueLength(): number {
    return this.queue.length;
  }

  getProcessingStatus(): boolean {
    return this.isProcessing;
  }
}

// Initialize email queue
const emailQueue = new EmailQueue();

// Use a more flexible type for the transporter
let transporter: nodemailer.Transporter;

// Enhanced email transporter configuration
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: parseInt(process.env.EMAIL_PORT || "587"),
    secure: process.env.EMAIL_SECURE === "true",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 30000,
    pool: true,
    maxConnections: 5,
    maxMessages: 100,
    rateDelta: 1000,
    rateLimit: 5,
  } as SMTPPool.Options);
};

// Initialize transporter
transporter = createTransporter();

// Test email configuration on startup
const testEmailConfig = async () => {
  try {
    await transporter.verify();
    console.log("✅ Email transporter configured successfully");
    return true;
  } catch (error) {
    console.error("❌ Email configuration test failed:", error);

    // Try alternative configuration without pooling
    try {
      const fallbackTransporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
        connectionTimeout: 15000,
      });

      await fallbackTransporter.verify();
      transporter = fallbackTransporter;
      console.log("✅ Fallback email configuration successful");
      return true;
    } catch (fallbackError) {
      console.error(
        "❌ Fallback email configuration also failed:",
        fallbackError
      );
      return false;
    }
  }
};

// Initialize email configuration
testEmailConfig();

// Direct email sending function (used by queue)
async function sendEmailDirect(emailData: {
  name: string;
  email: string;
  mobile: string;
  address?: string;
  paymentId?: string;
  orderId?: string;
}) {
  // Verify transporter is still connected
  try {
    await transporter.verify();
  } catch (error) {
    console.log("Recreating email transporter...");
    transporter = createTransporter();
    await transporter.verify();
  }

  const mailOptions = {
    from: `"Python Wizard" <${process.env.EMAIL_USER}>`,
    to: emailData.email,
    subject: emailData.paymentId
      ? "🎉 Payment Confirmed - Welcome to Python Wizard Course!"
      : "🚀 Welcome to Python Wizard Course!",
    html: emailData.paymentId
      ? generatePaymentEmailTemplate(emailData)
      : generateStudentEmailTemplate(emailData),
  };

  const adminMailOptions = {
    from: `"Python Wizard" <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
    subject: emailData.paymentId
      ? `💰 Payment Received - New Enrollment - ${emailData.name}`
      : `🎯 New Python Course Enrollment - ${emailData.name}`,
    html: emailData.paymentId
      ? generateAdminPaymentEmailTemplate(emailData)
      : generateAdminEmailTemplate(emailData),
  };

  // Send emails with individual error handling
  try {
    await transporter.sendMail(adminMailOptions);
    console.log(`📨 Admin notification sent for: ${emailData.email}`);
  } catch (adminError) {
    console.error("Failed to send admin email:", adminError);
    // Don't fail the entire process if admin email fails
  }

  await transporter.sendMail(mailOptions);
  console.log(`📨 Welcome email sent to: ${emailData.email}`);
}

// Queue-based email sending function
async function sendEmail(emailData: {
  name: string;
  email: string;
  mobile: string;
  address?: string;
  paymentId?: string;
  orderId?: string;
}) {
  try {
    // Add to queue for processing
    await emailQueue.add({ data: emailData });

    return {
      success: true,
      message: "Email queued for delivery",
      queuePosition: emailQueue.getQueueLength(),
    };
  } catch (error) {
    console.error("Error queuing email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to queue email",
    };
  }
}

// Email template generators
function generateAdminEmailTemplate(emailData: {
  name: string;
  email: string;
  mobile: string;
  address?: string;
}) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #FFD43B; text-align: center;">New Course Enrollment!</h2>
      <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; border-left: 4px solid #FFD43B;">
        <h3 style="color: #333; margin-bottom: 15px;">Student Details:</h3>
        <p><strong>Name:</strong> ${escapeHtml(emailData.name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(emailData.email)}</p>
        <p><strong>Mobile:</strong> ${escapeHtml(emailData.mobile)}</p>
        ${
          emailData.address
            ? `<p><strong>Address:</strong> ${escapeHtml(
                emailData.address
              )}</p>`
            : ""
        }
        <p><strong>Enrollment Date:</strong> ${new Date().toLocaleString()}</p>
        <p><strong>Queue Status:</strong> Processing</p>
      </div>
      <div style="margin-top: 20px; text-align: center;">
        <p style="color: #666;">Course: Python Wizard - Foundation for Data Science & AI/ML</p>
        <p style="color: #666;">Price: ₹99</p>
      </div>
    </div>
  `;
}

function generateAdminPaymentEmailTemplate(emailData: {
  name: string;
  email: string;
  mobile: string;
  address?: string;
  paymentId?: string;
  orderId?: string;
}) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #4CAF50; text-align: center;">💰 Payment Received - New Enrollment!</h2>
      <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; border-left: 4px solid #4CAF50;">
        <h3 style="color: #333; margin-bottom: 15px;">Student & Payment Details:</h3>
        <p><strong>Name:</strong> ${escapeHtml(emailData.name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(emailData.email)}</p>
        <p><strong>Mobile:</strong> ${escapeHtml(emailData.mobile)}</p>
        ${
          emailData.address
            ? `<p><strong>Address:</strong> ${escapeHtml(
                emailData.address
              )}</p>`
            : ""
        }
        <p><strong>Payment ID:</strong> ${emailData.paymentId}</p>
        <p><strong>Order ID:</strong> ${emailData.orderId}</p>
        <p><strong>Amount:</strong> ₹99</p>
        <p><strong>Payment Date:</strong> ${new Date().toLocaleString()}</p>
      </div>
      <div style="margin-top: 20px; text-align: center;">
        <p style="color: #666;">Course: Python Wizard - Foundation for Data Science & AI/ML</p>
        <p style="color: #4CAF50; font-weight: bold;">Payment Status: ✅ Completed</p>
      </div>
    </div>
  `;
}

function generateStudentEmailTemplate(emailData: {
  name: string;
  email: string;
  mobile: string;
  address?: string;
}) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="text-align: center; background: linear-gradient(135deg, #FFD43B, #FFA500); padding: 30px; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0;">Welcome to Python Wizard!</h1>
        <p style="color: white; font-size: 18px; margin: 10px 0 0 0;">Your journey to Data Science & AI begins now</p>
      </div>
      
      <div style="padding: 30px; background: #f8f9fa;">
        <h3 style="color: #333;">Hello ${escapeHtml(emailData.name)},</h3>
        <p style="color: #666; line-height: 1.6;">
          Thank you for enrolling in our <strong>Python Wizard</strong> course! 
          We're excited to help you build a solid foundation for your Data Science and AI/ML journey.
        </p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #FFD43B;">
          <h4 style="color: #333; margin-bottom: 15px;">🎯 Your Enrollment Details:</h4>
          <p><strong>Course:</strong> Python Wizard - Foundation Program</p>
          <p><strong>Duration:</strong> 10 Days Intensive Learning</p>
          <p><strong>Price:</strong> ₹99</p>
          <p><strong>Enrollment Date:</strong> ${new Date().toLocaleDateString()}</p>
        </div>

        <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h4 style="color: #2e7d32; margin-bottom: 10px;">📚 What's Next?</h4>
          <p style="color: #666; margin: 5px 0;">• Complete your payment to activate course access</p>
          <p style="color: #666; margin: 5px 0;">• You will receive course access within 2 hours of payment</p>
          <p style="color: #666; margin: 5px 0;">• Check your email for learning materials</p>
          <p style="color: #666; margin: 5px 0;">• Join our student community for support</p>
        </div>

        <p style="color: #666; line-height: 1.6;">
          If you have any questions, feel free to reply to this email. We're here to help you succeed!
        </p>
      </div>

      <div style="background: #333; color: white; padding: 20px; text-align: center; border-radius: 0 0 10px 10px;">
        <p style="margin: 0; font-size: 14px;">Happy Coding! 🐍</p>
        <p style="margin: 10px 0 0 0; font-size: 12px; color: #ccc;">Python Wizard Team</p>
      </div>
    </div>
  `;
}

function generatePaymentEmailTemplate(emailData: {
  name: string;
  email: string;
  mobile: string;
  address?: string;
  paymentId?: string;
  orderId?: string;
}) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="text-align: center; background: linear-gradient(135deg, #4CAF50, #45a049); padding: 30px; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0;">Payment Confirmed! 🎉</h1>
        <p style="color: white; font-size: 18px; margin: 10px 0 0 0;">Welcome to Python Wizard</p>
      </div>
      
      <div style="padding: 30px; background: #f8f9fa;">
        <h3 style="color: #333;">Hello ${escapeHtml(emailData.name)},</h3>
        <p style="color: #666; line-height: 1.6;">
          Your payment has been successfully processed and you're officially enrolled in our <strong>Python Wizard</strong> course!
        </p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4CAF50;">
          <h4 style="color: #333; margin-bottom: 15px;">📦 Enrollment & Payment Details:</h4>
          <p><strong>Course:</strong> Python Wizard - Foundation Program</p>
          <p><strong>Amount Paid:</strong> ₹99</p>
          <p><strong>Payment ID:</strong> ${emailData.paymentId}</p>
          <p><strong>Order ID:</strong> ${emailData.orderId}</p>
          <p><strong>Enrollment Date:</strong> ${new Date().toLocaleDateString()}</p>
        </div>

        <!-- WhatsApp Join Button -->
        <div style="text-align: center; margin: 25px 0;">
          <a href="https://chat.whatsapp.com/HasOdIwY2NuKn97venbCf3?mode=wwt" 
             style="display: inline-flex; align-items: center; gap: 10px; background: #25D366; color: white; padding: 12px 24px; border-radius: 50px; text-decoration: none; font-weight: bold; transition: all 0.3s ease; box-shadow: 0 4px 12px rgba(37, 211, 102, 0.3);"
             onmouseover="this.style.transform='scale(1.05)'; this.style.boxShadow='0 6px 16px rgba(37, 211, 102, 0.4)';"
             onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 4px 12px rgba(37, 211, 102, 0.3)';">
            <img src="https://cdn-icons-png.flaticon.com/512/124/124034.png" 
                 alt="WhatsApp" 
                 style="width: 24px; height: 24px; filter: brightness(0) invert(1);">
            Join WhatsApp Group
          </a>
          <p style="color: #666; font-size: 14px; margin-top: 10px;">
            Connect with fellow students and get instant support
          </p>
        </div>

        <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h4 style="color: #2e7d32; margin-bottom: 10px;">🚀 What Happens Next?</h4>
          <p style="color: #666; margin: 5px 0;">• Course access will be activated within 2 hours</p>
          <p style="color: #666; margin: 5px 0;">• You'll receive learning materials via email</p>
          <p style="color: #666; margin: 5px 0;">• Join our student community for support</p>
          <p style="color: #666; margin: 5px 0;">• Schedule your orientation session</p>
        </div>

        <p style="color: #666; line-height: 1.6;">
          If you have any questions, reply to this email. We're excited to have you onboard!
        </p>
      </div>

      <div style="background: #333; color: white; padding: 20px; text-align: center; border-radius: 0 0 10px 10px;">
        <p style="margin: 0; font-size: 14px;">Happy Learning! 🐍</p>
        <p style="margin: 10px 0 0 0; font-size: 12px; color: #ccc;">Python Wizard Team</p>
      </div>
    </div>
  `;
}

// Security helper function
function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
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

    // Send initial enrollment email (without payment confirmation)
    const isEmailConfigured = process.env.EMAIL_USER && process.env.EMAIL_PASS;
    if (isEmailConfigured) {
      await sendEmail(enrollmentData);
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

    // Payment successful - Send confirmation emails
    const emailData = {
      name: formData.name,
      email: formData.email,
      mobile: formData.mobile,
      address: formData.address,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
    };

    const emailResult = await sendEmail(emailData);

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
    });

    return NextResponse.json({
      success: true,
      message: "Payment verified successfully",
      paymentId: razorpay_payment_id,
      emailSent: emailResult.success,
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

// Health check endpoint
export async function GET() {
  const isEmailConfigured = !!(
    process.env.EMAIL_USER && process.env.EMAIL_PASS
  );
  const isRazorpayConfigured = !!(
    process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET
  );

  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    email: {
      configured: isEmailConfigured,
      queueLength: emailQueue.getQueueLength(),
      processing: emailQueue.getProcessingStatus(),
    },
    razorpay: {
      configured: isRazorpayConfigured,
    },
    environment: process.env.NODE_ENV || "development",
  });
}
