// ───────────────────────────────────────────────────────────────
// 1. MODULARIZATION TESTS
// ───────────────────────────────────────────────────────────────
// Source: modularization.test.js (442 lines)
// Active tests: directory structure, module line counts, context-server imports
// DB-dependent barrel checks use mocked vector-index imports so we can validate
// the export surface without bootstrapping a real database.
import { beforeEach, describe, expect, it, vi } from 'vitest';
import path from 'path';
import fs from 'fs';

// Configuration
const MCP_SERVER_PATH = path.join(__dirname, '..');
const MAX_MODULE_LINES = 320; // 300 target with 20-line tolerance

// Known large modules with extended thresholds (technical debt tracking)
// These modules contain complex business logic justifying larger size
// 2026-03-03: Thresholds audited — memory-crud.js tightened from 760→40 after decomposition into sub-modules.
// TODO: Extract quality gate, reconsolidation, chunked-indexing from memory-save (2,553 LOC source).
const EXTENDED_LIMITS: Record<string, number> = {
  'context-server.js': 1450,        // actual: 1421 — Main entry point wiring for tools, hooks, startup lifecycle, startup root discovery, session priming, remediation hooks, and Phase 024 session recovery digest
  'tool-schemas.js': 780,           // actual: 755 — Expanded MCP schema set + Sprint 019: Zod schema integration, ingest tools + Phase 024 session_bootstrap
  'core/db-state.js': 500,          // actual: 449 — Database state tracking and rebinding lifecycle remain centralized pending deeper decomposition
  'formatters/search-results.js': 536, // actual: 536 — Search result formatting + Sprint 019/020 trace and session-transition envelope support
  'handlers/memory-search.js': 1450, // actual: 762 — Complex search logic with multiple strategies + Pipeline V2 integration
  'handlers/memory-triggers.js': 470, // actual: 454 — Trigger matching with cognitive features + governance/scope wiring
  'handlers/memory-crud.js': 40,    // actual: 32 — Re-export barrel (decomposed into memory-crud-{health,update,delete,stats,list,utils,types}.js)
  'handlers/memory-save.js': 2200,  // actual: 1210 — Save logic with parsing, validation, indexing + quality gate + reconsolidation
  'handlers/memory-index.js': 700,  // actual: 421 — Index operations with scanning + spec document discovery (Spec 126)
  'handlers/checkpoints.js': 620,   // actual: 611 — Checkpoint operations plus scoped metadata guards, restore/delete safety checks, SEC-002 scope enforcement, and T012 follow-up fixes
  'hooks/memory-surface.js': 520,   // actual: 503 — Memory surface hooks with constitutional cache, auto-surface, attention-enriched hints, priming, session snapshots, and Phase 024 bootstrap telemetry
};

type CoreIndexModule = typeof import('../core/index');
type HandlersIndexModule = typeof import('../handlers/index');
type FormattersIndexModule = typeof import('../formatters/index');
type UtilsIndexModule = typeof import('../utils/index');
type HooksIndexModule = typeof import('../hooks/index');
type ToolsIndexModule = typeof import('../tools/index');

const mockedDbDeps = vi.hoisted(() => ({
  getDb: vi.fn(() => null),
  get_db: vi.fn(() => null),
  onDatabaseConnectionChange: vi.fn(() => () => {}),
}));

vi.mock('../lib/search/vector-index.js', () => mockedDbDeps);

function countLines(filePath: string): number {
  const content = fs.readFileSync(filePath, 'utf8');
  return content.split('\n').length;
}

beforeEach(() => {
  vi.resetModules();
  mockedDbDeps.getDb.mockReturnValue(null);
  mockedDbDeps.get_db.mockReturnValue(null);
});

async function loadCoreIndex(): Promise<CoreIndexModule> {
  return await import('../core/index');
}

async function loadHandlersIndex(): Promise<HandlersIndexModule> {
  return await import('../handlers/index');
}

async function loadFormattersIndex(): Promise<FormattersIndexModule> {
  return await import('../formatters/index');
}

async function loadUtilsIndex(): Promise<UtilsIndexModule> {
  return await import('../utils/index');
}

async function loadHooksIndex(): Promise<HooksIndexModule> {
  return await import('../hooks/index');
}

async function loadToolsIndex(): Promise<ToolsIndexModule> {
  return await import('../tools/index');
}

// 1. DIRECTORY STRUCTURE (ACTIVE — pure fs.existsSync checks)
describe('Directory Structure', () => {
  const requiredDirs = ['core', 'handlers', 'formatters', 'utils', 'hooks', 'lib', 'tools'];

  for (const dir of requiredDirs) {
    it(`Directory: ${dir}/ exists`, () => {
      const dirPath = path.join(MCP_SERVER_PATH, dir);
      expect(fs.existsSync(dirPath)).toBe(true);
      expect(fs.statSync(dirPath).isDirectory()).toBe(true);
    });
  }
});

