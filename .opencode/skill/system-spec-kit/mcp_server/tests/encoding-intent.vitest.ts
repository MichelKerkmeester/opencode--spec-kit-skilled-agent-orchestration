// TEST: Encoding-Intent Capture at Index Time
//
// Covers: classifyEncodingIntent from lib/search/encoding-intent.ts
//
// Coverage areas:
// T01-T03 : Empty / null / undefined edge cases
// T04-T06 : Pure prose → 'document'
// T07-T09 : TypeScript / JavaScript code → 'code'
// T10-T12 : Structured data (tables, YAML, JSON) → 'structured_data'
// T13-T15 : Mixed content → correct dominant type
// T16-T17 : Code block inside prose — ratio determines result
// T18      : Type export validation
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, it, expect, vi } from 'vitest';
import { classifyEncodingIntent } from '../lib/search/encoding-intent';
import type { EncodingIntent } from '../lib/search/encoding-intent';

const tempDirs: string[] = [];

function makeTempDir(prefix: string): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  tempDirs.push(dir);
  return dir;
}

afterEach(() => {
  delete process.env.SPEC_KIT_DB_DIR;
  delete process.env.MEMORY_ALLOWED_PATHS;

  for (const dir of tempDirs.splice(0)) {
    try {
      fs.rmSync(dir, { recursive: true, force: true });
    } catch {
      // Ignore test cleanup failures
    }
  }
});

// ===============================================================
// SECTION 1: Empty / null / undefined edge cases
// ===============================================================

describe('classifyEncodingIntent — empty and null-ish inputs', () => {
  it('T01: empty string returns "document"', () => {
    expect(classifyEncodingIntent('')).toBe('document');
  });

  it('T02: null cast returns "document"', () => {
    expect(classifyEncodingIntent(null as unknown as string)).toBe('document');
  });

  it('T03: undefined cast returns "document"', () => {
    expect(classifyEncodingIntent(undefined as unknown as string)).toBe('document');
  });
});

// ===============================================================
// SECTION 2: Pure prose content → 'document'
// ===============================================================

describe('classifyEncodingIntent — prose content → "document"', () => {
  it('T04: simple markdown prose returns "document"', () => {
    const content = [
      '# Memory Title',
      '',
      'This is a memory about a decision we made regarding the search pipeline.',
      'The team discussed several options and ultimately chose to implement RRF',
      'fusion scoring because it provides better result diversity.',
      '',
      '## Context',
      '',
      'We evaluated BM25, vector search, and hybrid approaches. The hybrid',
      'approach using Reciprocal Rank Fusion was selected for its simplicity',
      'and proven effectiveness in information retrieval literature.',
    ].join('\n');

    expect(classifyEncodingIntent(content)).toBe('document');
  });

  it('T05: short natural language sentence returns "document"', () => {
    const content = 'The pipeline was refactored to use a four-stage architecture.';
    expect(classifyEncodingIntent(content)).toBe('document');
  });

  it('T06: markdown with headers, lists, and links returns "document"', () => {
    const content = [
      '# Sprint 5 Summary',
      '',
      '## Key Decisions',
      '',
      '- Adopted pipeline v2 architecture',
      '- Implemented anchor metadata extraction',
      '- Added validation metadata signals',
      '',
      '## References',
      '',
      'See [the spec](./spec.md) for full details.',
      'Related to [issue #42](https://github.com/example/issues/42).',
      '',
      '> "Simplicity is the ultimate sophistication." - Leonardo da Vinci',
    ].join('\n');

    expect(classifyEncodingIntent(content)).toBe('document');
  });
});

// ===============================================================
// SECTION 3: Code content → 'code'
// ===============================================================

describe('classifyEncodingIntent — code content → "code"', () => {
  it('T07: TypeScript source file returns "code"', () => {
    const content = [
      'import { describe, it, expect } from "vitest";',
      'import { classifyEncodingIntent } from "../lib/search/encoding-intent";',
      '',
      'export interface SearchResult {',
      '  id: number;',
      '  score: number;',
      '  content: string;',
      '}',
      '',
      'export function computeScore(result: SearchResult): number {',
      '  const base = result.score * 0.7;',
      '  const bonus = result.content.length > 100 ? 0.1 : 0;',
      '  return Math.min(1.0, base + bonus);',
      '}',
      '',
      'const results: SearchResult[] = [];',
      'for (const r of results) {',
      '  console.log(computeScore(r));',
      '}',
    ].join('\n');

    expect(classifyEncodingIntent(content)).toBe('code');
  });

  it('T08: JavaScript with require statements returns "code"', () => {
    const content = [
      'const fs = require("fs");',
      'const path = require("path");',
      '',
      'function readConfig(filePath) {',
      '  const raw = fs.readFileSync(filePath, "utf8");',
      '  return JSON.parse(raw);',
      '}',
      '',
      'const config = readConfig(path.join(__dirname, "config.json"));',
      'console.log(config.database.host);',
    ].join('\n');

    expect(classifyEncodingIntent(content)).toBe('code');
  });

  it('T09: Python-like code with class/function keywords returns "code"', () => {
    const content = [
      'class SearchEngine {',
      '  constructor(private index: VectorIndex) {}',
      '',
      '  async search(query: string): Promise<Result[]> {',
      '    const embedding = await this.index.embed(query);',
      '    const results = this.index.query(embedding, { limit: 10 });',
      '    return results.map(r => ({',
      '      id: r.id,',
      '      score: r.similarity,',
      '      content: r.content,',
      '    }));',
      '  }',
      '}',
    ].join('\n');

    expect(classifyEncodingIntent(content)).toBe('code');
  });
});

