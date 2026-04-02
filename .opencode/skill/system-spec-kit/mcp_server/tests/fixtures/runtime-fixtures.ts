// ───────────────────────────────────────────────────────────────
// MODULE: Runtime Fixtures
// ───────────────────────────────────────────────────────────────
// Shared test fixtures for runtime detection and hook availability tests.

/** Runtime fixture describing a specific runtime's hook capabilities */
export interface RuntimeFixture {
  runtime: 'claude-code' | 'codex-cli' | 'copilot-cli' | 'gemini-cli';
  hookPolicy: 'enabled' | 'disabled_by_scope' | 'unavailable';
  supports: {
    sessionStartHook: boolean;
    preCompactHook: boolean;
    stopHook: boolean;
    toolFallback: boolean;
  };
}

/** Create a runtime fixture for the given runtime */
export function createRuntimeFixture(runtime: RuntimeFixture['runtime']): RuntimeFixture {
  switch (runtime) {
    case 'claude-code':
      return {
        runtime: 'claude-code',
        hookPolicy: 'enabled',
        supports: {
          sessionStartHook: true,
          preCompactHook: true,
          stopHook: true,
          toolFallback: true,
        },
      };
    case 'codex-cli':
      return {
        runtime: 'codex-cli',
        hookPolicy: 'unavailable',
        supports: {
          sessionStartHook: false,
          preCompactHook: false,
          stopHook: false,
          toolFallback: true,
        },
      };
    case 'copilot-cli':
      return {
        runtime: 'copilot-cli',
        hookPolicy: 'disabled_by_scope',
        supports: {
          sessionStartHook: false,
          preCompactHook: false,
          stopHook: false,
          toolFallback: true,
        },
      };
    case 'gemini-cli':
      // Phase 024: Gemini hookPolicy is now dynamic — detected from .gemini/settings.json.
      // In test environment without the file, it resolves to 'unavailable'.
      return {
        runtime: 'gemini-cli',
        hookPolicy: 'unavailable',
        supports: {
          sessionStartHook: false,
          preCompactHook: false,
          stopHook: false,
          toolFallback: true,
        },
      };
  }
}

/** Set up environment variables to simulate a specific runtime */
export function setRuntimeEnv(runtime: RuntimeFixture['runtime']): void {
  // Clear all runtime indicators
  delete process.env.CLAUDE_CODE;
  delete process.env.CLAUDE_SESSION_ID;
  delete process.env.MCP_SERVER_NAME;
  delete process.env.CODEX_CLI;
  delete process.env.CODEX_THREAD_ID;
  delete process.env.CODEX_SANDBOX;
  delete process.env.CODEX_TUI_RECORD_SESSION;
  delete process.env.CODEX_TUI_SESSION_LOG_PATH;
  delete process.env.COPILOT_CLI;
  delete process.env.GITHUB_COPILOT_TOKEN;
  delete process.env.GEMINI_CLI;
  delete process.env.GOOGLE_GENAI_USE_VERTEXAI;

  switch (runtime) {
    case 'claude-code':
      process.env.CLAUDE_CODE = '1';
      break;
    case 'codex-cli':
      process.env.CODEX_CLI = '1';
      process.env.CODEX_THREAD_ID = 'fixture-codex-thread';
      break;
    case 'copilot-cli':
      process.env.COPILOT_CLI = '1';
      break;
    case 'gemini-cli':
      process.env.GEMINI_CLI = '1';
      break;
  }
}

/** Restore original environment (call in afterEach) */
export function clearRuntimeEnv(): void {
  delete process.env.CLAUDE_CODE;
  delete process.env.CLAUDE_SESSION_ID;
  delete process.env.MCP_SERVER_NAME;
  delete process.env.CODEX_CLI;
  delete process.env.CODEX_THREAD_ID;
  delete process.env.CODEX_SANDBOX;
  delete process.env.CODEX_TUI_RECORD_SESSION;
  delete process.env.CODEX_TUI_SESSION_LOG_PATH;
  delete process.env.COPILOT_CLI;
  delete process.env.GITHUB_COPILOT_TOKEN;
  delete process.env.GEMINI_CLI;
  delete process.env.GOOGLE_GENAI_USE_VERTEXAI;
}
