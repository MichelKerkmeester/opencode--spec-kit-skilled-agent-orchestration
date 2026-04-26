// ───────────────────────────────────────────────────────────────
// MODULE: Code Graph Verify Tests
// ───────────────────────────────────────────────────────────────

import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  ensureCodeGraphReady: vi.fn(async () => ({
    freshness: 'fresh',
    action: 'none',
    inlineIndexPerformed: false,
    reason: 'ok',
  })),
  handleCodeGraphQuery: vi.fn(),
  setLastGoldVerification: vi.fn(),
  readFileSync: vi.fn(),
}));

vi.mock('node:fs', async () => {
  const actual = await vi.importActual<typeof import('node:fs')>('node:fs');
  mocks.readFileSync.mockImplementation((...args: Parameters<typeof actual.readFileSync>) => actual.readFileSync(...args));
  return {
    ...actual,
    readFileSync: mocks.readFileSync,
  };
});

vi.mock('../lib/ensure-ready.js', () => ({
  ensureCodeGraphReady: mocks.ensureCodeGraphReady,
}));

vi.mock('../handlers/query.js', () => ({
  handleCodeGraphQuery: mocks.handleCodeGraphQuery,
}));

vi.mock('../lib/code-graph-db.js', () => ({
  setLastGoldVerification: mocks.setLastGoldVerification,
}));

import {
  executeBattery,
  loadGoldBattery,
  type GoldBattery,
} from '../lib/gold-query-verifier.js';
import { handleCodeGraphVerify } from '../handlers/verify.js';

const WORKSPACE_ROOT = fileURLToPath(new URL(
  '../../../../../../',
  import.meta.url,
));

const VERIFY_FIXTURE_BATTERY_PATH = fileURLToPath(new URL(
  './assets/code-graph-gold-queries.json',
  import.meta.url,
));

const DEFAULT_VERIFY_BATTERY_PATH = fileURLToPath(new URL(
  '../../../../../specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/007-code-graph-resilience-research/assets/code-graph-gold-queries.json',
  import.meta.url,
));

function buildBattery(overrides: Partial<GoldBattery> = {}): GoldBattery {
  return {
    schema_version: 1,
    pass_policy: {
      overall_pass_rate: 1,
      edge_focus_pass_rate: 1,
    },
    queries: [{
      id: 'verify-1',
      category: 'mcp-tool',
      query: 'Find handleVerify',
      source_file: 'src/verify.ts',
      expected_top_K_symbols: ['handleVerify'],
    }],
    ...overrides,
  };
}

function outlineResponse(payload: unknown): { content: Array<{ type: 'text'; text: string }> } {
  return {
    content: [{
      type: 'text',
      text: JSON.stringify(payload),
    }],
  };
}