// ===============================================================
// SECTION 4: Structured data → 'structured_data'
// ===============================================================

describe('classifyEncodingIntent — structured data → "structured_data"', () => {
  it('T10: markdown table-heavy content returns "structured_data"', () => {
    const content = [
      '| Feature | Status | Priority |',
      '| ------- | ------ | -------- |',
      '| Pipeline v2 | Done | P0 |',
      '| Anchor metadata | Done | P1 |',
      '| Validation signals | In progress | P1 |',
      '| Encoding intent | Planned | P2 |',
      '| Consolidation | Planned | P2 |',
      '| Graph expansion | Planned | P3 |',
    ].join('\n');

    expect(classifyEncodingIntent(content)).toBe('structured_data');
  });

  it('T11: YAML front matter dominant content returns "structured_data"', () => {
    const content = [
      '---',
      'title: Sprint 6 Plan',
      'status: active',
      'priority: high',
      'assignee: team-lead',
      'tags: [pipeline, indexing, metadata]',
      'created: 2026-02-28',
      'updated: 2026-02-28',
      '---',
      '',
      'Brief description.',
    ].join('\n');

    expect(classifyEncodingIntent(content)).toBe('structured_data');
  });

  it('T12: key-value config content returns "structured_data"', () => {
    const content = [
      'database_host: localhost',
      'database_port: 5432',
      'database_name: speckit',
      'cache_ttl: 300',
      'max_connections: 10',
      'log_level: info',
      'feature_flags:',
      '  pipeline_v2: true',
      '  encoding_intent: false',
      '  consolidation: false',
    ].join('\n');

    expect(classifyEncodingIntent(content)).toBe('structured_data');
  });
});

// ===============================================================
// SECTION 5: Mixed content — dominant type wins
// ===============================================================

describe('classifyEncodingIntent — mixed content', () => {
  it('T13: mostly prose with a small code snippet returns "document"', () => {
    const content = [
      '# Architecture Decision',
      '',
      'We decided to use the pipeline v2 architecture for the search system.',
      'The key benefit is separation of concerns between stages.',
      '',
      'The main entry point is:',
      '',
      '```typescript',
      'pipeline.execute(query);',
      '```',
      '',
      'This approach simplifies testing and allows independent stage development.',
      'Each stage can be validated in isolation before integration.',
      'The overall system reliability has improved significantly.',
    ].join('\n');

    expect(classifyEncodingIntent(content)).toBe('document');
  });

  it('T14: mostly code with a brief prose header returns "code"', () => {
    const content = [
      '# Helper functions',
      '',
      '```typescript',
      'import { SearchResult } from "./types";',
      '',
      'export function normalizeScore(score: number): number {',
      '  return Math.max(0, Math.min(1, score));',
      '}',
      '',
      'export function mergeResults(a: SearchResult[], b: SearchResult[]): SearchResult[] {',
      '  const seen = new Set<number>();',
      '  const merged: SearchResult[] = [];',
      '  for (const r of [...a, ...b]) {',
      '    if (!seen.has(r.id)) {',
      '      seen.add(r.id);',
      '      merged.push(r);',
      '    }',
      '  }',
      '  return merged;',
      '}',
      '```',
    ].join('\n');

    expect(classifyEncodingIntent(content)).toBe('code');
  });

  it('T15: table-heavy content with brief intro returns "structured_data"', () => {
    const content = [
      '# Feature Matrix',
      '',
      '| Module | LOC | Tests | Coverage |',
      '| ------ | --- | ----- | -------- |',
      '| Pipeline | 450 | 32 | 89% |',
      '| Anchor | 180 | 22 | 95% |',
      '| Validation | 210 | 18 | 92% |',
      '| Encoding | 95 | 15 | 100% |',
      '| Consolidation | 320 | 28 | 85% |',
      '| Graph | 280 | 24 | 88% |',
    ].join('\n');

    expect(classifyEncodingIntent(content)).toBe('structured_data');
  });
});

// ===============================================================
// SECTION 6: Code blocks inside prose — ratio determines result
// ===============================================================

