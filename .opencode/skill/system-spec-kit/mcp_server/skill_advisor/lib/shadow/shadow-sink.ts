// ───────────────────────────────────────────────────────────────
// MODULE: Advisor Shadow Sink
// ───────────────────────────────────────────────────────────────

import { appendFileSync, existsSync, mkdirSync, renameSync, statSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const DEFAULT_MAX_BYTES = 10 * 1024 * 1024;

export interface ShadowDeltaRecord {
  prompt: string;
  recommendation: string;
  liveScore: number;
  shadowScore: number;
  delta: number;
  dominantLane: string | null;
  timestamp?: string;
}

export interface RecordShadowDeltaOptions {
  logPath?: string;
  maxBytes?: number;
  now?: Date;
}

export interface RecordShadowDeltaResult {
  written: boolean;
  logPath: string;
  rotated: boolean;
  error?: string;
}

function defaultShadowDeltaPath(): string {
  const here = dirname(fileURLToPath(import.meta.url));
  return resolve(here, '..', '..', 'data', 'shadow-deltas.jsonl');
}

function recordShadowDelta(
  record: ShadowDeltaRecord,
  options: RecordShadowDeltaOptions = {},
): RecordShadowDeltaResult {
  const logPath = options.logPath
    ?? process.env.SPECKIT_ADVISOR_SHADOW_DELTA_PATH
    ?? defaultShadowDeltaPath();
  try {
    const rotated = rotateIfNeeded(logPath, options.maxBytes ?? DEFAULT_MAX_BYTES, options.now ?? new Date());
    mkdirSync(dirname(logPath), { recursive: true });
    appendFileSync(logPath, `${JSON.stringify({
      ...record,
      timestamp: record.timestamp ?? new Date().toISOString(),
    })}\n`, 'utf8');
    return { written: true, logPath, rotated };
  } catch (error: unknown) {
    return {
      written: false,
      logPath,
      rotated: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

function rotateIfNeeded(logPath: string, maxBytes: number, now: Date): boolean {
  if (!existsSync(logPath)) return false;
  const size = statSync(logPath).size;
  if (size <= maxBytes) return false;
  const suffix = now.toISOString().replace(/[:.]/g, '-');
  renameSync(logPath, `${logPath}.${suffix}.rotated`);
  return true;
}

export {
  recordShadowDelta,
};

