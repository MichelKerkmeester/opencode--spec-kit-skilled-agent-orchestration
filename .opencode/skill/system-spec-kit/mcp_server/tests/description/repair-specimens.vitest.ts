import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { mergePreserveRepair } from '../../lib/description/repair';
import type { PerFolderDescription } from '../../lib/search/folder-discovery';

type DiscoveryModule = typeof import('../../lib/search/folder-discovery');

const FIXTURE_NAMES = [
  '017-review-findings-remediation.description.json',
  '017-001-infrastructure-primitives.description.json',
  '017-002-cluster-consumers.description.json',
] as const;

function readFixture(name: (typeof FIXTURE_NAMES)[number]): Record<string, unknown> {
  const fixtureUrl = new URL(`./fixtures/${name}`, import.meta.url);
  return JSON.parse(fs.readFileSync(fixtureUrl, 'utf-8')) as Record<string, unknown>;
}

function createSpecFolderWithDescription(
  fixtureName: (typeof FIXTURE_NAMES)[number],
  mutate?: (payload: Record<string, unknown>) => Record<string, unknown>,
): {
  dir: string;
  payload: Record<string, unknown>;
  descriptionPath: string;
} {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'description-repair-specimen-'));
  const basePayload = readFixture(fixtureName);
  const payload = mutate ? mutate(basePayload) : basePayload;
  const descriptionPath = path.join(dir, 'description.json');

  fs.writeFileSync(path.join(dir, 'spec.md'), '# Fixture Spec\n\nRegenerated description.\n', 'utf-8');
  fs.writeFileSync(descriptionPath, JSON.stringify(payload, null, 2), 'utf-8');

  return {
    dir,
    payload,
    descriptionPath,
  };
}

function buildCanonicalDescription(
  payload: Record<string, unknown>,
  overrides: Partial<PerFolderDescription> = {},
): PerFolderDescription {
  return {
    specFolder: String(payload.specFolder),
    description: overrides.description ?? 'Canonical regenerated description',
    keywords: overrides.keywords ?? ['canonical', 'regenerated'],
    lastUpdated: overrides.lastUpdated ?? '2026-04-18T16:30:00.000Z',
    specId: overrides.specId ?? String(payload.specId ?? ''),
    folderSlug: overrides.folderSlug ?? String(payload.folderSlug ?? ''),
    parentChain: overrides.parentChain ?? ((payload.parentChain as string[]) ?? []),
    memorySequence: overrides.memorySequence ?? 7,
    memoryNameHistory: overrides.memoryNameHistory ?? [],
  };
}

async function loadModules(): Promise<{
  discovery: DiscoveryModule;
}> {
  vi.resetModules();
  const discovery = await import('../../lib/search/folder-discovery');
  await import('../../../scripts/spec-folder/generate-description');
  return { discovery };
}

function normalizeForComparison(payload: Record<string, unknown>): Record<string, unknown> {
  const clone = JSON.parse(JSON.stringify(payload)) as Record<string, unknown>;
  delete clone.lastUpdated;
  return clone;
}

const cleanupTargets: string[] = [];

afterEach(() => {
  delete process.env.SPECKIT_DESCRIPTION_REPAIR_MERGE_SAFE;
  vi.restoreAllMocks();
  while (cleanupTargets.length > 0) {
    const target = cleanupTargets.pop();
    if (!target) continue;
    try {
      fs.rmSync(target, { recursive: true, force: true });
    } catch {
      /* best effort */
    }
  }
});

