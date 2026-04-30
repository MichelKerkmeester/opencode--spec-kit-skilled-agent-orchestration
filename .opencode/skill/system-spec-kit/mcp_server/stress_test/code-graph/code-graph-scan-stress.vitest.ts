import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { performance } from 'node:perf_hooks';

const mocks = vi.hoisted(() => ({
  executeBattery: vi.fn(),
  loadGoldBattery: vi.fn(),
}));

vi.mock('../../code_graph/lib/gold-query-verifier.js', () => ({
  DEFAULT_GOLD_BATTERY_PATH: '/fixture/code-graph-gold-queries.json',
  executeBattery: mocks.executeBattery,
  loadGoldBattery: mocks.loadGoldBattery,
}));

import { closeDb, initDb } from '../../code_graph/lib/code-graph-db.js';
import { handleCodeGraphScan } from '../../code_graph/handlers/scan.js';

interface HandlerResponsePayload {
  readonly status: string;
  readonly data?: {
    readonly filesScanned: number;
    readonly filesIndexed: number;
    readonly filesSkipped: number;
    readonly totalNodes: number;
    readonly totalEdges: number;
    readonly errors: string[];
    readonly durationMs: number;
    readonly verification?: {
      readonly passed: boolean;
      readonly batteryPath: string;
    };
    readonly canonicalReadiness: string;
    readonly trustState: string;
  };
  readonly error?: string;
}

describe('cg-003 — code_graph_scan', () => {
  let tmpDir: string;
  let rootDir: string;

  beforeEach(() => {
    tmpDir = mkdtempSync(join(process.cwd(), 'stress-cg-003-'));
    rootDir = join(tmpDir, 'workspace');
    mkdirSync(rootDir, { recursive: true });
    mkdirSync(join(tmpDir, 'db'), { recursive: true });
    initDb(join(tmpDir, 'db'));
    mocks.executeBattery.mockResolvedValue({
      passed: true,
      queryCount: 1,
      pass_policy: { overall_pass_rate: 0.9, edge_focus_pass_rate: 0.8 },
      overall_pass_rate: 1,
      edge_focus_pass_rate: 1,
      categoryPassRates: {},
      missingSymbols: [],
      unexpectedErrors: [],
      probes: [],
    });
    mocks.loadGoldBattery.mockReturnValue({
      schema_version: 1,
      pass_policy: { overall_pass_rate: 0.9, edge_focus_pass_rate: 0.8 },
      queries: [],
    });
  });

  afterEach(() => {
    closeDb();
    rmSync(tmpDir, { recursive: true, force: true });
    vi.clearAllMocks();
  });

  function parseResponse(response: { content: Array<{ type: string; text: string }> }): HandlerResponsePayload {
    return JSON.parse(response.content[0]?.text ?? '{}') as HandlerResponsePayload;
  }

  function writeWideTree(fileCount: number): void {
    for (let index = 0; index < fileCount; index += 1) {
      const dir = join(rootDir, `lane-${index % 25}`, `branch-${index % 10}`);
      mkdirSync(dir, { recursive: true });
      writeFileSync(
        join(dir, `fixture-${index}.ts`),
        `export function fixture_${index}(): number {\n  return ${index};\n}\n`,
        'utf8',
      );
    }
  }

  it('indexes a 1000+ file tree through the full-scan handler', async () => {
    writeWideTree(1_001);

    const startedAt = performance.now();
    const response = parseResponse(await handleCodeGraphScan({
      rootDir,
      incremental: false,
      includeGlobs: ['**/*.ts'],
    }));
    const elapsedMs = performance.now() - startedAt;

    expect(response.status).toBe('ok');
    expect(response.data?.filesScanned).toBe(1_001);
    expect(response.data?.filesIndexed).toBe(1_001);
    expect(response.data?.totalNodes).toBeGreaterThanOrEqual(1_001);
    expect(response.data?.errors).toEqual([]);
    expect(response.data?.canonicalReadiness).toBe('ready');
    expect(response.data?.trustState).toBe('live');
    expect(elapsedMs).toBeLessThan(120_000);
  });

  it('runs the verifier only for explicit full scans with verify=true', async () => {
    writeWideTree(3);

    const response = parseResponse(await handleCodeGraphScan({
      rootDir,
      incremental: false,
      includeGlobs: ['**/*.ts'],
      verify: true,
    }));

    expect(response.status).toBe('ok');
    expect(response.data?.verification).toEqual(expect.objectContaining({
      passed: true,
      batteryPath: '/fixture/code-graph-gold-queries.json',
    }));
    expect(mocks.loadGoldBattery).toHaveBeenCalledWith('/fixture/code-graph-gold-queries.json');
    expect(mocks.executeBattery).toHaveBeenCalledTimes(1);
  });

  it('keeps concurrent scans callable against the same graph database', async () => {
    writeWideTree(40);

    const responses = await Promise.all(
      Array.from({ length: 4 }, () => handleCodeGraphScan({
        rootDir,
        incremental: false,
        includeGlobs: ['**/*.ts'],
      }).then(parseResponse)),
    );

    expect(responses.every((response) => response.status === 'ok')).toBe(true);
    expect(responses.map((response) => response.data?.filesScanned)).toEqual([40, 40, 40, 40]);
    expect(responses.every((response) => response.data?.errors.length === 0)).toBe(true);
  });
});
