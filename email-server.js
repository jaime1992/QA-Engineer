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

  // Paleta BUPA
  const BUPA_BLUE       = "#0066CC";
  const BUPA_BLUE_DARK  = "#004EA3";
  const BUPA_BLUE_LIGHT = "#EBF4FF";
  const BUPA_BLUE_MID   = "#CCE3F7";
  const BUPA_BG         = "#F3F7FB";
  const BUPA_BORDER     = "#D8E8F4";
  const BUPA_TEXT       = "#0F2137";
  const BUPA_TEXT2      = "#3D5A73";
  const BUPA_TEXT3      = "#7A98B0";
  const BUPA_GREEN      = "#00875A";
  const BUPA_GREEN_BG   = "#E6F5EF";
  const BUPA_YELLOW     = "#946200";
  const BUPA_YELLOW_BG  = "#FFF3CD";
  const BUPA_RED        = "#BF2600";
  const BUPA_RED_BG     = "#FFEBE6";

  const statusBg    = failed > 0 ? BUPA_RED    : BUPA_GREEN;
  const statusLabel = failed > 0 ? "HAY FALLOS" : "TODO PASSED";
  const statusIcon  = failed > 0 ? "❌" : "✅";

  // Nombre del spec — Full-Regression si hay más de un spec
  const specName = (results && results.length > 1)
    ? '#Full-Regression#'
    : ((results && results[0]?.file) || suite || "suite")
        .split(/[\\/]/).pop().replace(".cy.js","").replace(".cy.ts","");

  // Filas de tests
  let testRows = "";
  let rowIndex = 0;
  (results || []).forEach(spec => {
    (spec.tests || []).forEach(t => {
      const isPassed   = t.state === "passed";
      const rowBg      = rowIndex % 2 === 0 ? "#ffffff" : BUPA_BLUE_LIGHT;
      const stateBg    = isPassed ? BUPA_GREEN_BG : BUPA_RED_BG;
      const stateColor = isPassed ? BUPA_GREEN    : BUPA_RED;
      const stateText  = isPassed ? "PASSED"      : "FAILED";
      const icon       = isPassed ? "🟢" : "🔴";
      const errTd      = t.err
        ? `<td style="padding:9px 12px;border-bottom:1px solid ${BUPA_BORDER};color:${BUPA_RED};font-size:11px;background:${rowBg};font-family:monospace">${t.err}</td>`
        : `<td style="padding:9px 12px;border-bottom:1px solid ${BUPA_BORDER};color:${BUPA_TEXT3};font-size:12px;text-align:center;background:${rowBg}">—</td>`;
      const titleParts  = t.title.split(' > ');
      const reqId       = (titleParts[0] || '').split(' | ')[0].trim();
      const testCase    = (titleParts[1] || t.title).trim();
      testRows += `<tr>
        <td style="padding:9px 8px;border-bottom:1px solid ${BUPA_BORDER};text-align:center;background:${rowBg};font-size:14px">${icon}</td>
        <td style="padding:9px 12px;border-bottom:1px solid ${BUPA_BORDER};font-size:12px;color:${BUPA_BLUE};background:${rowBg};font-weight:700;white-space:nowrap">${reqId}</td>
        <td style="padding:9px 12px;border-bottom:1px solid ${BUPA_BORDER};font-size:13px;color:${BUPA_TEXT};background:${rowBg};font-weight:500">${testCase}</td>
        <td style="padding:9px 8px;border-bottom:1px solid ${BUPA_BORDER};text-align:center;background:${stateBg}">
          <span style="font-size:11px;font-weight:700;color:${stateColor};letter-spacing:0.5px">${stateText}</span>
        </td>
        <td style="padding:9px 8px;border-bottom:1px solid ${BUPA_BORDER};text-align:center;font-size:12px;color:${BUPA_BLUE};background:${rowBg};font-weight:600">${t.duration || 0}ms</td>
        ${errTd}
      </tr>`;
      rowIndex++;
    });
  });

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:700px;margin:0 auto;border:1px solid ${BUPA_BORDER};border-radius:10px;overflow:hidden;background:#ffffff">

      <!-- BUPA HEADER -->
      <div style="background:${BUPA_BLUE_DARK};padding:20px 24px;border-bottom:4px solid ${statusBg}">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="vertical-align:middle">
              <!-- Logo BUPA SVG -->
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="vertical-align:middle;padding-right:14px">
                    <svg width="64" height="40" viewBox="0 0 88 56" xmlns="http://www.w3.org/2000/svg">
                      <rect x="4" y="4" width="80" height="48" rx="10" fill="#0066CC"/>
                      <rect x="12" y="22" width="16" height="12" rx="3" fill="rgba(255,255,255,0.25)"/>
                      <rect x="16" y="18" width="8" height="20" rx="3" fill="rgba(255,255,255,0.25)"/>
                      <text x="34" y="34" font-family="Arial,sans-serif" font-size="16" font-weight="800" fill="#ffffff" letter-spacing="1">BUPA</text>
                      <polyline points="4,40 14,40 18,30 22,48 26,24 30,40 84,40" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="1.5"/>
                    </svg>
                  </td>
                  <td style="vertical-align:middle">
                    <div style="color:#ffffff;font-size:11px;font-weight:700;letter-spacing:2px;opacity:0.7;text-transform:uppercase">BUPA Chile · Portal Pacientes</div>
                    <div style="color:#ffffff;font-size:16px;font-weight:700;margin-top:3px">Cypress #Test Regresion# ${specName}</div>
                    <div style="color:${BUPA_BLUE_MID};font-size:12px;margin-top:4px">${total} test(s) ejecutados &nbsp;·&nbsp; ${fecha}</div>
                  </td>
                </tr>
              </table>
            </td>
            <td style="text-align:right;vertical-align:middle">
              <div style="display:inline-block;background:${statusBg};color:#ffffff;padding:8px 16px;border-radius:6px;font-size:13px;font-weight:700;letter-spacing:0.5px">
                ${statusIcon} ${statusLabel}
              </div>
            </td>
          </tr>
        </table>
      </div>

      <!-- STATS BOXES -->
      <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;background:${BUPA_BG}">
        <tr>
          <td width="25%" style="background:${BUPA_GREEN_BG};text-align:center;padding:20px 8px;border-right:2px solid #fff;border-bottom:3px solid ${BUPA_GREEN}">
            <div style="font-size:40px;font-weight:800;color:${BUPA_GREEN};line-height:1">${passed}</div>
            <div style="font-size:11px;color:${BUPA_GREEN};margin-top:5px;font-weight:700;letter-spacing:1px">✅ PASADOS</div>
          </td>
          <td width="25%" style="background:${BUPA_RED_BG};text-align:center;padding:20px 8px;border-right:2px solid #fff;border-bottom:3px solid ${BUPA_RED}">
            <div style="font-size:40px;font-weight:800;color:${BUPA_RED};line-height:1">${failed}</div>
            <div style="font-size:11px;color:${BUPA_RED};margin-top:5px;font-weight:700;letter-spacing:1px">❌ FALLADOS</div>
          </td>
          <td width="25%" style="background:${BUPA_YELLOW_BG};text-align:center;padding:20px 8px;border-right:2px solid #fff;border-bottom:3px solid ${BUPA_YELLOW}">
            <div style="font-size:40px;font-weight:800;color:${BUPA_YELLOW};line-height:1">${pending}</div>
            <div style="font-size:11px;color:${BUPA_YELLOW};margin-top:5px;font-weight:700;letter-spacing:1px">⏳ PENDIENTES</div>
          </td>
          <td width="25%" style="background:${failed > 0 ? BUPA_RED_BG : BUPA_GREEN_BG};text-align:center;padding:20px 8px;border-bottom:3px solid ${failed > 0 ? BUPA_RED : BUPA_GREEN}">
            <div style="font-size:40px;font-weight:800;color:${failed > 0 ? BUPA_RED : BUPA_GREEN};line-height:1">${duration}</div>
            <div style="font-size:11px;color:${failed > 0 ? BUPA_RED : BUPA_GREEN};margin-top:5px;font-weight:700;letter-spacing:1px">⏱️ DURACION</div>
          </td>
        </tr>
      </table>

      <!-- DETALLE LABEL -->
      <div style="background:${BUPA_BG};padding:10px 16px;border-top:1px solid ${BUPA_BORDER};border-bottom:1px solid ${BUPA_BORDER}">
        <span style="font-size:11px;font-weight:700;color:${BUPA_TEXT2};letter-spacing:1.5px;text-transform:uppercase">Detalle de Tests</span>
      </div>

      <!-- TABLA TESTS -->
      <table style="width:100%;border-collapse:collapse;background:#fff">
        <thead>
          <tr style="background:${BUPA_BG}">
            <th style="padding:10px 8px;width:36px;border-bottom:2px solid ${BUPA_BORDER}"></th>
            <th style="padding:10px 12px;text-align:left;font-size:12px;font-weight:700;color:${BUPA_TEXT2};border-bottom:2px solid ${BUPA_BORDER};white-space:nowrap;width:120px">Requerimiento</th>
            <th style="padding:10px 12px;text-align:left;font-size:12px;font-weight:700;color:${BUPA_TEXT2};border-bottom:2px solid ${BUPA_BORDER}">Test Case</th>
            <th style="padding:10px 8px;text-align:center;font-size:12px;font-weight:700;color:${BUPA_TEXT2};border-bottom:2px solid ${BUPA_BORDER};width:90px">Estado</th>
            <th style="padding:10px 8px;text-align:center;font-size:12px;font-weight:700;color:${BUPA_TEXT2};border-bottom:2px solid ${BUPA_BORDER};width:90px">Duracion</th>
            <th style="padding:10px 12px;text-align:center;font-size:12px;font-weight:700;color:${BUPA_TEXT2};border-bottom:2px solid ${BUPA_BORDER};width:160px">Error</th>
          </tr>
        </thead>
        <tbody>${testRows}</tbody>
      </table>

      <!-- FOOTER -->
      <div style="background:${BUPA_BG};padding:12px 20px;border-top:1px solid ${BUPA_BORDER};text-align:center">
        <span style="font-size:11px;color:${BUPA_TEXT3}">QA Lead: Jaime Quiñelen Villar &nbsp;·&nbsp; BUPA Chile · Portal Pacientes &nbsp;·&nbsp; Generado automaticamente por Cypress + WF-1.1</span>
      </div>

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

