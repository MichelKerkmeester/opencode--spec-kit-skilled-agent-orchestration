// ───────────────────────────────────────────────────────────────
// MODULE: Phase Classifier
// ───────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────
// 1. IMPORTS & TYPES
// ───────────────────────────────────────────────────────────────

import { SemanticSignalExtractor } from './semantic-signal-extractor';
import type {
  ConversationPhase,
  ConversationPhaseLabel,
  PhaseScoreMap,
  TopicCluster,
} from '../types/session-types';

type WeightedVector = Map<string, number>;

/** Input shape for a single conversation exchange to be classified. */
export interface PhaseClassifierExchangeInput {
  id: string;
  messageIndexes: number[];
  observationIndexes: number[];
  prompt: string;
  narratives: string[];
  factTexts: string[];
  toolNames: string[];
  observationTypes: string[];
  startTimestamp: string;
  endTimestamp: string;
}

interface ExchangeSignals {
  vector: WeightedVector;
  semanticVector: WeightedVector;
  dominantTerms: string[];
  combinedText: string;
  toolNames: string[];
  observationTypes: string[];
}

interface ClassifiedExchange extends PhaseClassifierExchangeInput {
  signals: ExchangeSignals;
}

interface InternalTopicCluster extends TopicCluster {
  vector: WeightedVector;
  semanticVector: WeightedVector;
  startTimestamp: string;
  endTimestamp: string;
}

/** Result of classifying conversation exchanges into topic clusters and phases. */
export interface PhaseClassificationResult {
  topicClusters: TopicCluster[];
  phases: ConversationPhase[];
  flowPattern: string;
  uniquePhaseCount: number;
}

// ───────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────

const PHASE_PRIORITY: readonly ConversationPhaseLabel[] = [
  'Debugging',
  'Verification',
  'Implementation',
  'Planning',
  'Research',
  'Discussion',
];

const RESEARCH_TOOLS = new Set(['read', 'grep', 'glob', 'webfetch', 'websearch']);
const IMPLEMENTATION_TOOLS = new Set(['edit', 'write', 'bash']);

/** Map alternative CLI tool names to canonical names for cross-CLI parity. */
const TOOL_NAME_ALIASES: Record<string, string> = {
  view: 'read',       // Copilot CLI
  shell: 'bash',      // alternative CLI names
  execute: 'bash',
  search: 'grep',
  find: 'glob',
};

const PHASE_KEYWORDS: Record<Exclude<ConversationPhaseLabel, 'Discussion'>, readonly string[]> = {
  Research: ['research', 'explore', 'investigate', 'understand', 'inspect', 'analyze', 'analyse', 'review'],
  Planning: ['plan', 'approach', 'design', 'option', 'tradeoff', 'decision', 'decide', 'strategy', 'proposal'],
  Implementation: ['implement', 'implementation', 'create', 'update', 'updated', 'build', 'write', 'refactor', 'ship'],
  Debugging: ['error', 'fix', 'fixed', 'bug', 'failing', 'failure', 'stack', 'null', 'debug', 'trace', 'broken'],
  Verification: ['test', 'tests', 'spec', 'vitest', 'jest', 'assert', 'coverage', 'verify', 'validate', 'check', 'pass', 'fail'],
};

// ───────────────────────────────────────────────────────────────
// 3. VECTOR OPERATIONS
// ───────────────────────────────────────────────────────────────

function createEmptyPhaseScores(): PhaseScoreMap {
  return {
    Research: 0,
    Planning: 0,
    Implementation: 0,
    Debugging: 0,
    Verification: 0,
    Discussion: 0,
  };
}

function normalizeKey(value: string): string {
  return value.trim().toLowerCase();
}

function addWeight(vector: WeightedVector, key: string, weight: number): void {
  const normalized = normalizeKey(key);
  if (!normalized) return;
  vector.set(normalized, (vector.get(normalized) ?? 0) + weight);
}

function mergeVectors(target: WeightedVector, source: WeightedVector): WeightedVector {
  const merged = new Map(target);
  for (const [key, value] of source.entries()) {
    merged.set(key, (merged.get(key) ?? 0) + value);
  }
  return merged;
}

function rankedKeys(vector: WeightedVector): string[] {
  return Array.from(vector.entries())
    .sort((a, b) => {
      if (b[1] !== a[1]) {
        return b[1] - a[1];
      }
      return a[0].localeCompare(b[0]);
    })
    .map(([key]) => key);
}

function cosineSimilarity(left: WeightedVector, right: WeightedVector): number {
  if (left.size === 0 || right.size === 0) {
    return 0;
  }

  let dot = 0;
  let leftNorm = 0;
  let rightNorm = 0;

  for (const value of left.values()) {
    leftNorm += value * value;
  }

  for (const value of right.values()) {
    rightNorm += value * value;
  }

  for (const [key, value] of left.entries()) {
    const other = right.get(key);
    if (other !== undefined) {
      dot += value * other;
    }
  }

  if (leftNorm === 0 || rightNorm === 0) {
    return 0;
  }

  return dot / (Math.sqrt(leftNorm) * Math.sqrt(rightNorm));
}

