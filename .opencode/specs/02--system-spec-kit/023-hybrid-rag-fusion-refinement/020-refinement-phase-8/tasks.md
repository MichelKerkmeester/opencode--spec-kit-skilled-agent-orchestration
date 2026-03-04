---
title: "Tasks: Scripts vs mcp_server Architecture Refinement [template:level_3/tasks.md]"
description: "Atomic tasks for boundary clarity, dependency direction cleanup, and documentation consolidation."
SPECKIT_TEMPLATE_SOURCE: "tasks-core | v2.2"
trigger_phrases:
  - "architecture tasks"
  - "boundary actions"
  - "scripts mcp_server tasks"
importance_tier: "critical"
contextType: "architecture"
---
# Tasks: Scripts vs mcp_server Architecture Refinement

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

## Task Notation
<!-- ANCHOR:notation -->

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### Action (single path) - WHY - Acceptance`
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-0 -->
## Phase 0: Pipeline Infrastructure (Prerequisite)

- [x] T000 Add `lint` and `check` scripts to `.opencode/skill/system-spec-kit/scripts/package.json` - WHY: Phase 3 enforcement (T015-T017) assumes a lint/check pipeline that does not currently exist; `scripts/package.json` only has `"build": "tsc --build"` - Acceptance: `npm run check` executes successfully and can host import-policy checks.
<!-- /ANCHOR:phase-0 -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Contract and Discoverability

- [x] T001 Create `.opencode/skill/system-spec-kit/ARCHITECTURE_BOUNDARIES.md` - WHY: no canonical ownership contract exists - Acceptance: runtime vs scripts matrix + allowed/forbidden dependency directions documented.
- [x] T002 Create `.opencode/skill/system-spec-kit/mcp_server/api/README.md` - WHY: public API boundary is implicit in comments only - Acceptance: API surface and consumer policy documented.
- [x] T003 Create `.opencode/skill/system-spec-kit/scripts/evals/README.md` - WHY: eval scripts mix API and internal imports - Acceptance: import policy with exception process documented.
- [x] T004 Update `.opencode/skill/system-spec-kit/mcp_server/scripts/README.md` - WHY: compatibility wrapper intent is easy to misread - Acceptance: heading/scope explicitly says compatibility wrappers only.
- [x] T005 Update `.opencode/skill/system-spec-kit/scripts/memory/README.md` - WHY: reindex runbook should have single canonical owner - Acceptance: canonical runbook section present.
- [x] T006 Update `.opencode/skill/system-spec-kit/mcp_server/database/README.md` - WHY: duplicate runbook details drift - Acceptance: pointer to canonical runbook replaces duplicate procedural detail.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Structural Cleanup

- [x] T007 Create `.opencode/skill/system-spec-kit/shared/utils/token-estimate.ts` - WHY: repeated chars/4 estimator logic across modules - Acceptance: shared helper exported and documented.
- [x] T008 Update `.opencode/skill/system-spec-kit/scripts/core/tree-thinning.ts` - WHY: local token estimation duplicates shared concern - Acceptance: imports and uses shared token-estimate helper.
- [x] T009 Update `.opencode/skill/system-spec-kit/mcp_server/formatters/token-metrics.ts` - WHY: local token estimation duplicates shared concern - Acceptance: imports and uses shared token-estimate helper.
- [x] T010 Create `.opencode/skill/system-spec-kit/shared/parsing/quality-extractors.ts` - WHY: quality extraction logic duplicated between scripts and runtime parser - Acceptance: shared extractor API added.
- [x] T011 Update `.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts` - WHY: scripts quality extraction drift risk - Acceptance: uses shared quality extractor implementation.
- [x] T012 Update `.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts` - WHY: runtime parser quality extraction drift risk - Acceptance: uses shared quality extractor implementation.
- [x] T013a Extract `escapeLikePattern` from `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts` → `handlers/handler-utils.ts` - WHY: memory-save.ts (1520 LOC) is a god object contributing to the handler cycle; extracting shared utilities reduces coupling - Acceptance: `escapeLikePattern` importable from `handler-utils.ts`, memory-save no longer exports it.
- [x] T013b Extract `detectSpecLevelFromParsed` from `.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts` → `handlers/handler-utils.ts` - WHY: causal-links-processor participates in handler cycle through shared utility imports - Acceptance: utility moved to handler-utils, one cycle edge removed.
- [x] T013c Run static cycle detection to verify zero remaining handler cycles - WHY: confirms T013a/b achieved the goal - Acceptance: import analysis shows no circular dependency path through handler modules.
- [x] T014 Update consumer imports across handler modules to use `handler-utils.ts` - WHY: complete the cycle-breaking refactor - Acceptance: dependency graph confirms cycle no longer exists, all handler imports resolve correctly.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-2-cleanup -->
## Phase 2b: Cleanup and Documentation Gaps

