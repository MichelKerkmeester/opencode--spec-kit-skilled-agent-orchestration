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
import {
  classifyAdvisorException,
  type AdvisorErrorClass,
} from './error-diagnostics.js';
import { getSkillGraphGenerationPath } from './freshness/generation.js';

// ───────────────────────────────────────────────────────────────
// 1. TYPES
// ───────────────────────────────────────────────────────────────

export type AdvisorGenerationStatus = 'ok' | 'recovered' | 'unavailable';
export type AdvisorGenerationRecoveryPath = 'regenerate' | 'unrecoverable';

/** Persistent workspace generation counter status for advisor freshness probes. */
export interface AdvisorGenerationSnapshot {
  readonly generation: number;
  readonly sourceSignature: string | null;
  readonly status: AdvisorGenerationStatus;
  readonly reason: string | null;
  readonly recoveryPath: AdvisorGenerationRecoveryPath | null;
  readonly errorClass?: AdvisorErrorClass;
  readonly errorMessage?: string;
}

interface GenerationFilePayload {
  readonly generation: number;
  readonly updatedAt: string;
  readonly sourceSignature?: string | null;
  readonly reason?: string;
  readonly state?: string;
}

// ───────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────

const observedGenerations = new Map<string, number>();

// ───────────────────────────────────────────────────────────────
// 3. HELPERS
// ───────────────────────────────────────────────────────────────

function workspaceKey(workspaceRoot: string): string {
  return resolve(workspaceRoot);
}

function ok(generation: number, sourceSignature: string | null): AdvisorGenerationSnapshot {
  return {
    generation,
    sourceSignature,
    status: 'ok',
    reason: null,
    recoveryPath: null,
  };
}

function recovered(generation: number): AdvisorGenerationSnapshot {
  return {
    generation,
    sourceSignature: null,
    status: 'recovered',
    reason: 'GENERATION_COUNTER_RECOVERED',
    recoveryPath: 'regenerate',
  };
}

function unavailable(
  reason: string,
  errorDiagnostics?: ReturnType<typeof classifyAdvisorException>,
): AdvisorGenerationSnapshot {
  return {
    generation: 0,
    sourceSignature: null,
    status: 'unavailable',
    reason,
    recoveryPath: 'unrecoverable',
    ...(errorDiagnostics ?? {}),
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
    && typeof record.updatedAt === 'string'
    && (
      record.sourceSignature === undefined
      || record.sourceSignature === null
      || typeof record.sourceSignature === 'string'
    );
}

function writeGenerationAtomic(filePath: string, generation: number, sourceSignature: string | null = null): void {
  mkdirSync(dirname(filePath), { recursive: true });
  const payload: GenerationFilePayload = {
    generation,
    updatedAt: new Date().toISOString(),
    sourceSignature,
    reason: 'LEGACY_ADVISOR_GENERATION_BUMP',
    state: 'live',
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

function parseGenerationFile(filePath: string): GenerationFilePayload {
  const raw = readFileSync(filePath, 'utf8');
  const payload: unknown = JSON.parse(raw);
  if (!isGenerationFilePayload(payload)) {
    throw new Error(
      `Invalid generation counter payload at ${filePath}: expected {generation: safe integer >= 0, updatedAt: string}; actual ${typeof payload}.`,
    );
  }
  return {
    ...payload,
    sourceSignature: payload.sourceSignature ?? null,
  };
}

function recoverMalformedCounter(workspaceRoot: string, filePath: string): AdvisorGenerationSnapshot {
  const key = workspaceKey(workspaceRoot);
  const observedGeneration = observedGenerations.get(key) ?? 0;
  const nextGeneration = Math.max(observedGeneration, 1) + 1;
  try {
    writeGenerationAtomic(filePath, nextGeneration);
    observedGenerations.set(key, nextGeneration);
    return recovered(nextGeneration);
  } catch (error: unknown) {
    return unavailable('GENERATION_COUNTER_CORRUPT', classifyAdvisorException(error));
  }
}

function setGeneration(
  workspaceRoot: string,
  filePath: string,
  generation: number,
  sourceSignature: string | null = null,
): AdvisorGenerationSnapshot {
  try {
    writeGenerationAtomic(filePath, generation, sourceSignature);
    observedGenerations.set(workspaceKey(workspaceRoot), generation);
    return ok(generation, sourceSignature);
  } catch (error: unknown) {
    return unavailable('GENERATION_COUNTER_UNAVAILABLE', classifyAdvisorException(error));
  }
}

// ───────────────────────────────────────────────────────────────
// 4. PUBLIC API
// ───────────────────────────────────────────────────────────────

/** Resolve the persistent generation-counter path for a workspace. */
export function getAdvisorGenerationPath(workspaceRoot: string): string {
  return getSkillGraphGenerationPath(resolve(workspaceRoot));
}

/** Read or recover the advisor generation counter for freshness checks. */
export function readAdvisorGeneration(workspaceRoot: string): AdvisorGenerationSnapshot {
  const filePath = getAdvisorGenerationPath(workspaceRoot);
  try {
    const payload = parseGenerationFile(filePath);
    observedGenerations.set(workspaceKey(workspaceRoot), payload.generation);
    return ok(payload.generation, payload.sourceSignature ?? null);
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

/** Increment the advisor generation counter after source-affecting writes. */
export function incrementAdvisorGeneration(workspaceRoot: string): AdvisorGenerationSnapshot {
  const current = readAdvisorGeneration(workspaceRoot);
  if (current.status === 'unavailable') {
    return current;
  }
  const filePath = getAdvisorGenerationPath(workspaceRoot);
  return setGeneration(workspaceRoot, filePath, current.generation + 1);
}

/** Clear process-local generation observations for tests. */
export function clearAdvisorGenerationMemory(): void {
  observedGenerations.clear();
}
