// ───────────────────────────────────────────────────────────────
// TEST: Skill Advisor Freshness
// ───────────────────────────────────────────────────────────────

import {
  mkdirSync,
  readFileSync,
  rmSync,
  utimesSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { performance } from 'node:perf_hooks';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  getAdvisorFreshness,
} from '../lib/skill-advisor/freshness.js';
import {
  clearAdvisorGenerationMemory,
  getAdvisorGenerationPath,
  incrementAdvisorGeneration,
} from '../lib/skill-advisor/generation.js';
import { clearAdvisorSourceCache } from '../lib/skill-advisor/source-cache.js';

function writeFile(filePath: string, content: string, mtimeMs: number): void {
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, content, 'utf8');
  const mtime = new Date(mtimeMs);
  utimesSync(filePath, mtime, mtime);
}

function writeSkill(workspaceRoot: string, slug: string, mtimeMs: number): void {
  const skillDirectory = join(workspaceRoot, '.opencode', 'skill', slug);
  writeFile(join(skillDirectory, 'SKILL.md'), `# ${slug}\n`, mtimeMs);
  writeFile(join(skillDirectory, 'graph-metadata.json'), `{"skill_id":"${slug}"}\n`, mtimeMs);
}

function writeAdvisorSources(workspaceRoot: string, mtimeMs: number): void {
  const scriptDirectory = join(workspaceRoot, '.opencode', 'skill', 'skill-advisor', 'scripts');
  writeFile(join(scriptDirectory, 'skill_advisor.py'), '# advisor\n', mtimeMs);
  writeFile(join(scriptDirectory, 'skill_advisor_runtime.py'), '# runtime\n', mtimeMs);
  writeFile(join(scriptDirectory, 'skill_graph_compiler.py'), '# compiler\n', mtimeMs);
}

function writeSqliteArtifact(workspaceRoot: string, mtimeMs: number): void {
  writeFile(
    join(workspaceRoot, '.opencode', 'skill', 'system-spec-kit', 'mcp_server', 'database', 'skill-graph.sqlite'),
    'sqlite',
    mtimeMs,
  );
}

function writeJsonFallback(workspaceRoot: string, mtimeMs: number): void {
  writeFile(
    join(workspaceRoot, '.opencode', 'skill', 'skill-advisor', 'scripts', 'skill-graph.json'),
    '{}\n',
    mtimeMs,
  );
}

function createWorkspace(): string {
  return join(tmpdir(), `advisor-freshness-${process.pid}-${Date.now()}-${Math.random().toString(16).slice(2)}`);
}

function createLiveWorkspace(): string {
  const workspaceRoot = createWorkspace();
  writeSkill(workspaceRoot, 'alpha', 1_000);
  writeAdvisorSources(workspaceRoot, 1_000);
  writeSqliteArtifact(workspaceRoot, 2_000);
  return workspaceRoot;
}

function percentile(samples: number[], percentileRank: number): number {
  const sorted = [...samples].sort((left, right) => left - right);
  const index = Math.min(
    sorted.length - 1,
    Math.ceil((percentileRank / 100) * sorted.length) - 1,
  );
  return Number(sorted[index].toFixed(3));
}

let workspaces: string[] = [];

beforeEach(() => {
  clearAdvisorSourceCache();
  clearAdvisorGenerationMemory();
  workspaces = [];
});

afterEach(() => {
  for (const workspace of workspaces) {
    rmSync(workspace, { recursive: true, force: true });
  }
});

