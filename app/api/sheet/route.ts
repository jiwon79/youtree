import { google } from "googleapis";

interface ExtendedRequest extends Request {
  json: () => Promise<{ name: string }>
}

export const POST = async (request: ExtendedRequest) => {
  console.log(process.env.GOOGLE_PRIVATE_KEY);
  const body = await request.json()
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    },
    scopes: [
      'https://www.googleapis.com/auth/drive',
      'https://www.googleapis.com/auth/drive.file',
      'https://www.googleapis.com/auth/spreadsheets',
    ],
  });

  const sheets = google.sheets({ version: "v4", auth });
  const spreadSheetId = process.env.GOOGLE_SPREADSHEET_ID;

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
