// ───────────────────────────────────────────────────────────────
// MODULE: Derived Metadata Sync
// ───────────────────────────────────────────────────────────────

import { closeSync, existsSync, fsyncSync, mkdirSync, openSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { SkillDerivedV2Schema, SKILL_DERIVED_SANITIZER_VERSION, type SkillDerivedV2 } from '../../schemas/skill-derived-v2.js';
import { applyAntiStuffing } from './anti-stuffing.js';
import { extractDerivedMetadata } from './extract.js';
import { sanitizeDerivedArray } from './sanitizer.js';

// ───────────────────────────────────────────────────────────────
// 1. TYPES
// ───────────────────────────────────────────────────────────────

export interface SyncDerivedOptions {
  readonly workspaceRoot: string;
  readonly skillDir: string;
  readonly lifecycleStatus?: SkillDerivedV2['lifecycle_status'];
  readonly redirectFrom?: readonly string[];
  readonly redirectTo?: string;
  readonly now?: Date;
}

export interface SyncDerivedResult {
  readonly graphMetadataPath: string;
  readonly derived: SkillDerivedV2;
  readonly changed: boolean;
  readonly diagnostics: readonly string[];
}

// ───────────────────────────────────────────────────────────────
// 2. HELPERS
// ───────────────────────────────────────────────────────────────

function readGraphMetadata(filePath: string): Record<string, unknown> {
  if (!existsSync(filePath)) {
    throw new Error(`graph-metadata.json does not exist: ${filePath}`);
  }
  const parsed: unknown = JSON.parse(readFileSync(filePath, 'utf8'));
  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    throw new Error(`graph-metadata.json root must be an object: ${filePath}`);
  }
  return parsed as Record<string, unknown>;
}

function fsyncPath(targetPath: string): void {
  let fd: number | null = null;
  try {
    fd = openSync(targetPath, 'r');
    fsyncSync(fd);
  } finally {
    if (fd !== null) closeSync(fd);
  }
}

function writeJsonAtomic(filePath: string, payload: Record<string, unknown>): void {
  mkdirSync(dirname(filePath), { recursive: true });
  const tmpPath = `${filePath}.${process.pid}.${Date.now()}.tmp`;
  try {
    writeFileSync(tmpPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
    fsyncPath(tmpPath);
    renameSync(tmpPath, filePath);
    fsyncPath(dirname(filePath));
  } catch (error: unknown) {
    rmSync(tmpPath, { force: true });
    throw error;
  }
}

function isWithin(parent: string, child: string): boolean {
  const relativePath = relative(parent, child);
  return relativePath === '' || (!relativePath.startsWith(`..${sep}`) && relativePath !== '..' && !relativePath.startsWith('/'));
}

// Compare derived blocks ignoring `generated_at` so repeated syncs of an
// unchanged SKILL.md are idempotent. `generated_at` is the only non-content
// field — `provenance_fingerprint` is deterministic from the source bytes,
// and every other field reflects extracted/normalized SKILL.md content.
function stableDerivedJson(value: unknown): string {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return JSON.stringify(value);
  }
  const { generated_at: _ignored, ...rest } = value as Record<string, unknown>;
  return JSON.stringify(rest);
}

// ───────────────────────────────────────────────────────────────
// 3. CORE LOGIC
// ───────────────────────────────────────────────────────────────

export function syncDerivedMetadata(options: SyncDerivedOptions): SyncDerivedResult {
  const workspaceRoot = resolve(options.workspaceRoot);
  const skillDir = resolve(options.skillDir);
  if (!isWithin(workspaceRoot, skillDir)) {
    throw new Error(`skillDir must stay under workspaceRoot: ${skillDir}`);
  }
  const graphMetadataPath = join(skillDir, 'graph-metadata.json');
  const graphMetadata = readGraphMetadata(graphMetadataPath);
  const extraction = extractDerivedMetadata(options);
  const antiStuffing = applyAntiStuffing(extraction.triggerPhrases, extraction.keywords);
  if (antiStuffing.rejected) {
    throw new Error(`Derived metadata rejected: ${antiStuffing.diagnostics.join(', ')}`);
  }

  const derived = SkillDerivedV2Schema.parse({
    trigger_phrases: antiStuffing.triggerPhrases,
    keywords: antiStuffing.keywords,
    provenance_fingerprint: extraction.provenanceFingerprint,
    generated_at: (options.now ?? new Date()).toISOString(),
    source_docs: extraction.sourceDocs,
    key_files: extraction.keyFiles,
    demotion: antiStuffing.demotion,
    trust_lane: 'derived_generated',
    sanitizer_version: SKILL_DERIVED_SANITIZER_VERSION,
    lifecycle_status: options.lifecycleStatus ?? 'active',
    redirect_from: options.redirectFrom ? sanitizeDerivedArray(options.redirectFrom, 'graph-metadata', 16) : undefined,
    redirect_to: options.redirectTo ? sanitizeDerivedArray([options.redirectTo], 'graph-metadata', 1)[0] : undefined,
  });
  const before = stableDerivedJson(graphMetadata.derived ?? null);
  const after = stableDerivedJson(derived);
  const contentChanged = before !== after;
  const schemaUpgrade = graphMetadata.schema_version !== 2;
  const changed = contentChanged || schemaUpgrade;
  // When content is unchanged, preserve the existing derived block (including its
  // existing `generated_at`) so callers see a stable result and on-disk state
  // remains byte-stable across repeated syncs.
  const finalDerived = contentChanged
    ? derived
    : ((graphMetadata.derived as SkillDerivedV2) ?? derived);
  const nextGraphMetadata = {
    ...graphMetadata,
    schema_version: 2,
    derived: finalDerived,
  };
  if (changed) {
    writeJsonAtomic(graphMetadataPath, nextGraphMetadata);
  }

  return {
    graphMetadataPath,
    derived: finalDerived,
    changed,
    diagnostics: [...extraction.diagnostics, ...antiStuffing.diagnostics],
  };
}