describe('classifyEncodingIntent — code block ratio', () => {
  it('T16: large code block in short prose exceeds threshold → "code"', () => {
    const content = [
      'Implementation:',
      '',
      '```typescript',
      'import { Database } from "better-sqlite3";',
      '',
      'export class VectorIndex {',
      '  private db: Database;',
      '',
      '  constructor(dbPath: string) {',
      '    this.db = new Database(dbPath);',
      '    this.db.pragma("journal_mode = WAL");',
      '  }',
      '',
      '  async search(embedding: number[], limit: number): Promise<Row[]> {',
      '    const stmt = this.db.prepare("SELECT * FROM memory_index ORDER BY similarity DESC LIMIT ?");',
      '    return stmt.all(limit) as Row[];',
      '  }',
      '',
      '  close(): void {',
      '    this.db.close();',
      '  }',
      '}',
      '```',
    ].join('\n');

    expect(classifyEncodingIntent(content)).toBe('code');
  });

  it('T17: tiny code block in extensive prose stays "document"', () => {
    const content = [
      '# Decision Record: Search Pipeline Architecture',
      '',
      'After extensive evaluation of different search approaches, the team',
      'concluded that a four-stage pipeline would best serve our needs.',
      'The stages are: retrieval, scoring, reranking, and presentation.',
      '',
      'Each stage has clear input/output contracts and can be tested',
      'independently. The retrieval stage handles both BM25 and vector',
      'search, combining results via Reciprocal Rank Fusion.',
      '',
      'A simple example of invoking the pipeline:',
      '',
      '```',
      'pipeline.run(query)',
      '```',
      '',
      'The scoring stage applies intent-based adjustments and temporal',
      'decay. The reranking stage uses MMR for diversity. Finally, the',
      'presentation stage formats results for the MCP response envelope.',
      '',
      'This architecture has proven to be maintainable and extensible.',
      'Adding new signals (like anchor metadata or validation metadata)',
      'requires only adding a new step within the appropriate stage.',
    ].join('\n');

    expect(classifyEncodingIntent(content)).toBe('document');
  });
});

// ===============================================================
// SECTION 7: Type export and return value validation
// ===============================================================

describe('classifyEncodingIntent — type and return value guarantees', () => {
  it('T18: return value is always one of the three EncodingIntent literals', () => {
    const validIntents: EncodingIntent[] = ['document', 'code', 'structured_data'];

    const samples = [
      '',
      'Hello world',
      'import { foo } from "bar";\nconst x = 1;',
      '| a | b |\n| - | - |\n| 1 | 2 |',
      '---\ntitle: test\n---\nBody.',
    ];

    for (const sample of samples) {
      const result = classifyEncodingIntent(sample);
      expect(validIntents).toContain(result);
    }
  });
});

// ===============================================================
// SECTION 8: Integration — persisted encoding_intent metadata
// ===============================================================

describe('encoding_intent persistence integration', () => {
  it('R16-INT-01: indexMemory persists explicit encoding_intent for embedded rows', async () => {
    vi.resetModules();
    const tempDir = makeTempDir('s6-r16-index-');
    const dbPath = path.join(tempDir, 'context-index.sqlite');

    process.env.SPEC_KIT_DB_DIR = tempDir;
    process.env.MEMORY_ALLOWED_PATHS = process.cwd();

    const vectorIndex = await import('../lib/search/vector-index');
    vectorIndex.initializeDb(dbPath);
    const embeddingDim = vectorIndex.getEmbeddingDim();

    const memoryId = vectorIndex.indexMemory({
      specFolder: 'specs/02--system-spec-kit/test-r16',
      filePath: path.join(tempDir, 'embedded.md'),
      title: 'Embedded row',
      triggerPhrases: [],
      importanceWeight: 0.5,
      embedding: new Float32Array(embeddingDim).fill(0.01),
      encodingIntent: 'code',
      contentText: 'const answer = 42;',
    });

    const db = vectorIndex.getDb();
    expect(db).toBeTruthy();
    const row = db.prepare('SELECT encoding_intent FROM memory_index WHERE id = ?').get(memoryId) as { encoding_intent: string } | undefined;

    expect(row?.encoding_intent).toBe('code');
    vectorIndex.closeDb();
  });

  it('R16-INT-02: indexMemoryDeferred persists explicit encoding_intent for deferred rows', async () => {
    vi.resetModules();
    const tempDir = makeTempDir('s6-r16-deferred-');
    const dbPath = path.join(tempDir, 'context-index.sqlite');

    process.env.SPEC_KIT_DB_DIR = tempDir;
    process.env.MEMORY_ALLOWED_PATHS = process.cwd();

    const vectorIndex = await import('../lib/search/vector-index');
    vectorIndex.initializeDb(dbPath);

    const memoryId = vectorIndex.indexMemoryDeferred({
      specFolder: 'specs/02--system-spec-kit/test-r16',
      filePath: path.join(tempDir, 'deferred.md'),
      title: 'Deferred row',
      triggerPhrases: [],
      importanceWeight: 0.5,
      encodingIntent: 'structured_data',
      failureReason: 'test deferred',
      contentText: '| key | value |',
    });

    const db = vectorIndex.getDb();
    expect(db).toBeTruthy();
    const row = db.prepare('SELECT encoding_intent FROM memory_index WHERE id = ?').get(memoryId) as { encoding_intent: string } | undefined;

    expect(row?.encoding_intent).toBe('structured_data');
    vectorIndex.closeDb();
  });
});
