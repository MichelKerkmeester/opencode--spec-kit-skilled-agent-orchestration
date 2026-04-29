const ROOT = '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public';
const MCP_SERVER = `${ROOT}/.opencode/skill/system-spec-kit/mcp_server`;
const PACKET = `${ROOT}/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/029-stress-test-v1-0-4`;

export default {
  root: ROOT,
  test: {
    include: [
      `${PACKET}/measurements/phase-k-v1-0-4-stress.test.ts`,
    ],
    setupFiles: [
      `${MCP_SERVER}/tests/_support/vitest-setup.ts`,
    ],
    fileParallelism: false,
    globals: true,
    environment: 'node',
    testTimeout: 30_000,
    teardownTimeout: 1_000,
  },
};
