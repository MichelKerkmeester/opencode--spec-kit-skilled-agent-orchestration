---
title: "Feature Specification: Phase 4 — Heuristics, Refactor & Guardrails"
description: "Phase 4 of the memory quality remediation train: D5 auto-supersedes with continuation gating, SaveMode enum refactor, and post-save reviewer CHECK-D1..D8 coverage."
trigger_phrases:
  - "phase 4 heuristics refactor guardrails"
  - "d5 auto supersedes"
  - "savemode enum refactor"
  - "post save reviewer checks"
  - "f-ac5 lineage fixture"
  - "f-ac8 clean reviewer"
importance_tier: important
contextType: "planning"
---

# Feature Specification: Phase 4 — Heuristics, Refactor & Guardrails

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + phase-child-header | v2.2 -->

---

### EXECUTIVE SUMMARY

Phase 4 is the largest child packet in the remediation train because it combines one behavior change, one cross-pipeline refactor, and one guardrail upgrade into a deliberately ordered three-PR slice. The behavior change is D5 lineage repair: JSON-mode saves must auto-populate `causal_links.supersedes` only when the current artifact presents strong continuation evidence and exactly one immediate predecessor can be selected without ambiguity. The refactor replaces `_source === 'file'` overloading with an explicit `SaveMode` contract so future JSON, capture, and manual save behavior stops branching on provenance metadata. The guardrail upgrade turns the post-save reviewer into a structural regression net with CHECK-D1 through CHECK-D8, plus clean-fixture proof that the new checks do not create noisy false positives. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md:182-183] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:50-56] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:84-87] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:1160-1162]

This phase is intentionally downstream of the first three phases. PR-8 refactors helper and mode surfaces that only become stable after the Phase 1 truncation helper and the Phase 3 sanitizer / precedence work are already merged. PR-9 also depends on earlier defect fixes being real first, because its job is to assert on the fixed state for D1, D4, D7, and D8 rather than mask missing implementations. The phase therefore defines readiness as "Phase 1, 2, and 3 merged" and defines success as "Phase 5 can start from a clean, measurable, guarded save pipeline." [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md:182-183] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md:197-200]

---

<!-- ANCHOR:phase-context -->
### Phase Context

| Field | Value |
|-------|-------|
| **Parent Spec** | `../spec.md` |
| **Parent Plan** | `../plan.md` |
| **Phase** | 4 of 5 |
| **Predecessor** | `003-sanitization-precedence` |
| **Successor** | `005-operations-tail-prs` |
| **Priority Band** | P3 |
| **Theme** | D5 auto-supersedes with continuation gate + SaveMode enum refactor + post-save reviewer CHECK-D1..D8 upgrade |
| **Parent Phase Map Status** | Pending at packet level until this child lands [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md:177-183] |
| **Phase 4 → 5 Handoff** | PR-7 + PR-8 + PR-9 merged; F-AC5 and F-AC8 green; reviewer reports zero HIGH findings on clean baseline [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md:195-200] |

Phase 4 carries the biggest coordination burden in the packet because it is where the train stops being "single-owner bug fixes" and starts enforcing a durable contract for later operational work. That is why this child folder owns both the implementation details and the guardrail story needed for Phase 5. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md:182-183] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:1522-1525]
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P3 |
| **Status** | Draft |
| **Created** | 2026-04-07 |
| **Branch** | `026-graph-and-context-optimization/003-memory-quality-issues/004-heuristics-refactor-guardrails` |
| **Parent Packet** | `003-memory-quality-issues` |
| **PRs In Scope** | PR-7, PR-8, PR-9 [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:1160-1162] |
| **Primary Acceptance Fixtures** | `F-AC5`, `F-AC8`, plus reused `F-AC1`, `F-AC2`, `F-AC6` [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:1160-1162] |
| **Critical Dependency** | Phase 1, 2, and 3 merged before implementation starts [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md:182-183] |
| **Target Code Surface** | `workflow.ts`, `memory-metadata.ts`, new `core/find-predecessor-memory.ts`, `post-save-review.ts`, plus save-mode callsites identified in iteration 17 [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:1160-1162] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-017.md:43-58] |
| **Design Principle** | Behavior first, refactor second, guardrail last |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Phase 4 solves three coupled but distinct sub-problems. The packet cannot close safely if any one of them is deferred, because Phase 5 assumes lineage is correct, mode branching is explicit, and the reviewer can detect regression drift automatically. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md:195-200] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:1160-1162]

