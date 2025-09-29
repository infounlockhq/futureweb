import { z } from 'zod';
import sgMail from '@sendgrid/mail';
import { google } from 'googleapis';
import { randomUUID } from 'crypto';

const contacts = new Map();

const insertContactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  company: z.string().optional(),
});

async function sendEmail(data) {
  if (!process.env.SENDGRID_API_KEY) {
    console.log("Email skipped");
    return false;
  }
  try {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    await sgMail.send({
      to: "info.unlockhq@gmail.com",
      from: "noreply@unlockhq.com",
      subject: "🚀 New Contact - UnlockHQ",
      html: `<h2>New Contact</h2><p><strong>Name:</strong> ${data.name}</p><p><strong>Email:</strong> ${data.email}</p><p><strong>Phone:</strong> ${data.phone || "N/A"}</p><p><strong>Company:</strong> ${data.company || "N/A"}</p>`
    });
    return true;
  } catch (e) {
    console.error("Email error:", e);
    return false;
  }
}

async function addToSheets(contact) {
  const GOOGLE_SHEETS_ID = process.env.GOOGLE_SHEETS_ID;
  const GOOGLE_CREDS = process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS;
  if (!GOOGLE_SHEETS_ID || !GOOGLE_CREDS) {
    console.log("Sheets skipped");
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
        values: [[new Date().toISOString(), contact.name, contact.email, contact.phone || "", contact.company || "", "UnlockHQ Website"]]
      }
    });
    return true;
  } catch (e) {
    console.error("Sheets error:", e);
    return false;
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
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
    
    sendEmail(contactData).catch(console.error);
    addToSheets(contact).catch(console.error);

    return res.status(200).json({
      success: true,
      message: "Thank you for your message! We'll be in touch soon.",
      contact
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors: error.errors });
    }
    console.error('Error:', error);
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
}
