// ───────────────────────────────────────────────────────────────
// 1. COLLECT SESSION DATA
// ───────────────────────────────────────────────────────────────
// Orchestrates session data collection — gathers observations, files, decisions, and context

// Node stdlib
import * as path from 'path';
import * as fsSync from 'fs';

// Internal modules
import { CONFIG, findActiveSpecsDir, getSpecsDirectories } from '../core';
import { formatTimestamp } from '../utils/message-utils';
import { pickBestContentName } from '../utils/slug-utils';
import { detectSpecFolder } from '../spec-folder';

import {
  generateSessionId,
  getChannel,
  detectSessionCharacteristics,
  buildProjectStateSnapshot,
  calculateSessionDuration,
  calculateExpiryEpoch,
  detectRelatedDocs,
  extractBlockers,
} from './session-extractor';
import type {
  ToolCounts,
  Observation,
  UserPrompt,
  FileEntry,
  SpecFileEntry,
  RecentContextEntry,
} from './session-extractor';

import {
  detectObservationType,
  extractFilesFromData,
  buildObservationsWithAnchors,
} from './file-extractor';
import type { FileChange, ObservationDetailed } from './file-extractor';

import { buildImplementationGuideData } from './implementation-guide-extractor';
import type { ImplementationGuideData } from './implementation-guide-extractor';

import type { SessionData, OutcomeEntry } from '../types/session-types';

// Re-export canonical types for backward compatibility
export type { SessionData, OutcomeEntry };

/* ───────────────────────────────────────────────────────────────
   1. INTERFACES
------------------------------------------------------------------*/

/** Preflight learning metrics captured before task execution. */
export interface PreflightData {
  knowledgeScore?: number;
  uncertaintyScore?: number;
  contextScore?: number;
  timestamp?: string;
  gaps?: string[];
  confidence?: number;
  uncertaintyRaw?: number;
  readiness?: string;
}

/** Postflight learning metrics captured after task execution. */
export interface PostflightData {
  knowledgeScore?: number;
  uncertaintyScore?: number;
  contextScore?: number;
  gapsClosed?: string[];
  newGaps?: string[];
}

/** Describes an identified gap between preflight and postflight state. */
export interface GapDescription {
  GAP_DESCRIPTION: string;
}

/** Aggregates preflight and postflight comparison results. */
export interface PreflightPostflightResult {
  HAS_PREFLIGHT_BASELINE: boolean;
  HAS_POSTFLIGHT_DELTA: boolean;
  PREFLIGHT_KNOW_SCORE: number | null;
  PREFLIGHT_UNCERTAINTY_SCORE: number | null;
  PREFLIGHT_CONTEXT_SCORE: number | null;
  PREFLIGHT_KNOW_ASSESSMENT: string;
  PREFLIGHT_UNCERTAINTY_ASSESSMENT: string;
  PREFLIGHT_CONTEXT_ASSESSMENT: string;
  PREFLIGHT_TIMESTAMP: string | null;
  PREFLIGHT_GAPS: GapDescription[];
  PREFLIGHT_CONFIDENCE: number | null;
  PREFLIGHT_UNCERTAINTY_RAW: number | null;
  PREFLIGHT_READINESS: string | null;
  POSTFLIGHT_KNOW_SCORE: number | null;
  POSTFLIGHT_UNCERTAINTY_SCORE: number | null;
  POSTFLIGHT_CONTEXT_SCORE: number | null;
  DELTA_KNOW_SCORE: string | null;
  DELTA_UNCERTAINTY_SCORE: string | null;
  DELTA_CONTEXT_SCORE: string | null;
  DELTA_KNOW_TREND: string;
  DELTA_UNCERTAINTY_TREND: string;
  DELTA_CONTEXT_TREND: string;
  LEARNING_INDEX: number | null;
  LEARNING_SUMMARY: string;
  GAPS_CLOSED: GapDescription[];
  NEW_GAPS: GapDescription[];
}

/** Represents a pending task extracted from session context. */
export interface PendingTask {
  TASK_ID: string;
  TASK_DESCRIPTION: string;
  TASK_PRIORITY: string;
}

/** Represents a context item included in continue-session payloads. */
export interface ContextItem {
  CONTEXT_ITEM: string;
}

