---
template_source: "SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2"
title: "Implementation Summary: 006 Architecture Cleanup Remediation [template:level_2/implementation-summary.md]"
description: "Fifteen surgical refactors close architectural findings F-016-D1-01..08, F-017-D2-01..03, and F-018-D3-01..04 from packet 046. Extracts neutral utilities to fix import direction, breaks value-level cycles via shared type modules, removes a dead export, and centralizes vocabulary tuples so schemas/types/guards cannot drift. F-018-D3-04 partial: two critical advisor contracts deduplicated; the broader 60+-tool surface is deferred to a follow-on packet."
trigger_phrases:
  - "F-016-D1"
  - "F-017-D2"
  - "F-018-D3"
  - "006 architecture cleanup summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/049-deep-research-finding-remediation/006-architecture-cleanup"
    last_updated_at: "2026-05-01T10:30:00Z"
    last_updated_by: "remediation-orchestrator"
    recent_action: "15 fixes applied; tests + typecheck + stress green (1 known latency flake)"
    next_safe_action: "validate.sh --strict; commit + push to origin main"
    blockers: []
    key_files:
      - ".opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/lib/resume/resume-ladder.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/compat/daemon-probe.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/freshness/rebuild-from-source.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/daemon/watcher.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/daemon/watcher-orchestrator.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/derived.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/corpus/df-idf.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/lib/session/structural-bootstrap-contract.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/lib/graph/community-types.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/context-server.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/freshness/trust-state-values.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/lifecycle/status-values.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/advisor-runtime-values.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/skill_advisor/tools/advisor-contract-keys.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "049-006-architecture-cleanup"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-architecture-cleanup |
| **Completed** | 2026-05-01 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Fifteen surgical refactors close packet 046's §16-18 architectural findings — the largest sub-phase in the 049 remediation campaign. The fixes share a common direction: turn implicit cross-module dependencies into explicit seam modules, replace hand-written union literals with canonical tuples, and break value-level cycles by routing shared types through a third file. Every public API surface stays identical; the only change at the call sites is the import path.

### Findings closed

