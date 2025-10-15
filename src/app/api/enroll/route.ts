import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Initialize email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Helper function to send emails
async function sendEmail(emailData: {
  name: string;
  email: string;
  mobile: string;
  address?: string;
}) {
  try {
    // Email to admin
    const adminMailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
      subject: `🎯 New Python Course Enrollment - ${emailData.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #FFD43B; text-align: center;">New Course Enrollment!</h2>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; border-left: 4px solid #FFD43B;">
            <h3 style="color: #333; margin-bottom: 15px;">Student Details:</h3>
            <p><strong>Name:</strong> ${emailData.name}</p>
            <p><strong>Email:</strong> ${emailData.email}</p>
            <p><strong>Mobile:</strong> ${emailData.mobile}</p>
            ${emailData.address ? `<p><strong>Address:</strong> ${emailData.address}</p>` : ''}
            <p><strong>Enrollment Date:</strong> ${new Date().toLocaleString()}</p>
          </div>
          <div style="margin-top: 20px; text-align: center;">
            <p style="color: #666;">Course: Python Wizard - Foundation for Data Science & AI/ML</p>
            <p style="color: #666;">Price: ₹99</p>
          </div>
        </div>
      `,
    };

    // Email to student
    const studentMailOptions = {
      from: process.env.EMAIL_USER,
      to: emailData.email,
      subject: '🚀 Welcome to Python Wizard Course!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="text-align: center; background: linear-gradient(135deg, #FFD43B, #FFA500); padding: 30px; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">Welcome to Python Wizard!</h1>
            <p style="color: white; font-size: 18px; margin: 10px 0 0 0;">Your journey to Data Science & AI begins now</p>
          </div>
          
          <div style="padding: 30px; background: #f8f9fa;">
            <h3 style="color: #333;">Hello ${emailData.name},</h3>
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
              <p style="color: #666; margin: 5px 0;">• You will receive course access within 24 hours</p>
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
      `,
    };

    // Send both emails
    await transporter.sendMail(adminMailOptions);
    await transporter.sendMail(studentMailOptions);
    
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error occurred' };
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, mobile, email, address } = await request.json();

    // Validation
    if (!name || !mobile || !email) {
      return NextResponse.json(
        {
          success: false,
          message: 'Name, mobile, and email are required fields'
        },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Please provide a valid email address'
        },
        { status: 400 }
      );
    }

    // Basic mobile validation
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(mobile.replace(/\D/g, ''))) {
      return NextResponse.json(
        {
          success: false,
          message: 'Please provide a valid 10-digit mobile number'
        },
        { status: 400 }
      );
    }

    const enrollmentData = {
      name: name.trim(),
      mobile: mobile.trim(),
      email: email.trim().toLowerCase(),
      address: address ? address.trim() : '',
      enrolledAt: new Date().toISOString(),
    };

    // Send emails
    const emailResult = await sendEmail(enrollmentData);

    if (!emailResult.success) {
      console.warn('Email sending failed:', emailResult.error);
      
      return NextResponse.json(
        {
          success: false,
          message: 'Enrollment failed due to email service issue. Please try again later.'
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Enrollment successful! Check your email for confirmation.',
      data: {
        name: enrollmentData.name,
        email: enrollmentData.email
      }
    });

  } catch (error) {
    console.error('Enrollment error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error. Please try again later.'
      },
      { status: 500 }
    );
  }
}