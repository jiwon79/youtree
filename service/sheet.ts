import { google } from "googleapis";
import { GoogleAuth } from "google-auth-library";

export interface SheetResponse {
  status: number;
  values: string[][];
}

export class SheetService {
  private static instance: SheetService;
  private readonly sheet;
  private readonly sheetId = process.env.NEXT_PUBLIC_GOOGLE_SPREADSHEET_ID;

  constructor() {
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

    this.sheet = google.sheets({version: "v4", auth});
  }

  public static getInstance(): SheetService {
    if (!SheetService.instance) {
      SheetService.instance = new SheetService();
    }
    return SheetService.instance;
  }

  public async append(sheetName: string, range: string, values: string[][]): SheetResponse {
    const resource = {values};

    const response = await this.sheet.spreadsheets.values.append({
      spreadsheetId: this.sheetId,
      range: `${sheetName}!${range}`,
      valueInputOption: "USER_ENTERED",
      requestBody: resource,
    });

    return {
      status: response.status,
      values: response.config.data.values,
    };
  }
}
