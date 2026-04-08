import * as path from 'node:path';
import { open, readdir } from 'node:fs/promises';

const HEADER_READ_BYTES = 2048;
const POSITIVE_CONTINUATION_SIGNAL =
  /\b(?:extended|continu(?:ation|e)|resume|follow[- ]up|part\s*\d+|iter(?:ation)?\s*\d+|\d+[- ]*iterations?(?:[- ]*total[- ]*\d+)?)\b/i;
const TITLE_FAMILY_WORD_LIMIT = 6;
const TITLE_FAMILY_OVERLAP_THRESHOLD = 0.5;

type CurrentSession = {
  title: string;
  sessionId?: string;
  summary?: string;
  sessionSummary?: string;
  filename?: string;
  sourceSessionId?: string;
  _sourceSessionId?: string;
  continuationOf?: string;
  continuation_of?: string;
  supersedes?: string[];
  causal_links?: Record<string, unknown>;
  causalLinks?: Record<string, unknown>;
};

type ParsedMemoryHeader = {
  sessionId: string;
  title: string;
  timestampMs: number | null;
  continuationOf: string;
};

type Candidate = ParsedMemoryHeader & {
  sourceMatch: boolean;
  explicitMarkerMatch: boolean;
  titleFamilyOverlap: number;
};

function readSupersedes(value: unknown): string[] {
  if (!value || typeof value !== 'object') {
    return [];
  }

  const record = value as Record<string, unknown>;
  const rawSupersedes = record.supersedes;
  if (!Array.isArray(rawSupersedes)) {
    return [];
  }

  return rawSupersedes
    .map((entry) => (typeof entry === 'string' ? entry.trim() : ''))
    .filter(Boolean);
}

function hasExistingSupersedes(currentSession: CurrentSession): boolean {
  if (Array.isArray(currentSession.supersedes) && currentSession.supersedes.length > 0) {
    return true;
  }

  return readSupersedes(currentSession.causal_links).length > 0
    || readSupersedes(currentSession.causalLinks).length > 0;
}

function hasContinuationSignal(currentSession: CurrentSession): boolean {
  const candidates = [
    currentSession.title,
    currentSession.summary,
    currentSession.sessionSummary,
    currentSession.filename ? path.parse(currentSession.filename).name : '',
  ];

  return candidates.some((value) => typeof value === 'string' && POSITIVE_CONTINUATION_SIGNAL.test(value));
}

function parseTimestampFromFilename(filename: string): number | null {
  const match = filename.match(/^(\d{2})-(\d{2})-(\d{2})_(\d{2})-(\d{2})__/);
  if (!match) {
    return null;
  }

  const [, day, month, year, hour, minute] = match;
  const timestamp = Date.UTC(
    2000 + Number(year),
    Number(month) - 1,
    Number(day),
    Number(hour),
    Number(minute),
  );

  return Number.isFinite(timestamp) ? timestamp : null;
}

function parseFrontmatterValue(frontmatter: string, key: string): string {
  const match = frontmatter.match(new RegExp(`^${key}:\\s*"?(.*?)"?\\s*$`, 'm'));
  return match?.[1]?.trim() ?? '';
}

function buildTitleFamilyTokens(input: string | undefined): string[] {
  if (typeof input !== 'string' || input.trim().length === 0) {
    return [];
  }

  const withoutExtension = input.replace(/\.md$/i, '');
  const withoutTimestampPrefix = withoutExtension.replace(/^\d{2}-\d{2}-\d{2}_\d{2}-\d{2}__/, '');
  const withoutTrailingDigits = withoutTimestampPrefix.replace(/(?:[-_\s]+\d+)+$/u, '');
  const normalized = withoutTrailingDigits
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (normalized.length === 0) {
    return [];
  }

  return Array.from(new Set(normalized.split(' ').filter(Boolean))).slice(0, TITLE_FAMILY_WORD_LIMIT);
}

function computeTitleFamilyOverlap(currentTokens: string[], candidateTokens: string[]): number {
  if (currentTokens.length === 0 || candidateTokens.length === 0) {
    return 0;
  }

  const candidateSet = new Set(candidateTokens);
  const sharedCount = currentTokens.filter((token) => candidateSet.has(token)).length;
  return sharedCount / Math.max(currentTokens.length, candidateTokens.length);
}

function hasExplicitContinuationMarker(currentSession: CurrentSession, candidateSessionId: string): boolean {
  const explicitMarker = typeof currentSession.continuationOf === 'string' && currentSession.continuationOf.trim().length > 0
    ? currentSession.continuationOf.trim()
    : typeof currentSession.continuation_of === 'string'
      ? currentSession.continuation_of.trim()
      : '';

  return explicitMarker.length > 0 && explicitMarker === candidateSessionId;
}

function isCandidateEligible(candidate: Candidate): boolean {
  return candidate.sourceMatch
    || candidate.explicitMarkerMatch
    || candidate.titleFamilyOverlap >= TITLE_FAMILY_OVERLAP_THRESHOLD;
}

