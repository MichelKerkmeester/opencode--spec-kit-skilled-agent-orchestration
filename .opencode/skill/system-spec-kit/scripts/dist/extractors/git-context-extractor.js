"use strict";
// ───────────────────────────────────────────────────────────────
// MODULE: Git Context Extractor
// ───────────────────────────────────────────────────────────────
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deriveModificationMagnitude = deriveModificationMagnitude;
exports.extractGitContext = extractGitContext;
// ───────────────────────────────────────────────────────────────
// 1. GIT CONTEXT EXTRACTOR
// ───────────────────────────────────────────────────────────────
// Mines git history for file changes and observations for captured-session enrichment
const child_process_1 = require("child_process");
const path_1 = __importDefault(require("path"));
const spec_folder_extractor_1 = require("./spec-folder-extractor");
/* ───────────────────────────────────────────────────────────────
   1. INTERFACES & CONSTANTS
------------------------------------------------------------------*/
const GIT_TIMEOUT_MS = 5_000;
const MAX_FILES = 50;
const MAX_COMMITS = 20;
const MAX_DIFF_COMMITS = 5;
const SYNTHETIC_TIMESTAMP = new Date(0).toISOString();
const EMPTY_TREE_HASH = '4b825dc642cb6eb9a060e54bf8d69288fbee4904';
const COMMIT_ENTRY_SEPARATOR = '\u001e';
const COMMIT_FILES_SEPARATOR = '\u001f';
const COMMIT_TYPE_MAP = {
    fix: 'bugfix',
    feat: 'feature',
    refactor: 'refactor',
    docs: 'documentation',
    chore: 'maintenance',
    test: 'testing',
};
function emptyResult() {
    return {
        observations: [],
        FILES: [],
        summary: '',
        commitCount: 0,
        uncommittedCount: 0,
        headRef: null,
        commitRef: null,
        repositoryState: 'unavailable',
        isDetachedHead: false,
    };
}
/* ───────────────────────────────────────────────────────────────
   2. GIT COMMAND HELPERS
------------------------------------------------------------------*/
function runGitCommand(projectRoot, args) {
    return (0, child_process_1.execFileSync)('git', args, {
        cwd: projectRoot,
        encoding: 'utf-8',
        timeout: GIT_TIMEOUT_MS,
        stdio: ['pipe', 'pipe', 'pipe'],
    }).trim();
}
function tryRunGitCommand(projectRoot, args) {
    try {
        return runGitCommand(projectRoot, args);
    }
    catch {
        return null;
    }
}
/* ───────────────────────────────────────────────────────────────
   3. PATH PARSING & NORMALIZATION
------------------------------------------------------------------*/
function normalizeFilePath(projectRoot, rawPath) {
    const cleanedPath = rawPath.replace(/^"+|"+$/g, '').trim();
    if (!cleanedPath)
        return '';
    const relativePath = path_1.default.isAbsolute(cleanedPath) ? path_1.default.relative(projectRoot, cleanedPath) : cleanedPath;
    return relativePath.replace(/\\/g, '/').replace(/^\.\//, '');
}
function mapStatusCode(statusCode) {
    if (statusCode === '??')
        return 'add';
    const code = statusCode[0] !== ' ' ? statusCode[0] : statusCode[1];
    if (code === 'A')
        return 'add';
    if (code === 'D')
        return 'delete';
    if (code === 'R')
        return 'rename';
    return 'modify';
}
function parseNameStatusLine(projectRoot, line) {
    const trimmedLine = line.trim();
    if (!trimmedLine)
        return null;
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
function expandBraceWrappedRenamePaths(projectRoot, rawPath) {
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
/* ───────────────────────────────────────────────────────────────
   4. DIFF & COMMIT PARSING
------------------------------------------------------------------*/
function parseStatScores(projectRoot, diffStatOutput) {
    const scores = new Map();
    for (const line of diffStatOutput.split('\n')) {
        const match = line.match(/^\s*(.+?)\s+\|\s+(\d+)\s+[+\-]+$/);
        if (!match)
            continue;
        const score = Number.parseInt(match[2], 10);
        if (!Number.isFinite(score))
            continue;
        expandBraceWrappedRenamePaths(projectRoot, match[1]).forEach((filePath) => {
            scores.set(filePath, (scores.get(filePath) || 0) + score);
        });
    }
    return scores;
}
function parseCommits(projectRoot, logOutput) {
    return logOutput
        .split(COMMIT_ENTRY_SEPARATOR)
        .map((entry) => entry.trim())
        .filter(Boolean)
        .map((entry) => {
        const [header, filesBlock = ''] = entry.split(COMMIT_FILES_SEPARATOR);
        const [hash = '', timestamp = SYNTHETIC_TIMESTAMP, subject = '', ...bodyLines] = header.trim().split('\n');
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
function deriveModificationMagnitude({ changeScore, action, commitTouches = 0, }) {
    const hasChangeScore = typeof changeScore === 'number' && Number.isFinite(changeScore);
    if (!hasChangeScore && commitTouches <= 0) {
        return 'unknown';
    }
    let normalizedScore = hasChangeScore ? Math.max(0, changeScore) / 10 : 0;
    if (action === 'add' || action === 'delete') {
        normalizedScore = Math.max(normalizedScore, 0.25);
    }
    else if (action === 'rename') {
        normalizedScore = Math.max(normalizedScore, 0.15);
    }
    if (commitTouches >= 4) {
        normalizedScore = Math.max(normalizedScore, 0.85);
    }
    else if (commitTouches >= 3) {
        normalizedScore = Math.max(normalizedScore, 0.75);
    }
    else if (commitTouches >= 2) {
        normalizedScore = Math.max(normalizedScore, 0.55);
    }
    if (normalizedScore < 0.1) {
        return 'trivial';
    }
    if (normalizedScore < 0.3) {
        return 'small';
    }
    if (normalizedScore < 0.7) {
        return 'medium';
    }
    return 'large';
}
function detectCommitType(subject) {
    const prefix = subject.match(/^([a-z]+)(?:\([^)]+\))?!?:/i)?.[1]?.toLowerCase();
    return prefix ? COMMIT_TYPE_MAP[prefix] || 'observation' : 'observation';
}
/* ───────────────────────────────────────────────────────────────
   6. SPEC SCOPE RESOLUTION
------------------------------------------------------------------*/
// RC-3: Paths excluded from git context to avoid self-referential pollution.
// Uses path-segment-boundary matching to avoid over-matching (e.g., 'in-memory-cache.ts'
// Should NOT match, but 'specs/foo/memory/file.md' should).
const EXCLUDED_PATH_PATTERNS = [
    /(?:^|\/)memory\//, // directory named "memory/" (no \b — avoids matching "my-memory/")
    /(?:^|\/)metadata\.json$/, // exact filename "metadata.json"
    /(?:^|\/)\.gitkeep$/, // exact filename ".gitkeep"
];
function isExcludedPath(filePath) {
    return EXCLUDED_PATH_PATTERNS.some(pattern => pattern.test(filePath));
}
function matchesPathTarget(normalizedPath, target) {
    return (normalizedPath === target
        || normalizedPath.endsWith(`/${target}`)
        || normalizedPath.includes(`/${target}/`));
}
async function resolveSpecScope(projectRoot, specFolderHint) {
    if (!specFolderHint)
        return null;
    const normalizedHint = normalizeFilePath(projectRoot, specFolderHint).replace(/\/+$/, '');
    const specDirectory = normalizedHint.split('/').pop() || normalizedHint;
    const fileTargets = new Set();
    let allowSpecDirectoryFallback = true;
    try {
        const specContext = await (0, spec_folder_extractor_1.extractSpecFolderContext)(path_1.default.resolve(projectRoot, specFolderHint));
        for (const entry of specContext.FILES) {
            const normalizedPath = normalizeFilePath(projectRoot, entry.FILE_PATH);
            if (normalizedPath) {
                fileTargets.add(normalizedPath);
            }
        }
        allowSpecDirectoryFallback = false;
    }
    catch {
        // Fall back to folder-based scoping only when spec docs cannot be parsed.
    }
    return {
        normalizedHint,
        specDirectory,
        fileTargets: Array.from(fileTargets),
        allowSpecDirectoryFallback,
    };
}
function matchesSpecFolder(filePath, specScope) {
    if (isExcludedPath(filePath))
        return false;
    if (!specScope)
        return true;
    if (specScope.fileTargets.some((target) => matchesPathTarget(filePath, target))) {
        return true;
    }
    const matchesFolderHint = [specScope.normalizedHint].some((candidate) => (filePath === candidate
        || filePath.startsWith(`${candidate}/`)
        || filePath.includes(`/${candidate}/`)));
    if (matchesFolderHint) {
        return true;
    }
    if (!specScope.allowSpecDirectoryFallback) {
        return false;
    }
    return [specScope.specDirectory].some((candidate) => (filePath === candidate
        || filePath.startsWith(`${candidate}/`)
        || filePath.includes(`/${candidate}/`)));
}
/* ───────────────────────────────────────────────────────────────
   7. GIT CONTEXT EXTRACTION
------------------------------------------------------------------*/
function getGitSnapshot(projectRoot, uncommittedCount) {
    const branchRef = tryRunGitCommand(projectRoot, ['symbolic-ref', '--short', '-q', 'HEAD']);
    const commitRef = tryRunGitCommand(projectRoot, ['rev-parse', '--short=12', 'HEAD']);
    const isDetachedHead = !branchRef && Boolean(commitRef);
    const headRef = branchRef || (isDetachedHead ? 'HEAD' : null);
    const repositoryState = uncommittedCount > 0
        ? 'dirty'
        : (headRef || commitRef ? 'clean' : 'unavailable');
    return {
        headRef,
        commitRef,
        repositoryState,
        isDetachedHead,
    };
}
function getDiffOutput(projectRoot, revCount, format) {
    const diffWindow = Math.min(revCount, MAX_DIFF_COMMITS);
    if (diffWindow > 1) {
        if (revCount <= diffWindow) {
            return runGitCommand(projectRoot, ['diff', format, EMPTY_TREE_HASH, 'HEAD']);
        }
        return runGitCommand(projectRoot, ['diff', format, `HEAD~${diffWindow}..HEAD`]);
    }
    if (revCount === 1) {
        return format === '--name-status'
            ? runGitCommand(projectRoot, ['show', '--pretty=format:', '--name-status', 'HEAD'])
            : runGitCommand(projectRoot, ['show', '--stat', '--format=', 'HEAD']);
    }
    return '';
}
async function extractGitContext(projectRoot, specFolderHint) {
    try {
        if (runGitCommand(projectRoot, ['rev-parse', '--is-inside-work-tree']) !== 'true')
            return emptyResult();
        const specScope = await resolveSpecScope(projectRoot, specFolderHint);
        const statusEntries = runGitCommand(projectRoot, ['status', '--porcelain', '--untracked-files=all'])
            .split('\n')
            .map((line) => parseNameStatusLine(projectRoot, line))
            .filter((entry) => Boolean(entry))
            .filter((entry) => matchesSpecFolder(entry.filePath, specScope));
        const gitSnapshot = getGitSnapshot(projectRoot, statusEntries.length);
        const revCountOutput = tryRunGitCommand(projectRoot, ['rev-list', '--count', 'HEAD']);
        const revCount = revCountOutput ? Number.parseInt(revCountOutput, 10) : 0;
        if (!Number.isFinite(revCount))
            return emptyResult();
        const diffOutput = revCount > 0 ? getDiffOutput(projectRoot, revCount, '--name-status') : '';
        const diffEntries = diffOutput
            ? diffOutput
                .split('\n')
                .map((line) => parseNameStatusLine(projectRoot, line))
                .filter((entry) => Boolean(entry))
                .filter((entry) => matchesSpecFolder(entry.filePath, specScope))
            : [];
        const changeScores = new Map(Array.from(parseStatScores(projectRoot, revCount > 0 ? getDiffOutput(projectRoot, revCount, '--stat') : '').entries())
            .filter(([filePath]) => matchesSpecFolder(filePath, specScope)));
        const logArgs = [
            'log',
            '--name-only',
            `--format=${COMMIT_ENTRY_SEPARATOR}%H%n%cI%n%s%n%b%n${COMMIT_FILES_SEPARATOR}`,
            '--since=24 hours ago',
            `-${MAX_COMMITS}`,
        ];
        const commits = revCount > 0
            ? parseCommits(projectRoot, runGitCommand(projectRoot, logArgs))
                .map((commit) => ({
                ...commit,
                files: commit.files.filter((filePath) => matchesSpecFolder(filePath, specScope)),
            }))
                .filter((commit) => commit.files.length > 0)
            : [];
        const commitTouches = new Map();
        commits.forEach((commit) => {
            commit.files.forEach((filePath) => {
                commitTouches.set(filePath, (commitTouches.get(filePath) || 0) + 1);
            });
        });
        const FILES = [];
        const seenFiles = new Set();
        const addFile = (filePath, action, description) => {
            if (!filePath || seenFiles.has(filePath) || FILES.length >= MAX_FILES)
                return;
            const scoreBeforeBump = changeScores.get(filePath) || 0;
            changeScores.set(filePath, scoreBeforeBump + 1);
            const modificationMagnitude = deriveModificationMagnitude({
                changeScore: scoreBeforeBump,
                action,
                commitTouches: commitTouches.get(filePath) || 0,
            });
            FILES.push({
                FILE_PATH: filePath,
                DESCRIPTION: description,
                ACTION: action,
                MODIFICATION_MAGNITUDE: modificationMagnitude,
                _provenance: 'git',
            });
            seenFiles.add(filePath);
        };
        // Build a map of file paths to the most recent commit subject that touched them
        const fileToCommitSubject = new Map();
        for (const commit of commits) {
            for (const filePath of commit.files) {
                if (!fileToCommitSubject.has(filePath)) {
                    fileToCommitSubject.set(filePath, commit.subject);
                }
            }
        }
        statusEntries.forEach((entry) => {
            const commitSubject = fileToCommitSubject.get(entry.filePath);
            const description = commitSubject
                ? `Modified via: ${commitSubject}`
                : `Uncommitted: ${entry.action} during session`;
            addFile(entry.filePath, entry.action, description);
        });
        diffEntries.forEach((entry) => {
            const commitSubject = fileToCommitSubject.get(entry.filePath);
            const description = commitSubject
                ? `Changed via: ${commitSubject}`
                : `Recent commit: ${entry.action} in repository history`;
            addFile(entry.filePath, entry.action, description);
        });
        const observations = statusEntries.map((entry) => ({
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
        const summaryParts = [
            gitSnapshot.headRef ? `head ${gitSnapshot.headRef}` : null,
            gitSnapshot.commitRef ? `commit ${gitSnapshot.commitRef}` : null,
            gitSnapshot.isDetachedHead ? 'detached HEAD' : null,
            `state ${gitSnapshot.repositoryState}`,
            `${statusEntries.length} uncommitted changes`,
            `${commits.length} recent commits`,
            topFiles.length ? `top files: ${topFiles.join(', ')}` : null,
        ].filter((part) => Boolean(part));
        return {
            observations,
            FILES,
            summary: summaryParts.join('; '),
            commitCount: commits.length,
            uncommittedCount: statusEntries.length,
            ...gitSnapshot,
        };
    }
    catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.warn(`[git-context-extractor] degraded: ${msg}`);
        return emptyResult();
    }
}
//# sourceMappingURL=git-context-extractor.js.map