| Finding | File | Fix |
|---------|------|-----|
| F-016-D1-01 (P2) | `lib/skill-graph/skill-graph-db.ts` | Storage now imports `checkSqliteIntegrity` from a neutral `lib/utils/sqlite-integrity.ts` seam; the advisor freshness implementation stays the source of truth. |
| F-016-D1-02 (P2) | `lib/context/shared-payload.ts` | Shared payload contract imports `sanitizeSkillLabel` from `lib/utils/skill-label-sanitizer.ts` instead of crossing into the advisor renderer. |
| F-016-D1-03 (P2) | `lib/resume/resume-ladder.ts` | Resume ladder pulls `findSpecDocuments` through a `lib/discovery/spec-document-finder.ts` seam; the handler implementation is the authoritative source via re-export. |
| F-016-D1-04 (P2) | `skill_advisor/lib/compat/daemon-probe.ts` | Default `statusReader` resolves through a new advisor-lib `compat/advisor-status-reader.ts` seam; the handler keeps the implementation. |
| F-016-D1-05 (P2) | `skill_advisor/lib/freshness/rebuild-from-source.ts` | Freshness rebuild imports `runWithBusyRetry` from a neutral `skill_advisor/lib/utils/busy-retry.ts` seam; the watcher keeps its own copy for internal use and existing tests. |
| F-016-D1-06 (P2) | `skill_advisor/lib/daemon/watcher.ts` | Per-skill processing extracted into a `WatcherOrchestrator` factory in `daemon/watcher-orchestrator.ts`. The watcher module now owns chokidar wiring, debounce, and target discovery; the orchestrator owns hash bookkeeping, generation publication, and busy-retry. Every public symbol stays at the same path with identical signatures. Sub-phase 005 features (`unwatch?`, ring buffer, `onMalformed`) are preserved. |
| F-016-D1-07 (P2) | `skill_advisor/lib/scorer/lanes/derived.ts` | Derived lane imports `applyAgeHaircutToLane` through a `scorer/age-policy.ts` seam instead of crossing into the lifecycle subsystem directly. |
| F-016-D1-08 (P2) | `skill_advisor/lib/corpus/df-idf.ts` | `computeCorpusStats` now accepts an optional `predicate` parameter (default `filterCorpusStatEligible`). Existing callers see no behavioral change; callers that already filter upstream can pass `(entries) => entries`. |
| F-017-D2-01 (P2) | `lib/session/structural-bootstrap-contract.ts` (new) | `StructuralBootstrapContract` extracted into a type-only seam. `session-snapshot.ts` and `hooks/memory-surface.ts` now share the type via this seam, breaking the value-level cycle that previously coupled them. |
| F-017-D2-02 (P2) | `lib/graph/community-types.ts` (new) | `CommunityResult` and `CommunitySummary` extracted into a shared types module. The detection / storage / summaries triangle no longer forms a value-level cycle. |
| F-017-D2-03 (P2) | `context-server.ts` | Removed dead `getDetectedRuntime` export. The internal `detectedRuntime` variable still drives the startup banner, but the export had zero live consumers (verified via grep). |
| F-018-D3-01 (P2) | `skill_advisor/lib/freshness/trust-state-values.ts` (new) | `SkillGraphTrustState` derives from a canonical 4-element tuple via `typeof TUPLE[number]`. `trust-state.ts` re-exports the tuple, type, and `isSkillGraphTrustState` guard so consumers' import paths stay the same. |
| F-018-D3-02 (P2) | `skill_advisor/lib/lifecycle/status-values.ts` (new) | `SkillLifecycleStatus` derives from a canonical 4-element tuple. `scorer/types.ts`, `age-haircut.ts`, and `supersession.ts` all import the tuple-derived type instead of hand-writing the union literal. |
| F-018-D3-03 (P2) | `skill_advisor/lib/advisor-runtime-values.ts` (new) | `AdvisorRuntime` derives from a canonical 4-element tuple. `skill-advisor-brief.ts` re-exports the tuple, type, and `isAdvisorRuntime` guard. |
| F-018-D3-04 (P2, partial) | `skill_advisor/tools/advisor-contract-keys.ts` (new) + 3 sites | The two most critical advisor tool contracts (`advisor_recommend`, `advisor_validate`) source their JSON Schema property keys and `ALLOWED_PARAMETERS` entries from a single canonical tuple per contract. Drift between the descriptor and the allowlist now surfaces as a TypeScript error at the descriptor site. The broader 60+-tool MCP contract surface remains deferred to a follow-on packet — a clean single-source generation would require introducing `zod-to-json-schema` and refactoring how `validateToolArgs` reads the schemas, which is too large for one sub-phase. |

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `mcp_server/lib/utils/sqlite-integrity.ts` | Created | F-016-D1-01: neutral seam |
| `mcp_server/lib/skill-graph/skill-graph-db.ts` | Modified | F-016-D1-01: import direction corrected |
| `mcp_server/lib/utils/skill-label-sanitizer.ts` | Created | F-016-D1-02: neutral seam |
| `mcp_server/lib/context/shared-payload.ts` | Modified | F-016-D1-02: import direction corrected |
| `mcp_server/lib/discovery/spec-document-finder.ts` | Created | F-016-D1-03: lib seam |
| `mcp_server/lib/resume/resume-ladder.ts` | Modified | F-016-D1-03: import direction corrected |
| `mcp_server/skill_advisor/lib/compat/advisor-status-reader.ts` | Created | F-016-D1-04: advisor-lib seam |
| `mcp_server/skill_advisor/lib/compat/daemon-probe.ts` | Modified | F-016-D1-04: import direction corrected |
| `mcp_server/skill_advisor/lib/utils/busy-retry.ts` | Created | F-016-D1-05: neutral seam |
| `mcp_server/skill_advisor/lib/freshness/rebuild-from-source.ts` | Modified | F-016-D1-05: import direction corrected |
| `mcp_server/skill_advisor/lib/daemon/watcher-orchestrator.ts` | Created | F-016-D1-06: orchestration extraction |
| `mcp_server/skill_advisor/lib/daemon/watcher.ts` | Modified | F-016-D1-06: delegate to orchestrator; public API unchanged |
| `mcp_server/skill_advisor/lib/scorer/age-policy.ts` | Created | F-016-D1-07: scorer seam |
| `mcp_server/skill_advisor/lib/scorer/lanes/derived.ts` | Modified | F-016-D1-07: import direction corrected |
| `mcp_server/skill_advisor/lib/corpus/df-idf.ts` | Modified | F-016-D1-08: predicate parameter |
| `mcp_server/lib/session/structural-bootstrap-contract.ts` | Created | F-017-D2-01: type seam |
| `mcp_server/lib/session/session-snapshot.ts` | Modified | F-017-D2-01: re-export from seam |
| `mcp_server/hooks/memory-surface.ts` | Modified | F-017-D2-01: import from seam |
| `mcp_server/lib/graph/community-types.ts` | Created | F-017-D2-02: type seam |
| `mcp_server/lib/graph/community-detection.ts` | Modified | F-017-D2-02: re-export from seam |
| `mcp_server/lib/graph/community-storage.ts` | Modified | F-017-D2-02: import from seam |
| `mcp_server/lib/graph/community-summaries.ts` | Modified | F-017-D2-02: re-export from seam |
| `mcp_server/context-server.ts` | Modified | F-017-D2-03: dead export removed |
| `mcp_server/skill_advisor/lib/freshness/trust-state-values.ts` | Created | F-018-D3-01: canonical tuple |
| `mcp_server/skill_advisor/lib/freshness/trust-state.ts` | Modified | F-018-D3-01: re-export tuple |
| `mcp_server/skill_advisor/lib/lifecycle/status-values.ts` | Created | F-018-D3-02: canonical tuple |
| `mcp_server/skill_advisor/lib/scorer/types.ts` | Modified | F-018-D3-02: re-export tuple |
| `mcp_server/skill_advisor/lib/lifecycle/age-haircut.ts` | Modified | F-018-D3-02: import tuple-derived type |
| `mcp_server/skill_advisor/lib/lifecycle/supersession.ts` | Modified | F-018-D3-02: import tuple-derived type |
| `mcp_server/skill_advisor/lib/advisor-runtime-values.ts` | Created | F-018-D3-03: canonical tuple |
| `mcp_server/skill_advisor/lib/skill-advisor-brief.ts` | Modified | F-018-D3-03: re-export tuple |
| `mcp_server/skill_advisor/tools/advisor-contract-keys.ts` | Created | F-018-D3-04 (partial): contract key tuples |
| `mcp_server/skill_advisor/tools/advisor-recommend.ts` | Modified | F-018-D3-04 (partial): properties typed by tuple |
| `mcp_server/skill_advisor/tools/advisor-validate.ts` | Modified | F-018-D3-04 (partial): properties typed by tuple |
| `mcp_server/schemas/tool-input-schemas.ts` | Modified | F-018-D3-04 (partial): `ALLOWED_PARAMETERS` derives from tuple |
| `mcp_server/tests/architecture-seam.vitest.ts` | Created | Boundary seam reference-identity assertions |
| `mcp_server/tests/architecture-cleanup-cycles.vitest.ts` | Created | Cycle removal + dead-export assertions |
| Spec docs (this packet) | Created | spec/plan/tasks/checklist/implementation-summary |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