// Webhook que llama n8n WF-1.7
// POST /run-playwright-report
// Body: { suite, stats, results, fecha }
app.post("/run-playwright-report", async (req, res) => {
  const data = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  const { suite, stats, results, fecha } = data;

  const passed   = stats?.passes   || 0;
  const failed   = stats?.failures || 0;
  const pending  = stats?.pending  || 0;
  const total    = stats?.tests    || 0;
  const duration = stats?.duration ? `${Math.round(stats.duration / 1000)}s` : "—";
  const status   = failed > 0 ? "FAIL" : "PASS";

  const BUPA_BLUE       = "#0066CC";
  const BUPA_BLUE_DARK  = "#004EA3";
  const BUPA_BLUE_LIGHT = "#EBF4FF";
  const BUPA_BLUE_MID   = "#CCE3F7";
  const BUPA_BG         = "#F3F7FB";
  const BUPA_BORDER     = "#D8E8F4";
  const BUPA_TEXT       = "#0F2137";
  const BUPA_TEXT2      = "#3D5A73";
  const BUPA_TEXT3      = "#7A98B0";
  const BUPA_GREEN      = "#00875A";
  const BUPA_GREEN_BG   = "#E6F5EF";
  const BUPA_YELLOW     = "#946200";
  const BUPA_YELLOW_BG  = "#FFF3CD";
  const BUPA_RED        = "#BF2600";
  const BUPA_RED_BG     = "#FFEBE6";

  const statusBg    = failed > 0 ? BUPA_RED    : BUPA_GREEN;
  const statusLabel = failed > 0 ? "HAY FALLOS" : "TODO PASSED";
  const statusIcon  = failed > 0 ? "❌" : "✅";

  const specName = (results && results.length > 1)
    ? '#Full-Regression#'
    : ((results && results[0]?.file) || suite || "suite")
        .split(/[\\/]/).pop().replace(".spec.ts","").replace(".spec.js","");

  let testRows = "";
  let rowIndex = 0;
  (results || []).forEach(spec => {
    (spec.tests || []).forEach(t => {
      const isPassed   = t.state === "passed";
      const rowBg      = rowIndex % 2 === 0 ? "#ffffff" : BUPA_BLUE_LIGHT;
      const stateBg    = isPassed ? BUPA_GREEN_BG : BUPA_RED_BG;
      const stateColor = isPassed ? BUPA_GREEN    : BUPA_RED;
      const stateText  = isPassed ? "PASSED"      : "FAILED";
      const icon       = isPassed ? "🟢" : "🔴";
      const errTd      = t.err
        ? `<td style="padding:9px 12px;border-bottom:1px solid ${BUPA_BORDER};color:${BUPA_RED};font-size:11px;background:${rowBg};font-family:monospace">${t.err}</td>`
        : `<td style="padding:9px 12px;border-bottom:1px solid ${BUPA_BORDER};color:${BUPA_TEXT3};font-size:12px;text-align:center;background:${rowBg}">—</td>`;
      const titleParts = t.title.split(' > ');
      const reqId      = (titleParts[0] || '').split(' | ')[0].trim();
      const testCase   = (titleParts[1] || t.title).trim();
      testRows += `<tr>
        <td style="padding:9px 8px;border-bottom:1px solid ${BUPA_BORDER};text-align:center;background:${rowBg};font-size:14px">${icon}</td>
        <td style="padding:9px 12px;border-bottom:1px solid ${BUPA_BORDER};font-size:12px;color:${BUPA_BLUE};background:${rowBg};font-weight:700;white-space:nowrap">${reqId}</td>
        <td style="padding:9px 12px;border-bottom:1px solid ${BUPA_BORDER};font-size:13px;color:${BUPA_TEXT};background:${rowBg};font-weight:500">${testCase}</td>
        <td style="padding:9px 8px;border-bottom:1px solid ${BUPA_BORDER};text-align:center;background:${stateBg}">
          <span style="font-size:11px;font-weight:700;color:${stateColor};letter-spacing:0.5px">${stateText}</span>
        </td>
        <td style="padding:9px 8px;border-bottom:1px solid ${BUPA_BORDER};text-align:center;font-size:12px;color:${BUPA_BLUE};background:${rowBg};font-weight:600">${t.duration || 0}ms</td>
        ${errTd}
      </tr>`;
      rowIndex++;
    });
  });

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:700px;margin:0 auto;border:1px solid ${BUPA_BORDER};border-radius:10px;overflow:hidden;background:#ffffff">
      <div style="background:${BUPA_BLUE_DARK};padding:20px 24px;border-bottom:4px solid ${statusBg}">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="vertical-align:middle">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="vertical-align:middle;padding-right:14px">
                    <svg width="64" height="40" viewBox="0 0 88 56" xmlns="http://www.w3.org/2000/svg">
                      <rect x="4" y="4" width="80" height="48" rx="10" fill="#0066CC"/>
                      <rect x="12" y="22" width="16" height="12" rx="3" fill="rgba(255,255,255,0.25)"/>
                      <rect x="16" y="18" width="8" height="20" rx="3" fill="rgba(255,255,255,0.25)"/>
                      <text x="34" y="34" font-family="Arial,sans-serif" font-size="16" font-weight="800" fill="#ffffff" letter-spacing="1">BUPA</text>
                      <polyline points="4,40 14,40 18,30 22,48 26,24 30,40 84,40" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="1.5"/>
                    </svg>
                  </td>
                  <td style="vertical-align:middle">
                    <div style="color:#ffffff;font-size:11px;font-weight:700;letter-spacing:2px;opacity:0.7;text-transform:uppercase">BUPA Chile · Portal Pacientes</div>
                    <div style="color:#ffffff;font-size:16px;font-weight:700;margin-top:3px">🎭 Playwright #Test Regresion# ${specName}</div>
                    <div style="color:${BUPA_BLUE_MID};font-size:12px;margin-top:4px">${total} test(s) ejecutados &nbsp;·&nbsp; ${fecha}</div>
                  </td>
                </tr>
              </table>
            </td>
            <td style="text-align:right;vertical-align:middle">
              <div style="display:inline-block;background:${statusBg};color:#ffffff;padding:8px 16px;border-radius:6px;font-size:13px;font-weight:700;letter-spacing:0.5px">
                ${statusIcon} ${statusLabel}
              </div>
            </td>
          </tr>
        </table>
      </div>
      <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;background:${BUPA_BG}">
        <tr>
          <td width="25%" style="background:${BUPA_GREEN_BG};text-align:center;padding:20px 8px;border-right:2px solid #fff;border-bottom:3px solid ${BUPA_GREEN}">
            <div style="font-size:40px;font-weight:800;color:${BUPA_GREEN};line-height:1">${passed}</div>
            <div style="font-size:11px;color:${BUPA_GREEN};margin-top:5px;font-weight:700;letter-spacing:1px">✅ PASADOS</div>
          </td>
          <td width="25%" style="background:${BUPA_RED_BG};text-align:center;padding:20px 8px;border-right:2px solid #fff;border-bottom:3px solid ${BUPA_RED}">
            <div style="font-size:40px;font-weight:800;color:${BUPA_RED};line-height:1">${failed}</div>
            <div style="font-size:11px;color:${BUPA_RED};margin-top:5px;font-weight:700;letter-spacing:1px">❌ FALLADOS</div>
          </td>
          <td width="25%" style="background:${BUPA_YELLOW_BG};text-align:center;padding:20px 8px;border-right:2px solid #fff;border-bottom:3px solid ${BUPA_YELLOW}">
            <div style="font-size:40px;font-weight:800;color:${BUPA_YELLOW};line-height:1">${pending}</div>
            <div style="font-size:11px;color:${BUPA_YELLOW};margin-top:5px;font-weight:700;letter-spacing:1px">⏳ PENDIENTES</div>
          </td>
          <td width="25%" style="background:${failed > 0 ? BUPA_RED_BG : BUPA_GREEN_BG};text-align:center;padding:20px 8px;border-bottom:3px solid ${failed > 0 ? BUPA_RED : BUPA_GREEN}">
            <div style="font-size:40px;font-weight:800;color:${failed > 0 ? BUPA_RED : BUPA_GREEN};line-height:1">${duration}</div>
            <div style="font-size:11px;color:${failed > 0 ? BUPA_RED : BUPA_GREEN};margin-top:5px;font-weight:700;letter-spacing:1px">⏱️ DURACION</div>
          </td>
        </tr>
      </table>
      <div style="background:${BUPA_BG};padding:10px 16px;border-top:1px solid ${BUPA_BORDER};border-bottom:1px solid ${BUPA_BORDER}">
        <span style="font-size:11px;font-weight:700;color:${BUPA_TEXT2};letter-spacing:1.5px;text-transform:uppercase">Detalle de Tests</span>
      </div>
      <table style="width:100%;border-collapse:collapse;background:#fff">
        <thead>
          <tr style="background:${BUPA_BG}">
            <th style="padding:10px 8px;width:36px;border-bottom:2px solid ${BUPA_BORDER}"></th>
            <th style="padding:10px 12px;text-align:left;font-size:12px;font-weight:700;color:${BUPA_TEXT2};border-bottom:2px solid ${BUPA_BORDER};white-space:nowrap;width:120px">Requerimiento</th>
            <th style="padding:10px 12px;text-align:left;font-size:12px;font-weight:700;color:${BUPA_TEXT2};border-bottom:2px solid ${BUPA_BORDER}">Test Case</th>
            <th style="padding:10px 8px;text-align:center;font-size:12px;font-weight:700;color:${BUPA_TEXT2};border-bottom:2px solid ${BUPA_BORDER};width:90px">Estado</th>
            <th style="padding:10px 8px;text-align:center;font-size:12px;font-weight:700;color:${BUPA_TEXT2};border-bottom:2px solid ${BUPA_BORDER};width:90px">Duracion</th>
            <th style="padding:10px 12px;text-align:center;font-size:12px;font-weight:700;color:${BUPA_TEXT2};border-bottom:2px solid ${BUPA_BORDER};width:160px">Error</th>
          </tr>
        </thead>
        <tbody>${testRows}</tbody>
      </table>
      <div style="background:${BUPA_BG};padding:12px 20px;border-top:1px solid ${BUPA_BORDER};text-align:center">
        <span style="font-size:11px;color:${BUPA_TEXT3}">QA Lead: Jaime Quiñelen Villar &nbsp;·&nbsp; BUPA Chile · Portal Pacientes &nbsp;·&nbsp; Generado automaticamente por Playwright + WF-1.7</span>
      </div>
    </div>
  `;

  const subject = `🧪 [WF-1.7] Playwright #Test Regresion# ${specName} ${status} — ${passed}✅ ${failed}❌ | ${fecha}`;

  try {
    await transporter.sendMail({
      from: `QA-BUPA <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      subject,
      html,
    });
    console.log(`[OK] Reporte Playwright enviado — ${status} ${passed}/${total}`);
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