### Purpose

Deliver the Phase-4 bridge from isolated defect fixes to an explicit, guarded, and Phase-5-ready save pipeline. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md:200-200] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:1522-1531]

### D5 — Missing Auto-supersedes on Continuation Saves

D5 is not a broken edge writer. It is a missing pre-render discovery step: the JSON-mode workflow only forwards caller-supplied `causal_links`, while the downstream MCP graph layer merely resolves whatever references already exist in the markdown. That means continuation saves with new `session_id` values never discover their predecessor on their own, so `supersedes` stays empty even when the folder history clearly implies lineage. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-006.md:20-24] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:136-145]

The D5 fix cannot be "scan every sibling and guess." Iteration 14 established that continuation signals are rare and only `extended` and `continuation` are clean enough to trust as first-class title signals, while `phase N` and `vN` are noisy false-positive families. Iteration 22 then showed that the narrowed design remains cheap if predecessor discovery runs only on qualifying saves and if the helper uses a lightweight header read instead of heavier full-file parsing. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-014.md:19-26] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-014.md:35-39] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-022.md:41-55]

### SaveMode Refactor — Remove `_source === 'file'` as a Behavior Switch

Iteration 17 showed that `_source` is overloaded across three different concerns: enrichment eligibility, JSON-mode completion heuristics, and source-session metadata persistence. As long as the pipeline keeps branching on `_source === 'file'`, future fixes will keep mixing provenance metadata with runtime behavior. This is precisely the kind of coupling that made D7 fragile and would make later maintenance around PR-7 and PR-9 more error-prone. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-017.md:43-58] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-017.md:67-72]

The phase therefore introduces an explicit `SaveMode` enum and migrates the branching sites identified in the dependency map. The new contract must differentiate at least JSON, CAPTURE, and MANUAL flows so behavior is driven by save intent instead of overloading provenance fields. `_sourceTranscriptPath` and `_sourceSessionId` remain metadata, not control flow. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:1505-1510] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-017.md:54-65]

### Reviewer Upgrade — Detect D1..D8 Drift After Fixes Ship

The current reviewer is advisory and narrow. It compares payload and frontmatter values, but it does not inspect the rendered markdown for the structural regressions that matter after the first six PRs land. That leaves the train without an enforcement layer for renewed D1 truncation, D4 tier drift, D7 provenance gaps, or D8 anchor mismatch. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-019.md:25-29] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-019.md:153-167]

Phase 4 closes that gap by upgrading `post-save-review.ts` to run CHECK-D1 through CHECK-D8 after the existing baseline checks and by promoting any new HIGH finding into a blocking review state. The guardrail must also stay deterministic: no repo scans, no runtime git probing, and no hidden cross-folder search inside the reviewer. The checks should work from the saved artifact plus the collected payload contract only. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-019.md:119-154] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-019.md:169-176]
<!-- /ANCHOR:problem -->

> **Memory save contract (cross-ref):** Memory saves in this packet follow the compact retrieval wrapper contract owned by `026-graph-and-context-optimization/003-memory-quality-issues/006-memory-duplication-reduction/`, the implementation host for the `001-research-graph-context-systems/006-research-memory-redundancy/` research findings. Canonical narrative ownership stays in the packet decision record and `implementation-summary.md`; memory files carry only canonical-doc pointers, distinguishing evidence, continuation state, and recovery metadata. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/006-research-memory-redundancy/research/research.md:103-120]

---

### User Stories