// 2. MODULE LINE COUNTS (ACTIVE — pure fs.readFileSync checks)
describe('Module Line Counts (<300 lines)', () => {
  const modules = [
    'context-server.js',
    'tool-schemas.js',
    'startup-checks.js',
    'core/config.js',
    'core/db-state.js',
    'handlers/memory-search.js',
    'handlers/memory-triggers.js',
    'handlers/memory-crud.js',
    'handlers/memory-save.js',
    'handlers/memory-index.js',
    'handlers/checkpoints.js',
    'formatters/token-metrics.js',
    'formatters/search-results.js',
    'utils/validators.js',
    'utils/json-helpers.js',
    'utils/batch-processor.js',
    'hooks/memory-surface.js',
    'tools/index.js',
    'tools/types.js',
    'tools/context-tools.js',
    'tools/memory-tools.js',
    'tools/causal-tools.js',
    'tools/checkpoint-tools.js',
    'tools/lifecycle-tools.js',
  ];

  for (const mod of modules) {
    it(`${mod} is within line limit`, () => {
      const filePath = path.join(MCP_SERVER_PATH, 'dist', mod);
      if (!fs.existsSync(filePath)) {
        // File not found — skip rather than fail (dist may not be built)
        expect(fs.existsSync(filePath)).toBe(true);
        return;
      }

      const lines = countLines(filePath);
      const limit = EXTENDED_LIMITS[mod] || MAX_MODULE_LINES;
      expect(lines).toBeLessThanOrEqual(limit);
    });
  }
});

