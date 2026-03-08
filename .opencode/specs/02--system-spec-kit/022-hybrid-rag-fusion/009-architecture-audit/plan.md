---
title: "Implementation Plan: Scripts vs mcp_server Architecture Refinement + Boundary Remediation [template:level_3/plan.md]"
description: "Execution plan for boundary clarification, remediation, and merged continuation work from former spec 030."
SPECKIT_TEMPLATE_SOURCE: "plan-core | v2.2"
trigger_phrases:
  - "boundary plan"
  - "architecture refinement"
  - "scripts mcp_server"
  - "phase 8 plan"
importance_tier: "critical"
contextType: "architecture"
---
# Implementation Plan: Scripts vs mcp_server Architecture Refinement + Boundary Remediation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

## 1. SUMMARY
<!-- ANCHOR:summary -->

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Node.js, shell scripts, markdown docs |
| **Framework** | system-spec-kit tooling + mcp_server runtime |
| **Storage** | SQLite memory/index stores (existing runtime concern) |
| **Testing** | lint/policy checks, targeted dependency checks, existing Vitest suites |

### Overview
The plan prioritizes high-value low-risk changes first: architecture contract documentation and import-policy guardrails. After boundary expectations are explicit and enforceable, structural cleanup actions (duplicate helper consolidation and cycle breaking) can be implemented in smaller, verifiable increments.

The former `009-architecture-audit` scope is merged into this plan as Phase 7 carry-over execution.
Task #17 follow-up evidence added a post-closure Phase 9: the generic memory naming regression belonged in naming candidate selection for file-backed/manual saves, not in a broad summarizer rewrite, and the existing generic-name guardrails remained intact.
After Phase 9 closed within that scope, additional direct-save coverage exposed a separate collector-path naming seam. This plan captures that newly discovered work as Phase 10 follow-up scope rather than rewriting Phase 9 as incomplete.
Phase 11 then closed a related routing defect: explicit CLI save targets are now treated as authoritative through `generate-context` control flow, with targeted regression coverage and direct command smoke evidence.
Subsequent post-Phase-10 verification then surfaced a separate V6/V7 indexed direct-save render/quality blocker. That follow-up is an indexing-quality closure issue in rendered output and downstream evidence quality, not another naming-selection decision, so it is tracked as Phase 13 instead of reopening Phase 10 scope.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Full inventory available in this spec folder scratch artifacts.
- [x] Evaluation ratings and evidence mapped to concrete paths.
- [x] Recommended actions include effort/risk/impact assessment.

### Definition of Done
- [x] Boundary docs and API contract docs merged.
- [x] Import-policy enforcement active.
- [x] Handler cycle reduced/removed and verified.
- [x] Duplicate helper ownership clarified and consolidated.
- [x] Checklist P0 items verified with command/file evidence.
- [x] Triple ultra-think review P0 blockers resolved (Phase 4).
- [x] Review remediation checklist items verified.
- [x] Feature catalog implementation-doc parity remediation completed (Phase 6).
- [x] Phase 7 boundary remediation carry-over tasks completed or explicitly deferred. (Phase 7A-7C closure verified 2026-03-06)
- [x] Phase 8 strict-pass remediation closes README drift, boundary/dist policy ambiguity, dist-reference mismatches, and verification evidence gaps before final completion claim. (Phase 8 closure verified 2026-03-06)
- [x] Phase 9 memory naming follow-up closes the root-save generic naming regression by fixing naming candidate selection precedence, not by broad summarizer changes, while preserving generic-name guardrails. (Phase 9 closure verified 2026-03-06 with executable regression coverage and final spec validation)
- [x] Phase 10 direct-save naming follow-up closes the newly discovered direct-save collector-path candidate-loss seam without weakening the Phase 9 generic/contamination guardrails. (Phase 10 closure verified 2026-03-06 with collector-path regression coverage, targeted direct-save proof, lint, and final spec validation)
- [x] Phase 11 explicit CLI target authority closure confirms direct save targets are not rerouted by session-learning and are verified by regression + smoke tests. (Phase 11 closure verified 2026-03-06)
- [x] Phase 13 indexed direct-save render/quality closure resolves the post-Phase-10 V6/V7 blocker, adds regression coverage for indexed direct-save quality, and records refreshed closure evidence only after targeted verification passes. (Phase 13 closure verified 2026-03-06: targeted vitest PASS `31/31`, scripts lint PASS, spec validation PASS, indexed root save recorded as memory `#1201` without `QUALITY_GATE_FAIL` or skipped indexing)
- [x] Phase 14 README documentation audit creates all 14 missing READMEs, verifies and fixes 50+ existing READMEs, and confirms zero HVR-banned words and 83/83 frontmatter coverage. (Phase 14 closure verified 2026-03-08: 25 agents dispatched in 5 waves, 14 READMEs created, 26 existing READMEs updated, 25 passed without changes, automated verification confirms 0 missing source-folder READMEs and 0 banned words)
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Contract-first layered architecture.

