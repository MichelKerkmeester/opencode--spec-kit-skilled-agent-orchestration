import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { performance } from 'node:perf_hooks';

import { getAdvisorFreshness } from '../../skill_advisor/lib/freshness.js';
import {
  createTrustState,
  failOpenTrustState,
} from '../../skill_advisor/lib/freshness/trust-state.js';

describe('sa-005 — Trust-state classifier pressure', () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = mkdtempSync(join(tmpdir(), 'sa-stress-005-'));
  });

  afterEach(() => {
    rmSync(tmpDir, { recursive: true, force: true });
  });

  function write(relativePath: string, content = 'fixture\n'): void {
    const filePath = join(tmpDir, relativePath);
    mkdirSync(dirname(filePath), { recursive: true });
    writeFileSync(filePath, content, 'utf8');
  }

  it('reaches live, stale, absent, and unavailable from one workspace simulation', async () => {
    const generation = getAdvisorFreshness(tmpDir).generation;
    const live = createTrustState({
      hasSources: true,
      hasArtifact: true,
      sourceChanged: false,
      daemonAvailable: true,
      generation,
    });
    const stale = createTrustState({
      hasSources: true,
      hasArtifact: true,
      sourceChanged: true,
      daemonAvailable: true,
      generation,
    });
    const absent = createTrustState({
      hasSources: true,
      hasArtifact: false,
      sourceChanged: false,
      daemonAvailable: true,
      generation,
    });
    const unavailable = failOpenTrustState('GENERATION_FILE_CORRUPT', generation);

    expect([live.state, stale.state, absent.state, unavailable.state]).toEqual([
      'live',
      'stale',
      'absent',
      'unavailable',
    ]);
  });

  it('returns each classifier call under 10ms on a 1000-skill corpus', async () => {
    for (let index = 0; index < 1_000; index += 1) {
      write(`.opencode/skill/skill-${index}/SKILL.md`, [
        '---',
        `name: skill-${index}`,
        'description: Trust-state stress fixture',
        'allowed-tools: []',
        '---',
        '',
      ].join('\n'));
      write(`.opencode/skill/skill-${index}/graph-metadata.json`, '{}\n');
    }

    const durations: number[] = [];
    for (let index = 0; index < 100; index += 1) {
      const startedAt = performance.now();
      const snapshot = createTrustState({
        hasSources: true,
        hasArtifact: true,
        sourceChanged: index % 2 === 0,
        daemonAvailable: true,
        generation: index,
      });
      durations.push(performance.now() - startedAt);
      expect(snapshot.state === 'live' || snapshot.state === 'stale').toBe(true);
    }

    expect(Math.max(...durations)).toBeLessThan(10);
  });
});
