// ---------------------------------------------------------------
// MODULE: FolderDetector
// ---------------------------------------------------------------
// Detects, lists, and resolves spec folders with interactive selection and alignment scoring
// ---------------------------------------------------------------

// Node stdlib
import * as fs from 'fs/promises';
import * as path from 'path';

// External packages
import Database from 'better-sqlite3';

// Internal modules
import { DB_PATH } from '@spec-kit/shared/paths';
import { promptUser, promptUserChoice } from '../utils/prompt-utils';
import { CONFIG, findActiveSpecsDir, getAllExistingSpecsDirs, SPEC_FOLDER_PATTERN, findChildFolderAsync } from '../core';
import {
  ALIGNMENT_CONFIG,
  isArchiveFolder,
  extractConversationTopics,
  calculateAlignmentScore,
  validateContentAlignment,
  validateFolderAlignment,
} from './alignment-validator';
import type { CollectedDataForAlignment } from './alignment-validator';

/* -----------------------------------------------------------------
   1. INTERFACES
------------------------------------------------------------------*/

interface SessionLearningRow {
  spec_folder?: unknown;
  created_at?: unknown;
  updated_at?: unknown;
}

interface FolderQualityAssessment {
  score: number;
  label: 'active' | 'scratch' | 'test-fixture' | 'archive';
  reasons: string[];
  isArchive: boolean;
  isTestFixture: boolean;
  isScratch: boolean;
}

interface SessionCandidate {
  path: string;
  canonicalKey: string;
  quality: FolderQualityAssessment;
  recencyMs: number;
  recencyIso: string;
  sourceSpecFolder: string;
}

interface AutoDetectCandidate {
  path: string;
  canonicalKey: string;
  relativePath: string;
  folderName: string;
  quality: FolderQualityAssessment;
  depth: number;
  idVector: number[];
  mtimeMs: number;
}

interface CandidateConfidence {
  lowConfidence: boolean;
  reason: string;
}

interface SessionCandidateTestInput {
  path: string;
  recencyMs: number;
  canonicalKey?: string;
}

interface AutoCandidateTestInput {
  path: string;
  relativePath?: string;
  mtimeMs: number;
  canonicalKey?: string;
}

function getSpecFolderFromCollectedData(collectedData: CollectedDataForAlignment | null): string | null {
  if (!collectedData || typeof collectedData !== 'object') {
    return null;
  }

  const specFolder = (collectedData as { SPEC_FOLDER?: unknown }).SPEC_FOLDER;
  return typeof specFolder === 'string' && specFolder.trim().length > 0
    ? specFolder
    : null;
}

function getSpecFolderFromSessionRow(row: unknown): string | null {
  if (!row || typeof row !== 'object') {
    return null;
  }

  const specFolder = (row as { spec_folder?: unknown }).spec_folder;
  return typeof specFolder === 'string' && specFolder.trim().length > 0
    ? specFolder
    : null;
}

/* -----------------------------------------------------------------
   2. HELPER FUNCTIONS
------------------------------------------------------------------*/

const TEST_FIXTURE_MARKERS: string[] = ['test', 'tests', 'fixture', 'fixtures'];
const SCRATCH_MARKERS: string[] = ['scratch', 'tmp', 'temp'];
const SESSION_LOOKBACK_HOURS = 24;
const SESSION_ROW_LIMIT = 25;
const LOW_CONFIDENCE_RECENCY_WINDOW_MS = 10 * 60 * 1000;

function filterArchiveFolders(folders: string[]): string[] {
  return folders.filter((folder) => !isArchiveFolder(folder));
}

function isInteractiveTTY(): boolean {
  return Boolean(process.stdout.isTTY && process.stdin.isTTY && process.env.AUTO_SAVE_MODE !== 'true');
}

function normalizeSlashes(value: string): string {
  return value.replace(/\\/g, '/');
}

function splitPathSegments(value: string): string[] {
  return normalizeSlashes(value).split('/').filter(Boolean);
}

function parseTimestamp(value: unknown): number {
  if (typeof value !== 'string' || value.trim().length === 0) {
    return 0;
  }

  const raw = value.trim();
  const normalized = raw.includes('T') ? raw : raw.replace(' ', 'T');
  const withZone = /[zZ]$|[+\-]\d{2}:\d{2}$/.test(normalized) ? normalized : `${normalized}Z`;
  const parsed = Date.parse(withZone);
  return Number.isFinite(parsed) ? parsed : 0;
}

function getSessionTimestamp(row: SessionLearningRow): number {
  return parseTimestamp(row.created_at) || parseTimestamp(row.updated_at);
}

function isPathWithin(parentPath: string, childPath: string): boolean {
  const relative = path.relative(path.resolve(parentPath), path.resolve(childPath));
  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
}

function isNotFoundFsError(error: unknown): boolean {
  const nodeErr = error as NodeJS.ErrnoException;
  return nodeErr?.code === 'ENOENT' || nodeErr?.code === 'ENOTDIR';
}

function isUnderApprovedSpecsRoots(specPath: string): boolean {
  const approvedRoots = [
    path.join(CONFIG.PROJECT_ROOT, 'specs'),
    path.join(CONFIG.PROJECT_ROOT, '.opencode', 'specs'),
  ];
  return approvedRoots.some((root) => isPathWithin(root, specPath));
}