### Story 1 — Continuation lineage that stays conservative

As a memory-save operator, I want continuation runs to auto-link their immediate predecessor only when the continuation signal is strong and the candidate set is unambiguous, so the causal graph captures lineage without fabricating relationships in crowded folders. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:84-84] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-014.md:46-53]

- **Given** a memory title or description with `extended` or `continuation` semantics and a folder containing three or more sibling memories
- **When** predecessor discovery runs before `buildCausalLinksContext()`
- **Then** exactly one immediate predecessor is injected into `causal_links.supersedes`, and ambiguous or noisy cases are skipped without side effects [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:1479-1481] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:1516-1518]

### Story 2 — Explicit save modes instead of overloaded provenance flags

As a maintainer of the save pipeline, I want branching behavior to depend on an explicit save-mode contract instead of `_source === 'file'`, so enrichment, completion heuristics, reviewer mode, and source-session metadata do not keep leaking into one another. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-017.md:46-58] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-017.md:71-72]

- **Given** a save request classified as JSON, CAPTURE, or MANUAL
- **When** workflow, extractor, and reviewer branches evaluate behavior
- **Then** they use `SaveMode` as the only control input, while `_sourceTranscriptPath` and `_sourceSessionId` remain persisted metadata only [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:1507-1510] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-017.md:60-65]

### Story 3 — Post-save drift detection that proves both failure and cleanliness

As a release owner, I want the reviewer to detect each defect class with deterministic checks and to stay quiet on a clean baseline fixture, so the tail of the PR train can trust the save path before Phase 5 adds migration and telemetry work. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:1162-1162] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-019.md:27-154]

- **Given** broken fixtures for D1, D4, D7, and D8 and one clean `F-AC8` fixture
- **When** the upgraded reviewer runs
- **Then** the broken fixtures fire the matching checks, the clean fixture reports zero false positives, and any new HIGH finding blocks completion [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:1162-1162] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-019.md:80-90] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-019.md:119-154]

### Story 4 — SaveMode preserves metadata while changing control flow

As a maintainer, I want the SaveMode migration to change only behavior branching, not the persisted source-session metadata, so the refactor reduces coupling without erasing provenance fields that older tooling still reads. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-017.md:50-58] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:1507-1510]

- **Given** a save request that still carries `_sourceTranscriptPath` and `_sourceSessionId`
- **When** Phase 4 migrates the workflow to `SaveMode`
- **Then** control flow resolves only from the explicit save mode,
- **And** the source-session fields continue to persist as metadata rather than becoming behavior switches again. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-017.md:50-58]

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- PR-7 lineage discovery inserted immediately before `buildCausalLinksContext()`, including a new helper file and the `memory-metadata.ts` supersedes emission path [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:1160-1160] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:1477-1481]
- PR-8 `SaveMode` enum introduction plus migration of the workflow, extractor, reviewer, and metadata propagation surfaces identified in iteration 17 [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:1161-1161] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-017.md:43-65]
- PR-9 reviewer expansion to CHECK-D1 through CHECK-D8, including broken-fixture and clean-fixture proof [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:1162-1162] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-019.md:25-154]
- Reuse of `F-AC1`, `F-AC2`, and `F-AC6` after the SaveMode refactor to prove no behavioral regression in earlier fixes [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:1161-1161]
- New `F-AC5` 3+ sibling lineage fixture and new reviewer fixtures for D1, D4, D7, D8, plus clean `F-AC8` [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:1160-1162] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:1514-1518]

### Out of Scope

- PR-10 historical migration work for pre-fix files; that remains a Phase 5 / optional follow-on concern [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:227-228] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:1522-1525]
- PR-11 cross-process save-lock hardening; that is explicitly outside the D1-D8 content-fix core [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:228-228] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:1500-1503]
- Broad observability expansion beyond the minimum PR-9 guardrail hooks already recommended in iteration 24 [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-024.md:135-147]
- Any code or documentation changes outside the implementation and test surfaces needed for PR-7, PR-8, and PR-9