/** Captures the synthesized data needed to continue a session. */
export interface ContinueSessionData {
  SESSION_STATUS: string;
  COMPLETION_PERCENT: number;
  LAST_ACTIVITY_TIMESTAMP: string;
  SESSION_DURATION: string;
  CONTINUATION_COUNT: number;
  CONTEXT_SUMMARY: string;
  PENDING_TASKS: PendingTask[];
  NEXT_CONTINUATION_COUNT: number;
  RESUME_CONTEXT: ContextItem[];
}

/** Full collected session payload used by downstream extractors. */
export interface CollectedDataFull {
  recentContext?: RecentContextEntry[];
  observations?: Observation[];
  userPrompts?: UserPrompt[];
  SPEC_FOLDER?: string;
  FILES?: Array<{
    FILE_PATH?: string;
    path?: string;
    DESCRIPTION?: string;
    description?: string;
    _provenance?: 'git' | 'spec-folder';
    _synthetic?: boolean;
  }>;
  filesModified?: Array<{ path: string; changes_summary?: string }>;
  _manualDecisions?: unknown[];
  _manualTriggerPhrases?: string[];
  _isSimulation?: boolean;
  preflight?: PreflightData;
  postflight?: PostflightData;
  [key: string]: unknown;
}

/* ───────────────────────────────────────────────────────────────
   1.5. PREFLIGHT/POSTFLIGHT UTILITIES
------------------------------------------------------------------*/

function getScoreAssessment(score: number | null | undefined, metric: string): string {
  if (score === null || score === undefined || isNaN(score)) {
    return '';
  }
  if (metric === 'uncertainty') {
    if (score <= 20) return 'Very low uncertainty';
    if (score <= 40) return 'Low uncertainty';
    if (score <= 60) return 'Moderate uncertainty';
    if (score <= 80) return 'High uncertainty';
    return 'Very high uncertainty';
  }
  if (score >= 80) return 'Strong';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Moderate';
  if (score >= 20) return 'Limited';
  return 'Minimal';
}

function getTrendIndicator(delta: number | null | undefined, invertedBetter: boolean = false): string {
  if (delta === null || delta === undefined || isNaN(delta)) {
    return '\u2192';
  }
  if (invertedBetter) {
    if (delta > 0) return '\u2193';
    if (delta < 0) return '\u2191';
    return '\u2192';
  }
  if (delta > 0) return '\u2191';
  if (delta < 0) return '\u2193';
  return '\u2192';
}

function calculateLearningIndex(
  deltaKnow: number | null | undefined,
  deltaUncert: number | null | undefined,
  deltaContext: number | null | undefined
): number {
  const dk = deltaKnow ?? 0;
  const du = deltaUncert ?? 0;
  const dc = deltaContext ?? 0;
  const index =
    (dk * CONFIG.LEARNING_WEIGHTS.knowledge) +
    (du * CONFIG.LEARNING_WEIGHTS.uncertainty) +
    (dc * CONFIG.LEARNING_WEIGHTS.context);
  return Math.round(Math.max(0, Math.min(100, index)));
}

