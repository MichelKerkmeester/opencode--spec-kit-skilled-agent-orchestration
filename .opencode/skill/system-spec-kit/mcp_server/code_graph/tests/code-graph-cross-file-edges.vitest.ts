// ───────────────────────────────────────────────────────────────
// MODULE: Cross-File CALLS Edge Tests
// ───────────────────────────────────────────────────────────────

import { afterEach, describe, expect, it } from 'vitest';
import { mkdirSync, mkdtempSync, realpathSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, relative } from 'node:path';
import { closeDb, getDb, initDb } from '../lib/code-graph-db.js';
import { resolveCrossFileCallEdges } from '../lib/cross-file-edge-resolver.js';
import { handleCodeGraphQuery } from '../handlers/query.js';
import { handleCodeGraphScan } from '../handlers/scan.js';

interface Fixture {
  rootDir: string;
  workspaceDir: string;
  dbDir: string;
}

interface CallEdgeRow {
  source_id: string;
  target_id: string;
  source_file_path: string;
  source_fq_name: string;
  target_file_path: string;
  target_fq_name: string;
  target_kind: string;
  target_name: string;
}

let originalCwd = process.cwd();

function createFixture(label: string): Fixture {
  const rootDir = mkdtempSync(join(tmpdir(), `code-graph-cross-file-${label}-`));
  const workspaceDir = join(rootDir, 'workspace');
  const dbDir = join(rootDir, 'db');
  mkdirSync(workspaceDir, { recursive: true });
  mkdirSync(dbDir, { recursive: true });
  const canonicalWorkspaceDir = realpathSync(workspaceDir);
  const canonicalDbDir = realpathSync(dbDir);
  initDb(canonicalDbDir);
  process.chdir(canonicalWorkspaceDir);
  return { rootDir, workspaceDir: canonicalWorkspaceDir, dbDir: canonicalDbDir };
}

function writeWorkspaceFile(rootDir: string, relativePath: string, content: string): string {
  const filePath = join(rootDir, relativePath);
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, content);
  return filePath;
}

async function runFullScan(workspaceDir: string): Promise<Record<string, unknown>> {
  const response = await handleCodeGraphScan({
    rootDir: workspaceDir,
    incremental: false,
  });
  const payload = JSON.parse(response.content[0].text) as Record<string, unknown>;
  expect(payload.status).toBe('ok');
  expect((payload.data as { errors: string[] }).errors).toEqual([]);
  return payload.data as Record<string, unknown>;
}

async function queryCallsTo(subject: string): Promise<Record<string, unknown>> {
  const response = await handleCodeGraphQuery({
    operation: 'calls_to',
    subject,
    limit: 10,
  });
  const payload = JSON.parse(response.content[0].text) as Record<string, unknown>;
  expect(payload.status).toBe('ok');
  return payload.data as Record<string, unknown>;
}

function callEdgesByTargetName(name: string): CallEdgeRow[] {
  return getDb().prepare(`
    SELECT
      edge.source_id AS source_id,
      edge.target_id AS target_id,
      source.file_path AS source_file_path,
      source.fq_name AS source_fq_name,
      target.file_path AS target_file_path,
      target.fq_name AS target_fq_name,
      target.kind AS target_kind,
      target.name AS target_name
    FROM code_edges edge
    INNER JOIN code_nodes source ON source.symbol_id = edge.source_id
    INNER JOIN code_nodes target ON target.symbol_id = edge.target_id
    WHERE edge.edge_type = 'CALLS'
      AND target.name = ?
    ORDER BY source.file_path, source.fq_name, target.file_path, target.fq_name
  `).all(name) as CallEdgeRow[];
}

function allCallEdges(): Array<{ source_id: string; target_id: string; edge_type: string }> {
  return getDb().prepare(`
    SELECT source_id, target_id, edge_type
    FROM code_edges
    WHERE edge_type = 'CALLS'
    ORDER BY source_id, target_id, edge_type
  `).all() as Array<{ source_id: string; target_id: string; edge_type: string }>;
}

afterEach(() => {
  process.chdir(originalCwd);
  closeDb();
});

