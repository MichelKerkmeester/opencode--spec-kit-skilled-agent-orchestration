---
title: "Feature Specification: Save Flow Planner-First Trim"
description: "Define the implementation packet that turns 014's trim-targeted research verdict into a planner-first `/memory:save` default path, preserves the canonical atomic fallback, and removes over-engineered save-time work from the hot path."
trigger_phrases:
  - "015-save-flow-planner-first-trim"
  - "planner-first memory save"
  - "save flow trim"
  - "canonical save fallback"
  - "026-graph-and-context-optimization"
importance_tier: "important"
contextType: "architecture"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/015-save-flow-planner-first-trim"
    last_updated_at: "2026-04-15T00:00:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Authored Level 3 docs scaffold from 014 research findings"
    next_safe_action: "Review packet; run 3 transcript prototypes"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "015-save-flow-planner-first-trim-seed"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: Save Flow Planner-First Trim

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

Packet 015 turns packet 014's `trim-targeted` research verdict into an implementation-ready refactor plan: make `/memory:save` planner-first by default, keep the canonical atomic writer as an explicit fallback, and move score-heavy or advisory save-time automation out of the hot path. The research is clear that canonical preparation, routed identity, the eight-category content-router contract, and thin continuity validation remain load-bearing, while Tier 3 routing, quality-loop auto-fix, reconsolidation-on-save, and post-insert enrichment no longer earn default-path cost. ADR-006 records the one scoped preservation exception: `content-router.ts` keeps the category switch plus Tier 1 and Tier 2 dispatch intact, but now contains the in-file Tier 3 default-disable/manual-review guard. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-save-flow-backend-relevance-review/research/research.md:29-31] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1223] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/save/atomic-index-memory.ts:270] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/continuity/thin-continuity-record.ts:852]

**Key Decisions**: Default to structured planner output, preserve full-auto atomic save behind explicit fallback, and defer seven freshness or enrichment concerns out of the default save path. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-save-flow-backend-relevance-review/research/findings-registry.json:6-17] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:2191]

**Critical Dependencies**: `memory-save.ts`, `content-router.ts`, `atomic-index-memory.ts`, `create-record.ts`, `thin-continuity-record.ts`, `save-quality-gate.ts`, `quality-loop.ts`, `reconsolidation-bridge.ts`, `post-insert.ts`, `workflow.ts`, and the `/memory:save` command contract must stay aligned during the trim. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-save-flow-backend-relevance-review/research/findings-registry.json:18-89] [SOURCE: .opencode/changelog/01--system-spec-kit/v3.4.1.0.md:1-18]

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-04-15 |
| **Branch** | `026-015-save-flow-planner-first-trim` |
| **Parent Packet** | `../spec.md` |
| **Predecessor** | `014-save-flow-backend-relevance-review` |
| **Successor** | None yet |
| **Research Verdict** | `trim-targeted` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The save stack already stopped writing legacy `[spec]/memory/*.md` artifacts in `v3.4.1.0`, but the default `/memory:save` path still carries a three-tier router, auto-fix quality loop, reconsolidation bridge, post-insert enrichment bundle, synchronous graph refresh, and synchronous spec-doc reindexing even though 014 found only a narrow canonical core to be load-bearing. The dry-run path already exposes most of the information an AI needs to apply canonical edits safely, so the current design pays hot-path cost for work that is advisory, freshness-only, or explicitly optional. [SOURCE: .opencode/changelog/01--system-spec-kit/v3.4.1.0.md:1-18] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1253] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1364] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:2191] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-save-flow-backend-relevance-review/research/research.md:20-27]

### Purpose
Deliver a planner-first save flow that returns structured route, target, legality, continuity, and follow-up information to the AI, while preserving the current canonical atomic writer as an opt-in fallback and moving over-engineered or freshness-only subsystems out of the default save path. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-save-flow-backend-relevance-review/research/findings-registry.json:18-31] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:2346]
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Planner-first `/memory:save` default behavior with structured, non-mutating output that tells the AI what to edit and what follow-up actions remain.
- Preservation of canonical atomic save, routed identity, same-path lineage, and thin continuity validation as the explicit fallback path.
- Removal of Tier 3 routing, quality-loop auto-fix retries, reconsolidation-on-save, and post-insert enrichment from the default hot path.
- Deferral of graph refresh, spec-doc reindex, PE gating, and chunking to explicit follow-up actions or fallback-only behavior when applicable.
- Regression coverage for planner output, fallback safety, feature-flag gating, and transcript-level parity against three real save scenarios.