- [x] T018 Clean stale `retry-manager` references from `scripts/lib/README.md` and `scripts/scripts-registry.json` - WHY: inventory lists a file that no longer exists, amplifying boundary ambiguity - Acceptance: no references to `retry-manager` remain in scripts lib docs or registry (or explicitly marked as moved).
- [x] T019 Create/update `.opencode/skill/system-spec-kit/shared/README.md` with boundary documentation - WHY: shared/ is the consolidation target for T007/T010 but has no ownership or import-policy docs - Acceptance: README documents shared module purpose, ownership, and consumer expectations before new modules are added.
- [x] T020 Document embeddings shim consolidation (`scripts/lib/embeddings.ts` + `mcp_server/lib/providers/embeddings.ts`) - WHY: both files re-export `@spec-kit/shared/embeddings` with near-identical purpose, creating confusion about which to import - Acceptance: one canonical shim identified, the other marked as deprecated or removed.
<!-- /ANCHOR:phase-2-cleanup -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Enforcement

- [x] T015 Create `.opencode/skill/system-spec-kit/scripts/evals/import-policy-allowlist.json` - WHY: controlled migration exceptions need explicit ownership - Acceptance: each exception has owner and removal condition.
- [x] T016 Create `.opencode/skill/system-spec-kit/scripts/evals/check-no-mcp-lib-imports.ts` - WHY: prevent new `@spec-kit/mcp-server/lib/*` coupling - Acceptance: script fails on violations outside allowlist.
- [x] T017 Update `.opencode/skill/system-spec-kit/scripts/package.json` - WHY: guardrail must run automatically - Acceptance: check script integrated into standard lint/check pipeline.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:phase-4 -->
## Phase 4: Review Remediation (Triple Ultra-Think Findings)

Addresses findings from the triple ultra-think cross-AI review performed 2026-03-04 by Claude Opus 4.6, Gemini 3.1 Pro Preview, and Codex 5.3.

### P0 Blockers

