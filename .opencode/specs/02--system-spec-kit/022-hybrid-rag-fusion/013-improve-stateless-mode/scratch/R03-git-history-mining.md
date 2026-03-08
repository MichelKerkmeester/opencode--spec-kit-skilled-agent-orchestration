# R03 - Git history mining for stateless memory saves

## Summary

Git is a strong fallback source for stateless `generate-context` saves because it can reconstruct **what changed**, **how recently it changed**, and **what type of work was happening** even when conversation logs are shallow or absent. In the current codebase, git is barely used in the extractor path: `session-extractor.ts` only calls `git rev-parse` to derive `CHANNEL`, while `collect-session-data.ts` still expects richer `observations`, `userPrompts`, and `FILES` data to already exist.[^session-extractor][^collect-session-data]

A practical stateless strategy is:
1. sample recent git activity with bounded commands;
2. normalize it into structured signals;
3. synthesize truthful, explicitly-inferred `observations`, `userPrompts`, and `FILES` entries;
4. cap output aggressively so stateless mode stays fast and deterministic.

## Existing git usage in this codebase

### Current state

- `generate-context.ts` routes stateless saves through `collectSessionData()` when a spec folder is passed directly.[^generate-context]
- `collect-session-data.ts` expects pre-shaped `observations`, `userPrompts`, `FILES`, `filesModified`, and `recentContext`, then builds memory payload fields such as `SUMMARY`, `OBSERVATIONS`, `FILES`, `PROJECT_PHASE`, and `NEXT_ACTION`.[^collect-session-data]
- `file-extractor.ts` already knows how to merge file references from `FILES`, `filesModified`, and `observations[].files`, and it caps retained file entries via `CONFIG.MAX_FILES_IN_MEMORY` (default `10`).[^file-extractor][^config]
- `session-extractor.ts` uses git only for branch detection via `git rev-parse --abbrev-ref HEAD` and `git rev-parse --short HEAD` when detached.[^session-extractor]

### Gap

The stateless path does **not** currently mine git history for semantic context, even though the downstream collectors are already prepared to consume richer file, observation, and prompt-like data.

## Recommended git commands

Use small, bounded commands that answer different questions.

| Command | Value | Parse shape | Best use |
|---|---|---|---|
| `git status --porcelain` | Current working tree truth | line-based, 2-char status + path | Uncommitted work, staged/unstaged state, untracked files |
| `git log --oneline -20` | Compact recent timeline | one line per commit | Quick activity summary, recency, change themes |
| `git log --format="%s" --since="24 hours ago"` | Recent commit subjects only | one subject per line | Topic extraction, work-type heuristics |
| `git diff --name-status HEAD~5` | File actions across recent commits | tab-delimited status + paths | Added/modified/deleted/renamed file inventory |
| `git diff --stat HEAD~5` | Magnitude of recent change | diffstat lines + summary | Relative change size, hotspots, churn |

### Command-specific observations

#### 1) `git status --porcelain`

Useful signals:
- staged vs unstaged (`XY` columns)
- untracked files (`??`)
- deleted files (`D`)
- rename/copy indicators (`R`, `C`)
- current in-progress work that is not yet committed

Example parser rules:
- `M  path` -> staged modification
- ` M path` -> unstaged modification
- `A  path` -> staged add
- `?? path` -> untracked new file
- `R  old -> new` -> rename in progress

Best stateless use:
- construct the freshest `FILES` entries
- infer `lastAction` / `nextAction`
- detect whether session is implementation-heavy vs research-only

#### 2) `git log --oneline -20`

Useful signals:
- recent task sequence
- work cadence (many commits vs one big commit)
- repeated themes (`fix`, `remediation`, `audit`, `docs`, `publish`)
- probable session title / quick summary

Best stateless use:
- build a synthetic recent-context summary
- identify dominant workstream from repeated nouns
- detect iterative cleanup loops (e.g. repeated `fix(...)`)

