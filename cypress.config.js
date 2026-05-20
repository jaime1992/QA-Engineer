const { defineConfig } = require("cypress");

const environments = {
  dev: {
    baseUrl: "http://localhost:4200",
  },
  uat: {
    baseUrl: "https://uat-portalpaciente.bupa.cl",
  },
  prod: {
    baseUrl: "https://portalpaciente.bupa.cl",
  },
};

module.exports = defineConfig({
  e2e: {
    // Ambiente por defecto: prod
    // Para cambiar: npx cypress run --env environment=uat
    baseUrl: environments[process.env.CYPRESS_ENV || "prod"].baseUrl,

    specPattern: "cypress/e2e/**/*.cy.{js,ts}",
    supportFile: "cypress/support/e2e.js",

    viewportWidth: 1280,
    viewportHeight: 720,
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 30000,

    env: {
      environment: "prod",
      environments,
    },

    setupNodeEvents(on, config) {
      require("@shelex/cypress-allure-plugin/writer")(on, config);

      const env = config.env.environment || "prod";
      config.baseUrl = environments[env]?.baseUrl || environments.prod.baseUrl;

      on("after:run", async (results) => {
        const https = require("https");
        const http  = require("http");

        const totalDuration = (results.runs || []).reduce((sum, r) => sum + (r.stats?.duration || 0), 0);

        const totalStats = {
          tests:    results.totalTests    || results.totalStats?.tests    || 0,
          passes:   results.totalPassed   || results.totalStats?.passes   || 0,
          failures: results.totalFailed   || results.totalStats?.failures || 0,
          duration: totalDuration,
        };

        const payload = JSON.stringify({
          suite:   "Cypress Regression - BUPA",
          fecha:   new Date().toLocaleString("es-CL", { timeZone: "America/Santiago" }),
          stats:   totalStats,
          results: (results.runs || []).map(r => ({
            file:  r.spec?.relative || r.spec?.name || "spec",
            stats: r.stats || {},
            tests: (r.tests || []).map(t => ({
              title:    Array.isArray(t.title) ? t.title.join(" > ") : t.title,
              state:    t.state,
              duration: t.duration || 0,
              err:      t.displayError || null,
            })),
          })),
        });

        const n8nUrl = "http://localhost:3025/run-cypress-report";
        const url    = new URL(n8nUrl);
        const lib    = url.protocol === "https:" ? https : http;

        await new Promise((resolve) => {
          const req = lib.request({
            hostname: url.hostname,
            port:     url.port || (url.protocol === "https:" ? 443 : 80),
            path:     url.pathname,
            method:   "POST",
            headers:  { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(payload) },
          }, (res) => {
            console.log(`[email-server] Reporte enviado → status ${res.statusCode}`);
            resolve();
          });
          req.on("error", (e) => {
            console.error(`[email-server] Error al enviar resultados: ${e.message}`);
            resolve();
          });
          req.write(payload);
          req.end();
        });
      });

      return config;
    },
  },
});
