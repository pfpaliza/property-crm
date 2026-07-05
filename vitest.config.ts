import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// Unit tests only — pure logic in src/lib and elsewhere. Component and page
// tests that need a DB or a browser live in e2e/ under Playwright instead.
export default defineConfig({
  resolve: {
    alias: {
      // Mirror the "@/*" -> "./src/*" mapping from tsconfig.json so tests can
      // import modules the same way the app does.
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