### Key Components
- **Runtime layer (`mcp_server/`)**: request handlers, search, scoring, storage, tools.
- **Build/CLI layer (`scripts/`)**: generation, indexing orchestration, eval runners, operational scripts.
- **Shared layer (`shared/`)**: neutral reusable modules with stable ownership.
- **Public boundary (`mcp_server/api/*`)**: only approved cross-boundary consumption surface.

### Data Flow
1. Scripts initiate build/maintenance/eval workflows.
2. Cross-boundary runtime access occurs through API surface where possible.
3. Runtime handlers operate on internal `lib/*` and storage concerns.
4. Enforcement checks prevent new inward dependency drift.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:effort -->
## EFFORT ESTIMATION

| Phase | Tasks | Estimated LOC | Effort | Risk |
|-------|-------|---------------|--------|------|
| Phase 0: Pipeline Infrastructure | T000 | ~20 | Low (1-2h) | Low |
| Phase 1: Contract & Discoverability | T001-T006 | ~300 (docs) | Medium (4-6h) | Low |
| Phase 2: Structural Cleanup | T007-T014 | ~200 (code) | Medium-High (6-8h) | Medium |
| Phase 2b: Cleanup & Doc Gaps | T018-T020 | ~100 (docs+code) | Low (2-3h) | Low |
| Phase 3: Enforcement | T015-T017 | ~150 (code) | Medium (3-4h) | Medium |
| Phase 4: Review Remediation | T021-T045 | ~300 (code+docs) | Medium-High (6-10h) | Medium |
| Phase 5: Enforcement Gaps | T046-T049 | ~80 (code+docs) | Low (1-2h) | Low |
| Phase 6: Feature Catalog Parity | T050-T073 | ~350 (code+docs+tests) | Medium-High (8-12h) | Medium |
| Phase 7: Boundary Remediation Carry-Over (merged 030) | T074-T090 | ~250 (code+docs+automation) | Medium (4-8h) | Medium |
| Phase 8: Strict-Pass Remediation | T091-T099 | ~180 (docs+verification) | Low-Medium (3-5h) | Low |
| Phase 9: Memory Naming Follow-Up | T100-T104 | ~120 (code+tests+verification) | Low-Medium (2-4h) | Medium |
| Phase 10: Direct-Save Naming Follow-Up | T105-T109 | ~110 (code+tests+verification) | Low-Medium (2-4h) | Medium |
| Phase 11: Explicit CLI Target Authority Closure | T110-T114 | ~80 (tests+docs+smoke verification) | Low (1-2h) | Medium |
| Phase 12: Explicit Phase-Folder Rejection Rule | T115-T118 | ~60 (code+tests) | Low (1-2h) | Low |
| Phase 13: Indexed Direct-Save Render/Quality Closure | T119-T123 | ~100 (investigation+fixes+tests+verification) | Low-Medium (2-4h) | Medium |
| Phase 14: README Documentation Audit | T124-T129 | ~1500 (docs) | Medium-High (6-10h) | Low |
| **Total** | **132 task entries (130 IDs; T013 split into T013a/b/c)** | **~3840** | **~52-85h** | **Medium** |

