import nodemailer, { TransportOptions, Transporter } from "nodemailer";
import { mailOptions } from "../interfaces/util";
import IUser from "../interfaces/userInterface";
import pug from "pug";
import { currentWorkingDirectory } from "./utility";
import { htmlToText } from "html-to-text";

type templateOption = "welcome";

class Email {
  public to: string;
  public firstName: string;
  public from: string;

  constructor(public user: IUser, public url: string) {
    this.to = user.email;
    this.firstName = user.name.split(" ")[0];
    this.from = `Hashib Raja <${process.env.EMAIL_FROM}>`;
  }

  // create a transporter
  public newTransport(): Transporter<unknown> {
    const transporter = nodemailer.createTransport({
      host: process.env.EAMIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      auth: {
        user: process.env.EAMIL_USERNAME,
        pass: process.env.EAMIL_PASSWORD,
      },
    });

    return transporter;
  }

  // Send the actual mail
  public async send(template: templateOption, subject: string) {
    // 1) Render html based on a pug template
    const html = pug.renderFile(
      `${currentWorkingDirectory}/views/emails/${template}.pug`,
      {
        firstName: this.firstName,
        url: this.url,
        subject,
      }
    );

    // 2) Define email opiton
    const mailOption = {
      from: this.from,
      to: this.to,
      subject, // Subject line
      html, // html body
      text: htmlToText(html), // plain text body
    };

    const transporter = this.newTransport();
    await transporter.sendMail(mailOption);
  }

  public async sendWelcome() {
    await this.send("welcome", "Welcome to the Natours Family!");
  }
}

export const sendMail = async (option: mailOptions) => {
  // create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EAMIL_HOST,
    port: process.env.EAMIL_PORT,
    auth: {
      user: process.env.EAMIL_USERNAME,
      pass: process.env.EAMIL_PASSWORD,
    },
  } as TransportOptions);

  // Defined the email opioin
  const mailOption = {
    from: "Hashib Raja <hashibraja23@gmail.com>",
    to: option.email,
    subject: option.subject, // Subject line
    text: option.message, // plain text body
    html: option.html || "<b>Hello world?</b>", // html body
  };

  // Actually send the email
  await transporter.sendMail(mailOption);
};

export default sendMail;
