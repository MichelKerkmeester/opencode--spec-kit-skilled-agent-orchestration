// ───────────────────────────────────────────────────────────────
// MODULE: Skill Derived Schema Migration
// ───────────────────────────────────────────────────────────────

import type { SkillDerivedV2 } from '../../schemas/skill-derived-v2.js';

// ───────────────────────────────────────────────────────────────
// 1. TYPES
// ───────────────────────────────────────────────────────────────

export interface SkillGraphMetadataLike {
  readonly schema_version?: number;
  readonly derived?: unknown;
  readonly intent_signals?: unknown;
  readonly [key: string]: unknown;
}

export interface MigrationResult {
  readonly metadata: SkillGraphMetadataLike;
  readonly changed: boolean;
  readonly routableDuringTransition: boolean;
}

// ───────────────────────────────────────────────────────────────
// 2. CORE LOGIC
// ───────────────────────────────────────────────────────────────

export function isRoutableDuringMigration(metadata: SkillGraphMetadataLike): boolean {
  return Array.isArray(metadata.intent_signals) && metadata.intent_signals.some((entry) => typeof entry === 'string' && entry.trim());
}

export function backfillDerivedV2(metadata: SkillGraphMetadataLike, derived: SkillDerivedV2): MigrationResult {
  const next = {
    ...metadata,
    schema_version: 2,
    derived,
  };
  return {
    metadata: next,
    changed: metadata.schema_version !== 2 || JSON.stringify(metadata.derived ?? null) !== JSON.stringify(derived),
    routableDuringTransition: isRoutableDuringMigration(metadata),
  };
}

export function readMixedVersion(metadata: SkillGraphMetadataLike): {
  readonly schemaVersion: 1 | 2;
  readonly derived: SkillDerivedV2 | null;
  readonly routable: boolean;
} {
  const schemaVersion = metadata.schema_version === 2 ? 2 : 1;
  return {
    schemaVersion,
    derived: schemaVersion === 2 && typeof metadata.derived === 'object' && metadata.derived !== null
      ? metadata.derived as SkillDerivedV2
      : null,
    routable: isRoutableDuringMigration(metadata),
  };
}