### Files Expected to Change During Implementation

| File / Surface | Change Type | Why It Is In Scope |
|---------------|-------------|--------------------|
| `.opencode/skill/system-spec-kit/scripts/core/workflow.ts` | Modify | PR-7 insertion point, SaveMode migration, and reviewer / telemetry callsite coordination [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:1160-1162] |
| `.opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts` | Modify | `causal_links.supersedes` remains the render-time pass-through surface that must receive PR-7 output [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-006.md:22-24] |
| `.opencode/skill/system-spec-kit/scripts/core/find-predecessor-memory.ts` | Create | Dedicated PR-7 helper keeps sibling scan logic isolated and measurable [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:1160-1160] |
| `.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts` | Modify | PR-9 host for CHECK-D1..D8 and the composite regression gate [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:1162-1162] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-019.md:153-159] |
| `workflow`, `collect-session-data`, `post-save-review`, `input-normalizer` mode branches | Modify | Iteration 17 identified the full SaveMode migration surface and its ordering constraints [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-017.md:46-65] |
| Fixture and harness files for `F-AC5`, `F-AC8`, and broken reviewer cases | Create / Modify | Phase 4 acceptance depends on deterministic replay, not manual inspection [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:230-244] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:1514-1518] |

### Scope Boundaries That Must Stay Explicit

- Phase 4 may introduce a new helper file for D5, but it must not reopen the broader packet question of historical migration. That stays Phase 5 / PR-10 territory. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:227-227] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:1524-1524]
- Phase 4 may add the reviewer contract needed by PR-9, but it must not turn telemetry into a separate tracing program. Iteration 24 explicitly frames observability as a compact guardrail add-on. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-024.md:109-118] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-024.md:144-148]
- Phase 4 may add a header-only reader if PR-7 needs it, but it must not generalize that into a repo-wide parsing abstraction unless the helper is clearly reused inside this same save path. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-022.md:40-41] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-022.md:62-70]
- Phase 4 may change mode branching, but it must not silently change persisted provenance semantics or retroactively reinterpret older `_source` metadata. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-017.md:50-58]
- Phase 4 may harden reviewer coverage for D6 as a duplicate-trigger detection net, but it must not fabricate a production D6 fix while the active producer remains unresolved. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:1483-1487] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-019.md:107-117]
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-401 | PR-7 must add predecessor discovery immediately before `buildCausalLinksContext()` and keep it conservative. | `F-AC5` proves hit, miss, and ambiguity behavior on a 3+ sibling fixture [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:1160-1160] |
| REQ-402 | PR-8 must replace live mode branching based on raw `_source` string compares with `SaveMode`. | All mapped mode callsites migrate and earlier fixture suites remain green [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-017.md:43-65] |
| REQ-403 | PR-9 must implement CHECK-D1 through CHECK-D8 plus the composite blocking gate. | Broken D1 / D4 / D7 / D8 fixtures fire and clean `F-AC8` stays quiet [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:1162-1162] |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-404 | D5 gating must exclude noisy `phase N` and `vN` continuation signals. | Title-pattern tests prove those families do not trigger predecessor discovery [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-014.md:31-32] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-014.md:38-39] |
| REQ-405 | PR-7 must stay inside the acceptable save-time performance envelope. | Measured 50 / 100 / 500 sibling runs remain under the documented bounds and below M9 warning threshold [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-022.md:28-32] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-024.md:135-140] |
| REQ-406 | Reviewer checks must remain deterministic and payload-driven. | No reviewer-time git probes or sibling scans are introduced [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-019.md:119-123] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-019.md:169-171] |

### Acceptance Criteria

