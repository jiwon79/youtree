import { createTransport, Transporter } from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

export interface MailOption {
  to: string;
  subject: string;
  text: string;
}

export class MailService {
  private static instance: MailService;
  private transporter: Transporter<SMTPTransport.SentMessageInfo>;

  constructor() {
    this.transporter = createTransport({
      host: 'smtp.gmail.com',
      secure: false,
      requireTLS: true ,
      auth: {
        user: process.env.MAIL_ADDRESS,
        pass: process.env.MAIL_PASSWORD,
      }
    });
  }

  public static getInstance(): MailService {
    if (!MailService.instance) {
      MailService.instance = new MailService();
    }
    return MailService.instance;
  }

  public async sendMail(mailOption: MailOption) {
    const mailOptions = {
      from: process.env.MAIL_ADDRESS,
      ...mailOption,
    }

    return this.transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

  }
}
