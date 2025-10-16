import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import crypto from "crypto";
import fs from "fs";
import path from "path";

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

// JSON file path for storing user data
const DATA_FILE_PATH = path.join(process.cwd(), 'user-data.json');

// Helper functions to manage JSON file
function readUserData() {
  try {
    if (!fs.existsSync(DATA_FILE_PATH)) {
      return { enrollments: [], payments: [] };
    }
    const data = fs.readFileSync(DATA_FILE_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading user data:', error);
    return { enrollments: [], payments: [] };
  }
}

function writeUserData(data: any) {
  try {
    const dir = path.dirname(DATA_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing user data:', error);
    return false;
  }
}

function saveEnrollment(enrollmentData: any) {
  const data = readUserData();
  const enrollment = {
    id: `ENR${Date.now()}`,
    ...enrollmentData,
    createdAt: new Date().toISOString(),
    status: 'pending_payment'
  };
  
  data.enrollments.push(enrollment);
  const success = writeUserData(data);
  
  if (success) {
    console.log(`✅ Enrollment saved: ${enrollment.id} for ${enrollmentData.email}`);
  }
  
  return { success, enrollmentId: enrollment.id };
}

function savePayment(paymentData: any) {
  const data = readUserData();
  const payment = {
    id: `PAY${Date.now()}`,
    ...paymentData,
    paidAt: new Date().toISOString(),
    status: 'completed'
  };
  
  data.payments.push(payment);
  
  // Update corresponding enrollment status
  const enrollment = data.enrollments.find((e: any) => 
    e.email === paymentData.studentEmail && e.status === 'pending_payment'
  );
  
  if (enrollment) {
    enrollment.status = 'completed';
    enrollment.paymentId = paymentData.paymentId;
    enrollment.orderId = paymentData.orderId;
    enrollment.completedAt = new Date().toISOString();
  }
  
  const success = writeUserData(data);
  
  if (success) {
    console.log(`✅ Payment saved: ${payment.id} for ${paymentData.studentEmail}`);
  }
  
  return { success, paymentId: payment.id };
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
    };

    // Save enrollment to JSON file
    const saveResult = saveEnrollment(enrollmentData);
    
    if (!saveResult.success) {
      console.error("Failed to save enrollment data");
      return NextResponse.json(
        {
          success: false,
          message: "Failed to save enrollment data",
        },
        { status: 500 }
      );
    }

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
        enrollmentId: saveResult.enrollmentId,
      },
    });

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
      enrollmentId: saveResult.enrollmentId,
      dataSaved: true,
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

// Verify Payment and Save Payment Data
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

    // Payment successful - Save payment record
    const paymentData = {
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      amount: 99.0,
      currency: "INR",
      studentName: formData.name,
      studentEmail: formData.email,
      studentMobile: formData.mobile,
      studentAddress: formData.address,
      course: "Python Wizard Course",
    };

    const saveResult = savePayment(paymentData);

    if (!saveResult.success) {
      console.error("Failed to save payment data");
      return NextResponse.json(
        {
          success: false,
          message: "Payment verified but failed to save data",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Payment verified and data saved successfully",
      paymentId: razorpay_payment_id,
      dataSaved: true,
      paymentRecordId: saveResult.paymentId,
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { success: false, message: "Payment verification failed" },
      { status: 500 }
    );
  }
}

// Get enrollment and payment statistics
export async function GET() {
  try {
    const data = readUserData();
    const totalEnrollments = data.enrollments.length;
    const completedPayments = data.payments.length;
    const pendingEnrollments = data.enrollments.filter((e: any) => e.status === 'pending_payment').length;

    return NextResponse.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      statistics: {
        totalEnrollments,
        completedPayments,
        pendingEnrollments,
      },
      dataFile: DATA_FILE_PATH,
      razorpay: {
        configured: !!(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET),
      },
      environment: process.env.NODE_ENV || "development",
    });
  } catch (error) {
    console.error("Error in GET endpoint:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to retrieve statistics",
      },
      { status: 500 }
    );
  }
}