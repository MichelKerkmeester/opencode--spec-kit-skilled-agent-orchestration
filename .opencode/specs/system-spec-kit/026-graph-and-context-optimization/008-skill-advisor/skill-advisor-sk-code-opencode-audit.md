# Skill Advisor — sk-code-opencode Audit Report

**Scope:** `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/` (TypeScript, ~15,075 LOC across 99 source files, excluding `dist/` and `node_modules/`).
**Standard:** `sk-code-opencode` (TypeScript overlay) — `style_guide.md`, `quality_standards.md`, `universal_patterns.md`.
**Mode:** READ-ONLY audit. No production code or tests modified.
**Date:** 2026-04-25.

---

## 1. SUMMARY

**Verdict: PASS (with required cleanups).** The skill_advisor module is one of the cleanest TypeScript subsystems in the codebase. Module-header coverage is at ceiling, type-safety policy is fully honored (zero `: any`, zero `as any`, no untyped `catch (e)` in production), strict-mode discipline holds, and the public-API surface is consistently Zod-validated end-to-end. The dominant gap is **DRY**, not correctness or safety: a small set of utility helpers (`findWorkspaceRoot`, `isRecord`, `readJson` / `stringArray`, `error → message` formatting, skill-markdown frontmatter parsing) are duplicated across 3–7 files instead of being centralized into a `lib/utils/` module, the way `code_graph/lib/utils/workspace-path.ts` already models for the sibling subsystem. Three production files (`handlers/advisor-recommend.ts`, `handlers/advisor-status.ts`, `handlers/advisor-validate.ts`) and a few lib files would benefit from extracting that shared layer. There are no P0 blockers.

---

## 2. METHODOLOGY

### Standards read

- `.opencode/skill/sk-code-opencode/SKILL.md` (full)
- `.opencode/skill/sk-code-opencode/references/typescript/style_guide.md` (full)
- `.opencode/skill/sk-code-opencode/references/typescript/quality_standards.md` (full)
- `.opencode/skill/sk-code-opencode/references/shared/universal_patterns.md` (full)

### Cross-reference

- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/utils/workspace-path.ts` (sibling subsystem; canonical pattern for path containment + workspace-root canonicalization).

### Files sampled (29 / 99)

**Handlers (4/4 — full):** `handlers/advisor-recommend.ts`, `handlers/advisor-status.ts`, `handlers/advisor-validate.ts`, `handlers/index.ts`.

**Compat entry (1/1 — full):** `compat/index.ts`.

**Lib subfolders (15):**
- `lib/scorer/`: `fusion.ts`, `projection.ts`, `lanes/explicit.ts`, `lanes/lexical.ts`, `lanes/derived.ts`.
- `lib/derived/`: `extract.ts`, `sanitizer.ts`.
- `lib/lifecycle/`: `age-haircut.ts`, `archive-handling.ts`, `supersession.ts`.
- `lib/freshness/`: `trust-state.ts`. Plus root `lib/freshness.ts` (header + types only).
- `lib/daemon/`: `lifecycle.ts`, `watcher.ts` (head only).
- `lib/corpus/`: `df-idf.ts`.
- `lib/compat/`: `daemon-probe.ts`.
- Root lib: `prompt-cache.ts` (head), `metrics.ts` (head), `subprocess.ts` (helper section), `normalize-adapter-output.ts` (head).

**Bench (3 of 7):** `bench/scorer-bench.ts`, `bench/code-graph-query-latency.bench.ts` (partial), `bench/scorer-calibration.bench.ts` (referenced).

**Tests (3 of ~25):** `tests/handlers/advisor-recommend.vitest.ts`, `tests/manual-testing-playbook.vitest.ts` (head), `tests/compat/python-compat.vitest.ts` (head), `tests/skill-graph-db.vitest.ts` (head).

**Schema (1 of 4):** `schemas/advisor-tool-schemas.ts`.

### Files NOT individually read

`lib/skill-advisor-brief.ts`, `lib/render.ts`, `lib/generation.ts`, `lib/error-diagnostics.ts`, `lib/affordance-normalizer.ts`, `lib/source-cache.ts`, `lib/freshness/cache-invalidation.ts`, `lib/freshness/generation.ts`, `lib/freshness/rebuild-from-source.ts`, `lib/lifecycle/rollback.ts`, `lib/lifecycle/schema-migration.ts`, `lib/derived/anti-stuffing.ts`, `lib/derived/provenance.ts` (referenced via grep), `lib/derived/sync.ts`, `lib/derived/trust-lanes.ts`, `lib/scorer/ablation.ts`, `lib/scorer/ambiguity.ts`, `lib/scorer/attribution.ts`, `lib/scorer/lanes/graph-causal.ts`, `lib/scorer/lanes/semantic-shadow.ts`, `lib/scorer/text.ts`, `lib/scorer/types.ts`, `lib/scorer/weights-config.ts`, `lib/daemon/lease.ts`, `lib/prompt-policy.ts`, `lib/compat/redirect-metadata.ts`, `tools/*.ts` (4), most of `tests/`, `schemas/{daemon-status,generation-metadata,skill-derived-v2}.ts`, 4 of 7 bench files. Inferences for these are based on grep evidence (header coverage, no `any`, error-formatting duplication, etc.) and explicit cross-references in the files I did read; no per-line evidence is claimed for them.

### Cross-cutting sweeps performed

- Module-header presence: `head -2 *.ts | grep "^// MODULE:"` → 96/99 production files compliant; 3 test files missing (acceptable per SKILL.md §3).
- `any` usage: `grep ": any\|<any>\|as any"` → **0 hits** across all source.
- Untyped catch: `grep "catch (e)\|catch (error)\b"` → 3 hits, all in `bench/` and `tests/hooks/` (acceptable for non-production paths).
- TODO/FIXME/HACK: **0 hits**.
- console.\*: confined to `bench/` and `tests/legacy/` (acceptable).
- Numeric magic constants in scorer: counted and assessed.
- Helper-duplication signature patterns: `findWorkspaceRoot`, `isRecord`, `readJson`, `stringArray`, `tokenize`, `error instanceof Error ? error.message : String(error)`.

---

## 3. FINDINGS BY AREA

### 3.1 handlers/

**P1 — Duplicated `findWorkspaceRoot` helper.** Identical (or near-identical) workspace-root walk-up logic appears in multiple files:
- `handlers/advisor-recommend.ts:28-37` (start = `process.cwd()`, depth = 12).
- `handlers/advisor-validate.ts:104-111` (start = `dirname(fileURLToPath(import.meta.url))`, depth = 14).
- `tests/handlers/advisor-recommend.vitest.ts:92-101` (renamed `expectedWorkspaceRoot`, but byte-for-byte the same as the production version it tests against).
- `tests/parity/python-ts-parity.vitest.ts:25` (separate copy).

**Fix:** Extract `findAdvisorWorkspaceRoot(start?: string, opts?: { maxDepth?: number; sentinel?: string })` to `lib/utils/workspace-root.ts`. Use the same shape that `code_graph/lib/utils/workspace-path.ts` already models. Tests should import the production helper rather than re-implement it.

**P1 — Duplicated `error instanceof Error ? error.message : String(error)` pattern.** Hits in production code:
- `handlers/advisor-status.ts:151`.
- `lib/freshness/rebuild-from-source.ts:27,49`.
- `lib/daemon/watcher.ts:102,438,454`.
- `lib/normalize-adapter-output.ts` (referenced in helpers).
- `bench/code-graph-query-latency.bench.ts:121` (acceptable — bench scope).

That's 6 production hits. **Fix:** Add `errorMessage(error: unknown): string` to `lib/utils/error-format.ts`; replace inline ternary with the helper.

**P2 — Long handler functions in `handlers/advisor-recommend.ts`.** `computeRecommendationOutput` (lines 162–236) and `handleAdvisorRecommend` (238–254) live in the same module; the former is 75 lines and threads through cache+threshold+output assembly. It is correctly factored into named helpers (`emptyOutput`, `disabledOutput`, `absentOutput`, `publicRecommendation`, `cacheSourceSignature`, `recommendationLabels`) and is readable, but the inline cache-key assembly (lines 174–186) and the conditional warnings/abstain-reasons spread (lines 223–226) are repeated logic that could be a `buildScoredOutput()` function. Suggestion only.

**P2 — `advisor-validate.ts` mixes harness and validation logic.** 490 lines, the largest handler. It contains the corpus loader, regression-case loader, Python parity script (inline as a string, lines 203–216), holdout sampling, threshold semantics, fixture builders, and the public `validateAdvisor` orchestrator. The Python-script-as-string is a maintenance liability — if `analyze_prompt`'s signature changes, the breakage is a runtime error, not a compile error. **Fix (suggestion):** Extract the Python harness into `tests/python/parity-driver.py` and shell out to that file rather than `python3 -c <inline>`.

### 3.2 lib/scorer/

**P1 — Magic-number tuning constants in `fusion.ts`.** `lib/scorer/fusion.ts:108-122` (`confidenceFor`) and `:124-137` (`uncertaintyFor`) contain unnamed numeric thresholds:
- `0.52`, `0.43`, `1.25`, `0.25`, `0.20`, `0.72`, `0.84`, `0.18`, `0.65`, `0.85`, `0.04`, `0.82`, `0.95` for confidence assembly.
- `0.42`, `0.18`, `0.22`, `0.30`, `0.06`, `0.08`, `0.04` for uncertainty.
- Per-skill primary-intent bonuses in `:202-235` use `0.5`, `0.35`, `-0.25`, `-0.18`, `0.45`, `0.05`, etc.

These are clearly tuned (the scorer-calibration.bench.ts implies a calibration loop), but they are not centralized. Two consequences: (1) they are invisible to a future tuning pass — searching for "the confidence floor" requires reading 40 lines of conditionals; (2) they violate the carry-forward pattern from universal_patterns.md ("single source of truth constants — shared rule values live in one module"). **Fix:** Move to `lib/scorer/scoring-constants.ts` (or extend `weights-config.ts`) as a frozen `SCORING_CALIBRATION` record, then reference by name (e.g. `SCORING_CALIBRATION.confidence.derivedDominantBonus`).

**P1 — Duplicated `readJson` and `stringArray` helpers.** Defined identically (modulo formatting) in:
- `lib/derived/extract.ts:73` (`readJson`), `:174` (`stringArray`).
- `lib/scorer/projection.ts:105` (`readJson`), `:95` (`stringArray`), plus `:73-93` `jsonArray`/`jsonObject` for SQLite-cell parsing.

The semantics are subtly different (`extract.ts` parses files; `projection.ts` parses SQLite-cell strings), but both reduce to "parse JSON; assert it's a string-keyed object; otherwise empty". **Fix:** `lib/utils/json-guard.ts` exporting `readJsonObject(filePath)`, `parseJsonObject(raw)`, `parseJsonStringArray(raw)`. Have `extract.ts` and `projection.ts` import from there.

**P1 — Duplicated `splitSkillMarkdown` / `parseSkillMarkdown`.** Two near-identical frontmatter parsers:
- `lib/derived/extract.ts:79-100` (`splitSkillMarkdown` — returns frontmatter + body + keywords).
- `lib/scorer/projection.ts:111-127`+ (`parseSkillMarkdown` — returns name + description + keywords).

Both walk YAML-style frontmatter with the same regex (`/^([A-Za-z0-9_-]+):\s*(.*)$/`), strip surrounding quotes, and extract a `<!-- Keywords: ... -->` block. They diverge in what they return, not in how they parse. **Fix:** Share `lib/utils/skill-markdown.ts` exporting `parseSkillFrontmatter(raw)` returning `{ frontmatter, body, keywords }`; let each caller pluck the fields it needs.

**P2 — `fusion.ts` `primaryIntentBonus` (lines 202–235) is a long if-chain of skill-specific routing biases.** This is data-as-code. Each rule pairs a regex-matched user-intent with `(+bonus)` or `(-penalty)` for one or two skill IDs. The current shape is fine for now (auditability beats elegance for routing rules), but it cohabits with `readOnlyRouteAllowed` (`:173-200`) which is the same shape. **Fix (suggestion):** Co-locate both as a `ROUTING_BIASES: Array<{ pattern: RegExp; rules: Record<string, number> }>` table for centralized inspection — same logic, evaluable in one loop, easier to diff in PRs.

### 3.3 lib/derived/

**Strength.** `lib/derived/sanitizer.ts` is exemplary: tight, well-commented, single source of truth for sanitization version. The `MAX_VALUE_CHARS = 160` constant (line 28), the instruction-shape pattern (29-31), and the boundary-tagged return type (`SanitizedBoundaryValue`) are the carry-forward "single source of truth constants" pattern done right. No findings.

**P2 — Non-null assertion in `lib/derived/extract.ts:164`.** `const current = stack.pop()!;` uses the non-null assertion forbidden by `quality_standards.md` §3 unless justified. The justification comment IS present (line 163: `// stack.length was checked immediately before popping the next directory.`), so this complies with the documented exception. Good. No fix required, but flagging it as the one such case so future reviewers don't open a finding on it.

### 3.4 lib/freshness/ and lib/freshness.ts

**Strength.** `lib/freshness/trust-state.ts` is the gold standard for documentation in this subsystem. The 32-line module preamble (lines 4–32) explicitly enumerates the 5 vocabulary versions (V1–V5), shows the migration map, and marks `TrustState` as `@deprecated` with a TSDoc tag. This is exactly the level of WHY-documentation `universal_patterns.md` §3 calls for.

**P2 — Module preamble exceeds the "max 3 comments per 10 LoC" guideline in `trust-state.ts:1-32`.** This file has ~32 lines of preamble comments before the first import. By strict reading of the policy, that's 32 comment lines per 32 LoC = 100 % comment density. However, the policy carves out an exception for "module-level rationale" implicitly through the `WHY` doctrine, and the content here is genuinely WHY (vocabulary-version archaeology). I'd rule this in compliance, not in violation — flagging only so a stricter reviewer doesn't open it as a P1.

### 3.5 lib/lifecycle/

**Strength.** `lifecycle/age-haircut.ts` (49 lines, fully read) and `lifecycle/archive-handling.ts` (47 lines, fully read) are textbook small-modules: one type block, one core-logic block, no helpers, no magic constants beyond `halfLifeDays = 90` (which is the one parameter you'd want to tune anyway). Both have canonical headers, both expose minimal public APIs, both are pure functions.

**P2 — `archive-handling.ts:22-26` uses string-substring for path classification.** `if (normalized.includes('/z_archive/')) return 'archived';`. This works, but `code_graph/lib/utils/workspace-path.ts:42-50` shows the established pattern: `path.startsWith(workspacePrefix)` with `sep`-aware joining, not substring. The substring form is technically correct for the `'/z_archive/'` literal (it requires both delimiters) but couples to forward-slash separators on Windows. **Fix:** Use `path.sep` or normalize via `path.posix` if the test harness already exercises Windows. Suggestion only — there's no Windows runner today.

### 3.6 lib/daemon/

**Strength.** `lib/daemon/lifecycle.ts` (151 lines) is well-factored: discriminated state-management via the `state` ternary in `status()` (lines 112–118) cleanly maps the 4-state product (`acquired × trustState.state × watcherStatus.quarantinedSkills`) to a single `'live' | 'degraded' | 'unavailable' | 'quarantined'` axis. This is the discriminated-union pattern from `quality_standards.md` §4 done in practice.

**P1 — `lib/daemon/watcher.ts:96` defines `defaultSkillsRoot(workspaceRoot)`** — the 4th occurrence in the codebase (alongside `findWorkspaceRoot`, the bench `workspaceRoot()`, and the test variants). This one returns a different sub-path (`.opencode/skill`) and is the workspace-relative skill root, but the canonicalization step (`resolve(workspaceRoot)`) is duplicated work that `lib/utils/workspace-path.ts` (if it existed for skill-advisor) would absorb. **Fix:** Same as 3.1 P1.

**P2 — Unused import diagnostic.** Did not run a strict linter pass; flagged here as a routine spot-check the verifier should catch.

### 3.7 lib/compat/ and compat/

**Strength.** `compat/index.ts` (9 lines) and `lib/compat/daemon-probe.ts` (66 lines) are textbook entry points: minimal re-exports, defensive fallbacks (`statusReader = input.statusReader ?? readAdvisorStatus`), typed catch (`catch (error: unknown)`). No findings.

### 3.8 bench/

**P1 — `workspaceRoot()` helper duplicated in every bench file.**
- `bench/scorer-bench.ts:23-30`.
- `bench/scorer-calibration.bench.ts:74-...`.
- `bench/code-graph-parse-latency.bench.ts:19-...`.
- `bench/latency-bench.ts:17` (signature-shaped variant).

Each is ~10 lines of identical walk-up logic with a different fallback line. **Fix:** Same `lib/utils/workspace-root.ts` extraction; bench files import.

**P2 — `bench/code-graph-query-latency.bench.ts:120` uses `catch (error)` without explicit type.** The standards (quality_standards.md §3 "Strict Null Checks" and §8 "Typed Error Handling") require `catch (error: unknown)`. Bench is non-production scope, but consistency is cheap. **Fix:** Add `: unknown`.

### 3.9 tests/

**Strength.** Test fixtures use `Record<string, unknown>` for override-bag parameters (`tests/handlers/advisor-recommend.vitest.ts:52`), not `any`. Vitest mocks are typed via `vi.hoisted(() => ({ mockScoreAdvisorPrompt: vi.fn() }))` (lines 9–12), so the test surface is fully typed. The pattern is correct.

**P2 — 3 test files lack the `// MODULE:` header.** Per SKILL.md §3, this is acceptable for `*.test.ts` / `*.vitest.ts` — but 30 of 33 test files DO have the header. To stay consistent with the de-facto in-tree pattern, add headers to:
- `tests/manual-testing-playbook.vitest.ts`.
- `tests/compat/python-compat.vitest.ts`.
- `tests/skill-graph-db.vitest.ts`.

Suggestion only — this is below a hard requirement.

**P2 — `tests/parity/python-ts-parity.vitest.ts:25` re-implements `findWorkspaceRoot`** rather than importing the production helper it's testing. This is a test-quality issue (the test could mask a regression in the production walk-up if both copies drift). **Fix:** Once the helper is centralized (3.1 P1), import it.

### 3.10 schemas/

**Strength.** `schemas/advisor-tool-schemas.ts` uses `z.object({ ... }).strict()` at every boundary, which prevents extra-property attacks at the MCP wire surface. The `AdvisorRecommendInputSchema` (lines 36–46) caps prompt length at 10,000, which matches the universal_patterns.md §6 input-validation guidance for DoS prevention (CWE-400). The DEFER comment (lines 24–35) documenting why `affordances` is intentionally excluded from the public schema is exactly the WHY-not-WHAT comment style §3 calls for.

No findings.

---

## 4. CROSS-CUTTING THEMES (Top 5)

1. **No shared `lib/utils/` module.** The sibling subsystem `code_graph/lib/utils/workspace-path.ts` already models the right pattern (canonicalization + containment checks + assertion variants in one place). `skill_advisor/` lacks this, so the same primitives — workspace-root walk-up, `isRecord`, `readJson`/`stringArray` JSON guards, `error → message` formatting, skill-markdown frontmatter parsing — are duplicated 2–7 times. This is the single highest-value remediation: a `lib/utils/{workspace-root,error-format,json-guard,skill-markdown}.ts` quartet eliminates ~5 P1-tier duplications in one PR.

2. **Magic-number tuning constants in `lib/scorer/fusion.ts` are scattered across functions** (`confidenceFor`, `uncertaintyFor`, `primaryIntentBonus`). They're clearly the output of a calibration pass (the `bench/scorer-calibration.bench.ts` exists), but they aren't centralized. A single `SCORING_CALIBRATION` constant would make the tuning surface auditable and let calibration-bench results be diffed against it directly.

3. **Type-safety discipline is at ceiling.** Zero `: any`, zero `as any`, zero untyped catch in production. Every `unknown` boundary is narrowed via `instanceof Error`, `isRecord`, or `Array.isArray` with a `filter((entry): entry is string => ...)` predicate. Zod is used at every MCP wire boundary. This is the strongest type-safety story I've seen in the codebase. **No remediation; flagged as a strength to protect.**

4. **Module-header coverage is at 96/99 production files** (the 3 misses are all test files, exempt per SKILL.md). All 96 use the canonical 3-line `// MODULE: NAME` form. **No remediation; flagged as a strength.**

5. **Documentation density varies inversely with module size.** Small modules (`age-haircut.ts`, `archive-handling.ts`, `df-idf.ts`, `daemon-probe.ts`) are minimally commented and self-explanatory; large modules (`fusion.ts`, `metrics.ts`, `watcher.ts`, `extract.ts`) have proportionally more inline WHY-comments. The exception is `lib/freshness/trust-state.ts`, which has the gold-standard 32-line vocabulary-archaeology preamble. The pattern is sound but uneven — `fusion.ts:202-235` (`primaryIntentBonus`) would benefit from a similar preamble naming what kind of routing rules live in this table and the criterion for adding a new one.

---

## 5. STRENGTHS

- **Type-safety:** zero `any`, zero unsafe assertions, zero untyped catches in production code. Already meets the highest bar in `quality_standards.md` §3.
- **Module headers:** 96/99 production files compliant with the canonical 3-line `// MODULE: NAME` form. Test exemption is honored.
- **Strict-mode discipline:** no `'use strict'` directives in `.ts` files (correctly delegated to tsconfig per style_guide.md §3).
- **Zod validation at every MCP wire boundary** (`schemas/advisor-tool-schemas.ts`). Prevents extra-property attacks via `.strict()`.
- **Discriminated unions** for state management (`lib/daemon/lifecycle.ts:112-118`, `lib/freshness/trust-state.ts:38-39`). Matches §4 of quality_standards.md.
- **TSDoc-style documentation** on public exports (no `{type}` annotations, just `@param`, `@returns`, `@throws`, `@deprecated`). Compliant with quality_standards.md §7.
- **Deprecation discipline:** `TrustState` is correctly marked `@deprecated` with migration text (`lib/freshness/trust-state.ts:55-62`).
- **Sanitization version pinning:** `SKILL_DERIVED_SANITIZER_VERSION` (referenced from `lib/derived/sanitizer.ts:6`) — matches the carry-forward "single source of truth" pattern.
- **Section organization** uses numbered `// 1. TYPES`, `// 2. CONSTANTS`, `// 3. CORE LOGIC` dividers consistently across larger files (e.g. `lib/derived/extract.ts:14-186`, `lib/lifecycle/age-haircut.ts:7-25`).

---

## 6. REMEDIATION ROADMAP

### Tier A — High value, mechanical (P1)

1. **Create `lib/utils/workspace-root.ts`** exporting `findAdvisorWorkspaceRoot(start?, opts?)`. Replace 4 duplicates in `handlers/advisor-recommend.ts:28`, `handlers/advisor-validate.ts:104`, `tests/handlers/advisor-recommend.vitest.ts:92`, `tests/parity/python-ts-parity.vitest.ts:25`. Update bench files (`bench/scorer-bench.ts:23`, `bench/scorer-calibration.bench.ts:74`, `bench/code-graph-parse-latency.bench.ts:19`) to import the same helper.
2. **Create `lib/utils/error-format.ts`** exporting `errorMessage(error: unknown): string`. Replace ≥7 inline ternaries in `handlers/advisor-status.ts:151`, `lib/freshness/rebuild-from-source.ts:27,49`, `lib/daemon/watcher.ts:102,438,454`, `bench/code-graph-query-latency.bench.ts:121`.
3. **Create `lib/utils/json-guard.ts`** exporting `readJsonObject(path)`, `parseJsonObject(raw)`, `parseJsonStringArray(raw)`. Replace duplicates in `lib/derived/extract.ts:73,174` and `lib/scorer/projection.ts:73,83,95,105`. Co-locate `isRecord` here (currently duplicated in `lib/normalize-adapter-output.ts:31` and `lib/subprocess.ts:99`).
4. **Create `lib/utils/skill-markdown.ts`** exporting `parseSkillFrontmatter(raw)`. Replace `splitSkillMarkdown` in `lib/derived/extract.ts:79-100` and `parseSkillMarkdown` in `lib/scorer/projection.ts:111-...`.

### Tier B — Higher-effort, observability gain (P1)

5. **Centralize scorer calibration constants.** Extract `lib/scorer/fusion.ts:108-235` magic numbers into `lib/scorer/scoring-constants.ts` (or extend `weights-config.ts`) as a frozen `SCORING_CALIBRATION` record. Update `confidenceFor`, `uncertaintyFor`, `primaryIntentBonus` to reference by name.

### Tier C — Polish (P2)

6. Add `// MODULE: ...` headers to the 3 test files missing them (`tests/manual-testing-playbook.vitest.ts`, `tests/compat/python-compat.vitest.ts`, `tests/skill-graph-db.vitest.ts`).
7. Type the lone untyped catch in `bench/code-graph-query-latency.bench.ts:120` as `catch (error: unknown)`.
8. Consider extracting the inline Python parity script in `handlers/advisor-validate.ts:203-216` into `tests/python/parity-driver.py` so signature drift surfaces as an import-time failure, not a runtime one.
9. Add a WHY-preamble to `lib/scorer/fusion.ts:202` (`primaryIntentBonus`) explaining what kind of rules live there and the criterion for adding new ones — same shape as `lib/freshness/trust-state.ts:1-32`.

### Tier D — Defer / suggestion only

10. Co-locate `readOnlyRouteAllowed` (`fusion.ts:173-200`) and `primaryIntentBonus` (`fusion.ts:202-235`) into a single `ROUTING_BIASES` table for centralized inspection.

---

## 7. ADVERSARIAL SELF-CHECK

I have no P0 findings, so the per-finding adversarial validation runs over each P1 instead.

| Finding (P1) | File:line | Hunter severity | Skeptic challenge | Referee verdict | Final |
|---|---|---|---|---|---|
| `findWorkspaceRoot` duplicated | `handlers/advisor-recommend.ts:28`, `handlers/advisor-validate.ts:104`, `tests/handlers/advisor-recommend.vitest.ts:92`, `tests/parity/python-ts-parity.vitest.ts:25` | P1 | "Are the depth/start-dir differences load-bearing?" Yes — `:28` walks from cwd, `:104` walks from module dir. But the 12-iteration cap and `.opencode/skill` sentinel are identical. The per-call shape is parametrizable, not divergent. Skeptic disproved. | CONFIRMED. | P1 |
| `error → message` ternary duplicated | 6+ production sites listed §3.1 | P1 | "Is each call site contextually different (logging vs throwing vs returning)?" The contexts vary, but the ternary itself is byte-identical. The refactor is `errorMessage(error)` — one line change per site. | CONFIRMED. | P1 |
| `readJson` / `stringArray` duplicated | `lib/derived/extract.ts:73,174` vs `lib/scorer/projection.ts:95,105` | P1 | "Are file-vs-string parsing semantics genuinely different?" Yes — one parses `readFileSync` output, the other parses SQLite-cell strings. But the post-parse object-shape guard is identical. A unified `parseJsonObject(raw: string)` plus a thin `readJsonObject(path)` wrapper covers both. Skeptic partially valid but doesn't dissolve the duplication. | CONFIRMED, downgrade-resistant. | P1 |
| `splitSkillMarkdown` / `parseSkillMarkdown` near-duplicate | `lib/derived/extract.ts:79`, `lib/scorer/projection.ts:111` | P1 | "Are the return shapes different enough to justify two functions?" Yes — different fields. But the parsing logic (frontmatter regex, quote-stripping, keyword-block extraction) is identical. Share the parser, not the return shape. | CONFIRMED. | P1 |
| Scorer magic numbers scattered | `lib/scorer/fusion.ts:108-235` | P1 | "Is naming them just bikeshedding?" No — `bench/scorer-calibration.bench.ts` exists, which means the numbers ARE being calibrated. A calibration pass without named targets is harder to diff in PRs and harder to roll back. The carry-forward pattern from universal_patterns.md §3 ("single source of truth constants") explicitly addresses this. | CONFIRMED. | P1 |
| Bench `workspaceRoot()` duplicated | `bench/scorer-bench.ts:23`, `bench/scorer-calibration.bench.ts:74`, `bench/code-graph-parse-latency.bench.ts:19` | P1 | "Bench scope is hands-off; does this matter?" Yes — once the production helper is centralized (Tier A.1), the bench scripts should use the same helper, otherwise calibration runs and prod resolve different roots. | CONFIRMED. | P1 |
| `defaultSkillsRoot` in watcher.ts:96 | `lib/daemon/watcher.ts:96` | P1 | "Is this the same shape as `findWorkspaceRoot` or different?" Different — it returns `${root}/.opencode/skill`, not the workspace root. But it still calls `resolve(workspaceRoot)`, which is the canonicalization step the central helper would absorb. | CONFIRMED, but smaller blast radius. Mark as Tier A.1 follow-on. | P1 |

All P1 findings stand. No phantom issues; no severity inflation detected.

---

`AUDIT_DONE total_findings 13 P0=0 P1=7 P2=6 verdict=PASS files_sampled=29/99`
