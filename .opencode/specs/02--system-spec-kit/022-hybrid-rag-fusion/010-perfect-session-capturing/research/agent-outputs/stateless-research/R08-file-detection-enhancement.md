# R08 - File Detection Enhancement for Stateless Memory Saves

## Current behavior and gap

Today, stateless saves can only discover files from:

1. `FILES` / `filesModified` payloads already present in loaded data.
2. OpenCode capture tool calls, but only `edit` and `write` are promoted into `FILES`.
3. Observation-level file arrays, usually with generic `"Modified during session"` descriptions.
4. Simulation fallback, which returns no real file list at all.

That means the stateless path misses files changed through commits, unstaged/staged git work, renames/deletes, generated edits outside OpenCode capture, and sessions where capture is unavailable. The relevant code paths are:

- `loadCollectedData()` falls back from JSON -> OpenCode capture -> simulation, but does not enrich stateless data with git-derived file changes (`scripts/loaders/data-loader.ts:76-187`).
- `transformOpencodeCapture()` only turns `edit`/`write` tool calls into `FILES`, so read-only capture misses many real modifications (`scripts/utils/input-normalizer.ts:430-482`).
- `extractFilesFromData()` only merges three sources: `FILES`, `filesModified`, and observation file lists (`scripts/extractors/file-extractor.ts:104-182`).
- `FileChange` already supports an optional `ACTION` field, so git-derived status can fit the existing output shape (`scripts/extractors/file-extractor.ts:24-29`).

## Recommendation summary

Add a **new stateless-only git enrichment path** in `data-loader.ts` that populates `collectedData._gitFileChanges`, then consume it in `extractFilesFromData()` as **Source 4**. The git source should merge:

1. `git status --porcelain=v1` for current uncommitted changes.
2. `git diff --name-status HEAD~N..HEAD` for recent committed changes.
3. `git log --name-status --diff-filter=AMDR --since="24 hours ago"` for recent actions with per-file action fidelity.

Use git diff content to generate semantic descriptions, score relevance before truncation, and deduplicate by normalized path.

## Design details

### 1) Git-based file detection

### Goal

Recover file changes even when OpenCode capture is partial or absent.

### Proposed model

```ts
type GitAction = 'A' | 'M' | 'D' | 'R';

interface GitDetectedFile {
  path: string;
  action: GitAction;
  source: 'git-status' | 'git-diff' | 'git-log';
  description?: string;
  score?: number;
  rawStatus?: string;
}
```

### Command strategy

#### Source A: current working tree

```bash
git status --porcelain=v1
```

Why:
- Captures unstaged + staged changes immediately.
- Includes renames and deletes.
- Best signal for “what changed in this session but is not committed yet”.

Parse examples:

- `M  path/to/file.ts` -> `{ path, action: 'M' }`
- `A  path/to/file.ts` -> `{ path, action: 'A' }`
- `D  path/to/file.ts` -> `{ path, action: 'D' }`
- `R  old.ts -> new.ts` -> `{ path: 'new.ts', action: 'R' }`

#### Source B: recent commits by range

```bash
git diff --name-status HEAD~N..HEAD
```

Why:
- Covers committed work from the last few commits even when the tree is clean.
- Preserves action letters already suited to `ACTION`.

Recommendation:
- Use a small default like `N = 5`.
- If `HEAD~N` fails in shallow or new repos, fall back to `HEAD~1` or skip gracefully.

#### Source C: time-window history

```bash
git log --name-status --diff-filter=AMDR --since="24 hours ago" --pretty=format:"commit %H"
```

Why:
- Catches older-but-still-relevant actions outside the last `N` commits.
- `--name-status` is preferable to `--name-only` because `ACTION` must be preserved.

Important note:
- If the product requirement insists on `git log --name-only`, use it only as a fallback presence signal.
- For actual `FileChange.ACTION`, `--name-status` is the correct implementation shape.

### Action normalization

Map git status letters to existing `FileChange.ACTION` values:

```ts
const GIT_ACTION_TO_LABEL: Record<GitAction, FileChange['ACTION']> = {
  A: 'Created',
  M: 'Modified',
  D: 'Deleted',
  R: 'Renamed',
};
```

For rename records, keep the **destination path** as `FILE_PATH` so downstream memory references point at the current file location.

## 2) Semantic description generation

### Goal

Replace generic `"Modified during session"` descriptions with something retrieval-friendly.

### Recommended strategy

For each git-detected file, inspect diff content and derive a description in this order:

1. **Structured symbol extraction from diff**
   - Added/removed `function`, `class`, `interface`, `type`, `const`, exported symbol names.
   - Markdown headings for `.md`.
   - JSON top-level keys for `.json` / `.jsonc`.
   - Shell function names for `.sh`.

2. **Hunk header / nearby context**
   - Parse `@@ ... @@` blocks and the first meaningful added/removed lines.
   - Reuse `cleanDescription()` to keep outputs short and consistent.

3. **Extension-based fallback templates**
   - `.ts/.tsx/.js/.jsx`: `Updated <symbol> implementation`
   - `.json/.jsonc`: `Updated configuration values`
   - `.md`: `Updated documentation sections`
   - `.sh`: `Updated script workflow`
   - lock files: `Dependency lockfile updated`

4. **Final fallback**
   - Existing humanized filename fallback similar to `extractChangeDescription()` in `semantic-summarizer.ts:335-411`.

### Diff commands

Use action-aware diff retrieval:

- Working tree / staged:
  ```bash
  git diff -- path/to/file.ts
  git diff --cached -- path/to/file.ts
  ```

- Recent commit range:
  ```bash
  git diff HEAD~N..HEAD -- path/to/file.ts
  ```

- Deleted file fallback:
  - Description can be generated from removed lines in the diff.
  - If diff is empty/unavailable, fallback to `Removed <humanized filename>`.

### Suggested heuristics

```ts
function describeFromDiff(path: string, action: GitAction, diffText: string): string {
  const symbol = extractPrimaryChangedSymbol(diffText, path);
  const ext = getExtension(path);

  if (action === 'D') {
    return symbol ? `Removed ${symbol}` : `Removed ${humanizeFileName(path)}`;
  }

  if (action === 'R') {
    return symbol ? `Renamed file containing ${symbol}` : `Renamed ${humanizeFileName(path)}`;
  }

  if (symbol) {
    if (action === 'A') return `Added ${symbol}`;
    return `Updated ${symbol}`;
  }

  return extensionTemplate(ext, action, path);
}
```

This should stay intentionally lightweight; full AST parsing is unnecessary for a stateless save path.

## 3) File relevance scoring

### Goal

Avoid filling memory with noisy lockfiles or unrelated repo churn.

### Proposed scoring

Score each candidate before truncating to `CONFIG.MAX_FILES_IN_MEMORY`.

```ts
function scoreFileRelevance(file: GitDetectedFile, specFolderHint?: string | null): number {
  let score = 0;

  const path = file.path.toLowerCase();
  const ext = getExtension(path);

  // Strongest signal: file relates to current spec folder or spec keywords.
  if (specFolderHint && isPathRelevantToSpec(path, specFolderHint)) score += 100;

  // Prefer live source files.
  if (['.ts', '.tsx', '.js', '.jsx', '.py', '.go', '.rs'].includes(ext)) score += 40;
  if (['.md'].includes(ext)) score += 20;
  if (['.json', '.jsonc', '.yaml', '.yml', '.toml', '.sh'].includes(ext)) score += 10;

  // Prefer direct edits over historical-only mentions.
  if (file.source === 'git-status') score += 35;
  if (file.source === 'git-diff') score += 20;
  if (file.source === 'git-log') score += 10;

  // Preserve semantically important actions.
  if (file.action === 'R' || file.action === 'D') score += 15;

  // Penalize noisy files unless spec-relevant.
  if (/package-lock|bun\\.lock|pnpm-lock|yarn\\.lock|Cargo\\.lock/i.test(path)) score -= 40;
  if (/\\.min\\.|dist\\/|build\\/|coverage\\//i.test(path)) score -= 30;
  if (/\\.gitkeep$/i.test(path)) score -= 20;

  return score;
}
```

### Spec-folder relevance

Reuse the same general idea already used by `transformOpencodeCapture()` (`scripts/utils/input-normalizer.ts:356-382`):

- Split spec folder path into meaningful keywords.
- Prefer files inside that subtree.
- Also match sibling files whose names contain spec keywords.

### Truncation rule

Keep the current hard cap:

```ts
files
  .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
  .slice(0, CONFIG.MAX_FILES_IN_MEMORY);
```

This is better than the current “valid descriptions first, then raw insertion order” behavior in `extractFilesFromData()` (`scripts/extractors/file-extractor.ts:167-181`).

## 4) Integration with existing `extractFilesFromData()`

### Recommended wiring

Add git detection in `data-loader.ts`, not inside `extractFilesFromData()` itself. That keeps:

- loader responsibility = acquire data from available sources;
- extractor responsibility = merge/normalize/rank file records.

### Loader change

When JSON input is not provided, enrich loaded data with `_gitFileChanges`:

