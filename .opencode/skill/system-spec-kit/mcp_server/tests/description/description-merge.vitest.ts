import { describe, expect, it } from 'vitest';

import { mergeDescription } from '../../lib/description/description-merge';
import { mergePreserveRepair } from '../../lib/description/repair';

const canonical = {
  specFolder: 'system-spec-kit/026-graph-and-context-optimization/019-system-hardening/005-description-regen-contract',
  specId: '005',
  folderSlug: 'description-regen-contract',
  parentChain: [
    '026-graph-and-context-optimization',
    '019-system-hardening',
  ],
  lastUpdated: '2026-04-18T23:59:00.000Z',
  description: 'Canonical regenerated description',
  keywords: ['canonical', 'regenerated'],
} as const;

const trackingIncoming = {
  memorySequence: 9,
  memoryNameHistory: ['ctx-001.md', 'ctx-002.md'],
};

describe('description merge contract — schema-valid lane', () => {
  it('regenerates canonical_derived fields from canonical input', () => {
    const result = mergeDescription(
      {
        specFolder: 'stale/path',
        specId: '099',
        folderSlug: 'stale-slug',
        parentChain: ['stale-parent'],
        lastUpdated: '2020-01-01T00:00:00.000Z',
      },
      canonical,
      trackingIncoming,
    );

    expect(result.merged.specFolder).toBe(canonical.specFolder);
    expect(result.merged.specId).toBe(canonical.specId);
    expect(result.merged.folderSlug).toBe(canonical.folderSlug);
    expect(result.merged.parentChain).toEqual(canonical.parentChain);
    expect(result.merged.lastUpdated).toBe(canonical.lastUpdated);
  });

  it('regenerates canonical_authored fields from canonical input', () => {
    const result = mergeDescription(
      {
        description: 'Stale description',
        keywords: ['stale'],
      },
      canonical,
      trackingIncoming,
    );

    expect(result.merged.description).toBe(canonical.description);
    expect(result.merged.keywords).toEqual(canonical.keywords);
  });

  it('preserves tracking from incoming system-owned values', () => {
    const result = mergeDescription(
      {
        memorySequence: 2,
        memoryNameHistory: ['older.md'],
      },
      canonical,
      trackingIncoming,
    );

    expect(result.merged.memorySequence).toBe(9);
    expect(result.merged.memoryNameHistory).toEqual(['ctx-001.md', 'ctx-002.md']);
  });

  it('preserves known authored optional fields from existing data', () => {
    const result = mergeDescription(
      {
        title: 'Authored title',
        type: 'phase',
        trigger_phrases: ['regen', 'merge'],
        path: '.opencode/specs/example',
      },
      canonical,
      trackingIncoming,
    );

    expect(result.merged.title).toBe('Authored title');
    expect(result.merged.type).toBe('phase');
    expect(result.merged.trigger_phrases).toEqual(['regen', 'merge']);
    expect(result.merged.path).toBe('.opencode/specs/example');
  });

  it('preserves unknown passthrough keys from existing data', () => {
    const result = mergeDescription(
      {
        custom_note: 'keep-me',
        custom_payload: { mode: 'passthrough' },
      },
      canonical,
      trackingIncoming,
    );

    expect(result.merged.custom_note).toBe('keep-me');
    expect(result.merged.custom_payload).toEqual({ mode: 'passthrough' });
  });
});

describe('description merge contract — schema-invalid parseable lane', () => {
  it('regenerates canonical_derived fields during repair', () => {
    const result = mergePreserveRepair({
      partial: {
        specFolder: 'stale/path',
        specId: '099',
        folderSlug: 'stale-slug',
        parentChain: ['stale-parent'],
        lastUpdated: '2020-01-01T00:00:00.000Z',
      },
      canonicalOverrides: {
        ...canonical,
        ...trackingIncoming,
      },
    });

    expect(result.merged.specFolder).toBe(canonical.specFolder);
    expect(result.merged.specId).toBe(canonical.specId);
    expect(result.merged.folderSlug).toBe(canonical.folderSlug);
    expect(result.merged.parentChain).toEqual(canonical.parentChain);
    expect(result.merged.lastUpdated).toBe(canonical.lastUpdated);
  });

  it('regenerates canonical_authored fields during repair', () => {
    const result = mergePreserveRepair({
      partial: {
        description: 'Stale description',
        keywords: ['stale'],
      },
      canonicalOverrides: {
        ...canonical,
        ...trackingIncoming,
      },
    });

    expect(result.merged.description).toBe(canonical.description);
    expect(result.merged.keywords).toEqual(canonical.keywords);
  });

  it('preserves tracking from incoming system-owned values during repair', () => {
    const result = mergePreserveRepair({
      partial: {
        memorySequence: 'broken',
        memoryNameHistory: ['older.md'],
      },
      canonicalOverrides: {
        ...canonical,
        ...trackingIncoming,
      },
    });

    expect(result.merged.memorySequence).toBe(9);
    expect(result.merged.memoryNameHistory).toEqual(['ctx-001.md', 'ctx-002.md']);
  });

  it('preserves known authored optional fields during repair', () => {
    const result = mergePreserveRepair({
      partial: {
        title: 'Authored title',
        type: 'phase',
        trigger_phrases: ['regen', 'merge'],
        path: '.opencode/specs/example',
        memorySequence: 'broken',
      },
      canonicalOverrides: {
        ...canonical,
        ...trackingIncoming,
      },
    });

    expect(result.merged.title).toBe('Authored title');
    expect(result.merged.type).toBe('phase');
    expect(result.merged.trigger_phrases).toEqual(['regen', 'merge']);
    expect(result.merged.path).toBe('.opencode/specs/example');
  });

  it('preserves unknown passthrough keys during repair', () => {
    const result = mergePreserveRepair({
      partial: {
        custom_note: 'keep-me',
        custom_payload: { mode: 'passthrough' },
        memorySequence: 'broken',
      },
      canonicalOverrides: {
        ...canonical,
        ...trackingIncoming,
      },
    });

    expect(result.merged.custom_note).toBe('keep-me');
    expect(result.merged.custom_payload).toEqual({ mode: 'passthrough' });
  });
});