describe('description.json discriminated loader', () => {
  it('returns file_missing, parse_error, and schema_error with detail', async () => {
    const { discovery } = await loadModules();
    const missingDir = fs.mkdtempSync(path.join(os.tmpdir(), 'description-repair-missing-'));
    cleanupTargets.push(missingDir);

    expect(discovery.getRepairMergeSafe()).toBe(true);
    expect(discovery.loadExistingDescription(missingDir)).toEqual({
      ok: false,
      reason: 'file_missing',
    });

    const parseDir = fs.mkdtempSync(path.join(os.tmpdir(), 'description-repair-parse-'));
    cleanupTargets.push(parseDir);
    fs.writeFileSync(path.join(parseDir, 'description.json'), '{invalid json', 'utf-8');

    const parseResult = discovery.loadExistingDescription(parseDir);
    expect(parseResult.ok).toBe(false);
    expect(parseResult.reason).toBe('parse_error');
    expect(parseResult.detail).toMatch(/JSON|Unexpected/i);

    const schemaFixture = createSpecFolderWithDescription(
      '017-review-findings-remediation.description.json',
      (payload) => ({
        ...payload,
        memorySequence: 'broken',
      }),
    );
    cleanupTargets.push(schemaFixture.dir);

    const schemaResult = discovery.loadExistingDescription(schemaFixture.dir);
    expect(schemaResult.ok).toBe(false);
    expect(schemaResult.reason).toBe('schema_error');
    expect(schemaResult.detail).toContain('memorySequence must be a number');
    expect(schemaResult.partial?.title).toBe('Phase 017 Review-Findings Remediation');
  });
});

