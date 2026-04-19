// ───────────────────────────────────────────────────────────────
// MODULE: Skill Advisor Generation Counter
// ───────────────────────────────────────────────────────────────

import {
  mkdirSync,
  readFileSync,
  renameSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join, resolve } from 'node:path';

// ───────────────────────────────────────────────────────────────
// 1. TYPES
// ───────────────────────────────────────────────────────────────

export type AdvisorGenerationStatus = 'ok' | 'recovered' | 'unavailable';
export type AdvisorGenerationRecoveryPath = 'regenerate' | 'unrecoverable';

/** Persistent workspace generation counter status for advisor freshness probes. */
export interface AdvisorGenerationSnapshot {
  readonly generation: number;
  readonly status: AdvisorGenerationStatus;
  readonly reason: string | null;
  readonly recoveryPath: AdvisorGenerationRecoveryPath | null;
}

interface GenerationFilePayload {
  readonly generation: number;
  readonly updatedAt: string;
}

// ───────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────

const GENERATION_STATE_RELATIVE_PATH = join(
  '.opencode',
  'skill',
  '.advisor-state',
  'generation.json',
);

const observedGenerations = new Map<string, number>();

// ───────────────────────────────────────────────────────────────
// 3. HELPERS
// ───────────────────────────────────────────────────────────────

function workspaceKey(workspaceRoot: string): string {
  return resolve(workspaceRoot);
}

function ok(generation: number): AdvisorGenerationSnapshot {
  return {
    generation,
    status: 'ok',
    reason: null,
    recoveryPath: null,
  };
}

function recovered(generation: number): AdvisorGenerationSnapshot {
  return {
    generation,
    status: 'recovered',
    reason: 'GENERATION_COUNTER_RECOVERED',
    recoveryPath: 'regenerate',
  };
}

function unavailable(reason: string): AdvisorGenerationSnapshot {
  return {
    generation: 0,
    status: 'unavailable',
    reason,
    recoveryPath: 'unrecoverable',
  };
}

function isGenerationFilePayload(value: unknown): value is GenerationFilePayload {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }
  const record = value as Record<string, unknown>;
  return typeof record.generation === 'number'
    && Number.isSafeInteger(record.generation)
    && record.generation >= 0
    && typeof record.updatedAt === 'string';
}

function writeGenerationAtomic(filePath: string, generation: number): void {
  mkdirSync(dirname(filePath), { recursive: true });
  const payload: GenerationFilePayload = {
    generation,
    updatedAt: new Date().toISOString(),
  };
  const tempPath = `${filePath}.${process.pid}.${Date.now()}.tmp`;
  try {
    writeFileSync(tempPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
    renameSync(tempPath, filePath);
  } catch (error: unknown) {
    try {
      rmSync(tempPath, { force: true });
    } catch {
      // Best-effort temp cleanup; the original write failure is authoritative.
    }
    throw error;
  }
}

function parseGenerationFile(filePath: string): number {
  const raw = readFileSync(filePath, 'utf8');
  const payload: unknown = JSON.parse(raw);
  if (!isGenerationFilePayload(payload)) {
    throw new Error(
      `Invalid generation counter payload at ${filePath}: expected {generation: safe integer >= 0, updatedAt: string}; actual ${typeof payload}.`,
    );
  }
  return payload.generation;
}

function recoverMalformedCounter(workspaceRoot: string, filePath: string): AdvisorGenerationSnapshot {
  const key = workspaceKey(workspaceRoot);
  const observedGeneration = observedGenerations.get(key) ?? 0;
  const nextGeneration = Math.max(observedGeneration, 1) + 1;
  try {
    writeGenerationAtomic(filePath, nextGeneration);
    observedGenerations.set(key, nextGeneration);
    return recovered(nextGeneration);
  } catch {
    return unavailable('GENERATION_COUNTER_CORRUPT');
  }
}

function setGeneration(workspaceRoot: string, filePath: string, generation: number): AdvisorGenerationSnapshot {
  try {
    writeGenerationAtomic(filePath, generation);
    observedGenerations.set(workspaceKey(workspaceRoot), generation);
    return ok(generation);
  } catch {
    return unavailable('GENERATION_COUNTER_UNAVAILABLE');
  }
}

// ───────────────────────────────────────────────────────────────
// 4. PUBLIC API
// ───────────────────────────────────────────────────────────────

export function getAdvisorGenerationPath(workspaceRoot: string): string {
  return join(resolve(workspaceRoot), GENERATION_STATE_RELATIVE_PATH);
}

export function readAdvisorGeneration(workspaceRoot: string): AdvisorGenerationSnapshot {
  const filePath = getAdvisorGenerationPath(workspaceRoot);
  try {
    const generation = parseGenerationFile(filePath);
    observedGenerations.set(workspaceKey(workspaceRoot), generation);
    return ok(generation);
  } catch (error: unknown) {
    const code = error instanceof Error && 'code' in error
      ? String((error as NodeJS.ErrnoException).code)
      : null;
    if (code === 'ENOENT') {
      return setGeneration(workspaceRoot, filePath, 0);
    }
    return recoverMalformedCounter(workspaceRoot, filePath);
  }
}

export function incrementAdvisorGeneration(workspaceRoot: string): AdvisorGenerationSnapshot {
  const current = readAdvisorGeneration(workspaceRoot);
  if (current.status === 'unavailable') {
    return current;
  }
  const filePath = getAdvisorGenerationPath(workspaceRoot);
  return setGeneration(workspaceRoot, filePath, current.generation + 1);
}

export function clearAdvisorGenerationMemory(): void {
  observedGenerations.clear();
}