| ID | Criterion | Verification |
|----|-----------|--------------|
| **F-AC5** | Continuation saves inject exactly one `causal_links.supersedes` predecessor when the current artifact qualifies and the sibling history is unambiguous. | New 3+ memory-folder lineage fixture passes for hit, miss, and ambiguous cases [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:1160-1160] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:1516-1518] |
| **AC-P4-02** | Non-continuation saves do not pay the PR-7 scan cost and do not gain synthetic lineage. | Gate skips predecessor discovery when the current title lacks continuation evidence [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-022.md:43-55] |
| **AC-P4-03** | The pipeline no longer branches on raw `_source === 'file'` for save behavior. | All mode-based branches use `SaveMode`; metadata passthrough fields remain metadata only [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-017.md:46-58] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-017.md:71-72] |
| **AC-P4-04** | Refactor does not regress earlier fixes. | Re-run `F-AC1`, `F-AC2`, and `F-AC6` after SaveMode migration and keep them green [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:1161-1161] |
| **AC-P4-05** | PR-9 reviewer implements CHECK-D1 through CHECK-D8 with HIGH vs MEDIUM severity preserved from the research contract. | Reviewer unit / fixture tests prove the full check set and blocking behavior [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-019.md:27-154] |
| **AC-P4-06** | Broken fixtures for D1, D4, D7, and D8 fire the matching reviewer warnings or blockers. | Dedicated negative fixtures each increment the intended defect class only once [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:1162-1162] |
| **F-AC8** | Clean end-to-end fixture produces zero reviewer false positives and no residual D1-D8 symptoms. | Clean replay fixture stays warning-free and preserves the post-fix baseline [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:94-94] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:1162-1162] |
| **AC-P4-08** | The phase folder validates cleanly after documentation and implementation updates. | `validate.sh` exits `0` for this child folder before handoff to Phase 5 [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md:187-190] |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-401**: Phase 4 enables conservative lineage auto-linking without introducing false-positive predecessor edges on ambiguous or noisy continuation-like titles. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:84-84] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-014.md:46-56]
- **SC-402**: The live pipeline stops using `_source` string compares as its primary save-mode control mechanism. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:1507-1510]
- **SC-403**: The upgraded reviewer catches D1 / D4 / D7 / D8 defect fixtures and stays silent on clean `F-AC8`. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:1162-1162]
- **SC-404**: Phase 5 receives a clean handoff baseline with green `F-AC5`, green `F-AC8`, and child-folder validation evidence. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md:200-200]
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P1**: PR-7 predecessor discovery must remain within the "acceptable" save-time envelope established by iteration 22 at representative folder sizes of 50, 100, and 500 siblings. The measured warm-cache p95 budgets are approximately 1.25 ms, 1.77 ms, and 8.38 ms with full reads, or better with a 2 KB header reader. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-022.md:28-32] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-022.md:45-50]
- **NFR-P2**: If Phase 4 adopts a partial-header reader, it should be a small primitive that reads only the frontmatter / title slice and avoids bringing in a heavier full-file parser on every sibling. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-022.md:23-23] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-022.md:40-41] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-022.md:62-70]
- **NFR-P3**: PR-9 instrumentation or validation must not drive `memory_save_duration_seconds` beyond the iteration-24 warning threshold of p95 > 0.50 seconds. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-024.md:88-93] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-024.md:135-140]

### Determinism

- **NFR-D1**: Reviewer checks must remain deterministic and operate from the saved file plus payload contract only; they cannot introduce repo scans, sibling lookups, or runtime git probes. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-019.md:119-123] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-019.md:169-171]
- **NFR-D2**: D7 reviewer logic must rely on a payload-side expectation flag such as `gitRepoAvailable` / `provenanceExpected`, not on live shelling during review. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-019.md:119-123] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-019.md:167-175]

### Maintainability

- **NFR-M1**: The SaveMode migration must reduce, not increase, the number of places where provenance metadata doubles as a behavior switch. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-017.md:67-72]
- **NFR-M2**: PR-7 logic should live in a dedicated helper file so later telemetry, migration, or lock-hardening work can instrument predecessor discovery without bloating `workflow.ts`. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:1160-1160] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-022.md:59-66]
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