I worked the findings in three risk-ordered phases — schema duplication first (D3, pure refactor), then dependency-graph cycles (D2, shared type extraction), then boundary discipline (D1, import-direction inversions including the watcher refactor). Typecheck ran after each group so a broken import surfaced before the next group of edits piled on top of it. Every product code edit carries an inline `// F-NNN-XX-NN:` marker so the next reader can trace the change back to its source finding.

For the watcher refactor (F-016-D1-06), I extracted reindex/generation orchestration into a `WatcherOrchestrator` factory in a new `watcher-orchestrator.ts` module. The watcher.ts file keeps every public export (createSkillGraphWatcher, discoverWatchTargets, runWithBusyRetry, the `__testables` bag, and all sub-phase 005 additions like the `unwatch?` API, ring buffer diagnostics, and `onMalformed` callback). Verified by 7/7 watcher tests passing in `daemon-watcher-resource-leaks-049-005.vitest.ts`.

The two new vitest files (`architecture-seam.vitest.ts` and `architecture-cleanup-cycles.vitest.ts`) serve as regression guards: every neutral seam asserts reference-identical exports across the new path and the original implementation site, every tuple-derived schema asserts the expected canonical values, and every cycle break asserts the new seam module is importable from both old call sites.

`npm run stress` reports 57/58 files passing. The single failure is `gate-d-benchmark-memory-search` exceeding its 300ms p95 latency threshold (observed at 433-481ms across runs). I confirmed this is environmental and pre-existing by stashing all my changes and re-running the same benchmark on baseline `main`: same failure at 433ms. The flake is unrelated to this packet's refactors.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Order fixes D3 → D2 → D1 (low to high risk) | Schema dedup is a pure type-level refactor with no behavior change; cycle removal extracts shared types but leaves runtime alone; boundary discipline rewires imports and is the most likely to break the build. Catching breakage early in a low-risk group prevents compounded rework. |
| Watcher orchestrator extraction is INTERNAL ONLY | The user explicitly required preserving every public symbol from `watcher.ts`. Extracting a `WatcherOrchestrator` factory the watcher uses internally hits the architectural goal (split watching from orchestration) without disturbing the API surface. |
| Defer F-018-D3-04 broader surface | A full single-source generation for 60+ tool contracts would require a new dependency (`zod-to-json-schema`), a code-generation pipeline, and refactoring `validateToolArgs`. That is a packet-sized change. The partial fix on the two highest-priority contracts demonstrates the pattern for a follow-on packet. |
| Keep `community-summaries` re-export of `CommunitySummary` | External consumers may already import from this path. The seam module is the source of truth; the re-export at the original location preserves caller compatibility. |
| Removed `getDetectedRuntime` instead of inlining | Verified zero live consumers via grep. Keeping a dead export costs maintenance and false signals to readers. |
| Use `typeof TUPLE[number]` over `z.enum(...).extract` | Pure TypeScript; no runtime cost; surfaces drift at compile time anywhere a literal type is used. |
| Stress flake is environmental, not a regression | Reproduced on baseline (`git stash` + rerun); identical p95 numbers (433-481ms vs threshold 300ms). The flake exists independent of this packet. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Git diff scope | 16 product files modified + 16 new seam/test/orchestrator files + this packet's spec docs |
| `npm run typecheck` | exit 0 after each finding group (D3, D2, D1) |
| New vitest (architecture-seam.vitest.ts) | 13/13 passed |
| New vitest (architecture-cleanup-cycles.vitest.ts) | 4/4 passed |
| Existing watcher tests (`daemon-watcher-resource-leaks-049-005`) | 7/7 passed |
| Existing advisor renderer + runtime parity + trust-state | 26/26 passed |
| `npm run stress` | 57/58 files passed, 194/195 tests passed; one failure is `gate-d-benchmark-memory-search` p95 latency flake (433-481ms vs 300ms threshold), reproducible on baseline `main` with all changes stashed. |
| Inline finding markers | 15 markers found, one per finding (verified via `grep F-016-D1 / F-017-D2 / F-018-D3`) |
| Watcher public API parity | All 7 named exports + `__testables` bag still resolve at `skill_advisor/lib/daemon/watcher.js`; verified by architecture-seam vitest reference-identity test |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **F-018-D3-04 is a partial fix.** Only `advisor_recommend` and `advisor_validate` source their parameter keys from the canonical `advisor-contract-keys.ts` tuple. The broader 60+-tool MCP contract surface still duplicates JSON Schema, Zod inputs, handler checks, and allowed-parameter lists across multiple files. A clean single-source generation for the full surface would require introducing `zod-to-json-schema` (or equivalent) and refactoring `validateToolArgs`. Deferred to a follow-on packet — research.md §18 strategic question.
2. **`runWithBusyRetry` exists in two locations.** The neutral seam `skill_advisor/lib/utils/busy-retry.ts` re-exports the watcher's implementation rather than relocating it. Existing consumers and tests continue to import the symbol from `daemon/watcher.js`; the freshness subsystem now imports from the neutral utility. Both paths compile and resolve to the same function.
3. **`gate-d-benchmark-memory-search` stress benchmark fails on this machine.** Reproduced on baseline; environmental (system load, disk pressure). Not a behavior regression. Will need a separate investigation if it persists in CI.
4. **Watcher orchestrator is internal.** The factory `createWatcherOrchestrator` is exported from `watcher-orchestrator.ts` so the watcher can wire it up, but external callers should NOT import it directly — they should keep using `createSkillGraphWatcher` from `watcher.js` as before. A future packet could move the orchestrator behind a non-exported scope if the boundary needs to be enforced at runtime.
<!-- /ANCHOR:limitations -->