**Critical path**: Phase 0 → Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 6 → Phase 7 → Phase 8 → Phase 9 → Phase 10 → Phase 11 → Phase 12 → Phase 13 → Phase 14 (sequential dependency).
Phase 2b can run in parallel with Phase 2 after Phase 1 completes.
Phase 4 P1/P2 items can run in parallel after P0 blockers are resolved.
<!-- /ANCHOR:effort -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 0: Pipeline Infrastructure (Prerequisite)
- [x] Establish lint/check scripts in `scripts/package.json` (required by Phase 3 enforcement).

### Phase 1: Publish Boundary Contract (documentation-first)
- [x] Create canonical boundary document and API consumer guidance.
- [x] Clarify compatibility-wrapper posture and canonical reindex runbook location.
- [x] Align README coverage for runtime vs scripts ownership.

### Phase 2: Reduce Structural Drift
- [x] Consolidate duplicate utility concerns (token estimation, quality extraction).
- [x] Replace direct duplicate implementations with shared modules.
- [x] Break handler cycle with minimal orchestration extraction.

### Phase 3: Enforce and Verify
- [x] Add automated import-policy checks for scripts.
- [x] Add temporary exception allowlist with owner and removal criteria.
- [x] Validate no new violations and update checklist evidence.

### Phase 4: Review Remediation (Post-Review)
Addresses findings from the triple ultra-think cross-AI review (Claude Opus 4.6 + Gemini 3.1 Pro + Codex 5.3).

#### P0 Blockers
- [x] Integrate `check-api-boundary.sh` into `npm run check` pipeline for bidirectional enforcement.
- [x] Add missing `reindex-embeddings.ts` exception to .opencode/skill/system-spec-kit/ARCHITECTURE.md.
- [x] Expand `PROHIBITED_PATTERNS` to cover `@spec-kit/mcp-server/core/*` paths.

#### P1 Should-Fix
- [x] Add dynamic `import()` expression detection to enforcement script.
- [x] Add additional relative path variant patterns (3+ depth levels).
- [x] Update `.opencode/skill/system-spec-kit/shared/README.md` structure tree with Phase 8 modules.
- [x] Add allowlist governance fields (`approvedBy`, `createdAt`, `expiresAt`).
- [x] Ban or sunset wildcard exceptions with explicit module lists.
- [x] Update `.opencode/skill/system-spec-kit/scripts/evals/README.md` with missing `run-chk210-quality-backfill.ts` exception.

#### P2 Nice-to-Have
- [x] Add block comment tracking to import checker.
- [x] Add behavioral tests for `quality-extractors.ts` edge cases.
- [x] Add bidirectional cross-links in .opencode/skill/system-spec-kit/ARCHITECTURE.md.
- [x] Define growth policy for `handler-utils.ts`.
- [x] Consider AST-based parsing upgrade for enforcement script.
- [x] Add transitive dependency checks for re-export evasion.

### Phase 6: Feature Catalog Parity (Implementation vs Documentation)
Derived from the 5-agent phase audit of `034-feature-catalog` groups 01-18.

#### Code Fixes First (behavioral)
- [x] Fix `memory_match_triggers` cognitive-path limit leak so final output never exceeds caller limit.
- [x] Add per-channel failure isolation in `eval_run_ablation` so one channel error does not abort the full run.
- [x] Enforce learned-feedback shadow-period semantics end-to-end (record + query paths).
- [x] Remove learned-feedback double scaling (0.7x applied twice).
- [x] Process incremental `toDelete` paths in `memory_index_scan` flow.
- [x] Align auto-promotion thresholds with positive-validation semantics (not total validation count).
- [x] Wire per-channel eval logging if retained in current telemetry contract.
- [x] Finalize and enforce one `memory_search.limit` contract (50 or 100) across schema + docs.

