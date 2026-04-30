// ───────────────────────────────────────────────────────────────
// MODULE: Lifecycle Routing Stress Test
// ───────────────────────────────────────────────────────────────

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { performance } from 'node:perf_hooks';

import { applyAgeHaircutToLane, derivedAgeMultiplier } from '../../skill_advisor/lib/lifecycle/age-haircut.js';
import {
  filterCorpusStatEligible,
  filterDefaultRoutable,
  routePolicyForPath,
} from '../../skill_advisor/lib/lifecycle/archive-handling.js';
import { rollbackDerivedBlock, rollbackGraphMetadataFile } from '../../skill_advisor/lib/lifecycle/rollback.js';
import { backfillDerivedV2, readMixedVersion } from '../../skill_advisor/lib/lifecycle/schema-migration.js';
import { routeSupersession } from '../../skill_advisor/lib/lifecycle/supersession.js';
import type { SkillDerivedV2 } from '../../skill_advisor/schemas/skill-derived-v2.js';

interface CorpusEntry {
  readonly skillId: string;
  readonly sourcePath: string;
}

let tmpDir: string;

beforeEach(() => {
  tmpDir = mkdtempSync(join(tmpdir(), 'stress-sa-lifecycle-'));
});

afterEach(() => {
  rmSync(tmpDir, { recursive: true, force: true });
});

function derivedFixture(index = 0): SkillDerivedV2 {
  return {
    trigger_phrases: [`route fixture ${index}`],
    keywords: [`keyword fixture ${index}`],
    provenance_fingerprint: `sha256:${String(index).padStart(64, '0').slice(-64)}`,
    generated_at: '2026-04-30T00:00:00.000Z',
    source_docs: ['SKILL.md'],
    key_files: [`.opencode/skill/skill-${index}/SKILL.md`],
    demotion: 1,
    trust_lane: 'derived_generated',
    sanitizer_version: 'sanitizeSkillLabel:v1',
    lifecycle_status: 'active',
  };
}

function write(relativePath: string, content: string): string {
  const filePath = join(tmpDir, relativePath);
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, content, 'utf8');
  return filePath;
}

function writeGraphMetadata(index: number): string {
  return write(`skills/skill-${index}/graph-metadata.json`, JSON.stringify({
    schema_version: 2,
    skill_id: `skill-${index}`,
    intent_signals: [`author route ${index}`],
    retained_author_field: {
      index,
      stable: true,
    },
    derived: derivedFixture(index),
  }, null, 2));
}