// 3. CONTEXT SERVER INTEGRATION (ACTIVE — pure fs.readFileSync check)
describe('Context Server Integration', () => {
  // The compiled JS is ESM and emits explicit import specifiers.
  const imports = [
    { label: 'core barrel', pattern: /import\s*\{[\s\S]*?\}\s*from\s*['"]\.\/core\/index\.js['"]/ },
    { label: 'handlers barrel', pattern: /import\s*\{[\s\S]*?\}\s*from\s*['"]\.\/handlers\/index\.js['"]/ },
    { label: 'utils barrel', pattern: /import\s*\{[\s\S]*?\}\s*from\s*['"]\.\/utils\/index\.js['"]/ },
    { label: 'hooks barrel', pattern: /import\s*\{[\s\S]*?\}\s*from\s*['"]\.\/hooks\/index\.js['"]/ },
    { label: 'tools barrel', pattern: /import\s*\{[\s\S]*?\}\s*from\s*['"]\.\/tools\/index\.js['"]/ },
    { label: 'tool schemas', pattern: /import\s*\{[\s\S]*?\}\s*from\s*['"]\.\/tool-schemas\.js['"]/ },
  ];

  for (const imp of imports) {
    it(`Import: ${imp.label} found in context-server.js`, () => {
      const contextServerPath = path.join(MCP_SERVER_PATH, 'dist', 'context-server.js');
      if (!fs.existsSync(contextServerPath)) {
        expect(fs.existsSync(contextServerPath)).toBe(true);
        return;
      }

      const contextServer = fs.readFileSync(contextServerPath, 'utf8');
      expect(contextServer).toMatch(imp.pattern);
    });
  }
});

// 4. INDEX EXPORTS
describe('Index Re-exports (mocked DB)', () => {
  const moduleLoaders = {
    core: async () => await loadCoreIndex(),
    handlers: async () => await loadHandlersIndex(),
    formatters: async () => await loadFormattersIndex(),
    utils: async () => await loadUtilsIndex(),
    hooks: async () => await loadHooksIndex(),
    tools: async () => await loadToolsIndex(),
  } as const;

  const barrelSentinels: Record<keyof typeof moduleLoaders, string> = {
    core: 'DATABASE_PATH',
    handlers: 'handleMemorySearch',
    formatters: 'estimateTokens',
    utils: 'validateQuery',
    hooks: 'extractContextHint',
    tools: 'dispatchTool',
  };

  for (const [dir, loadModule] of Object.entries(moduleLoaders) as Array<[keyof typeof moduleLoaders, (typeof moduleLoaders)[keyof typeof moduleLoaders]]>) {
    it(`${dir}/index.js exports items`, async () => {
      const mod = await loadModule();
      expect(Object.keys(mod)).not.toHaveLength(0);
      expect(mod).toHaveProperty(barrelSentinels[dir]);
    });
  }
});

// 5. CORE EXPORTS
describe('Core Module Exports', () => {
  const functionExports = new Set([
    'checkDatabaseUpdated',
    'reinitializeDatabase',
    'getLastScanTime',
    'setLastScanTime',
    'init',
    'isEmbeddingModelReady',
  ]);
  const required = [
    'DATABASE_PATH', 'LIB_DIR', 'SHARED_DIR',
    'BATCH_SIZE', 'BATCH_DELAY_MS', 'INDEX_SCAN_COOLDOWN',
    'checkDatabaseUpdated', 'reinitializeDatabase',
    'getLastScanTime', 'setLastScanTime',
    'init', 'isEmbeddingModelReady',
  ];

  for (const fn of required) {
    it(`core.${fn} is exported`, async () => {
      const core = await loadCoreIndex();
      expect(core).toHaveProperty(fn);

      const exported = core[fn as keyof CoreIndexModule];
      if (functionExports.has(fn)) {
        expect(exported).toBeTypeOf('function');
        return;
      }

      expect(exported).not.toBeUndefined();
    });
  }
});

// 6. HANDLER EXPORTS
describe('Handler Module Exports', () => {
  const required = [
    'handleMemorySearch',
    'handleMemoryMatchTriggers',
    'handleMemoryDelete', 'handleMemoryUpdate',
    'handleMemoryList', 'handleMemoryStats', 'handleMemoryHealth',
    'handleMemorySave', 'indexMemoryFile',
    'handleMemoryIndexScan', 'findConstitutionalFiles',
    'handleCheckpointCreate', 'handleCheckpointList',
    'handleCheckpointRestore', 'handleCheckpointDelete',
    'handleMemoryValidate',
  ];

  for (const fn of required) {
    it(`handlers.${fn} is exported as function`, async () => {
      const handlers = await loadHandlersIndex();
      expect(handlers).toHaveProperty(fn);
      expect(handlers[fn as keyof HandlersIndexModule]).toBeTypeOf('function');
    });
  }
});

// 7. FORMATTER EXPORTS
describe('Formatter Module Exports (mocked DB)', () => {
  const required = [
    'estimateTokens', 'calculateTokenMetrics',
    'formatSearchResults',
  ];

  for (const fn of required) {
    it(`formatters.${fn} is exported as function`, async () => {
      const formatters = await loadFormattersIndex();
      expect(formatters).toHaveProperty(fn);
      expect(formatters[fn as keyof FormattersIndexModule]).toBeTypeOf('function');
    });
  }
});

// 8. UTILS EXPORTS
describe('Utils Module Exports (mocked DB)', () => {
  const required = [
    'validateQuery', 'validateInputLengths', 'INPUT_LIMITS',
    'safeJsonParse', 'safeJsonStringify',
    'processWithRetry', 'processBatches',
  ];

  for (const fn of required) {
    it(`utils.${fn} is exported`, async () => {
      const utils = await loadUtilsIndex();
      expect(utils).toHaveProperty(fn);

      const exported = utils[fn as keyof UtilsIndexModule];
      if (fn === 'INPUT_LIMITS') {
        expect(exported).toEqual(expect.objectContaining({
          query: expect.any(Number),
          title: expect.any(Number),
        }));
        return;
      }

      expect(exported).toBeTypeOf('function');
    });
  }
});

// 9. HOOKS EXPORTS
describe('Hooks Module Exports (mocked DB)', () => {
  // The barrel exports the live camelCase API surface from hooks/index.ts.
  const required = [
    'extractContextHint',
    'getConstitutionalMemories',
    'autoSurfaceMemories',
    'MEMORY_AWARE_TOOLS',
  ];

  for (const fn of required) {
    it(`hooks.${fn} is exported`, async () => {
      const hooks = await loadHooksIndex();
      expect(hooks).toHaveProperty(fn);

      const exported = hooks[fn as keyof HooksIndexModule];
      if (fn === 'MEMORY_AWARE_TOOLS') {
        expect(exported).toBeInstanceOf(Set);
        return;
      }

      expect(exported).toBeTypeOf('function');
    });
  }
});

// 10. VALIDATOR FUNCTIONS
describe('Validator Function Tests (mocked DB)', () => {
  it('validateQuery(null) throws', async () => {
    const utils = await loadUtilsIndex();
    expect(() => utils.validateQuery(null)).toThrow('Query cannot be null or undefined');
  });

  it('validateQuery("   ") throws', async () => {
    const utils = await loadUtilsIndex();
    expect(() => utils.validateQuery('   ')).toThrow('Query cannot be empty or whitespace-only');
  });

  it('validateQuery("test query") returns trimmed', async () => {
    const utils = await loadUtilsIndex();
    expect(utils.validateQuery('  test query  ')).toBe('test query');
  });

  it('validateInputLengths with valid input does not throw', async () => {
    const utils = await loadUtilsIndex();
    expect(() => utils.validateInputLengths({
      query: 'test query',
      title: 'Short title',
      specFolder: '023-esm-module-compliance/005-test-and-scenario-remediation',
    })).not.toThrow();
  });
});

// 11. TOKEN METRICS
describe('Token Metrics Tests (mocked DB)', () => {
  it('estimateTokens("Hello world") returns positive number', async () => {
    const formatters = await loadFormattersIndex();
    expect(formatters.estimateTokens('Hello world')).toBeGreaterThan(0);
  });

  it('calculateTokenMetrics returns object with actualTokens', async () => {
    const formatters = await loadFormattersIndex();
    const metrics = formatters.calculateTokenMetrics(
      [{ id: 1 }, { id: 2 }, { id: 3 }],
      [
        { tier: 'HOT', content: 'Full content for the hot result.' },
        { tier: 'WARM', content: 'Warm summary.' },
      ],
    );

    expect(metrics).toEqual(expect.objectContaining({
      actualTokens: expect.any(Number),
      hotTokens: expect.any(Number),
      warmTokens: expect.any(Number),
      coldExcluded: 1,
    }));
    expect(metrics.actualTokens).toBeGreaterThan(0);
  });
});