#### Documentation Alignment Sweep
- [x] Remove stale fallback narrative for `SPECKIT_PIPELINE_V2` (V2-only runtime).
- [x] Align MPAB documentation with actual runtime stage placement.
- [x] Align content-normalization docs with current embedding/BM25 behavior.
- [x] Align checkpoint docs with real `skipCheckpoint` and restore semantics.
- [x] Align evaluation metrics count and edge-density denominator wording.
- [x] Align graph/community docs with runtime wiring and cache invalidation behavior.
- [x] Align governance docs (flag caps, active knobs, inventory counts) to current code.
- [x] Align eval logging docs (sync vs async, and per-channel event coverage).
- [x] Remove stale implementation-detail claims (line-count and call-site drift) across phase snippets.

#### Memory Quality Gates (Generation-Time Prevention)
- [x] Create `slug-utils.ts` with content-aware slug generation (task → slug, fallback to folder name).
- [x] Add empty content gate (200-char minimum after stripping boilerplate) to `file-writer.ts`.
- [x] Add duplicate detection (SHA-256 hash check against existing memory files) to `file-writer.ts`.
- [x] Integrate content slug in `workflow.ts` (replace `folderBase` with `generateContentSlug(implSummary.task, folderBase)`).

#### Validation
- [x] Re-run phase audit for groups 01-18 and ensure no unresolved high-severity doc-vs-runtime mismatches remain.

### Phase 7: Boundary Remediation Carry-Over (Merged from Former 030)

#### Migration and Exception Reduction
- [x] Migrate `scripts/core/memory-indexer.ts` imports to API/shared surfaces where coverage already exists. [DONE: `vectorIndex` from `@spec-kit/mcp-server/api/search`; `DB_UPDATED_FILE` from `@spec-kit/shared/config`]
- [x] Move `DB_UPDATED_FILE` ownership to `shared/config` with backward-compatible runtime re-export. [DONE: shared export + `mcp_server/core/config.ts` re-export]
- [x] Re-audit `scripts/memory/reindex-embeddings.ts` imports and migrate only encapsulation-safe dependencies. [DONE: script now imports only `@spec-kit/mcp-server/api/indexing`]
- [x] Remove or narrow allowlist entries that are no longer required after migration. [DONE: memory-indexer exceptions removed; retained wildcard exceptions are eval-only with governance metadata]

#### Enforcement Automation and Documentation Sync
- [x] Ensure mandatory CI enforcement runs boundary checks on every PR and blocks merge on violations. [DONE: `.github/workflows/system-spec-kit-boundary-enforcement.yml` now prebuilds `shared` and `mcp_server` declaration outputs on clean checkouts before running scripts boundary checks]
- [x] Update .opencode/skill/system-spec-kit/ARCHITECTURE.md exception table and allowlist review metadata after migration. [DONE: current exceptions table aligned with allowlist; retained wildcard eval exceptions reviewed `2026-03-05`]
- [x] Re-run `npx tsc --noEmit` and `npm run check` with updated exception set; capture evidence in checklist. [DONE: passed `npm run check --workspace=scripts`, `npm run check:ast --workspace=scripts`, `npx tsc --noEmit`, and targeted import-policy rules vitest on 2026-03-06]

### Phase 8: Strict-Pass Remediation

#### Documentation and Policy Reconciliation
- [x] Re-audit boundary-adjacent README files against canonical architecture and API policy docs; fix drift instead of layering new duplicate guidance.
- [x] Clarify source-vs-dist boundary policy so docs explicitly state when `dist/` references are authoritative outputs, generated artifacts, or forbidden as source-of-truth documentation anchors.
- [x] Reconcile all retained `dist/` references with current build/runtime behavior and replace stale or ambiguous references with canonical source-doc pointers where appropriate.

#### Verification Closure
- [x] Capture strict-pass evidence for each remediation bucket in `checklist.md` using file-path and command evidence only after changes land.
- [x] Re-run spec validation and any targeted verification commands needed to support a final strict-pass claim without unresolved README or boundary-policy drift.

### Phase 9: Memory Naming Follow-Up (Post-Strict-Pass)