| Edge Case | Required Behavior | Why It Matters |
|-----------|-------------------|----------------|
| Current title does not contain continuation evidence | Skip predecessor discovery entirely and preserve empty `supersedes` unless the caller already supplied lineage | Prevents paying PR-7 cost on ordinary saves and avoids speculative linkage [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-022.md:43-55] |
| Title contains noisy `phase N` or `vN` text | Do not treat those patterns as D5 qualifiers | Corpus evidence shows both families are false-positive prone [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-014.md:31-32] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-014.md:38-39] |
| Title contains numeral-led iteration carry-forward (`5-iteration...`) | Treat it as a lower-confidence continuation family only when the broader gate design says it is allowed; do not rely on literal `iteration N` alone | Known continuation artifacts use hyphenated and numeral-led wording [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-014.md:36-39] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-014.md:51-56] |
| Multiple equally plausible predecessors survive the gate | Emit no auto-link and record ambiguity rather than guessing | The accepted D5 design prefers omission over fabricated lineage [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:84-84] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:1479-1480] |
| Caller already provides `causal_links.supersedes` | Skip discovery and preserve caller intent | Avoids double-linking and removes unnecessary scan cost [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-022.md:52-53] |
| Legacy save path uses `_source` values other than `file` | Map legacy surfaces onto `SaveMode` without losing `_sourceTranscriptPath` / `_sourceSessionId` persistence | Phase 4 refactors behavior branching, not provenance storage [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-017.md:50-58] |
| Reviewer runs on non-git or detached test environment | D7 check stays quiet unless the payload says provenance was expected | Prevents deterministic-review false positives [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-019.md:119-123] |
| Broken fixture intentionally reproduces D1/D4/D7/D8 | Reviewer must fire the specific target check and keep severity consistent with the contract | Phase 4 is as much about proof of detection as proof of behavior [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:1162-1162] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-019.md:27-154] |
| Clean `F-AC8` fixture | Reviewer must produce zero false positives | Guardrail usefulness depends on low noise [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:1162-1162] |
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

### Risks

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Wrong predecessor chosen in a busy folder | High | Gate on precise continuation signals and skip on ambiguity [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:1479-1480] |
| Risk | SaveMode migration leaves mixed branch semantics | High | Migrate in iteration-17 order and re-run earlier fixtures after the refactor [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-017.md:60-65] |
| Risk | Reviewer adds noise instead of protection | Medium | Freeze the check set to the iteration-19 contract and require clean-fixture silence [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-019.md:153-159] |

### Dependencies

| Dependency | Type | Why It Blocks Phase 4 | Phase 4 Usage |
|------------|------|-----------------------|---------------|
| Phase 1 — anchor + truncation foundation | Internal | PR-8 reuses helper and later reviewer expectations assume D1/D8 are already fixed surfaces [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md:179-179] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md:197-198] | Shared truncation helper and stable D8 baseline |
| Phase 2 — metadata + provenance | Internal | PR-9 checks D4 and D7 only make sense after the underlying fixes are live [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md:180-180] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md:198-198] | Reviewer drift assertions depend on fixed tier / provenance behavior |
| Phase 3 — sanitization + decision precedence | Internal | PR-8 refactors helpers introduced by Phase 3 and PR-7 starts from the post-D2/D3 stable pipeline [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md:181-182] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md:199-199] | Reused fixtures `F-AC2` and trigger / decision stability |
| Phase 5 — operations tail PRs | Downstream | Phase 5 assumes this phase already delivered correct lineage, explicit modes, and guardrails [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md:183-183] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md:200-200] | Migration, telemetry, and release-note follow-through |

Phase 4 also depends on the frozen research contract, not on ad hoc rediscovery. The PR-train rows, the iteration-17 dependency map, the iteration-19 reviewer contract, and the iteration-22 performance model are the authoritative design inputs for this child folder. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:1160-1162] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-017.md:43-65] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-019.md:25-154] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-022.md:28-55]

### Dependency Rules Inside the Phase

