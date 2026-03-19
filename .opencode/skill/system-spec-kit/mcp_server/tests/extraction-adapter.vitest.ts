// TEST: EXTRACTION ADAPTER (T029-T037)
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import Database from 'better-sqlite3';
import * as workingMemory from '../lib/cognitive/working-memory';
import {
  RULES,
  applySummarizer,
  getExtractionMetrics,
  initExtractionAdapter,
  matchRule,
  resetExtractionMetrics,
} from '../lib/extraction/extraction-adapter';

function createDb() {
  const db = new Database(':memory:');
  db.exec(`
    CREATE TABLE memory_index (
      id INTEGER PRIMARY KEY,
      spec_folder TEXT,
      file_path TEXT,
      title TEXT,
      importance_tier TEXT,
      trigger_phrases TEXT,
      created_at TEXT
    );
  `);
  workingMemory.init(db);
  return db;
}

describe('T029-T037 extraction adapter', () => {
  let db: Database.Database | null = null;
  let callback: ((tool: string, callId: string, result: unknown) => Promise<void>) | null = null;
  const previousFlag = process.env.SPECKIT_EXTRACTION;

  beforeEach(() => {
    process.env.SPECKIT_EXTRACTION = 'true';
    db = createDb();
    resetExtractionMetrics();
    initExtractionAdapter(db, (fn) => {
      callback = fn;
    });

    db.prepare(`
      INSERT INTO memory_index (id, spec_folder, file_path, title, importance_tier, trigger_phrases, created_at)
      VALUES
      (101, '02--system-spec-kit/020-mcp-working-memory-hybrid-rag', '/tmp/spec.md', 'Spec', 'important', '[]', CURRENT_TIMESTAMP),
      (102, '02--system-spec-kit/020-mcp-working-memory-hybrid-rag', '/tmp/error.log', 'Errors', 'normal', '[]', CURRENT_TIMESTAMP)
    `).run();
  });

  afterEach(() => {
    if (db) db.close();
    callback = null;
    if (previousFlag === undefined) {
      delete process.env.SPECKIT_EXTRACTION;
    } else {
      process.env.SPECKIT_EXTRACTION = previousFlag;
    }
  });

  it('T030/T031: rule schema is valid and first match wins', () => {
    expect(RULES).toHaveLength(3);
    const matched = matchRule('Read', 'spec.md contains an error marker');
    expect(matched?.rule.id).toBe('read-spec');
  });

  it('T033/T037: summarizers enforce expected truncation behavior', () => {
    const longContent = 'A'.repeat(1500);
    const firstLast = applySummarizer('firstLast500', longContent);
    expect(firstLast.length).toBeLessThanOrEqual(1105);

    const grepSummary = applySummarizer('matchCountSummary', 'err1\nerr2\nerr3');
    expect(grepSummary).toContain('match_count=3');

    const stdout = applySummarizer('stdoutSummary', 'B'.repeat(900));
    expect(stdout.length).toBeLessThanOrEqual(603);
  });

  it('T035/T038: extraction callback inserts working_memory with provenance', async () => {
    await callback?.(
      'Read',
      'call-read-1',
      { content: [{ type: 'text', text: 'Read /tmp/spec.md with id": 101 and summary payload' }] }
    );

    const row = db?.prepare(`
      SELECT session_id, memory_id, attention_score, source_tool, source_call_id, extraction_rule_id, redaction_applied
      FROM working_memory
      WHERE memory_id = 101
    `).get() as Record<string, unknown>;

    expect(row.memory_id).toBe(101);
    expect(row.attention_score).toBe(0.9);
    expect(row.source_tool).toBe('Read');
    expect(row.source_call_id).toBe('call-read-1');
    expect(row.extraction_rule_id).toBe('read-spec');
    expect(row.redaction_applied).toBe(0);
  });

  it('T035a/T035b/T035c: redaction applies and skips insert when no memory_id resolved', async () => {
    // The bash-git-commit rule matches this content, redaction fires on the token,
    // But resolveMemoryIdFromText() returns null (no "id": pattern, no spec.md path).
    // Without a resolvable memory_id the adapter skips the working_memory insert.
    const metricsBefore = getExtractionMetrics();

    await callback?.(
      'Bash',
      'call-bash-1',
      { content: [{ type: 'text', text: 'git commit && token sk-abcdefghijklmnopqrstuvwxyz123456' }] }
    );

    const metricsAfter = getExtractionMetrics();

    // Rule matched and redaction was applied
    expect(metricsAfter.matched).toBe(metricsBefore.matched + 1);
    expect(metricsAfter.redacted).toBe(metricsBefore.redacted + 1);

    // Insert was skipped — no row present
    const row = db?.prepare(`
      SELECT extraction_rule_id, redaction_applied
      FROM working_memory
      WHERE extraction_rule_id = 'bash-git-commit'
      LIMIT 1
    `).get();
    expect(row).toBeUndefined();
  });

  it('T036: rule matching covers CLI and MCP tool aliases', () => {
    expect(matchRule('Read', 'spec.md')).not.toBeNull();
    expect(matchRule('Grep', 'error at line 10')).not.toBeNull();
    expect(matchRule('Bash', 'git commit -m "x"')).not.toBeNull();
    expect(matchRule('memory_search', 'spec.md error context')).not.toBeNull();
    expect(matchRule('memory_context', 'spec.md metadata')).not.toBeNull();
    expect(matchRule('memory_save', 'git commit -m "x"')).not.toBeNull();
    expect(matchRule('Edit', 'spec.md')).toBeNull();
  });

  it('T035e: passthrough content is not redacted', async () => {
    await callback?.('Grep', 'call-grep-1', { content: [{ type: 'text', text: 'error: build failed at step 2' }] });

    const metrics = getExtractionMetrics();
    expect(metrics.matched).toBeGreaterThan(0);
    expect(metrics.redacted).toBe(0);
  });
});