#### Investigation and Fix Target
- [x] Confirm naming candidate sources for file-backed/manual save flows and capture the root-save failure path that falls back to generic folder-derived naming too early.
- [x] Implement the fix in naming candidate selection so stronger session semantics win before folder fallback, based on the Task #17 finding that the defect is selection precedence rather than a broad summarizer rewrite.
- [x] Preserve existing generic-name guardrails so weak or generic candidates are still rejected instead of being promoted by the follow-up fix.

#### Regression Coverage and Closure
- [x] Add unit/fixture regression coverage for file-backed and manual save naming candidates, including the root-save scenario.
- [x] Reproduce and verify the root-save scenario before and after the fix, with evidence that generic fallback names no longer leak when session evidence is available. [DONE: `node mcp_server/node_modules/vitest/vitest.mjs run tests/task-enrichment.vitest.ts tests/memory-render-fixture.vitest.ts --root scripts --config ../mcp_server/vitest.config.ts` passed with `27/27` tests]
- [x] Record final closure evidence in phase docs and `implementation-summary.md` once the naming fix, regression coverage, and verification runs all pass. [DONE: closure evidence synchronized across `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md`; local `.git/hooks/pre-commit` mirror checks + README scan completion recorded]

### Phase 10: Direct-Save Naming Follow-Up (Post-Phase-9 Scope Discovery)

#### Newly Discovered Collector-Path Seam
- [x] Trace the direct-save candidate-loss seam through the real collector path to confirm where session-specific naming evidence is dropped after Phase 9 closure. [DONE: `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts` is now the recorded seam owner for the real collector path; the follow-up preserves the historical note that this issue was discovered only after Phase 9 closed, rather than rewriting Phase 9 as incomplete.]
- [x] Fix `collectSessionData()` quick-summary derivation so it chooses the best specific candidate across observation titles, `recentContext.request`, `recentContext.learning`, and `taskFromPrompt` before any generic fallback logic runs. [DONE: the real collector path now calls `pickBestContentName()` across observation titles, `recentContext.request`, `recentContext.learning`, and `taskFromPrompt`, then falls back only if no specific candidate survives.]
- [x] Preserve Phase 9 generic/contamination guardrails so the direct-save follow-up does not promote weak, generic, or contaminated candidates. [DONE: guardrails remain centralized in `pickBestContentName()`; `.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts` now asserts the direct-save path rejects the generic folder-derived suffix `__hybrid-rag-fusion` while still producing a specific slug.]

#### Regression Coverage and Closure
- [x] Add targeted direct-save regression coverage through the real collector path, not only helper-level naming selection tests. [DONE: `.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts` adds the real direct-save preloaded workflow assertion, and `node mcp_server/node_modules/vitest/vitest.mjs run tests/task-enrichment.vitest.ts --root scripts --config ../mcp_server/vitest.config.ts` passed with `27/27`; targeted `-t "uses collector-derived quick summary during direct preloaded workflow saves"` also passed.]
- [x] Update closure evidence in `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md` once direct-save validation passes. [DONE: Phase 10 closure evidence is synchronized across the four phase docs; `npm run lint --prefix ".opencode/skill/system-spec-kit/scripts"` and `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh "specs/02--system-spec-kit/022-hybrid-rag-fusion/009-architecture-audit"` passed.]

### Phase 11: Explicit CLI Target Authority Closure (Memory Save Routing)

#### Routing Contract Fix
- [x] Verify `generate-context` preserves explicit CLI targets as authoritative workflow inputs even when session-learning emits alignment suggestions. [DONE: targeted CLI-authority regression verifies `main()` forwards explicit `specFolderArg` into `runWorkflow` for direct and JSON override modes.]
- [x] Add and execute regression coverage for the real `generate-context -> runWorkflow` routing seam. [DONE: `tests/generate-context-cli-authority.vitest.ts` executed with `tests/task-enrichment.vitest.ts` and passed `29/29` tests on 2026-03-06.]
- [x] Run direct CLI smoke save to `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion` and capture evidence. [DONE: `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion` logged CLI-arg routing and wrote a memory file under `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/memory/`]