### Out of Scope
- Replacing or redesigning the canonical atomic writer itself. The research says this is load-bearing and should stay intact. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/save/atomic-index-memory.ts:270]
- Rewriting the eight-category routing contract. Packet 015 trims classifier machinery, not the category model. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:22]
- Removing thin continuity validation or allowing malformed `_memory.continuity` writes. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/continuity/thin-continuity-record.ts:852]
- Committing docs, running `generate-context.js`, or changing packet status beyond the drafted implementation plan.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts` | Modify | Make planner-first response the default execution mode and keep full-auto atomic save behind explicit fallback. |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts` | Modify | Add planner payload contracts, fallback markers, and deferred follow-up action types. |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts` | Modify | Serialize planner output, follow-up actions, and fallback guidance consistently. |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/save/validation-responses.ts` | Modify | Separate hard blockers from advisory trim warnings for planner output. |
| `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts` | Modify | Request planner-first behavior by default and expose the full-auto fallback switch. |
| `.opencode/command/memory/save.md` | Modify | Document planner-first default behavior, explicit fallback, and deferred freshness actions. |
| `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts` | Modify | Keep Tier 1 and Tier 2 deterministic routing in the default path and gate Tier 3 behind explicit opt-in. |
| `.opencode/skill/system-spec-kit/mcp_server/lib/routing/routing-prototypes.json` | Modify | Trim prototype-library dependency to the minimum Tier 2 set still needed after Tier 3 default removal. |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts` | Modify | Retire default-path auto-fix retries while preserving advisory scoring output and explicit opt-in behavior if retained. |
| `.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts` | Modify | Preserve structural blockers and downgrade score-heavy layers to advisory or deferred checks. |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts` | Modify | Disable reconsolidation-on-save by default and keep it behind explicit fallback flags. |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts` | Modify | Move enrichment bundle work to explicit standalone or queued follow-up behavior. |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts` | Modify | Preserve same-path lineage semantics without requiring full default-path PE work. |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts` | Modify | Keep chunking as a size-based escape hatch instead of a default-path design center. |
| `.opencode/skill/system-spec-kit/scripts/core/workflow.ts` | Modify | Stop unconditional graph refresh and spec-doc reindex from piggybacking on every default save. |
| `.opencode/skill/system-spec-kit/mcp_server/api/indexing.ts` | Modify | Expose explicit follow-up indexing calls that planner output can recommend. |
| `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts` | Modify | Keep graph refresh callable as an explicit follow-up rather than an always-on save side effect. |
| `.opencode/skill/system-spec-kit/mcp_server/tests/memory-save.vitest.ts` | Modify | Verify planner-default behavior and fallback preservation. |
| `.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-integration.vitest.ts` | Modify | Verify planner output, fallback mode, and canonical-doc mutation safety end to end. |
| `.opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts` | Modify | Verify Tier 3 no longer participates by default and Tier 1 or Tier 2 still route correctly. |
| `.opencode/skill/system-spec-kit/mcp_server/tests/quality-loop.vitest.ts` | Modify | Verify advisory-only default behavior and opt-in auto-fix behavior if retained. |
| `.opencode/skill/system-spec-kit/mcp_server/tests/save-quality-gate.vitest.ts` | Modify | Verify hard structural blockers remain active while score-heavy checks defer. |
| `.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation-bridge.vitest.ts` | Modify | Verify reconsolidation only runs when explicitly requested. |
| `.opencode/skill/system-spec-kit/mcp_server/tests/thin-continuity-record.vitest.ts` | Modify | Verify continuity validation and upsert rules remain unchanged. |
| `.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts` | Modify | Verify transcript-facing planner output remains operator-readable. |
| `.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts` | Modify | Verify CLI target authority survives planner-default behavior. |
| `.opencode/skill/system-spec-kit/scripts/tests/graph-metadata-refresh.vitest.ts` | Modify | Verify graph refresh remains correct as an explicit follow-up action. |
| `.opencode/skill/system-spec-kit/scripts/tests/workflow-session-id.vitest.ts` | Modify | Verify planner-first path preserves session and continuity expectations. |
| `.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-planner-first.vitest.ts` | Create | Add focused planner-contract regression coverage. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `/memory:save` defaults to a planner response that does not mutate files and returns route category, target doc, target anchor, merge mode, hard blockers, continuity payload, and explicit follow-up actions. | Handler and CLI tests prove default execution is non-mutating and the response carries all six fields plus follow-up actions. |
| REQ-002 | The canonical atomic writer remains available through an explicit fallback or opt-in mode and preserves atomic promotion, rollback, and same-path identity guarantees. | `memory-save` and integration tests prove fallback writes still call canonical preparation and atomic rollback logic. |
| REQ-003 | The default hot path no longer runs Tier 3 routing, quality-loop auto-fix retries, reconsolidation-on-save, or post-insert enrichment. | Routing, quality-loop, reconsolidation, and enrichment tests prove those subsystems stay inactive unless explicit opt-in flags are set. |
| REQ-004 | Hard safety checks remain blocking: frontmatter continuity validity, merge legality, spec-doc sufficiency, cross-anchor contamination, and post-save fingerprint safety. | Existing validator-plan rules still fail invalid saves in tests and planner output reports those blockers directly. |
| REQ-005 | The seven partial-value subsystems named by 014 move out of the default save path into explicit follow-ups, fallback-only behavior, or standalone commands. | Planner responses explicitly surface indexing and graph refresh follow-ups; tests prove default saves do not perform those actions automatically. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Planner output schema is stable enough for AI consumers and `generate-context.ts` to use without re-parsing freeform prose. | Schema types exist in `handlers/save/types.ts` and are exercised by handler and CLI tests. |
| REQ-007 | The router keeps the eight canonical categories and deterministic Tier 1 or Tier 2 behavior on the default path. | `content-router.vitest.ts` proves all canonical categories remain routable without default Tier 3 participation. |
| REQ-008 | Quality scoring survives as advisory signal or explicit opt-in path, but default-path auto-fix retries are retired. | `quality-loop.vitest.ts` proves planner output can surface issues without mutating content automatically. |
| REQ-009 | Reconsolidation and post-insert enrichment remain available through explicit flags or dedicated follow-up actions rather than disappearing outright. | `.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md`, command docs, and regression tests document and verify the new opt-in behavior. |
| REQ-010 | Graph refresh and spec-doc reindex are represented as explicit follow-up actions when immediate freshness matters. | Planner responses include `refreshGraphMetadata`, `reindexSpecDocs`, and `runEnrichmentBackfill` follow-up hints when relevant. |
| REQ-011 | The planner-first path is prototyped against three real session transcripts before implementation starts. | Verification notes capture three transcript runs, expected canonical targets, and any mismatch backlog before code changes begin. |

### P2 - Nice-to-have (ship if low-risk)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-012 | Tier 2 prototype library size is reduced if it materially simplifies maintenance without reducing routing parity. | `routing-prototypes.json` shrinks or is re-scoped with no category regressions. |
| REQ-013 | Response payload surfaces whether deferred follow-ups were skipped, recommended, or explicitly requested. | Planner output exposes follow-up state consistently in the response builder. |
| REQ-014 | Command docs include migration notes for operators used to the current full-auto behavior. | `/memory:save` docs show the planner-default path, explicit fallback, and transcript prototype workflow. |
| REQ-015 | Flag names and env references remain coherent across code, docs, and tests. | `.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md`, `search-flags.vitest.ts`, and command docs all describe the same toggle names and defaults. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The default `/memory:save` execution path becomes non-mutating and returns a structured planner payload with route, target, merge, blocker, continuity, and follow-up fields in one response.
- **SC-002**: Tests prove Tier 3 routing, quality-loop auto-fix, reconsolidation, and post-insert enrichment do not run by default.
- **SC-003**: The canonical atomic fallback still passes rollback and same-path identity regression tests.
- **SC-004**: Graph refresh and spec-doc reindex only occur when explicitly requested as follow-ups or when fallback mode opts into them.
- **SC-005**: Three real session transcripts can be mapped to correct canonical docs and anchors using planner output before implementation begins.
- **SC-006**: Packet docs pass per-file `sk-doc` validation and `validate.sh --strict` before implementation starts.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `memory-save.ts`, `response-builder.ts`, and `generate-context.ts` must agree on planner schema | High | Define shared response types first and verify them in both handler and CLI tests. |
| Dependency | `content-router.ts` remains the owner of the eight-category contract | High | Trim classifier tiers without changing category names or target mapping. |
| Dependency | Thin continuity validation must remain authoritative for `_memory.continuity` writes | High | Reuse `validateThinContinuityRecord()` and `upsertThinContinuityInMarkdown()` instead of creating a planner-only continuity path. |
| Risk | Planner output is underspecified and forces AI-side guesswork | High | Require explicit route, target, merge, blocker, continuity, and follow-up fields in REQ-001. |
| Risk | Default-path trim accidentally removes useful fallback behavior entirely | Medium | Keep explicit opt-in flags and standalone follow-up commands for reconsolidation, enrichment, indexing, and graph refresh. |
| Risk | Router simplification reduces category accuracy | Medium | Keep Tier 1 and Tier 2 deterministic coverage and validate against transcript prototypes before implementation. |
| Risk | Freshness expectations drift if indexing and graph refresh become opt-in | Medium | Show follow-up actions clearly in planner output and docs. |
| Risk | Command docs, env refs, and tests drift on flag names | Medium | Make flag naming a tracked requirement and verification item. |
<!-- /ANCHOR:risks -->

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Correctness
- **NFR-C01**: Planner output must describe the same canonical target and legality state the fallback atomic path would use for the same input.
- **NFR-C02**: Same-path lineage and continuity writes must remain deterministic across repeated runs with identical input.

### Safety
- **NFR-S01**: The default planner path must not mutate files, write pending files, or trigger indexing side effects.
- **NFR-S02**: Fallback mutation mode must keep per-spec-folder locking and rollback behavior intact.

### Performance
- **NFR-P01**: Default planner execution should remove synchronous Tier 3, enrichment, reconsolidation, graph refresh, and reindex work from the hot path.
- **NFR-P02**: Any new planner serialization must stay lightweight enough to return inside the current handler response envelope without extra network hops.

### Reliability
- **NFR-R01**: Fallback behavior must remain resilient when indexing, graph refresh, or enrichment follow-ups are disabled or unavailable.
- **NFR-R02**: Planner output must remain usable even when fallback-only features are off or unhealthy.

### Maintainability
- **NFR-M01**: Save-flow responsibilities should be visibly split into core write safety, planner response, and deferred follow-up actions.
- **NFR-M02**: Flag ownership and defaults must be documented once and reused across handler, CLI, docs, and tests.

### Quality
- **NFR-Q01**: Structural blockers remain hard failures, while advisory scoring signals remain explicit and auditable.
- **NFR-Q02**: Packet docs, command docs, and tests must describe the same default-path and fallback behavior.

---

## 8. EDGE CASES

### Data Boundaries
- Empty or malformed continuity payloads must still fail via `validateThinContinuityRecord()`.
- Oversized content must still be able to route through chunking or explicit fallback logic without making chunking a default-path dependency.
- Route overrides that conflict with natural routing must remain auditable and warning-bearing.

### Error Scenarios
- Tier 2 confidence below threshold should produce planner refusal or manual-review guidance rather than silent fallback to Tier 3.
- Explicit fallback runs with unhealthy indexing or graph refresh dependencies must preserve canonical writes or rollback safely without partial state.
- Transcript prototypes that cannot map to a canonical target should block implementation start until the mismatch is explained.

### Acceptance Scenarios
1. **Given** an operator runs `/memory:save` on a valid packet, **when** the planner-default path executes, **then** no file is changed and the response identifies the canonical doc, anchor, merge mode, continuity payload, blockers, and follow-up actions.
2. **Given** the same save is re-run with explicit full-auto fallback enabled, **when** canonical mutation proceeds, **then** atomic promotion and rollback behavior still guard the final write. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/save/atomic-index-memory.ts:270]
3. **Given** routing confidence falls below deterministic thresholds, **when** the default path runs, **then** Tier 3 does not auto-participate unless explicitly enabled and the planner response reports the manual-review condition instead of mutating state. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:554-629]
4. **Given** a save would have triggered reconsolidation, enrichment, graph refresh, or reindex under the current flow, **when** planner mode runs, **then** those steps appear as explicit follow-up actions instead of synchronous side effects. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1382] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:50-56]
5. **Given** a save fails a structural legality rule, **when** planner output is produced, **then** the response clearly marks the blocker and the full-auto fallback refuses to proceed until the issue is fixed. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1517]
6. **Given** indexing or graph refresh matters for immediate freshness, **when** planner output is produced, **then** explicit follow-up actions name the required command instead of implying the work already ran.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 19/25 | Handler, routing, validation, workflow, command docs, env docs, and test suites |
| Risk | 18/25 | Save-path safety, continuity correctness, and fallback preservation |
| Research | 7/20 | Upstream research is complete, but translation into implementation boundaries is nuanced |
| Multi-Agent | 3/15 | Single packet, but multiple runtime seams must stay synchronized |
| Coordination | 11/15 | Cross-file schema, docs, and verification parity required |
| **Total** | **58/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Planner output omits a field the AI needs to make a canonical edit safely | H | M | Lock the planner schema in shared types and transcript prototype tests. |
| R-002 | Default-path trim breaks atomic fallback guarantees | H | L | Keep fallback routed through existing canonical preparation and atomic writer helpers. |
| R-003 | Router simplification increases manual-review or refusal rates too sharply | M | M | Keep Tier 2 deterministic coverage and compare against three real transcripts before rollout. |
| R-004 | Follow-up freshness actions become invisible to operators | M | M | Surface `refreshGraphMetadata`, `reindexSpecDocs`, and `runEnrichmentBackfill` explicitly in planner responses and docs. |
| R-005 | Flag proliferation creates doc or runtime drift | M | M | Centralize flags in `search-flags.ts`, `.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md`, and regression tests. |

---

## 11. USER STORIES

### US-001: Planner Output First (Priority: P0)

**As an** operator, **I want** `/memory:save` to tell me exactly which canonical doc and anchor should change before anything mutates, **so that** I can review or apply the edit intentionally.

**Acceptance Criteria**:
1. Given a valid save request, when planner mode runs, then the response names the target doc, anchor, merge mode, blockers, continuity payload, and follow-up actions.

---

### US-002: Safe Fallback (Priority: P0)

**As an** AI maintainer, **I want** the current atomic save path to remain available as an explicit fallback, **so that** high-assurance or one-shot save workflows still have rollback protection.

**Acceptance Criteria**:
1. Given fallback mode is requested, when canonical mutation fails after promotion, then the original file content is restored before the error is returned.

---

### US-003: No Default Tier 3 Dependency (Priority: P1)

**As a** maintainer, **I want** the default route planner to avoid live Tier 3 routing, **so that** save planning remains deterministic and does not depend on optional model reachability.

**Acceptance Criteria**:
1. Given Tier 1 and Tier 2 cannot confidently route the content, when default planner mode runs, then the response refuses or warns instead of auto-invoking Tier 3.

---

### US-004: Hard Checks, Soft Advice (Priority: P1)

**As an** operator, **I want** save safety rules to stay blocking while quality advice becomes advisory, **so that** malformed writes are prevented without forcing auto-fix retries on every save.

**Acceptance Criteria**:
1. Given a structural violation, when planner output is produced, then the blocker is hard-failed.
2. Given only score-heavy quality issues, when planner output is produced, then the issues are advisory or deferred.

---

### US-005: Explicit Freshness Follow-Ups (Priority: P1)

**As an** operator, **I want** indexing and graph refresh work called out as explicit follow-up actions, **so that** I know when a save is durable but not yet fully fresh in search or graph views.

**Acceptance Criteria**:
1. Given the save affects canonical docs, when planner output is produced, then the response names follow-up commands for indexing or graph refresh when needed.

---

### US-006: Transcript-Proven Routing (Priority: P1)

**As a** packet reviewer, **I want** the planner-first contract checked against real save transcripts, **so that** the new default path is proven on operator-shaped inputs before implementation lands.

**Acceptance Criteria**:
1. Given three real session transcripts, when planner output is compared to expected canonical targets, then mismatches are documented and resolved before coding starts.

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

### Open Questions
- Should the explicit full-auto fallback keep synchronous graph refresh and spec-doc reindex by default, or should those move behind their own fallback follow-up flags as well?
- Should Tier 2 prototype trimming happen in the same packet as planner-first rollout, or only after transcript prototypes show no routing coverage gap?

### Resolved Questions
- The implementation packet will not replace the canonical atomic writer; it keeps that path as the explicit fallback because atomic promotion and rollback remain load-bearing. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/save/atomic-index-memory.ts:270]
- The eight-category content-router contract stays intact. ADR-006 records the scoped in-file exception: Tier 3 default-disable/manual-review control flow changed, but the category switch plus Tier 1 and Tier 2 dispatch stayed intact. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:22]
- `_memory.continuity` remains part of the save contract, but ownership of simple continuity-only updates does not require the heavyweight default save path. [SOURCE: .opencode/command/memory/save.md:73-77] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/continuity/thin-continuity-record.ts:979]
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`

---

<!--
LEVEL 3 SPEC (~165 lines)
- Core + L2 + L3 addendums
- Executive Summary, Risk Matrix, User Stories
- Full Complexity Assessment
-->
