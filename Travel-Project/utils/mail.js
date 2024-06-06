const nodemailer = require("nodemailer");
const express = require("express");
const path = require("path");

exports.mailDetails = (email, orderId, mailTemp, attachments) => {
  const transporter = nodemailer.createTransport({
    service: process.env.MAIL_HOST,
    secure: false,
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.USER_PASSWORD,
    },
  });

  let message = null;

  if (attachments) {
    message = {
      from: process.env.USER_EMAIL,
      to: email,
      subject: "Regarding Your Booking",
      text: orderId,
      html: mailTemp,
      attachments: [attachments],
    };
  } else {
    message = {
      from: process.env.USER_EMAIL,
      to: email,
      subject: "Regarding Your Booking",
      text: orderId,
      html: mailTemp,
    };
  }

  const messageRes = transporter
    .sendMail(message)

    .then((messageRes) => {
      //   response.status(200).json({
      //     message: "Mail Sent",
      //     msgId: messageRes.messageId,
      //     preview: nodemailer.getTestMessageUrl(messageRes),
      //   });
      console.log("Mail Sent");
    })
    .catch((error) => {
      //   response.status(500).json({ message: error });
      console.log(error.message);
    });
};