#### Documentation and Closure Sync
- [x] Ensure operator docs state explicit-target authority behavior. [DONE: `.opencode/skill/system-spec-kit/scripts/spec-folder/README.md` explicitly documents `CLI Authority`; `.opencode/skill/system-spec-kit/scripts/tests/README.md` documents the CLI-authority regression suite.]
- [x] Sync Phase 11 closure evidence across phase docs and rerun spec validation. [DONE: `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md` now include Phase 11 closure evidence; spec validation rerun recorded after updates.]

### Phase 12: Explicit Phase-Folder Rejection Rule (Memory Save)

#### Deterministic Rejection Guard
- [x] Add a phase-folder rejection helper that keeps root-target saves working while stopping explicit phase-child targets before write. [DONE: `.opencode/skill/system-spec-kit/scripts/core/subfolder-utils.ts` now classifies phase children and produces deterministic owning-root guidance; `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts` rejects explicit phase-folder targets before `runWorkflow()`.]
- [x] Re-run focused regression coverage for root-target preservation plus phase-target rejection. [DONE: `node mcp_server/node_modules/vitest/vitest.mjs run tests/generate-context-cli-authority.vitest.ts --root scripts --config ../mcp_server/vitest.config.ts` passed with `3/3` tests, covering root direct mode, JSON override mode, and explicit phase-folder rejection.]
- [x] Capture command-level evidence for both the allowed root target and the rejected phase target. [DONE: `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion` still saves under the root `memory/` directory, while the same command against `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-architecture-audit` now fails before save with owning-root guidance and deterministic non-reroute text.]

#### Documentation and Closure Sync
- [x] Update operator docs so explicit CLI authority and explicit phase-child rejection are both documented. [DONE: `.opencode/skill/system-spec-kit/references/memory/save_workflow.md`, `.opencode/skill/system-spec-kit/references/debugging/troubleshooting.md`, `.opencode/skill/system-spec-kit/scripts/spec-folder/README.md`, `.opencode/skill/system-spec-kit/scripts/README.md`, and `.opencode/skill/system-spec-kit/scripts/memory/README.md` now reflect the rejection rule.]
- [x] Sync Phase 12 closure evidence across phase docs and rerun spec validation. [DONE: `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md` now record Phase 12 closure evidence; `./.opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-architecture-audit` passed with `0` errors and `0` warnings.]

### Phase 13: Indexed Direct-Save Render/Quality Closure (Post-Phase-10 Discovery)

#### V6/V7 Indexed Quality Investigation and Minimal Fixes
- [x] Investigate the V6/V7 indexed direct-save blocker through the rendered output and indexing-quality path to confirm exactly where direct-save quality degrades after the naming/routing closures. [DONE: the remaining defect was confirmed as a post-Phase-10 render/indexing-quality seam rather than a reopened naming-selection issue; direct-save output quality degraded because empty preflight/postflight sections leaked into saved renders and lowercase captured facts did not increment tool counts consistently, which in turn weakened root-save indexing evidence quality.]
- [x] Implement the minimal render/quality fixes needed to restore indexed direct-save output quality without reopening completed naming-selection decisions from Phases 9-10. [DONE: fixes stayed scoped to `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts`, `.opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts`, and `.opencode/skill/system-spec-kit/templates/context_template.md`; empty preflight/postflight sections no longer leak into direct saves, lowercase capture facts now increment tool counts consistently, and direct root saves keep non-generic filenames that clear indexing quality gates.]
- [x] Add regression coverage that proves indexed direct-save quality remains correct for the V6/V7 path and fails if rendered quality regresses again. [DONE: `.opencode/skill/system-spec-kit/scripts/tests/memory-render-fixture.vitest.ts` now covers the indexed direct-save render/quality seam; `node mcp_server/node_modules/vitest/vitest.mjs run tests/task-enrichment.vitest.ts tests/memory-render-fixture.vitest.ts --root scripts --config ../mcp_server/vitest.config.ts` passed with PASS `31/31`.]

