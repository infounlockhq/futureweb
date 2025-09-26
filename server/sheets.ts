// Google Sheets service integration
import { google } from 'googleapis';
import type { Contact } from '@shared/schema';

// Initialize Google Sheets API
const sheets = google.sheets('v4');

interface GoogleSheetsCredentials {
  type: string;
  project_id: string;
  private_key_id: string;
  private_key: string;
  client_email: string;
  client_id: string;
  auth_uri: string;
  token_uri: string;
  auth_provider_x509_cert_url: string;
  client_x509_cert_url: string;
}

// Extract sheet ID from URL if needed
function extractSheetId(sheetIdOrUrl: string): string {
  // If it's a full URL, extract the sheet ID
  const match = sheetIdOrUrl.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (match) {
    return match[1];
  }
  // Otherwise assume it's already a sheet ID
  return sheetIdOrUrl;
}

// You'll need to set your Google Sheets ID and credentials
const GOOGLE_SHEETS_ID = process.env.GOOGLE_SHEETS_ID ? extractSheetId(process.env.GOOGLE_SHEETS_ID) : undefined;
const GOOGLE_SERVICE_ACCOUNT_CREDENTIALS = process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS;

export async function addToGoogleSheets(contact: Contact): Promise<boolean> {
  if (!GOOGLE_SHEETS_ID || !GOOGLE_SERVICE_ACCOUNT_CREDENTIALS) {
    console.log('Google Sheets integration skipped - missing credentials or sheet ID');
    return false;
  }

  try {
    // Parse service account credentials
    const credentials: GoogleSheetsCredentials = JSON.parse(GOOGLE_SERVICE_ACCOUNT_CREDENTIALS);
    
    // Create JWT client
    const auth = new google.auth.JWT({
      email: credentials.client_email,
      key: credentials.private_key.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });

    // Authenticate
    await auth.authorize();

    // Prepare the data row
    const timestamp = new Date().toISOString();
    const values = [
      [
        timestamp, // Submission Date
        contact.name,
        contact.email,
        contact.phone || '',
        contact.company || '',
        'UnlockHQ Website' // Source
      ]
    ];

    // Check if headers exist, if not add them
    try {
      const headerResponse = await sheets.spreadsheets.values.get({
        auth,
        spreadsheetId: GOOGLE_SHEETS_ID,
        range: 'Sheet1!A1:F1'
      });

      // If no headers exist, add them
      if (!headerResponse.data.values || headerResponse.data.values.length === 0) {
        await sheets.spreadsheets.values.update({
          auth,
          spreadsheetId: GOOGLE_SHEETS_ID,
          range: 'Sheet1!A1:F1',
          valueInputOption: 'RAW',
          requestBody: {
            values: [['Submission Date', 'Name', 'Email', 'Phone', 'Company', 'Source']]
          }
        });
      }
    } catch (headerError) {
      console.log('Adding headers to sheet:', headerError);
    }

    // Append the new contact data
    const response = await sheets.spreadsheets.values.append({
      auth,
      spreadsheetId: GOOGLE_SHEETS_ID,
      range: 'Sheet1!A:F',
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values
      }
    });

    console.log('Successfully added contact to Google Sheets:', response.data.updates);
    return true;

  } catch (error) {
    console.error('Error adding to Google Sheets:', error);
    return false;
  }
}

// Helper function to create a new spreadsheet (optional)
export async function createContactsSpreadsheet(title: string = 'UnlockHQ Contacts'): Promise<string | null> {
  if (!GOOGLE_SERVICE_ACCOUNT_CREDENTIALS) {
    console.log('Cannot create spreadsheet - missing credentials');
    return null;
  }

  try {
    const credentials: GoogleSheetsCredentials = JSON.parse(GOOGLE_SERVICE_ACCOUNT_CREDENTIALS);
    
    const auth = new google.auth.JWT({
      email: credentials.client_email,
      key: credentials.private_key.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });

    await auth.authorize();

    const response = await sheets.spreadsheets.create({
      auth,
      requestBody: {
        properties: {
          title
        },
        sheets: [{
          properties: {
            title: 'Contacts'
          }
        }]
      }
    });

    console.log('Created new spreadsheet with ID:', response.data.spreadsheetId);
    return response.data.spreadsheetId || null;

  } catch (error) {
    console.error('Error creating spreadsheet:', error);
    return null;
  }
}