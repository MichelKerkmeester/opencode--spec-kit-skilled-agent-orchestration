# Iteration 19 — Scanner collection boundaries and project heuristics

## Summary
`scanner.ts` explains many of the repository's downstream tradeoffs. File collection suppresses most dotfiles, workspace handling only expands one level under each pattern root, and project detection favors manifest presence over observed code shape. The result is a pragmatic but shallow project fingerprinting layer.

## Files Read
- `external/src/scanner.ts:11-86`
- `external/src/scanner.ts:97-167`
- `external/src/scanner.ts:341-443`
- `external/src/scanner.ts:380-399`

## Findings

### Finding 1 — `collectFiles()` intentionally hides most dotfiles from downstream detectors
- Source: `external/src/scanner.ts:11-34`, `external/src/scanner.ts:70-80`
- What it does: the walker skips entries starting with `.` unless they are `.env`, `.env.example`, or `.env.local`. `tsconfig.json`, `.github`, and other dot-config files never appear in the collected file list.
- Why it matters for Code_Environment/Public: This is why `detectConfig()` has to re-probe root config files manually. The collector is optimized for code files, not full repo introspection.
- Evidence type: source-confirmed
- Recommendation: adopt now
- Affected area: collection policy
- Risk/cost: low

### Finding 2 — Workspace expansion is one level deep under each workspace pattern root
- Source: `external/src/scanner.ts:107-128`, `external/src/scanner.ts:380-399`
- What it does: workspace patterns are converted with `pattern.replace("/*", "")`, then the scanner lists immediate child directories under that root and treats each as a workspace. Nested glob patterns and deeper package hierarchies are not traversed structurally.
- Why it matters for Code_Environment/Public: This is enough for common `packages/*` layouts and weak for more complex monorepos.
- Evidence type: source-confirmed
- Recommendation: prototype later
- Affected area: monorepo support
- Risk/cost: medium

### Finding 3 — Language detection is manifest-first and collapses mixed stacks aggressively
- Source: `external/src/scanner.ts:341-378`
- What it does: language is inferred from `tsconfig.json`, `pyproject.toml`, `requirements.txt`, `go.mod`, `Gemfile`, `mix.exs`, Gradle/Maven files, `Cargo.toml`, and `composer.json`. If more than one category is present, the result is simply `"mixed"`.
- Why it matters for Code_Environment/Public: This is a useful top-level label and not a nuanced language inventory. Multi-runtime repos lose important detail.
- Evidence type: source-confirmed
- Recommendation: prototype later
- Affected area: project fingerprinting
- Risk/cost: medium

### Finding 4 — Root-level framework/ORM rollup trades fidelity for compactness
- Source: `external/src/scanner.ts:131-165`
- What it does: when a repo is a monorepo, workspace deps are merged into `allDeps`, then workspace frameworks and ORMs are deduplicated back into root arrays on `ProjectInfo`.
- Why it matters for Code_Environment/Public: This keeps the top summary compact, but it erases which workspace owns which framework/ORM unless a consumer separately inspects `project.workspaces`.
- Evidence type: source-confirmed
- Recommendation: adopt now
- Affected area: summary compaction
- Risk/cost: low

### Finding 5 — The overall scanner contract is "cheap enough to run often"
- Source: `external/src/scanner.ts:56-86`, `external/src/scanner.ts:89-95`
- What it does: file walking is simple, read failures return empty strings, and most detection relies on small file probes rather than full parser pipelines.
- Why it matters for Code_Environment/Public: This is the main reason Codesight can project its scan into so many surfaces. The tradeoff is that many later features inherit the scanner's shallow heuristics.
- Evidence type: source-confirmed
- Recommendation: adopt now
- Affected area: scan economics
- Risk/cost: low

## Recommended Next Focus
Close with a full-session synthesis iteration that turns runs 11-19 into concrete adoption guidance for `Code_Environment/Public` without reopening new source areas.

## Metrics
- newInfoRatio: 0.72
- findingsCount: 5
- focus: "iteration 19: scanner collection boundaries and project heuristics"
- status: insight
