// Bright Future Bot — WhatsApp (Twilio Sandbox + Vercel)
// Uses TwiML response (REQUIRED for Sandbox)

import express from "express";
import bodyParser from "body-parser";
import twilio from "twilio";

const app = express();

// Twilio sends x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// Menu text
const menuText = `👋 Welcome to *Bright Future Micro-Investment Bot* 🌩️

Menu:
1️⃣ join
2️⃣ paid
3️⃣ referral

Reply with a word or number exactly.
`;

// WhatsApp webhook
app.post("/whatsapp", (req, res) => {
  const incomingMsg = (req.body.Body || "").trim().toLowerCase();

  let reply = "";

  switch (incomingMsg) {
    case "hi":
    case "menu":
      reply = menuText;
      break;

    case "1":
    case "join":
      reply =
        "🔥 Welcome to Bright Future!\n\nTo continue, send *paid* after payment.";
      break;

    case "2":
    case "paid":
      reply = `💰 Payment Details:

Bank: Monie Point
Account Name: Delvers Science High School
Account Number: 8123331941

After payment, reply *paid*.`;
      break;

    case "3":
    case "referral":
      reply =
        "📢 Your referral code: *BRIGHT123*\n\nShare it with friends to earn rewards!";
      break;

    default:
      reply =
        "⚡ I no understand that.\nType *menu* to see options.";
  }

  // TwiML response (THIS IS THE KEY FIX)
  const twiml = new twilio.twiml.MessagingResponse();
  twiml.message(reply);

  res.set("Content-Type", "text/xml");
  res.status(200).send(twiml.toString());
});

// Root route (optional, for browser test)
app.get("/", (req, res) => {
  res.send("Bright Future Bot is live ⚡");
});

// Vercel port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Bot running on port ${PORT}`);
});
