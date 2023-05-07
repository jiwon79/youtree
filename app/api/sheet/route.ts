import { SheetService } from "@/service/sheet";

interface ExtendedRequest extends Request {
  json: () => Promise<{ name: string }>
}

export const POST = async (request: ExtendedRequest) => {
  const body = await request.json()

  const sheetService = SheetService.getInstance();
  const values = [
    ["name", "email", "phone", "message"],
  ];

  const response = await sheetService.append("Sheet1", "A1", values);

  return new Response(JSON.stringify(response), {
    status: response.status
  });
}
