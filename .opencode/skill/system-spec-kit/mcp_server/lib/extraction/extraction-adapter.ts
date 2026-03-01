// ---------------------------------------------------------------
// MODULE: Extraction Adapter
// ---------------------------------------------------------------

import type Database from 'better-sqlite3';
import * as workingMemory from '../cache/cognitive/working-memory';
import { isFeatureEnabled } from '../cache/cognitive/rollout-policy';
import { applyRedactionGate } from './redaction-gate';

type SummarizerId = 'firstLast500' | 'matchCountSummary' | 'stdoutSummary';

interface ExtractionRule {
  id: string;
  toolPattern: RegExp;
  contentPattern: RegExp;
  attention: number;
  summarizer: SummarizerId;
}

interface RuleMatch {
  rule: ExtractionRule;
  sourceText: string;
}

interface ExtractionMetrics {
  matched: number;
  inserted: number;
  skipped: number;
  redacted: number;
}

type RegisterAfterToolCallback = (
  fn: (tool: string, callId: string, result: unknown) => Promise<void>
) => void;

const REDACTION_SKIP_THRESHOLD = 0.9;

const RULES: ExtractionRule[] = [
  {
    id: 'read-spec',
    toolPattern: /^(read|memory_context|memory_search|memory_list)$/i,
    contentPattern: /spec\.md/i,
    attention: 0.9,
    summarizer: 'firstLast500',
  },
  {
    id: 'grep-error',
    toolPattern: /^(grep|memory_search)$/i,
    contentPattern: /\berror\b/i,
    attention: 0.8,
    summarizer: 'matchCountSummary',
  },
  {
    id: 'bash-git-commit',
    toolPattern: /^(bash|memory_save|memory_update)$/i,
    contentPattern: /\bgit\s+commit\b/i,
    attention: 0.7,
    summarizer: 'stdoutSummary',
  },
];

let db: Database.Database | null = null;
const metrics: ExtractionMetrics = {
  matched: 0,
  inserted: 0,
  skipped: 0,
  redacted: 0,
};

function isEnabled(identity?: string): boolean {
  return isFeatureEnabled('SPECKIT_EXTRACTION', identity);
}

function normalizeAttention(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(1, value));
}

function assertSafeRegex(expression: RegExp, ruleId: string, fieldName: 'toolPattern' | 'contentPattern'): void {
  const source = expression.source;
  if (/\([^)]*[+*][^)]*\)[+*{?]/.test(source)) {
    throw new Error(`[extraction-adapter] Unsafe regex rejected (${ruleId}.${fieldName}): nested quantifier group detected`);
  }
  if (/\\[1-9]/.test(source)) {
    throw new Error(`[extraction-adapter] Unsafe regex rejected (${ruleId}.${fieldName}): backreferences are not allowed`);
  }
}

function validateExtractionRules(rules: ExtractionRule[]): void {
  for (const rule of rules) {
    assertSafeRegex(rule.toolPattern, rule.id, 'toolPattern');
    assertSafeRegex(rule.contentPattern, rule.id, 'contentPattern');
    if (rule.summarizer !== 'firstLast500' && rule.summarizer !== 'matchCountSummary' && rule.summarizer !== 'stdoutSummary') {
      throw new Error(`[extraction-adapter] Unknown summarizer for rule ${rule.id}: ${rule.summarizer}`);
    }
  }
}

function stringifyToolResult(result: unknown): string {
  if (typeof result === 'string') return result;
  if (result === null || result === undefined) return '';

  const maybeEnvelope = result as { content?: Array<{ text?: string }> };
  const envelopeText = maybeEnvelope?.content?.[0]?.text;
  if (typeof envelopeText === 'string' && envelopeText.length > 0) {
    return envelopeText;
  }

  try {
    return JSON.stringify(result, null, 2);
  } catch {
    return String(result);
  }
}

function summarizeFirstLast500(content: string): string {
  if (content.length <= 1000) return content;
  const head = content.slice(0, 500);
  const tail = content.slice(-500);
  return `${head}\n...\n${tail}`;
}

function summarizeMatchCount(content: string): string {
  const lines = content.split(/\r?\n/).filter((line) => line.trim().length > 0);
  const sample = lines.slice(0, 5).join('\n');
  return `match_count=${lines.length}\n${sample}`;
}

function summarizeStdout(content: string): string {
  const trimmed = content.trim();
  if (trimmed.length <= 600) return trimmed;
  return `${trimmed.slice(0, 600)}...`;
}

function applySummarizer(summarizer: SummarizerId, content: string): string {
  if (summarizer === 'firstLast500') return summarizeFirstLast500(content);
  if (summarizer === 'matchCountSummary') return summarizeMatchCount(content);
  return summarizeStdout(content);
}

function matchRule(toolName: string, rawText: string): RuleMatch | null {
  for (const rule of RULES) {
    if (!rule.toolPattern.test(toolName)) {
      continue;
    }
    if (!rule.contentPattern.test(rawText)) {
      continue;
    }
    return { rule, sourceText: rawText };
  }
  return null;
}

