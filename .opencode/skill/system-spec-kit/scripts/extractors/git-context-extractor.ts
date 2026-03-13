// ---------------------------------------------------------------
// MODULE: Git Context Extractor
// ---------------------------------------------------------------
// Mines git history for file changes and observations for stateless enrichment

import { execFileSync } from 'child_process';
import path from 'path';

import { extractSpecFolderContext } from './spec-folder-extractor';

const GIT_TIMEOUT_MS = 5_000;
const MAX_FILES = 50;
const MAX_COMMITS = 20;
const MAX_DIFF_COMMITS = 5;
const SYNTHETIC_TIMESTAMP = new Date(0).toISOString();
const COMMIT_TYPE_MAP: Record<string, string> = {
  fix: 'bugfix',
  feat: 'feature',
  refactor: 'refactor',
  docs: 'documentation',
  chore: 'maintenance',
  test: 'testing',
};

type ChangeAction = 'modify' | 'add' | 'delete' | 'rename';
type CommitInfo = { hash: string; timestamp: string; subject: string; body: string; files: string[] };
type ParsedEntry = { filePath: string; action: ChangeAction };
type SpecScope = {
  normalizedHint: string;
  specDirectory: string;
  fileTargets: string[];
};
export interface GitContextExtraction {
  observations: Array<{
    type: string;
    title: string;
    narrative: string;
    timestamp: string;
    facts: string[];
    files: string[];
    _provenance: 'git';
    _synthetic: true;
  }>;
  FILES: Array<{
    FILE_PATH: string;
    DESCRIPTION: string;
    ACTION?: string;
    _provenance: 'git';
  }>;
  summary: string;
  commitCount: number;
  uncommittedCount: number;
}
function emptyResult(): GitContextExtraction {
  return { observations: [], FILES: [], summary: '', commitCount: 0, uncommittedCount: 0 };
}

function runGitCommand(projectRoot: string, args: string[]): string {
  return execFileSync('git', args, {
    cwd: projectRoot,
    encoding: 'utf-8',
    timeout: GIT_TIMEOUT_MS,
    stdio: ['pipe', 'pipe', 'pipe'],
  }).trim();
}
function normalizeFilePath(projectRoot: string, rawPath: string): string {
  const cleanedPath = rawPath.replace(/^"+|"+$/g, '').trim();
  if (!cleanedPath) return '';
  const relativePath = path.isAbsolute(cleanedPath) ? path.relative(projectRoot, cleanedPath) : cleanedPath;
  return relativePath.replace(/\\/g, '/').replace(/^\.\//, '');
}
function mapStatusCode(statusCode: string): ChangeAction {
  if (statusCode === '??') return 'add';
  const code = statusCode[0] !== ' ' ? statusCode[0] : statusCode[1];
  if (code === 'A') return 'add';
  if (code === 'D') return 'delete';
  if (code === 'R') return 'rename';
  return 'modify';
}
function parseNameStatusLine(projectRoot: string, line: string): ParsedEntry | null {
  const trimmedLine = line.trim();
  if (!trimmedLine) return null;
  if (/^(?:M|A|D|R\d*|C\d*|T|U|\?\?)\s/.test(trimmedLine)) {
    const [statusToken, ...rest] = trimmedLine.split(/\s+/);
    const rawPath = statusToken.startsWith('R') && rest.length >= 2 ? rest[rest.length - 1] : rest.join(' ');
    const filePath = normalizeFilePath(projectRoot, rawPath);
    return filePath ? { filePath, action: mapStatusCode(statusToken.slice(0, 2)) } : null;
  }
  const statusCode = line.slice(0, 2);
  const filePath = normalizeFilePath(projectRoot, line.slice(3).split(' -> ').pop() || '');
  return filePath ? { filePath, action: mapStatusCode(statusCode) } : null;
}
function expandBraceWrappedRenamePaths(projectRoot: string, rawPath: string): string[] {
  const trimmedPath = rawPath.trim();
  const renameMatch = trimmedPath.match(/^(.*)\{([^{}]+)\s=>\s([^{}]+)\}(.*)$/);
  if (!renameMatch) {
    const filePath = normalizeFilePath(projectRoot, trimmedPath);
    return filePath ? [filePath] : [];
  }
  const [, prefix, sourceSegment, destinationSegment, suffix] = renameMatch;
  return [sourceSegment, destinationSegment]
    .map((segment) => normalizeFilePath(projectRoot, `${prefix}${segment.trim()}${suffix}`))
    .filter(Boolean);
}
function parseStatScores(projectRoot: string, diffStatOutput: string): Map<string, number> {
  const scores = new Map<string, number>();
  for (const line of diffStatOutput.split('\n')) {
    const match = line.match(/^\s*(.+?)\s+\|\s+(\d+)\s+[+\-]+$/);
    if (!match) continue;
    const score = Number.parseInt(match[2], 10);
    if (!Number.isFinite(score)) continue;
    expandBraceWrappedRenamePaths(projectRoot, match[1]).forEach((filePath) => {
      scores.set(filePath, (scores.get(filePath) || 0) + score);
    });
  }
  return scores;
}
function parseCommits(projectRoot: string, logOutput: string): CommitInfo[] {
  return logOutput
    .split(/\n---\n?/)
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const [header, filesBlock = ''] = entry.split('\n__FILES__\n');
      const [hash = '', timestamp = SYNTHETIC_TIMESTAMP, subject = '', ...bodyLines] = header.split('\n');
      const files = filesBlock
        .split('\n')
        .map((line) => normalizeFilePath(projectRoot, line))
        .filter(Boolean);
      return {
        hash: hash.trim(),
        timestamp: timestamp.trim() || SYNTHETIC_TIMESTAMP,
        subject: subject.trim(),
        body: bodyLines.join('\n').trim(),
        files,
      };
    })
    .filter((commit) => Boolean(commit.hash && commit.subject));
}
function detectCommitType(subject: string): string {
  const prefix = subject.match(/^([a-z]+)(?:\([^)]+\))?!?:/i)?.[1]?.toLowerCase();
  return prefix ? COMMIT_TYPE_MAP[prefix] || 'observation' : 'observation';
}
// RC-3: Paths excluded from git context to avoid self-referential pollution.
// Uses path-segment-boundary matching to avoid over-matching (e.g., 'in-memory-cache.ts'
// should NOT match, but 'specs/foo/memory/file.md' should).
const EXCLUDED_PATH_PATTERNS = [
  /(?:^|\/)memory\//,              // directory named "memory/" (no \b — avoids matching "my-memory/")
  /(?:^|\/)metadata\.json$/,      // exact filename "metadata.json"
  /(?:^|\/)\.gitkeep$/,           // exact filename ".gitkeep"
];

