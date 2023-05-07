import { google } from "googleapis";

interface ExtendedRequest extends Request {
  json: () => Promise<{ name: string }>
}

export const POST = async (request: ExtendedRequest) => {
  const body = await request.json()
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      client_email: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_EMAIL,
      private_key: process.env.NEXT_PUBLIC_GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    },
    scopes: [
      'https://www.googleapis.com/auth/drive',
      'https://www.googleapis.com/auth/drive.file',
      'https://www.googleapis.com/auth/spreadsheets',
    ],
  });

  const sheets = google.sheets({ version: "v4", auth });
  const spreadSheetId = process.env.NEXT_PUBLIC_GOOGLE_SPREADSHEET_ID;

  const values = [
    ["name", "email", "phone", "message"],
  ];

  const resource = {
    values,
  };

  const response = await sheets.spreadsheets.values.append({
    spreadsheetId: spreadSheetId,
    range: "Sheet1!A1",
    valueInputOption: "USER_ENTERED",
    requestBody: resource,
  });

  return new Response("hello");
}
