---
title: "...ph-and-context-optimization/002-continuity-memory-runtime/003-continuity-refactor-gates/004-gate-d-reader-ready/spec]"
description: "Retarget the phase 018 reader surfaces onto canonical spec docs and thin continuity records, then prove the new resume ladder with regression and latency gates."
trigger_phrases:
  - "gate d"
  - "reader ready"
  - "resume ladder"
  - "session resume"
  - "memory search"
  - "canonical continuity"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/003-continuity-refactor-gates/004-gate-d-reader-ready"
    last_updated_at: "2026-04-12T00:00:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Recorded Gate D completion evidence and synchronized packet docs"
    next_safe_action: "Use implementation-summary.md as the reader-ready closeout record"
    key_files: ["spec.md", "implementation-summary.md"]
closed_by_commit: TBD
status: complete
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->"
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Gate D — Reader Ready

---

## EXECUTIVE SUMMARY

Gate D moves the phase 018 read path onto the canonical continuity substrate defined in [`../implementation-design.md`](../implementation-design.md) and [`../resource-map.md`](../resource-map.md) section 4. The work keeps the existing 4-stage search pipeline, replaces memory-file primacy with a doc-first `resumeLadder`, and proves the new reader behavior through the 13-feature regression suite, resume fallback tests, and the latency budgets from iterations 013, 017, 025, 027, 029, and 039.

**Key Decisions**: keep retrieval topology intact while changing source semantics; compare the folder-local handover document and `_memory.continuity`, promote the fresher of the two, then fall through to canonical spec docs with no archived resume tier.

**Critical Dependencies**: Gate C dual-write shadow is stable, `_memory.continuity` blocks exist on canonical docs, and the benchmark fixtures plus telemetry spans are available.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-04-11 |
| **Updated** | 2026-04-12 |
| **Branch** | `006-continuity-refactor-gates` |
| **Parent Spec** | `../spec.md` |
| **Parent Plan** | `../plan.md` |
| **Predecessor** | `003-gate-c-writer-ready` |
| **Successor** | `005-gate-e-runtime-migration` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 018 selected Option C, but the active reader handlers still assume memory-file primacy and search-first resume behavior. Per [`../resource-map.md`](../resource-map.md) section 2 F-8 and iterations 013, 017, and 018, that mismatch keeps `/spec_kit:resume`, search, and trigger lookup from trusting the folder-local handover tier plus `_memory.continuity`, where the fresher of those packet-local sources should win before spec-doc fallback.

### Purpose
Make the reader surfaces doc-first, benchmarked, and fallback-safe so Gate E can switch runtime behavior without reintroducing legacy memory primacy.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Retarget `memory-search.ts`, `memory-context.ts`, and `session-resume.ts` to canonical spec docs and thin continuity rows, with resume-mode recovery staying inside folder-local packet docs.
- Build the 3-level `resumeLadder`: compare the folder-local handover document and `_memory.continuity`, promote the fresher signal, then fall through to spec docs, with no SQL on the happy path.
- Promote spec docs in discovery and trigger loading, then validate the full Gate D reader surface with regression, fallback, and perf evidence.

