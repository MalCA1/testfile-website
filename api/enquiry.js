const ENQUIRY_RECIPIENT = "heritagecanvas@gmail.com";
const requestCounts = new Map();
const RATE_WINDOW_MS = 60_000;
const RATE_LIMIT = 5;

function setCors(req, res) {
  const origin = req.headers && req.headers.origin;
  const allowedOrigin = process.env.ALLOWED_ORIGIN;
  if (!origin) return true;
  if (!allowedOrigin || origin !== allowedOrigin) return false;
  res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  res.setHeader("Vary", "Origin");
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  }
  return true;
}

function isRateLimited(req) {
  const forwardedFor = req.headers && req.headers["x-forwarded-for"];
  const key = typeof forwardedFor === "string" ? forwardedFor.split(",")[0].trim() : "unknown";
  const now = Date.now();
  const recent = (requestCounts.get(key) || []).filter(timestamp => now - timestamp < RATE_WINDOW_MS);
  if (recent.length >= RATE_LIMIT) {
    requestCounts.set(key, recent);
    return true;
  }
  recent.push(now);
  requestCounts.set(key, recent);
  if (requestCounts.size > 1000) {
    for (const [address, timestamps] of requestCounts) {
      if (!timestamps.some(timestamp => now - timestamp < RATE_WINDOW_MS)) requestCounts.delete(address);
    }
  }
  return false;
}

function validEmail(value) {
  return typeof value === "string" &&
    value.length <= 254 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

module.exports = async function handler(req, res) {
  if (!setCors(req, res)) {
    return res.status(403).json({ error: "This website is not allowed to send enquiries." });
  }
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST, OPTIONS");
    return res.status(405).json({ error: "Method not allowed." });
  }

  const body = req.body;
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return res.status(400).json({ error: "Please submit the enquiry form." });
  }

  // Silently accept honeypot submissions without sending email.
  if (typeof body.company === "string" && body.company.trim()) {
    return res.status(200).json({ ok: true });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const subject = typeof body.subject === "string" ? body.subject.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";
  if (!name || name.length > 100 || /[\r\n]/.test(name)) {
    return res.status(400).json({ error: "Enter a valid name (up to 100 characters)." });
  }
  if (!validEmail(email)) {
    return res.status(400).json({ error: "Enter a valid email address." });
  }
  if (!subject || subject.length > 120 || /[\r\n]/.test(subject)) {
    return res.status(400).json({ error: "Enter a subject (up to 120 characters)." });
  }
  if (!message || message.length > 3000) {
    return res.status(400).json({ error: "Enter a message (up to 3000 characters)." });
  }
  if (isRateLimited(req)) {
    return res.status(429).json({ error: "Too many enquiries were sent. Please wait a minute and try again." });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from) {
    console.error("Email service is not configured. Set RESEND_API_KEY and RESEND_FROM_EMAIL.");
    return res.status(503).json({ error: "The enquiry service is not configured yet." });
  }

  const text = [
    "New Lucky Kids Sports website enquiry",
    "",
    `Name: ${name}`,
    `Reply email: ${email}`,
    `Subject: ${subject}`,
    "",
    "Message:",
    message
  ].join("\n");

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from,
        to: [ENQUIRY_RECIPIENT],
        reply_to: email,
        subject: `Lucky Kids Sports enquiry: ${subject}`,
        text
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Email provider returned status", response.status, errorText.slice(0, 500));
      return res.status(502).json({ error: "We couldn't send your enquiry. Please email heritagecanvas@gmail.com directly." });
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Email provider request failed:", error);
    return res.status(502).json({ error: "We couldn't send your enquiry. Please email heritagecanvas@gmail.com directly." });
  }
};
