// ───────────────────────────────────────────────────────────────
// MODULE: Code Graph Verify Tests
// ───────────────────────────────────────────────────────────────

import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
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
}));

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
  let tempDir = '';

  beforeEach(() => {
    tempDir = mkdtempSync(join(tmpdir(), 'code-graph-verify-'));
    vi.clearAllMocks();
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
          status: 'failed',
          matchedSymbols: ['handleVerify'],
          missingSymbols: ['missingSymbol'],
          reason: 'Missing expected symbols: missingSymbol',
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
          status: 'blocked',
          missingSymbols: ['handleVerify'],
          reason: 'graph is stale',
        }),
      ]);
    });
  });

  describe('handleCodeGraphVerify', () => {
    it('returns blocked when the graph is stale', async () => {
      const batteryPath = writeBatteryFile(buildBattery(), 'blocked-battery.json');
      mocks.ensureCodeGraphReady.mockResolvedValueOnce({
        freshness: 'stale',
        action: 'selective_reindex',
        inlineIndexPerformed: false,
        reason: 'tracked files older than index',
      });

      const response = await handleCodeGraphVerify({ batteryPath });
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
      const batteryPath = writeBatteryFile(buildBattery(), 'fresh-battery.json');

      const response = await handleCodeGraphVerify({
        batteryPath,
        includeDetails: true,
      });
      const parsed = JSON.parse(response.content[0].text);

      expect(parsed.status).toBe('ok');
      expect(parsed.result).toEqual(expect.objectContaining({
        batteryPath,
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
      const batteryPath = writeBatteryFile(buildBattery(), 'persist-battery.json');

      const response = await handleCodeGraphVerify({
        batteryPath,
        persistBaseline: true,
      });
      const parsed = JSON.parse(response.content[0].text);

      expect(parsed.status).toBe('ok');
      expect(mocks.setLastGoldVerification).toHaveBeenCalledWith(
        expect.objectContaining({
          batteryPath,
          passed: true,
        }),
      );
    });
  });
});
