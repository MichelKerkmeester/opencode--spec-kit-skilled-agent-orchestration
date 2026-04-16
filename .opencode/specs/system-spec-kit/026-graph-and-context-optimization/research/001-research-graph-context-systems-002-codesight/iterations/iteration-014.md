# Iteration 14 — Config detector breadth and env-var semantics

## Summary
`detectConfig()` compresses a lot of operational context into one cheap pass, but it does so with fixed filename allowlists and regex env-var discovery. The output is practical for assistant orientation, yet it is narrower than the "config understanding" story in the product narrative might imply.

## Files Read
- `external/src/detectors/config.ts:1-174`
- `external/tests/detectors.test.ts:392-406`

## Findings

### Finding 1 — Config-file detection is a fixed whitelist plus a root reread
- Source: `external/src/detectors/config.ts:6-49`
- What it does: `CONFIG_FILES` is a hardcoded list of 22 filenames. The detector first matches those in `files`, then separately probes `project.root` for the same filenames via `readFileSafe()` to catch non-code files that `collectFiles()` never returned.
- Why it matters for Code_Environment/Public: This is a useful pattern for bridging file-collection limits, but it is hand-maintained and easy to drift. Unknown config surfaces stay invisible until manually added.
- Evidence type: source-confirmed
- Recommendation: adopt now
- Affected area: config surfacing
- Risk/cost: low

### Finding 2 — Env-var extraction is broad in syntax, narrow in semantics
- Source: `external/src/detectors/config.ts:73-174`
- What it does: the detector parses `.env`, `.env.example`, and `.env.local`, then scans code for `process.env.X`, bracket access, `Bun.env.X`, `import.meta.env.X`, Python `os.environ[...]` / `os.getenv(...)`, and Go `os.Getenv(...)`.
- Why it matters for Code_Environment/Public: This captures a useful cross-language baseline, but it does not model defaults from code branches, wrapper helpers, lowercase env names, or framework-specific config adapters.
- Evidence type: source-confirmed
- Recommendation: prototype later
- Affected area: env-var discovery
- Risk/cost: medium

### Finding 3 — Dependency reporting is JS-package-centric
- Source: `external/src/detectors/config.ts:54-70`
- What it does: `dependencies` and `devDependencies` come only from root `package.json`. Python, Go, Ruby, and Elixir dependencies influence framework/ORM detection elsewhere, but they are not surfaced in `ConfigInfo`.
- Why it matters for Code_Environment/Public: The "config" view is richer for Node projects than for mixed-language repos. Any port should decide whether config reporting is JS-first on purpose or needs multi-language parity.
- Evidence type: source-confirmed
- Recommendation: prototype later
- Affected area: multi-language config context
- Risk/cost: medium

### Finding 4 — Regression coverage is one small happy-path env fixture
- Source: `external/tests/detectors.test.ts:392-406`
- What it does: the only config test creates `.env.example` with three variables and a TS file that reads two of them, then asserts the resulting env-var list is at least length two and contains `DATABASE_URL`.
- Why it matters for Code_Environment/Public: The detector is guarded against disappearing, but not against syntax regressions across the Python/Go/Bun/Vite branches or config-file whitelist drift.
- Evidence type: test-confirmed
- Recommendation: adopt now
- Affected area: regression strategy
- Risk/cost: low

## Recommended Next Focus
Move to `formatter.ts`, since config output quality depends heavily on how the markdown artifacts are emitted and maintained over time.

## Metrics
- newInfoRatio: 0.73
- findingsCount: 4
- focus: "iteration 14: config detector breadth and env-var semantics"
- status: insight