#### Verification and Closure Evidence
- [x] Re-run targeted verification for indexed direct-save behavior, including render/quality checks and the spec validator, before claiming closure. [DONE: `node mcp_server/node_modules/vitest/vitest.mjs run tests/task-enrichment.vitest.ts tests/memory-render-fixture.vitest.ts --root scripts --config ../mcp_server/vitest.config.ts` passed with PASS `31/31`; `npm run lint --prefix ".opencode/skill/system-spec-kit/scripts"` passed; `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh "specs/02--system-spec-kit/022-hybrid-rag-fusion/009-architecture-audit"` passed.]
- [x] Update closure evidence across `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md` only after the indexed direct-save render/quality blocker is verified closed. [DONE: Phase 13 closure evidence is now synchronized across the four phase docs while preserving the historical note that this was a post-Phase-10 indexing-quality follow-up; root-save proof recorded final saved file `specs/02--system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/memory/06-03-26_15-07__phase-13-indexed-direct-save-closure.md`, successful indexing as memory `#1201`, and no `QUALITY_GATE_FAIL` or skipped indexing.]
### Phase 14: README Documentation Audit

#### Coverage Gap Closure (14 Missing READMEs)
- [x] Create READMEs for all 14 code folders that lack documentation: `mcp_server/lib/graph/`, `mcp_server/lib/chunking/`, `mcp_server/lib/ops/`, `mcp_server/lib/search/pipeline/`, `mcp_server/lib/cache/scoring/`, `mcp_server/handlers/save/`, `mcp_server/schemas/`, `shared/algorithms/`, `shared/contracts/`, `shared/lib/`, `shared/parsing/`, `shared/embeddings/providers/`, `shared/mcp_server/database/`, `scripts/kpi/`. [DONE: agents A01-A07]
- [x] Each new README follows sk-doc readme_template format: YAML frontmatter, numbered ALL CAPS H2 sections, TOC with anchors, file listing matching actual folder contents, no HVR-banned words. [DONE: verified by automated checks -- 0 missing frontmatter, 0 banned words, 0 source folders without README]

#### Alignment Verification (50+ Existing READMEs)
- [x] Verify all existing READMEs in mcp_server zone (api, configs, core, database, formatters, handlers, hooks, lib and its 20+ subdirectories, scripts, tools, utils). [DONE: agents A08-A17, A23]
- [x] Verify all existing READMEs in scripts zone (core, memory, evals, extractors, lib, loaders, renderers, spec, spec-folder, rules, ops, setup, templates, types, utils). [DONE: agents A18-A21, A24]
- [x] Verify all existing READMEs in shared zone (root, embeddings, scoring, utils). [DONE: agent A22]
- [x] Verify root READMEs (system-spec-kit root, mcp_server root, scripts root) and ARCHITECTURE.md cross-references. [DONE: agents A23-A25]

#### Delegation Strategy
- Agent-based parallel execution in 5 waves of 5 agents each (25 total).
- Wave 1-2: Create missing READMEs. Wave 3-5: Verify and fix existing READMEs.
- Agent output written to `scratch/readme-audit-A##.md` files.
- Synthesis report compiled after all waves complete.

#### Verification
- Automated: find all code folders without README, grep for HVR-banned words, verify YAML frontmatter.
- Manual: spot-check 5-10 READMEs across zones for file listing accuracy and cross-reference validity.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Static dependency checks | Forbidden import patterns and cycle detection | custom script + lint integration |
| Unit parity checks | Consolidated helper behavior | Vitest targeted tests |
| Regression naming checks | File-backed/manual save candidate selection, real direct-save collector path, and generic-name guardrails | Vitest targeted tests + fixtures |
| Integration checks | Reindex compatibility path and API-first workflows | existing CLI + manual verification |
| CLI routing checks | Explicit-target authority through generate-context main flow | targeted Vitest + direct CLI smoke save |
| Indexed direct-save quality checks | V6/V7 rendered direct-save quality and downstream indexing evidence | targeted regression suite + focused direct-save verification |
| Documentation checks | README cross-links and boundary clarity | markdown review + validation scripts |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Team agreement on API-first policy | Internal | Yellow | Delays enforcement rollout |
| Existing tests around parser/index paths | Internal | Yellow | Higher refactor risk |
| CI pipeline hook for import-policy check | Internal | Green | PR workflow is active and enforces boundary checks |

