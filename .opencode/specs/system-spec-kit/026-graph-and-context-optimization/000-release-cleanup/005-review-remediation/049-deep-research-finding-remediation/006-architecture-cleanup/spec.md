---
template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2"
title: "Feature Specification: 006 Architecture Cleanup Remediation [template:level_2/spec.md]"
description: "Closes 15 P2 findings F-016-D1-01..08, F-017-D2-01..03, and F-018-D3-01..04 from packet 046. Tightens module boundaries by extracting neutral utilities, breaks dependency cycles by extracting shared types, removes a dead exported symbol, and centralizes vocabulary tuples so schemas/types/guards cannot drift. Addresses the largest sub-phase by deferring an oversized MCP-tool-contract source-of-truth refactor to a follow-on packet."
trigger_phrases:
  - "F-016-D1"
  - "F-017-D2"
  - "F-018-D3"
  - "architecture cleanup remediation"
  - "boundary discipline"
  - "dependency graph cycle"
  - "schema duplication"
  - "watcher orchestrator split"
  - "trust state vocabulary"
  - "lifecycle status vocabulary"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/049-deep-research-finding-remediation/006-architecture-cleanup"
    last_updated_at: "2026-05-01T10:00:00Z"
    last_updated_by: "remediation-orchestrator"
    recent_action: "Spec authored from worked-pilot 004 template"
    next_safe_action: "Apply 15 surgical refactors in D3 -> D2 -> D1 order; typecheck after each group"
    blockers: []
    key_files:
      - ".opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/lib/resume/resume-ladder.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/compat/daemon-probe.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/freshness/rebuild-from-source.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/daemon/watcher.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/derived.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/corpus/df-idf.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/lib/graph/community-summaries.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/context-server.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/freshness/trust-state.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/types.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/skill-advisor-brief.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "049-006-architecture-cleanup"
      parent_session_id: null
    completion_pct: 20
    open_questions: []
    answered_questions: []
---
# Feature Specification: 006 Architecture Cleanup Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 (15 findings) |
| **Status** | In Progress |
| **Created** | 2026-05-01 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 6 of 10 |
| **Predecessor** | 005-resource-leaks-silent-errors |
| **Successor** | 007-topology-build-boundary |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Fifteen architectural findings across the advisor, memory, freshness, and graph subsystems leak boundary violations, value-level dependency cycles, dead exports, and schema duplication identified by packet 046's deep research:

- Eight boundary violations: core skill-graph storage imports advisor freshness internals (F-016-D1-01); shared payload contract imports advisor renderer sanitization (F-016-D1-02); lib resume imports handler-level discovery (F-016-D1-03); compat lib imports handler status reader (F-016-D1-04); freshness rebuild imports busy-retry from daemon watcher (F-016-D1-05); the watcher itself owns watching + indexing + provenance + freshness + generation publishing in one module (F-016-D1-06); scorer derived lane imports lifecycle age policy directly (F-016-D1-07); and corpus DF-IDF math imports lifecycle filtering (F-016-D1-08).
- Three dependency-graph issues: a value-level cycle between session-snapshot and the memory-surface hook (F-017-D2-01); a community-detection/storage/summary type cycle (F-017-D2-02); and dead exported non-test symbols in `context-server.ts` (F-017-D2-03).
- Four schema duplications: trust-state literals redefined across schemas/metrics/guards (F-018-D3-01); lifecycle status union and runtime schemas can drift (F-018-D3-02); advisor runtime/outcome labels split across unions/tuples/Zod/guards (F-018-D3-03); and the MCP JSON Schema, Zod inputs, handler checks, and allowed-parameter lists each duplicate the tool contracts (F-018-D3-04).

