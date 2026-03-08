---
title: "Implementation Summary: Refinement Phase 13 + Boundary Remediation"
description: "Phase 13 architecture audit and merged boundary-remediation execution summary for scripts vs mcp_server boundary work."
SPECKIT_TEMPLATE_SOURCE: "impl-summary-core | v2.2"
trigger_phrases:
  - "020 implementation summary"
  - "phase 0-13 architecture audit closure"
importance_tier: "normal"
contextType: "architecture"
---
# Implementation Summary: Refinement Phase 13 + Boundary Remediation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

## Overview

This phase now reflects end-to-end closure through Phase 13: all 126 task entries (T000-T123, with T013 split into T013a/T013b/T013c) are complete. Initial delivery covered T000-T020 (core architecture refinement), follow-up remediation/parity waves closed T021-T073, merged carry-over execution closed T074-T090, strict-pass documentation remediation closed T091-T099, executable naming-regression verification closed T100-T104, direct-save collector-path follow-up closed T105-T109, explicit CLI target authority closure closed T110-T114, explicit phase-folder rejection closure covered T115-T118, and indexed direct-save render/quality closure completed T119-T123.

> **Note:** Test counts cited below are point-in-time snapshots captured at each phase's closure. Downstream work (e.g., spec 013) may have added tests to the same files, so re-running commands today may yield higher counts.

As of 2026-03-05, former spec `009-architecture-audit` was merged into this phase folder. Its pending work is now completed under Phase 7 (`T074-T090`) with closure evidence captured on 2026-03-06. Phase 8 then closed the remaining non-spec documentation drift and completed the final spec-evidence backfill. Phase 10 preserves the historical note that its direct-save seam was discovered only after Phase 9 had already closed in scope. Phase 11 closed the adjacent explicit-target routing bug by verifying direct CLI save targets remain authoritative. Phase 13 preserves the next follow-up history as well: after Phase 10/11 naming and routing closures, the remaining defect was narrowed to indexed direct-save render/quality output and root-save indexing quality, not another naming-selection regression.

## Approach

Originally planned as 10 Codex CLI agent delegations in 2 waves, but Codex agents were blocked by the project's CLAUDE.md Gate 3 system (interactive spec folder question in non-interactive exec mode). Pivoted to direct implementation by Claude Code with Agent tool parallelization for documentation tasks.

**Wave 1 (7 parallel workstreams):** Pipeline infra, boundary contract, READMEs (create + update), shared modules, stale ref cleanup, shared README docs.
**Wave 2 (3 parallel workstreams):** Consumer migrations, handler cycle break, enforcement pipeline.

## Changes Summary

### New Files (18)
| File | Purpose |
|------|---------|
| .opencode/skill/system-spec-kit/ARCHITECTURE_BOUNDARIES.md | Canonical boundary contract |
| `.opencode/skill/system-spec-kit/mcp_server/api/README.md` | Public API consumer policy |
| `.opencode/skill/system-spec-kit/scripts/evals/README.md` | Eval scripts import policy |
| `shared/utils/token-estimate.ts` | Shared token estimation |
| `shared/parsing/quality-extractors.ts` | Shared quality extraction |
| `mcp_server/handlers/handler-utils.ts` | Extracted handler utilities (cycle break) |
| `scripts/evals/import-policy-allowlist.json` | Import exception registry |
| `scripts/evals/check-no-mcp-lib-imports.ts` | Import-policy enforcement script |
| `shared/parsing/quality-extractors.test.ts` | Behavioral edge-case test coverage for shared quality extractors (Phase 4) |
| `scripts/evals/check-architecture-boundaries.ts` | Secondary boundary-enforcement checker for shared neutrality + wrapper-only rules (Phase 5) |
| `scripts/utils/slug-utils.ts` | Content-aware memory slug generation utilities (Phase 6) |
| `scratch/ast-parsing-evaluation.md` | AST-based enforcement evaluation artifact (Phase 4) |
| `scratch/t069-audit-agent-1-planck.md` | Phase 6 5-agent re-audit artifact (Agent 1) |
| `scratch/t069-audit-agent-2-ampere.md` | Phase 6 5-agent re-audit artifact (Agent 2) |
| `scratch/t069-audit-agent-3-gauss.md` | Phase 6 5-agent re-audit artifact (Agent 3) |
| `scratch/t069-audit-agent-4-nash.md` | Phase 6 5-agent re-audit artifact (Agent 4) |
| `scratch/t069-audit-agent-5-aristotle.md` | Phase 6 5-agent re-audit artifact (Agent 5) |
| `scratch/t069-audit-summary.md` | Consolidated Phase 6 parity re-audit summary |