#### 3) `git log --format="%s" --since="24 hours ago"`

Useful signals:
- only the semantic subject, without commit hashes
- good input for keyword classification
- isolates the last day of work, which aligns with memory recency better than deep history

Best stateless use:
- build `userPrompts` substitutes from inferred work topics
- identify likely `OUTCOMES` / `OBSERVATIONS`
- detect decision words like `switch`, `rename`, `deprecate`, `align`, `migrate`

#### 4) `git diff --name-status HEAD~5`

Useful signals:
- file action inventory (`A`, `M`, `D`, `R100`, etc.)
- rename pairs (`old -> new` semantics)
- strong input for `FILES` and `filesModified`

Best stateless use:
- canonical source for recent file list
- attach `ACTION`-like semantics before `file-extractor.ts` normalizes descriptions
- distinguish refactor/rename sessions from straightforward edits

#### 5) `git diff --stat HEAD~5`

Useful signals:
- change magnitude (`N insertions(+), M deletions(-)`)
- hotspot files by line churn
- whether work was broad/shallow or narrow/deep

Best stateless use:
- prioritize top changed files when many files moved
- produce better descriptions, e.g. `Large update across MCP server README files`
- infer whether the save should summarize a sweep vs a focused fix

## Programmatic parsing in TypeScript / Node.js

### Recommendation: prefer `execFile` over `exec`

Use `child_process.execFile()` (or `spawn()` for streaming) instead of `exec()` where possible:
- no shell quoting issues
- simpler argument passing
- lower injection risk
- explicit `maxBuffer` control for large repos

### Minimal helper

```ts
import { execFile } from 'child_process';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);

async function runGit(args: string[], cwd: string): Promise<string> {
  const { stdout } = await execFileAsync('git', args, {
    cwd,
    encoding: 'utf8',
    maxBuffer: 256 * 1024,
    windowsHide: true,
  });
  return stdout.trimEnd();
}
```

### Parsing `git status --porcelain`

```ts
export interface GitStatusEntry {
  indexStatus: string;
  workTreeStatus: string;
  path: string;
  originalPath?: string;
}

function parseStatusPorcelain(stdout: string): GitStatusEntry[] {
  return stdout
    .split('\n')
    .filter(Boolean)
    .map((line) => {
      const xy = line.slice(0, 2);
      const payload = line.slice(3);

      if (payload.includes(' -> ')) {
        const [originalPath, path] = payload.split(' -> ');
        return {
          indexStatus: xy[0],
          workTreeStatus: xy[1],
          path,
          originalPath,
        };
      }

      return {
        indexStatus: xy[0],
        workTreeStatus: xy[1],
        path: payload,
      };
    });
}
```

### Parsing `git log --oneline -20`

```ts
export interface GitCommitSummary {
  sha: string;
  subject: string;
}

function parseOnelineLog(stdout: string): GitCommitSummary[] {
  return stdout
    .split('\n')
    .filter(Boolean)
    .map((line) => {
      const firstSpace = line.indexOf(' ');
      return {
        sha: line.slice(0, firstSpace),
        subject: line.slice(firstSpace + 1),
      };
    });
}
```

### Parsing `git log --format="%s" --since="24 hours ago"`

```ts
function parseSubjects(stdout: string): string[] {
  return stdout
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}
```

### Parsing `git diff --name-status HEAD~5`

```ts
export interface GitNameStatusEntry {
  status: string;
  path: string;
  oldPath?: string;
}

function parseNameStatus(stdout: string): GitNameStatusEntry[] {
  return stdout
    .split('\n')
    .filter(Boolean)
    .map((line) => {
      const parts = line.split('\t');
      const status = parts[0];

      if (status.startsWith('R') && parts.length >= 3) {
        return { status, oldPath: parts[1], path: parts[2] };
      }

      return { status, path: parts[1] };
    });
}
```

### Parsing `git diff --stat HEAD~5`

