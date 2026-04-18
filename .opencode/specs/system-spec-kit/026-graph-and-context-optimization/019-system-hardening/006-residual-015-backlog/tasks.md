---
title: "Tasks: 015 Residuals Restart"
description: "Task list and evidence for 19 residuals across 6 clusters."
trigger_phrases: ["015 residuals tasks"]
importance_tier: "critical"
contextType: "tasks"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/019-system-hardening/006-residual-015-backlog"
    last_updated_at: "2026-04-19T00:55:00+02:00"
    last_updated_by: "codex-gpt-5.4"
    recent_action: "Residual implementation and wave verification completed"
    next_safe_action: "Run final validator and orchestrator-owned commit"
---
# Tasks: 015 Residuals Restart

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] [Priority] Description (file path) - evidence`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [P0] Read delta review report (`../../review/019-system-hardening-001-initial-research-002-delta-review-015/review-report.md`) - Evidence: source report read before code edits; residual clusters C1-C6 used as implementation scope.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 [P1] Fix realpath escape enforcement (`.opencode/skill/system-spec-kit/mcp_server/core/config.ts`) - Evidence: resolver now canonicalizes symlink targets before boundary checks.
- [x] T003 [P1] Fix late-env-override drift (`.opencode/skill/system-spec-kit/mcp_server/core/config.ts`) - Evidence: `resolveDatabasePaths()` refreshes exported DB path bindings after late env changes.
- [x] T004 [P1] Fix `session_resume(minimal)` payload contract (`.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts`) - Evidence: minimal mode returns code graph, CocoIndex, structural context, graphOps, hints, cached summary, and session quality without the full memory payload.
- [x] T005 [P0] Regression tests for T002-T004 - Evidence: `npm run test:core -- tests/memory-roadmap-flags.vitest.ts tests/session-resume.vitest.ts` passed 15 tests.
- [x] T006 [P0] W0+A commit handoff - Evidence: commit/push intentionally deferred per dispatch constraint "DO NOT git commit or git push".
- [x] T007 [P1] Fix `coverage_gaps` review-graph semantics (`.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/query.ts`) - Evidence: review gaps stay on the `coverage_gaps` branch and use review-mode helper semantics.
- [x] T008 [P1] Fix `coverage_gaps`/`uncovered_questions` collapse (`.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/query.ts`) - Evidence: `uncovered_questions` now rejects review graphs and directs callers to `coverage_gaps`.
- [x] T009 [P2] Fix coverage graph status fail-open (`.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/status.ts`) - Evidence: scoped signal or momentum exceptions now return error status.
- [x] T010 [P0] Regression tests for T007-T009 - Evidence: `npm run test:core -- tests/deep-loop-graph-query.vitest.ts tests/coverage-graph-status.vitest.ts tests/coverage-graph-signals.vitest.ts` passed 31 tests.
- [x] T011 [P0] W0+B commit handoff - Evidence: commit/push intentionally deferred per dispatch constraint "DO NOT git commit or git push".
- [x] T012 [P1] Fix corrupt source-metadata fail-open (`.opencode/skill/skill-advisor/scripts/skill_advisor.py`) - Evidence: corrupt `graph-metadata.json` files are recorded in `source_metadata` diagnostics and degrade health.
- [x] T013 [P1] Fix continuation-record degraded visibility (`.opencode/skill/skill-advisor/scripts/skill_advisor.py`) - Evidence: source metadata signal and conflict fallback loaders both surface malformed continuation metadata to health output.
- [x] T014 [P1] Fix cache-health false-green (`.opencode/skill/skill-advisor/scripts/skill_advisor_runtime.py`, `.opencode/skill/skill-advisor/scripts/skill_advisor.py`) - Evidence: skipped skill-file parses make cache status `degraded` and advisor health no longer reports `ok`.
- [x] T015 [P0] Regression tests for T012-T014 - Evidence: `python3 .opencode/skill/skill-advisor/tests/test_skill_advisor.py` passed 46 tests.
- [x] T016 [P0] W0+C commit handoff - Evidence: commit/push intentionally deferred per dispatch constraint "DO NOT git commit or git push".
- [x] T017 [P1] Update mcp-code-mode README inventory/surface (`.opencode/skill/mcp-code-mode/README.md`) - Evidence: README now describes the four core meta-tools and live discovery boundary.
- [x] T018 [P1] Update retired memory contract (`.opencode/skill/system-spec-kit/references/structure/folder_routing.md`) - Evidence: save workflow now routes continuity to canonical docs and generated metadata, not packet `memory/` folders.
- [x] T019 [P2] Fix moderate-alignment example (`.opencode/skill/system-spec-kit/references/structure/folder_routing.md`) - Evidence: example target now uses a broader memory tooling folder for 50-69 percent alignment.
- [x] T020 [P2] Update troubleshooting quick fix (`.opencode/skill/system-spec-kit/references/debugging/troubleshooting.md`) - Evidence: missing-folder guidance points to canonical packet docs plus `generate-context.js`.
- [x] T021 [P2] Document `AUTO_SAVE_MODE` (`.opencode/skill/system-spec-kit/references/config/environment_variables.md`) - Evidence: variable now states non-interactive save behavior and the precondition that a spec folder already exists.
- [x] T022 [P2] Fix sk-code-full-stack review path (`.opencode/skill/sk-code-full-stack/SKILL.md`) - Evidence: path now points to `.opencode/skill/sk-code-review/SKILL.md`.
- [x] T023 [P2] Fix cli-copilot duplicate merge tail (`.opencode/skill/cli-copilot/references/integration_patterns.md`) - Evidence: duplicated cross-validation and anti-pattern tail removed.
- [x] T024 [P2] Fix save-quality-gate whitespace triggers (`.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts`) - Evidence: trigger scoring filters empty and whitespace-only phrases.
- [x] T025 [P2] Fix session-prime startup-brief hiding (`.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts`) - Evidence: startup-brief import/build failures add a visible `Startup Brief Warning` section.
- [x] T026 [P0] Run W0+D regression tests - Evidence: `npm run test:core -- tests/save-quality-gate.vitest.ts tests/hook-session-start.vitest.ts` passed 94 tests.
- [x] T027 [P0] W0+D commit handoff - Evidence: commit/push intentionally deferred per dispatch constraint "DO NOT git commit or git push".
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T028 [P0] Run final build/type verification - Evidence: `npm run build` in `.opencode/skill/system-spec-kit/mcp_server` passed.
- [x] T029 [P0] Run `validate.sh --strict` on this spec folder - Evidence: `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/019-system-hardening/006-residual-015-backlog --strict` passed with 0 errors and 0 warnings.
- [x] T030 [P0] Update checklist and implementation summary - Evidence: packet docs updated with anchors, priorities, and implementation evidence.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All P0 implementation and validation tasks marked `[x]` with evidence.
- [x] No `[B]` blocked tasks remaining.
- [x] Commit and push steps deferred to orchestrator per dispatch constraint.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Source Review**: `../../review/019-system-hardening-001-initial-research-002-delta-review-015/review-report.md`
<!-- /ANCHOR:cross-refs -->
