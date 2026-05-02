---
template_source: "SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2"
title: "Implementation Plan: 006 Architecture Cleanup Remediation [template:level_2/plan.md]"
description: "Apply 15 surgical refactors and add tests for findings F-016-D1-01..08, F-017-D2-01..03, F-018-D3-01..04. Order is D3 (low risk) -> D2 (medium risk) -> D1 (highest risk for build breakage)."
trigger_phrases:
  - "F-016-D1 plan"
  - "F-017-D2 plan"
  - "F-018-D3 plan"
  - "006 architecture cleanup plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/049-deep-research-finding-remediation/006-architecture-cleanup"
    last_updated_at: "2026-05-01T10:05:00Z"
    last_updated_by: "remediation-orchestrator"
    recent_action: "Plan authored after spec"
    next_safe_action: "Execute Phase 2: apply 15 refactors in D3 -> D2 -> D1 order"
    blockers: []
    key_files:
      - ".opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/freshness/trust-state.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/types.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/skill-advisor-brief.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/lib/graph/community-summaries.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/context-server.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/daemon/watcher.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "049-006-architecture-cleanup"
      parent_session_id: null
    completion_pct: 30
    open_questions: []
    answered_questions: []
---
# Implementation Plan: 006 Architecture Cleanup Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Fifteen surgical refactors close architectural findings from packet 046 §16-18. The plan orders the fixes by risk: schema duplication (D3, low risk pure refactor) first, then dependency-graph cycles (D2, medium risk shared-type extraction), then boundary discipline (D1, highest risk for import-direction breakage). Typecheck runs after each group to catch breakage early; the watcher refactor (F-016-D1-06) is the most complex single change and gets dedicated targeted tests after extraction.

### Technical Context

The product code lives across the `mcp_server` TypeScript tree under `lib/`, `skill_advisor/`, `handlers/`, and `hooks/`. All edits stay within or extract from existing modules; new seam modules live alongside their domain owner. F-018-D3-04 introduces `zodToJsonSchema` from the existing `zod-to-json-schema` package as the generation adapter for the partial fix.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Threshold |
|------|-----------|
| `npm run typecheck` after each finding group (D3, D2, D1) | exit 0 |
| `validate.sh --strict` (this packet) | exit 0 (errors=0) |
| New vitest tests | all pass |
| `npm run stress` | exit 0 / >=58 files / >=194 tests |
| Inline finding markers | one `// F-NNN-XX-NN:` marker per finding edit point |
| Watcher public API parity | every export from `watcher.ts` still resolvable + signature-identical |
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

The fixes preserve every public API and follow three architectural principles:

- **Inward dependencies**: high-level callers depend on lower-level seams; lower-level domains do not import handler-level code or cross-cutting renderers. New seam modules under `lib/utils/` and parallel locations make this dependency direction explicit.
- **Shared types extracted**: where two modules form a value-level cycle, extract the shared type into a third module that both depend on. The original modules keep their runtime functions but no longer import each other's values.
- **Single-tuple vocabularies**: trust-state, lifecycle-status, and advisor-runtime values each live in one canonical tuple. TypeScript types derive via `typeof TUPLE[number]`; runtime schemas iterate the tuple directly. Drift is a compile error, not a runtime bug.

The watcher refactor (F-016-D1-06) is the only large structural change. It extracts a `WatcherOrchestrator` class that owns reindex queuing, debounce, storm tracking, and generation publishing. The public `createSkillGraphWatcher` factory becomes a thin wrapper that wires chokidar to the orchestrator. Every existing public symbol stays at its current path.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase A: Schema Duplication (D3) — Low Risk, Pure Refactor
| # | Action | File | Finding | Status |
|---|--------|------|---------|--------|
| 1 | Create canonical trust-state values tuple | `skill_advisor/lib/freshness/trust-state-values.ts` (new) | F-018-D3-01 | Pending |
| 2 | Derive `SkillGraphTrustState` from tuple | `skill_advisor/lib/freshness/trust-state.ts` | F-018-D3-01 | Pending |
| 3 | Create canonical lifecycle status tuple | `skill_advisor/lib/lifecycle/status-values.ts` (new) | F-018-D3-02 | Pending |
| 4 | Derive `SkillLifecycleStatus` from tuple | `skill_advisor/lib/scorer/types.ts` | F-018-D3-02 | Pending |
| 5 | Create canonical advisor runtime values tuple | `skill_advisor/lib/advisor-runtime-values.ts` (new) | F-018-D3-03 | Pending |
| 6 | Derive `AdvisorRuntime` from tuple | `skill_advisor/lib/skill-advisor-brief.ts` | F-018-D3-03 | Pending |
| 7 | Generate `advisor_recommend` + `advisor_validate` JSON schemas from zod | `tool-schemas.ts` (partial) | F-018-D3-04 | Pending |
| 8 | typecheck | — | — | Pending |

### Phase B: Dependency Graph Cycles (D2) — Medium Risk
| # | Action | File | Finding | Status |
|---|--------|------|---------|--------|
| 9 | Extract `StructuralBootstrapContract` type | `lib/session/structural-bootstrap-contract.ts` (new) | F-017-D2-01 | Pending |
| 10 | Re-export type from session-snapshot; update memory-surface import | `lib/session/session-snapshot.ts` + `hooks/memory-surface.ts` | F-017-D2-01 | Pending |
| 11 | Extract `CommunityResult` + `CommunitySummary` types | `lib/graph/community-types.ts` (new) | F-017-D2-02 | Pending |
| 12 | Update community-detection / storage / summaries imports | 3 files in `lib/graph/` | F-017-D2-02 | Pending |
| 13 | Remove dead `getDetectedRuntime` export | `context-server.ts` | F-017-D2-03 | Pending |
| 14 | typecheck | — | — | Pending |

