// pages/api/gas.js
export default async function handler(req, res) {
  const GAS = process.env.NEXT_PUBLIC_GAS_URL;
  if (!GAS) return res.status(500).json({ ok: false, message: "NEXT_PUBLIC_GAS_URL not set" });

  try {
    // handle OPTIONS (preflight) quickly
    if (req.method === "OPTIONS") {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type");
      return res.status(204).end();
    }

    // Build target URL for GET (forward query)
    if (req.method === "GET") {
      const qs = new URLSearchParams(req.query).toString();
      const target = qs ? `${GAS}?${qs}` : GAS;
      const r = await fetch(target, { method: "GET" });
      const text = await r.text();
      try { return res.status(r.status).json(JSON.parse(text)); }
      catch { return res.status(r.status).send(text); }
    }

    // POST: forward body as JSON to GAS
    if (req.method === "POST") {
      const r = await fetch(GAS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req.body)
      });
      const text = await r.text();
      try { return res.status(r.status).json(JSON.parse(text)); }
      catch { return res.status(r.status).send(text); }
    }

    return res.status(405).json({ ok: false, message: "Method not allowed" });
  } catch (err) {
    console.error("API proxy error:", err);
    return res.status(500).json({ ok: false, message: err.message || "Server error" });
  }
}
