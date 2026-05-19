require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");

const app = express();
app.use(express.json());

const PORT = process.env.EMAIL_PORT || 3000;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// Webhook que llama n8n WF-1.1
// POST /run-cypress-report
// Body: { suite, stats, results, fecha }
app.post("/run-cypress-report", async (req, res) => {
  const data = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  const { suite, stats, results, fecha } = data;

  const passed   = stats?.passes   || 0;
  const failed   = stats?.failures || 0;
  const pending  = stats?.pending  || 0;
  const total    = stats?.tests    || 0;
  const duration = stats?.duration ? `${Math.round(stats.duration / 1000)}s` : "—";
  const status   = failed > 0 ? "FAIL" : "PASS";
  const headerBg = failed > 0 ? "#c0392b" : "#27ae60";
  const headerIcon = failed > 0 ? "❌ HAY FALLOS" : "✅ TODO PASSED";

  // Nombre del spec — solo el filename sin path ni extension
  const rawFile = (results && results[0]?.file) || suite || "suite";
  const specName = rawFile.split(/[\\/]/).pop().replace(".cy.js","").replace(".cy.ts","");

  // Filas de tests
  let testRows = "";
  (results || []).forEach(spec => {
    (spec.tests || []).forEach(t => {
      const icon  = t.state === "passed" ? "🟢" : "🔴";
      const errTd = t.err ? `<td style="padding:8px;border-bottom:1px solid #eee;color:#c0392b;font-size:12px">${t.err}</td>` : `<td style="padding:8px;border-bottom:1px solid #eee">—</td>`;
      testRows += `<tr>
        <td style="padding:8px;border-bottom:1px solid #eee">${icon}</td>
        <td style="padding:8px;border-bottom:1px solid #eee">${t.title}</td>
        <td style="padding:8px;border-bottom:1px solid #eee">${t.state}</td>
        <td style="padding:8px;border-bottom:1px solid #eee">${t.duration || 0}ms</td>
        ${errTd}
      </tr>`;
    });
  });

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:700px;margin:0 auto;border:1px solid #ddd;border-radius:8px;overflow:hidden">

      <!-- HEADER -->
      <div style="background:${headerBg};color:#fff;padding:18px 20px">
        <h2 style="margin:0;font-size:18px">🖊️ Cypress #Test Regresion# ${specName} — ${headerIcon}</h2>
        <p style="margin:6px 0 0;font-size:13px;opacity:0.9">Suite: ${total} spec(s) &nbsp;|&nbsp; ${fecha}</p>
      </div>

      <!-- STATS BOXES -->
      <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse">
        <tr>
          <td width="25%" style="background:#d5f5e3;text-align:center;padding:24px 8px;border-right:2px solid #fff">
            <div style="font-size:42px;font-weight:bold;color:#1e8449;line-height:1">${passed}</div>
            <div style="font-size:12px;color:#1e8449;margin-top:6px;font-weight:bold">✅ PASADOS</div>
          </td>
          <td width="25%" style="background:#fadbd8;text-align:center;padding:24px 8px;border-right:2px solid #fff">
            <div style="font-size:42px;font-weight:bold;color:#c0392b;line-height:1">${failed}</div>
            <div style="font-size:12px;color:#c0392b;margin-top:6px;font-weight:bold">❌ FALLADOS</div>
          </td>
          <td width="25%" style="background:#fef9e7;text-align:center;padding:24px 8px;border-right:2px solid #fff">
            <div style="font-size:42px;font-weight:bold;color:#d68910;line-height:1">${pending}</div>
            <div style="font-size:12px;color:#d68910;margin-top:6px;font-weight:bold">⏳ PENDIENTES</div>
          </td>
          <td width="25%" style="background:#d6eaf8;text-align:center;padding:24px 8px">
            <div style="font-size:42px;font-weight:bold;color:#1a5276;line-height:1">${duration}</div>
            <div style="font-size:12px;color:#1a5276;margin-top:6px;font-weight:bold">⏱️ DURACION</div>
          </td>
        </tr>
      </table>

      <!-- DETALLE TESTS -->
      <table style="width:100%;border-collapse:collapse;background:#fff">
        <thead>
          <tr style="background:#f2f3f4">
            <th style="padding:10px 8px;text-align:left;font-size:13px"></th>
            <th style="padding:10px 8px;text-align:left;font-size:13px">Test / Spec</th>
            <th style="padding:10px 8px;text-align:left;font-size:13px">Estado</th>
            <th style="padding:10px 8px;text-align:left;font-size:13px">Duracion</th>
            <th style="padding:10px 8px;text-align:left;font-size:13px">Error</th>
          </tr>
        </thead>
        <tbody>${testRows}</tbody>
      </table>

    </div>
  `;

  const subject = `🧪 [WF-1.1] Cypress #Test Regresion# ${specName} ${status} — ${passed}✅ ${failed}❌ | ${fecha}`;

  try {
    await transporter.sendMail({
      from: `QA-BUPA <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      subject,
      html,
    });

    console.log(`[OK] Reporte enviado — ${status} ${passed}/${total}`);
    res.status(200).json({ success: true, status, passed, failed, total });
  } catch (err) {
    console.error(`[ERROR] ${err.message}`);
    res.status(500).json({ error: err.message });
  }
});

// Webhook generico
// POST /send-email
// Body: { to, subject, body }
app.post("/send-email", async (req, res) => {
  const { to, subject, body, html } = req.body;
  const contenido = body || html;

  if (!to || !subject || !contenido) {
    return res.status(400).json({ error: "Faltan campos: to, subject, body (o html)" });
  }

  try {
    await transporter.sendMail({
      from: `QA-BUPA <${process.env.GMAIL_USER}>`,
      to,
      subject,
      html: contenido,
    });

    console.log(`[OK] Correo enviado a ${to}`);
    res.status(200).json({ success: true, message: `Correo enviado a ${to}` });
  } catch (err) {
    console.error(`[ERROR] ${err.message}`);
    res.status(500).json({ error: err.message });
  }
});

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", port: PORT });
});

app.listen(PORT, () => {
  console.log(`Email server corriendo en http://localhost:${PORT}`);
  console.log(`Webhook disponible: POST http://localhost:${PORT}/send-email`);
});