<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Behavior regressions or broken operational workflows after boundary refactors.
- **Procedure**:
1. Revert structural code changes in helper/cycle refactors.
2. Keep docs and ADR decisions as accepted intent.
3. Switch import-policy checks to warning mode until gaps are addressed.

<!-- /ANCHOR:rollback -->

## L3: DEPENDENCY GRAPH

```
Contract Docs (Phase 1) -----> Structural Cleanup (Phase 2) -----> Enforcement (Phase 3)
        |                                 |                                |
        +-----> API consumer migration ---+-----> cycle refactor ----------+
```

## L3: CRITICAL PATH

1. Boundary contract + API docs (critical).
2. Handler cycle removal and helper consolidation (critical).
3. Import-policy enforcement in pipeline (critical).
4. Review remediation P0 blockers (critical).
5. Feature catalog parity code fixes + documentation sweep (critical).
6. Boundary remediation carry-over execution and CI enforcement confirmation (critical).
7. Strict-pass remediation for README drift, boundary/dist policy, dist references, and evidence capture (critical).
8. Memory naming follow-up for root-save candidate selection precedence and regression-proof verification (critical).
9. Direct-save follow-up for collector-path quick-summary candidate loss discovered after Phase 9 closure (critical).
10. Explicit CLI target authority closure for memory-save routing and smoke verification (critical).
11. Explicit phase-folder rejection rule for memory-save target validation (critical).
12. Indexed direct-save render/quality closure for the V6/V7 post-Phase-10 blocker with targeted verification (critical).

**Parallel Opportunities**:
- README alignment can run in parallel with API consumer docs.
- Token estimator and quality extractor consolidation can run in parallel after shared ownership is agreed.

## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Boundary clarity | Contract and API docs published | Phase 1 |
| M2 | Drift reduction | Duplicate helpers and cycle concerns addressed | Phase 2 |
| M3 | Guardrail active | Import-policy checks enforced in default workflow | Phase 3 |
| M4 | Review remediation | P0 blockers resolved, enforcement hardened, doc drift fixed | Phase 4 |
| M5 | Feature parity | Feature catalog and snippets align with implemented runtime behavior | Phase 6 |
| M6 | Strict-pass readiness | README/policy/dist evidence reconciled and verifiable | Phase 8 |
| M7 | Naming remediation | Root-save memory naming regression fixed without weakening generic-name guardrails | Phase 9 |
| M8 | Direct-save remediation | Collector-path quick-summary derivation preserves best specific naming candidates during direct-save flows | Phase 10 |
| M9 | CLI authority closure | Explicit CLI save targets remain authoritative through generate-context control flow with regression + smoke evidence | Phase 11 |
| M10 | Phase-folder rejection | Explicit phase-folder rejection rule guards memory-save from targeting phase subfolders | Phase 12 |
| M11 | Indexed direct-save quality closure | V6/V7 indexed direct-save render/quality blocker is fixed with regression coverage and targeted verification evidence | Phase 13 |
| M12 | README documentation audit | All 14 missing READMEs created, 50+ existing READMEs verified for alignment, no HVR-banned words | Phase 14 |

## AI Execution Protocol

### Pre-Task Checklist
- Confirm scope lock for this phase folder before edits.
- Confirm validator command and target path.

### Execution Rules
| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Execute fixes in warning-category order and re-validate after each pass. |
| TASK-SCOPE | Do not modify files outside this phase folder unless explicitly required by parent-link checks. |

### Status Reporting Format
Status Reporting Format: `DONE | IN_PROGRESS | BLOCKED` with file path and validator evidence per update.

### Blocked Task Protocol
If BLOCKED, record blocker, attempted remediation, and next safe action before proceeding.