### Modified Files (32)
| File | Change |
|------|--------|
| `scripts/package.json` | Added lint, check scripts with import-policy integration |
| `scripts/core/tree-thinning.ts` | Replaced local estimateTokenCount with shared import |
| `mcp_server/formatters/token-metrics.ts` | Replaced local estimateTokens with shared import + alias |
| `scripts/core/memory-indexer.ts` | Replaced local quality extractors with shared import |
| `mcp_server/lib/parsing/memory-parser.ts` | Replaced local quality extractors with shared import |
| `mcp_server/handlers/memory-save.ts` | Removed escapeLikePattern, added handler-utils import |
| `mcp_server/handlers/causal-links-processor.ts` | Removed detectSpecLevelFromParsed, imports from handler-utils |
| `mcp_server/handlers/pe-gating.ts` | Import from handler-utils instead of causal-links-processor |
| `mcp_server/handlers/chunking-orchestrator.ts` | Import from handler-utils instead of causal-links-processor |
| `.opencode/skill/system-spec-kit/mcp_server/scripts/README.md` | Explicit compatibility wrapper scope |
| `.opencode/skill/system-spec-kit/scripts/memory/README.md` | Canonical runbook section |
| `.opencode/skill/system-spec-kit/mcp_server/database/README.md` | Pointer to canonical runbook |
| `.opencode/skill/system-spec-kit/scripts/lib/README.md` | retry-manager marked as moved |
| `scripts/scripts-registry.json` | retry-manager entry removed |
| `.opencode/skill/system-spec-kit/shared/README.md` | Boundary policy + embeddings shim docs added |
| `scripts/evals/check-no-mcp-lib-imports.ts` | Phase 4 hardening: dynamic import coverage, variable-depth relative paths, transitive re-export checks, and block-comment handling |
| `decision-record.md` | ADR-003 updated to include both token-estimation and quality-extractor consolidation evidence (T036) |
| `mcp_server/handlers/memory-triggers.ts` | Cognitive-path limit handling fixed to enforce caller `limit` contract (T050) |
| `mcp_server/lib/eval/ablation-framework.ts` | Per-channel failure isolation + partial-result reporting (T051) |
| `mcp_server/lib/search/learned-feedback.ts` | Shadow-period write-path semantics and weighting alignment updates (T052, T053) |
| `mcp_server/lib/search/pipeline/stage2-fusion.ts` | Removed duplicate learned-feedback weighting application (T053) |
| `mcp_server/handlers/memory-index.ts` | Incremental scan `toDelete` consumption and stale-index purge flow (T054) |
| `mcp_server/lib/storage/incremental-index.ts` | Stale-path deletion support for incremental indexing (T054) |
| `mcp_server/lib/scoring/confidence-tracker.ts` | Positive-validation semantics aligned for promotion eligibility (T055) |
| `mcp_server/lib/search/auto-promotion.ts` | Promotion threshold semantics aligned with positive validations (T055) |
| `mcp_server/handlers/memory-search.ts` | Runtime channel-result eval logging integration and limit clamp alignment (T056, T057) |
| `mcp_server/handlers/memory-context.ts` | Runtime channel-result eval logging integration (T056) |
| `mcp_server/schemas/tool-input-schemas.ts` | `memory_search.limit` contract normalized to 1-100 (T057) |
| `mcp_server/tool-schemas.ts` | Public tool schema contract aligned to `memory_search.limit` 1-100 (T057) |
| `scripts/core/file-writer.ts` | Empty-content and duplicate-content prevention gates added before write (T072) |
| `scripts/core/workflow.ts` | Content-aware slug integration for generated memory filenames (T073) |
| ../011-feature-catalog/feature_catalog.md | Canonical feature-catalog parity updates from Phase 6 documentation sweep (T059-T068) |

### Build Output
| File | Purpose |
|------|---------|
| `shared/dist/utils/token-estimate.*` | Compiled shared token estimation |
| `shared/dist/parsing/quality-extractors.*` | Compiled shared quality extractors |

## Verification Results