`--stat` is human-readable, so parse it defensively and only use it for ranking / hints, not as the sole truth source.

```ts
export interface GitDiffStatEntry {
  path: string;
  changes: number;
  summary: string;
}

function parseDiffStat(stdout: string): GitDiffStatEntry[] {
  return stdout
    .split('\n')
    .map((line) => line.trimEnd())
    .filter((line) => line.includes('|'))
    .map((line) => {
      const [left, right] = line.split('|');
      const path = left.trim();
      const summary = right.trim();
      const match = summary.match(/^(\d+)/);
      return {
        path,
        changes: match ? Number(match[1]) : 0,
        summary,
      };
    });
}
```

### For large output, prefer `spawn()`

If diff output can exceed the buffer, stream it:

```ts
import { spawn } from 'child_process';

async function runGitStreaming(args: string[], cwd: string): Promise<string> {
  return await new Promise((resolve, reject) => {
    const child = spawn('git', args, { cwd, stdio: ['ignore', 'pipe', 'pipe'] });
    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (chunk) => {
      stdout += chunk.toString('utf8');
      if (stdout.length > 256 * 1024) {
        child.stdout.destroy();
        child.stderr.destroy();
        reject(new Error('git output exceeded 256KB limit'));
      }
    });

    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString('utf8');
    });

    child.on('close', (code) => {
      if (code === 0) resolve(stdout);
      else reject(new Error(stderr || `git exited with code ${code}`));
    });
  });
}
```

## Performance considerations

### Empirical sample from this repo

Measured locally in this repository:
- `git log --oneline -20`: ~17 ms, 20 lines, ~2.1 KB
- `git log --format="%s" --since="24 hours ago"`: ~13 ms, 14 lines, ~1.3 KB
- `git status --porcelain`: ~102 ms, 97 lines, ~11.8 KB
- `git diff --name-status HEAD~5`: ~35 ms, 791 lines, ~68.3 KB
- `git diff --stat HEAD~5`: ~179 ms, 792 lines, ~49.4 KB

Even in this repo, diff-based commands become much larger than log/status commands. This supports using log/status by default and diff commands only with strict caps.

### Recommended limits

- **Max commits scanned:** `50`
- **Max recent window:** `24 hours`
- **Default diff base:** `HEAD~5`
- **Max diff files parsed:** `200`
- **Max raw stdout per git command:** `64 KB` soft cap, `256 KB` hard fail cap
- **Max synthesized `FILES` retained:** respect existing `CONFIG.MAX_FILES_IN_MEMORY` (default `10`)
- **Max synthesized observations from git:** `5-8`
- **Max synthesized prompt-like entries:** `3-5`

### Additional guardrails

1. **Skip deep history by default.** Stateless mode should bias to recency, not archaeology.
2. **Short-circuit when repo is clean and recent logs are empty.** No need to diff if there is no new signal.
3. **Prefer `name-status` over full patch text.** Patch hunks are expensive and noisy for memory saves.
4. **Rank then truncate.** Gather a broad file candidate set, score it, and keep only the top files.
5. **Handle missing git gracefully.** Fallback to spec-folder and OpenCode capture when commands fail.

## Signals worth extracting

### File change signals

From `status --porcelain` and `diff --name-status`:
- paths touched
- action type: add / modify / delete / rename
- staged vs unstaged
- untracked new files
- rename chains (strong refactor signal)
- path concentration (many files in same subtree -> sweep or subsystem work)

### Commit message pattern signals

Useful classifiers:
- prefixes: `fix`, `feat`, `refactor`, `docs`, `chore`, `test`
- scopes: `fix(spec-kit)`, `chore(repo)`, `fix(specs)`
- workflow nouns: `audit`, `remediation`, `alignment`, `verification`, `publish`, `reconciliation`
- sequencing: repeated `fix(...)` subjects imply iterative refinement