function isExcludedPath(filePath: string): boolean {
  return EXCLUDED_PATH_PATTERNS.some(pattern => pattern.test(filePath));
}

function matchesPathTarget(normalizedPath: string, target: string): boolean {
  return (
    normalizedPath === target
    || normalizedPath.endsWith(`/${target}`)
    || normalizedPath.includes(`/${target}/`)
  );
}

async function resolveSpecScope(projectRoot: string, specFolderHint?: string): Promise<SpecScope | null> {
  if (!specFolderHint) return null;

  const normalizedHint = normalizeFilePath(projectRoot, specFolderHint).replace(/\/+$/, '');
  const specDirectory = normalizedHint.split('/').pop() || normalizedHint;
  const fileTargets = new Set<string>();

  try {
    const specContext = await extractSpecFolderContext(path.resolve(projectRoot, specFolderHint));
    for (const entry of specContext.FILES) {
      const normalizedPath = normalizeFilePath(projectRoot, entry.FILE_PATH);
      if (normalizedPath) {
        fileTargets.add(normalizedPath);
      }
    }
  } catch {
    // Fall back to folder-based scoping only when spec docs cannot be parsed.
  }

  return {
    normalizedHint,
    specDirectory,
    fileTargets: Array.from(fileTargets),
  };
}