- Verification artifact: `scratch/verification-log-2026-03-04.md` (includes timed check and targeted Phase 6 test run output).
- `npm run check --workspace=scripts` passes (lint + import-policy + boundary checks), timed at `real 1.73s`.
- Targeted Phase 6 vitest run passes: 10 files, 199 tests, 0 failures.
- Handler cycle broken: causal-links-processor.ts no longer imports from memory-save.ts.
- Import-policy violations resolved or explicitly governed via allowlist entries.
- Final Phase 7 verification passed on 2026-03-06: `npm run check --workspace=scripts`, `npm run check:ast --workspace=scripts`, `npx tsc --noEmit`, and targeted import-policy rules vitest (`tests/import-policy-rules.vitest.ts`).
- Clean-checkout CI remediation verification passed on 2026-03-06: `npm ci`, `npx tsc -b shared/tsconfig.json mcp_server/tsconfig.json`, `npm run check --workspace=scripts`, and `npm run check:ast --workspace=scripts` succeeded after reproducing the missing-declaration failure in GitHub Actions.
- Alignment verifier passed on 2026-03-06: `verify_alignment_drift.py` reports PASS with 0 warnings.
- Phase 8 README validation evidence passed on 2026-03-06: `python3 .opencode/skill/sk-doc/scripts/validate_document.py` passed for the edited README files, including 0-issue runs for `.opencode/skill/system-spec-kit/mcp_server/README.md`, `.opencode/skill/system-spec-kit/mcp_server/scripts/README.md`, `.opencode/skill/system-spec-kit/shared/README.md`, and `.opencode/skill/system-spec-kit/mcp_server/hooks/README.md`.
- Final spec-folder validation passed on 2026-03-06: `.opencode/skill/system-spec-kit/scripts/spec/validate.sh "specs/02--system-spec-kit/022-hybrid-rag-fusion/009-architecture-audit"` exited 0 with `Errors: 0  Warnings: 0`.
- Phase 9 naming regression validation passed on 2026-03-06: from `.opencode/skill/system-spec-kit`, `node mcp_server/node_modules/vitest/vitest.mjs run tests/task-enrichment.vitest.ts tests/memory-render-fixture.vitest.ts --root scripts --config ../mcp_server/vitest.config.ts` returned PASS `27/27` tests.
- Local boundary mirror hook verification passed on 2026-03-06: `.git/hooks/pre-commit` exists and runs `npm run check --workspace=scripts` followed by `npm run check:ast --workspace=scripts`.
- README scan updates completed on 2026-03-06 for `.opencode/skill/system-spec-kit/scripts/README.md`, `.opencode/skill/system-spec-kit/scripts/tests/README.md`, `.opencode/skill/system-spec-kit/scripts/renderers/README.md`, and `.opencode/skill/system-spec-kit/scripts/memory/README.md`.
- Phase 9 closure evidence now includes both code-path proof and executable proof: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts` passes `QUICK_SUMMARY`, `TITLE`, and `SUMMARY` into `pickPreferredMemoryTask()`, `.opencode/skill/system-spec-kit/scripts/utils/task-enrichment.ts` prefers session candidates before `folderBase`, and `.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts` verifies the stronger `hybrid-rag-fusion-recall-regression-audit` slug while rejecting the old generic `hybrid-rag-fusion` fallback slug.
- Phase 10 collector-path validation passed on 2026-03-06: from `.opencode/skill/system-spec-kit`, `node mcp_server/node_modules/vitest/vitest.mjs run tests/task-enrichment.vitest.ts --root scripts --config ../mcp_server/vitest.config.ts` returned PASS `27/27` tests.
- Phase 10 targeted direct-save regression passed on 2026-03-06: from `.opencode/skill/system-spec-kit`, `node mcp_server/node_modules/vitest/vitest.mjs run tests/task-enrichment.vitest.ts --root scripts --config ../mcp_server/vitest.config.ts -t "uses collector-derived quick summary during direct preloaded workflow saves"` passed.
- Scripts lint passed on 2026-03-06: `npm run lint --prefix ".opencode/skill/system-spec-kit/scripts"`.
- Phase 10 closure evidence now includes both code-path proof and executable proof: `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts` resolves `QUICK_SUMMARY` with `pickBestContentName()` across observation titles, `recentContext.request`, `recentContext.learning`, and `taskFromPrompt`, while `.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts` verifies direct-save output uses a specific slug and rejects the generic folder-derived suffix `__hybrid-rag-fusion`.
- Phase 11 explicit-target routing regressions passed on 2026-03-06: from `.opencode/skill/system-spec-kit`, `node mcp_server/node_modules/vitest/vitest.mjs run tests/generate-context-cli-authority.vitest.ts tests/task-enrichment.vitest.ts --root scripts --config ../mcp_server/vitest.config.ts` returned PASS `29/29` tests.
- Phase 11 direct CLI smoke verification passed on 2026-03-06: `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion` logged `Using spec folder from CLI argument: 022-hybrid-rag-fusion` and created `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/memory/06-03-26_16-41__sgqs-comprehensive-review-blocked.md (note: original 13-56 artifact was a quality-0 duplicate and was removed during memory cleanup)`.
- Explicit CLI authority behavior is now documented in operator docs: `.opencode/skill/system-spec-kit/scripts/spec-folder/README.md` (`CLI Authority`) and `.opencode/skill/system-spec-kit/scripts/tests/README.md` (`generate-context-cli-authority.vitest.ts` coverage).
- Phase 13 indexed direct-save render/quality regressions passed on 2026-03-06: from `.opencode/skill/system-spec-kit`, `node mcp_server/node_modules/vitest/vitest.mjs run tests/task-enrichment.vitest.ts tests/memory-render-fixture.vitest.ts --root scripts --config ../mcp_server/vitest.config.ts` returned PASS `31/31` tests.
- Phase 13 scripts lint passed on 2026-03-06: `npm run lint --prefix ".opencode/skill/system-spec-kit/scripts"`.
- Phase 13 indexed root-save proof succeeded on 2026-03-06: `specs/02--system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/memory/06-03-26_15-07__phase-13-indexed-direct-save-closure.md` was saved with a non-generic filename, indexed as memory `#1201`, and recorded no `QUALITY_GATE_FAIL` plus no skipped indexing.