function extractPreflightPostflightData(collectedData: CollectedDataFull | null): PreflightPostflightResult {
  const preflight = collectedData?.preflight;
  const postflight = collectedData?.postflight;
  const hasPreflightBaseline = Boolean(
    preflight && (
      typeof preflight.knowledgeScore === 'number' ||
      typeof preflight.uncertaintyScore === 'number' ||
      typeof preflight.contextScore === 'number' ||
      typeof preflight.timestamp === 'string' ||
      (preflight.gaps?.length ?? 0) > 0 ||
      typeof preflight.confidence === 'number' ||
      typeof preflight.uncertaintyRaw === 'number' ||
      typeof preflight.readiness === 'string'
    )
  );
  const hasPostflightDelta = Boolean(
    preflight && postflight &&
    Number.isFinite(preflight.knowledgeScore) &&
    Number.isFinite(postflight.knowledgeScore) &&
    Number.isFinite(preflight.uncertaintyScore) &&
    Number.isFinite(postflight.uncertaintyScore) &&
    Number.isFinite(preflight.contextScore) &&
    Number.isFinite(postflight.contextScore)
  );

  const DEFAULT_VALUE = null;

  // F-35: Guard against NaN/Infinity — replace with null
  const safeNum = (v: number | undefined | null): number | null =>
    v !== undefined && v !== null && Number.isFinite(v) ? v : null;

  const preflightData = {
    PREFLIGHT_KNOW_SCORE: safeNum(preflight?.knowledgeScore),
    PREFLIGHT_UNCERTAINTY_SCORE: safeNum(preflight?.uncertaintyScore),
    PREFLIGHT_CONTEXT_SCORE: safeNum(preflight?.contextScore),
    PREFLIGHT_KNOW_ASSESSMENT: getScoreAssessment(preflight?.knowledgeScore, 'knowledge'),
    PREFLIGHT_UNCERTAINTY_ASSESSMENT: getScoreAssessment(preflight?.uncertaintyScore, 'uncertainty'),
    PREFLIGHT_CONTEXT_ASSESSMENT: getScoreAssessment(preflight?.contextScore, 'context'),
    PREFLIGHT_TIMESTAMP: preflight?.timestamp ?? DEFAULT_VALUE,
    PREFLIGHT_GAPS: preflight?.gaps?.map((g) => ({ GAP_DESCRIPTION: g })) ?? [],
    PREFLIGHT_CONFIDENCE: safeNum(preflight?.confidence),
    PREFLIGHT_UNCERTAINTY_RAW: safeNum(preflight?.uncertaintyRaw ?? preflight?.uncertaintyScore),
    PREFLIGHT_READINESS: preflight?.readiness ?? DEFAULT_VALUE
  };

  const postflightData = {
    POSTFLIGHT_KNOW_SCORE: safeNum(postflight?.knowledgeScore),
    POSTFLIGHT_UNCERTAINTY_SCORE: safeNum(postflight?.uncertaintyScore),
    POSTFLIGHT_CONTEXT_SCORE: safeNum(postflight?.contextScore)
  };

  let deltaData: {
    DELTA_KNOW_SCORE: string | null;
    DELTA_UNCERTAINTY_SCORE: string | null;
    DELTA_CONTEXT_SCORE: string | null;
    DELTA_KNOW_TREND: string;
    DELTA_UNCERTAINTY_TREND: string;
    DELTA_CONTEXT_TREND: string;
    LEARNING_INDEX: number | null;
    LEARNING_SUMMARY: string;
  } = {
    DELTA_KNOW_SCORE: DEFAULT_VALUE,
    DELTA_UNCERTAINTY_SCORE: DEFAULT_VALUE,
    DELTA_CONTEXT_SCORE: DEFAULT_VALUE,
    DELTA_KNOW_TREND: '\u2192',
    DELTA_UNCERTAINTY_TREND: '\u2192',
    DELTA_CONTEXT_TREND: '\u2192',
    LEARNING_INDEX: DEFAULT_VALUE,
    LEARNING_SUMMARY: 'Learning metrics will be calculated when both preflight and postflight data are provided.'
  };

  if (hasPostflightDelta) {
    const deltaKnow = postflight!.knowledgeScore! - preflight!.knowledgeScore!;
    const deltaUncert = preflight!.uncertaintyScore! - postflight!.uncertaintyScore!;
    const deltaContext = postflight!.contextScore! - preflight!.contextScore!;

    const learningIndex = calculateLearningIndex(deltaKnow, deltaUncert, deltaContext);

    const formatDelta = (d: number): string => d >= 0 ? `+${d}` : `${d}`;

    deltaData = {
      DELTA_KNOW_SCORE: formatDelta(deltaKnow),
      DELTA_UNCERTAINTY_SCORE: formatDelta(deltaUncert),
      DELTA_CONTEXT_SCORE: formatDelta(deltaContext),
      DELTA_KNOW_TREND: getTrendIndicator(deltaKnow, false),
      DELTA_UNCERTAINTY_TREND: getTrendIndicator(deltaUncert, true),
      DELTA_CONTEXT_TREND: getTrendIndicator(deltaContext, false),
      LEARNING_INDEX: learningIndex,
      LEARNING_SUMMARY: generateLearningSummary(deltaKnow, deltaUncert, deltaContext, learningIndex)
    };
  }

  const gapsData = {
    GAPS_CLOSED: postflight?.gapsClosed?.map((g) => ({ GAP_DESCRIPTION: g })) ?? [],
    NEW_GAPS: postflight?.newGaps?.map((g) => ({ GAP_DESCRIPTION: g })) ?? []
  };

  return {
    HAS_PREFLIGHT_BASELINE: hasPreflightBaseline,
    HAS_POSTFLIGHT_DELTA: hasPostflightDelta,
    ...preflightData,
    ...postflightData,
    ...deltaData,
    ...gapsData
  };
}