### Purpose
Close all fifteen findings with surgical refactors that preserve every public API surface. Extract neutral utilities under `mcp_server/lib/utils/` for cross-domain helpers, break value-level cycles by extracting shared types into seam modules, remove dead exports, and centralize vocabulary tuples as the single source from which schemas/types/guards derive. F-018-D3-04 is partially closed (most critical advisor tool contracts deduplicated; the broader 60+-tool surface is documented as deferred to a follow-on packet because a clean single-source generation requires too much code for one sub-phase).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Fifteen surgical refactors, one per finding F-016-D1-01..08, F-017-D2-01..03, F-018-D3-01..04.
- New seam modules under `mcp_server/lib/utils/` and parallel locations as needed.
- New vitest cases for every significant boundary change (importability from old call sites).
- Strict validation pass on this packet.
- One commit pushed to `origin main`.

### Out of Scope
- Full single-source generation of the entire 60+-tool MCP contract surface (deferred from F-018-D3-04 to a follow-on packet because a clean code-generation pass would touch every tool).
- Removing `runWithBusyRetry` from `watcher.ts` (F-016-D1-05 only re-exports the helper from a neutral location; the watcher's internal usage stays so existing tests keep working).
- Removing the `__testables` export from `watcher.ts` (kept for existing test imports).
- Behavioral changes to public API surfaces — every external symbol from the touched modules must still be importable at the original path.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/lib/utils/sqlite-integrity.ts` | Create | F-016-D1-01: neutral re-export of `checkSqliteIntegrity` from advisor's freshness internals; storage callers depend inward. |
| `mcp_server/lib/skill-graph/skill-graph-db.ts` | Modify | F-016-D1-01: import `checkSqliteIntegrity` from the neutral utils module instead of advisor freshness. |
| `mcp_server/lib/utils/skill-label-sanitizer.ts` | Create | F-016-D1-02: neutral re-export of `sanitizeSkillLabel` and a `runtime/outcome` label tuple. |
| `mcp_server/lib/context/shared-payload.ts` | Modify | F-016-D1-02: import sanitizer from the neutral utils module instead of advisor renderer. |
| `mcp_server/lib/discovery/spec-document-finder.ts` | Create | F-016-D1-03: lib-level wrapper around the existing `findSpecDocuments` with a stable contract; lib code depends inward through this seam. |
| `mcp_server/lib/resume/resume-ladder.ts` | Modify | F-016-D1-03: import `findSpecDocuments` from the new lib seam instead of `handlers/memory-index-discovery.js`. |
| `mcp_server/skill_advisor/lib/compat/advisor-status-reader.ts` | Create | F-016-D1-04: advisor-lib status reader wrapper; the handler becomes a thin caller. |
| `mcp_server/skill_advisor/lib/compat/daemon-probe.ts` | Modify | F-016-D1-04: import status reader from the new advisor-lib seam (default path), not the handler. |
| `mcp_server/skill_advisor/lib/utils/busy-retry.ts` | Create | F-016-D1-05: neutral re-export of `runWithBusyRetry` so freshness rebuild does not depend on the daemon watcher module. |
| `mcp_server/skill_advisor/lib/freshness/rebuild-from-source.ts` | Modify | F-016-D1-05: import `runWithBusyRetry` from the neutral utils module instead of `daemon/watcher.js`. |
| `mcp_server/skill_advisor/lib/daemon/watcher-orchestrator.ts` | Create | F-016-D1-06: extract reindex/generation orchestration into an internal `WatcherOrchestrator` that the watcher calls. Public API of `watcher.ts` (createSkillGraphWatcher, discoverWatchTargets, runWithBusyRetry, all `__testables` symbols, ring buffer, `unwatch`, `onMalformed`) stays identical. |
| `mcp_server/skill_advisor/lib/daemon/watcher.ts` | Modify | F-016-D1-06: delegate reindex/generation orchestration to the new orchestrator; preserve every public symbol and every behavior added by sub-phase 005 (`unwatch?`, ring buffer, `onMalformed`). |
| `mcp_server/skill_advisor/lib/scorer/lanes/derived.ts` | Modify | F-016-D1-07: import age-haircut policy from a neutral scorer policy seam (the haircut module already lives under `lifecycle/`; the scorer policy module re-exports it so the lane no longer reaches across architectural lines). |
| `mcp_server/skill_advisor/lib/scorer/age-policy.ts` | Create | F-016-D1-07: neutral scorer policy seam re-exporting `applyAgeHaircutToLane`. |
| `mcp_server/skill_advisor/lib/corpus/df-idf.ts` | Modify | F-016-D1-08: accept a predicate via parameter (default = `filterCorpusStatEligible`); callers can pass eligible docs directly without the corpus math module reaching into `lifecycle/`. |
| `mcp_server/lib/graph/community-types.ts` | Create | F-017-D2-02: shared `CommunityResult` and `CommunitySummary` types extracted from the cycle. |
| `mcp_server/lib/graph/community-summaries.ts` | Modify | F-017-D2-02: import `CommunityResult` and define-export `CommunitySummary` via the shared types module. |
| `mcp_server/lib/graph/community-detection.ts` | Modify | F-017-D2-02: import `CommunityResult` from the shared types module. |
| `mcp_server/lib/graph/community-storage.ts` | Modify | F-017-D2-02: import `CommunityResult` and `CommunitySummary` from the shared types module. |
| `mcp_server/lib/session/structural-bootstrap-contract.ts` | Create | F-017-D2-01: extract the `StructuralBootstrapContract` type into its own module so memory-surface and session-snapshot share a seam without a value cycle. |
| `mcp_server/lib/session/session-snapshot.ts` | Modify | F-017-D2-01: re-export `StructuralBootstrapContract` from the new seam module; runtime function `buildStructuralBootstrapContract` stays here. |
| `mcp_server/hooks/memory-surface.ts` | Modify | F-017-D2-01: import the type from the new seam module so the cycle is broken at the type level. |
| `mcp_server/context-server.ts` | Modify | F-017-D2-03: remove the dead `getDetectedRuntime` export. |
| `mcp_server/skill_advisor/lib/freshness/trust-state-values.ts` | Create | F-018-D3-01: single canonical tuple of trust-state values (live/stale/absent/unavailable). All schemas/guards/types derive from this tuple. |
| `mcp_server/skill_advisor/lib/freshness/trust-state.ts` | Modify | F-018-D3-01: re-export the canonical tuple and derive `SkillGraphTrustState` from it via `typeof TUPLE[number]`. |
| `mcp_server/skill_advisor/lib/lifecycle/status-values.ts` | Create | F-018-D3-02: single canonical tuple for `SkillLifecycleStatus`. |
| `mcp_server/skill_advisor/lib/scorer/types.ts` | Modify | F-018-D3-02: derive `SkillLifecycleStatus` from the canonical tuple. |
| `mcp_server/skill_advisor/lib/advisor-runtime-values.ts` | Create | F-018-D3-03: canonical tuples for `AdvisorRuntime` and outcome labels; everything downstream derives from these tuples. |
| `mcp_server/skill_advisor/lib/skill-advisor-brief.ts` | Modify | F-018-D3-03: derive `AdvisorRuntime` from the canonical tuple. |
| `mcp_server/skill_advisor/handlers/__tests__/architecture-seam.vitest.ts` | Create | Verify all new lib seams are importable from old call sites + new locations. |
| `mcp_server/tests/architecture-cleanup-cycles.vitest.ts` | Create | Verify the dependency-graph cycle removals (community types + structural bootstrap contract). |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### Functional
- FR-1 (F-016-D1-01): Storage callers MUST import `checkSqliteIntegrity` from `lib/utils/sqlite-integrity.js`. The advisor freshness implementation may continue to live under `skill_advisor/lib/freshness/` and the neutral utils module re-exports from it.
- FR-2 (F-016-D1-02): Shared payload contract MUST import `sanitizeSkillLabel` from `lib/utils/skill-label-sanitizer.js`. The advisor renderer's local sanitizer stays in place; the seam re-exports it.
- FR-3 (F-016-D1-03): `lib/resume/resume-ladder.ts` MUST import `findSpecDocuments` from a lib seam (`lib/discovery/spec-document-finder.js`); the seam re-exports the existing handler implementation so test surfaces stay unchanged.
- FR-4 (F-016-D1-04): `compat/daemon-probe.ts` default `statusReader` MUST resolve through an advisor-lib wrapper (`compat/advisor-status-reader.js`); the existing handler implementation remains the underlying source.
- FR-5 (F-016-D1-05): `freshness/rebuild-from-source.ts` MUST import `runWithBusyRetry` from `lib/utils/busy-retry.js`. The watcher itself can keep its own copy of `runWithBusyRetry` exported, but external consumers depend on the neutral utility.
- FR-6 (F-016-D1-06): `daemon/watcher.ts` MUST delegate reindex/generation orchestration to a `WatcherOrchestrator` defined in `daemon/watcher-orchestrator.ts`. Every public symbol exported from `watcher.ts` (incl. `createSkillGraphWatcher`, `discoverWatchTargets`, `runWithBusyRetry`, `quarantineSkill`, `recoverQuarantinedSkill`, `countActiveQuarantines`, `writeFileAtomic`, `__testables`) MUST stay at the same path with the same signature, and every behavior added by sub-phase 005 (`unwatch?`, ring buffer, `onMalformed` callback) MUST be preserved.
- FR-7 (F-016-D1-07): `scorer/lanes/derived.ts` MUST import `applyAgeHaircutToLane` from `scorer/age-policy.js`; the lifecycle module stays the implementation home but the lane no longer crosses the architectural seam.
- FR-8 (F-016-D1-08): `corpus/df-idf.ts` `computeCorpusStats` MUST accept an optional `predicate` parameter; default is `filterCorpusStatEligible` so existing callers see no behavioral change.
- FR-9 (F-017-D2-01): `lib/session/session-snapshot.ts` and `hooks/memory-surface.ts` MUST share `StructuralBootstrapContract` via a type-only seam module; no value-level dependency cycle remains.
- FR-10 (F-017-D2-02): `community-detection.ts`, `community-storage.ts`, and `community-summaries.ts` MUST share `CommunityResult` and `CommunitySummary` via `lib/graph/community-types.js`.
- FR-11 (F-017-D2-03): `getDetectedRuntime` MUST be removed from `context-server.ts` exports (it has no live consumers).
- FR-12 (F-018-D3-01): `SkillGraphTrustState` MUST derive from a canonical tuple of values; the tuple is the single source of truth.
- FR-13 (F-018-D3-02): `SkillLifecycleStatus` MUST derive from a canonical tuple of values.
- FR-14 (F-018-D3-03): `AdvisorRuntime` MUST derive from a canonical tuple of values.
- FR-15 (F-018-D3-04): The most critical 1-2 advisor tool contracts (`advisor_recommend`, `advisor_validate`) MUST have their JSON schema generated from the existing zod input schema via a `zodToJsonSchema` adapter; the broader 60+-tool surface is documented as deferred to a follow-on packet.

### Non-Functional
- NFR-1: `npm run typecheck` exits 0.
- NFR-2: `npm run stress` exits 0 with at least 58 files / 194 tests.
- NFR-3: `validate.sh --strict` exits 0 on this packet.
- NFR-4: Every public symbol from each touched module remains importable at the original path with the original signature.
- NFR-5: Each edit carries an inline finding-ID marker (`// F-016-D1-NN:` / `// F-017-D2-NN:` / `// F-018-D3-NN:`) for traceability.

### Constraints
- Stay on `main`; no feature branch.
- No new external dependencies.
- All new seam modules under `mcp_server/lib/utils/` (cross-domain) or under their owning subsystem with clear semantic naming.
- Watcher refactor (F-016-D1-06) is INTERNAL ONLY — external API surface stays identical.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- [ ] Spec authored
- [ ] All 15 refactors applied with finding-ID citations (1 deferred-with-reason)
- [ ] All new vitest cases pass
- [ ] `validate.sh --strict` exit 0 for this packet
- [ ] `npm run typecheck` exit 0
- [ ] `npm run stress` exit 0 / 58+ files / 194+ tests
- [ ] One commit pushed to `origin main` (final step)
- [ ] implementation-summary.md updated with Findings closed table (15 rows)
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Mitigation |
|------|-----------|
| Watcher refactor breaks public API | Apply via internal `WatcherOrchestrator` class only. Re-export every existing symbol unchanged. Keep all sub-phase 005 features (unwatch, ring buffer, onMalformed). Run targeted watcher tests after edit. |
| Cycle break introduces new cycle | Verify with typecheck after extracting each shared types module. Keep type-only re-exports at the seam. |
| `getDetectedRuntime` removal breaks an external consumer | Verified zero live consumers (only its own definition + dist `.d.ts`). Removed import is documented in implementation-summary. |
| Tuple-derived schema introduces runtime drift | Use `typeof TUPLE[number]` so TS surfaces compile errors if a schema literal omits a value. Add unit test that schema enums match the tuple. |
| F-018-D3-04 partial fix degrades the rest of the surface | Document as deferred in known limitations; the deferred items are existing behavior, not a regression. |
| Stress regression | Each refactor is a re-export or internal-class extraction; no behavior change. Verified via full `npm run stress` post-change. |

Dependencies:
- Source of truth: `046-system-deep-research-bugs-and-improvements/research/research.md` §16, §17, §18
- Validate: `.opencode/skill/system-spec-kit/scripts/spec/validate.sh`
- No other packet dependencies.
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:edges -->
## L2: EDGE CASES

| Edge | Trigger | Expected behavior |
|------|---------|-------------------|
| Watcher orchestrator failure during reindex | `reindexSkill` throws after orchestrator extraction | Same diagnostic surfaced as before extraction (`REINDEX_FAILED:<slug>:<msg>`); orchestrator behavior unchanged from current watcher. |
| Watcher `unwatch` not provided by harness | Test harness watcher does not expose `unwatch` | Refresh path falls back gracefully (existing F-003-A3-01 contract). |
| Tuple-derived schema misses a value | Schema author forgets to include all tuple values | TypeScript compile error at the schema definition site. |
| Importer of removed `getDetectedRuntime` | External code imports the dead export | TypeScript compile error; no callers exist (verified). |
| New seam module shadows old import path | Old code still imports advisor renderer for sanitizer | Old import keeps working (renderer re-export preserved); new code uses seam. |
<!-- /ANCHOR:edges -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Finding | Files | Effort (minutes) |
|---------|-------|-----------------:|
| F-016-D1-01 | sqlite-integrity seam + skill-graph-db | 10 |
| F-016-D1-02 | skill-label-sanitizer seam + shared-payload | 10 |
| F-016-D1-03 | spec-document-finder seam + resume-ladder | 15 |
| F-016-D1-04 | advisor-status-reader seam + daemon-probe | 15 |
| F-016-D1-05 | busy-retry seam + rebuild-from-source | 10 |
| F-016-D1-06 | watcher-orchestrator + watcher delegate | 60 |
| F-016-D1-07 | age-policy seam + derived lane | 10 |
| F-016-D1-08 | df-idf predicate parameter | 15 |
| F-017-D2-01 | structural-bootstrap-contract seam + 2 imports | 15 |
| F-017-D2-02 | community-types seam + 3 imports | 20 |
| F-017-D2-03 | remove `getDetectedRuntime` | 5 |
| F-018-D3-01 | trust-state-values + schemas | 15 |
| F-018-D3-02 | lifecycle status-values | 10 |
| F-018-D3-03 | advisor-runtime-values | 15 |
| F-018-D3-04 (partial) | zodToJsonSchema for 2 tools + deferred doc | 25 |
| Tests | 2 vitest files | 30 |
| **Total** | | **~280 minutes (~4.5h)** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- F-018-D3-04 is intentionally partial. The full single-source generation for the entire 60+-tool MCP contract surface is deferred to a follow-on packet (research.md §18 strategic question). The partial fix demonstrates the pattern on the two most critical advisor contracts (`advisor_recommend`, `advisor_validate`) so a follow-on packet has a concrete template to extend.
<!-- /ANCHOR:questions -->
