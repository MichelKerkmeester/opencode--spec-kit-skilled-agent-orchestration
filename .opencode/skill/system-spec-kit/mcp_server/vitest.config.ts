// ───────────────────────────────────────────────────────────────
// MODULE: Vitest Config
// ───────────────────────────────────────────────────────────────
// ───────────────────────────────────────────────────────────────
// 1. VITEST

// ───────────────────────────────────────────────────────────────
import { defineConfig } from 'vitest/config';
import path from 'path';

const TEST_TIMEOUT_MS = 30_000; // 30s default, increase for CI if needed
const TEARDOWN_TIMEOUT_MS = 1_000;

export default defineConfig({
  root: path.resolve(import.meta.dirname, '..'),
  test: {
    include: [
      'mcp_server/tests/**/*.{vitest,test}.ts',
      'scripts/tests/**/*.{vitest,test}.ts',
    ],
    // Several script suites mutate shared process-level state and temp project roots.
    // Run files serially so the combined config remains deterministic.
    fileParallelism: false,
    globals: true,
    environment: 'node',
    testTimeout: TEST_TIMEOUT_MS,
    teardownTimeout: TEARDOWN_TIMEOUT_MS,
    alias: {
      '@lib': path.resolve(import.meta.dirname, 'lib'),
    },
  },
});
