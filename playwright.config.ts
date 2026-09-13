import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  // Banco compartilhado (Supabase real): rodar em série evita interferência entre testes
  fullyParallel: false,
  workers: 1,
  retries: 0,
  // Primeira compilação de cada rota no `next dev` é lenta
  timeout: 60_000,
  expect: { timeout: 15_000 },
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: "http://localhost:3000",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    // Para apresentação: `npm run test:e2e:demo` abre o navegador e desacelera cada ação
    headless: !process.env.SLOW,
    launchOptions: { slowMo: process.env.SLOW ? 600 : 0 },
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000/persons",
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