function resolveSessionId(result: unknown): string {
  try {
    const maybeEnvelope = result as { content?: Array<{ text?: string }> };
    const payloadText = maybeEnvelope?.content?.[0]?.text;
    if (typeof payloadText === 'string' && payloadText.trim().length > 0) {
      const parsed = JSON.parse(payloadText) as {
        meta?: { sessionLifecycle?: { effectiveSessionId?: string }; sessionId?: string };
        data?: { sessionId?: string };
      };
      const fromLifecycle = parsed?.meta?.sessionLifecycle?.effectiveSessionId;
      if (typeof fromLifecycle === 'string' && fromLifecycle.trim().length > 0) {
        return fromLifecycle;
      }
      const fromMeta = parsed?.meta?.sessionId;
      if (typeof fromMeta === 'string' && fromMeta.trim().length > 0) {
        return fromMeta;
      }
      const fromData = parsed?.data?.sessionId;
      if (typeof fromData === 'string' && fromData.trim().length > 0) {
        return fromData;
      }
    }
  } catch {
    // Ignore parsing errors and fall back to default.
  }

  return 'auto-extraction';
}

// E2 FIX: Returns null on resolution failure instead of falling back to most-recent memory ID
function resolveMemoryIdFromText(sourceText: string): number | null {
  if (!db) return null;

  const idMatch = sourceText.match(/"id"\s*:\s*(\d+)/);
  if (idMatch) {
    const memoryId = Number.parseInt(idMatch[1], 10);
    const exists = (db.prepare('SELECT id FROM memory_index WHERE id = ? LIMIT 1') as Database.Statement)
      .get(memoryId) as { id: number } | undefined;
    if (exists?.id) {
      return exists.id;
    }
  }

  const pathMatch = sourceText.match(/[A-Za-z0-9_./-]*spec\.md/);
  if (pathMatch && pathMatch[0].length > 0) {
    const row = (db.prepare('SELECT id FROM memory_index WHERE file_path LIKE ? LIMIT 1') as Database.Statement)
      .get(`%${pathMatch[0]}`) as { id: number } | undefined;
    if (row?.id) {
      return row.id;
    }
  }

  return null;
}

function redactionRatio(original: string, redacted: string): number {
  if (original.length === 0) return 0;
  const delta = Math.max(0, original.length - redacted.length);
  return delta / original.length;
}

async function handleAfterTool(toolName: string, callId: string, result: unknown): Promise<void> {
  if (!isEnabled(callId) || !db) {
    return;
  }

  const rawText = stringifyToolResult(result);
  const matched = matchRule(toolName, rawText);
  if (!matched) {
    return;
  }

  metrics.matched += 1;

  const summary = applySummarizer(matched.rule.summarizer, matched.sourceText);
  const redactionResult = applyRedactionGate(summary);
  if (redactionResult.redactionApplied) {
    metrics.redacted += 1;
  }

  if (redactionRatio(summary, redactionResult.redactedText) > REDACTION_SKIP_THRESHOLD) {
    metrics.skipped += 1;
    console.info(`[extraction-adapter] Skipped insert for ${matched.rule.id}: redaction ratio above threshold`);
    return;
  }

  const memoryId = resolveMemoryIdFromText(matched.sourceText);
  if (!memoryId) {
    metrics.skipped += 1;
    console.info(`[extraction-adapter] Skipped insert for ${matched.rule.id}: no memory_id resolved`);
    return;
  }

  const sessionId = resolveSessionId(result);
  const inserted = workingMemory.upsertExtractedEntry({
    sessionId,
    memoryId,
    attentionScore: normalizeAttention(matched.rule.attention),
    sourceTool: toolName,
    sourceCallId: callId,
    extractionRuleId: matched.rule.id,
    redactionApplied: redactionResult.redactionApplied,
  });

  if (inserted) {
    metrics.inserted += 1;
    console.info(`[extraction-adapter] Inserted working_memory item for memory ${memoryId} (${matched.rule.id})`);
  } else {
    metrics.skipped += 1;
  }
}

function initExtractionAdapter(database: Database.Database, registerCallback: RegisterAfterToolCallback): void {
  db = database;
  validateExtractionRules(RULES);
  registerCallback(handleAfterTool);
}

function getExtractionMetrics(): ExtractionMetrics {
  return { ...metrics };
}

function resetExtractionMetrics(): void {
  metrics.matched = 0;
  metrics.inserted = 0;
  metrics.skipped = 0;
  metrics.redacted = 0;
}

export {
  RULES,
  initExtractionAdapter,
  validateExtractionRules,
  applySummarizer,
  matchRule,
  getExtractionMetrics,
  resetExtractionMetrics,
  isEnabled,
};

export type {
  ExtractionRule,
  ExtractionMetrics,
};