function generateLearningSummary(
  deltaKnow: number,
  deltaUncert: number,
  deltaContext: number,
  learningIndex: number
): string {
  const parts: string[] = [];

  if (deltaKnow > 20) {
    parts.push(`Significant knowledge gain (+${deltaKnow} points)`);
  } else if (deltaKnow > 10) {
    parts.push(`Moderate knowledge improvement (+${deltaKnow} points)`);
  } else if (deltaKnow > 0) {
    parts.push(`Slight knowledge increase (+${deltaKnow} points)`);
  } else if (deltaKnow < -10) {
    parts.push(`Knowledge score decreased (${deltaKnow} points) - may indicate scope expansion`);
  }

  if (deltaUncert > 20) {
    parts.push(`Major uncertainty reduction (-${deltaUncert} points)`);
  } else if (deltaUncert > 10) {
    parts.push(`Good uncertainty reduction (-${deltaUncert} points)`);
  } else if (deltaUncert < -10) {
    parts.push(`Uncertainty increased (+${Math.abs(deltaUncert)} points) - new unknowns discovered`);
  }

  if (deltaContext > 15) {
    parts.push(`Substantial context enrichment (+${deltaContext} points)`);
  } else if (deltaContext > 5) {
    parts.push(`Context improved (+${deltaContext} points)`);
  }

  if (parts.length === 0) {
    if (learningIndex >= 25) {
      return 'Productive session with balanced learning across metrics.';
    } else if (learningIndex >= 10) {
      return 'Moderate learning session - incremental progress made.';
    } else {
      return 'Low learning delta - session may have focused on execution rather than exploration.';
    }
  }

  let summary: string = parts.join('. ') + '.';

  if (learningIndex >= 40) {
    summary += ' Overall: Highly productive learning session.';
  } else if (learningIndex >= 25) {
    summary += ' Overall: Good learning session with meaningful progress.';
  } else if (learningIndex >= 10) {
    summary += ' Overall: Moderate learning session.';
  }

  return summary;
}

/* ───────────────────────────────────────────────────────────────
   2. CONTINUE SESSION DATA GENERATION (T124)
------------------------------------------------------------------*/

function determineSessionStatus(
  blockers: string,
  observations: Observation[],
  messageCount: number
): string {
  const completionKeywords = /\b(?:done|complete[d]?|finish(?:ed)?|success(?:ful(?:ly)?)?)\b/i;
  const resolutionKeywords = /\b(?:resolved|fixed|unblocked|works?\s+now|workaround)\b/i;
  const lastObs = observations[observations.length - 1];

  if (blockers && blockers !== 'None') {
    // F-25: Reconciliation pass — check if later observations show resolution after blocker
    const blockerResolved = observations.some((obs) => {
      const text = `${obs.title || ''} ${obs.narrative || ''}`;
      return resolutionKeywords.test(text);
    });
    if (!blockerResolved) {
      return 'BLOCKED';
    }
    // Blocker was resolved — fall through to check completion
  }

  if (lastObs) {
    const narrative = lastObs.narrative || '';
    if (completionKeywords.test(narrative) || completionKeywords.test(lastObs.title || '')) {
      return 'COMPLETED';
    }
  }

  if (messageCount < 3) {
    return 'IN_PROGRESS';
  }

  return 'IN_PROGRESS';
}

function estimateCompletionPercent(
  observations: Observation[],
  messageCount: number,
  toolCounts: ToolCounts,
  sessionStatus: string
): number {
  if (sessionStatus === 'COMPLETED') return 100;
  if (sessionStatus === 'BLOCKED') return Math.min(90, messageCount * 5);

  const totalTools = Object.values(toolCounts).reduce((a, b) => a + b, 0);
  const writeTools = (toolCounts.Write || 0) + (toolCounts.Edit || 0);

  let basePercent = 0;
  basePercent += Math.min(50, messageCount * 5);

  if (totalTools > 0) {
    basePercent += Math.min(30, (writeTools / totalTools) * 40);
  }

  basePercent += Math.min(20, observations.length * 3);

  return Math.min(95, Math.round(basePercent));
}