async function readMemoryHeader(filePath: string, filename: string): Promise<ParsedMemoryHeader | null> {
  const handle = await open(filePath, 'r');

  try {
    const buffer = Buffer.alloc(HEADER_READ_BYTES);
    const { bytesRead } = await handle.read(buffer, 0, HEADER_READ_BYTES, 0);
    if (bytesRead === 0) {
      return null;
    }

    const headerText = buffer.subarray(0, bytesRead).toString('utf8');
    if (!headerText.startsWith('---')) {
      return null;
    }

    const frontmatterMatch = headerText.match(/^---\n([\s\S]*?)\n---(?:\n|$)/);
    if (!frontmatterMatch) {
      return null;
    }

    const frontmatter = frontmatterMatch[1];
    const sessionId = parseFrontmatterValue(frontmatter, 'session_id');
    const title = parseFrontmatterValue(frontmatter, 'title');
    if (sessionId.length === 0 || title.length === 0) {
      return null;
    }

    return {
      sessionId,
      title,
      timestampMs: parseTimestampFromFilename(filename),
      continuationOf: parseFrontmatterValue(frontmatter, 'continuation_of') || parseFrontmatterValue(frontmatter, 'continuationOf'),
    };
  } finally {
    await handle.close();
  }
}

function compareCandidates(candidate: Candidate, incumbent: Candidate): 'better' | 'worse' | 'tie' {
  if (candidate.sourceMatch !== incumbent.sourceMatch) {
    return candidate.sourceMatch ? 'better' : 'worse';
  }

  if (candidate.explicitMarkerMatch !== incumbent.explicitMarkerMatch) {
    return candidate.explicitMarkerMatch ? 'better' : 'worse';
  }

  if (candidate.titleFamilyOverlap !== incumbent.titleFamilyOverlap) {
    return candidate.titleFamilyOverlap > incumbent.titleFamilyOverlap ? 'better' : 'worse';
  }

  if (candidate.timestampMs !== null && incumbent.timestampMs !== null) {
    if (candidate.timestampMs === incumbent.timestampMs) {
      return 'tie';
    }
    return candidate.timestampMs > incumbent.timestampMs ? 'better' : 'worse';
  }

  if (candidate.timestampMs !== null || incumbent.timestampMs !== null) {
    return candidate.timestampMs !== null ? 'better' : 'worse';
  }

  return 'tie';
}

/**
 * Finds the predecessor memory for continuation-style saves without guessing
 * across mixed-topic sibling folders. Auto-linking requires either an exact
 * source-session match, an explicit continuation marker, or >=50% title-family
 * overlap after normalizing filename/title content words.
 */
export async function findPredecessorMemory(
  specFolderPath: string,
  currentSession: CurrentSession,
): Promise<string | null> {
  if (!specFolderPath || hasExistingSupersedes(currentSession) || !hasContinuationSignal(currentSession)) {
    return null;
  }

  const memoryDir = path.join(specFolderPath, 'memory');
  const currentSessionId = typeof currentSession.sessionId === 'string' ? currentSession.sessionId.trim() : '';
  const sourceSessionId = typeof currentSession.sourceSessionId === 'string' && currentSession.sourceSessionId.trim().length > 0
    ? currentSession.sourceSessionId.trim()
    : typeof currentSession._sourceSessionId === 'string'
      ? currentSession._sourceSessionId.trim()
      : '';
  const currentTimestamp = typeof currentSession.filename === 'string'
    ? parseTimestampFromFilename(path.basename(currentSession.filename))
    : null;
  const currentTitleFamilyTokens = (() => {
    const filenameTokens = buildTitleFamilyTokens(currentSession.filename ? path.basename(currentSession.filename) : undefined);
    return filenameTokens.length > 0 ? filenameTokens : buildTitleFamilyTokens(currentSession.title);
  })();

  let entries;
  try {
    entries = await readdir(memoryDir, { withFileTypes: true });
  } catch {
    return null;
  }

  let bestCandidate: Candidate | null = null;
  let ambiguous = false;

  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith('.md')) {
      continue;
    }

    const candidateHeader = await readMemoryHeader(path.join(memoryDir, entry.name), entry.name);
    if (!candidateHeader) {
      continue;
    }

    if (candidateHeader.sessionId === currentSessionId) {
      continue;
    }

    if (
      currentTimestamp !== null
      && candidateHeader.timestampMs !== null
      && candidateHeader.timestampMs > currentTimestamp
    ) {
      continue;
    }

    const candidate: Candidate = {
      ...candidateHeader,
      sourceMatch: sourceSessionId.length > 0 && candidateHeader.sessionId === sourceSessionId,
      explicitMarkerMatch: hasExplicitContinuationMarker(currentSession, candidateHeader.sessionId),
      titleFamilyOverlap: computeTitleFamilyOverlap(
        currentTitleFamilyTokens,
        (() => {
          const filenameTokens = buildTitleFamilyTokens(entry.name);
          return filenameTokens.length > 0 ? filenameTokens : buildTitleFamilyTokens(candidateHeader.title);
        })(),
      ),
    };
    if (!isCandidateEligible(candidate)) {
      continue;
    }

    if (!bestCandidate) {
      bestCandidate = candidate;
      ambiguous = false;
      continue;
    }

    const comparison = compareCandidates(candidate, bestCandidate);
    if (comparison === 'better') {
      bestCandidate = candidate;
      ambiguous = false;
      continue;
    }

    if (comparison === 'tie' && candidate.sessionId !== bestCandidate.sessionId) {
      ambiguous = true;
    }
  }

  if (!bestCandidate || ambiguous) {
    return null;
  }

  return bestCandidate.sessionId;
}