function matchesSpecFolder(filePath: string, specScope: SpecScope | null): boolean {
  if (isExcludedPath(filePath)) return false;
  if (!specScope) return true;
  if (specScope.fileTargets.some((target) => matchesPathTarget(filePath, target))) {
    return true;
  }
  return [specScope.normalizedHint, specScope.specDirectory].some((candidate) => (
    filePath === candidate
    || filePath.startsWith(`${candidate}/`)
    || filePath.includes(`/${candidate}/`)
    || filePath.includes(candidate)
  ));
}
function getDiffOutput(projectRoot: string, revCount: number, format: '--name-status' | '--stat'): string {
  const diffWindow = Math.min(revCount, MAX_DIFF_COMMITS);
  if (diffWindow > 1) return runGitCommand(projectRoot, ['diff', format, `HEAD~${diffWindow}`]);
  if (revCount === 1) {
    return format === '--name-status'
      ? runGitCommand(projectRoot, ['show', '--pretty=format:', '--name-status', 'HEAD'])
      : runGitCommand(projectRoot, ['show', '--stat', '--format=', 'HEAD']);
  }
  return '';
}
export async function extractGitContext(projectRoot: string, specFolderHint?: string): Promise<GitContextExtraction> {
  try {
    if (runGitCommand(projectRoot, ['rev-parse', '--is-inside-work-tree']) !== 'true') return emptyResult();
    const specScope = await resolveSpecScope(projectRoot, specFolderHint);
    const statusEntries = runGitCommand(projectRoot, ['status', '--porcelain'])
      .split('\n')
      .map((line) => parseNameStatusLine(projectRoot, line))
      .filter((entry): entry is ParsedEntry => Boolean(entry))
      .filter((entry) => matchesSpecFolder(entry.filePath, specScope));
    const revCount = Number.parseInt(runGitCommand(projectRoot, ['rev-list', '--count', 'HEAD']), 10);
    if (!Number.isFinite(revCount)) return emptyResult();

    const diffEntries = getDiffOutput(projectRoot, revCount, '--name-status')
      .split('\n')
      .map((line) => parseNameStatusLine(projectRoot, line))
      .filter((entry): entry is ParsedEntry => Boolean(entry))
      .filter((entry) => matchesSpecFolder(entry.filePath, specScope));
    const changeScores = new Map(
      Array.from(parseStatScores(projectRoot, getDiffOutput(projectRoot, revCount, '--stat')).entries())
        .filter(([filePath]) => matchesSpecFolder(filePath, specScope))
    );
    const logArgs = ['log', '--name-only', '--format=%H%n%cI%n%s%n%b%n__FILES__', '--since=24 hours ago', `-${MAX_COMMITS}`];
    const commits = parseCommits(projectRoot, runGitCommand(projectRoot, logArgs))
      .filter((commit) => commit.files.some((filePath) => matchesSpecFolder(filePath, specScope)));

    const FILES: GitContextExtraction['FILES'] = [];
    const seenFiles = new Set<string>();
    const addFile = (filePath: string, action: ChangeAction, description: string): void => {
      if (!filePath || seenFiles.has(filePath) || FILES.length >= MAX_FILES) return;
      FILES.push({ FILE_PATH: filePath, DESCRIPTION: description, ACTION: action, _provenance: 'git' });
      seenFiles.add(filePath);
      changeScores.set(filePath, (changeScores.get(filePath) || 0) + 1);
    };

    statusEntries.forEach((entry) => addFile(entry.filePath, entry.action, `Uncommitted: ${entry.action} during session`));
    diffEntries.forEach((entry) => addFile(entry.filePath, entry.action, `Recent commit: ${entry.action} in repository history`));

    const observations: GitContextExtraction['observations'] = statusEntries.map((entry) => ({
      type: 'uncommitted-change',
      title: `Uncommitted ${entry.action}: ${entry.filePath}`,
      narrative: `Working tree or index marks ${entry.filePath} as ${entry.action}.`,
      timestamp: SYNTHETIC_TIMESTAMP,
      facts: [`action=${entry.action}`],
      files: [entry.filePath],
      _provenance: 'git',
      _synthetic: true,
    }));

    commits.forEach((commit) => {
      observations.push({
        type: detectCommitType(commit.subject),
        title: commit.subject,
        narrative: commit.body,
        timestamp: commit.timestamp,
        facts: [`commit=${commit.hash}`],
        files: commit.files,
        _provenance: 'git',
        _synthetic: true,
      });
    });

    const topFiles = Array.from(changeScores.entries())
      .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
      .slice(0, 3)
      .map(([filePath]) => filePath);

    return {
      observations,
      FILES,
      summary: `${statusEntries.length} uncommitted changes, ${commits.length} recent commits${topFiles.length ? `; top files: ${topFiles.join(', ')}` : ''}`,
      commitCount: commits.length,
      uncommittedCount: statusEntries.length,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn(`[git-context-extractor] degraded: ${msg}`);
    return emptyResult();
  }
}
