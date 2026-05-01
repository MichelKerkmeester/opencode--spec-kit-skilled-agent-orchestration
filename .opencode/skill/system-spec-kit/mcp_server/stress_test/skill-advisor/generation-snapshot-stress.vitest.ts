import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import {
  getSkillGraphGenerationPath,
  publishSkillGraphGeneration,
  readSkillGraphGeneration,
} from '../../skill_advisor/lib/freshness/generation.js';
import {
  clearAdvisorGenerationMemory,
  readAdvisorGeneration,
} from '../../skill_advisor/lib/generation.js';

describe('sa-004 — Generation snapshot atomicity', () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = mkdtempSync(join(tmpdir(), 'sa-stress-004-'));
    clearAdvisorGenerationMemory();
  });

  afterEach(() => {
    clearAdvisorGenerationMemory();
    rmSync(tmpDir, { recursive: true, force: true });
  });

  it('publishes 100 sequential generation bumps with no gaps', async () => {
    const generations: number[] = [];
    for (let index = 0; index < 100; index += 1) {
      const result = publishSkillGraphGeneration({
        workspaceRoot: tmpDir,
        reason: `sequential-${index}`,
      });
      generations.push(result.metadata.generation);
    }

    expect(generations).toEqual(Array.from({ length: 100 }, (_, index) => index + 1));
    expect(readSkillGraphGeneration(tmpDir).generation).toBe(100);
  });

  it('keeps concurrent readers on complete generation snapshots during bumps', async () => {
    const observed = new Set<number>();
    for (let index = 0; index < 25; index += 1) {
      publishSkillGraphGeneration({ workspaceRoot: tmpDir, reason: `bump-${index}` });
      const reads = await Promise.all(Array.from({ length: 8 }, async () => readSkillGraphGeneration(tmpDir)));
      for (const read of reads) {
        observed.add(read.generation);
        expect(read.updatedAt).toBeTruthy();
        expect(read.reason).toBeTruthy();
      }
    }

    expect([...observed].every((generation) => Number.isSafeInteger(generation))).toBe(true);
    expect(Math.max(...observed)).toBe(25);
  });

  it('classifies corrupted counters per the catalog: recovered when writable, unavailable when not', async () => {
    publishSkillGraphGeneration({ workspaceRoot: tmpDir, reason: 'before-corruption' });
    writeFileSync(getSkillGraphGenerationPath(tmpDir), '{not-json', 'utf8');

    // Catalog 01--daemon-and-freshness/04-generation.md §2 — "Corrupted
    // counters are recovered when recoverable and reported as `unavailable`
    // freshness when not." Writable filesystem here, so we expect `recovered`.
    const recovered = readAdvisorGeneration(tmpDir);

    expect(recovered.status).toBe('recovered');
    expect(recovered.recoveryPath).toBe('regenerate');
    expect(recovered.generation).toBeGreaterThan(1);
    expect(recovered.reason).toBe('GENERATION_COUNTER_RECOVERED');
  });
});