function normalizeSpecReferenceForLookup(specFolderRef: string): string {
  const normalized = normalizeSlashes(specFolderRef.trim()).replace(/^\.\//, '');
  if (normalized.startsWith('.opencode/specs/')) {
    return normalized.slice('.opencode/specs/'.length);
  }
  if (normalized.startsWith('specs/')) {
    return normalized.slice('specs/'.length);
  }
  return normalized;
}

function getRelativePathToSpecsRoot(specPath: string, specsDirs: string[]): string | null {
  for (const specsDir of specsDirs) {
    if (!isPathWithin(specsDir, specPath)) continue;
    const relative = normalizeSlashes(path.relative(specsDir, specPath));
    if (relative.length > 0 && !relative.startsWith('..')) {
      return relative;
    }
  }
  return null;
}

function getCanonicalSpecKey(specPath: string, specsDirs: string[]): string {
  const relative = getRelativePathToSpecsRoot(specPath, specsDirs);
  return relative || path.resolve(specPath);
}

function getRootPreferenceIndex(specPath: string, specsDirs: string[]): number {
  for (let index = 0; index < specsDirs.length; index += 1) {
    if (isPathWithin(specsDirs[index], specPath)) {
      return index;
    }
  }
  return Number.MAX_SAFE_INTEGER;
}

function shouldPreferPath(currentPath: string, candidatePath: string, specsDirs: string[]): boolean {
  const currentIndex = getRootPreferenceIndex(currentPath, specsDirs);
  const candidateIndex = getRootPreferenceIndex(candidatePath, specsDirs);

  if (candidateIndex !== currentIndex) {
    return candidateIndex < currentIndex;
  }

  return path.resolve(candidatePath).localeCompare(path.resolve(currentPath)) < 0;
}

function getPathTokens(relativePath: string): string[] {
  return splitPathSegments(relativePath)
    .flatMap((segment) => segment.toLowerCase().split(/[^a-z0-9]+/))
    .filter(Boolean);
}

function assessFolderQuality(relativePath: string): FolderQualityAssessment {
  const segments = splitPathSegments(relativePath);
  const tokens = getPathTokens(relativePath);

  const archiveHit = segments.some((segment) => isArchiveFolder(segment));
  const testFixtureHit = TEST_FIXTURE_MARKERS.some((marker) => tokens.includes(marker));
  const scratchHit = SCRATCH_MARKERS.some((marker) => tokens.includes(marker));

  let score = 100;
  const reasons: string[] = [];

  if (archiveHit) {
    score -= 90;
    reasons.push('archive');
  }
  if (testFixtureHit) {
    score -= 45;
    reasons.push('test/fixture');
  }
  if (scratchHit) {
    score -= 30;
    reasons.push('scratch');
  }

  const clampedScore = Math.max(0, score);
  const label: FolderQualityAssessment['label'] =
    archiveHit ? 'archive'
      : testFixtureHit ? 'test-fixture'
        : scratchHit ? 'scratch'
          : 'active';

  return {
    score: clampedScore,
    label,
    reasons,
    isArchive: archiveHit,
    isTestFixture: testFixtureHit,
    isScratch: scratchHit,
  };
}

function parseFolderIdVector(relativePath: string): number[] {
  return splitPathSegments(relativePath).map((segment) => {
    const match = segment.match(/^(\d{3})-/);
    return match ? Number.parseInt(match[1], 10) : -1;
  });
}

function compareIdVectorsDesc(a: number[], b: number[]): number {
  const maxLength = Math.max(a.length, b.length);
  for (let index = 0; index < maxLength; index += 1) {
    const aValue = a[index] ?? -1;
    const bValue = b[index] ?? -1;
    if (aValue !== bValue) {
      return bValue - aValue;
    }
  }
  return 0;
}

function pickPreferredCandidates<T extends { quality: FolderQualityAssessment }>(candidates: T[]): T[] {
  const active = candidates.filter((candidate) =>
    !candidate.quality.isArchive &&
    !candidate.quality.isTestFixture &&
    !candidate.quality.isScratch
  );
  if (active.length > 0) {
    return active;
  }

  const nonArchiveNonFixture = candidates.filter((candidate) =>
    !candidate.quality.isArchive &&
    !candidate.quality.isTestFixture
  );
  if (nonArchiveNonFixture.length > 0) {
    return nonArchiveNonFixture;
  }

  const nonArchive = candidates.filter((candidate) => !candidate.quality.isArchive);
  if (nonArchive.length > 0) {
    return nonArchive;
  }

  return candidates;
}

function compareSessionCandidates(a: SessionCandidate, b: SessionCandidate): number {
  if (a.quality.score !== b.quality.score) {
    return b.quality.score - a.quality.score;
  }
  if (a.recencyMs !== b.recencyMs) {
    return b.recencyMs - a.recencyMs;
  }
  return a.canonicalKey.localeCompare(b.canonicalKey);
}

function rankSessionCandidates(candidates: SessionCandidate[]): SessionCandidate[] {
  return [...pickPreferredCandidates(candidates)].sort(compareSessionCandidates);
}

function assessSessionConfidence(candidates: SessionCandidate[]): CandidateConfidence {
  if (candidates.length === 0) {
    return { lowConfidence: true, reason: 'no candidates resolved from session learning rows' };
  }

  const top = candidates[0];
  if (top.quality.label !== 'active') {
    return { lowConfidence: true, reason: `top candidate quality is "${top.quality.label}"` };
  }

  if (candidates.length === 1) {
    return { lowConfidence: false, reason: 'single active candidate' };
  }

  const second = candidates[1];
  const qualityGap = top.quality.score - second.quality.score;
  const recencyGapMs = Math.abs(top.recencyMs - second.recencyMs);
  if (qualityGap <= 0 && recencyGapMs <= LOW_CONFIDENCE_RECENCY_WINDOW_MS) {
    return { lowConfidence: true, reason: 'top candidates tie on quality with near-identical recency' };
  }

  if (qualityGap < 10 && recencyGapMs <= LOW_CONFIDENCE_RECENCY_WINDOW_MS) {
    return { lowConfidence: true, reason: 'top candidates have a narrow score gap' };
  }

  return { lowConfidence: false, reason: 'clear ranked winner' };
}

function compareAutoDetectCandidates(a: AutoDetectCandidate, b: AutoDetectCandidate): number {
  if (a.quality.score !== b.quality.score) {
    return b.quality.score - a.quality.score;
  }
  if (a.depth !== b.depth) {
    return b.depth - a.depth;
  }
  const idCompare = compareIdVectorsDesc(a.idVector, b.idVector);
  if (idCompare !== 0) {
    return idCompare;
  }
  if (a.mtimeMs !== b.mtimeMs) {
    return b.mtimeMs - a.mtimeMs;
  }
  return a.canonicalKey.localeCompare(b.canonicalKey);
}

function rankAutoDetectCandidates(candidates: AutoDetectCandidate[]): AutoDetectCandidate[] {
  return [...pickPreferredCandidates(candidates)].sort(compareAutoDetectCandidates);
}

function assessAutoDetectConfidence(candidates: AutoDetectCandidate[]): CandidateConfidence {
  if (candidates.length === 0) {
    return { lowConfidence: true, reason: 'no auto-detect candidates available' };
  }

  const top = candidates[0];
  if (top.quality.label !== 'active') {
    return { lowConfidence: true, reason: `top auto-detect candidate quality is "${top.quality.label}"` };
  }

  if (candidates.length < 2) {
    return { lowConfidence: false, reason: 'single active auto-detect candidate' };
  }

  const second = candidates[1];
  const sameQuality = top.quality.score === second.quality.score;
  const sameDepth = top.depth === second.depth;
  const sameIdVector = compareIdVectorsDesc(top.idVector, second.idVector) === 0;

  if (sameQuality && sameDepth && sameIdVector) {
    return { lowConfidence: true, reason: 'top auto-detect candidates tie except for recency/path tiebreakers' };
  }

  return { lowConfidence: false, reason: 'clear ranked winner' };
}

function formatCandidatePathForLog(candidatePath: string, specsDirs: string[]): string {
  for (const specsDir of specsDirs) {
    if (!isPathWithin(specsDir, candidatePath)) continue;

    const rootRelative = normalizeSlashes(path.relative(CONFIG.PROJECT_ROOT, specsDir));
    const folderRelative = normalizeSlashes(path.relative(specsDir, candidatePath));
    if (!folderRelative.startsWith('..')) {
      return `${rootRelative}/${folderRelative}`;
    }
  }

  return normalizeSlashes(path.relative(CONFIG.PROJECT_ROOT, candidatePath));
}

function logSelectionRationale(
  priorityLabel: string,
  candidatePath: string,
  specsDirs: string[],
  quality: FolderQualityAssessment,
  reason: string
): void {
  console.log(`   [${priorityLabel}] Selected ${formatCandidatePathForLog(candidatePath, specsDirs)} | quality=${quality.label} | ${reason}`);
}

async function pathIsDirectory(candidatePath: string): Promise<boolean> {
  try {
    const stat = await fs.stat(candidatePath);
    return stat.isDirectory();
  } catch (_error: unknown) {
    if (_error instanceof Error) {
      return false;
    }
    return false;
  }
}

async function collectSpecParentCache(specsDirs: string[]): Promise<Map<string, string[]>> {
  const parentCache = new Map<string, string[]>();

  for (const specsDir of specsDirs) {
    try {
      const entries = await fs.readdir(specsDir);
      const parentFolders: string[] = [];

      for (const entry of entries) {
        if (!SPEC_FOLDER_PATTERN.test(entry)) continue;
        const entryPath = path.join(specsDir, entry);
        if (await pathIsDirectory(entryPath)) {
          parentFolders.push(entry);
        }
      }

      parentCache.set(specsDir, parentFolders);
    } catch (_error: unknown) {
      if (_error instanceof Error) {
        parentCache.set(specsDir, []);
        continue;
      }
      parentCache.set(specsDir, []);
    }
  }

  return parentCache;
}

async function resolveSessionSpecFolderPaths(
  rawSpecFolder: string,
  specsDirs: string[],
  parentCache: Map<string, string[]>
): Promise<string[]> {
  const resolvedPaths = new Set<string>();
  const trimmed = rawSpecFolder.trim();
  if (trimmed.length === 0) {
    return [];
  }

  const addCandidate = async (candidatePath: string): Promise<void> => {
    if (await pathIsDirectory(candidatePath)) {
      resolvedPaths.add(path.resolve(candidatePath));
    }
  };

  if (path.isAbsolute(trimmed)) {
    await addCandidate(trimmed);
    const relativeToSpecs = getRelativePathToSpecsRoot(trimmed, specsDirs);
    if (relativeToSpecs) {
      for (const specsDir of specsDirs) {
        await addCandidate(path.join(specsDir, relativeToSpecs));
      }
    }
  }

  const normalizedReference = normalizeSpecReferenceForLookup(trimmed);
  if (normalizedReference.length === 0) {
    return Array.from(resolvedPaths);
  }

  const segments = splitPathSegments(normalizedReference);
  if (segments.length === 0) {
    return Array.from(resolvedPaths);
  }

  if (segments.length === 1 && SPEC_FOLDER_PATTERN.test(segments[0])) {
    const childName = segments[0];

    for (const specsDir of specsDirs) {
      await addCandidate(path.join(specsDir, childName));
    }

    for (const specsDir of specsDirs) {
      const parents = parentCache.get(specsDir) || [];
      for (const parentFolder of parents) {
        await addCandidate(path.join(specsDir, parentFolder, childName));
      }
    }

    return Array.from(resolvedPaths);
  }

  if (
    segments.length >= 2 &&
    SPEC_FOLDER_PATTERN.test(segments[segments.length - 1])
  ) {
    for (const specsDir of specsDirs) {
      await addCandidate(path.join(specsDir, ...segments));
    }
    return Array.from(resolvedPaths);
  }

  for (const specsDir of specsDirs) {
    await addCandidate(path.join(specsDir, normalizedReference));
  }

  return Array.from(resolvedPaths);
}

async function buildSessionCandidates(
  rows: unknown[],
  specsDirs: string[]
): Promise<SessionCandidate[]> {
  const parentCache = await collectSpecParentCache(specsDirs);
  const byCanonicalKey = new Map<string, SessionCandidate>();

  for (const row of rows) {
    const specFolder = getSpecFolderFromSessionRow(row);
    if (!specFolder) continue;
    const trimmedSpecFolder = specFolder.trim();
    // AI: Fix F6 — validate session-learning paths against approved roots.
    if (path.isAbsolute(trimmedSpecFolder)) {
      const resolvedAbsoluteSpecFolder = path.resolve(trimmedSpecFolder);
      if (!isUnderApprovedSpecsRoots(resolvedAbsoluteSpecFolder)) {
        console.warn(
          `[folder-detector] Skipping session-learning row with unapproved absolute spec_folder: ${resolvedAbsoluteSpecFolder}`
        );
        continue;
      }
    }

    const typedRow = (row || {}) as SessionLearningRow;
    const recencyMs = getSessionTimestamp(typedRow);
    const recencyIso = recencyMs > 0 ? new Date(recencyMs).toISOString() : 'unknown';
    const resolvedPaths = await resolveSessionSpecFolderPaths(trimmedSpecFolder, specsDirs, parentCache);

    for (const resolvedPath of resolvedPaths) {
      const canonicalKey = getCanonicalSpecKey(resolvedPath, specsDirs);
      const qualityPath = getRelativePathToSpecsRoot(resolvedPath, specsDirs) || path.basename(resolvedPath);
      const quality = assessFolderQuality(qualityPath);

      const existing = byCanonicalKey.get(canonicalKey);
      if (!existing) {
        byCanonicalKey.set(canonicalKey, {
          path: resolvedPath,
          canonicalKey,
          quality,
          recencyMs,
          recencyIso,
          sourceSpecFolder: specFolder,
        });
        continue;
      }

      if (shouldPreferPath(existing.path, resolvedPath, specsDirs)) {
        existing.path = resolvedPath;
      }
      if (recencyMs > existing.recencyMs) {
        existing.recencyMs = recencyMs;
        existing.recencyIso = recencyIso;
        existing.sourceSpecFolder = specFolder;
      }
    }
  }

  return Array.from(byCanonicalKey.values());
}

async function promptSessionCandidateSelection(
  rankedCandidates: SessionCandidate[],
  specsDirs: string[],
  reason: string
): Promise<SessionCandidate | null> {
  const shortlist = rankedCandidates.slice(0, Math.min(3, rankedCandidates.length));
  console.log(`   [Priority 2.5] Low-confidence session match: ${reason}`);
  shortlist.forEach((candidate, index) => {
    const display = formatCandidatePathForLog(candidate.path, specsDirs);
    console.log(`   ${index + 1}. ${display} (quality=${candidate.quality.label}, recency=${candidate.recencyIso})`);
  });
  console.log(`   ${shortlist.length + 1}. Skip session-learning selection and continue\n`);

  const choice = await promptUserChoice(
    `   Select target folder (1-${shortlist.length + 1}): `,
    shortlist.length + 1
  );
  if (choice <= shortlist.length) {
    return shortlist[choice - 1];
  }
  return null;
}

async function collectAutoDetectCandidates(specsDirs: string[]): Promise<AutoDetectCandidate[]> {
  const byCanonicalKey = new Map<string, AutoDetectCandidate>();

  const upsertCandidate = (folderPath: string, mtimeMs: number): void => {
    const canonicalKey = getCanonicalSpecKey(folderPath, specsDirs);
    const relativePath = getRelativePathToSpecsRoot(folderPath, specsDirs) || path.basename(folderPath);
    const quality = assessFolderQuality(relativePath);
    const candidate: AutoDetectCandidate = {
      path: folderPath,
      canonicalKey,
      relativePath,
      folderName: path.basename(folderPath),
      quality,
      depth: splitPathSegments(relativePath).length,
      idVector: parseFolderIdVector(relativePath),
      mtimeMs,
    };

    const existing = byCanonicalKey.get(canonicalKey);
    if (!existing) {
      byCanonicalKey.set(canonicalKey, candidate);
      return;
    }

    if (mtimeMs > existing.mtimeMs) {
      existing.mtimeMs = mtimeMs;
    }
    if (shouldPreferPath(existing.path, folderPath, specsDirs)) {
      existing.path = folderPath;
    }
  };

  for (const specsDir of specsDirs) {
    let topEntries: string[] = [];
    try {
      topEntries = await fs.readdir(specsDir);
    } catch (_error: unknown) {
      if (_error instanceof Error) {
        continue;
      }
      continue;
    }

    for (const topFolder of topEntries) {
      if (!/^\d{3}-/.test(topFolder)) continue;
      const topPath = path.join(specsDir, topFolder);

      let topStat;
      try {
        topStat = await fs.stat(topPath);
      } catch (_error: unknown) {
        if (_error instanceof Error) {
          continue;
        }
        continue;
      }
      if (!topStat.isDirectory()) continue;

      upsertCandidate(topPath, topStat.mtimeMs);

      let childEntries: string[] = [];
      try {
        childEntries = await fs.readdir(topPath);
      } catch (_error: unknown) {
      if (_error instanceof Error) {
        void _error.message;
      }
        continue;
      }

      for (const childFolder of childEntries) {
        if (!SPEC_FOLDER_PATTERN.test(childFolder)) continue;
        const childPath = path.join(topPath, childFolder);
        try {
          const childStat = await fs.stat(childPath);
          if (childStat.isDirectory()) {
            upsertCandidate(childPath, childStat.mtimeMs);
          }
        } catch (_error: unknown) {
          if (_error instanceof Error) {
            // Unreadable child, skip and continue scanning.
          }
        }
      }
    }
  }

  return Array.from(byCanonicalKey.values());
}

async function promptAutoDetectCandidateSelection(
  rankedCandidates: AutoDetectCandidate[],
  specsDirs: string[],
  reason: string
): Promise<AutoDetectCandidate> {
  const shortlist = rankedCandidates.slice(0, Math.min(5, rankedCandidates.length));
  console.log(`   [Priority 4] Low-confidence auto-detect: ${reason}`);
  shortlist.forEach((candidate, index) => {
    const display = formatCandidatePathForLog(candidate.path, specsDirs);
    console.log(`   ${index + 1}. ${display} (quality=${candidate.quality.label}, depth=${candidate.depth})`);
  });
  console.log('');

  const choice = await promptUserChoice(
    `   Confirm target folder (1-${shortlist.length}): `,
    shortlist.length
  );
  return shortlist[choice - 1];
}

function buildSessionCandidatesForTesting(inputs: SessionCandidateTestInput[]): SessionCandidate[] {
  return inputs.map((input, index) => {
    const relative = normalizeSpecReferenceForLookup(input.path);
    return {
      path: input.path,
      canonicalKey: input.canonicalKey || `candidate-${index}`,
      quality: assessFolderQuality(relative),
      recencyMs: input.recencyMs,
      recencyIso: input.recencyMs > 0 ? new Date(input.recencyMs).toISOString() : 'unknown',
      sourceSpecFolder: input.path,
    };
  });
}

function buildAutoCandidatesForTesting(inputs: AutoCandidateTestInput[]): AutoDetectCandidate[] {
  return inputs.map((input, index) => {
    const relativePath = input.relativePath || normalizeSpecReferenceForLookup(input.path);
    return {
      path: input.path,
      canonicalKey: input.canonicalKey || `candidate-${index}`,
      relativePath,
      folderName: path.basename(relativePath),
      quality: assessFolderQuality(relativePath),
      depth: splitPathSegments(relativePath).length,
      idVector: parseFolderIdVector(relativePath),
      mtimeMs: input.mtimeMs,
    };
  });
}

const TEST_HELPERS = {
  normalizeSpecReferenceForLookup,
  assessFolderQuality,
  rankSessionCandidates: (inputs: SessionCandidateTestInput[]) => rankSessionCandidates(buildSessionCandidatesForTesting(inputs)),
  rankAutoDetectCandidates: (inputs: AutoCandidateTestInput[]) => rankAutoDetectCandidates(buildAutoCandidatesForTesting(inputs)),
  assessSessionConfidence: (inputs: SessionCandidateTestInput[]) => assessSessionConfidence(rankSessionCandidates(buildSessionCandidatesForTesting(inputs))),
  assessAutoDetectConfidence: (inputs: AutoCandidateTestInput[]) => assessAutoDetectConfidence(rankAutoDetectCandidates(buildAutoCandidatesForTesting(inputs))),
  decideSessionAction: (inputs: SessionCandidateTestInput[], interactive: boolean) => {
    const ranked = rankSessionCandidates(buildSessionCandidatesForTesting(inputs));
    const confidence = assessSessionConfidence(ranked);
    if (!confidence.lowConfidence) {
      return { action: 'select', reason: confidence.reason };
    }
    return { action: interactive ? 'confirm' : 'skip', reason: confidence.reason };
  },
  decideAutoDetectAction: (inputs: AutoCandidateTestInput[], interactive: boolean) => {
    const ranked = rankAutoDetectCandidates(buildAutoCandidatesForTesting(inputs));
    const confidence = assessAutoDetectConfidence(ranked);
    if (!confidence.lowConfidence) {
      return { action: 'select', reason: confidence.reason };
    }
    return { action: interactive ? 'confirm' : 'fallback', reason: confidence.reason };
  },
};

/** Print the standard "no spec folder found" error message. */
function printNoSpecFolderError(commandName: string = 'memory'): void {
  console.error('\n Cannot save context: No spec folder found\n');
  console.error(`${commandName} requires a spec folder to save memory documentation.`);
  console.error('Every conversation with file changes must have a spec folder per conversation-documentation rules.\n');
  console.error('Please create a spec folder first:');
  console.error('  mkdir -p specs/###-feature-name/');
  console.error('  OR: mkdir -p .opencode/specs/###-feature-name/\n');
  console.error(`Then re-run ${commandName}.\n`);
}

/* -----------------------------------------------------------------
   3. FOLDER DETECTION
------------------------------------------------------------------*/

async function detectSpecFolder(
  collectedData: CollectedDataForAlignment | null = null,
  options: { specFolderArg?: string | null } = {},
): Promise<string> {
  const cwd = process.cwd();
  const explicitSpecFolderArg = options.specFolderArg !== undefined
    ? options.specFolderArg
    : CONFIG.SPEC_FOLDER_ARG;

  const existingSpecsDirs = getAllExistingSpecsDirs();
  const specsDirsForDetection = existingSpecsDirs.length > 0 ? existingSpecsDirs : [];
  if (existingSpecsDirs.length > 1) {
    console.log('   Multiple specs directories found; deterministic ranking will evaluate aliases across all roots.');
  }

  const specsDir = findActiveSpecsDir();
  const defaultSpecsDir = path.join(CONFIG.PROJECT_ROOT, 'specs');

  // Priority 1: CLI argument
  if (explicitSpecFolderArg) {
    const specArg: string = explicitSpecFolderArg;
    const specFolderPath: string = path.isAbsolute(specArg)
      ? specArg
      : specArg.startsWith('specs/')
        ? path.join(CONFIG.PROJECT_ROOT, specArg)
        : specArg.startsWith('.opencode/specs/')
          ? path.join(CONFIG.PROJECT_ROOT, specArg)
          : path.join(specsDir || defaultSpecsDir, specArg);

    try {
      if (!isUnderApprovedSpecsRoots(specFolderPath)) {
        throw new Error(
          `Spec folder path must be under specs/ or .opencode/specs/: ${specArg}`
        );
      }

      await fs.access(specFolderPath);
      console.log(`   Using spec folder from CLI argument: ${path.basename(specFolderPath)}`);

      if (collectedData) {
        const folderName = path.basename(specFolderPath);
        const alignmentResult = await validateContentAlignment(
          collectedData, folderName, specsDir || defaultSpecsDir
        );

        if (alignmentResult.useAlternative && alignmentResult.selectedFolder) {
          console.log(`   Note: "${alignmentResult.selectedFolder}" may be a better match, but respecting explicit CLI argument`);
        }
      }

      return specFolderPath;
    } catch (error: unknown) {
      if (!isNotFoundFsError(error)) {
        throw error;
      }

      // Try nested multi-segment resolution (e.g., "005-memory/002-upgrade" or "02--cat/022-parent/008-child")
      const argParts = specArg.split('/');
      if (argParts.length >= 2 && SPEC_FOLDER_PATTERN.test(argParts[argParts.length - 1])) {
        for (const dir of existingSpecsDirs) {
          const nestedPath = path.join(dir, ...argParts);
          try {
            await fs.access(nestedPath);
            console.log(`   Using spec folder from CLI argument (nested): ${argParts.join('/')}`);
            return nestedPath;
          } catch (_error: unknown) {
            if (_error instanceof Error) {
              // Not found in this specs dir, continue searching
            }
          }
        }
      }

      // Bare child search across all parents
      const childResult = await findChildFolderAsync(specArg);
      if (childResult) {
        return childResult;
      }

      console.error(`\n Specified spec folder not found: ${explicitSpecFolderArg}\n`);
      console.error('Expected format: ###-feature-name (e.g., "122-skill-standardization")\n');

      try {
        const searchDir = specsDir || defaultSpecsDir;
        const entries = await fs.readdir(searchDir);
        const available = entries
          .filter((name) => /^\d{3}-/.test(name))
          .filter((name) => !isArchiveFolder(name))
          .sort()
          .reverse();

        if (available.length > 0) {
          console.error('Available spec folders:');
          available.slice(0, 10).forEach((folder) => {
            console.error(`  - ${folder}`);
          });
        }
      } catch (_error: unknown) {
        if (_error instanceof Error) {
          // Silently ignore if we can't read specs directory
        }
      }

      console.error('\nUsage: node generate-context.js [spec-folder-name] OR node generate-context.js <data-file> [spec-folder]\n');
      throw new Error(`Spec folder not found: ${explicitSpecFolderArg}`);
    }
  }

  // Priority 2: JSON data field
  const specFolderFromData = getSpecFolderFromCollectedData(collectedData);
  if (specFolderFromData && collectedData) {
    const activeDir = specsDir || defaultSpecsDir;
    const specFolderPath = path.isAbsolute(specFolderFromData)
      ? specFolderFromData
      : specFolderFromData.startsWith('specs/')
        ? path.join(CONFIG.PROJECT_ROOT, specFolderFromData)
        : specFolderFromData.startsWith('.opencode/specs/')
          ? path.join(CONFIG.PROJECT_ROOT, specFolderFromData)
          : path.join(activeDir, specFolderFromData);
    const alignmentFolderName = path.basename(specFolderPath);
    const alignmentBaseDir = path.dirname(specFolderPath);

    try {
      if (!isUnderApprovedSpecsRoots(specFolderPath)) {
        throw new Error(
          `Spec folder path must be under specs/ or .opencode/specs/: ${specFolderFromData}`
        );
      }

      await fs.access(specFolderPath);
      console.log(`   Using spec folder from data: ${specFolderFromData}`);
      const alignmentResult = await validateFolderAlignment(collectedData, alignmentFolderName, alignmentBaseDir);
      if (alignmentResult.proceed) {
        if (alignmentResult.useAlternative) {
          if (!alignmentResult.selectedFolder) {
            throw new Error('Expected selectedFolder to be set when useAlternative is true');
          }
          return path.join(alignmentBaseDir, alignmentResult.selectedFolder);
        }
        return specFolderPath;
      }
    } catch (error: unknown) {
      if (!isNotFoundFsError(error)) {
        throw error;
      }

      // Try nested multi-segment resolution for JSON data value
      const dataParts = specFolderFromData.split('/');
      if (dataParts.length >= 2 && SPEC_FOLDER_PATTERN.test(dataParts[dataParts.length - 1])) {
        for (const dir of existingSpecsDirs) {
          const nestedPath = path.join(dir, ...dataParts);
          try {
            await fs.access(nestedPath);
            console.log(`   Using spec folder from data (nested): ${dataParts.join('/')}`);

            if (collectedData) {
              const lastPart = dataParts[dataParts.length - 1];
              const parentDir = path.join(dir, ...dataParts.slice(0, -1));
              const alignmentResult = await validateFolderAlignment(collectedData, lastPart, parentDir);
              if (alignmentResult.proceed && alignmentResult.useAlternative && alignmentResult.selectedFolder) {
                const altPath = path.join(parentDir, alignmentResult.selectedFolder);
                try {
                  await fs.access(altPath);
                  return altPath;
                } catch (_error: unknown) {
                  if (_error instanceof Error) {
                    // Alternative not found as nested, use original
                  }
                }
              }
            }

            return nestedPath;
          } catch (nestedError: unknown) {
      if (nestedError instanceof Error) {
        void nestedError.message;
      }
            if (!isNotFoundFsError(nestedError)) {
              throw nestedError;
            }
            // Not found in this specs dir, continue searching
          }
        }
      }

      // Bare child search across all parents
      const childResult = await findChildFolderAsync(specFolderFromData);
      if (childResult) {
        return childResult;
      }

      console.warn(`   Spec folder from data not found: ${specFolderFromData}`);
    }
  }

  // Priority 2.5: Session learning DB lookup (most recent preflight spec folder)
  try {
    const db = new Database(DB_PATH, { readonly: true });
    try {
      const rows = db.prepare(
        `SELECT spec_folder, created_at, updated_at
         FROM session_learning
         WHERE created_at > datetime('now', '-' || ? || ' hours')
         ORDER BY created_at DESC
         LIMIT ?`
      ).all(SESSION_LOOKBACK_HOURS, SESSION_ROW_LIMIT) as unknown[];

      const sessionCandidates = await buildSessionCandidates(rows, specsDirsForDetection);
      const rankedSessionCandidates = rankSessionCandidates(sessionCandidates);

      if (rankedSessionCandidates.length > 0) {
        const confidence = assessSessionConfidence(rankedSessionCandidates);
        let selected: SessionCandidate | null = rankedSessionCandidates[0];

        if (confidence.lowConfidence) {
          if (isInteractiveTTY()) {
            const confirmed = await promptSessionCandidateSelection(
              rankedSessionCandidates,
              specsDirsForDetection,
              confidence.reason
            );
            if (confirmed) {
              selected = confirmed;
            } else {
              console.log('   [Priority 2.5] Session-learning selection skipped by user; falling through.');
              selected = null;
            }
          } else {
            console.warn(`   [Priority 2.5] Low-confidence session match (${confidence.reason}); falling through.`);
            selected = null;
          }
        }

        if (selected) {
          logSelectionRationale(
            'Priority 2.5',
            selected.path,
            specsDirsForDetection,
            selected.quality,
            `source=session_learning, recency=${selected.recencyIso}, reason=${confidence.reason}`
          );
          return selected.path;
        }
      }
    } finally {
      db.close();
    }
  } catch (err: unknown) {
    if (err instanceof Error && process.env.DEBUG) {
      console.debug(`   [Priority 2.5] Session learning lookup skipped: ${err.message}`);
    }

    // DB not available, table missing, or folder doesn't exist — fall through to next priority
    if (process.env.DEBUG && !(err instanceof Error)) {
      console.debug(`   [Priority 2.5] Session learning lookup skipped: ${String(err)}`);
    }
  }

  // Priority 3: Current working directory
  if (cwd.includes('/specs/') || cwd.includes('\\specs\\')) {
    const match = cwd.match(/(.*[\/\\](?:\.opencode[\/\\])?specs[\/\\][^\/\\]+)/);
    if (match) {
      return path.normalize(match[1]);
    }
  }

  // Priority 4: Auto-detect from specs directory
  const autoDetectSpecsDirs = specsDirsForDetection.length > 0
    ? specsDirsForDetection
    : (specsDir ? [specsDir] : []);

  if (autoDetectSpecsDirs.length === 0) {
    printNoSpecFolderError();
    throw new Error('No specs/ directory found');
  }

  try {
    const autoDetectCandidates = await collectAutoDetectCandidates(autoDetectSpecsDirs);
    const rankedAutoDetectCandidates = rankAutoDetectCandidates(autoDetectCandidates);

    if (rankedAutoDetectCandidates.length === 0) {
      printNoSpecFolderError();
      throw new Error('No spec folders found in specs/ directory');
    }

    let selectedAutoCandidate = rankedAutoDetectCandidates[0];
    const autoConfidence = assessAutoDetectConfidence(rankedAutoDetectCandidates);

    if (autoConfidence.lowConfidence) {
      if (isInteractiveTTY()) {
        selectedAutoCandidate = await promptAutoDetectCandidateSelection(
          rankedAutoDetectCandidates,
          autoDetectSpecsDirs,
          autoConfidence.reason
        );
      } else {
        console.warn(`   [Priority 4] Low-confidence auto-detect (${autoConfidence.reason}); using deterministic fallback.`);
      }
    }

    logSelectionRationale(
      'Priority 4',
      selectedAutoCandidate.path,
      autoDetectSpecsDirs,
      selectedAutoCandidate.quality,
      `ranking=quality>depth>id>mtime, confidence=${autoConfidence.reason}`
    );

    if (!collectedData || rankedAutoDetectCandidates.length === 1 || process.env.AUTO_SAVE_MODE === 'true') {
      return selectedAutoCandidate.path;
    }

    const conversationTopics = extractConversationTopics(collectedData);
    const alignmentTarget = path.basename(selectedAutoCandidate.path);
    const alignmentScore = calculateAlignmentScore(conversationTopics, alignmentTarget);

    if (alignmentScore >= ALIGNMENT_CONFIG.THRESHOLD) {
      return selectedAutoCandidate.path;
    }

    if (!isInteractiveTTY()) {
      console.warn(`   [Priority 4] Alignment score ${alignmentScore}% below threshold; keeping deterministic fallback candidate.`);
      return selectedAutoCandidate.path;
    }

    console.log('\n   Conversation topic may not align with most recent spec folder');
    console.log(`   Selected: ${formatCandidatePathForLog(selectedAutoCandidate.path, autoDetectSpecsDirs)} (${alignmentScore}% match)\n`);

    const alternatives = rankedAutoDetectCandidates.slice(0, Math.min(5, rankedAutoDetectCandidates.length)).map((candidate) => ({
      candidate,
      score: calculateAlignmentScore(conversationTopics, path.basename(candidate.path))
    }));

    alternatives.sort((a, b) => b.score - a.score);

    console.log('   Alternative spec folders:');
    alternatives.forEach((alt, index) => {
      console.log(`   ${index + 1}. ${formatCandidatePathForLog(alt.candidate.path, autoDetectSpecsDirs)} (${alt.score}% match)`);
    });
    console.log(`   ${alternatives.length + 1}. Specify custom folder path\n`);

    const choice = await promptUserChoice(
      `   Select target folder (1-${alternatives.length + 1}): `,
      alternatives.length + 1
    );

    if (choice <= alternatives.length) {
      return alternatives[choice - 1].candidate.path;
    } else {
      const customPathInput = (await promptUser('   Enter spec folder name: ')).trim();
      if (customPathInput.length === 0) {
        throw new Error('Custom spec folder path cannot be empty');
      }
      if (path.isAbsolute(customPathInput)) {
        throw new Error('Custom spec folder path must be relative to specs root');
      }

      const customBaseDir = specsDir || autoDetectSpecsDirs[0] || defaultSpecsDir;
      const normalizedCustomPath = normalizeSlashes(customPathInput).replace(/^\.\//, '');
      const customSegments = splitPathSegments(normalizedCustomPath);

      if (
        customSegments.length === 0 ||
        customSegments.length > 2 ||
        customSegments.some((segment) => !SPEC_FOLDER_PATTERN.test(segment))
      ) {
        throw new Error('Custom spec folder must be NNN-name or NNN-parent/NNN-child');
      }

      const resolvedCustomPath = path.resolve(customBaseDir, ...customSegments);
      if (!isPathWithin(customBaseDir, resolvedCustomPath) || !isUnderApprovedSpecsRoots(resolvedCustomPath)) {
        throw new Error(`Custom spec folder path escapes approved specs roots: ${customPathInput}`);
      }

      return resolvedCustomPath;
    }

  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    if (errMsg.includes('retry attempts') ||
        errMsg.includes('Spec folder not found') ||
        errMsg.includes('No spec folders found') ||
        errMsg.includes('No specs/ directory found') ||
        errMsg.includes('must be under specs/ or .opencode/specs/') ||
        errMsg.includes('Custom spec folder')) {
      throw error;
    }
    printNoSpecFolderError('save-context');
    throw new Error('specs/ directory not found');
  }
}

/* -----------------------------------------------------------------
   4. EXPORTS
------------------------------------------------------------------*/

export {
  ALIGNMENT_CONFIG,
  TEST_HELPERS,
  detectSpecFolder,
  filterArchiveFolders,
  // Backwards compatibility aliases
  detectSpecFolder as detect_spec_folder,
  filterArchiveFolders as filter_archive_folders,
};