Suggested inference rules:
- many `fix(...)` subjects -> bugfix / remediation session
- `refactor`, many renames, path moves -> refactor session
- mostly README/spec/docs files -> documentation session
- many additions under one subtree -> feature or rollout session
- `publish workspace changes` repeated -> aggregation / release housekeeping

### Decision indicators

Good decision words in subjects or synthesized summaries:
- `switch`, `migrate`, `rename`, `align`, `deprecate`, `remove`, `replace`, `standardize`, `consolidate`, `reconcile`

Good structural signals:
- rename (`R...`) events
- deletes plus adds in same area
- docs and code changing together
- spec / decision-record files updated near implementation files

### Magnitude / importance indicators

From `diff --stat`:
- one file with very high churn -> likely primary active file
- many files with low churn -> broad sweep or consistency pass
- README/spec/checklist heavy diff -> documentation / planning phase
- core runtime + docs + tests together -> meaningful implementation milestone

## Building `observations`, `userPrompts`, and `FILES` from git signals

### 1) `FILES`

This is the easiest and highest-confidence output to generate.

Recommended pipeline:
1. start with `git status --porcelain` for freshest local files;
2. merge in `git diff --name-status HEAD~5` for recent committed context;
3. score files by freshness + action importance + churn + path concentration;
4. emit top files using existing `FileChange` shape.

Suggested scoring:
- +5 if present in working tree status
- +4 if status is `A` or `R`
- +3 if high diffstat churn
- +2 if touched by multiple recent commits
- +2 if under same dominant subtree as other changed files

Suggested output shape:

```ts
FILES.push({
  FILE_PATH: 'scripts/extractors/collect-session-data.ts',
  DESCRIPTION: 'Modified during recent stateless context work',
});
```

For richer descriptions, derive from status + scope:
- `Added new scratch research document`
- `Modified stateless session extraction logic`
- `Renamed spec folder scratch path during alignment work`

### 2) `observations`

Git-derived observations should be **explicitly inferential**, not fabricated as if spoken by the user.

Good observation patterns:
- `type: 'implementation' | 'bugfix' | 'refactor' | 'decision' | 'research'`
- `title`: concise inferred milestone
- `narrative`: what git evidence suggests happened
- `facts`: supporting strings
- `files`: top relevant paths

Example:

```ts
{
  type: 'bugfix',
  title: 'Recent work focused on spec-kit remediation',
  narrative: 'Recent commits are dominated by fix(spec-kit) and fix(specs) subjects, indicating iterative remediation and verification work.',
  facts: [
    'Inferred from git log subjects within the last 24 hours',
    'Recent actions include modified README, workflow, and extractor files',
    'next: continue current working tree changes if save occurs mid-session'
  ],
  files: [
    '.opencode/skill/system-spec-kit/scripts/core/workflow.ts',
    '.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts'
  ]
}
```

Recommended observation set:
- **1 phase observation**: planning / implementation / docs / remediation
- **1 file activity observation**: top touched subsystem(s)
- **1 decision observation** if rename/delete/standardize signals appear
- **1 next-step observation** from uncommitted work
- **optional 1 scope observation** when diff is very broad

### 3) `userPrompts`

This is the trickiest field because git does **not** reveal literal user prompts. The safe approach is to emit **synthetic prompt summaries** only when no better transcript exists, using clearly inferential wording.

Do **not** pretend commit subjects are verbatim user requests.

Recommended shape:

```ts
{
  prompt: 'Inferred current task from git activity: improve stateless context quality using git history and extractor changes.',
  timestamp: latestCommitTimestampIso
}
```

Good sources for synthetic prompt text:
- top 1-3 recent commit subjects collapsed into one sentence
- dominant changed subtree + action (`Modified extractor files under scripts/extractors/`)
- working tree focus (`Uncommitted changes suggest continued work on stateless collection logic`)

Recommended rules:
- emit at most `3` synthetic prompt entries
- always prefix with `Inferred` / `Derived from git activity`
- prefer latest working-tree summary over older commit messages
- suppress entirely if real prompt history already exists