function extractPendingTasks(
  observations: Observation[],
  recentContext: RecentContextEntry[] | undefined,
  nextAction: string
): PendingTask[] {
  const tasks: PendingTask[] = [];
  const taskPatterns: RegExp[] = [
    /\b(?:todo|task|need(?:s)? to|should|must|next):\s*(.+?)(?:[.!?\n]|$)/gi,
    /\[\s*\]\s*(.+?)(?:\n|$)/g,
    /\b(?:remaining|pending|left to do):\s*(.+?)(?:[.!?\n]|$)/gi
  ];

  let taskId = 1;
  const seen = new Set<string>();

  for (const obs of observations) {
    const text = `${obs.title || ''} ${obs.narrative || ''}`;
    for (const pattern of taskPatterns) {
      let match: RegExpExecArray | null;
      pattern.lastIndex = 0;
      while ((match = pattern.exec(text)) !== null) {
        const taskDesc = match[1].trim().substring(0, 100);
        if (taskDesc.length > 10 && !seen.has(taskDesc.toLowerCase())) {
          seen.add(taskDesc.toLowerCase());
          tasks.push({
            TASK_ID: `T${String(taskId++).padStart(3, '0')}`,
            TASK_DESCRIPTION: taskDesc,
            TASK_PRIORITY: 'P1'
          });
        }
      }
    }

    if (obs.facts) {
      for (const fact of obs.facts) {
        const factText = typeof fact === 'string'
          ? fact
          : (fact && typeof fact === 'object' ? (fact as { text?: string }).text || '' : '');
        for (const pattern of taskPatterns) {
          let match: RegExpExecArray | null;
          pattern.lastIndex = 0;
          while ((match = pattern.exec(factText)) !== null) {
            const taskDesc = match[1].trim().substring(0, 100);
            if (taskDesc.length > 10 && !seen.has(taskDesc.toLowerCase())) {
              seen.add(taskDesc.toLowerCase());
              tasks.push({
                TASK_ID: `T${String(taskId++).padStart(3, '0')}`,
                TASK_DESCRIPTION: taskDesc,
                TASK_PRIORITY: 'P2'
              });
            }
          }
        }
      }
    }
  }

  if (nextAction &&
      nextAction !== 'Continue implementation' &&
      !seen.has(nextAction.toLowerCase())) {
    tasks.unshift({
      TASK_ID: 'T000',
      TASK_DESCRIPTION: nextAction,
      TASK_PRIORITY: 'P0'
    });
  }

  return tasks.slice(0, 10);
}

function generateContextSummary(
  summary: string,
  observations: Observation[],
  projectPhase: string,
  decisionCount: number
): string {
  const parts: string[] = [];

  parts.push(`**Phase:** ${projectPhase}`);

  if (observations.length > 0) {
    const recentTitles = observations
      .slice(-3)
      .map((o) => o.title)
      .filter((t): t is string => !!t && t.length > 5)
      .join(', ');
    if (recentTitles) {
      parts.push(`**Recent:** ${recentTitles}`);
    }
  }

  if (decisionCount > 0) {
    parts.push(`**Decisions:** ${decisionCount} decision${decisionCount > 1 ? 's' : ''} recorded`);
  }

  if (summary &&
      summary.length > 30 &&
      !summary.includes('SIMULATION') &&
      !summary.includes('[response]')) {
    const trimmed = summary.substring(0, 200);
    parts.push(`**Summary:** ${trimmed}${summary.length > 200 ? '...' : ''}`);
  }

  return parts.join('\n\n');
}