### Phase C: Boundary Discipline (D1) — Highest Risk
| # | Action | File | Finding | Status |
|---|--------|------|---------|--------|
| 15 | Create sqlite-integrity neutral seam | `lib/utils/sqlite-integrity.ts` (new) | F-016-D1-01 | Pending |
| 16 | Update skill-graph-db import | `lib/skill-graph/skill-graph-db.ts` | F-016-D1-01 | Pending |
| 17 | Create skill-label-sanitizer neutral seam | `lib/utils/skill-label-sanitizer.ts` (new) | F-016-D1-02 | Pending |
| 18 | Update shared-payload import | `lib/context/shared-payload.ts` | F-016-D1-02 | Pending |
| 19 | Create spec-document-finder lib seam | `lib/discovery/spec-document-finder.ts` (new) | F-016-D1-03 | Pending |
| 20 | Update resume-ladder import | `lib/resume/resume-ladder.ts` | F-016-D1-03 | Pending |
| 21 | Create advisor-status-reader lib seam | `skill_advisor/lib/compat/advisor-status-reader.ts` (new) | F-016-D1-04 | Pending |
| 22 | Update daemon-probe default reader | `skill_advisor/lib/compat/daemon-probe.ts` | F-016-D1-04 | Pending |
| 23 | Create busy-retry neutral seam | `skill_advisor/lib/utils/busy-retry.ts` (new) | F-016-D1-05 | Pending |
| 24 | Update rebuild-from-source import | `skill_advisor/lib/freshness/rebuild-from-source.ts` | F-016-D1-05 | Pending |
| 25 | Extract `WatcherOrchestrator` class | `skill_advisor/lib/daemon/watcher-orchestrator.ts` (new) | F-016-D1-06 | Pending |
| 26 | Delegate reindex/generation orchestration to new class | `skill_advisor/lib/daemon/watcher.ts` | F-016-D1-06 | Pending |
| 27 | Create age-policy scorer seam | `skill_advisor/lib/scorer/age-policy.ts` (new) | F-016-D1-07 | Pending |
| 28 | Update derived lane import | `skill_advisor/lib/scorer/lanes/derived.ts` | F-016-D1-07 | Pending |
| 29 | Add predicate parameter to `computeCorpusStats` | `skill_advisor/lib/corpus/df-idf.ts` | F-016-D1-08 | Pending |
| 30 | typecheck | — | — | Pending |

### Phase D: Tests + Verification + Ship
| # | Action | Scope | Status |
|---|--------|-------|--------|
| 31 | Add 2 vitest files | architecture-seam.vitest.ts + architecture-cleanup-cycles.vitest.ts | Pending |
| 32 | Run targeted vitest for new tests + watcher tests | `cd mcp_server && npx vitest run skill_advisor/tests/ tests/architecture-cleanup-cycles.vitest.ts` | Pending |
| 33 | `validate.sh --strict` on this packet | this packet | Pending |
| 34 | `npm run stress` | mcp_server/ | Pending |
| 35 | `generate-context.js` for this packet | spec docs | Pending |
| 36 | commit + push to origin main | repo | Pending |
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit (vitest) | Seam importability + tuple-derived schemas (2 new files) | vitest |
| Targeted vitest | Watcher tests still pass after orchestrator extraction | vitest |
| Stress | Full `npm run stress` end-to-end | vitest stress config |
| Typecheck | After each finding group (D3 → D2 → D1) | tsc |

For seam verification (architecture-seam.vitest.ts): import each new module + the original location of the moved symbol. Both must resolve and yield the same reference. For cycle removal (architecture-cleanup-cycles.vitest.ts): verify shared-type modules expose the canonical types and that the original modules re-export them.

For the watcher refactor (F-016-D1-06): rely on the existing watcher test suite (no need to add new tests; the orchestrator extraction is internal). Run `cd mcp_server && npx vitest run skill_advisor/tests/skill-graph-watcher.vitest.ts` after the change.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Source of truth: `046-system-deep-research-bugs-and-improvements/research/research.md` §16 (boundary discipline), §17 (dependency graph), §18 (schema duplication)
- Validate script: `.opencode/skill/system-spec-kit/scripts/spec/validate.sh`
- Stress runner: `cd mcp_server && npm run stress`
- Existing package: `zod-to-json-schema` (already in `mcp_server/package.json` per dependency check)
- No cross-packet dependencies; sub-phase 006 is independent within Wave 2.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

If any change breaks the stress baseline or breaks an existing test:
1. `git revert <commit-sha>` reverts all 15 fixes atomically.
2. Re-run typecheck + stress to confirm baseline restored.
3. Identify the failing finding from inline `// F-NNN-XX-NN:` markers.
4. Reauthor the failing edit with smaller scope; re-typecheck + re-test.

The watcher refactor (F-016-D1-06) is the highest-risk single change. If it fails: revert ONLY the `watcher.ts` and `watcher-orchestrator.ts` changes (single hunk per file); other 14 fixes are isolated and can ship independently if needed.
<!-- /ANCHOR:rollback -->
