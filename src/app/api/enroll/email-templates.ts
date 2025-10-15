export const generateAdminEmailTemplate = (emailData: {
  name: string;
  email: string;
  mobile: string;
  address?: string;
}) => `
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

export const generateAdminPaymentEmailTemplate = (emailData: {
  name: string;
  email: string;
  mobile: string;
  address?: string;
  paymentId?: string;
  orderId?: string;
}) => `
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

export const generateStudentEmailTemplate = (emailData: {
  name: string;
  email: string;
  mobile: string;
  address?: string;
}) => `
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

export const generatePaymentEmailTemplate = (emailData: {
  name: string;
  email: string;
  mobile: string;
  address?: string;
  paymentId?: string;
  orderId?: string;
}) => `
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

const escapeHtml = (text: string): string => {
  const map: { [key: string]: string } = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
};