function generateResumeContext(
  files: FileChange[],
  specFiles: SpecFileEntry[],
  observations: Observation[]
): ContextItem[] {
  const items: ContextItem[] = [];

  if (files.length > 0) {
    const fileList = files.slice(0, 3).map((f) => f.FILE_PATH).join(', ');
    items.push({ CONTEXT_ITEM: `Files modified: ${fileList}` });
  }

  const priorityDocs = ['tasks.md', 'checklist.md', 'plan.md'];
  const relevantDocs = specFiles.filter((sf) => priorityDocs.includes(sf.FILE_NAME));
  if (relevantDocs.length > 0) {
    items.push({ CONTEXT_ITEM: `Check: ${relevantDocs.map((d) => d.FILE_NAME).join(', ')}` });
  }

  const lastMeaningful = [...observations].reverse().find((o) => o.narrative && o.narrative.length > 50);
  if (lastMeaningful) {
    items.push({ CONTEXT_ITEM: `Last: ${(lastMeaningful.title || lastMeaningful.narrative || '').substring(0, 80)}` });
  }

  return items.slice(0, 5);
}

interface ContinueSessionParams {
  observations: Observation[];
  userPrompts: UserPrompt[];
  toolCounts: ToolCounts;
  recentContext?: RecentContextEntry[];
  FILES: FileChange[];
  SPEC_FILES: SpecFileEntry[];
  summary: string;
  projectPhase: string;
  lastAction: string;
  nextAction: string;
  blockers: string;
  duration: string;
  decisionCount: number;
}

function buildContinueSessionData(params: ContinueSessionParams): ContinueSessionData {
  const {
    observations, userPrompts, toolCounts, recentContext,
    FILES, SPEC_FILES, summary, projectPhase, nextAction,
    blockers, duration, decisionCount
  } = params;

  const sessionStatus = determineSessionStatus(blockers, observations, userPrompts.length);
  const completionPercent = estimateCompletionPercent(
    observations, userPrompts.length, toolCounts, sessionStatus
  );
  const pendingTasks = extractPendingTasks(observations, recentContext, nextAction);
  const contextSummary = generateContextSummary(summary, observations, projectPhase, decisionCount);
  const resumeContext = generateResumeContext(FILES, SPEC_FILES, observations);
  const continuationCount = recentContext?.[0]?.continuationCount ?? 1;

  const lastPrompt = userPrompts[userPrompts.length - 1];
  // F-19 — Guard against invalid timestamps that cause RangeError on toISOString()
  let lastActivity: string;
  if (lastPrompt?.timestamp) {
    const d = new Date(lastPrompt.timestamp);
    lastActivity = isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
  } else {
    lastActivity = new Date().toISOString();
  }

  return {
    SESSION_STATUS: sessionStatus,
    COMPLETION_PERCENT: completionPercent,
    LAST_ACTIVITY_TIMESTAMP: lastActivity,
    SESSION_DURATION: duration,
    CONTINUATION_COUNT: continuationCount,
    CONTEXT_SUMMARY: contextSummary,
    PENDING_TASKS: pendingTasks,
    NEXT_CONTINUATION_COUNT: continuationCount + 1,
    RESUME_CONTEXT: resumeContext
  };
}

/* ───────────────────────────────────────────────────────────────
   2.5. LAZY-LOADED DEPENDENCIES
------------------------------------------------------------------*/

import * as simFactoryModule from '../lib/simulation-factory';
function getSimFactory(): typeof import('../lib/simulation-factory') {
  return simFactoryModule;
}

/* ───────────────────────────────────────────────────────────────
   3. AUTO-SAVE DETECTION
------------------------------------------------------------------*/

function shouldAutoSave(messageCount: number): boolean {
  return messageCount > 0 && messageCount % CONFIG.MESSAGE_COUNT_TRIGGER === 0;
}

/* ───────────────────────────────────────────────────────────────
   4. SESSION DATA COLLECTION
------------------------------------------------------------------*/

// F-24: Single helper for spec-folder resolution — replaces 3 redundant resolution points
function resolveSpecFolderRelative(normalizedDetected: string, candidateSpecsDirs: string[]): string {
  for (const candidateRoot of candidateSpecsDirs) {
    const normalizedRoot = path.resolve(candidateRoot).replace(/\\/g, '/');
    const relative = path.relative(normalizedRoot, normalizedDetected).replace(/\\/g, '/');
    if (
      relative &&
      relative !== '.' &&
      relative !== '..' &&
      !relative.startsWith('../') &&
      !path.isAbsolute(relative)
    ) {
      return relative;
    }
  }
  return path.basename(normalizedDetected);
}

