import { defineConfig } from "vitest/config";

// Thresholds copy Edge Studio's per-service numbers (backend/vitest.config.ts,
// frontend/vite.config.ts), so a PR that lowers coverage fails the same way.
export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: "backend",
          environment: "node",
          include: ["backend/tests/**/*.test.ts"],
        },
      },
      {
        test: {
          name: "frontend",
          environment: "jsdom",
          include: ["frontend/tests/**/*.test.{ts,tsx}"],
        },
      },
    ],
    coverage: {
      provider: "v8",
      reporter: ["text", "json-summary"],
      include: ["backend/src/**/*.ts", "frontend/src/**/*.{ts,tsx}"],
      thresholds: {
        "backend/src/**": {
          statements: 90,
          branches: 80,
          functions: 90,
          lines: 90,
        },
        "frontend/src/**": {
          statements: 90,
          branches: 85,
          functions: 85,
          lines: 90,
        },
      },
    },
  },
});
