// Bright Future Bot — Vercel + WhatsApp (Environment Variables)b

import express from 'express';
import bodyParser from 'body-parser';
import twilio from 'twilio';

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

// Twilio credentials from environment (do NOT hardcode)
const accountSid = process.env.TWILIO_ACCOUNT_SID; // Your SID
const authToken = process.env.TWILIO_AUTH_TOKEN;   // Your Auth Token
const twilioNumber = process.env.TWILIO_WHATSAPP_NUMBER;

// Initialize Twilio client
const client = twilio(accountSid, authToken);

// Menu text
const menuText = `Hi! Welcome to Bright Future Bot 🌩️

Menu Options:
1. join
2. paid
3. referral

Reply with a word or number exactly to proceed.
`;

// Function to reply to WhatsApp messages
function replyMessage(from, body) {
  const text = body.trim().toLowerCase();
  let message = '';

  switch (text) {
    case 'hi':
    case 'menu':
      message = menuText;
      break;

    case '1':
    case 'join':
      message = "🔥 Welcome to Bright Future! To join our micro-investment, send *paid* next.";
      break;

    case '2':
    case 'paid':
      message = `💰 To join, transfer money to:
Bank: Monie Point
Account Name: Delvers Science High School
Account Number: 8123331941

After payment, reply "paid" to confirm.`;
      break;

    case '3':
    case 'referral':
      message = "📢 Share this referral code with friends: *BRIGHT123*\n\nTell them to send this code when they join!";
      break;

    default:
      message = "⚡ I no understand that one. Type *menu* to see options.";
  }

  // Reply via Twilio
  client.messages
    .create({
      from: twilioNumber,
      to: from,
      body: message
    })
    .then(msg => console.log('Message sent:', msg.sid))
    .catch(err => console.error('Twilio Error:', err));
}

// Vercel webhook endpoint
app.post('/whatsapp', (req, res) => {
  const from = req.body.From;
  const body = req.body.Body || '';

  console.log('Incoming message from:', from, 'Body:', body);

  replyMessage(from, body);

  res.send('<Response></Response>'); // Twilio expects XML
});

// Vercel-ready port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`⚡ Bot is running on port ${PORT}`));
