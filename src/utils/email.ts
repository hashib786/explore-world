import nodemailer, { TransportOptions } from "nodemailer";
import { mailOptions } from "../interfaces/util";

const sendMail = async (option: mailOptions) => {
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
