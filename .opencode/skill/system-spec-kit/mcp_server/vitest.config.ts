// ───────────────────────────────────────────────────────────────
// MODULE: Vitest Config
// ───────────────────────────────────────────────────────────────
// ───────────────────────────────────────────────────────────────
// 1. VITEST

// ───────────────────────────────────────────────────────────────
import { defineConfig } from 'vitest/config';
import path from 'path';

const TEST_TIMEOUT_MS = 30_000; // 30s default, increase for CI if needed

export default defineConfig({
  test: {
    include: ['tests/**/*.{vitest,test}.ts'],
    globals: true,
    environment: 'node',
    testTimeout: TEST_TIMEOUT_MS,
    alias: {
      '@lib': path.resolve(import.meta.dirname, 'lib'),
    },
  },
});
