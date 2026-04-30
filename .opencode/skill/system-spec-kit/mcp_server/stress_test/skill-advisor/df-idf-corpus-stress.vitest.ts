import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { performance } from 'node:perf_hooks';

import {
  computeCorpusStats,
  createDebouncedCorpusUpdater,
  type CorpusDocument,
} from '../../skill_advisor/lib/corpus/df-idf.js';

describe('sa-013 — DF-IDF corpus stats', () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = mkdtempSync(join(tmpdir(), 'stress-sa-013-'));
  });

  afterEach(() => {
    rmSync(tmpDir, { recursive: true, force: true });
  });

  function makeDocument(index: number, termCount: number): CorpusDocument {
    return {
      skillId: `skill-${index}`,
      sourcePath: join(tmpDir, `.opencode/skill/skill-${index}/SKILL.md`),
      terms: Array.from({ length: termCount }, (_, termIndex) => `skill-${index}-term-${termIndex}`),
    };
  }

  it('computes positive finite IDF values for 1000 synthetic active skills under 2s', async () => {
    const documents = Array.from({ length: 1_000 }, (_, index) =>
      makeDocument(index, 5 + (index % 16)),
    );

    const startedAt = performance.now();
    const stats = computeCorpusStats(documents);
    const elapsedMs = performance.now() - startedAt;

    expect(elapsedMs).toBeLessThan(2_000);
    expect(stats.documentCount).toBe(1_000);
    expect(stats.terms.length).toBeGreaterThan(5_000);
    expect(stats.terms.every((term) => Number.isFinite(term.idf) && term.idf > 0)).toBe(true);
  });

  it('excludes z_archive skills from active-only corpus statistics', async () => {
    const stats = computeCorpusStats([
      {
        skillId: 'active-skill',
        sourcePath: join(tmpDir, '.opencode/skill/active-skill/SKILL.md'),
        terms: ['active-only-term', 'shared-term'],
      },
      {
        skillId: 'archived-skill',
        sourcePath: join(tmpDir, '.opencode/skill/z_archive/archived-skill/SKILL.md'),
        terms: ['archived-only-term', 'shared-term'],
      },
    ]);

    const terms = stats.terms.map((term) => term.term);

    expect(stats.documentCount).toBe(1);
    expect(terms).toContain('active-only-term');
    expect(terms).toContain('shared-term');
    expect(terms).not.toContain('archived-only-term');
  });

  it('coalesces 50 rapid recompute schedules into one debounced compute', async () => {
    const callbackStats: number[] = [];
    const updater = createDebouncedCorpusUpdater((stats) => {
      callbackStats.push(stats.documentCount);
    }, 40);

    for (let index = 0; index < 50; index += 1) {
      updater.schedule([makeDocument(index, 5)]);
    }

    await new Promise((resolve) => {
      setTimeout(resolve, 80);
    });

    expect(callbackStats).toEqual([1]);
    expect(updater.flush()?.documentCount).toBe(1);
  });
});
