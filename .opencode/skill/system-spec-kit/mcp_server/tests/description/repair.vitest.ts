import { describe, expect, it } from 'vitest';

import { mergePreserveRepair } from '../../lib/description/repair';

describe('mergePreserveRepair', () => {
  it('merges canonical overrides while preserving authored keys', () => {
    const result = mergePreserveRepair({
      partial: {
        title: 'Authored title',
        contextType: 'implementation',
      },
      canonicalOverrides: {
        specFolder: 'system-spec-kit/026/example',
        description: 'Canonical description',
        lastUpdated: '2026-04-18T12:00:00.000Z',
      },
    });

    expect(result.merged).toEqual({
      title: 'Authored title',
      contextType: 'implementation',
      specFolder: 'system-spec-kit/026/example',
      description: 'Canonical description',
      lastUpdated: '2026-04-18T12:00:00.000Z',
    });
    expect(result.overriddenKeys).toEqual([
      'specFolder',
      'description',
      'lastUpdated',
    ]);
    expect(result.preservedKeys).toEqual(['title', 'contextType']);
  });

  it('lets canonical values win on conflict', () => {
    const result = mergePreserveRepair({
      partial: {
        lastUpdated: 'old',
        description: 'stale',
      },
      canonicalOverrides: {
        lastUpdated: 'new',
        description: 'fresh',
      },
    });

    expect(result.merged.lastUpdated).toBe('new');
    expect(result.merged.description).toBe('fresh');
    expect(result.overriddenKeys).toEqual(['lastUpdated', 'description']);
  });

  it('replaces field values rather than deep-merging them', () => {
    const result = mergePreserveRepair({
      partial: {
        keywords: ['x', 'y'],
        childPhasePosition: {
          wave: 'A',
          position: 1,
        },
      },
      canonicalOverrides: {
        keywords: ['a'],
      },
    });

    expect(result.merged.keywords).toEqual(['a']);
    expect(result.merged.childPhasePosition).toEqual({
      wave: 'A',
      position: 1,
    });
  });

  it('handles an empty partial object as canonical-only output', () => {
    const result = mergePreserveRepair({
      partial: {},
      canonicalOverrides: {
        specFolder: 'system-spec-kit/026/example',
        description: 'Canonical description',
      },
    });

    expect(result.merged).toEqual({
      specFolder: 'system-spec-kit/026/example',
      description: 'Canonical description',
    });
    expect(result.preservedKeys).toEqual([]);
  });

  it('reports preservedKeys accurately', () => {
    const result = mergePreserveRepair({
      partial: {
        title: 'keep',
        trigger_phrases: ['alpha'],
        level: 2,
      },
      canonicalOverrides: {
        description: 'Canonical',
      },
    });

    expect(result.preservedKeys).toEqual([
      'title',
      'trigger_phrases',
      'level',
    ]);
  });

  it('reports overriddenKeys accurately', () => {
    const result = mergePreserveRepair({
      partial: {
        specFolder: 'old',
        description: 'old',
      },
      canonicalOverrides: {
        specFolder: 'new',
        description: 'new',
        memorySequence: 4,
      },
    });

    expect(result.overriddenKeys).toEqual([
      'specFolder',
      'description',
      'memorySequence',
    ]);
  });
});
