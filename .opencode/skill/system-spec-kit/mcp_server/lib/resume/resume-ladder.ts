// ───────────────────────────────────────────────────────────────
// MODULE: Resume Ladder
// ───────────────────────────────────────────────────────────────

import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

import { findSpecDocuments } from '../../handlers/memory-index-discovery.js';
import {
  readThinContinuityRecord,
  type ThinContinuityRecord,
} from '../continuity/thin-continuity-record.js';

export type ResumeLadderSource = 'handover' | 'continuity' | 'spec-docs' | 'none';

export interface ResumeLadderDocument {
  type: 'handover' | 'continuity' | 'spec-doc';
  path: string;
  relativePath: string;
  fingerprint: string;
  modifiedAt: string;
}

export interface ResumeLadderResolution {
  kind: 'explicit' | 'cached' | 'unresolved';
  requestedSpecFolder: string | null;
  fallbackSpecFolder: string | null;
  resolvedSpecFolder: string | null;
  folderPath: string | null;
}

export interface ResumeLadderResult {
  source: ResumeLadderSource;
  specFolder: string | null;
  resolution: ResumeLadderResolution;
  summary: string;
  recentAction: string | null;
  nextSafeAction: string | null;
  blockers: string[];
  keyFiles: string[];
  hints: string[];
  documents: ResumeLadderDocument[];
  freshnessWinner: 'handover' | 'continuity' | 'spec-docs' | null;
}

export interface ResumeLadderOptions {
  specFolder?: string | null;
  fallbackSpecFolder?: string | null;
  workspacePath?: string;
}

interface StableDocumentSnapshot {
  path: string;
  relativePath: string;
  basename: string;
  content: string;
  fingerprint: string;
  modifiedAt: string;
  modifiedAtMs: number;
}

interface ResumeSignal {
  source: 'handover' | 'continuity' | 'spec-docs';
  updatedAtMs: number;
  summary: string;
  recentAction: string | null;
  nextSafeAction: string | null;
  blockers: string[];
  keyFiles: string[];
  documents: ResumeLadderDocument[];
  packetPointer?: string | null;
}

const FRONTMATTER_RE = /^(?:\uFEFF)?---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/u;
const SPEC_DOC_PRIORITY = [
  'implementation-summary.md',
  'spec.md',
  'plan.md',
  'tasks.md',
  'checklist.md',
  'decision-record.md',
  'research.md',
  'handover.md',
  'resource-map.md',
] as const;