describe('cross-file CALLS edge resolution', () => {
  it('rewrites an imported function call to the exported definition after a full scan', async () => {
    const fixture = createFixture('happy');
    try {
      writeWorkspaceFile(
        fixture.workspaceDir,
        'lib/util.ts',
        'export function helper() { return 1; }\n',
      );
      writeWorkspaceFile(
        fixture.workspaceDir,
        'handlers/main.ts',
        [
          "import { helper } from '../lib/util.js';",
          '',
          'export function run() {',
          '  return helper();',
          '}',
          '',
        ].join('\n'),
      );

      await runFullScan(fixture.workspaceDir);

      const query = await queryCallsTo('helper') as {
        selectedCandidate: { filePath: string; kind: string };
        edges: Array<{ source: string; file: string }>;
      };
      expect(query.selectedCandidate.kind).toBe('function');
      expect(relative(fixture.workspaceDir, query.selectedCandidate.filePath)).toBe('lib/util.ts');
      expect(query.edges).toHaveLength(1);
      expect(relative(fixture.workspaceDir, query.edges[0].file)).toBe('handlers/main.ts');

      const helperEdges = callEdgesByTargetName('helper');
      expect(helperEdges).toHaveLength(1);
      expect(helperEdges[0].target_kind).toBe('function');
      expect(relative(fixture.workspaceDir, helperEdges[0].target_file_path)).toBe('lib/util.ts');
    } finally {
      rmSync(fixture.rootDir, { recursive: true, force: true });
    }
  });

  it('leaves imported call targets on the import node when same-name definitions are ambiguous', async () => {
    const fixture = createFixture('ambiguous');
    try {
      writeWorkspaceFile(fixture.workspaceDir, 'lib/a.ts', 'export function process() { return 1; }\n');
      writeWorkspaceFile(fixture.workspaceDir, 'lib/b.ts', 'export function process() { return 2; }\n');
      writeWorkspaceFile(
        fixture.workspaceDir,
        'handlers/main.ts',
        [
          "import { process } from '../lib/a.js';",
          '',
          'export function run() {',
          '  return process();',
          '}',
          '',
        ].join('\n'),
      );

      await runFullScan(fixture.workspaceDir);

      const processEdges = callEdgesByTargetName('process');
      expect(processEdges).toHaveLength(1);
      expect(processEdges[0].target_kind).toBe('import');
      expect(relative(fixture.workspaceDir, processEdges[0].target_file_path)).toBe('handlers/main.ts');
    } finally {
      rmSync(fixture.rootDir, { recursive: true, force: true });
    }
  });

  it('is idempotent across repeated full scans', async () => {
    const fixture = createFixture('idempotent');
    try {
      writeWorkspaceFile(fixture.workspaceDir, 'lib/util.ts', 'export function helper() { return 1; }\n');
      writeWorkspaceFile(
        fixture.workspaceDir,
        'handlers/main.ts',
        "import { helper } from '../lib/util.js';\nexport function run() { return helper(); }\n",
      );

      await runFullScan(fixture.workspaceDir);
      const firstEdges = allCallEdges();

      await runFullScan(fixture.workspaceDir);
      const secondEdges = allCallEdges();

      expect(secondEdges).toEqual(firstEdges);
    } finally {
      rmSync(fixture.rootDir, { recursive: true, force: true });
    }
  });

  it('leaves same-file function call targets unchanged on a second resolver pass', async () => {
    const fixture = createFixture('same-file');
    try {
      writeWorkspaceFile(
        fixture.workspaceDir,
        'src/main.ts',
        [
          'export function helper() { return 1; }',
          '',
          'export function run() {',
          '  return helper();',
          '}',
          '',
        ].join('\n'),
      );

      await runFullScan(fixture.workspaceDir);
      const before = callEdgesByTargetName('helper');

      const stats = resolveCrossFileCallEdges();
      const after = callEdgesByTargetName('helper');

      expect(stats).toEqual({ resolved: 0, unresolved: 0, ambiguousSkipped: 0 });
      expect(after).toEqual(before);
      expect(after).toHaveLength(1);
      expect(after[0].target_kind).toBe('function');
      expect(relative(fixture.workspaceDir, after[0].target_file_path)).toBe('src/main.ts');
    } finally {
      rmSync(fixture.rootDir, { recursive: true, force: true });
    }
  });

  it('resolves getDefaultConfig calls from scan and ensure-ready fixtures', async () => {
    const fixture = createFixture('multi-call');
    try {
      writeWorkspaceFile(
        fixture.workspaceDir,
        'mcp_server/code_graph/lib/indexer-types.ts',
        'export function getDefaultConfig() { return { rootDir: process.cwd() }; }\n',
      );
      writeWorkspaceFile(
        fixture.workspaceDir,
        'mcp_server/code_graph/handlers/scan.ts',
        [
          "import { getDefaultConfig } from '../lib/indexer-types.js';",
          '',
          'export function handleCodeGraphScan() {',
          '  return getDefaultConfig();',
          '}',
          '',
        ].join('\n'),
      );
      writeWorkspaceFile(
        fixture.workspaceDir,
        'mcp_server/code_graph/lib/ensure-ready.ts',
        [
          "import { getDefaultConfig } from './indexer-types.js';",
          '',
          'export function ensureCodeGraphReady() {',
          '  return getDefaultConfig();',
          '}',
          '',
        ].join('\n'),
      );

      await runFullScan(fixture.workspaceDir);

      const query = await queryCallsTo('getDefaultConfig') as {
        selectedCandidate: { filePath: string };
        edges: Array<{ source: string; file: string }>;
      };
      expect(relative(fixture.workspaceDir, query.selectedCandidate.filePath))
        .toBe('mcp_server/code_graph/lib/indexer-types.ts');
      expect(query.edges).toHaveLength(2);
      expect(query.edges.map((edge) => relative(fixture.workspaceDir, edge.file)).sort()).toEqual([
        'mcp_server/code_graph/handlers/scan.ts',
        'mcp_server/code_graph/lib/ensure-ready.ts',
      ]);

      const resolvedEdges = callEdgesByTargetName('getDefaultConfig');
      expect(resolvedEdges).toHaveLength(2);
      expect(resolvedEdges.every((edge) => edge.target_kind === 'function')).toBe(true);
    } finally {
      rmSync(fixture.rootDir, { recursive: true, force: true });
    }
  });
});