- PR-7 may start as soon as Phase 1-3 are merged because it introduces net-new lineage behavior without depending on the reviewer contract.
- PR-8 must start from the PR-7-stabilized workflow surface so the SaveMode refactor does not have to chase moving D5 integration points.
- PR-8 must finish before PR-9 because the reviewer gate itself is one of the callsites iteration 17 marks for last-mile SaveMode migration. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-017.md:60-65] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-017.md:72-72]
- PR-9 must read the final PR-7 / PR-8 behavior rather than a speculative interim contract, because its broken-fixture suite is intended to prove real regressions, not template guesses. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:1162-1162]
- Phase 5 must not begin operational migration or release-note closeout until Phase 4 provides green `F-AC5`, green `F-AC8`, and reviewer silence on the clean baseline. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md:200-200]
<!-- /ANCHOR:risks -->

---

### Prior Art

| Prior Art | Relevance to Phase 4 |
|-----------|----------------------|
| `../research/research.md §6-7` | Freezes the narrowed D5 design, including immediate-predecessor selection, continuation gating, and ambiguity skip [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:77-89] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:136-145] |
| `../research/iterations/iteration-006.md` | Proves D5 is a missing-discovery bug in the script pipeline, not a broken MCP causal-edge inserter [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-006.md:20-24] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-006.md:32-42] |
| `../research/iterations/iteration-014.md` | Supplies the empirical continuation corpus that keeps `extended` / `continuation` and excludes noisy `phase N` / `vN` families [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-014.md:22-39] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-014.md:46-56] |
| `../research/iterations/iteration-017.md` | Maps the SaveMode refactor surface and ordering constraints across workflow, extractor, reviewer, and metadata propagation [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-017.md:43-65] |
| `../research/iterations/iteration-019.md` | Defines CHECK-D1 through CHECK-D8, severity levels, and deterministic-review constraints [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-019.md:27-154] |
| `../research/iterations/iteration-022.md` | Validates that PR-7 stays inside an acceptable latency budget and recommends a small header-only reader as the cheapest guard against future growth [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-022.md:28-55] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-022.md:59-70] |
| `../research/iterations/iteration-024.md` | Establishes the M9 performance warning threshold that Phase 4 must stay under once reviewer and predecessor-discovery work are live [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-024.md:88-93] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-024.md:135-140] |

The packet should keep using those frozen artifacts rather than reopening broader research questions in this phase. Manual historical repair, broad telemetry expansion, and concurrency hardening remain Phase 5 or optional follow-on scope. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:1522-1531]

### Practical Prior-art Takeaways for This Phase

- D5 success depends more on what the current artifact says about itself than on scanning the entire repo. Iteration 14 turned that from intuition into corpus-backed gating policy. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-014.md:46-53]
- SaveMode is not a speculative cleanup. Iteration 17 explicitly shows the pipeline already conflates mode, enrichment, and provenance concerns in one `_source` field. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-017.md:67-72]
- Reviewer expansion is justified precisely because the live reviewer is currently advisory-only and misses rendered-markdown regressions. Phase 4 is the first place where that contract is supposed to become real. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:325-325] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-019.md:161-167]
- The performance concern around PR-7 is implementation drift, not the narrowed design itself. That means the spec should constrain anti-patterns, not overreact to raw folder size alone. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-022.md:50-57] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-022.md:65-66]
- The operational tail of the packet already assumes release-note wording around D5 and mode parity. Phase 4 therefore has to leave clear completion evidence, not just passing code. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:1530-1531]

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Should `SaveMode` live on the normalized payload shape, the collected data shape, or both, as the refactor is implemented? [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-017.md:80-81]
- Does PR-7 need the partial-header reader immediately, or can the simple read path stay comfortably below the iteration-24 operational alert threshold without it? [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-022.md:52-57] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-024.md:140-140]
- Should the Phase-4 implementation also formalize the D7 `provenanceExpected` / `gitRepoAvailable` payload contract in shared reviewer types? [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-019.md:167-175]
<!-- /ANCHOR:questions -->