function jaccardSimilarity(left: Iterable<string>, right: Iterable<string>): number {
  const leftSet = new Set(left);
  const rightSet = new Set(right);
  if (leftSet.size === 0 && rightSet.size === 0) {
    return 1;
  }

  let intersection = 0;
  for (const item of leftSet) {
    if (rightSet.has(item)) {
      intersection++;
    }
  }

  const union = leftSet.size + rightSet.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

function calculateDuration(startTimestamp: string, endTimestamp: string): string {
  const start = new Date(startTimestamp);
  const end = new Date(endTimestamp);
  const durationMs = Math.max(0, end.getTime() - start.getTime());
  const minutes = Math.floor(durationMs / 60000);
  return minutes > 0 ? `${minutes} min` : '< 1 min';
}

function buildCombinedText(exchange: PhaseClassifierExchangeInput): string {
  return [
    exchange.prompt,
    ...exchange.narratives,
    ...exchange.factTexts,
    exchange.toolNames.join(' '),
    exchange.observationTypes.join(' '),
  ]
    .filter(Boolean)
    .join('\n')
    .trim();
}

function buildExchangeSignals(exchange: PhaseClassifierExchangeInput): ExchangeSignals {
  const combinedText = buildCombinedText(exchange);
  const extracted = SemanticSignalExtractor.extract({
    text: combinedText,
    mode: 'all',
    stopwordProfile: 'aggressive',
    ngramDepth: 2,
  });

  const vector = new Map<string, number>();
  const semanticVector = new Map<string, number>();

  for (const topic of extracted.topics) {
    addWeight(vector, topic, 3);
    addWeight(semanticVector, topic, 3);
  }

  for (const phrase of extracted.phrases) {
    addWeight(vector, phrase, 2);
    addWeight(semanticVector, phrase, 2);
  }

  for (const token of extracted.filteredTokens) {
    addWeight(vector, token, 1);
    addWeight(semanticVector, token, 1);
  }

  // Normalize tool names through alias map for cross-CLI parity
  const normalizedToolNames = exchange.toolNames.map((name) => {
    const lower = name.toLowerCase();
    return TOOL_NAME_ALIASES[lower] ?? lower;
  });

  for (const toolName of normalizedToolNames) {
    addWeight(vector, toolName, 2);
  }

  for (const observationType of exchange.observationTypes) {
    addWeight(vector, observationType, 2);
  }

  return {
    vector,
    semanticVector,
    dominantTerms: rankedKeys(semanticVector).slice(0, 4),
    combinedText: combinedText.toLowerCase(),
    toolNames: normalizedToolNames,
    observationTypes: exchange.observationTypes.map((observationType) => observationType.toLowerCase()),
  };
}

// ───────────────────────────────────────────────────────────────
// 4. SCORING & CLASSIFICATION
// ───────────────────────────────────────────────────────────────

function keywordScore(vector: WeightedVector, keywords: readonly string[]): number {
  let score = 0;
  for (const [term, weight] of vector.entries()) {
    if (keywords.some((keyword) => term.includes(keyword))) {
      score += weight;
    }
  }
  return score;
}

function scoreCluster(cluster: InternalTopicCluster, combinedText: string, toolNames: string[], observationTypes: string[]): PhaseScoreMap {
  const scores = createEmptyPhaseScores();

  scores.Research += keywordScore(cluster.vector, PHASE_KEYWORDS.Research);
  scores.Planning += keywordScore(cluster.vector, PHASE_KEYWORDS.Planning);
  scores.Implementation += keywordScore(cluster.vector, PHASE_KEYWORDS.Implementation);
  scores.Debugging += keywordScore(cluster.vector, PHASE_KEYWORDS.Debugging);
  scores.Verification += keywordScore(cluster.vector, PHASE_KEYWORDS.Verification);

  for (const toolName of toolNames) {
    if (RESEARCH_TOOLS.has(toolName)) {
      scores.Research += 2;
    }
    if (IMPLEMENTATION_TOOLS.has(toolName)) {
      scores.Implementation += 2;
    }
  }

  for (const observationType of observationTypes) {
    if (observationType === 'decision') {
      scores.Planning += 3;
    }
    if (observationType === 'feature' || observationType === 'refactor') {
      scores.Implementation += 3;
    }
    if (observationType === 'bugfix') {
      scores.Debugging += 3;
    }
    if (observationType === 'test') {
      scores.Verification += 3;
    }
    if (observationType === 'research') {
      scores.Research += 3;
    }
  }

  if (/\bshould we\b/.test(combinedText)) {
    scores.Planning += 2;
  }

  const hasResearchTool = toolNames.some((toolName) => RESEARCH_TOOLS.has(toolName));
  const hasImplementationTool = toolNames.some((toolName) => IMPLEMENTATION_TOOLS.has(toolName));
  const hasDebugSignal = /\b(error|fix|fixed|bug|failing|debug|stack|null)\b/.test(combinedText)
    || observationTypes.includes('bugfix');

  if (hasResearchTool && hasDebugSignal) {
    scores.Debugging += 4;
    scores.Research *= 0.5;
  }

  if (hasImplementationTool && scores.Research >= scores.Implementation) {
    scores.Research = Math.max(0, scores.Implementation - 0.01);
  }

  return scores;
}

function selectPrimaryPhase(scores: PhaseScoreMap): { phase: ConversationPhaseLabel; confidence: number } {
  const total = scores.Research + scores.Planning + scores.Implementation + scores.Debugging + scores.Verification;
  if (total === 0) {
    return { phase: 'Discussion', confidence: 0.35 };
  }

  const bestPhase = PHASE_PRIORITY.reduce((winner, candidate) => (
    scores[candidate] > scores[winner] ? candidate : winner
  ), PHASE_PRIORITY[0]);

  return {
    phase: bestPhase,
    confidence: scores[bestPhase] / total,
  };
}

function buildTopicLabel(dominantTerms: string[], fallback: ConversationPhaseLabel): string {
  const labelTerms = dominantTerms.slice(0, 2);
  return labelTerms.length > 0 ? labelTerms.join(' / ') : fallback;
}

function classifyCluster(cluster: InternalTopicCluster, exchanges: ClassifiedExchange[]): InternalTopicCluster {
  const clusterExchanges = exchanges.filter((exchange) => cluster.messageIndexes.some((index) => exchange.messageIndexes.includes(index)));
  const combinedText = clusterExchanges.map((exchange) => exchange.signals.combinedText).join('\n');
  const toolNames = clusterExchanges.flatMap((exchange) => exchange.signals.toolNames);
  const observationTypes = clusterExchanges.flatMap((exchange) => exchange.signals.observationTypes);
  const phaseScores = scoreCluster(cluster, combinedText, toolNames, observationTypes);
  const { phase, confidence } = selectPrimaryPhase(phaseScores);

  return {
    ...cluster,
    label: buildTopicLabel(cluster.dominantTerms, phase),
    phaseScores,
    primaryPhase: phase,
    confidence,
  };
}

// ───────────────────────────────────────────────────────────────
// 5. FLOW PATTERN DERIVATION
// ───────────────────────────────────────────────────────────────

function deriveFlowPattern(clusters: InternalTopicCluster[]): string {
  if (clusters.length === 0) {
    return 'Linear Sequential';
  }

  const seen = new Set<ConversationPhaseLabel>();
  for (let i = 0; i < clusters.length; i++) {
    const phase = clusters[i].primaryPhase;
    if (seen.has(phase) && clusters[i - 1]?.primaryPhase !== phase) {
      return 'Iterative Loop';
    }
    seen.add(phase);
  }

  const uniquePhaseCount = new Set(clusters.map((cluster) => cluster.primaryPhase)).size;
  const averageConfidence = clusters.reduce((sum, cluster) => sum + cluster.confidence, 0) / clusters.length;
  if (clusters.length >= 4 && uniquePhaseCount >= 3 && averageConfidence < 0.6) {
    return 'Exploratory Sweep';
  }

  const adjacency = new Map<number, Set<number>>();
  for (let i = 0; i < clusters.length; i++) {
    if (!adjacency.has(i)) {
      adjacency.set(i, new Set());
    }

    if (i < clusters.length - 1) {
      adjacency.get(i)?.add(i + 1);
    }

    for (let j = i + 1; j < clusters.length; j++) {
      const cosine = cosineSimilarity(clusters[i].semanticVector, clusters[j].semanticVector);
      const overlap = jaccardSimilarity(clusters[i].dominantTerms, clusters[j].dominantTerms);
      if (cosine >= 0.45 || overlap >= 0.5) {
        adjacency.get(i)?.add(j);
      }
    }
  }

  if (Array.from(adjacency.values()).some((targets) => targets.size > 1)) {
    return 'Branching Investigation';
  }

  return 'Linear Sequential';
}

function buildTimelinePhases(clusters: InternalTopicCluster[]): ConversationPhase[] {
  return clusters.map((cluster) => ({
    PHASE_NAME: cluster.primaryPhase,
    DURATION: calculateDuration(cluster.startTimestamp, cluster.endTimestamp),
    CLUSTER_ID: cluster.id,
    CONFIDENCE: cluster.confidence,
    START_MESSAGE_INDEX: cluster.messageIndexes[0] ?? 0,
    END_MESSAGE_INDEX: cluster.messageIndexes[cluster.messageIndexes.length - 1] ?? 0,
    DOMINANT_TERMS: cluster.dominantTerms,
  }));
}

function toClassifiedExchange(exchange: PhaseClassifierExchangeInput): ClassifiedExchange {
  return {
    ...exchange,
    signals: buildExchangeSignals(exchange),
  };
}

// ───────────────────────────────────────────────────────────────
// 6. PUBLIC API
// ───────────────────────────────────────────────────────────────

/** Classifies conversation exchanges into topic clusters, phases, and a flow pattern. */
export function classifyConversationExchanges(exchanges: PhaseClassifierExchangeInput[]): PhaseClassificationResult {
  if (exchanges.length === 0) {
    return {
      topicClusters: [],
      phases: [],
      flowPattern: 'Linear Sequential',
      uniquePhaseCount: 0,
    };
  }

  const classified = exchanges.map(toClassifiedExchange);
  const clusters: InternalTopicCluster[] = [];

  for (let index = 0; index < classified.length; index++) {
    const exchange = classified[index];

    if (clusters.length === 0) {
      clusters.push({
        id: `cluster-${index + 1}`,
        label: '',
        messageIndexes: [...exchange.messageIndexes],
        observationIndexes: [...exchange.observationIndexes],
        dominantTerms: exchange.signals.dominantTerms.slice(0, 4),
        phaseScores: createEmptyPhaseScores(),
        primaryPhase: 'Discussion',
        confidence: 0.35,
        vector: new Map(exchange.signals.vector),
        semanticVector: new Map(exchange.signals.semanticVector),
        startTimestamp: exchange.startTimestamp,
        endTimestamp: exchange.endTimestamp,
      });
      continue;
    }

    const currentCluster = clusters[clusters.length - 1];
    const cosine = cosineSimilarity(exchange.signals.vector, currentCluster.vector);
    const overlap = jaccardSimilarity(exchange.signals.vector.keys(), currentCluster.vector.keys());
    const similarity = (0.7 * cosine) + (0.3 * overlap);

    if (similarity >= 0.55) {
      currentCluster.messageIndexes = Array.from(new Set([...currentCluster.messageIndexes, ...exchange.messageIndexes])).sort((a, b) => a - b);
      currentCluster.observationIndexes = Array.from(new Set([...currentCluster.observationIndexes, ...exchange.observationIndexes])).sort((a, b) => a - b);
      currentCluster.vector = mergeVectors(currentCluster.vector, exchange.signals.vector);
      currentCluster.semanticVector = mergeVectors(currentCluster.semanticVector, exchange.signals.semanticVector);
      currentCluster.dominantTerms = rankedKeys(currentCluster.semanticVector).slice(0, 4);
      currentCluster.endTimestamp = exchange.endTimestamp;
    } else {
      clusters.push({
        id: `cluster-${index + 1}`,
        label: '',
        messageIndexes: [...exchange.messageIndexes],
        observationIndexes: [...exchange.observationIndexes],
        dominantTerms: exchange.signals.dominantTerms.slice(0, 4),
        phaseScores: createEmptyPhaseScores(),
        primaryPhase: 'Discussion',
        confidence: 0.35,
        vector: new Map(exchange.signals.vector),
        semanticVector: new Map(exchange.signals.semanticVector),
        startTimestamp: exchange.startTimestamp,
        endTimestamp: exchange.endTimestamp,
      });
    }
  }

  const classifiedClusters = clusters.map((cluster) => classifyCluster(cluster, classified));
  const phases = buildTimelinePhases(classifiedClusters);

  return {
    topicClusters: classifiedClusters.map(({
      vector: _vector,
      semanticVector: _semanticVector,
      startTimestamp: _startTimestamp,
      endTimestamp: _endTimestamp,
      ...cluster
    }) => cluster),
    phases,
    flowPattern: deriveFlowPattern(classifiedClusters),
    uniquePhaseCount: new Set(classifiedClusters.map((cluster) => cluster.primaryPhase)).size,
  };
}

/** Backward-compatible single-exchange classifier returning only the phase label. */
export function classifyConversationPhase(toolCalls: Array<{ tool?: string }>, messageContent: string): ConversationPhaseLabel {
  const result = classifyConversationExchanges([{
    id: 'compat-1',
    messageIndexes: [0],
    observationIndexes: [],
    prompt: messageContent,
    narratives: [],
    factTexts: [],
    toolNames: toolCalls.map((toolCall) => toolCall.tool || '').filter(Boolean),
    observationTypes: [],
    startTimestamp: new Date(0).toISOString(),
    endTimestamp: new Date(0).toISOString(),
  }]);

  return (result.phases[0]?.PHASE_NAME as ConversationPhaseLabel | undefined) ?? 'Discussion';
}