## Triple Ultra-Think Cross-AI Review (2026-03-04)

A post-implementation review was performed by three independent AI agents analyzing Phase 8 from complementary perspectives.

### Review Agents and Verdicts

| Agent | Model | Lens | Verdict | Confidence |
|-------|-------|------|---------|------------|
| Agent 1 | Claude Opus 4.6 | Architectural Coherence | PASS WITH CONCERNS | 88/100 |
| Agent 2 | Gemini 3.1 Pro Preview | Code Quality & Completeness | PASS | 98/100 |
| Agent 3 | Codex 5.3 | Enforcement & Evasion | NEEDS REVISION | 93/100 |

### Key Findings

**Behavior Parity (Gemini, 98/100):** All 12 migrated files preserve exact behavioral parity. Re-exports act as perfect shims. Extracted regex matches exactly mimic inline originals. No runtime regression concern.

**Documentation Drift (Claude, 88/100):** 4 MAJOR issues found:
- `.opencode/skill/system-spec-kit/shared/README.md` structure tree omits Phase 8 modules
- Checklist summary reported stale P1 count (12/14 vs actual 14/14)
- .opencode/skill/system-spec-kit/ARCHITECTURE_BOUNDARIES.md exception table missing 1 of 6 entries
- `check-api-boundary.sh` documented but not in pipeline

**Enforcement Evasion (Codex, 93/100):** 4 CRITICAL vectors found:
- Dynamic `import()` expressions undetected
- Relative path variants partially covered (only `../../` depth)
- Multi-line imports bypass line-by-line scanning
- Boundary narrower than intent (`core/*` not blocked)

### Cross-Validated Findings (2+ agents agree)
- **CV-1 (MINOR):** Block comment handling gap — only `//` skipped [Gemini + Codex]
- **CV-2 (CRITICAL):** Enforcement boundary narrower than architecture intent [Codex + Claude]
- **CV-3 (MAJOR):** Exception table documentation drift [Claude + Codex]

### Remediation

18 new tasks (T021-T038) added to Phase 4 with:
- 3 P0 blockers (enforcement pipeline, exception table, pattern expansion)
- 6 P1 should-fix items (detection hardening, governance, doc updates)
- 9 P2 nice-to-have items (block comments, tests, AST upgrade, transitive checks)

### Agent 4: Codex 5.3 Ultra-Think — Code Quality (2nd pass)

A fourth agent was dispatched to provide a complementary code-quality perspective to Gemini. Verdict: **PASS WITH CONCERNS** (84/100). Found 10+ MAJOR issues not caught by Gemini's review, including:

