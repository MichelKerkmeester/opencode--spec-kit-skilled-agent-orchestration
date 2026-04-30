import { existsSync, mkdtempSync, mkdirSync, realpathSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { closeDb, initDb, replaceNodes, upsertFile } from '../../code_graph/lib/code-graph-db.js';
import { handleCccFeedback } from '../../code_graph/handlers/ccc-feedback.js';
import { handleCccReindex } from '../../code_graph/handlers/ccc-reindex.js';
import { handleCccStatus } from '../../code_graph/handlers/ccc-status.js';
import { generateContentHash, type CodeNode } from '../../code_graph/lib/indexer-types.js';

type HandlerResponse = { content: Array<{ type: string; text: string }> };

interface ParsedPayload {
  readonly status: string;
  readonly data?: Record<string, unknown>;
  readonly error?: string;
}

const TEST_DIR = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(TEST_DIR, '..', '..', '..', '..', '..', '..');
const LIVE_CCC_BIN = join(REPO_ROOT, '.opencode', 'skill', 'mcp-coco-index', 'mcp_server', '.venv', 'bin', 'ccc');
const hasCccBinary = existsSync(LIVE_CCC_BIN);
const cccIt = hasCccBinary ? it : it.skip;
const cccSkipReason = 'skipped: ccc binary unavailable at .opencode/skill/mcp-coco-index/mcp_server/.venv/bin/ccc';
const cccName = (name: string): string => hasCccBinary ? name : `${name} (${cccSkipReason})`;

const tempDirs: string[] = [];
let tempRoot: string;
let originalCwd: string;

function parseResponse(response: HandlerResponse): ParsedPayload {
  return JSON.parse(response.content[0]?.text ?? '{}') as ParsedPayload;
}

function seedStatusDb(): void {
  const filePath = join(tempRoot, 'src', 'ccc-status.ts');
  mkdirSync(dirname(filePath), { recursive: true });
  const content = 'export function cccStatusProbe() { return true; }\n';
  writeFileSync(filePath, content, 'utf-8');
  const node: CodeNode = {
    symbolId: 'ccc-status-probe',
    filePath,
    fqName: 'ccc.cccStatusProbe',
    kind: 'function',
    name: 'cccStatusProbe',
    startLine: 1,
    endLine: 1,
    startColumn: 0,
    endColumn: 20,
    language: 'typescript',
    contentHash: 'ccc-status-probe',
  };
  const fileId = upsertFile(filePath, 'typescript', generateContentHash(content), 1, 0, 'clean', 1);
  replaceNodes(fileId, [node]);
}

function installCccBinaryIntoTempRoot(): void {
  const target = join(tempRoot, '.opencode', 'skill', 'mcp-coco-index', 'mcp_server', '.venv', 'bin', 'ccc');
  mkdirSync(dirname(target), { recursive: true });
  symlinkSync(LIVE_CCC_BIN, target);
}

beforeEach(() => {
  originalCwd = process.cwd();
  tempRoot = realpathSync(mkdtempSync(join(tmpdir(), 'cg-ccc-integration-')));
  tempDirs.push(tempRoot);
  process.chdir(tempRoot);
  initDb(tempRoot);
  seedStatusDb();
  if (hasCccBinary) {
    installCccBinaryIntoTempRoot();
  }
});

afterEach(() => {
  closeDb();
  process.chdir(originalCwd);
  while (tempDirs.length > 0) {
    const dir = tempDirs.pop();
    if (dir && existsSync(dir)) {
      rmSync(dir, { recursive: true, force: true });
    }
  }
});

describe('cg-014,015,016 — CCC integration', () => {
  cccIt(cccName('cg-014 reports incremental reindex execution or a surfaced ccc process error'), async () => {
    const parsed = parseResponse(await handleCccReindex({ full: false }));

    expect(['ok', 'error']).toContain(parsed.status);
    if (parsed.status === 'ok') {
      expect(parsed.data).toMatchObject({
        mode: 'incremental',
        readiness: { reason: 'readiness_not_applicable' },
        canonicalReadiness: 'missing',
        trustState: 'unavailable',
      });
      expect(parsed.data?.output).toEqual(expect.any(String));
    } else {
      expect(parsed.error).toMatch(/Re-index failed|ccc_reindex failed/);
    }
  });

  cccIt(cccName('cg-014 reports full reindex mode distinctly from incremental mode'), async () => {
    const parsed = parseResponse(await handleCccReindex({ full: true }));

    expect(['ok', 'error']).toContain(parsed.status);
    if (parsed.status === 'ok') {
      expect(parsed.data).toMatchObject({
        mode: 'full',
        readiness: { reason: 'readiness_not_applicable' },
      });
    } else {
      expect(parsed.error).toMatch(/Re-index failed|ccc_reindex failed/);
    }
  });

  cccIt(cccName('cg-015 appends helpful feedback JSONL inside the disposable workspace'), async () => {
    const parsed = parseResponse(await handleCccFeedback({
      query: 'find code graph handlers',
      resultFile: 'mcp_server/code_graph/handlers/query.ts',
      rating: 'helpful',
      comment: 'stress path',
    }));

    expect(parsed.status).toBe('ok');
    expect(parsed.data).toMatchObject({
      recorded: true,
      entry: {
        query: 'find code graph handlers',
        resultFile: 'mcp_server/code_graph/handlers/query.ts',
        rating: 'helpful',
        comment: 'stress path',
      },
      readiness: { reason: 'readiness_not_applicable' },
    });
    expect(String(parsed.data?.feedbackFile)).toContain(tempRoot);
    expect(existsSync(String(parsed.data?.feedbackFile))).toBe(true);
  });

  cccIt(cccName('cg-015 rejects missing feedback fields before writing JSONL'), async () => {
    const parsed = parseResponse(await handleCccFeedback({
      query: '',
      rating: 'partial',
    }));

    expect(parsed.status).toBe('error');
    expect(parsed.error).toMatch(/Missing required fields/);
    expect(existsSync(join(tempRoot, '.opencode', 'skill', 'mcp-coco-index', 'feedback', 'search-feedback.jsonl'))).toBe(false);
  });

  cccIt(cccName('cg-016 reports binary availability and index recommendation without spawning reindex'), async () => {
    const parsed = parseResponse(await handleCccStatus());

    expect(parsed.status).toBe('ok');
    expect(parsed.data).toMatchObject({
      available: true,
      indexExists: false,
      readiness: { reason: 'readiness_not_applicable' },
      canonicalReadiness: 'missing',
      trustState: 'unavailable',
    });
    expect(parsed.data?.binaryPath).toBe(join(tempRoot, '.opencode', 'skill', 'mcp-coco-index', 'mcp_server', '.venv', 'bin', 'ccc'));
    expect(parsed.data?.recommendation).toContain('Run ccc_reindex');
  });

  cccIt(cccName('cg-016 detects an existing CocoIndex directory and changes its recommendation'), async () => {
    mkdirSync(join(tempRoot, '.cocoindex_code'), { recursive: true });

    const parsed = parseResponse(await handleCccStatus());

    expect(parsed.status).toBe('ok');
    expect(parsed.data).toMatchObject({
      available: true,
      indexExists: true,
    });
    expect(parsed.data?.recommendation).toContain('CocoIndex is ready');
  });
});
