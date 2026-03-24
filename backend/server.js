const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const { ConvexHttpClient } = require("convex/browser");

dotenv.config({ path: '.env.local' });
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Convex client lazily per-request (avoids startup connection pooling lag)
const getConvexClient = (() => {
  let client;
  return () => {
    if (!client) {
      const url = process.env.CONVEX_URL || "https://example.convex.cloud";
      client = new ConvexHttpClient(url);
    }
    return client;
  };
})();

// Allow requests from Vite frontend dev server and production Vercel URL
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://modern-dev-portfolio.vercel.app',
  ],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));
app.use(express.json());

// Root route REQUIRED by Render Health Checks. 
// Do NOT remove this, or Render will mark the site as unhealthy and show Bad Gateway.
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Portfolio API is running 🚀' });
});

// Basic health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Portfolio API is running' });
});

// Get all projects via Convex DB
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await getConvexClient().query("projects:get");
    res.json({ success: true, data: projects });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching from Convex", error: error.message });
  }
});

// Send a message via Convex DB
app.post('/api/messages', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    await getConvexClient().mutation("messages:send", { name, email, message });
    res.json({ success: true, message: "Message securely sent to Convex DB!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error saving to Convex", error: error.message });
  }
});

// Create a reusable transporter (lazily, to avoid startup cost)
const getTransporter = (() => {
  let transporter;
  return () => {
    if (!transporter) {
      transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
    }
    return transporter;
  };
})();

// Contact form — sends notification to owner AND greeting to visitor
app.post('/api/contact/email', async (req, res) => {
  const { name, email, message } = req.body;

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    return res.status(500).json({ success: false, message: 'Email credentials not configured in backend/.env.local' });
  }

  try {
    const transporter = getTransporter();

    // 1. Notify owner
    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: `📬 New Message from ${name}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0f0f0f;color:#fff;padding:32px;border-radius:12px;border:1px solid #333;">
          <h2 style="color:#a855f7;margin-top:0;">New Portfolio Message</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}" style="color:#a855f7;">${email}</a></p>
          <hr style="border-color:#333;margin:20px 0;"/>
          <p><strong>Message:</strong></p>
          <blockquote style="border-left:3px solid #a855f7;padding-left:16px;color:#ccc;margin:0;">${message}</blockquote>
          <p style="margin-top:24px;color:#555;font-size:12px;">Sent via your Portfolio Contact Form</p>
        </div>
      `,
    });

    // 2. Send greeting/acknowledgement to the visitor
    await transporter.sendMail({
      from: `"Boggarapu Sai Jayanth" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Thanks for reaching out, ${name}! 👋`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0f0f0f;color:#fff;padding:32px;border-radius:12px;border:1px solid #333;">
          <h2 style="color:#a855f7;margin-top:0;">Hey ${name}, thanks for contacting me! 🎉</h2>
          <p style="color:#ccc;line-height:1.7;">
            I've received your message and I'll get back to you as soon as possible — usually within 24–48 hours.
          </p>
          <p style="color:#ccc;line-height:1.7;">
            In the meantime, feel free to check out my latest projects on my portfolio!
          </p>
          <hr style="border-color:#333;margin:24px 0;"/>
          <p style="color:#888;font-size:13px;"><strong>Your message:</strong></p>
          <blockquote style="border-left:3px solid #a855f7;padding-left:16px;color:#aaa;margin:0;font-size:13px;">${message}</blockquote>
          <hr style="border-color:#333;margin:24px 0;"/>
          <p style="color:#555;font-size:12px;">
            Best regards,<br/>
            <strong style="color:#a855f7;">Boggarapu Sai Jayanth</strong>
          </p>
        </div>
      `,
    });

    res.json({ success: true, message: 'Emails sent successfully!' });
  } catch (error) {
    console.error("Nodemailer error:", error);
    res.status(500).json({ success: false, message: 'Failed to send email', error: error.toString() });
  }
});

// Admin Auth Route using JWT
app.post('/api/auth/login', (req, res) => {
  const { password } = req.body;
  if (password === process.env.ADMIN_PASSWORD) {
    const token = jwt.sign({ admin: true }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ success: true, token });
  } else {
    res.status(401).json({ success: false, message: "Invalid admin password" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📦 Convex URL: ${process.env.CONVEX_URL || 'not set'}`);
});