- `escapeLikePattern` doesn't escape backslash — SQL safety gap (P0 blocker, T039)
- Quality extractors not frontmatter-scoped — body text can influence metadata (T040)
- Causal reference resolution uses ambiguous LIKE without ordering (T041)
- Chunking fallback metadata updater lacks SQL column allowlist guard (T042)
- No guard for empty retained chunks in chunking-orchestrator (T043)
- NaN can propagate through pe-gating similarity calculation (T044)
- Relative `require()` paths not detected by enforcement (T045)

### Remediation Summary

25 total tasks (T021-T045) added to Phase 4:
- 4 P0 blockers: enforcement pipeline, exception table, pattern expansion, escapeLikePattern fix
- 12 P1 should-fix: detection hardening, governance, doc updates, code quality fixes
- 9 P2 nice-to-have: block comments, tests, AST upgrade, transitive checks

ADR-004 proposed for enforcement hardening approach.
See `tasks.md` Phase 4, `checklist.md` CHK-200 through CHK-231.

## Phase 6 Parity Closure (2026-03-04)

Phase 6 (`T050-T073`) is now closed with code-contract verification, documentation parity fixes, memory-quality gate rollout, and a 5-agent re-audit trail.

### What Was Closed

- `T057`: `memory_search.limit` contract aligned at 1-100 across schema, runtime clamp, and tool docs.
- `T058`: targeted regression suites for `T050-T057` confirmed in test set.
- `T059-T068`: canonical .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog/feature_catalog.md and snippet docs synchronized to current runtime reality (pipeline/fallback wording, MPAB placement, normalization semantics, lifecycle guards, metric/graph semantics, governance/telemetry wording, stale implementation-detail cleanup, canonical metadata source consistency).
- `T069`: 5-agent parity re-audit artifacts captured in `scratch/` with no unresolved HIGH findings and no unresolved MEDIUM findings.
- `T070`: phase docs (`plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`) updated with closure evidence.
- `T071-T073`: generation-time memory quality gates added (content-aware slugging, empty-content prevention, duplicate-content prevention).

### Verification Evidence

- Targeted Phase 6 tests run (10 suites) for: triggers limit, ablation isolation, learned-feedback shadow semantics, stage2 fusion weighting, incremental delete consumption, promotion semantics, eval channel logging, and schema limit contracts.
- Audit artifacts:
  - `scratch/t069-audit-agent-1-planck.md`
  - `scratch/t069-audit-agent-2-ampere.md`
  - `scratch/t069-audit-agent-3-gauss.md`
  - `scratch/t069-audit-agent-4-nash.md`
  - `scratch/t069-audit-agent-5-aristotle.md`
  - `scratch/t069-audit-summary.md`

## Phase 7 Closure (2026-03-06)

Phase 7 boundary-remediation carry-over work (`T074-T090`) is complete.

### What Was Closed

- **Phase 7A (ownership/import migration):** `DB_UPDATED_FILE` is owned by `shared/config.ts`; `mcp_server/core/config.ts` re-exports it for compatibility; `scripts/core/memory-indexer.ts` now uses API/shared imports (`@spec-kit/mcp-server/api/search`, `@spec-kit/shared/config`); memory-indexer-specific allowlist exceptions were removed.
- **Phase 7B (reindex audit + API decisioning):** new API surface `mcp_server/api/indexing.ts` added to expose minimal safe runtime bootstrap/index-scan hooks; `scripts/memory/reindex-embeddings.ts` now imports only `@spec-kit/mcp-server/api/indexing`; enforcement coverage includes internal runtime imports under `lib`, `core`, and `handlers`.
- **Phase 7C (automation + docs sync):** PR workflow `.github/workflows/system-spec-kit-boundary-enforcement.yml` now prebuilds `shared` and `mcp_server` declaration outputs with `npx tsc -b shared/tsconfig.json mcp_server/tsconfig.json` before running scripts boundary checks (`check` + `check:ast`), closing the clean-checkout `TS6305` failure mode; .opencode/skill/system-spec-kit/ARCHITECTURE_BOUNDARIES.md current exceptions table is synchronized with allowlist state; retained wildcard allowlist exceptions remain eval-only and include governance metadata with `lastReviewedAt: 2026-03-05`.

### Verification Evidence

