# Iteration 11 — Watch mode and pre-commit automation

## Summary
Codesight's automation surfaces are convenience wrappers around the same full scan pipeline rather than true incremental infrastructure. `watchMode()` debounces filesystem events, logs the changed filenames, and then re-runs `scan()` across the whole project. `installGitHook()` appends a repo-mutating pre-commit snippet that regenerates `.codesight/` and stages it automatically. For `Code_Environment/Public`, the portable lesson is the trigger surface, not the implementation depth.

## Files Read
- `external/src/index.ts:198-232`
- `external/src/index.ts:235-298`
- `external/src/index.ts:394-400`
- `external/src/index.ts:538-540`

## Findings

### Finding 1 — Watch mode is debounce-only; it does not do incremental detector work
- Source: `external/src/index.ts:253-289`
- What it does: `watchMode()` accumulates filenames into `changedFiles`, waits 500ms, prints the changed filenames, then calls `scan(root, outputDirName, maxDepth, userConfig)` without passing the changed file list into any detector. The only use of `changedFiles` is log formatting.
- Why it matters for Code_Environment/Public: This is a good UX shell but not an incremental architecture. Porting it as "live updates" without changing the core pipeline would oversell what the runtime is doing.
- Evidence type: source-confirmed
- Recommendation: prototype later
- Affected area: live context refresh
- Risk/cost: medium

### Finding 2 — The watcher mirrors collect-files ignore rules only partially
- Source: `external/src/index.ts:238-251`, `external/src/index.ts:275-285`
- What it does: watch mode hardcodes its own `WATCH_EXTENSIONS` and `IGNORE_DIRS` sets. They overlap heavily with `scanner.ts`, but the logic is duplicated rather than shared. New file types or ignore paths would need parallel maintenance.
- Why it matters for Code_Environment/Public: Another example of the repo's recurring duplication pattern. Automation shells should consume one shared discovery policy or they will drift.
- Evidence type: source-confirmed
- Recommendation: adopt now
- Affected area: file-discovery policy
- Risk/cost: low

### Finding 3 — `--hook` installs a mutating pre-commit snippet, not just a reminder
- Source: `external/src/index.ts:198-232`
- What it does: `installGitHook()` writes or appends a `pre-commit` script that runs `npx codesight -o <outputDirName>` and then `git add <outputDirName>/`. It only checks for `"codesight"` substring presence before deciding the hook already exists.
- Why it matters for Code_Environment/Public: This is an aggressive automation boundary. It silently stages regenerated artifacts into the current commit and assumes `.git/hooks` ownership. That is a risky default in repos with existing hook managers or partial staging discipline.
- Evidence type: source-confirmed
- Recommendation: reject
- Affected area: git workflow integration
- Risk/cost: high

### Finding 4 — Automation modes still perform a normal scan before blocking
- Source: `external/src/index.ts:394-400`, `external/src/index.ts:538-540`
- What it does: `main()` installs the hook if requested, then always runs `scan(...)` into `result`, and only after that enters `watchMode()`. Watch mode therefore starts from a full baseline scan and then keeps rerunning full scans.
- Why it matters for Code_Environment/Public: The initial full scan is sensible, but it confirms that Codesight has no "watch-first" fast path. Any future port should describe this honestly as "debounced full refresh."
- Evidence type: source-confirmed
- Recommendation: adopt now
- Affected area: automation and UX wording
- Risk/cost: low

## Recommended Next Focus
Trace the remaining shallow detector layers, starting with middleware. Those are the clearest examples of where Codesight chooses fast heuristics over structural analysis.

## Metrics
- newInfoRatio: 0.74
- findingsCount: 4
- focus: "iteration 11: watch mode and pre-commit automation"
- status: insight
