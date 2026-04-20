import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  doesCombinedVariantDominate,
  runWarmStartVariantMatrix,
  WARM_START_BUNDLE_TOGGLE,
  WARM_START_VARIANTS,
  type WarmStartScenario,
} from '../../mcp_server/lib/eval/warm-start-variant-runner.js';
import { dirnameFromImportMeta } from '../lib/esm-entry.js';

const moduleDir = dirnameFromImportMeta(import.meta.url);

const ENV_REFERENCE_PATH = resolve(
  moduleDir,
  '../../mcp_server/ENV_REFERENCE.md',
);

const frozenCorpus: readonly WarmStartScenario[] = [
  {
    id: 'resume-structural-graph-ready',
    wrapper: {
      title: 'Warm-start validation bundle remains conditional',
      triggers: ['warm-start bundle', 'R8 gate'],
      evidenceBullets: [
        'R2 producer metadata exists for transcript identity and cache-token carry-forward.',
        'R3 only reuses cached continuity when freshness and scope still hold.',
        'R4 nudges structural follow-up toward code_graph_query when graph readiness is high.',
      ],
      continuationState: 'resume_ready',
      canonicalDocs: {
        decisionRecord: 'decision-record.md',
        implementationSummary: 'implementation-summary.md',
      },
    },
    producerMetadata: {
      freshness: 'fresh',
      scope: 'match',
      transcriptFingerprint: 'aa11bb22cc33dd44',
      cacheCreationInputTokens: 120,
      cacheReadInputTokens: 60,
    },
    followUp: {
      prompt: 'Compare the current structural follow-up path against the graph-ready routing advice.',
      kind: 'structural',
      graphReady: true,
      liveBaselineResolution: 'code_graph_query',
      liveBaselineAccuracy: 1,
      minimumAcceptableAccuracy: 1,
    },
  },
  {
    id: 'implementation-follow-up',
    wrapper: {
      title: 'Consumer stays additive and compact',
      triggers: ['cached consumer', 'compact continuity wrapper'],
      evidenceBullets: [
        'Canonical narrative ownership lives in packet docs, not memory bodies.',
        'The wrapper carries only bounded continuity cues and canonical pointers.',
      ],
      continuationState: 'implementation_ready',
      canonicalDocs: {
        decisionRecord: 'decision-record.md',
        implementationSummary: 'implementation-summary.md',
      },
    },
    producerMetadata: {
      freshness: 'fresh',
      scope: 'match',
      transcriptFingerprint: 'bb22cc33dd44ee55',
      cacheCreationInputTokens: 90,
      cacheReadInputTokens: 30,
    },
    followUp: {
      prompt: 'Continue the additive consumer implementation without reopening narrative ownership.',
      kind: 'implementation',
      graphReady: false,
      liveBaselineResolution: 'memory_context',
      liveBaselineAccuracy: 1,
      minimumAcceptableAccuracy: 1,
    },
  },
  {
    id: 'verification-follow-up',
    wrapper: {
      title: 'Benchmark packet records real matrix evidence',
      triggers: ['benchmark matrix', 'strict validation'],
      evidenceBullets: [
        'The benchmark compares baseline, component-only, and combined variants on the same corpus.',
        'The packet stays default-off until the combined path dominates honestly.',
      ],
      continuationState: 'verification_ready',
      canonicalDocs: {
        decisionRecord: 'decision-record.md',
        implementationSummary: 'implementation-summary.md',
      },
    },
    producerMetadata: {
      freshness: 'fresh',
      scope: 'match',
      transcriptFingerprint: 'cc33dd44ee55ff66',
      cacheCreationInputTokens: 80,
      cacheReadInputTokens: 25,
    },
    followUp: {
      prompt: 'Finish verification and update the packet closeout with the measured matrix.',
      kind: 'verification',
      graphReady: true,
      liveBaselineResolution: 'memory_context',
      liveBaselineAccuracy: 1,
      minimumAcceptableAccuracy: 1,
    },
  },
  {
    id: 'structural-scope-mismatch',
    wrapper: {
      title: 'Fail closed when cached continuity no longer matches scope',
      triggers: ['scope mismatch', 'fail closed'],
      evidenceBullets: [
        'Cached continuity must not cross packet scope boundaries.',
        'Structural guidance can still reduce follow-up cost when the graph is ready.',
      ],
      continuationState: 'resume_ready',
      canonicalDocs: {
        decisionRecord: 'decision-record.md',
        implementationSummary: 'implementation-summary.md',
      },
    },
    producerMetadata: {
      freshness: 'fresh',
      scope: 'mismatch',
      transcriptFingerprint: 'dd44ee55ff66aa77',
      cacheCreationInputTokens: 110,
      cacheReadInputTokens: 55,
    },
    followUp: {
      prompt: 'Investigate structural readiness after the cached continuity scope changed.',
      kind: 'structural',
      graphReady: true,
      liveBaselineResolution: 'memory_context_then_grep',
      liveBaselineAccuracy: 0.5,
      minimumAcceptableAccuracy: 0.5,
    },
  },
] as const;

