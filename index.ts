import express, { Express, Request, Response } from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

interface IBid {
  from: string;
}

const app: Express = express();
const port: number = +(process.env.PORT || 3000);

app.use(express.json());

const transporter = nodemailer.createTransport({
  host: "smtp.yandex.ru",
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL,
    pass: process.env.PASS,
  },
});

app.get("/", (req: Request, res: Response) => {
  res.send(
    "🚄 Express + ☑️ Typescript + 📧 Nodemailer\n🏠 My github - https://github.com/SonOfStep"
  );
});

app.post("/bid", (req: Request, res: Response) => {
  const bid: IBid | undefined = req.body;

  if (!bid?.from) {
    return res
      .status(400)
      .json({ message: "Запрос содержит не корректные данные" });
  }

  const mailOptions = {
    from: "botdalauly@yandex.ru",
    to: "omarionurmsad@gmail.com",
    subject: "Заявка, которая пришла с личного сайта",
    text: bid.from,
    html: `<table border="0" cellpadding="0" cellspacing="0" style="margin: 0; padding: 0" width="100%"> <tr> <td> <center style="margin: auto; padding:24px; max-width: 512px; width: 100%; background-color: rgb(249 250 251)"> <img src="https://source.unsplash.com/random/512x512/?1" alt="" style="width: 100%;background-color: rgb(107 114 128);object-fit: cover;object-position: center"> <div style="margin-top: 24px;margin-bottom: 8px;text-align: center"> </div></center> </td></tr><tr> <td> <center style="display: block;font-size: 12px;line-height: 16px;font-weight: 500;text-transform: uppercase;color: rgb(124 58 237)">Заявка с сайта</center> </tr><tr> <td> <center style="font-size: 22px;line-height: 28px;font-weight: 600;">${bid.from}</center></td></tr></table>`,
  };

  transporter.sendMail(mailOptions, function (err, info) {
    if (err) {
      return res.status(500).json({
        message: "Не удалось отправить письмо." + mailOptions.from,
        error: err.message,
      });
    }
    return res.json({ message: "Письмо отправлено: " + info.response });
  });
});

app.listen(port, () => {
  console.log(`⚡ [server]: Server is running at https://localhost:${port}`);
  transporter.verify(function (error, success) {
    if (error) {
      console.log(error);
    } else {
      console.log("Server is ready to take our messages");
    }
  });
});
