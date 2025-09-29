import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';
import sgMail from '@sendgrid/mail';
import { google } from 'googleapis';
import { randomUUID } from 'crypto';

// Contact schema validation
const insertContactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  company: z.string().optional(),
});

// In-memory storage (global for this function)
const contacts = new Map<string, any>();

// Email notification function
async function sendEmail(data: any) {
  if (!process.env.SENDGRID_API_KEY) {
    console.log("Email skipped - no SendGrid API key");
    return false;
  }

  try {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    await sgMail.send({
      to: "info.unlockhq@gmail.com",
      from: "noreply@unlockhq.com",
      subject: "🚀 New Contact Form Submission - UnlockHQ",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #4f46e5;">🚀 New Contact Form Submission</h2>
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px;">
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
            <p><strong>Phone:</strong> ${data.phone || "Not provided"}</p>
            <p><strong>Company:</strong> ${data.company || "Not provided"}</p>
          </div>
        </div>
      `
    });
    return true;
  } catch (error) {
    console.error("Email error:", error);
    return false;
  }
}

// Google Sheets function
async function addToSheets(contact: any) {
  const GOOGLE_SHEETS_ID = process.env.GOOGLE_SHEETS_ID;
  const GOOGLE_CREDS = process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS;

  if (!GOOGLE_SHEETS_ID || !GOOGLE_CREDS) {
    console.log("Google Sheets skipped - missing credentials");
    return false;
  }

  try {
    const credentials = JSON.parse(GOOGLE_CREDS);
    const auth = new google.auth.JWT({
      email: credentials.client_email,
      key: credentials.private_key.replace(/\\n/g, "\n"),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"]
    });

    await auth.authorize();

    const sheets = google.sheets("v4");
    const sheetId = GOOGLE_SHEETS_ID.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/)?.[1] || GOOGLE_SHEETS_ID;
    
    await sheets.spreadsheets.values.append({
      auth,
      spreadsheetId: sheetId,
      range: "Sheet1!A:F",
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values: [[
          new Date().toISOString(),
          contact.name,
          contact.email,
          contact.phone || "",
          contact.company || "",
          "UnlockHQ Website"
        ]]
      }
    });
    return true;
  } catch (error) {
    console.error("Google Sheets error:", error);
    return false;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed' 
    });
  }

  try {
    const contactData = insertContactSchema.parse(req.body);
    
    const contact = {
      id: randomUUID(),
      name: contactData.name,
      email: contactData.email,
      phone: contactData.phone || null,
      company: contactData.company || null,
      createdAt: new Date()
    };
    
    contacts.set(contact.id, contact);

    // Send notifications (non-blocking)
    sendEmail(contactData).catch(console.error);
    addToSheets(contact).catch(console.error);

    return res.status(200).json({
      success: true,
      message: "Thank you for your message! We'll be in touch soon.",
      contact,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.errors,
      });
    }
    
    console.error('Contact form error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to submit contact form. Please try again.',
    });
  }
}