function formatMatrix(
  matrix: ReturnType<typeof runWarmStartVariantMatrix>,
): string {
  return matrix
    .map((entry) =>
      `${entry.variant}: cost=${entry.totalCost} pass=${entry.totalPassCount}/${entry.totalRequiredFieldCount}`,
    )
    .join('\n');
}

describe('warm-start bundle conditional validation benchmark', () => {
  it('defines a frozen compact continuity wrapper corpus before comparing variants', () => {
    expect(frozenCorpus).toHaveLength(4);

    for (const scenario of frozenCorpus) {
      expect(scenario.wrapper.title.length).toBeGreaterThan(0);
      expect(scenario.wrapper.triggers.length).toBeGreaterThan(0);
      expect(scenario.wrapper.evidenceBullets.length).toBeGreaterThanOrEqual(2);
      expect(scenario.wrapper.evidenceBullets.length).toBeLessThanOrEqual(3);
      expect(scenario.wrapper.canonicalDocs.decisionRecord).toBe('decision-record.md');
      expect(scenario.wrapper.canonicalDocs.implementationSummary).toBe('implementation-summary.md');
    }
  });

  it('verifies the conditional warm-start bundle stays non-default in ENV_REFERENCE', () => {
    const envReference = readFileSync(ENV_REFERENCE_PATH, 'utf-8');
    expect(envReference).toContain('Conditional warm-start bundle (013)');
    expect(envReference).toContain(`\`${WARM_START_BUNDLE_TOGGLE}\``);
    expect(envReference).toContain('Default: `false`');
    expect(envReference).toContain('only enable after the frozen corpus benchmark shows combined configuration dominates baseline and component-only variants');
  });

  it('scores cost and pass rate with cache reuse, follow-up accuracy, and live-baseline parity', () => {
    const matrix = runWarmStartVariantMatrix(frozenCorpus);
    expect(matrix.map((entry) => entry.variant)).toEqual([...WARM_START_VARIANTS]);

    const totalsByVariant = new Map(matrix.map((entry) => [entry.variant, entry]));
    expect(totalsByVariant.get('baseline')?.totalCost).toBe(64);
    expect(totalsByVariant.get('R2_only')?.totalCost).toBe(80);
    expect(totalsByVariant.get('R3_only')?.totalCost).toBe(68);
    expect(totalsByVariant.get('R4_only')?.totalCost).toBe(54);
    expect(totalsByVariant.get('R2+R3+R4_combined')?.totalCost).toBe(43);

    expect(totalsByVariant.get('baseline')?.totalPassCount).toBe(34);
    expect(totalsByVariant.get('R2_only')?.totalPassCount).toBe(34);
    expect(totalsByVariant.get('R3_only')?.totalPassCount).toBe(34);
    expect(totalsByVariant.get('R4_only')?.totalPassCount).toBe(35);
    expect(totalsByVariant.get('R2+R3+R4_combined')?.totalPassCount).toBe(38);

    expect(totalsByVariant.get('baseline')?.totalRequiredFieldCount).toBe(40);
    expect(totalsByVariant.get('R2+R3+R4_combined')?.totalRequiredFieldCount).toBe(40);

    const rejectionScenarioPasses = Object.fromEntries(
      matrix.map((entry) => {
        const scenarioResult = entry.scenarioResults.find((scenario) => scenario.scenarioId === 'structural-scope-mismatch');
        return [entry.variant, scenarioResult?.passCount ?? null];
      }),
    );
    expect(rejectionScenarioPasses).toEqual({
      baseline: 9,
      R2_only: 9,
      R3_only: 9,
      R4_only: 8,
      'R2+R3+R4_combined': 8,
    });

    expect(doesCombinedVariantDominate(matrix), `Matrix did not dominate:\n${formatMatrix(matrix)}`).toBe(true);
  });
});
