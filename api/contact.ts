import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../server/storage';
import { insertContactSchema } from '../shared/schema';
import { sendContactNotification } from '../server/email';
import { addToGoogleSheets } from '../server/sheets';
import { z } from 'zod';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed' 
    });
  }

  try {
    const contactData = insertContactSchema.parse(req.body);
    const contact = await storage.createContact(contactData);

    // Send email notification (non-blocking)
    sendContactNotification(contactData).catch((error) => {
      console.error('Email notification failed:', error);
    });

    // Add to Google Sheets (non-blocking)
    addToGoogleSheets(contact).catch((error) => {
      console.error('Google Sheets integration failed:', error);
    });

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