describe('sa-014..sa-018 — lifecycle routing stress behavior', () => {
  it('sa-014 applies age haircuts only to derived lanes across a broad age range', () => {
    const now = new Date('2026-04-30T00:00:00.000Z');
    const derivedScores = Array.from({ length: 720 }, (_, ageDays) => {
      const generatedAt = new Date(now.getTime() - ageDays * 86_400_000);
      return applyAgeHaircutToLane(
        { trustLane: 'derived_generated', score: 1 },
        { generatedAt, now, halfLifeDays: 90 },
      ).score;
    });
    const authorScores = Array.from({ length: 720 }, (_, ageDays) => {
      const generatedAt = new Date(now.getTime() - ageDays * 86_400_000);
      return applyAgeHaircutToLane(
        { trustLane: 'explicit_author', score: 1 },
        { generatedAt, now, halfLifeDays: 90 },
      ).score;
    });

    expect(authorScores.every((score) => score === 1)).toBe(true);
    expect(Math.max(...derivedScores)).toBe(1);
    expect(Math.min(...derivedScores)).toBe(0.1);
    expect(derivedScores[0]).toBeGreaterThan(derivedScores[180]);
    expect(derivedScores[180]).toBeGreaterThan(derivedScores[360]);
    expect(derivedAgeMultiplier({ generatedAt: now, now, lifecycleStatus: 'deprecated' })).toBe(0.25);
    expect(derivedAgeMultiplier({ generatedAt: now, now, lifecycleStatus: 'archived' })).toBe(0);
    expect(derivedAgeMultiplier({ generatedAt: now, now, lifecycleStatus: 'future' })).toBe(0);
  });

  it('sa-015 routes dense supersession chains forward without making deprecated entries default-routable', () => {
    const chain = Array.from({ length: 200 }, (_, index) => ({
      skillId: `skill-${String(index).padStart(3, '0')}`,
      lifecycleStatus: index === 199 ? 'active' as const : 'deprecated' as const,
      redirectTo: index === 199 ? null : `skill-${String(index + 1).padStart(3, '0')}`,
      redirectFrom: index === 199 ? ['skill-198'] : undefined,
      score: 1 - index / 1_000,
    }));

    const implicit = routeSupersession('route the current workflow', chain);
    const explicit = routeSupersession('please use skill-000 for compatibility', chain);

    expect(implicit[0]).toMatchObject({
      skillId: 'skill-199',
      routable: true,
      reason: 'successor-default',
      redirect_from: ['skill-198'],
    });
    expect(implicit.filter((entry) => entry.routable)).toHaveLength(1);
    expect(explicit[0]).toMatchObject({
      skillId: 'skill-000',
      routable: true,
      reason: 'explicit-deprecated-redirect',
      redirect_to: 'skill-001',
    });
    expect(explicit.find((entry) => entry.skillId === 'skill-199')?.redirect_to).toBeUndefined();
  });

  it('sa-016 structurally indexes archive and future skills while excluding them from live routing', () => {
    const entries: CorpusEntry[] = [
      ...Array.from({ length: 500 }, (_, index) => ({
        skillId: `active-${index}`,
        sourcePath: `.opencode/skill/active-${index}/graph-metadata.json`,
      })),
      ...Array.from({ length: 240 }, (_, index) => ({
        skillId: `archived-${index}`,
        sourcePath: `.opencode/skill/z_archive/archived-${index}/graph-metadata.json`,
      })),
      ...Array.from({ length: 160 }, (_, index) => ({
        skillId: `future-${index}`,
        sourcePath: `.opencode\\skill\\z_future\\future-${index}\\graph-metadata.json`,
      })),
    ];
    const routed = filterDefaultRoutable(entries);
    const corpusEligible = filterCorpusStatEligible(entries);
    const archivedPolicy = routePolicyForPath('.opencode/skill/z_archive/old/graph-metadata.json');
    const futurePolicy = routePolicyForPath('.opencode\\skill\\z_future\\planned\\graph-metadata.json');

    expect(entries.every((entry) => routePolicyForPath(entry.sourcePath).structurallyIndexed)).toBe(true);
    expect(routed).toHaveLength(500);
    expect(corpusEligible).toHaveLength(500);
    expect(routed.every((entry) => entry.skillId.startsWith('active-'))).toBe(true);
    expect(archivedPolicy).toMatchObject({
      lifecycleStatus: 'archived',
      defaultRoutable: false,
      includeInCorpusStats: false,
    });
    expect(futurePolicy).toMatchObject({
      lifecycleStatus: 'future',
      defaultRoutable: false,
      includeInCorpusStats: false,
    });
  });

  it('sa-017 backfills large mixed-version batches additively while v1 records remain routable', () => {
    const records = Array.from({ length: 1_000 }, (_, index) => ({
      schema_version: index % 3 === 0 ? 2 : 1,
      skill_id: `skill-${index}`,
      intent_signals: index % 5 === 0 ? [] : [`legacy route ${index}`],
      retained_author_field: {
        index,
        nested: { stable: true },
      },
    }));
    const startedAt = performance.now();
    const migrated = records.map((record, index) => backfillDerivedV2(record, derivedFixture(index)));
    const elapsedMs = performance.now() - startedAt;

    expect(elapsedMs).toBeLessThan(2_000);
    expect(migrated).toHaveLength(1_000);
    for (const [index, migration] of migrated.entries()) {
      const mixed = readMixedVersion(migration.metadata);

      expect(migration.metadata.retained_author_field).toEqual(records[index].retained_author_field);
      expect(migration.metadata.schema_version).toBe(2);
      expect(mixed.schemaVersion).toBe(2);
      expect(mixed.derived?.key_files).toEqual([`.opencode/skill/skill-${index}/SKILL.md`]);
      expect(migration.routableDuringTransition).toBe(index % 5 !== 0);
    }

    expect(readMixedVersion({
      schema_version: 1,
      intent_signals: ['legacy-only route'],
    }).routable).toBe(true);
  });

  it('sa-018 rolls back many graph-metadata files atomically without leaving derived residue', () => {
    const graphPaths = Array.from({ length: 160 }, (_, index) => writeGraphMetadata(index));
    const rollbackResults = graphPaths.map((graphPath) => rollbackGraphMetadataFile(graphPath));
    const leftoverTempFiles = readdirSync(tmpDir, { recursive: true })
      .filter((entry) => String(entry).endsWith('.tmp'));

    expect(rollbackResults.every((result) => result.removedDerived)).toBe(true);
    expect(rollbackResults.every((result) => result.reindexRequired)).toBe(true);
    expect(leftoverTempFiles).toEqual([]);

    for (const [index, graphPath] of graphPaths.entries()) {
      const after = JSON.parse(readFileSync(graphPath, 'utf8')) as Record<string, unknown>;

      expect(after.schema_version).toBe(1);
      expect(after.derived).toBeUndefined();
      expect(after.intent_signals).toEqual([`author route ${index}`]);
      expect(after.retained_author_field).toEqual({ index, stable: true });
    }

    const inMemoryRollback = rollbackDerivedBlock({
      schema_version: 2,
      skill_id: 'single',
      derived: derivedFixture(999),
      intent_signals: ['single route'],
    });
    expect(inMemoryRollback.metadata).toMatchObject({
      schema_version: 1,
      skill_id: 'single',
      intent_signals: ['single route'],
    });
    expect(inMemoryRollback.metadata.derived).toBeUndefined();
  });
});