- `npm run check --workspace=scripts` (pass)
- `npm run check:ast --workspace=scripts` (pass)
- `npx tsc --noEmit` (pass)
- `npm ci && npx tsc -b shared/tsconfig.json mcp_server/tsconfig.json && npm run check --workspace=scripts && npm run check:ast --workspace=scripts` in a fresh clone (pass)
- `node mcp_server/node_modules/vitest/vitest.mjs run tests/import-policy-rules.vitest.ts --root scripts --config ../mcp_server/vitest.config.ts` (pass)
- `python3 .opencode/skill/sk-code--opencode/scripts/verify_alignment_drift.py --root .opencode/skill/system-spec-kit` (PASS; 0 warnings)

## Phase 8 Closure (2026-03-06)

Phase 8 strict-pass remediation (`T091-T099`) is complete.

### What Was Closed

- .opencode/skill/system-spec-kit/ARCHITECTURE_BOUNDARIES.md now makes test-placement expectations explicit and states the canonical `dist/` policy: generated build output is not source-of-truth content expected in a fresh checkout.
- Boundary-adjacent docs were reconciled to that policy and current runtime/operator guidance: `.opencode/skill/system-spec-kit/mcp_server/README.md`, `.opencode/skill/system-spec-kit/mcp_server/scripts/README.md`, `.opencode/skill/system-spec-kit/shared/README.md`, and `.opencode/skill/system-spec-kit/mcp_server/hooks/README.md`.
- The Phase 8 `dist/` strategy branch is now closed by explicit policy decision rather than ambiguity: build artifacts are generated as needed and documented as such.
- Final spec evidence was backfilled in `tasks.md`, `checklist.md`, and this summary so the closure state matches the completed non-spec work.

### Verification Evidence

- `python3 .opencode/skill/sk-doc/scripts/validate_document.py` passed for the edited README files.
- 0-issue validation runs were recorded for `.opencode/skill/system-spec-kit/mcp_server/README.md`, `.opencode/skill/system-spec-kit/mcp_server/scripts/README.md`, `.opencode/skill/system-spec-kit/shared/README.md`, and `.opencode/skill/system-spec-kit/mcp_server/hooks/README.md`.
- `.opencode/skill/system-spec-kit/scripts/spec/validate.sh "specs/02--system-spec-kit/022-hybrid-rag-fusion/009-architecture-audit"` passed after the doc changes.
- Final re-verification verdict: substantive non-spec Phase 8 drift resolved; remaining work was spec evidence only, and that evidence is now recorded.

No remaining accepted exceptions.

## Phase 9 Closure (2026-03-06)

Phase 9 memory-naming follow-up work (`T100-T104`) is complete.

### What Was Recorded

- `.opencode/skill/system-spec-kit/scripts/core/workflow.ts` now sends the stronger naming candidates `QUICK_SUMMARY`, `TITLE`, and `SUMMARY` into `pickPreferredMemoryTask()` before any fallback slug is generated.
- `.opencode/skill/system-spec-kit/scripts/utils/task-enrichment.ts` keeps the remediation scoped to naming candidate precedence: `task -> specTitle -> sessionCandidates -> folderBase`, with `pickBestContentName()` still enforcing generic-name and contamination guardrails.
- `.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts` records the regression expectation for the file-backed root-save seam: the winning filename slug is `hybrid-rag-fusion-recall-regression-audit`, and the previous generic fallback slug `hybrid-rag-fusion` is explicitly rejected.
- Executable validation now confirms the regression is closed: from `.opencode/skill/system-spec-kit`, `node mcp_server/node_modules/vitest/vitest.mjs run tests/task-enrichment.vitest.ts tests/memory-render-fixture.vitest.ts --root scripts --config ../mcp_server/vitest.config.ts` passed and reported PASS `27/27` tests.
- Final phase-doc closure was synchronized across `plan.md`, `tasks.md`, `checklist.md`, and this summary, then revalidated with `.opencode/skill/system-spec-kit/scripts/spec/validate.sh "specs/02--system-spec-kit/022-hybrid-rag-fusion/009-architecture-audit"` (`Errors: 0  Warnings: 0`).

No remaining Phase 9 verification gap remains in this spec folder.

## Phase 10 Closure (2026-03-06)

Phase 10 direct-save naming follow-up work (`T105-T109`) is complete.

### What Was Recorded