- After successful OpenCode capture transform.
- Also for simulation fallback, so simulation mode still gets real git file context.

### Extractor change

Add **Source 4** in `extractFilesFromData()`:

- Read `collectedData._gitFileChanges`.
- Deduplicate by normalized relative path.
- Prefer descriptions from git when they are more specific.
- Prefer higher-confidence actions using precedence `R/D/A/M`.

## Concrete implementation sketch (TypeScript pseudocode)

```ts
// scripts/loaders/data-loader.ts

import { execFileSync } from 'child_process';
import { structuredLog, sanitizePath } from '../utils';
import { CONFIG } from '../core';
import { cleanDescription } from '../utils/file-helpers';

type GitAction = 'A' | 'M' | 'D' | 'R';

interface GitDetectedFile {
  path: string;
  action: GitAction;
  source: 'git-status' | 'git-diff' | 'git-log';
  description: string;
  score: number;
  rawStatus?: string;
}

interface LoadedData {
  // existing fields...
  _gitFileChanges?: GitDetectedFile[];
}

function safeGit(args: string[]): string {
  try {
    return execFileSync('git', args, {
      cwd: CONFIG.PROJECT_ROOT,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    }).trim();
  } catch {
    return '';
  }
}

function parsePorcelainStatus(output: string): GitDetectedFile[] {
  return output
    .split('\n')
    .map((line) => line.trimEnd())
    .filter(Boolean)
    .flatMap((line) => {
      const status = line.slice(0, 2).trim();
      const rest = line.slice(3).trim();

      if (!status || !rest) return [];

      if (status.startsWith('R')) {
        const [, nextPath] = rest.split(' -> ');
        return nextPath ? [{
          path: nextPath,
          action: 'R',
          source: 'git-status',
          rawStatus: status,
          description: '',
          score: 0,
        }] : [];
      }

      const action = status[0] === '?' ? null : normalizeGitAction(status[0]);
      return action ? [{
        path: rest,
        action,
        source: 'git-status',
        rawStatus: status,
        description: '',
        score: 0,
      }] : [];
    });
}

function parseNameStatus(output: string, source: GitDetectedFile['source']): GitDetectedFile[] {
  return output
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .flatMap((line) => {
      if (line.startsWith('commit ')) return [];

      const parts = line.split('\t');
      const raw = parts[0] ?? '';
      const action = normalizeGitAction(raw[0]);
      if (!action) return [];

      if (action === 'R') {
        const nextPath = parts[2] ?? parts[1];
        return nextPath ? [{
          path: nextPath,
          action,
          source,
          rawStatus: raw,
          description: '',
          score: 0,
        }] : [];
      }

      const filePath = parts[1];
      return filePath ? [{
        path: filePath,
        action,
        source,
        rawStatus: raw,
        description: '',
        score: 0,
      }] : [];
    });
}

function normalizeGitAction(letter?: string | null): GitAction | null {
  switch ((letter || '').toUpperCase()) {
    case 'A': return 'A';
    case 'M': return 'M';
    case 'D': return 'D';
    case 'R': return 'R';
    default: return null;
  }
}

function getDiffForFile(file: GitDetectedFile, commitDepth = 5): string {
  if (file.source === 'git-status') {
    const staged = safeGit(['diff', '--cached', '--', file.path]);
    const unstaged = safeGit(['diff', '--', file.path]);
    return [staged, unstaged].filter(Boolean).join('\n');
  }

  const range = `HEAD~${commitDepth}..HEAD`;
  return safeGit(['diff', range, '--', file.path]);
}

function extractPrimaryChangedSymbol(diffText: string, filePath: string): string | null {
  const lines = diffText.split('\n');
  const symbolPatterns = [
    /^[+ -]\s*export\s+(?:async\s+)?function\s+([A-Za-z0-9_]+)/,
    /^[+ -]\s*(?:async\s+)?function\s+([A-Za-z0-9_]+)/,
    /^[+ -]\s*export\s+class\s+([A-Za-z0-9_]+)/,
    /^[+ -]\s*class\s+([A-Za-z0-9_]+)/,
    /^[+ -]\s*export\s+interface\s+([A-Za-z0-9_]+)/,
    /^[+ -]\s*interface\s+([A-Za-z0-9_]+)/,
    /^[+ -]\s*export\s+const\s+([A-Za-z0-9_]+)/,
    /^[+ -]\s*const\s+([A-Za-z0-9_]+)/,
    /^[+]\s*#+\s+(.{3,80})$/,
    /^[+]\s*"([A-Za-z0-9_.-]+)"\s*:/,
  ];

  for (const line of lines) {
    for (const pattern of symbolPatterns) {
      const match = line.match(pattern);
      if (match?.[1]) return cleanDescription(match[1]);
    }
  }

  return null;
}

function extensionTemplate(ext: string, action: GitAction, filePath: string): string {
  const verb = action === 'A' ? 'Added' : action === 'D' ? 'Removed' : action === 'R' ? 'Renamed' : 'Updated';
  if (['.ts', '.tsx', '.js', '.jsx'].includes(ext)) return `${verb} code implementation`;
  if (['.json', '.jsonc', '.yaml', '.yml', '.toml'].includes(ext)) return `${verb} configuration values`;
  if (ext === '.md') return `${verb} documentation sections`;
  if (ext === '.sh') return `${verb} script workflow`;
  if (/package-lock|bun\.lock|pnpm-lock|yarn\.lock/i.test(filePath)) return 'Dependency lockfile updated';
  return `${verb} ${humanizeFileName(filePath)}`;
}

function describeFromDiff(path: string, action: GitAction, diffText: string): string {
  const symbol = extractPrimaryChangedSymbol(diffText, path);
  const ext = getExtension(path);

  if (action === 'D') return symbol ? `Removed ${symbol}` : `Removed ${humanizeFileName(path)}`;
  if (action === 'R') return symbol ? `Renamed file containing ${symbol}` : `Renamed ${humanizeFileName(path)}`;
  if (symbol) return action === 'A' ? `Added ${symbol}` : `Updated ${symbol}`;

  return extensionTemplate(ext, action, path);
}

function collectGitFileChanges(specFolderArg?: string | null): GitDetectedFile[] {
  const candidates = new Map<string, GitDetectedFile>();

  const statusFiles = parsePorcelainStatus(
    safeGit(['status', '--porcelain=v1'])
  );
  const diffFiles = parseNameStatus(
    safeGit(['diff', '--name-status', 'HEAD~5..HEAD']),
    'git-diff'
  );
  const logFiles = parseNameStatus(
    safeGit(['log', '--name-status', '--diff-filter=AMDR', '--since=24 hours ago', '--pretty=format:commit %H']),
    'git-log'
  );

  for (const file of [...statusFiles, ...diffFiles, ...logFiles]) {
    const normalizedPath = file.path.replace(/\\/g, '/');
    const diffText = getDiffForFile(file, 5);
    const description = describeFromDiff(normalizedPath, file.action, diffText);
    const score = scoreFileRelevance({ ...file, path: normalizedPath }, specFolderArg);

    const existing = candidates.get(normalizedPath);
    const next: GitDetectedFile = {
      ...file,
      path: normalizedPath,
      description,
      score,
    };

    if (!existing) {
      candidates.set(normalizedPath, next);
      continue;
    }

    candidates.set(normalizedPath, mergeGitFile(existing, next));
  }

  return Array.from(candidates.values())
    .sort((a, b) => b.score - a.score);
}

function mergeGitFile(a: GitDetectedFile, b: GitDetectedFile): GitDetectedFile {
  const actionRank: Record<GitAction, number> = { R: 4, D: 3, A: 2, M: 1 };
  const betterAction = actionRank[b.action] > actionRank[a.action] ? b.action : a.action;
  const betterDescription = b.description.length > a.description.length ? b.description : a.description;
  const betterScore = Math.max(a.score, b.score);
  const betterSource = a.source === 'git-status' ? a.source : b.source;

  return {
    ...a,
    action: betterAction,
    description: betterDescription,
    score: betterScore,
    source: betterSource,
  };
}

async function loadCollectedData(options?: LoadOptions): Promise<LoadedData> {
  // existing file mode unchanged

  // OpenCode capture mode
  const data = transformOpencodeCapture(conversation, specFolderArg);
  data._gitFileChanges = collectGitFileChanges(specFolderArg);
  return data as LoadedData;

  // Simulation fallback
  return {
    _isSimulation: true,
    _source: 'simulation',
    _gitFileChanges: collectGitFileChanges(specFolderArg),
  };
}
```

