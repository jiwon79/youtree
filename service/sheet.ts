import { google } from "googleapis";

export interface SheetResponse {
  status: number;
  values: string[][];
}

export class SheetService {
  private static instance: SheetService;
  private readonly sheet;
  private readonly sheetId: string = process.env.GOOGLE_SPREADSHEET_ID!;

  constructor() {
    const client_id: string = process.env.GOOGLE_CLIENT_ID!;
    const client_email: string = process.env.GOOGLE_CLIENT_EMAIL!;
    const private_key: string = process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, '\n');

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_id: client_id,
        client_email: client_email,
        private_key: private_key,
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

  public async append(sheetName: string, range: string, values: string[][]): Promise<SheetResponse> {
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