describe('getAdvisorFreshness', () => {
  it('AS1 returns live state when all sources are present and fresh', () => {
    const workspaceRoot = createLiveWorkspace();
    workspaces.push(workspaceRoot);

    const result = getAdvisorFreshness(workspaceRoot);

    expect(result.state).toBe('live');
    expect(result.fallbackMode).toBe('sqlite');
    expect(result.generation).toBe(0);
    expect(result.diagnostics).toBeNull();
    expect(result.skillFingerprints.get('alpha')).toMatchObject({
      skillMdSize: '# alpha\n'.length,
      graphMetaMtime: expect.any(Number),
    });
  });

  it('AS2 returns stale when SKILL.md is newer than skill-graph.sqlite', () => {
    const workspaceRoot = createLiveWorkspace();
    workspaces.push(workspaceRoot);
    writeSkill(workspaceRoot, 'alpha', 3_000);

    const result = getAdvisorFreshness(workspaceRoot);

    expect(result.state).toBe('stale');
    expect(result.fallbackMode).toBe('sqlite');
    expect(result.diagnostics?.reason).toBe('SOURCE_NEWER_THAN_SKILL_GRAPH');
  });

  it('AS3 returns absent when skill-graph.sqlite is missing and no JSON fallback exists', () => {
    const workspaceRoot = createWorkspace();
    workspaces.push(workspaceRoot);
    writeSkill(workspaceRoot, 'alpha', 1_000);
    writeAdvisorSources(workspaceRoot, 1_000);

    const result = getAdvisorFreshness(workspaceRoot);

    expect(result.state).toBe('absent');
    expect(result.fallbackMode).toBe('none');
    expect(result.diagnostics?.reason).toBe('SKILL_GRAPH_SQLITE_MISSING');
  });

  it('AS4 returns unavailable when the source probe fails', () => {
    const workspaceRoot = createWorkspace();
    workspaces.push(workspaceRoot);
    mkdirSync(join(workspaceRoot, '.opencode'), { recursive: true });
    writeFileSync(join(workspaceRoot, '.opencode', 'skill'), 'not a directory', 'utf8');

    const result = getAdvisorFreshness(workspaceRoot);

    expect(result.state).toBe('unavailable');
    expect(result.diagnostics?.reason).toBe('ADVISOR_FRESHNESS_PROBE_FAILED');
    expect(result.diagnostics?.errorClass).toBe('unknown');
    expect(result.diagnostics?.errorMessage).toContain('directory');
  });

  it('AS5 suppresses deleted skills instead of reusing stale fingerprints', () => {
    const workspaceRoot = createLiveWorkspace();
    workspaces.push(workspaceRoot);
    writeSkill(workspaceRoot, 'beta', 1_000);

    const first = getAdvisorFreshness(workspaceRoot);
    expect(first.skillFingerprints.has('beta')).toBe(true);

    rmSync(join(workspaceRoot, '.opencode', 'skill', 'beta'), { recursive: true, force: true });
    const second = getAdvisorFreshness(workspaceRoot);

    expect(second.skillFingerprints.has('alpha')).toBe(true);
    expect(second.skillFingerprints.has('beta')).toBe(false);
  });

  it('AS6 treats JSON fallback as stale and never live', () => {
    const workspaceRoot = createWorkspace();
    workspaces.push(workspaceRoot);
    writeSkill(workspaceRoot, 'alpha', 1_000);
    writeAdvisorSources(workspaceRoot, 1_000);
    writeJsonFallback(workspaceRoot, 2_000);

    const result = getAdvisorFreshness(workspaceRoot);

    expect(result.state).toBe('stale');
    expect(result.fallbackMode).toBe('json');
    expect(result.diagnostics?.reason).toBe('JSON_FALLBACK_ONLY');
  });

  it('AS7 advances generation after a rebuild signal', () => {
    const workspaceRoot = createLiveWorkspace();
    workspaces.push(workspaceRoot);

    const first = getAdvisorFreshness(workspaceRoot);
    const increment = incrementAdvisorGeneration(workspaceRoot);
    const second = getAdvisorFreshness(workspaceRoot);

    expect(first.generation).toBe(0);
    expect(increment.generation).toBe(1);
    expect(second.generation).toBe(1);
    expect(second.state).toBe('live');
  });

  it('AS8 returns a cache hit within the 15-minute TTL and invalidates on signature change', () => {
    const workspaceRoot = createLiveWorkspace();
    workspaces.push(workspaceRoot);

    const first = getAdvisorFreshness(workspaceRoot);
    const second = getAdvisorFreshness(workspaceRoot);

    expect(second.probedAt).toBe(first.probedAt);

    writeSkill(workspaceRoot, 'alpha', 3_000);
    const third = getAdvisorFreshness(workspaceRoot);

    expect(third).not.toBe(first);
    expect(third.sourceSignature).not.toBe(first.sourceSignature);
    expect(third.state).toBe('stale');
  });

  it('AS9 recovers malformed generation.json on writable filesystems without returning live', () => {
    const workspaceRoot = createLiveWorkspace();
    workspaces.push(workspaceRoot);
    const generationPath = getAdvisorGenerationPath(workspaceRoot);
    mkdirSync(dirname(generationPath), { recursive: true });
    writeFileSync(generationPath, '{malformed', 'utf8');

    const result = getAdvisorFreshness(workspaceRoot);
    const recoveredPayload = JSON.parse(readFileSync(generationPath, 'utf8')) as { generation: number };

    expect(result.state).not.toBe('live');
    expect(result.diagnostics?.reason).toBe('GENERATION_COUNTER_RECOVERED');
    expect(result.diagnostics?.recoveryPath).toBe('regenerate');
    expect(Number.isSafeInteger(recoveredPayload.generation)).toBe(true);
  });

  it('AS10 fails closed when malformed generation.json cannot be regenerated', () => {
    const workspaceRoot = createLiveWorkspace();
    workspaces.push(workspaceRoot);
    const generationPath = getAdvisorGenerationPath(workspaceRoot);
    mkdirSync(generationPath, { recursive: true });

    const result = getAdvisorFreshness(workspaceRoot);

    expect(result.state).toBe('unavailable');
    expect(result.diagnostics?.reason).toBe('GENERATION_COUNTER_CORRUPT');
    expect(result.diagnostics?.recoveryPath).toBe('unrecoverable');
    expect(result.diagnostics?.errorClass).toBe('parse');
    expect(result.diagnostics?.errorMessage).toContain('directory');
  });

  it('bench records cold and warm probe p50/p95/p99 over 30 samples', () => {
    const workspaceRoot = createLiveWorkspace();
    workspaces.push(workspaceRoot);
    const coldSamples: number[] = [];
    const warmSamples: number[] = [];

    for (let index = 0; index < 30; index += 1) {
      clearAdvisorSourceCache();
      const coldStart = performance.now();
      getAdvisorFreshness(workspaceRoot);
      coldSamples.push(performance.now() - coldStart);

      const warmStart = performance.now();
      getAdvisorFreshness(workspaceRoot);
      warmSamples.push(performance.now() - warmStart);
    }

    const metrics = {
      cold: {
        p50: percentile(coldSamples, 50),
        p95: percentile(coldSamples, 95),
        p99: percentile(coldSamples, 99),
      },
      warm: {
        p50: percentile(warmSamples, 50),
        p95: percentile(warmSamples, 95),
        p99: percentile(warmSamples, 99),
      },
    };
    console.info(`advisor-freshness-bench ${JSON.stringify(metrics)}`);
    expect(metrics.cold.p95).toBeLessThanOrEqual(80);
    expect(metrics.warm.p95).toBeLessThanOrEqual(5);
  });
});