- [x] T021 Integrate `scripts/check-api-boundary.sh` into `scripts/package.json` `check` script - WHY: `check-api-boundary.sh` is documented as enforcement tool in ARCHITECTURE_BOUNDARIES.md but not in the npm pipeline; creates enforcement asymmetry where only one boundary direction is protected [Claude + Codex] - Acceptance: `npm run check` runs both `check-no-mcp-lib-imports.ts` AND `check-api-boundary.sh`. [DONE: appended `&& bash check-api-boundary.sh` to check script; `npm run check` passes all 3 stages]
- [x] T022 Add `scripts/memory/reindex-embeddings.ts` exception to `ARCHITECTURE_BOUNDARIES.md` Current Exceptions table - WHY: boundary contract lists 5 exceptions but allowlist has 6; the missing entry has a broad `lib/*` wildcard scope [Claude + Codex cross-validated: CV-3] - Acceptance: exception table matches `import-policy-allowlist.json` exactly. [DONE: row added to Current Exceptions table]
- [x] T023 Expand `PROHIBITED_PATTERNS` in `check-no-mcp-lib-imports.ts` to cover `@spec-kit/mcp-server/core/*` - WHY: checker only enforces `lib/*` but architecture intent says scripts should ONLY use `api/*`; `core/*` paths bypass detection entirely [Codex + Claude cross-validated: CV-2] - Acceptance: `core/*` imports in scripts trigger violations. [DONE: 2 package-form + 2 relative patterns added for core/*; existing core/config allowlist entry covers memory-indexer.ts]

### P1 Should-Fix

- [x] T024 Add dynamic `import()` expression detection to `check-no-mcp-lib-imports.ts` - WHY: `await import('@spec-kit/mcp-server/lib/x')` completely evades regex detection [Codex CRITICAL C-1] - Acceptance: dynamic imports of forbidden paths are detected as violations. [DONE: 2 dynamic import patterns added for lib/ and core/]
- [x] T025 Add additional relative path variant patterns to `PROHIBITED_PATTERNS` - WHY: only `../../mcp_server/lib/` is matched; `../mcp_server/lib`, `../../../mcp_server/lib`, and deeper paths bypass [Codex CRITICAL C-2] - Acceptance: all relative path depths to `mcp_server/lib/` are detected. [DONE: variable-depth `\.\.(?:\/\.\.)*` patterns replace fixed `../../`; covers lib/ and core/]
- [x] T026 Update `shared/README.md` structure tree and Key Files table with Phase 8 modules - WHY: `utils/token-estimate.ts` and `parsing/quality-extractors.ts` are omitted from the README that's supposed to document shared modules [Claude MAJOR F-M1] - Acceptance: both files appear in structure tree and Key Files table. [DONE: both entries added to structure tree and Key Files table]
- [x] T027 Add allowlist governance fields to `import-policy-allowlist.json` schema - WHY: no TTL/expiry enforcement; `removeWhen` is free-text only; missing `approvedBy`, `createdAt`, `expiresAt`, `lastReviewedAt` [Codex MAJOR C-G1/C-G3] - Acceptance: schema includes governance fields; existing entries have created dates. [DONE: `createdAt`, `lastReviewedAt`, `expiresAt` added to interface and all JSON entries]
- [x] T028 Ban or sunset wildcard exceptions in `import-policy-allowlist.json` - WHY: `@spec-kit/mcp-server/lib/*` wildcards allow very broad bypass and hide new internal dependencies [Codex MAJOR C-G2] - Acceptance: wildcards replaced with explicit module lists OR given short expiry dates. [DONE: wildcards given `expiresAt: 2026-06-04` (90-day sunset)]
- [x] T029 Update `scripts/evals/README.md` Current Exception section to include `run-chk210-quality-backfill.ts` - WHY: README only mentions 1 of 2 eval-scope exceptions [Claude MINOR F-m5] - Acceptance: both eval-scope exceptions documented. [DONE: both exceptions listed]

### P2 Nice-to-Have

- [x] T030 Add block comment (`/* */`) tracking to `check-no-mcp-lib-imports.ts` - WHY: only `//` comments skipped; block comments can trigger false positives [Gemini + Codex cross-validated: CV-1] - Acceptance: prohibited imports inside block comments are not flagged. [DONE: block comment state machine added to scanFile(); included as P1 bonus in Wave 2]
- [x] T031 Add behavioral tests for `shared/parsing/quality-extractors.ts` edge cases - WHY: CHK-021 claims parity tests but evidence is only `tsc --noEmit`; regex edge cases for flag names with internal quotes remain untested [Gemini MINOR G-m1 + Claude MINOR F-m3] - Acceptance: test file with edge cases (empty input, quoted flags, multiline blocks). [DONE: `quality-extractors.test.ts` created with 18 assertions covering 13 edge cases — empty input, no frontmatter, valid scores, clamping, NaN, body-text isolation, YAML flags, quoted values, CRLF, whitespace]
- [x] T032 Add bidirectional cross-links from `ARCHITECTURE_BOUNDARIES.md` to consumer READMEs - WHY: consumer READMEs link to boundary doc but not vice versa; CHK-110 claims bidirectional but links are unidirectional [Claude MINOR F-m4] - Acceptance: ARCHITECTURE_BOUNDARIES.md has navigable links to `mcp_server/api/README.md` and `scripts/evals/README.md`. [DONE: "Related Documentation" section added with links to `mcp_server/api/README.md`, `scripts/evals/README.md`, `shared/README.md`]
- [x] T033 Define growth policy for `mcp_server/handlers/handler-utils.ts` - WHY: module currently holds 2 extracted functions; could become a catch-all without guidance [Claude MINOR F-m6] - Acceptance: module header comment defines when to add vs. when to split.
- [x] T034 Evaluate AST-based parsing upgrade for enforcement script - WHY: regex-based static analysis has inherent limitations (multi-line, dynamic imports, computed paths); TypeScript compiler API or `@typescript-eslint/typescript-estree` would be robust [Codex P0 recommendation] - Acceptance: evaluation document with pros/cons and effort estimate. [DONE: `scratch/ast-parsing-evaluation.md` created with pros/cons/effort for TypeScript Compiler API vs typescript-estree vs keep regex]
- [x] T035 Add transitive dependency checks for re-export evasion - WHY: scripts can import a local barrel file that re-exports forbidden mcp_server internals; checker only inspects direct import strings [Codex MAJOR C-5] - Acceptance: import graph analysis detects transitive boundary violations. [DONE: `scanTransitiveViolations()`, `findForbiddenReExports()`, `resolveLocalImportTarget()` added to `check-no-mcp-lib-imports.ts`; 1-hop transitive checking resolves local imports and scans targets for prohibited re-exports]
- [x] T036 Update `decision-record.md` ADR-003 Five Checks to mention token estimation alongside quality extractors - WHY: ADR-003 only names quality extractors but token estimation was also consolidated [Claude MINOR F-m2] - Acceptance: Five Checks item 1 mentions both concerns. [DONE: ADR-003 context and Five Checks updated to reference both `estimateTokenCount` and quality extractors consolidation]
- [x] T037 Add deprecation/removal criteria documentation for compatibility wrappers and allowlist entries - WHY: CHK-042 [P2] was deferred; review confirms governance gap [Codex C-G1] - Acceptance: CHK-042 verifiable with documented criteria. [DONE: "Wrapper Removal Criteria" and "Allowlist Removal Criteria" sections added to ARCHITECTURE_BOUNDARIES.md with explicit sunset and expiry governance]
- [x] T038 Run `validate.sh --recursive` and fix any remaining validation issues - WHY: CHK-112 [P2] was deferred; ensures spec folder docs pass structural validation - Acceptance: CHK-112 verifiable with passing exit code. [DONE: `validate.sh --recursive 020-refinement-phase-8` → 0 errors, 0 warnings, PASSED]

### Agent 4 Findings (Codex 5.3 Code Quality — P0/P1)

- [x] T039 [P0] Fix `escapeLikePattern` in `handler-utils.ts` to escape backslash before `%`/`_` - WHY: with `ESCAPE '\'`, unescaped `\` can alter LIKE semantics; potential SQL safety issue [Codex Agent 4 MAJOR] - Acceptance: backslash is escaped first; LIKE queries with backslash input produce correct results. [DONE: `.replace(/\\\\/g, '\\\\\\\\')` prepended to escape chain]
- [x] T040 [P1] Constrain `extractQualityScore` and `extractQualityFlags` to YAML frontmatter boundaries - WHY: `quality_score:` in body text/code blocks can be parsed as metadata; `extractQualityFlags` block capture can overrun [Codex Agent 4 MAJOR x2] - Acceptance: quality extraction only matches within frontmatter delimiters (`---`). [DONE: `extractFrontmatter()` helper added; both functions search within frontmatter first, fallback to full content]
- [x] T041 [P1] Add deterministic ordering to causal reference resolution LIKE queries - WHY: ambiguous LIKE without `ORDER BY` can link wrong memory when multiple rows match [Codex Agent 4 MAJOR] - Acceptance: `ORDER BY` clause added; exact-match takes precedence over LIKE. [DONE: `ORDER BY id DESC LIMIT 1` added to all 3 LIKE queries in resolveMemoryReference]
- [x] T042 [P1] Add SQL column allowlist guard to chunking-orchestrator fallback metadata updater - WHY: builds column list from object keys without validation, unlike memory-save.ts helper [Codex Agent 4 MAJOR] - Acceptance: only allowlisted columns are written. [DONE: ALLOWED_METADATA_COLUMNS Set with 18 columns; entries filtered before SQL construction]
- [x] T043 [P1] Add guard for `retainedChunks.length === 0` in chunking-orchestrator - WHY: can produce parent-only partial records with no child vectors [Codex Agent 4 MAJOR] - Acceptance: empty retained chunks handled with explicit error or cleanup. [DONE: early return with status='warning' and descriptive message when retainedChunks is empty]
- [x] T044 [P1] Add finite guard on `similarity / 100` in pe-gating - WHY: invalid provider output can propagate NaN into PE decisions [Codex Agent 4 MAJOR] - Acceptance: NaN/Infinity values default to 0 or trigger warning. [DONE: typeof check + Number.isFinite guard; non-finite values default to 0]
- [x] T045 [P1] Add relative `require('../../mcp_server/lib/...')` detection to enforcement script - WHY: `require()` with relative paths to mcp_server/lib is not blocked; only package-form `require('@spec-kit/...')` is covered [Codex Agents 3+4 cross-validated: CV-5] - Acceptance: relative require paths trigger violations. [DONE: 2 variable-depth relative require patterns added for lib/ and core/]
<!-- /ANCHOR:phase-4 -->

<!-- ANCHOR:phase-5 -->
## Phase 5: Architecture Enforcement Gaps

Closes two documentation-only rules in ARCHITECTURE_BOUNDARIES.md that had no automated enforcement.

- [x] T046 Create `.opencode/skill/system-spec-kit/scripts/evals/check-architecture-boundaries.ts` with shared/ neutrality + wrapper-only checks - WHY: two boundary rules (shared/ must not import mcp_server/scripts; mcp_server/scripts/ must be wrappers only) are not enforced and could regress silently - Acceptance: script detects violations in both categories and exits non-zero. [DONE: `check-architecture-boundaries.ts` created with GAP A (shared/ neutrality) and GAP B (wrapper-only) checks; violations exit non-zero]
- [x] T047 Integrate `check-architecture-boundaries.ts` into `npm run check` pipeline - WHY: enforcement must be automatic, not manual - Acceptance: `npm run check` runs all 4 stages including new checker. [DONE: `scripts/package.json` check pipeline updated with 4th stage `npx tsx evals/check-architecture-boundaries.ts`]
- [x] T048 Update `ARCHITECTURE_BOUNDARIES.md` enforcement table with new checker - WHY: enforcement tooling must be discoverable in the boundary contract - Acceptance: table row added for `check-architecture-boundaries.ts`. [DONE: enforcement table includes new `check-architecture-boundaries.ts` row]
- [x] T049 Update `scripts/evals/README.md` script inventory with new checker - WHY: eval script inventory must be complete - Acceptance: new script listed in inventory table. [DONE: script inventory updated with `check-architecture-boundaries.ts` entry]
<!-- /ANCHOR:phase-5 -->

<!-- ANCHOR:phase-6 -->
## Phase 6: Feature Catalog Parity (Audit-Driven)

Adds the complete remediation plan from the phase-wide implementation audit across feature catalog groups 01-18.

### Code Fixes (Behavioral First)

- [x] T050 Fix cognitive-limit leak in `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts` - WHY: cognitive path can return more than requested `limit`, violating tool contract - Acceptance: response count never exceeds caller `limit` across cognitive/non-cognitive branches. [DONE: cognitive path now passes caller limit to state filter; covered by `tests/handler-memory-triggers.vitest.ts`]
- [x] T051 Add per-channel try/catch isolation in `.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts` - WHY: one channel failure currently aborts full ablation run - Acceptance: failed channels are reported, successful channels still produce output. [DONE: per-channel isolation + `channelFailures` reporting; covered by `tests/ablation-framework.vitest.ts`]
- [x] T052 Enforce shadow-period semantics in `.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts` for write path - WHY: shadow mode should be log-only end-to-end - Acceptance: no learned-trigger persistence/effect during shadow period. [DONE: shadow-mode write path is log-only; covered by `tests/learned-feedback.vitest.ts`]
- [x] T053 Remove learned-feedback double weighting across `.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts` and `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts` - WHY: 0.7x is effectively applied twice - Acceptance: single intended weighting is applied and covered by tests. [DONE: removed second scaling in Stage 2; covered by `tests/stage2-fusion.vitest.ts`]
- [x] T054 Process `toDelete` category in `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts` (with support in `.opencode/skill/system-spec-kit/mcp_server/lib/storage/incremental-index.ts`) - WHY: deleted files are categorized but not consumed - Acceptance: removed files are purged from index state during incremental scan. [DONE: stale-path delete flow wired with success/failure counters; covered by `tests/incremental-index-v2.vitest.ts` and `tests/handler-memory-index-cooldown.vitest.ts`]
- [x] T055 Align promotion thresholds to positive-validation semantics in `.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts` and `.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts` - WHY: thresholds are currently influenced by total validation count - Acceptance: threshold counters and docs consistently reflect positive validations only. [DONE: promotion eligibility now uses positive validations; covered by `tests/promotion-positive-validation-semantics.vitest.ts`]
- [x] T056 Wire per-channel eval events using `.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-logger.ts` from runtime handlers - WHY: `logChannelResult` exists but has no runtime callsite - Acceptance: channel-level rows are emitted when eval logging is enabled. [DONE: runtime channel logging added in search/context handlers; covered by `tests/memory-search-eval-channels.vitest.ts` and `tests/memory-context-eval-channels.vitest.ts`]
- [x] T057 Finalize and enforce `memory_search.limit` contract in `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts` (and corresponding runtime docs) - WHY: docs and schema disagree (100 vs 50) - Acceptance: one authoritative limit value is implemented and documented. [DONE: schema enforces `positiveIntMax(100)`, runtime clamps to 100 in `handlers/memory-search.ts`, and public tool docs specify `minimum: 1, maximum: 100` in `mcp_server/tool-schemas.ts`]
- [x] T058 Add targeted regression tests for T050-T057 in `.opencode/skill/system-spec-kit/mcp_server/tests/` - WHY: prevent contract regressions after parity fixes - Acceptance: new tests fail before and pass after fixes. [DONE: targeted suites for T050-T057 present; `tool-input-schema.vitest.ts` includes limit<=100 contract tests]

### Documentation Alignment (Current Reality Sweep)

- [x] T059 Update `.opencode/specs/02--system-spec-kit/023-hybrid-rag-fusion-refinement/feature_catalog/feature_catalog.md` and retrieval snippets to remove stale `SPECKIT_PIPELINE_V2` fallback wording - WHY: runtime is V2-only - Acceptance: docs no longer describe unavailable legacy fallback behavior. [DONE: canonical + retrieval snippets state V2 as sole runtime path and mark legacy gate inert/deprecated]
- [x] T060 Align MPAB stage-placement docs in `feature_catalog.md` and relevant phase snippets - WHY: documented stage differs from runtime call path - Acceptance: stage placement description matches implemented path. [DONE: MPAB documented as Stage 3 (rerank/aggregate) in canonical + `14-pipeline-architecture/02-mpab-chunk-to-memory-aggregation.md`]
- [x] T061 Align normalization docs in `feature_catalog.md` and phase snippets with actual embedding/BM25 behavior - WHY: docs describe divergence not present in code - Acceptance: narrative reflects shared normalization pipeline as implemented. [DONE: canonical + mutation/indexing snippets now reflect shared normalizer helper behavior and live BM25 save-path tokenization]
- [x] T062 Align lifecycle docs in `feature_catalog.md` and phase snippets for `memory_bulk_delete`/checkpoint restore semantics - WHY: current text overstates unconditional checkpointing and full vec rebuild behavior - Acceptance: wording matches actual guarded/conditional behavior. [DONE: checkpoint docs updated to conditional checkpoint creation (`skipCheckpoint`) and precise restore refresh behavior]
- [x] T063 Align evaluation docs (metric count and edge-density denominator) in `feature_catalog.md` and phase snippets - WHY: docs say 9 metrics and edges/node while code uses 11 metrics and total-memories denominator fallback - Acceptance: metric/denominator wording matches implementation. [DONE: canonical + snippets updated to 11 metrics and `total_edges / total_memories` denominator]
- [x] T064 Align graph/community docs in `feature_catalog.md` and phase snippets with runtime wiring - WHY: docs imply runtime detect/store + graph-cache clear flows that are not wired as stated - Acceptance: docs reflect actual hot-path behavior and invalidation strategy. [DONE: docs now scope Stage 2 to precomputed `community_assignments` usage and non-auto invocation of detect/store helpers]
- [x] T065 Align governance docs in `feature_catalog.md` and phase snippets to actual flag inventory/knobs/caps - WHY: documented caps and counts drift from runtime/tests - Acceptance: governance text matches enforceable behavior. [DONE: governance wording updated to process targets (not hard caps); active helper inventory aligned to 23 in `search-flags.ts`]
- [x] T066 Align eval-logging docs in `feature_catalog.md` and phase snippets - WHY: docs claim async/non-blocking and complete event coverage not fully represented in runtime flow - Acceptance: logging semantics and coverage claims are precise and verifiable. [DONE: docs now describe fail-safe sync writes behind `SPECKIT_EVAL_LOGGING`; channel-row scope clarified for search/context vs trigger]
- [x] T067 Remove stale implementation-detail claims (line-count and call-site attribution drift) across phase snippet markdowns under `.opencode/specs/02--system-spec-kit/023-hybrid-rag-fusion-refinement/feature_catalog/` - WHY: outdated details reduce trust in documentation - Acceptance: no stale implementation-detail mismatches remain. [DONE: stale `~550 lines` and stale `line ~...` call-site attributions removed from canonical + snippet docs]
- [x] T068 Ensure all phase snippet “Current reality source” metadata points to canonical `feature_catalog.md` and no legacy summary-source references remain - WHY: enforce single source of truth - Acceptance: zero references to deprecated summary files; all snippet metadata consistent. [DONE: all snippet metadata points to canonical source; `rg` over feature_catalog shows no legacy summary-source references]

### Memory Quality Gates (Generation-Time Prevention)

- [x] T071 Create `scripts/utils/slug-utils.ts` with content-aware slug generation (`slugify`, `truncateSlugAtWordBoundary`, `generateContentSlug`) - WHY: all memory filenames use generic spec-folder-name slug, producing 51 identically-named files - Acceptance: `generateContentSlug(task, fallback)` returns task-based slug when available, falls back to folder name. [DONE: slug-utils.ts created with GENERIC_SLUGS blocklist, 8-char minimum, 50-char word-boundary truncation]
- [x] T072 Add empty content gate (`validateContentSubstance`) and duplicate detection (`checkForDuplicateContent`) to `scripts/core/file-writer.ts` - WHY: 21 SGQS-template duplicates and 5 empty sessions were written to disk unchecked - Acceptance: files with <200 chars substance or matching SHA-256 hash throw before write. [DONE: both functions added to writeFilesAtomically; strips frontmatter/anchors/headings before measuring substance]
- [x] T073 Integrate content slug in `scripts/core/workflow.ts` (line 580-581) - WHY: filename generation uses `folderBase` ignoring available `implSummary.task` - Acceptance: `ctxFilename` uses `generateContentSlug(implSummary.task, folderBase)` instead of `folderBase`. [DONE: import added, slug swap at line 581]

### Re-Verification and Closure

- [x] T069 Re-run 5-agent audit across feature catalog groups 01-18 and capture severity-ordered findings in this phase folder scratch artifacts - WHY: verify remediation completeness objectively - Acceptance: no unresolved HIGH findings and all MEDIUM findings either fixed or explicitly accepted. [DONE: 5 audit artifacts added: `scratch/t069-audit-agent-{1..5}-*.md` + `scratch/t069-audit-summary.md`; unresolved HIGH=0, unresolved MEDIUM=0]
- [x] T070 Update this phase folder (`plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`) with closure evidence for T050-T069 - WHY: maintain audit trail and handover quality - Acceptance: docs reflect final status with command/file evidence. [DONE: phase docs updated with closure status, evidence pointers, and verification command outputs]
<!-- /ANCHOR:phase-6 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All P0 boundary documentation tasks completed (Phases 0-3).
- [x] Handler cycle concern resolved and verified.
- [x] Import-policy guardrail enabled by default.
- [x] Checklist updated with evidence for completed items.
- [x] Triple ultra-think review P0 blockers resolved (Phase 4 T021-T023, T039). [DONE: all 4 P0 blockers implemented and verified]
- [x] Review P1 should-fix items completed or user-approved deferral (T024-T029, T040-T045). [DONE: all 12 P1 items implemented]
- [x] Review P2 nice-to-have items completed or documented deferral (T030-T038). [DONE: all 9 P2 items completed — T030 block comments, T031 behavioral tests, T032 cross-links, T033 growth policy, T034 AST evaluation, T035 transitive deps, T036 ADR-003 update, T037 deprecation criteria, T038 validation]
- [x] Phase 5 architecture enforcement gaps completed (T046-T049). [DONE: checker implemented, check pipeline extended to 4 stages, boundary enforcement table and eval inventory updated]
- [x] Phase 6 feature-catalog parity remediation completed (T050-T073). [DONE: behavior + doc parity + memory-quality gates + 5-agent re-audit closure recorded]
<!-- /ANCHOR:completion -->

## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Verification Checklist**: `checklist.md`
- **Decision Records**: `decision-record.md`