describe('code-graph verify', () => {
  const originalCwd = process.cwd();
  let tempDir = '';

  beforeEach(() => {
    process.chdir(WORKSPACE_ROOT);
    tempDir = mkdtempSync(join(tmpdir(), 'code-graph-verify-'));
    vi.clearAllMocks();
    mocks.readFileSync.mockClear();
    mocks.ensureCodeGraphReady.mockResolvedValue({
      freshness: 'fresh',
      action: 'none',
      inlineIndexPerformed: false,
      reason: 'ok',
    });
    mocks.handleCodeGraphQuery.mockResolvedValue(outlineResponse({
      status: 'ok',
      data: {
        nodes: [
          { name: 'handleVerify', fqName: 'verify.handleVerify' },
        ],
      },
    }));
  });

  afterEach(() => {
    rmSync(tempDir, { recursive: true, force: true });
    process.chdir(originalCwd);
  });

  function writeBatteryFile(json: unknown, filename = 'battery.json'): string {
    const batteryPath = join(tempDir, filename);
    writeFileSync(batteryPath, JSON.stringify(json, null, 2));
    return batteryPath;
  }

  describe('loadGoldBattery', () => {
    it('accepts a valid schema and normalizes source_file:line fields', () => {
      const batteryPath = writeBatteryFile({
        schema_version: 1,
        pass_policy: {
          overall_top_k_symbol_pass_floor: 0.9,
          edge_focus_pass_floor: 0.8,
        },
        queries: [{
          id: 'good-1',
          category: 'mcp-tool',
          query: 'Find handler',
          'source_file:line': 'src/verify.ts:14',
          expected_top_K_symbols: ['handleVerify'],
        }],
      }, 'good-battery.json');

      expect(loadGoldBattery(batteryPath)).toEqual({
        schema_version: 1,
        pass_policy: {
          overall_pass_rate: 0.9,
          edge_focus_pass_rate: 0.8,
        },
        queries: [{
          id: 'good-1',
          category: 'mcp-tool',
          query: 'Find handler',
          source_file: 'src/verify.ts',
          source_line: 14,
          expected_top_K_symbols: ['handleVerify'],
        }],
      });
    });

    it('rejects unsupported schema versions', () => {
      const batteryPath = writeBatteryFile({
        schema_version: 2,
        pass_policy: {
          overall_pass_rate: 0.9,
          edge_focus_pass_rate: 0.8,
        },
        queries: [],
      }, 'bad-schema.json');

      expect(() => loadGoldBattery(batteryPath)).toThrow(
        'Gold battery at',
      );
      expect(() => loadGoldBattery(batteryPath)).toThrow(
        'must declare schema_version === 1',
      );
    });

    it('rejects invalid pass_policy values', () => {
      const batteryPath = writeBatteryFile({
        schema_version: 1,
        pass_policy: {
          overall_pass_rate: 1.1,
          edge_focus_pass_rate: 0.8,
        },
        queries: [],
      }, 'bad-pass-policy.json');

      expect(() => loadGoldBattery(batteryPath)).toThrow(
        'pass_policy.overall_pass_rate must be between 0 and 1',
      );
    });
  });

  describe('executeBattery', () => {
    it('returns a passing result when every expected symbol is found', async () => {
      const result = await executeBattery(
        buildBattery(),
        async () => outlineResponse({
          status: 'ok',
          data: {
            nodes: [
              { name: 'handleVerify', fqName: 'verify.handleVerify' },
            ],
          },
        }),
        { includeDetails: true },
      );

      expect(result.passed).toBe(true);
      expect(result.overallPassRate).toBe(1);
      expect(result.probes).toEqual([
        expect.objectContaining({
          queryId: 'verify-1',
          query: 'Find handleVerify',
          sourceFile: 'src/verify.ts',
          expectedTopK: ['handleVerify'],
          status: 'passed',
          matchedSymbols: ['handleVerify'],
          missingSymbols: [],
        }),
      ]);
    });

    it('returns a partial failure when only some expected symbols are found', async () => {
      const result = await executeBattery(
        buildBattery({
          queries: [{
            id: 'verify-1',
            category: 'mcp-tool',
            query: 'Find handler',
            source_file: 'src/verify.ts',
            expected_top_K_symbols: ['handleVerify', 'missingSymbol'],
          }],
        }),
        async () => outlineResponse({
          status: 'ok',
          data: {
            nodes: [
              { name: 'handleVerify', fqName: 'verify.handleVerify' },
            ],
          },
        }),
        { includeDetails: true },
      );

      expect(result.passed).toBe(false);
      expect(result.overallPassRate).toBe(0);
      expect(result.missingSymbols).toEqual(['missingSymbol']);
      expect(result.probes).toEqual([
        expect.objectContaining({
          query: 'Find handler',
          sourceFile: 'src/verify.ts',
          expectedTopK: ['handleVerify', 'missingSymbol'],
          status: 'failed',
          matchedSymbols: ['handleVerify'],
          missingSymbols: ['missingSymbol'],
          reason: 'Missing expected symbols: missingSymbol',
        }),
      ]);
    });

    it('flags case-only symbol mismatches as failures', async () => {
      const result = await executeBattery(
        buildBattery({
          queries: [{
            id: 'verify-1',
            category: 'mcp-tool',
            query: 'Find handleVerify',
            source_file: 'src/verify.ts',
            source_line: 27,
            expected_top_K_symbols: ['handleVerify'],
          }],
        }),
        async () => outlineResponse({
          status: 'ok',
          data: {
            nodes: [
              { name: 'handleverify', fqName: 'verify.handleverify' },
            ],
          },
        }),
        { includeDetails: true },
      );

      expect(result.passed).toBe(false);
      expect(result.missingSymbols).toEqual(['handleVerify']);
      expect(result.probes).toEqual([
        expect.objectContaining({
          queryId: 'verify-1',
          query: 'Find handleVerify',
          sourceFile: 'src/verify.ts',
          sourceLine: 27,
          expectedTopK: ['handleVerify'],
          status: 'failed',
          matchedSymbols: [],
          missingSymbols: ['handleVerify'],
          reason: 'Missing expected symbols: handleVerify',
        }),
      ]);
    });

    it('returns blocked probes when outline queries report a stale graph', async () => {
      const result = await executeBattery(
        buildBattery(),
        async () => outlineResponse({
          status: 'blocked',
          reason: 'graph is stale',
        }),
        { includeDetails: true },
      );

      expect(result.passed).toBe(false);
      expect(result.unexpectedErrors).toEqual(['verify-1: graph is stale']);
      expect(result.probes).toEqual([
        expect.objectContaining({
          query: 'Find handleVerify',
          sourceFile: 'src/verify.ts',
          expectedTopK: ['handleVerify'],
          status: 'blocked',
          missingSymbols: ['handleVerify'],
          reason: 'graph is stale',
        }),
      ]);
    });
  });

  describe('handleCodeGraphVerify', () => {
    it('returns blocked when the graph is stale', async () => {
      mocks.ensureCodeGraphReady.mockResolvedValueOnce({
        freshness: 'stale',
        action: 'selective_reindex',
        inlineIndexPerformed: false,
        reason: 'tracked files older than index',
      });

      const response = await handleCodeGraphVerify({ batteryPath: VERIFY_FIXTURE_BATTERY_PATH });
      const parsed = JSON.parse(response.content[0].text);

      expect(parsed).toEqual({
        status: 'blocked',
        readiness: {
          freshness: 'stale',
          action: 'selective_reindex',
          inlineIndexPerformed: false,
          reason: 'tracked files older than index',
          canonicalReadiness: 'stale',
          trustState: 'stale',
        },
      });
      expect(mocks.handleCodeGraphQuery).not.toHaveBeenCalled();
      expect(mocks.setLastGoldVerification).not.toHaveBeenCalled();
    });

    it('returns ok with a VerifyResult when the graph is fresh', async () => {
      const response = await handleCodeGraphVerify({
        batteryPath: VERIFY_FIXTURE_BATTERY_PATH,
        includeDetails: true,
      });
      const parsed = JSON.parse(response.content[0].text);

      expect(parsed.status).toBe('ok');
      expect(parsed.result).toEqual(expect.objectContaining({
        batteryPath: VERIFY_FIXTURE_BATTERY_PATH,
        queryCount: 1,
        passed: true,
        probes: [
          expect.objectContaining({
            status: 'passed',
            matchedSymbols: ['handleVerify'],
          }),
        ],
      }));
      expect(mocks.ensureCodeGraphReady).toHaveBeenCalledWith(expect.any(String), {
        allowInlineIndex: false,
        allowInlineFullScan: false,
      });
    });

    it('persists the last gold verification when persistBaseline is true', async () => {
      const response = await handleCodeGraphVerify({
        batteryPath: VERIFY_FIXTURE_BATTERY_PATH,
        persistBaseline: true,
      });
      const parsed = JSON.parse(response.content[0].text);

      expect(parsed.status).toBe('ok');
      expect(mocks.setLastGoldVerification).toHaveBeenCalledWith(
        expect.objectContaining({
          batteryPath: VERIFY_FIXTURE_BATTERY_PATH,
          passed: true,
        }),
      );
    });

    it('persists failure probes with original query metadata', async () => {
      mocks.handleCodeGraphQuery.mockResolvedValueOnce(outlineResponse({
        status: 'ok',
        data: {
          nodes: [
            { name: 'wrongCase', fqName: 'verify.wrongCase' },
          ],
        },
      }));

      const response = await handleCodeGraphVerify({
        batteryPath: VERIFY_FIXTURE_BATTERY_PATH,
        persistBaseline: true,
      });
      const parsed = JSON.parse(response.content[0].text);

      expect(parsed.status).toBe('ok');
      expect(parsed.result.probes).toEqual([
        expect.objectContaining({
          queryId: 'verify-fixture-1',
          query: 'Find handleVerify',
          sourceFile: 'src/verify.ts',
          expectedTopK: ['handleVerify'],
          status: 'failed',
          matchedSymbols: [],
          missingSymbols: ['handleVerify'],
          reason: 'Missing expected symbols: handleVerify',
        }),
      ]);
      expect(mocks.setLastGoldVerification).toHaveBeenCalledWith(
        expect.objectContaining({
          probes: [
            expect.objectContaining({
              queryId: 'verify-fixture-1',
              query: 'Find handleVerify',
              sourceFile: 'src/verify.ts',
              expectedTopK: ['handleVerify'],
              status: 'failed',
              matchedSymbols: [],
              missingSymbols: ['handleVerify'],
              reason: 'Missing expected symbols: handleVerify',
            }),
          ],
        }),
      );
    });

    it('returns an error when rootDir resolves outside the workspace without probing readiness', async () => {
      const response = await handleCodeGraphVerify({
        rootDir: '/tmp',
        batteryPath: VERIFY_FIXTURE_BATTERY_PATH,
        allowInlineIndex: true,
      });
      const parsed = JSON.parse(response.content[0].text);

      expect(parsed).toEqual({
        status: 'error',
        error: expect.stringContaining('rootDir must stay within the workspace root'),
      });
      expect(mocks.ensureCodeGraphReady).not.toHaveBeenCalled();
      expect(mocks.handleCodeGraphQuery).not.toHaveBeenCalled();
    });

    it('returns an error for battery paths outside approved roots before file reads', async () => {
      const batteryPath = writeBatteryFile(buildBattery(), 'outside-allowlist.json');
      const response = await handleCodeGraphVerify({ batteryPath });
      const parsed = JSON.parse(response.content[0].text);

      expect(parsed).toEqual({
        status: 'error',
        error: expect.stringContaining('batteryPath must stay within approved code-graph asset roots'),
      });
      expect(mocks.readFileSync).not.toHaveBeenCalled();
      expect(mocks.ensureCodeGraphReady).not.toHaveBeenCalled();
    });

    it('resolves the default battery path inside the 007 packet', async () => {
      const response = await handleCodeGraphVerify({ includeDetails: true });
      const parsed = JSON.parse(response.content[0].text);

      expect(parsed.status).toBe('ok');
      expect(parsed.result).toEqual(expect.objectContaining({
        batteryPath: DEFAULT_VERIFY_BATTERY_PATH,
      }));
      expect(parsed.result.queryCount).toBeGreaterThan(0);
    });
  });
});
