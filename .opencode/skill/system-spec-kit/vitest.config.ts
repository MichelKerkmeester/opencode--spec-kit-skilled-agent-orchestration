import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: [
      'scripts/tests/**/*.vitest.ts',
      'mcp_server/tests/**/*.vitest.ts',
    ],
    globals: true,
  },
});
