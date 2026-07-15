import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./screenshots",
  fullyParallel: false,
  retries: 0,
  workers: 1,
  timeout: 60_000,
  outputDir: "./screenshots/output",
  use: {
    baseURL: "http://localhost:3000",
    navigationTimeout: 60_000,
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Pixel 5"],
        launchOptions: {
          env: {
            ...process.env,
            LD_LIBRARY_PATH:
              "/nix/store/amjf7cch3hb5r6l646mwjhrr9384ks4s-nspr-4.38.2/lib:/nix/store/0wnl2h5xgy1q7bgkqdbiyzxnrq3cmigi-nss-3.112.3/lib",
          },
        },
      },
    },
  ],
  webServer: {
    command: "pnpm dev",
    port: 3000,
    reuseExistingServer: true,
    timeout: 60_000,
  },
});