- Phase 10 remains a separate closure from Phase 9: the remaining defect was discovered only after Phase 9 closed, and the spec history now preserves that sequencing instead of rewriting Phase 9 as incomplete.
- `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts` now treats the real collector path as the source of truth for the direct-save seam: `quickSummaryCandidates` include observation titles, `recentContext.request`, `recentContext.learning`, and `taskFromPrompt`, and `QUICK_SUMMARY` resolves through `pickBestContentName()` before fallback.
- The direct-save fix keeps the Phase 9 guardrails intact because the same `pickBestContentName()` filter still rejects weak, generic, and contaminated candidates before any filename is generated.
- `.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts` now includes direct collector-path coverage proving the preloaded workflow save writes the specific filename suffix `__direct-save-naming-fix-for-hybrid-rag-fusion` and explicitly does not write the generic folder-derived suffix `__hybrid-rag-fusion`.
- A final user-visible memory save retry is still a sensible follow-up smoke test, but Phase 10 itself is closed because the code path, regression coverage, lint, and spec validation already pass.

### Verification Evidence

- `node mcp_server/node_modules/vitest/vitest.mjs run tests/task-enrichment.vitest.ts --root scripts --config ../mcp_server/vitest.config.ts` (PASS `27/27`)
- `node mcp_server/node_modules/vitest/vitest.mjs run tests/task-enrichment.vitest.ts --root scripts --config ../mcp_server/vitest.config.ts -t "uses collector-derived quick summary during direct preloaded workflow saves"` (PASS)
- `npm run lint --prefix ".opencode/skill/system-spec-kit/scripts"` (PASS)
- `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh "specs/02--system-spec-kit/022-hybrid-rag-fusion/009-architecture-audit"` (PASS; exit code 0)

No remaining Phase 10 verification gap remains in this spec folder.

## Phase 11 Closure (2026-03-06)

Phase 11 explicit CLI target authority follow-up (`T110-T114`) is complete.

### What Was Recorded

- The routing contract for memory saves is now explicitly verified: when a CLI target is provided, `generate-context` forwards it as authoritative `specFolderArg` into `runWorkflow` rather than rerouting to session-learning picks.
- Regression coverage now exercises the real control flow in `.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts` for both direct mode and JSON override mode.
- The direct user command path was smoke-tested against `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion`, confirming the save run targeted the requested folder and wrote output into that folder's `memory/` directory.
- Operator docs already reflect the expected behavior: `.opencode/skill/system-spec-kit/scripts/spec-folder/README.md` documents `CLI Authority`, and `.opencode/skill/system-spec-kit/scripts/tests/README.md` lists the CLI authority regression suite.

### Verification Evidence

- `node mcp_server/node_modules/vitest/vitest.mjs run tests/generate-context-cli-authority.vitest.ts tests/task-enrichment.vitest.ts --root scripts --config ../mcp_server/vitest.config.ts` (PASS `29/29`)
- `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion` (PASS; logs explicit CLI target usage and writes to target `memory/` folder)
- `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh "specs/02--system-spec-kit/022-hybrid-rag-fusion/009-architecture-audit"` (PASS; exit code 0)

No remaining Phase 11 verification gap remains in this spec folder.

## Phase 12 Closure (2026-03-06)

Phase 12 explicit phase-folder rejection follow-up (`T115-T118`) is complete.

### What Was Recorded

- Direct memory-save CLI targets still remain authoritative, but explicit phase-child targets are now rejected before `runWorkflow()` instead of being treated as valid save destinations.
- `.opencode/skill/system-spec-kit/scripts/core/subfolder-utils.ts` now builds the deterministic rejection contract: phase-child path, owning-root guidance, and explicit non-reroute wording.
- `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts` now resolves explicit CLI targets and rejects phase-child targets before any workflow save can begin.
- Operator docs now describe both sides of the rule: explicit root targets stay authoritative, and explicit phase-child targets must be redirected manually to the owning root spec folder.

### Verification Evidence

- `node mcp_server/node_modules/vitest/vitest.mjs run tests/generate-context-cli-authority.vitest.ts --root scripts --config ../mcp_server/vitest.config.ts` (PASS `3/3`)
- `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion` (PASS; saves under root `memory/` directory)
- `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-architecture-audit` (expected FAIL; exits before save with owning-root guidance and deterministic non-reroute message)
- `./.opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-architecture-audit` (PASS; `0` errors, `0` warnings)

No remaining Phase 12 verification gap remains in this spec folder.

## Phase 13 Closure (2026-03-06)

Phase 13 indexed direct-save render/quality follow-up (`T119-T123`) is complete.

### What Was Recorded