```ts
// scripts/extractors/file-extractor.ts

export interface FileChange {
  FILE_PATH: string;
  DESCRIPTION: string;
  ACTION?: string;
}

interface CollectedDataForFiles {
  FILES?: Array<{ FILE_PATH?: string; path?: string; DESCRIPTION?: string; description?: string; ACTION?: string }>;
  filesModified?: Array<{ path: string; changes_summary?: string }>;
  _gitFileChanges?: Array<{
    path: string;
    description: string;
    action: 'A' | 'M' | 'D' | 'R';
    score?: number;
    source?: string;
  }>;
  SPEC_FOLDER?: string;
  [key: string]: unknown;
}

const GIT_ACTION_LABELS: Record<string, string> = {
  A: 'Created',
  M: 'Modified',
  D: 'Deleted',
  R: 'Renamed',
};

function extractFilesFromData(
  collectedData: CollectedDataForFiles | null,
  observations: ObservationInput[] | null
): FileChange[] {
  const filesMap = new Map<string, { description: string; action?: string; score: number }>();

  const addFile = (
    rawPath: string,
    description: string,
    action?: string,
    score = 0
  ): void => {
    const normalized = toRelativePath(rawPath, CONFIG.PROJECT_ROOT);
    if (!normalized) return;

    const cleaned = cleanDescription(description) || 'Modified during session';
    const existing = filesMap.get(normalized);

    if (!existing) {
      filesMap.set(normalized, { description: cleaned, action, score });
      return;
    }

    const nextDescription =
      isDescriptionValid(cleaned) && (!isDescriptionValid(existing.description) || cleaned.length > existing.description.length)
        ? cleaned
        : existing.description;

    filesMap.set(normalized, {
      description: nextDescription,
      action: pickPreferredAction(existing.action, action),
      score: Math.max(existing.score, score),
    });
  };

  // Source 1: FILES
  for (const fileInfo of collectedData?.FILES || []) {
    addFile(
      fileInfo.FILE_PATH || fileInfo.path || '',
      fileInfo.DESCRIPTION || fileInfo.description || 'Modified during session',
      fileInfo.ACTION
    );
  }

  // Source 2: filesModified legacy format
  for (const fileInfo of collectedData?.filesModified || []) {
    addFile(fileInfo.path, fileInfo.changes_summary || 'Modified during session');
  }

  // Source 3: observations
  for (const obs of observations || []) {
    for (const file of obs.files || []) addFile(file, 'Modified during session');

    for (const fact of obs.facts || []) {
      if (typeof fact === 'object' && fact && 'files' in fact && Array.isArray(fact.files)) {
        for (const file of fact.files) addFile(file, 'Modified during session');
      }
    }
  }

  // Source 4: git-based detection
  for (const gitFile of collectedData?._gitFileChanges || []) {
    addFile(
      gitFile.path,
      gitFile.description || 'Modified during session',
      GIT_ACTION_LABELS[gitFile.action] || 'Modified',
      gitFile.score ?? 0
    );
  }

  return Array.from(filesMap.entries())
    .sort((a, b) => {
      const scoreDelta = (b[1].score ?? 0) - (a[1].score ?? 0);
      if (scoreDelta !== 0) return scoreDelta;

      const aValid = isDescriptionValid(a[1].description) ? 1 : 0;
      const bValid = isDescriptionValid(b[1].description) ? 1 : 0;
      return bValid - aValid;
    })
    .slice(0, CONFIG.MAX_FILES_IN_MEMORY)
    .map(([filePath, meta]) => ({
      FILE_PATH: filePath,
      DESCRIPTION: meta.description,
      ACTION: meta.action,
    }));
}

function pickPreferredAction(current?: string, incoming?: string): string | undefined {
  const rank: Record<string, number> = {
    Renamed: 4,
    Deleted: 3,
    Created: 2,
    Modified: 1,
  };

  if (!current) return incoming;
  if (!incoming) return current;
  return (rank[incoming] || 0) > (rank[current] || 0) ? incoming : current;
}
```

## Why this shape fits the current codebase

1. It preserves the current loader -> normalized data -> extractor pipeline instead of pushing git I/O deep into rendering logic.
2. It reuses existing path normalization and description cleaning behavior from `file-extractor.ts` and `file-helpers.ts`.
3. It fills the already-supported `ACTION` field instead of inventing a parallel schema.
4. It improves simulation mode without changing the CLI contract: stateless callers still pass only a spec folder path.

## Suggested implementation order

1. Add `_gitFileChanges` collection in `data-loader.ts`.
2. Add parsing + scoring helpers.
3. Add Source 4 merge in `extractFilesFromData()`.
4. Reuse existing semantic description helpers where possible.
5. Add tests for:
   - clean repo + recent commits
   - dirty repo with staged/unstaged changes
   - rename/delete handling
   - spec-folder relevance ordering
   - truncation to `CONFIG.MAX_FILES_IN_MEMORY`

## Expected outcome

With this enhancement, stateless saves should stop relying on sparse OpenCode `edit/write` traces and instead build a much more accurate `FILES` section from the repository’s actual change history. That should materially improve both memory quality scoring and future retrieval usefulness.
