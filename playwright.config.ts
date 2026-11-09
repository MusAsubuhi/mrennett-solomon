import { defineConfig } from "@playwright/test";

const PORT = 3100;

/**
 * Smoke tests run against a production build on a 360 px phone viewport.
 * A fake WhatsApp number is set for the test build only (never committed to .env).
 * Uses the Microsoft Edge already on Windows; set PW_CHANNEL=chrome or remove `channel`
 * after running `npx playwright install chromium` on other machines.
 */
export default defineConfig({
  testDir: "./tests",
  timeout: 60_000,
  retries: 0,
  reporter: [["list"]],
  use: {
    baseURL: `http://localhost:${PORT}`,
    viewport: { width: 360, height: 740 },
    channel: process.env.PW_CHANNEL || "msedge",
    isMobile: true,
    hasTouch: true,
  },
  webServer: {
    command: `npm run build && npm run start -- -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: true,
    timeout: 240_000,
    env: { NEXT_PUBLIC_WHATSAPP_NUMBER: "254700000000", NEXT_PUBLIC_SITE_URL: `http://localhost:${PORT}` },
  },
});
