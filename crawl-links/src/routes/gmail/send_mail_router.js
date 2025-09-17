const express = require("express");
const nodemailer = require("nodemailer");
const { OAuth2Client } = require("google-auth-library");

const { configEnv } = require("../../configEnv");
const { crawlWebsite } = require("../../crawl/scraping/main");

const { measureTime } = require("../../crawl/func/measure");
const { writeFileSync, existsSync, readFileSync } = require("fs");

const emailRouter = express.Router();

configEnv();

// Khởi tạo OAuth2Client với Client ID và Client Secret
const myOAuth2Client = new OAuth2Client(
  process.env.GOOGLE_MAILER_CLIENT_ID,
  process.env.GOOGLE_MAILER_CLIENT_SECRET
);
// Set Refresh Token vào OAuth2Client Credentials
myOAuth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_MAILER_REFRESH_TOKEN,
});

// Tạo API /email/send với method POST
emailRouter.post("/send", async (req, res) => {
  const { email, url, uid_socket, color } = req.body;
  // writeFileSync(`src/history/${uid_socket}.json`, "")
  const parseUrl = url.includes("http") ? url : new URL(`https://${url}`).href;
  try {
    // Lấy thông tin gửi lên từ client qua body
    console.log({ email, url, uid_socket });
    if (
      !email || !url || !uid_socket
    )
      throw new Error("Please provide email, subject and url!");
    const result = await measureTime(
      async () => await crawlWebsite(parseUrl, uid_socket, color)
    );

    if (
      !existsSync(`src/history/${uid_socket}`)
    ) {
      throw new Error("The project has been deleted!");
    }

    const currentMain = {
      ...JSON.parse(readFileSync(`src/history/${uid_socket}/main.json`)),
      elapsedTime: result.elapsedTime,
    };

    console.log(result);

    writeFileSync(
      `src/history/${uid_socket}/main.json`,
      JSON.stringify(currentMain),
      "utf-8"
    );

    const htmlResult = result.runner.replace(/\[object Object\]/g, "");

    const myAccessTokenObject = await myOAuth2Client.getAccessToken();

    // Access Token sẽ nằm trong property 'token' trong Object mà chúng ta vừa get được ở trên
    const myAccessToken = myAccessTokenObject?.token;

    // Tạo một biến Transport từ Nodemailer với đầy đủ cấu hình, dùng để gọi hành động gửi mail
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.ADMIN_EMAIL_ADDRESS,
        clientId: process.env.GOOGLE_MAILER_CLIENT_ID,
        clientSecret: process.env.GOOGLE_MAILER_CLIENT_SECRET,
        refresh_token: process.env.GOOGLE_MAILER_REFRESH_TOKEN,
        accessToken: myAccessToken,
      },
    });

    const mailOptions = {
      to: email, // Gửi đến ai?
      subject: `Kết quả trả về từ tên miền ${process.env.DOMAIN_NAME}:${process.env.PORT} cho trang web ${url}`, // Tiêu đề email
      html: htmlResult, // Nội dung email
    };

    // Gọi hành động gửi email
    await transport.sendMail(mailOptions);

    // Không có lỗi gì thì trả về success
    res.status(200).json({
      url: parseUrl.toString().split("/")[2],
      elapsedTime: result.elapsedTime,
      message: "Email sent successfully.",
    });
  } catch (error) {
    console.log(error)
    // Có lỗi thì các bạn log ở đây cũng như gửi message lỗi về phía client

  }
});

module.exports = emailRouter;
