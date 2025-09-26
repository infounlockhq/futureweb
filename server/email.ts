// SendGrid email service integration
import sgMail from '@sendgrid/mail';

if (!process.env.SENDGRID_API_KEY) {
  console.warn('SENDGRID_API_KEY not found. Email notifications will be disabled.');
} else {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
}

export async function sendContactNotification(data: ContactFormData): Promise<boolean> {
  if (!process.env.SENDGRID_API_KEY) {
    console.log('Email notification skipped - no SendGrid API key');
    return false;
  }

  try {
    const msg = {
      to: 'info.unlockhq@gmail.com', // Your email address
      from: 'noreply@unlockhq.com', // This needs to be a verified sender in SendGrid
      subject: '🚀 New Contact Form Submission - UnlockHQ',
      text: `
New contact form submission from UnlockHQ website:

Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone || 'Not provided'}
Company: ${data.company || 'Not provided'}

Please respond to this inquiry promptly!
      `,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #4f46e5; margin-bottom: 20px;">🚀 New Contact Form Submission</h2>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #1e293b; margin-top: 0;">Contact Details:</h3>
            
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
            <p><strong>Phone:</strong> ${data.phone || 'Not provided'}</p>
            <p><strong>Company:</strong> ${data.company || 'Not provided'}</p>
          </div>
          
          <p style="color: #64748b;">This form was submitted from your UnlockHQ website. Please respond promptly to this potential client inquiry!</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #94a3b8; font-size: 12px;">
            <p>UnlockHQ - AI Automation Solutions</p>
          </div>
        </div>
      `
    };

    await sgMail.send(msg);
    console.log('Contact notification email sent successfully');
    return true;
  } catch (error) {
    console.error('Error sending contact notification email:', error);
    return false;
  }
}