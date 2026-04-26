// ───────────────────────────────────────────────────────────────
// MODULE: Code Graph Parse Latency Bench (PR 8 — F36 #4 / F73-#2)
// ───────────────────────────────────────────────────────────────
// Wraps parseFile per language, exercising the spec_kit.graph.parse_duration_ms
// histogram emitted from tree-sitter-parser.ts (PR 5 anchor). Asserts
// non-zero sample counts per language and logs P50/P95/P99 informationally.

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { parseFile } from '../../code_graph/lib/structural-indexer.js';
import { speckitMetrics } from '../lib/metrics.js';
import { findAdvisorWorkspaceRoot } from '../lib/utils/workspace-root.js';
import type { SupportedLanguage } from '../../code_graph/lib/indexer-types.js';

const SAMPLE_COUNT = 20;

function workspaceRoot(): string {
  const start = dirname(fileURLToPath(import.meta.url));
  const sentinel = '.opencode/skill/system-spec-kit/SKILL.md';
  const candidate = findAdvisorWorkspaceRoot(start, { maxDepth: 12, sentinel });
  return existsSync(resolve(candidate, sentinel))
    ? candidate
    : resolve(start, '..', '..', '..', '..', '..', '..');
}

interface Fixture { readonly language: SupportedLanguage; readonly path: string; }

function buildFixtures(root: string): readonly Fixture[] {
  const f = (rel: string, language: SupportedLanguage): Fixture => ({ language, path: resolve(root, rel) });
  return [
    f('.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/runtime-detection.ts', 'typescript'),
    f('.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/budget-allocator.ts', 'typescript'),
    f('.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts', 'typescript'),
    f('.opencode/plugins/spec-kit-skill-advisor.js', 'javascript'),
    f('.opencode/plugins/spec-kit-compact-code-graph.js', 'javascript'),
    f('.opencode/skill/system-spec-kit/scripts/setup/record-node-version.js', 'javascript'),
    f('.opencode/skill/system-spec-kit/scripts/.scan-validate-all.py', 'python'),
    f('.opencode/skill/system-spec-kit/scripts/.enumerate-no-frontmatter.py', 'python'),
    f('.opencode/skill/sk-doc/scripts/quick_validate.py', 'python'),
    f('.opencode/skill/system-spec-kit/scripts/check-links.sh', 'bash'),
    f('.opencode/skill/system-spec-kit/scripts/setup/check-prerequisites.sh', 'bash'),
    f('.opencode/skill/system-spec-kit/scripts/spec/validate.sh', 'bash'),
  ];
}

function percentile(values: readonly number[], pct: number): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const idx = Math.min(sorted.length - 1, Math.ceil(sorted.length * pct) - 1);
  return Number((sorted[Math.max(0, idx)] ?? 0).toFixed(3));
}

describe('code-graph parse-latency bench', () => {
  const root = workspaceRoot();
  const fixtures = buildFixtures(root);
  // Bench metrics are opt-in for this suite and restored so later tests inherit
  // their original SPECKIT_METRICS_ENABLED state.
  let previousMetricsEnabled: string | undefined;

  beforeAll(() => {
    previousMetricsEnabled = process.env.SPECKIT_METRICS_ENABLED;
    process.env.SPECKIT_METRICS_ENABLED = 'true';
    speckitMetrics.reset();
  });

  afterAll(() => {
    if (previousMetricsEnabled === undefined) {
      delete process.env.SPECKIT_METRICS_ENABLED;
    } else {
      process.env.SPECKIT_METRICS_ENABLED = previousMetricsEnabled;
    }
    speckitMetrics.reset();
  });

  it('emits non-zero samples per language and logs P50/P95/P99', async () => {
    for (const fixture of fixtures) {
      expect(existsSync(fixture.path), `fixture missing: ${fixture.path}`).toBe(true);
    }

    for (const fixture of fixtures) {
      const content = readFileSync(fixture.path, 'utf8');
      for (let i = 0; i < SAMPLE_COUNT; i += 1) {
        await parseFile(fixture.path, content, fixture.language);
      }
    }

    const snapshot = speckitMetrics.snapshot();
    const samplesByLanguage = new Map<SupportedLanguage, number[]>();
    for (const [key, values] of snapshot.histograms) {
      if (!key.startsWith('spec_kit.graph.parse_duration_ms{')) continue;
      const langMatch = key.match(/language=([a-z]+)/);
      if (!langMatch) continue;
      const lang = langMatch[1] as SupportedLanguage;
      const arr = samplesByLanguage.get(lang) ?? [];
      arr.push(...values);
      samplesByLanguage.set(lang, arr);
    }

    const languages: readonly SupportedLanguage[] = ['typescript', 'javascript', 'python', 'bash'];
    const fixturesPerLanguage = 3;
    const expectedMin = SAMPLE_COUNT * fixturesPerLanguage;
    for (const lang of languages) {
      const samples = samplesByLanguage.get(lang) ?? [];
      const p50 = percentile(samples, 0.50);
      const p95 = percentile(samples, 0.95);
      const p99 = percentile(samples, 0.99);
      console.log(`code-graph-parse-latency ${lang} count=${samples.length} p50=${p50}ms p95=${p95}ms p99=${p99}ms`);
      expect(samples.length, `language ${lang} should have >= ${expectedMin} samples`).toBeGreaterThanOrEqual(expectedMin);
    }

    const hasParseDurationSeries = [...snapshot.histograms.keys()].some((k) =>
      k.startsWith('spec_kit.graph.parse_duration_ms{'),
    );
    expect(hasParseDurationSeries, 'spec_kit.graph.parse_duration_ms histogram missing from collector snapshot').toBe(true);
  }, 60_000);
});
