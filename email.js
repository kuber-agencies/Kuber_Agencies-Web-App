const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Send RFQ confirmation to customer
const sendRFQConfirmation = async (rfq) => {
  const transporter = createTransporter();
  await transporter.sendMail({
    from: `"Kuber Agencies" <${process.env.EMAIL_USER}>`,
    to: rfq.email,
    subject: 'Your Quotation Request Received – Kuber Agencies',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <div style="background: #0f2044; padding: 24px; text-align: center;">
          <h1 style="color: #f5c842; margin: 0; font-size: 24px;">KUBER AGENCIES</h1>
          <p style="color: #aac4ff; margin: 4px 0 0;">Trusted Hardware Supplier · Chennai</p>
        </div>
        <div style="padding: 32px; background: #fff; border: 1px solid #e0e0e0;">
          <h2 style="color: #0f2044;">Request Received!</h2>
          <p>Dear <strong>${rfq.name}</strong>,</p>
          <p>Thank you for your enquiry. We have received your Request for Quotation and our team will get back to you within <strong>24 business hours</strong>.</p>
          <div style="background: #f7f9fc; border-left: 4px solid #f5c842; padding: 16px; margin: 20px 0; border-radius: 4px;">
            <h3 style="margin: 0 0 12px; color: #0f2044;">Your RFQ Summary</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 6px 0; color: #666;">Product</td><td style="padding: 6px 0; font-weight: bold;">${rfq.productName}</td></tr>
              <tr><td style="padding: 6px 0; color: #666;">Quantity</td><td style="padding: 6px 0; font-weight: bold;">${rfq.quantity} ${rfq.unit}</td></tr>
              <tr><td style="padding: 6px 0; color: #666;">Delivery Location</td><td style="padding: 6px 0; font-weight: bold;">${rfq.deliveryLocation}</td></tr>
              <tr><td style="padding: 6px 0; color: #666;">Required By</td><td style="padding: 6px 0; font-weight: bold;">${new Date(rfq.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</td></tr>
            </table>
          </div>
          <p>For urgent enquiries, reach us directly:</p>
          <p>📞 <strong>+91 98765 43210</strong> &nbsp;|&nbsp; 💬 <a href="https://wa.me/919876543210" style="color: #25D366;">WhatsApp</a></p>
        </div>
        <div style="background: #0f2044; padding: 16px; text-align: center;">
          <p style="color: #aac4ff; font-size: 13px; margin: 0;">© ${new Date().getFullYear()} Kuber Agencies · Madambakkam, Chennai · GST: XXXXXXXXXXXX</p>
        </div>
      </div>
    `
  });
};

// Notify admin about new RFQ
const sendAdminRFQAlert = async (rfq) => {
  const transporter = createTransporter();
  const priorityColor = rfq.priority === 'High' ? '#dc2626' : rfq.priority === 'Medium' ? '#d97706' : '#059669';

  await transporter.sendMail({
    from: `"Kuber Agencies System" <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: `[${rfq.priority} PRIORITY] New RFQ from ${rfq.name} – ${rfq.productName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <div style="background: #0f2044; padding: 20px;">
          <h2 style="color: #f5c842; margin: 0;">🔔 New RFQ Received</h2>
        </div>
        <div style="padding: 24px; border: 1px solid #e0e0e0;">
          <p style="display: inline-block; background: ${priorityColor}; color: white; padding: 4px 12px; border-radius: 4px; font-weight: bold; font-size: 13px;">
            ${rfq.priority.toUpperCase()} PRIORITY · Lead Score: ${rfq.leadScore}/100
          </p>
          <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
            <tr style="background: #f7f9fc;"><td style="padding: 10px; font-weight: bold; width: 40%;">Customer Name</td><td style="padding: 10px;">${rfq.name}</td></tr>
            <tr><td style="padding: 10px; font-weight: bold;">Company</td><td style="padding: 10px;">${rfq.company || '—'}</td></tr>
            <tr style="background: #f7f9fc;"><td style="padding: 10px; font-weight: bold;">Email</td><td style="padding: 10px;"><a href="mailto:${rfq.email}">${rfq.email}</a></td></tr>
            <tr><td style="padding: 10px; font-weight: bold;">Phone</td><td style="padding: 10px;"><a href="tel:${rfq.phone}">${rfq.phone}</a></td></tr>
            <tr style="background: #f7f9fc;"><td style="padding: 10px; font-weight: bold;">Product</td><td style="padding: 10px;">${rfq.productName}</td></tr>
            <tr><td style="padding: 10px; font-weight: bold;">Quantity</td><td style="padding: 10px;">${rfq.quantity} ${rfq.unit}</td></tr>
            <tr style="background: #f7f9fc;"><td style="padding: 10px; font-weight: bold;">Delivery Location</td><td style="padding: 10px;">${rfq.deliveryLocation}</td></tr>
            <tr><td style="padding: 10px; font-weight: bold;">Deadline</td><td style="padding: 10px;">${new Date(rfq.deadline).toLocaleDateString('en-IN')}</td></tr>
            <tr style="background: #f7f9fc;"><td style="padding: 10px; font-weight: bold;">Notes</td><td style="padding: 10px;">${rfq.additionalNotes || '—'}</td></tr>
          </table>
        </div>
      </div>
    `
  });
};

// Send documents via email
const sendDocumentsEmail = async ({ to, name, documents }) => {
  const transporter = createTransporter();
  const docList = documents.map(d => `<li><a href="${d.file.url}">${d.name}</a></li>`).join('');

  await transporter.sendMail({
    from: `"Kuber Agencies" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Requested Documents – Kuber Agencies',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #0f2044; padding: 24px; text-align: center;">
          <h1 style="color: #f5c842; margin: 0;">KUBER AGENCIES</h1>
        </div>
        <div style="padding: 32px; background: #fff; border: 1px solid #e0e0e0;">
          <h2>Documents Requested</h2>
          <p>Dear ${name},</p>
          <p>Please find the requested documents below:</p>
          <ul style="line-height: 2;">${docList}</ul>
          <p>These are official documents of Kuber Agencies. For any queries, contact us at <strong>+91 98765 43210</strong>.</p>
        </div>
      </div>
    `
  });
};

module.exports = { sendRFQConfirmation, sendAdminRFQAlert, sendDocumentsEmail };