async function collectSessionData(
  collectedData: CollectedDataFull | null,
  specFolderName: string | null = null
): Promise<SessionData> {
  const now = new Date();

  // F-24: Consolidated spec-folder resolution helper
  let folderName: string = specFolderName || '';
  if (!folderName) {
    const detectedFolder = await detectSpecFolder();
    const normalizedDetected = path.resolve(detectedFolder).replace(/\\/g, '/');

    const candidateSpecsDirs = Array.from(new Set([
      findActiveSpecsDir() || path.join(CONFIG.PROJECT_ROOT, 'specs'),
      ...getSpecsDirectories(),
      path.join(CONFIG.PROJECT_ROOT, 'specs'),
      path.join(CONFIG.PROJECT_ROOT, '.opencode', 'specs'),
    ]));

    folderName = resolveSpecFolderRelative(normalizedDetected, candidateSpecsDirs);
  }
  const dateOnly: string = formatTimestamp(now, 'date-dutch');
  const timeOnly: string = formatTimestamp(now, 'time-short');

  if (!collectedData) {
    console.log('   Warning: Using simulation data');
    return getSimFactory().createSessionData({
      specFolder: folderName,
      channel: getChannel(),
      skillVersion: CONFIG.SKILL_VERSION
    });
  }

  const data: CollectedDataFull = { ...collectedData };
  const sessionInfo = data.recentContext?.[0] || {};
  let observations: Observation[] = data.observations || [];
  observations = observations.slice(0, CONFIG.MAX_OBSERVATIONS);
  const userPrompts: UserPrompt[] = data.userPrompts || [];
  const messageCount: number = userPrompts.length || 0;

  if (shouldAutoSave(messageCount)) {
    console.log(`\n   Context Budget: ${messageCount} messages reached. Auto-saving context...\n`);
  }

  const duration: string = calculateSessionDuration(userPrompts, now);
  const FILES: FileChange[] = extractFilesFromData(data, observations);

  const OUTCOMES: OutcomeEntry[] = observations
    .slice(0, 10)
    .map((obs) => ({
      OUTCOME: obs.title || obs.narrative?.substring(0, 300) || '',
      TYPE: detectObservationType(obs)
    }));

  const SUMMARY: string = (sessionInfo as RecentContextEntry).learning
    || observations.slice(0, 3).map((o) => o.narrative).filter(Boolean).join(' ')
    || 'Session focused on implementing and testing features.';

  const { contextType, importanceTier, decisionCount, toolCounts } =
    detectSessionCharacteristics(observations, userPrompts, FILES as FileEntry[]);

  const TOOL_COUNT: number = Object.values(toolCounts).reduce((sum, count) => sum + count, 0);

  const firstPrompt = userPrompts[0]?.prompt || '';
  const taskFromPrompt = firstPrompt.match(/^(.{20,100}?)(?:[.!?\n]|$)/)?.[1];
  const quickSummaryCandidates = [
    ...observations.map((observation) => observation.title || ''),
    (sessionInfo as RecentContextEntry).request || '',
    (sessionInfo as RecentContextEntry).learning || '',
    taskFromPrompt?.trim() || '',
  ];
  const quickSummary = pickBestContentName(quickSummaryCandidates)
    || observations[0]?.title
    || (sessionInfo as RecentContextEntry).request
    || (sessionInfo as RecentContextEntry).learning
    || taskFromPrompt?.trim()
    || 'Development session';

  const OBSERVATIONS_DETAILED: ObservationDetailed[] = buildObservationsWithAnchors(
    observations,
    data.SPEC_FOLDER || folderName
  );

  const sessionId: string = generateSessionId();
  const channel: string = getChannel();
  const createdAtEpoch: number = Math.floor(Date.now() / 1000);

  let SPEC_FILES: SpecFileEntry[] = [];
  const activeSpecsDir = findActiveSpecsDir() || path.join(CONFIG.PROJECT_ROOT, 'specs');
  // Backfill SPEC_FOLDER from CLI-known folder name (spec 013 Phase 0)
  if (!data.SPEC_FOLDER && folderName) {
    data.SPEC_FOLDER = folderName;
  }
  // F-03: Path traversal guard with canonical path resolution
  let specFolderPath: string | null = null;
  if (data.SPEC_FOLDER) {
    const candidate = path.resolve(activeSpecsDir, data.SPEC_FOLDER);
    const boundary = path.resolve(activeSpecsDir);
    try {
      const realCandidate = fsSync.realpathSync(candidate);
      const realBoundary = fsSync.realpathSync(boundary);
      if (realCandidate === realBoundary || realCandidate.startsWith(realBoundary + path.sep)) {
        specFolderPath = candidate;
      }
    } catch {
      // Directory doesn't exist yet — fall back to resolved path check
      if (candidate === boundary || candidate.startsWith(boundary + path.sep)) {
        specFolderPath = candidate;
      }
    }
  }

  if (specFolderPath) {
    try {
      SPEC_FILES = await detectRelatedDocs(specFolderPath) as SpecFileEntry[];
    } catch (docError: unknown) {
      const errMsg = docError instanceof Error ? docError.message : String(docError);
      console.warn(`   Warning: Could not detect related docs: ${errMsg}`);
      SPEC_FILES = [];
    }
  }

  const implementationGuide: ImplementationGuideData = buildImplementationGuideData(
    observations, FILES, folderName
  );

  const { projectPhase, activeFile, lastAction, nextAction, blockers, fileProgress } =
    buildProjectStateSnapshot({
      toolCounts,
      observations,
      messageCount,
      FILES: FILES as FileEntry[],
      SPEC_FILES,
      specFolderPath,
      recentContext: data.recentContext
    });

  const expiresAtEpoch: number = calculateExpiryEpoch(importanceTier, createdAtEpoch);

  const preflightPostflightData = extractPreflightPostflightData(data);

  const continueSessionData = buildContinueSessionData({
    observations,
    userPrompts,
    toolCounts,
    recentContext: data.recentContext,
    FILES,
    SPEC_FILES,
    summary: SUMMARY,
    projectPhase,
    lastAction,
    nextAction,
    blockers,
    duration,
    decisionCount
  });

  return {
    TITLE: path.basename(folderName).replace(/^\d{3}-/, '').replace(/-/g, ' '),
    DATE: dateOnly,
    TIME: timeOnly,
    SPEC_FOLDER: folderName,
    DURATION: duration,
    SUMMARY,
    FILES: FILES.length > 0 ? FILES : [],
    HAS_FILES: FILES.length > 0,
    FILE_COUNT: FILES.length,
    OUTCOMES: OUTCOMES.length > 0 ? OUTCOMES : [{ OUTCOME: 'Session in progress' }],
    TOOL_COUNT,
    MESSAGE_COUNT: messageCount,
    QUICK_SUMMARY: quickSummary,
    SKILL_VERSION: CONFIG.SKILL_VERSION,
    OBSERVATIONS: OBSERVATIONS_DETAILED,
    HAS_OBSERVATIONS: OBSERVATIONS_DETAILED.length > 0,
    SPEC_FILES,
    HAS_SPEC_FILES: SPEC_FILES.length > 0,
    ...implementationGuide,
    SESSION_ID: sessionId,
    CHANNEL: channel,
    IMPORTANCE_TIER: importanceTier,
    CONTEXT_TYPE: contextType,
    CREATED_AT_EPOCH: createdAtEpoch,
    LAST_ACCESSED_EPOCH: createdAtEpoch,
    EXPIRES_AT_EPOCH: expiresAtEpoch,
    TOOL_COUNTS: toolCounts,
    DECISION_COUNT: decisionCount,
    ACCESS_COUNT: 1,
    LAST_SEARCH_QUERY: '',
    RELEVANCE_BOOST: 1.0,
    PROJECT_PHASE: projectPhase,
    ACTIVE_FILE: activeFile,
    LAST_ACTION: lastAction,
    NEXT_ACTION: nextAction,
    BLOCKERS: blockers,
    FILE_PROGRESS: fileProgress,
    HAS_FILE_PROGRESS: fileProgress.length > 0,
    ...preflightPostflightData,
    ...continueSessionData
  };
}

/* ───────────────────────────────────────────────────────────────
   5. EXPORTS
------------------------------------------------------------------*/

export {
  collectSessionData,
  shouldAutoSave,
  extractPreflightPostflightData,
  calculateLearningIndex,
  getScoreAssessment,
  getTrendIndicator,
  generateLearningSummary,
  buildContinueSessionData,
  determineSessionStatus,
  estimateCompletionPercent,
  extractPendingTasks,
  generateContextSummary,
  generateResumeContext,
};