## Suggested stateless enrichment pipeline

```ts
async function collectGitSignals(cwd: string) {
  const [statusRaw, onelineRaw, subjectsRaw, nameStatusRaw, diffStatRaw] = await Promise.allSettled([
    runGit(['status', '--porcelain'], cwd),
    runGit(['--no-pager', 'log', '--oneline', '-20'], cwd),
    runGit(['--no-pager', 'log', '--format=%s', '--since=24 hours ago'], cwd),
    runGit(['--no-pager', 'diff', '--name-status', 'HEAD~5'], cwd),
    runGit(['--no-pager', 'diff', '--stat', 'HEAD~5'], cwd),
  ]);

  return {
    status: statusRaw.status === 'fulfilled' ? parseStatusPorcelain(statusRaw.value) : [],
    commits: onelineRaw.status === 'fulfilled' ? parseOnelineLog(onelineRaw.value) : [],
    subjects: subjectsRaw.status === 'fulfilled' ? parseSubjects(subjectsRaw.value) : [],
    nameStatus: nameStatusRaw.status === 'fulfilled' ? parseNameStatus(nameStatusRaw.value).slice(0, 200) : [],
    diffStat: diffStatRaw.status === 'fulfilled' ? parseDiffStat(diffStatRaw.value).slice(0, 200) : [],
  };
}
```

Then map into existing collector inputs:

```ts
const collectedData = {
  ...existingData,
  FILES: buildFilesFromGit(signals),
  observations: buildObservationsFromGit(signals),
  userPrompts: existingData.userPrompts?.length
    ? existingData.userPrompts
    : buildSyntheticPromptsFromGit(signals),
};
```

## Concrete recommendations

1. **Add a git enrichment step only for stateless mode.** Keep JSON/stateful mode unchanged.
2. **Use `execFile()` with bounded buffers.** Avoid shell parsing and uncontrolled output.
3. **Treat `status --porcelain` as the freshest truth.** It should outrank historical commits.
4. **Use `log --format=%s --since=24 hours ago` for semantic summaries.** It is cheap and high signal.
5. **Use `diff --name-status HEAD~5` as the main file-action source.** Prefer it over patch text.
6. **Use `diff --stat HEAD~5` only for ranking and descriptions.** It should not drive identity.
7. **Emit synthetic prompt summaries conservatively.** Prefix them with `Inferred` so the memory file stays honest.
8. **Cap aggressively.** This repo already demonstrates that `HEAD~5` diffs can reach ~800 lines; stateless mode should summarize, not archive raw git history.

## Proposed default caps

- `MAX_GIT_COMMITS = 50`
- `MAX_GIT_HOURS = 24`
- `MAX_GIT_DIFF_FILES = 200`
- `MAX_GIT_STDOUT_SOFT = 64 * 1024`
- `MAX_GIT_STDOUT_HARD = 256 * 1024`
- `MAX_GIT_OBSERVATIONS = 5`
- `MAX_GIT_SYNTHETIC_PROMPTS = 3`

## Bottom line

Git history is rich enough to raise stateless saves materially above the current ~30/100 floor because it can supply:
- trustworthy changed-file context,
- recent activity summaries,
- lightweight decision/refactor indicators,
- and explicit in-progress work from the working tree.

The safest implementation is not to turn git into fake transcript replay; it is to convert git into **bounded, inferred session signals** that feed the existing `FILES`, `observations`, and `userPrompts` slots already consumed by `collect-session-data.ts`.

---

[^generate-context]: `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:21-24, 452-465`
[^collect-session-data]: `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:674-804`
[^file-extractor]: `.opencode/skill/system-spec-kit/scripts/extractors/file-extractor.ts:24-29, 104-182`
[^session-extractor]: `.opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts:130-141`
[^config]: `.opencode/skill/system-spec-kit/scripts/core/config.ts:143-154, 235-240`
