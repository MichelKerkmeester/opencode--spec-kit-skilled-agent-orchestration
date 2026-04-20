import { mkdtempSync, rmSync, writeFileSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { performance } from 'node:perf_hooks';
import { createSkillGraphWatcher } from '../lib/daemon/watcher.js';

interface BenchmarkResult {
  benchmark: 'skill-graph-watcher-idle';
  durationMs: number;
  skills: number;
  watchedPaths: number;
  cpuPercent: number;
  rssDeltaMb: number;
  rssTotalMb: number;
  gate: {
    cpuPercentMax: number;
    rssDeltaMbMax: number;
    passed: boolean;
  };
}

const DEFAULT_DURATION_MS = 60_000;
const DEFAULT_SKILL_COUNT = 50;
const CPU_GATE_PERCENT = 1;
const RSS_DELTA_GATE_MB = 20;

function envInt(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) return fallback;
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function writeSkill(root: string, index: number): void {
  const slug = `bench-skill-${String(index).padStart(3, '0')}`;
  const skillDir = join(root, '.opencode', 'skill', slug);
  mkdirSync(skillDir, { recursive: true });
  writeFileSync(
    join(skillDir, 'SKILL.md'),
    [
      '---',
      `name: ${slug}`,
      'description: Benchmark skill',
      'allowed-tools: []',
      '---',
      `# ${slug}`,
      '',
    ].join('\n'),
    'utf8',
  );
  writeFileSync(
    join(skillDir, 'graph-metadata.json'),
    JSON.stringify({
      schema_version: 1,
      skill_id: slug,
      family: 'system',
      category: 'benchmark',
      domains: ['benchmark'],
      intent_signals: ['benchmark'],
      edges: {},
    }, null, 2),
    'utf8',
  );
}

async function runBenchmark(): Promise<BenchmarkResult> {
  const durationMs = envInt('SKILL_GRAPH_WATCHER_BENCH_DURATION_MS', DEFAULT_DURATION_MS);
  const skills = envInt('SKILL_GRAPH_WATCHER_BENCH_SKILLS', DEFAULT_SKILL_COUNT);
  const workspaceRoot = mkdtempSync(join(tmpdir(), 'skill-graph-watcher-bench-'));
  for (let index = 0; index < skills; index += 1) {
    writeSkill(workspaceRoot, index);
  }

  const beforeMemory = process.memoryUsage().rss;
  const beforeCpu = process.cpuUsage();
  const beforeWall = performance.now();
  const watcher = createSkillGraphWatcher({
    workspaceRoot,
    reindexSkill: async () => ({ indexedFiles: 0, skippedFiles: 0 }),
  });

  await sleep(durationMs);

  const afterCpu = process.cpuUsage(beforeCpu);
  const elapsedMs = performance.now() - beforeWall;
  const afterMemory = process.memoryUsage().rss;
  const status = watcher.status();
  await watcher.close();
  rmSync(workspaceRoot, { recursive: true, force: true });

  const cpuMs = (afterCpu.user + afterCpu.system) / 1000;
  const cpuPercent = Number(((cpuMs / elapsedMs) * 100).toFixed(3));
  const rssDeltaMb = Number(((afterMemory - beforeMemory) / (1024 * 1024)).toFixed(3));
  const rssTotalMb = Number((afterMemory / (1024 * 1024)).toFixed(3));
  const passed = cpuPercent <= CPU_GATE_PERCENT && rssDeltaMb < RSS_DELTA_GATE_MB;

  return {
    benchmark: 'skill-graph-watcher-idle',
    durationMs,
    skills,
    watchedPaths: status.watchedPaths,
    cpuPercent,
    rssDeltaMb,
    rssTotalMb,
    gate: {
      cpuPercentMax: CPU_GATE_PERCENT,
      rssDeltaMbMax: RSS_DELTA_GATE_MB,
      passed,
    },
  };
}

const result = await runBenchmark();
process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
if (!result.gate.passed) {
  process.exitCode = 1;
}