describe('description.json schema-error repair specimens', () => {
  it('preserves authored rich keys through the real save path when merge-safe repair is enabled', async () => {
    const { discovery } = await loadModules();
    const specimen = createSpecFolderWithDescription(
      '017-001-infrastructure-primitives.description.json',
      (payload) => ({
        ...payload,
        memorySequence: 'broken',
      }),
    );
    cleanupTargets.push(specimen.dir);

    const loadResult = discovery.loadExistingDescription(specimen.dir);
    expect(loadResult.ok).toBe(false);
    expect(loadResult.reason).toBe('schema_error');

    const canonical = buildCanonicalDescription(specimen.payload, {
      description: 'Rebuilt infrastructure primitives summary',
      keywords: ['wave-a', 'repair-safe'],
      lastUpdated: '2026-04-18T18:00:00.000Z',
      memorySequence: 11,
    });

    discovery.savePerFolderDescription(canonical, specimen.dir);

    const raw = JSON.parse(fs.readFileSync(specimen.descriptionPath, 'utf-8')) as Record<string, unknown>;
    expect(raw.description).toBe('Rebuilt infrastructure primitives summary');
    expect(raw.keywords).toEqual(['wave-a', 'repair-safe']);
    expect(raw.memorySequence).toBe(11);
    expect(raw.title).toBe(specimen.payload.title);
    expect(raw.kind).toBe(specimen.payload.kind);
    expect(raw.scope).toEqual(specimen.payload.scope);
    expect(raw.atomicShipGroups).toEqual(specimen.payload.atomicShipGroups);

    const repaired = discovery.loadPerFolderDescription(specimen.dir);
    expect(repaired).not.toBeNull();
    expect(repaired!.description).toBe('Rebuilt infrastructure primitives summary');
  });

  it('applies mergePreserveRepair to committed specimens without dropping authored keys', async () => {
    const { discovery } = await loadModules();

    for (const fixtureName of FIXTURE_NAMES) {
      const specimen = createSpecFolderWithDescription(fixtureName, (payload) => ({
        ...payload,
        memorySequence: 'broken',
      }));
      cleanupTargets.push(specimen.dir);

      const loadResult = discovery.loadExistingDescription(specimen.dir);
      expect(loadResult.ok).toBe(false);
      expect(loadResult.reason).toBe('schema_error');

      const canonical = buildCanonicalDescription(specimen.payload, {
        description: `Regenerated ${fixtureName}`,
        keywords: ['regenerated', fixtureName],
        lastUpdated: '2026-04-18T19:00:00.000Z',
        memorySequence: 13,
      });

      const repaired = mergePreserveRepair({
        partial: loadResult.partial!,
        canonicalOverrides: {
          specFolder: canonical.specFolder,
          description: canonical.description,
          keywords: canonical.keywords,
          lastUpdated: canonical.lastUpdated,
          specId: canonical.specId,
          folderSlug: canonical.folderSlug,
          parentChain: canonical.parentChain,
          memorySequence: canonical.memorySequence,
        },
      });

      expect(repaired.merged.description).toBe(`Regenerated ${fixtureName}`);
      expect(repaired.merged.keywords).toEqual(['regenerated', fixtureName]);
      expect(repaired.merged.memorySequence).toBe(13);
      if ('title' in specimen.payload) {
        expect(repaired.merged.title).toBe(specimen.payload.title);
      }
      if ('trigger_phrases' in specimen.payload) {
        expect(repaired.merged.trigger_phrases).toEqual(specimen.payload.trigger_phrases);
      }
      expect(repaired.preservedKeys.length).toBeGreaterThan(0);
    }
  });

  it('stays stable across two consecutive repair passes on the same specimen', async () => {
    const { discovery } = await loadModules();
    const specimen = createSpecFolderWithDescription(
      '017-002-cluster-consumers.description.json',
      (payload) => ({
        ...payload,
        memorySequence: 'broken',
      }),
    );
    cleanupTargets.push(specimen.dir);

    const firstCanonical = buildCanonicalDescription(specimen.payload, {
      description: 'First repaired summary',
      keywords: ['first-pass'],
      lastUpdated: '2026-04-18T20:00:00.000Z',
      memorySequence: 17,
    });
    discovery.savePerFolderDescription(firstCanonical, specimen.dir);
    const firstSaved = JSON.parse(fs.readFileSync(specimen.descriptionPath, 'utf-8')) as Record<string, unknown>;

    fs.writeFileSync(
      specimen.descriptionPath,
      JSON.stringify({
        ...firstSaved,
        memorySequence: 'broken-again',
      }, null, 2),
      'utf-8',
    );

    const secondCanonical = {
      ...firstCanonical,
      lastUpdated: '2026-04-18T20:05:00.000Z',
    };
    discovery.savePerFolderDescription(secondCanonical, specimen.dir);
    const secondSaved = JSON.parse(fs.readFileSync(specimen.descriptionPath, 'utf-8')) as Record<string, unknown>;

    expect(normalizeForComparison(secondSaved)).toEqual(normalizeForComparison({
      ...firstSaved,
      memorySequence: 17,
    }));
  });

  it('falls back to minimal replacement when the merge-safe repair flag is disabled', async () => {
    process.env.SPECKIT_DESCRIPTION_REPAIR_MERGE_SAFE = 'false';
    const { discovery } = await loadModules();
    const specimen = createSpecFolderWithDescription(
      '017-review-findings-remediation.description.json',
      (payload) => ({
        ...payload,
        memorySequence: 'broken',
      }),
    );
    cleanupTargets.push(specimen.dir);

    expect(discovery.getRepairMergeSafe()).toBe(false);

    const canonical = buildCanonicalDescription(specimen.payload, {
      description: 'Minimal replacement description',
      keywords: ['minimal', 'replacement'],
      lastUpdated: '2026-04-18T21:00:00.000Z',
      memorySequence: 19,
    });
    discovery.savePerFolderDescription(canonical, specimen.dir);

    const raw = JSON.parse(fs.readFileSync(specimen.descriptionPath, 'utf-8')) as Record<string, unknown>;
    expect(raw).toEqual({
      specFolder: canonical.specFolder,
      description: 'Minimal replacement description',
      keywords: ['minimal', 'replacement'],
      lastUpdated: '2026-04-18T21:00:00.000Z',
      specId: canonical.specId,
      folderSlug: canonical.folderSlug,
      parentChain: canonical.parentChain,
      memorySequence: 19,
      memoryNameHistory: [],
    });
  });
});