function normalizeSpecFolder(specFolder: string | null | undefined): string | null {
  if (typeof specFolder !== 'string') {
    return null;
  }

  const trimmed = specFolder.trim().replace(/\\/g, '/').replace(/\/+$/u, '');
  if (trimmed.length === 0) {
    return null;
  }

  return trimmed
    .replace(/^\.opencode\/specs\//u, '')
    .replace(/^specs\//u, '')
    .replace(/^\.opencode\//u, '');
}

function parseIsoMs(value: string | null | undefined): number | null {
  if (typeof value !== 'string' || value.trim().length === 0) {
    return null;
  }

  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? null : parsed;
}

function stableSha256(content: Buffer): string {
  return `sha256:${createHash('sha256').update(content).digest('hex')}`;
}

function extractFrontmatter(markdown: string): string {
  return markdown.match(FRONTMATTER_RE)?.[1] ?? '';
}

function stripFrontmatter(markdown: string): string {
  return markdown.replace(FRONTMATTER_RE, '');
}

function stripQuotes(value: string): string {
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"'))
    || (trimmed.startsWith('\'') && trimmed.endsWith('\''))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function extractTopLevelField(frontmatter: string, field: string): string | null {
  if (!frontmatter) {
    return null;
  }

  const match = frontmatter.match(new RegExp(`^${field}:\\s*(.+)$`, 'miu'));
  return match ? stripQuotes(match[1]) : null;
}

function extractContinuityBlock(frontmatter: string): string | null {
  if (!frontmatter) {
    return null;
  }

  const lines = frontmatter.split(/\r?\n/u);
  const memoryIndex = lines.findIndex((line) => /^_memory:\s*$/u.test(line));
  if (memoryIndex < 0) {
    return null;
  }

  const continuityIndex = lines.findIndex((line, index) => index > memoryIndex && /^  continuity:\s*$/u.test(line));
  if (continuityIndex < 0) {
    return null;
  }

  const blockLines = [lines[continuityIndex]];
  for (let index = continuityIndex + 1; index < lines.length; index += 1) {
    const line = lines[index];
    if (line.length === 0) {
      continue;
    }
    if (!/^    /u.test(line) && !/^      - /u.test(line)) {
      break;
    }
    blockLines.push(line);
  }

  return blockLines.join('\n');
}

function extractContinuityField(block: string, field: string): string | null {
  const match = block.match(new RegExp(`^    ${field}:\\s*(.+)$`, 'mu'));
  return match ? stripQuotes(match[1]) : null;
}

function extractContinuityList(block: string, field: string): string[] {
  const lines = block.split(/\r?\n/u);
  const startIndex = lines.findIndex((line) => new RegExp(`^    ${field}:\\s*$`, 'u').test(line));
  if (startIndex < 0) {
    const inlineMatch = block.match(new RegExp(`^    ${field}:\\s*\\[(.*)\\]\\s*$`, 'mu'));
    return inlineMatch
      ? inlineMatch[1].split(',').map((entry) => stripQuotes(entry)).map((entry) => entry.trim()).filter(Boolean)
      : [];
  }

  const result: string[] = [];
  for (let index = startIndex + 1; index < lines.length; index += 1) {
    const line = lines[index];
    if (!/^      - /u.test(line)) {
      break;
    }
    result.push(stripQuotes(line.replace(/^      - /u, '')));
  }
  return result;
}

function extractHeadingTitle(markdownBody: string): string | null {
  const match = markdownBody.match(/^#\s+(.+)$/mu);
  return match ? match[1].trim() : null;
}

function collectSummaryLines(markdownBody: string, maxLines = 3): string[] {
  return markdownBody
    .split(/\r?\n/u)
    .map((line) => line.trim())
    .filter((line) => (
      line.length > 0
      && !line.startsWith('#')
      && !line.startsWith('<!--')
      && !line.startsWith('|')
      && !/^[-=*]{3,}$/u.test(line)
    ))
    .slice(0, maxLines);
}

function extractLabeledValue(markdownBody: string, labels: string[]): string | null {
  for (const label of labels) {
    const match = markdownBody.match(new RegExp(`\\*\\*${label}\\*\\*:\\s*(.+)$`, 'imu'));
    if (match?.[1]) {
      return match[1].trim();
    }

    const plainMatch = markdownBody.match(new RegExp(`^${label}:\\s*(.+)$`, 'imu'));
    if (plainMatch?.[1]) {
      return plainMatch[1].trim();
    }
  }

  return null;
}

function splitInlineList(value: string | null): string[] {
  if (!value) {
    return [];
  }

  return value
    .split(/[;,]/u)
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function uniqueStrings(values: Array<string | null | undefined>): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const value of values) {
    if (typeof value !== 'string') {
      continue;
    }

    const normalized = value.trim();
    if (normalized.length === 0 || seen.has(normalized)) {
      continue;
    }

    seen.add(normalized);
    result.push(normalized);
  }

  return result;
}

function getPriorityIndex(basename: string): number {
  const index = SPEC_DOC_PRIORITY.indexOf(basename as (typeof SPEC_DOC_PRIORITY)[number]);
  return index === -1 ? SPEC_DOC_PRIORITY.length : index;
}

function readStableMarkdownDocument(filePath: string, workspacePath: string): StableDocumentSnapshot {
  const before = fs.statSync(filePath);
  const raw = fs.readFileSync(filePath);
  const after = fs.statSync(filePath);

  if (
    before.size !== after.size
    || before.mtimeMs !== after.mtimeMs
    || before.ino !== after.ino
  ) {
    throw new Error(`Read of ${path.basename(filePath)} was not stable enough for fingerprint verification.`);
  }

  return {
    path: filePath,
    relativePath: path.relative(workspacePath, filePath).replace(/\\/g, '/'),
    basename: path.basename(filePath),
    content: raw.toString('utf8'),
    fingerprint: stableSha256(raw),
    modifiedAt: after.mtime.toISOString(),
    modifiedAtMs: after.mtimeMs,
  };
}

function toResumeDocument(
  snapshot: StableDocumentSnapshot,
  type: ResumeLadderDocument['type'],
): ResumeLadderDocument {
  return {
    type,
    path: snapshot.path,
    relativePath: snapshot.relativePath,
    fingerprint: snapshot.fingerprint,
    modifiedAt: snapshot.modifiedAt,
  };
}

function parseHandoverSignal(snapshot: StableDocumentSnapshot): ResumeSignal | null {
  const body = stripFrontmatter(snapshot.content);
  const recentAction = extractLabeledValue(body, ['Recent action', 'Recent Action']);
  const nextSafeAction = extractLabeledValue(body, ['Next safe action', 'Next action', 'Next Safe Action']);
  const blockers = splitInlineList(extractLabeledValue(body, ['Blockers']));
  const keyFiles = uniqueStrings(splitInlineList(extractLabeledValue(body, ['Key files', 'Key Files'])));
  const title = extractTopLevelField(extractFrontmatter(snapshot.content), 'title') ?? extractHeadingTitle(body);
  const summaryLines = collectSummaryLines(body);
  const summary = uniqueStrings([
    title,
    recentAction,
    nextSafeAction,
    ...summaryLines,
  ]).slice(0, 3).join(' | ');

  if (!recentAction && !nextSafeAction && summary.length === 0) {
    return null;
  }

  const updatedAtMs = parseIsoMs(
    extractTopLevelField(extractFrontmatter(snapshot.content), 'last_updated')
    ?? extractTopLevelField(extractFrontmatter(snapshot.content), 'last_updated_at')
    ?? snapshot.modifiedAt,
  ) ?? snapshot.modifiedAtMs;

  return {
    source: 'handover',
    updatedAtMs,
    summary,
    recentAction: recentAction ?? summaryLines[0] ?? title ?? null,
    nextSafeAction,
    blockers,
    keyFiles,
    documents: [toResumeDocument(snapshot, 'handover')],
  };
}

function parseContinuitySignal(
  snapshot: StableDocumentSnapshot,
  resolvedSpecFolder: string | null,
): ResumeSignal | null {
  const continuity = readThinContinuityRecord(snapshot.content);

  if (!continuity.ok || !continuity.record) {
    const frontmatter = extractFrontmatter(snapshot.content);
    const block = extractContinuityBlock(frontmatter);
    if (!block) {
      return null;
    }

    const packetPointer = extractContinuityField(block, 'packet_pointer');
    const lastUpdatedAt = extractContinuityField(block, 'last_updated_at');
    const lastUpdatedBy = extractContinuityField(block, 'last_updated_by');
    const recentAction = extractContinuityField(block, 'recent_action');
    const nextSafeAction = extractContinuityField(block, 'next_safe_action');

    if (!packetPointer || !lastUpdatedAt || !lastUpdatedBy || !recentAction || !nextSafeAction) {
      return null;
    }

    return {
      source: 'continuity',
      updatedAtMs: parseIsoMs(lastUpdatedAt) ?? snapshot.modifiedAtMs,
      summary: uniqueStrings([recentAction, nextSafeAction]).join(' | '),
      recentAction,
      nextSafeAction,
      blockers: extractContinuityList(block, 'blockers'),
      keyFiles: extractContinuityList(block, 'key_files'),
      documents: [toResumeDocument(snapshot, 'continuity')],
      packetPointer: packetPointer ?? resolvedSpecFolder,
    };
  }

  const record: ThinContinuityRecord = continuity.record;
  return {
    source: 'continuity',
    updatedAtMs: parseIsoMs(record.last_updated_at) ?? snapshot.modifiedAtMs,
    summary: uniqueStrings([record.recent_action, record.next_safe_action]).join(' | '),
    recentAction: record.recent_action,
    nextSafeAction: record.next_safe_action,
    blockers: record.blockers,
    keyFiles: record.key_files,
    documents: [toResumeDocument(snapshot, 'continuity')],
    packetPointer: record.packet_pointer,
  };
}

function parseSpecDocumentSignal(snapshots: StableDocumentSnapshot[]): ResumeSignal | null {
  if (snapshots.length === 0) {
    return null;
  }

  const ordered = [...snapshots].sort((left, right) => {
    const priorityDelta = getPriorityIndex(left.basename) - getPriorityIndex(right.basename);
    if (priorityDelta !== 0) {
      return priorityDelta;
    }
    return right.modifiedAtMs - left.modifiedAtMs;
  });

  const primary = ordered[0];
  const frontmatter = extractFrontmatter(primary.content);
  const body = stripFrontmatter(primary.content);
  const title = extractTopLevelField(frontmatter, 'title') ?? extractHeadingTitle(body) ?? primary.basename;
  const summaryLines = collectSummaryLines(body);
  const recentAction = summaryLines[0] ?? title;
  const nextSafeAction = ordered.some((entry) => entry.basename === 'tasks.md')
    ? 'Review tasks.md and continue the packet.'
    : `Review ${primary.basename} and continue the packet.`;
  const summary = uniqueStrings([title, ...summaryLines]).slice(0, 3).join(' | ');

  return {
    source: 'spec-docs',
    updatedAtMs: ordered.reduce((latest, entry) => Math.max(latest, entry.modifiedAtMs), primary.modifiedAtMs),
    summary,
    recentAction,
    nextSafeAction,
    blockers: [],
    keyFiles: ordered.map((entry) => entry.relativePath).slice(0, 5),
    documents: ordered.map((entry) => toResumeDocument(entry, 'spec-doc')),
  };
}

function synthesizeResult(params: {
  primary: ResumeSignal;
  secondary?: ResumeSignal | null;
  resolution: ResumeLadderResolution;
  hints: string[];
}): ResumeLadderResult {
  const { primary, secondary, resolution, hints } = params;
  const mergedBlockers = uniqueStrings([
    ...primary.blockers,
    ...(secondary?.blockers ?? []),
  ]);
  const mergedKeyFiles = uniqueStrings([
    ...primary.keyFiles,
    ...(secondary?.keyFiles ?? []),
  ]);
  const mergedDocuments = [...primary.documents];
  if (secondary) {
    for (const document of secondary.documents) {
      if (!mergedDocuments.some((candidate) => candidate.path === document.path)) {
        mergedDocuments.push(document);
      }
    }
  }

  return {
    source: primary.source,
    specFolder: resolution.resolvedSpecFolder,
    resolution,
    summary: uniqueStrings([
      primary.summary,
      secondary?.summary ?? null,
    ]).join(' | '),
    recentAction: primary.recentAction ?? secondary?.recentAction ?? null,
    nextSafeAction: primary.nextSafeAction ?? secondary?.nextSafeAction ?? null,
    blockers: mergedBlockers,
    keyFiles: mergedKeyFiles,
    hints,
    documents: mergedDocuments,
    freshnessWinner: primary.source,
  };
}

function buildNoRecoveryResult(
  resolution: ResumeLadderResolution,
  hints: string[],
): ResumeLadderResult {
  return {
    source: 'none',
    specFolder: resolution.resolvedSpecFolder,
    resolution,
    summary: resolution.resolvedSpecFolder
      ? 'No recovery context found in handover.md, _memory.continuity, or spec docs. Start with /spec_kit:plan or inspect the packet directly.'
      : 'No recovery context found. Pass specFolder explicitly or start with /spec_kit:plan.',
    recentAction: null,
    nextSafeAction: null,
    blockers: [],
    keyFiles: [],
    hints,
    documents: [],
    freshnessWinner: null,
  };
}

function isPathWithinRoot(candidatePath: string, rootPath: string): boolean {
  const relativePath = path.relative(rootPath, candidatePath);
  return relativePath === ''
    || (
      !relativePath.startsWith(`..${path.sep}`)
      && relativePath !== '..'
      && !path.isAbsolute(relativePath)
    );
}

function resolveFromFolderPath(workspacePath: string, folderPath: string): string | null {
  const normalized = path.resolve(folderPath);
  const candidates = [
    path.join(workspacePath, '.opencode', 'specs'),
    path.join(workspacePath, 'specs'),
  ];

  for (const root of candidates) {
    if (normalized === root || !isPathWithinRoot(normalized, root)) {
      continue;
    }

    return path.relative(root, normalized).replace(/\\/g, '/').replace(/\/+$/u, '');
  }

  return null;
}

function resolveSpecFolder(options: ResumeLadderOptions, workspacePath: string): ResumeLadderResolution {
  const requestedSpecFolder = normalizeSpecFolder(options.specFolder);
  const fallbackSpecFolder = normalizeSpecFolder(options.fallbackSpecFolder);

  const allowedRoots = [
    path.join(workspacePath, '.opencode', 'specs'),
    path.join(workspacePath, 'specs'),
  ].map((root) => path.resolve(root));

  const resolveExistingFolder = (candidate: string | null): { folderPath: string; specFolder: string } | null => {
    if (!candidate) {
      return null;
    }

    const rawCandidates = path.isAbsolute(candidate)
      ? [path.resolve(candidate)]
      : [
        path.join(workspacePath, '.opencode', 'specs', candidate),
        path.join(workspacePath, 'specs', candidate),
      ];

    for (const candidatePath of rawCandidates) {
      const resolved = path.resolve(candidatePath);
      if (!allowedRoots.some((root) => resolved !== root && isPathWithinRoot(resolved, root))) {
        continue;
      }

      if (!fs.existsSync(resolved) || !fs.statSync(resolved).isDirectory()) {
        continue;
      }

      const resolvedFolder = resolveFromFolderPath(workspacePath, resolved);
      if (!resolvedFolder) {
        continue;
      }

      return {
        folderPath: resolved,
        specFolder: resolvedFolder,
      };
    }

    return null;
  };

  const explicit = resolveExistingFolder(requestedSpecFolder);
  if (explicit) {
    return {
      kind: 'explicit',
      requestedSpecFolder,
      fallbackSpecFolder,
      resolvedSpecFolder: explicit.specFolder,
      folderPath: explicit.folderPath,
    };
  }

  const fallback = resolveExistingFolder(fallbackSpecFolder);
  if (fallback) {
    return {
      kind: 'cached',
      requestedSpecFolder,
      fallbackSpecFolder,
      resolvedSpecFolder: fallback.specFolder,
      folderPath: fallback.folderPath,
    };
  }

  return {
    kind: 'unresolved',
    requestedSpecFolder,
    fallbackSpecFolder,
    resolvedSpecFolder: null,
    folderPath: null,
  };
}

/**
 * Resolve the canonical three-step resume ladder for a spec folder.
 *
 * The helper reads packet-local `handover.md` and `_memory.continuity` inside
 * `implementation-summary.md`, promotes whichever of those two sources is
 * fresher when both exist, then falls back to canonical spec documents when
 * no fresher packet-local recovery data is available.
 *
 * @param options - Optional spec-folder and workspace overrides for resolution
 * @returns Resume payload describing the best recovery source and hints
 */
export function buildResumeLadder(options: ResumeLadderOptions = {}): ResumeLadderResult {
  const workspacePath = options.workspacePath ?? process.cwd();
  const hints: string[] = [];
  const resolution = resolveSpecFolder(options, workspacePath);

  if (!resolution.folderPath || !resolution.resolvedSpecFolder) {
    return buildNoRecoveryResult(resolution, hints);
  }

  const folderPath: string = resolution.folderPath;
  let specDocPaths = findSpecDocuments(workspacePath, { specFolder: resolution.resolvedSpecFolder })
    .filter((candidate) => candidate.startsWith(folderPath));
  if (specDocPaths.length === 0) {
    specDocPaths = SPEC_DOC_PRIORITY
      .map((relativePath) => path.join(folderPath, relativePath))
      .filter((candidate) => fs.existsSync(candidate) && fs.statSync(candidate).isFile());
  }
  const handoverPath = path.join(folderPath, 'handover.md');
  const implementationSummaryPath = path.join(folderPath, 'implementation-summary.md');

  let handoverSignal: ResumeSignal | null = null;
  if (fs.existsSync(handoverPath)) {
    try {
      handoverSignal = parseHandoverSignal(readStableMarkdownDocument(handoverPath, workspacePath));
    } catch (error: unknown) {
      hints.push(`Skipping handover.md after fingerprint verification failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  let continuitySignal: ResumeSignal | null = null;
  if (fs.existsSync(implementationSummaryPath)) {
    try {
      continuitySignal = parseContinuitySignal(
        readStableMarkdownDocument(implementationSummaryPath, workspacePath),
        resolution.resolvedSpecFolder,
      );
      if (!continuitySignal) {
        hints.push('implementation-summary.md continuity was missing or invalid; fell through to spec docs.');
      }
    } catch (error: unknown) {
      hints.push(`Skipping _memory.continuity after fingerprint verification failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  } else {
    hints.push('implementation-summary.md was missing; continuity tier unavailable.');
  }

  if (
    resolution.kind === 'explicit'
    && continuitySignal?.packetPointer
    && normalizeSpecFolder(continuitySignal.packetPointer) !== resolution.resolvedSpecFolder
  ) {
    hints.push('Explicit specFolder override took precedence over the continuity packet pointer.');
  }

  const specDocSnapshots: StableDocumentSnapshot[] = [];
  for (const docPath of specDocPaths) {
    if (docPath === handoverPath) {
      continue;
    }

    try {
      specDocSnapshots.push(readStableMarkdownDocument(docPath, workspacePath));
    } catch (error: unknown) {
      hints.push(`Skipping ${path.basename(docPath)} after fingerprint verification failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  const specDocSignal = parseSpecDocumentSignal(specDocSnapshots);

  if (handoverSignal && continuitySignal) {
    const primary = continuitySignal.updatedAtMs > handoverSignal.updatedAtMs ? continuitySignal : handoverSignal;
    const secondary = primary === handoverSignal ? continuitySignal : handoverSignal;
    hints.push(`Compared folder-local handover.md and _memory.continuity; selected ${primary.source} as the fresher resume source.`);
    return synthesizeResult({
      primary,
      secondary,
      resolution,
      hints,
    });
  }

  if (handoverSignal) {
    return synthesizeResult({
      primary: handoverSignal,
      secondary: continuitySignal,
      resolution,
      hints,
    });
  }

  if (continuitySignal) {
    return synthesizeResult({
      primary: continuitySignal,
      secondary: specDocSignal,
      resolution,
      hints,
    });
  }

  if (specDocSignal) {
    return synthesizeResult({
      primary: specDocSignal,
      resolution,
      hints,
    });
  }

  return buildNoRecoveryResult(resolution, hints);
}
