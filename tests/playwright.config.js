import { defineConfig } from "@playwright/test";

export default defineConfig({
  use: {
    baseURL: "http://localhost:3000",
    headless: true, // keep headless or set to false if you want to see the browser
    video: "on-first-retry",
    permissions: ["microphone"], // auto-grant mic access
    launchOptions: {
      args: ["--use-fake-ui-for-media-stream"], // auto-accept mic without real input
    },
  },
});
