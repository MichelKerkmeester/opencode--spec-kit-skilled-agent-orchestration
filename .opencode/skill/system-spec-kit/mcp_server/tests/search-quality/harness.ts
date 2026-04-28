// ───────────────────────────────────────────────────────────────
// MODULE: Search Quality Harness
// ───────────────────────────────────────────────────────────────
// Runs corpus cases through injectable channel runners and captures outcome
// telemetry. The harness is intentionally database-agnostic.

import { performance } from 'node:perf_hooks';

import {
  type SearchQualityCase,
  type SearchQualityChannel,
  type SearchQualityCorpus,
} from './corpus.js';
import {
  precisionAtK,
  recallAtK,
} from './metrics.js';

interface SearchQualityCandidate {
  id: string;
  channel: SearchQualityChannel;
  title: string;
  rank: number;
  score?: number;
  citationIds?: string[];
  metadata?: Record<string, unknown>;
}

interface SearchQualityChannelOutput {
  candidates: SearchQualityCandidate[];
  refused?: boolean;
  citationIds?: string[];
  finalAnswer?: string;
  latencyMs?: number;
}

interface SearchQualityChannelCapture {
  channel: SearchQualityChannel;
  candidates: SearchQualityCandidate[];
  refused: boolean;
  citationIds: string[];
  latencyMs: number;
  error?: string;
}

interface SearchQualityCaseResult {
  caseId: string;
  query: string;
  perChannelCandidates: Record<SearchQualityChannel, SearchQualityCandidate[]>;
  channelCaptures: SearchQualityChannelCapture[];
  finalCandidates: SearchQualityCandidate[];
  finalRelevance: {
    relevantRetrieved: number;
    totalRelevant: number;
    precisionAt3: number;
    recallAt3: number;
  };
  citationPolicy: {
    expectedIds: string[];
    observedIds: string[];
    passed: boolean;
  };
  refusalPolicy: {
    expectedRefusal: boolean;
    refused: boolean;
    passed: boolean;
  };
  latency: {
    totalMs: number;
    byChannel: Partial<Record<SearchQualityChannel, number>>;
  };
}

interface SearchQualityRun {
  runId: string;
  corpusVersion: string;
  cases: SearchQualityCaseResult[];
}

type SearchQualityRunner = (testCase: SearchQualityCase) => Promise<SearchQualityChannelOutput> | SearchQualityChannelOutput;

type SearchQualityRunners = Partial<Record<SearchQualityChannel, SearchQualityRunner>>;

async function runSearchQualityHarness(
  corpus: SearchQualityCorpus,
  runners: SearchQualityRunners,
  options: { runId?: string; k?: number } = {},
): Promise<SearchQualityRun> {
  const k = options.k ?? 3;
  const runId = options.runId ?? `search-quality-${Date.now()}`;
  const cases: SearchQualityCaseResult[] = [];

  for (const testCase of corpus.cases) {
    const caseStart = performance.now();
    const captures: SearchQualityChannelCapture[] = [];

    for (const channel of testCase.expectedChannels) {
      const runner = runners[channel];
      if (!runner) {
        captures.push({
          channel,
          candidates: [],
          refused: false,
          citationIds: [],
          latencyMs: 0,
          error: 'runner_missing',
        });
        continue;
      }

      const channelStart = performance.now();
      try {
        const output = await runner(testCase);
        captures.push({
          channel,
          candidates: normalizeCandidates(channel, output.candidates),
          refused: output.refused === true,
          citationIds: output.citationIds ?? collectCitationIds(output.candidates),
          latencyMs: output.latencyMs ?? Math.max(0, performance.now() - channelStart),
        });
      } catch (error: unknown) {
        captures.push({
          channel,
          candidates: [],
          refused: false,
          citationIds: [],
          latencyMs: Math.max(0, performance.now() - channelStart),
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    const finalCandidates = captures
      .flatMap((capture) => capture.candidates)
      .sort((left, right) => left.rank - right.rank);
    const observedCitationIds = uniqueStrings(captures.flatMap((capture) => capture.citationIds));
    const expectedCitationIds = testCase.citationExpectation?.requiredIds ?? [];
    const refused = captures.some((capture) => capture.refused);
    const citationPassed = expectedCitationIds.length === 0
      || expectedCitationIds.every((id) => observedCitationIds.includes(id))
      || (testCase.citationExpectation?.allowRefusalInstead === true && refused);

    cases.push({
      caseId: testCase.id,
      query: testCase.query,
      perChannelCandidates: buildCandidateMap(captures),
      channelCaptures: captures,
      finalCandidates,
      finalRelevance: {
        relevantRetrieved: countRelevant(finalCandidates.slice(0, k), testCase.expectedRelevantIds),
        totalRelevant: testCase.expectedRelevantIds.length,
        precisionAt3: precisionAtK(finalCandidates, testCase.expectedRelevantIds, k),
        recallAt3: recallAtK(finalCandidates, testCase.expectedRelevantIds, k),
      },
      citationPolicy: {
        expectedIds: expectedCitationIds,
        observedIds: observedCitationIds,
        passed: citationPassed,
      },
      refusalPolicy: {
        expectedRefusal: testCase.refusalExpected === true,
        refused,
        passed: testCase.refusalExpected === true ? refused : true,
      },
      latency: {
        totalMs: Math.max(0, performance.now() - caseStart),
        byChannel: Object.fromEntries(captures.map((capture) => [capture.channel, capture.latencyMs])),
      },
    });
  }

  return {
    runId,
    corpusVersion: corpus.version,
    cases,
  };
}

function normalizeCandidates(
  channel: SearchQualityChannel,
  candidates: SearchQualityCandidate[],
): SearchQualityCandidate[] {
  return candidates.map((candidate, index) => ({
    ...candidate,
    channel,
    rank: Number.isFinite(candidate.rank) ? candidate.rank : index + 1,
  }));
}

function buildCandidateMap(
  captures: SearchQualityChannelCapture[],
): Record<SearchQualityChannel, SearchQualityCandidate[]> {
  return {
    memory_search: captures.find((capture) => capture.channel === 'memory_search')?.candidates ?? [],
    code_graph_query: captures.find((capture) => capture.channel === 'code_graph_query')?.candidates ?? [],
    skill_graph_query: captures.find((capture) => capture.channel === 'skill_graph_query')?.candidates ?? [],
  };
}

function collectCitationIds(candidates: SearchQualityCandidate[]): string[] {
  return uniqueStrings(candidates.flatMap((candidate) => candidate.citationIds ?? []));
}

function countRelevant(candidates: SearchQualityCandidate[], relevantIds: string[]): number {
  const relevant = new Set(relevantIds);
  return candidates.filter((candidate) => relevant.has(candidate.id)).length;
}

function uniqueStrings(values: string[]): string[] {
  return [...new Set(values.filter((value) => value.length > 0))];
}

export {
  runSearchQualityHarness,
  type SearchQualityCandidate,
  type SearchQualityCaseResult,
  type SearchQualityChannelCapture,
  type SearchQualityChannelOutput,
  type SearchQualityRun,
  type SearchQualityRunner,
  type SearchQualityRunners,
};