- Phase 13 remains a post-Phase-10 follow-up rather than a reopened naming phase: the remaining defect was isolated to rendered direct-save quality and downstream indexing evidence quality after the naming and routing fixes had already closed.
- `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts`, `.opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts`, and `.opencode/skill/system-spec-kit/templates/context_template.md` now keep direct saves clean and indexable: empty preflight/postflight sections no longer leak into saved output, lowercase captured facts increment tool counts consistently, and root direct saves retain a specific non-generic filename.
- `.opencode/skill/system-spec-kit/scripts/tests/memory-render-fixture.vitest.ts` now preserves executable regression coverage for the indexed direct-save render/quality seam, paired with the existing task-enrichment checks.
- The concrete root-save closure artifact is `specs/02--system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/memory/06-03-26_15-07__phase-13-indexed-direct-save-closure.md`, which indexed successfully as memory `#1201` without `QUALITY_GATE_FAIL` and without skipped indexing.

### Verification Evidence

- `node mcp_server/node_modules/vitest/vitest.mjs run tests/task-enrichment.vitest.ts tests/memory-render-fixture.vitest.ts --root scripts --config ../mcp_server/vitest.config.ts` (PASS `31/31`)
- `npm run lint --prefix ".opencode/skill/system-spec-kit/scripts"` (PASS)
- `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh "specs/02--system-spec-kit/022-hybrid-rag-fusion/009-architecture-audit"` (PASS; exit code 0)

No remaining Phase 13 verification gap remains in this spec folder.

## Post-Review Remediation (2026-03-06)

A 10-agent comprehensive review (`scratch/review-2026-03-06/`) produced a unified synthesis with verdict **PASS WITH CONCERNS**. All P0 (2) and P1 (4) recommendations plus 8 additional minor findings were fixed in a single remediation pass.

### What Was Fixed

**P0 Fixes (2):**
- Wired `check-allowlist-expiry.ts` into `npm run check` pipeline (`scripts/package.json`)
- Updated spec.md Status from "In Review" to "Complete"

**P1 Fixes (4):**
- Added "Post-Phase 8 AST Enforcement Addendum" to ADR-006 documenting active CI status and residual risk (`decision-record.md`)
- Reconciled task count to "126 task entries (124 IDs; T013 split into T013a/b/c)" across `plan.md` and `implementation-summary.md`
- Added Phase 12 to effort table, critical path, L3 list, and milestones in `plan.md`
- Fixed ADR-004 verb "We propose" → "We chose" (`decision-record.md`)

**Additional Minor Fixes (8):**
- Backfilled 5 missing REQ rows (REQ-002, -006, -008, -009, -010) in spec.md traceability table
- Fixed CHK-201 stale exception count (6→2) in `checklist.md`
- Fixed ADR-002 Five Checks item 5 "Yes" → "Controlled" (`decision-record.md`)
- Fixed first remediation breakdown 7/8 → 6/9 (`implementation-summary.md`)
- Updated stale trigger phrase to "phase 0-13 architecture audit closure" (`implementation-summary.md`)
- Resolved Section 12 open questions with ADR references (`spec.md`)
- Added test count snapshot disclaimer note (`implementation-summary.md`)
- Fixed Phase 8 task range T091-T096 → T091-T099 (`plan.md`)

### Verification

- `npm run check --workspace=scripts` — PASS (includes newly wired `check-allowlist-expiry.ts`)
- `npm run check:ast --workspace=scripts` — PASS
- `spec/validate.sh` — PASS (0 errors, 0 warnings)
- 2-agent post-edit review: cross-file consistency (PASS 100/100) and content accuracy audit (14/14 VERIFIED after one off-by-one line count correction)
- Review artifacts: `scratch/review-2026-03-06/unified-review-synthesis.md` (includes post-review remediation log)

## Spec Consolidation (2026-03-05)

- Former folder `009-architecture-audit/` was merged into this spec to keep one canonical architecture-boundary track.
- Archived source materials are preserved at `scratch/merged-009-architecture-audit/`.
- Decision history from former 030 ADR-001 is now canonicalized as ADR-006 in `decision-record.md`.
- Carry-over implementation closure is tracked in `tasks.md` (Phase 7, `T074-T090`) and `checklist.md` (Phase 7 checks `CHK-500` through `CHK-522`; P2 now has CHK-521 and CHK-522 completed, with CHK-520 intentionally optional/pending).
