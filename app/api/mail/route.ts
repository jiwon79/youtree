import { MailService } from "@/service/mail";

interface ExtendedRequest extends Request {
  json: () => Promise<{ name: string }>
}

export const POST = async (request: ExtendedRequest) => {
  // const body = await request.json();

  const mailService = MailService.getInstance();

  const mailOption = {
    to: 'leo@bluesignum.com',
    subject: '메일 테스트 제목',
    text: '메일 내용,'
  }

  const response = await mailService.sendMail(mailOption);

  return new Response('text');
  // return new Response(JSON.stringify(response), {
  //   status: response.status
  // });
}