### Out of Scope
- Writer-path refactors from Gate C, including `memory-save.ts`, routing, and anchor merge work.
- Runtime command, agent, skill, and README rollout planned for Gate E.
- Archive retirement or deletion decisions beyond the D0 observation setup and threshold policy.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/handlers/memory-search.ts` | Modify | Keep the 4-stage pipeline and retarget source assumptions to `spec_doc` plus `continuity`, without teaching archived rows as part of resume-mode recovery. |
| `mcp_server/handlers/memory-context.ts` | Modify | Preserve modes and retarget `resume` mode to the new ladder and doc-first package synthesis. |
| `mcp_server/handlers/session-resume.ts` | Modify | Rewrite recovery ordering to folder-local handover/continuity freshness arbitration, then spec docs, with no SQL on the happy path. |
| `mcp_server/handlers/session-bootstrap.ts` | Modify | Keep wrapper responsibilities while updating next-action messaging and bootstrap trust to the new resume contract. |
| `mcp_server/handlers/memory-index-discovery.ts` | Modify | Promote canonical spec docs and demote `memory/` content to archive-only fallback discovery. |
| `mcp_server/handlers/memory-triggers.ts` | Modify | Pull trigger phrases from spec-doc frontmatter and continuity metadata instead of memory-file frontmatter. |
| `mcp_server/lib/resume/resume-ladder.ts` | Create or inline | Shared ladder helper chosen by ADR-001, with stage telemetry aligned to iteration 027 and test catalog rows from iteration 029. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Retarget `memory-search.ts` without replacing the 4-stage pipeline. | Search still uses the existing gather, fusion, rerank, and filter flow while returning canonical doc and continuity-backed results first, without advertising archived rows as part of resume-mode recovery. |
| REQ-002 | Retarget `memory-context.ts` and `session-resume.ts` to the new resume ladder. | Resume compares the folder-local handover tier and `_memory.continuity`, promotes the fresher of the two, and falls back to spec docs only when packet-local recovery data is unavailable; fallback cases match iteration 029 resume tests. |
| REQ-003 | Make the shipped resume contract explicit in metadata and hints. | Happy-path resume performs no SQL lookup, `legacyMemoryFallback` and `archivedTierEnabled` remain false, and the response surfaces folder-local handover traversal plus the effective freshness winner. |
| REQ-004 | Prove reader-ready quality gates before merge. | The 13 regression scenarios from iteration 025, the 10 resume tests plus 25 integration rows from iteration 029, and the perf targets from iteration 027 all pass or are explicitly blocked with evidence. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Keep `session-bootstrap.ts` as a thin wrapper. | Next-action and hint output reflects the new resume contract without duplicating ladder logic. |
| REQ-006 | Promote canonical packet docs in discovery. | `memory-index-discovery.ts` prefers spec docs as continuity sources and treats `memory/` data as archive-only fallback. |
| REQ-007 | Move trigger provenance to canonical docs. | `memory-triggers.ts` resolves `trigger_phrases` from spec-doc frontmatter and thin continuity metadata while preserving cognitive ranking behavior. |
| REQ-008 | Start the overlapping D0 observation window. | D0 tracking begins as soon as Gate C dual-write shadow is stable, with explicit alerting for archive overuse and fallback churn. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Resume stays on the doc-first happy path and verifies `resume_latency_p95 < 500ms`, with a 250-300ms expected range from iteration 027.
- **SC-002**: Search verifies `search_latency_p95 < 300ms` and trigger-only lookup verifies `trigger_match_latency_p95 < 10ms`.
- **SC-003**: All 13 preserved-feature regression scenarios are green on the stable fixture corpus defined in iteration 025 and cataloged in iteration 029.
- **SC-004**: Resume payloads and hints consistently report folder-local handover scope, freshness selection, and `archivedTierEnabled=false`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Gate C dual-write shadow stable and canonical docs populated | Without clean writer output, reader fallback churn hides real Gate D regressions | Do not start Gate D verification until Gate C close criteria and continuity blocks are proven |
| Dependency | Iteration 029 fixture corpus and telemetry spans | Missing fixtures or spans weakens regression and budget evidence | Reuse the test catalog rows and emit the stage timers called out in iteration 027 before perf runs |
| Risk | Stale or malformed handover tier or `_memory.continuity` data | Resume falls through too often and loses fast-path headroom | Test the missing and malformed cases from iterations 017 and 029, surface warnings, and record `resume.fast_path_miss` |
| Risk | Operator guidance keeps implying archive fallback or parent-handover traversal | Gate D appears to promise recovery paths the runtime will never execute | Gate merge blocks on contract-drift grep checks across runtime hints and packet docs |
<!-- /ANCHOR:risks -->

---

**Acceptance Scenarios**:

**Given** a packet has fresh handover and continuity data, **when** resume runs in default mode, **then** the first-screen package stays on the doc-first path, promotes the fresher packet-local source, and reports no archive fallback.

**Given** the handover tier is missing, **when** resume runs, **then** continuity supplies the recovery package without error.

**Given** continuity is malformed, **when** resume runs, **then** the ladder warns and falls through to direct spec-doc reads.

**Given** handover and continuity are both unavailable, **when** resume runs, **then** the ladder falls through to direct spec-doc reads; if canonical docs are also missing, it reports that no recovery context was found.

**Given** a trigger-only query targets canonical frontmatter, **when** trigger matching runs, **then** the canonical row resolves through the fast path and stays under the trigger latency budget.

**Given** the full fixture corpus is benchmarked, **when** Gate D evidence is collected, **then** resume, search, and trigger p95 targets plus the 13 regression scenarios all pass together.

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: `resume_latency_p95 < 500ms`, with the conditional ladder isolated in `resume.stage.fallback_ms`.
- **NFR-P02**: `search_latency_p95 < 300ms`, without regressing the vector-dominant gather branch budget from iteration 027.
- **NFR-P03**: `trigger_match_latency_p95 < 10ms` for trigger-only fast-path queries.

### Security
- **NFR-S01**: Existing scope and governance filters remain unchanged while source provenance moves from memory files to canonical spec docs.
- **NFR-S02**: Resume mode does not advertise or enable archived or legacy fallback, and actor scope constraints remain unchanged.

### Reliability
- **NFR-R01**: Resume handles missing handover, malformed continuity, stale packet pointers, and no-recovery cases without silent failure.
- **NFR-R02**: Reader metrics expose fast-path source, fallback misses, and freshness arbitration clearly enough to gate rollout decisions.

## 8. EDGE CASES

### Data Boundaries
- Empty packet state: return an explicit "no recovery context found" response plus `/spec_kit:plan` guidance.
- Missing handover tier content: fall through to `_memory.continuity` with no error.
- Missing or stale canonical docs: return the no-recovery response after the doc-first ladder is exhausted.

### Error Scenarios
- Malformed continuity block: log a warning, skip the block, and fall through to direct spec-doc reads.
- Invalid packet pointer: request an explicit `--spec-folder` override rather than guessing.
- No canonical recovery docs remain after packet-local checks: surface that no recovery context was found.

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 23/25 | 6 reader surfaces, optional helper extraction, and perf plus regression evidence |
| Risk | 20/25 | Resume is operator-facing, packet-local freshness arbitration is user-visible, and no-recovery handling must stay explicit |
| Research | 15/20 | Heavily grounded by iterations 013, 017, 018, 025, 027, 029, 036, and 039 |
| Multi-Agent | 6/15 | Work can parallelize by handler and test lane, but contract alignment is still centralized |
| Coordination | 10/15 | Depends on Gate C stability, telemetry, canonical docs, and D0 observation setup |
| **Total** | **74/100** | **Level 3** |

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Resume ladder chooses stale state over fresher canonical docs | H | M | Use freshness-aware synthesis and the conflict case from iteration 029 |
| R-002 | Search stays correct but resume provenance remains opaque when packet-local sources disagree | H | M | Instrument `resume.fast_path_source`, `resume.fast_path_miss`, and freshness-winner reporting before perf sign-off |
| R-003 | Trigger matching loses fast-path behavior after source-provenance move | M | M | Keep cognitive ranking intact and prove the trigger regression row plus p95 budget from iteration 027 |

## 11. USER STORIES

### US-001: Resume an active packet quickly (Priority: P0)

**As an** operator, **I want** `/spec_kit:resume` to read canonical packet state first, **so that** I can continue work from handover or continuity without waiting on archived-memory search.

**Acceptance Criteria**:
1. Given a packet with valid handover and continuity content, When I run resume, Then the first-screen recovery package comes from whichever packet-local source is fresher, without archived fallback.
2. Given missing or malformed fast-path sources, When I run resume, Then the ladder falls through safely and tells me what source won.
3. Given deep profile is requested, When the fast path is insufficient, Then resume reads fuller canonical packet context after the packet-local ladder is exhausted.

### US-002: Trust canonical reader behavior across the packet (Priority: P1)

**As a** maintainer, **I want** search, triggers, and bootstrap hints to prefer spec docs and continuity rows, **so that** Gate E can flip runtime behavior without carrying memory-file primacy forward.

**Acceptance Criteria**:
1. Given canonical spec docs with trigger phrases and continuity metadata, When I run search or trigger matching, Then the intended canonical result appears without implying an archived resume tier.
2. Given the full fixture corpus, When the regression suite runs, Then all 13 preserved features still behave as promised by Option C.
3. Given runtime hints or packet docs drift from the shipped resume contract, When the observation lane is reviewed, Then the mismatch is exposed clearly enough to block Gate D close.

## 12. OPEN QUESTIONS

- Should deep-profile resume load richer canonical doc context in parallel with bootstrap health probes, or should that stay serialized for easier telemetry attribution?
- Does D0 alert ownership live inside the Gate D delivery slice, or does it hand off to the broader observability work planned for Gate E?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Grounding**: [`../implementation-design.md`](../implementation-design.md), [`../resource-map.md`](../resource-map.md), [`../scratch/resource-map/02-handlers.md`](../scratch/resource-map/02-handlers.md), and iterations 013, 017, 018, 025, 027, 029, 036, 039

---
