---
title: "Feature Specification: Phase 2 — Single-Owner Metadata Fixes"
description: "Phase 2 specifies the P1 metadata fixes for D4 importance-tier drift and D7 empty git provenance, using the parent research packet as the sole planning authority."
trigger_phrases:
  - "phase 2 single-owner metadata"
  - "importance-tier ssot"
  - "d4 metadata drift"
  - "d7 provenance injection"
  - "f-ac4"
  - "f-ac6"
importance_tier: important
contextType: planning
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + phase-child + level2-verify | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/002-single-owner-metadata"
    last_updated_at: "2026-04-12T16:16:10Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Reviewed packet docs"
    next_safe_action: "Run strict validation"
    key_files: ["spec.md"]

---
# Feature Specification: Phase 2 — Single-Owner Metadata Fixes

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + phase-child + level2-verify | v2.2 -->

---

**Phase Overview**

Phase 2 is the P1 child packet for the two metadata defects that the parent research grouped into the same rollout band: D4 importance-tier mismatch and D7 empty git provenance. The phase exists to land PR-3 and PR-4 without pulling in the broader heuristic or refactor work reserved for later phases. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1156-1157]

The D4 side of the phase is a single-owner consolidation problem. The parent research states that D4 is caused by a two-writer drift in which the initial save path emits one tier while a later managed-frontmatter rewrite can mutate only the top block, and the reviewer still does not compare frontmatter against the bottom metadata block directly. Phase 2 therefore needs one authoritative tier resolver and two deferring consumers. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:67-67] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:83-83] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:191-192]

The D7 side of the phase is deliberately narrower. The accepted fix is not a capture-mode rewrite; it is a provenance-only insertion that populates `head_ref`, `commit_ref`, `repository_state`, and detached-HEAD state for JSON saves while leaving captured-session summary, observations, trigger phrases, and decisions untouched. The research narrowed that patch to a six-line insertion next to Step 3.5 and explicitly rejected wholesale reuse of `enrichCapturedSessionData()`. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:86-86] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:197-198] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1537-1538]

This child spec is intentionally execution-ready rather than exploratory. It freezes the owner set, scope boundary, acceptance fixtures, and rollout contract for a single-owner metadata pass that can run independently of Phase 1 and Phase 3, while still honoring the parent packet’s sequencing for risk isolation. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/spec.md:180-180] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/spec.md:198-199]

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-04-07 |
| **Branch** | `system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/002-single-owner-metadata` |
| **Parent Folder** | `../` |
| **Primary Defects** | D4, D7 |
| **PR Scope** | PR-3 and PR-4 |
| **Primary Fixtures** | F-AC4, F-AC6 |
| **Validation Target** | `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/002-single-owner-metadata --strict` |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:phase-context -->
### Phase Context

| Field | Value |
|-------|-------|
| **Parent Spec** | `../spec.md` |
| **Parent Plan** | `../plan.md` |
| **Phase** | 2 of 5 |
| **Predecessor** | `001-foundation-templates-truncation` |
| **Successor** | `003-sanitization-precedence` |
| **Priority Band** | P1 — single-owner metadata fixes |
| **Handoff Criteria** | PR-3 + PR-4 merged; frontmatter and bottom metadata block agree on `importance_tier`; capture-mode-adjacent provenance injection populates `head_ref` and `commit_ref`; F-AC4 and F-AC6 green; post-save reviewer drift assertion installed. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/spec.md:198-198] |

This is **Phase 2** of the memory quality remediation packet. It is explicitly independent of Phase 1 and Phase 3 at the ownership level, but the parent packet still sequences it after the P0 foundation work for risk isolation. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/spec.md:180-180]

**Scope Boundary**: Phase 2 is limited to importance-tier SSOT consolidation plus the provenance-only JSON-mode insertion. It must not absorb trigger sanitization, decision-precedence logic, SaveMode refactors, or reviewer-wide CHECK-D1..D8 work. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1156-1162] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1522-1524]

**Deliverables**:
- One authoritative importance-tier resolution contract documented for PR-3, with `session-extractor.ts:607-612` treated as the canonical resolver surface for this phase’s implementation plan. This owner choice is a phase-level planning decision derived from the PR-3 owner map plus the research statement that the remaining `importanceTier` surfaces are propagation or detection, not separate authorities. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1156-1156] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:191-192]
- One frontmatter-to-metadata synchronization change in `frontmatter-migration.ts:1112-1183` so both rendered tier locations consume the same resolved value. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:83-83] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1471-1474]
- One reviewer assertion in `post-save-review.ts:279-289` that compares top frontmatter against the bottom metadata block instead of checking only payload-vs-frontmatter drift. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:67-67] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:83-83]
- One provenance-only insertion adjacent to the capture-only enrichment branch so JSON-mode saves can populate git provenance without inheriting captured-session summary/observation merges. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:86-86] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:197-198]

**Changelog**:
- When the phase closes, refresh the phase-local changelog entry under the parent packet’s changelog folder and roll the completion status back up to the parent phase map. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/spec.md:187-191]
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Phase 2 closes the packet's metadata-trust gap by removing split ownership of `importance_tier` and by filling JSON-mode git provenance without routing those saves through the broader capture-only enrichment branch. The phase is intentionally narrow because both defects are correctness issues with bounded owner files and deterministic fixtures, not a reason to reopen later behavior-sensitive work. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1156-1157] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1537-1538]

### D4 — Importance-tier mismatch

D4 is a metadata trust defect, not a template-render defect. The parent research localized the defect to a later managed-frontmatter rewrite that can recompute `importance_tier` after initial render while leaving the bottom `## MEMORY METADATA` YAML block stale, and it also confirmed that the current reviewer does not compare the two rendered locations directly. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:48-48] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:67-67]

That defect is high-leverage because the frontmatter side is the authoritative tier consumed by the MCP parsing and persistence path, while the stale bottom metadata block still misleads humans and downstream reviewers. The phase therefore needs to eliminate the two-writer model rather than paper over the disagreement at every later mention of `importanceTier`. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-005.md:25-26] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:191-192]

### D7 — Empty git provenance

D7 is not a broken git extractor; it is a gate-placement bug. The research showed that JSON-mode payloads are marked `_source === 'file'`, which makes `isCapturedSessionMode` false and skips the only branch that currently performs git enrichment. As a result, JSON-mode memory files render empty `head_ref` and `commit_ref` fields plus `repository_state: unavailable`. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:54-54] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:73-73]

The fix is intentionally tiny because the risk is not absence of data alone; it is contamination from over-reusing the capture branch. The canonical narrowing says Phase 2 must call the existing git extractor for provenance only and must not re-run the wider captured-session merge path that also brings in decisions, observations, file descriptions, trigger phrases, and summary text. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:158-161] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1538-1538]

### Purpose

PR-3 and PR-4 share the same rollout band because both are narrow metadata fixes with bounded owners and deterministic fixtures. The parent PR train places them before the more behavior-sensitive D2 and D3 work and before the heavier post-save reviewer upgrade, which keeps Phase 2 focused on correctness without absorbing later refactor obligations. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1156-1162] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1522-1523]
<!-- /ANCHOR:problem -->

> **Memory save contract (cross-ref):** Memory saves in this packet follow the compact retrieval wrapper contract owned by `system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/006-memory-duplication-reduction/`, the implementation host for the `001-research-graph-context-systems/006-research-memory-redundancy/` research findings. Canonical narrative ownership stays in the packet decision record and `implementation-summary.md`; memory files carry only canonical-doc pointers, distinguishing evidence, continuation state, and recovery metadata. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/006-research-memory-redundancy/research/research.md:103-120]

---

### User Stories

### Story 1 — Single authoritative importance tier

As a maintainer, I want the save pipeline to resolve `importance_tier` once and feed that resolved value into both frontmatter and the bottom metadata block so the file does not advertise two different classifications. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:83-83] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1509-1509]

- **Given** a JSON-mode save with an explicit tier or a derived tier
- **When** the managed-frontmatter migration runs
- **Then** frontmatter and the bottom metadata block must serialize the same resolved `importance_tier`, and the reviewer must flag any drift between those two locations. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:125-128] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:198-205]

### Story 2 — Deferring consumers instead of competing writers

As a packet owner, I want exactly one owner file in PR-3 and the remaining tier surfaces to behave as consumers so future fixes do not need to patch `importanceTier` at every mention site. This phase assigns that ownership to `session-extractor.ts:607-612` because the research says the repair should start with writer synchronization/SSOT and because PR-3 freezes that file into the owner map alongside the existing rewriting and review surfaces. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1156-1156] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:191-192]

- **Given** the PR-3 owner set
- **When** the phase plan is executed
- **Then** `frontmatter-migration.ts` must defer to the resolved tier contract and `post-save-review.ts` must detect drift rather than invent a separate authority. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1471-1474]

### Story 3 — Provenance without contamination

As a structured-save operator, I want JSON-mode saves to populate git provenance fields even when they do not pass through capture-mode enrichment, but I do not want authored summary or observation content rewritten just to get those fields. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:86-86] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1538-1538]

- **Given** a JSON-mode save that would currently bypass Step 3.5
- **When** the provenance-only insertion runs
- **Then** the file must receive `head_ref`, `commit_ref`, `repository_state`, and detached-HEAD state from the existing git extractor while leaving captured-session-only merges disabled. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1490-1492] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-018.md:72-78]

### Story 4 — Deterministic proof of correctness

As a reviewer, I want F-AC4 and F-AC6 to run through deterministic fixtures so the phase can prove correctness without depending on live git state or ambiguous historical files. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1514-1518]

- **Given** fixture-driven execution
- **When** the implementation is validated
- **Then** F-AC4 must prove tier parity across frontmatter and metadata, and F-AC6 must prove provenance population through a stubbed git seam rather than live repository state. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:83-86] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1518-1518]

---

<!-- ANCHOR:scope -->
## 4. SCOPE

### In Scope

- PR-3 owner alignment across `frontmatter-migration.ts:1112-1183`, `session-extractor.ts:607-612`, and `post-save-review.ts:279-289`. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1156-1156]
- A single resolved `importance_tier` contract that both rendered tier locations consume. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:83-83] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1509-1509]
- Reviewer coverage for frontmatter-vs-metadata drift, not just payload-vs-frontmatter drift. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:67-67] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-005.md:15-16]
- PR-4 provenance-only insertion in `workflow.ts:658-659,877-923` sized to the already accepted tiny patch shape. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1157-1157] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:197-198]
- Deterministic fixtures for F-AC4 and F-AC6, including a harness-controlled git seam. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1514-1518]
- Phase-local validation and packet roll-up readiness evidence. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/spec.md:187-190]

### Out of Scope

- Reusing `enrichCapturedSessionData()` wholesale for JSON mode. The research rejected that path because it would contaminate summary, observations, trigger phrases, and decisions while fixing provenance. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1538-1538]
- D2 decision precedence, D3 trigger sanitization, D5 predecessor discovery, SaveMode refactors, and reviewer-wide CHECK-D1..D8 upgrades. Those belong to later PRs and later phases. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1158-1162]
- Historical batch migration of old files. The expanded packet keeps that work optional and outside the core train. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1524-1524]
- Auto-migration for D1, D2, D5, or D7 from existing broken files. The research marked those defects as unsafe or ambiguity-sensitive for blind file-content repair. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1537-1537]
- Parent packet file edits during this doc-population turn. Parent status updates are phase-execution tasks, not child-doc authoring work. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/spec.md:187-190]

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Why It Exists |
|----|-------------|---------------|
| **REQ-201** | Resolve `importance_tier` once inside the PR-3 owner set and treat all later tier surfaces as consumers or reviewers, not new authorities. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:191-192] | Eliminates the D4 two-writer model. |
| **REQ-202** | `frontmatter-migration.ts` must serialize the same resolved tier into both top frontmatter and bottom metadata. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:83-83] | Makes the file internally consistent. |
| **REQ-203** | `post-save-review.ts` must assert on frontmatter-vs-metadata drift directly. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:67-67] | Prevents silent split-tier saves. |
| **REQ-204** | `workflow.ts` must receive only the provenance-only D7 insertion and must not reuse `enrichCapturedSessionData()` wholesale. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1538-1538] | Avoids summary and observation contamination. |
| **REQ-205** | F-AC6 must be proven through a stubbed git seam rather than live repository state. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1518-1518] | Keeps acceptance deterministic. |
<!-- /ANCHOR:requirements -->

### Files to Change During Phase Execution

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts` | Modify | Canonical importance-tier resolver surface for Phase 2’s SSOT contract. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1156-1156] |
| `.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts` | Modify | Rewrite both tier representations from the same resolved value instead of mutating frontmatter alone. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:83-83] |
| `.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts` | Modify | Add frontmatter-vs-metadata drift detection as part of the D4 fix surface. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:83-83] |
| `.opencode/skill/system-spec-kit/scripts/core/workflow.ts` | Modify | Add the provenance-only JSON-mode insertion adjacent to Step 3.5 without invoking captured-session merges. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:86-86] |
| Phase-local fixture or test harness files for F-AC4/F-AC6 | Modify/Create | Install divergent-tier fixture and stubbed-git-seam fixture for deterministic acceptance coverage. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1514-1518] |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

| ID | Requirement | Verification |
|----|-------------|--------------|
| **F-AC4** | Frontmatter `importance_tier` and the bottom `## MEMORY METADATA` block agree after the managed-frontmatter path runs, and the post-save reviewer asserts on any frontmatter-vs-metadata drift. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:83-83] | Divergent-tier fixture replay through `generate-context.js --json` plus reviewer assertion coverage. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:198-205] |
| **F-AC6** | JSON-mode saves populate `head_ref`, `commit_ref`, and `repository_state` through a provenance-only insertion, while authored summary content remains unchanged and the proof uses a stubbed git seam instead of live repo state. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:86-86] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1518-1518] | Harness-controlled D7 fixture plus a no-summary-contamination assertion on the JSON-mode output. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-018.md:67-78] |

Phase exit requires both acceptance fixtures green, the reviewer drift assertion installed, and the parent handoff gate satisfied for transition to Phase 3. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/spec.md:198-199]
<!-- /ANCHOR:success-criteria -->

---

## L2: NON-FUNCTIONAL REQUIREMENTS

### Maintainability

- **NFR-M01**: D4 must reduce the effective `importanceTier` write authorities inside the PR-3 owner set from multiple competing writers to one resolver plus consumers. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:191-192]
- **NFR-M02**: D7 must remain a workflow-local patch; no new helper or template change is required for the core fix. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-018.md:78-78]

### Reliability

- **NFR-R01**: The provenance path must preserve the existing empty-result degradation contract so non-git or failing environments still serialize `repository_state: unavailable` instead of throwing. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-018.md:20-20] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-018.md:63-64]
- **NFR-R02**: Frontmatter and bottom metadata must stay synchronized across all save modes that traverse the managed-frontmatter path. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/spec.md:198-198]

### Performance

- **NFR-P01**: The D7 patch must stay at or below the tiny patch shape accepted by the research, and Phase 2 verification must confirm that bound with `git diff --stat`. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:197-198]
- **NFR-P02**: Phase 2 must not drag the later SaveMode refactor into the implementation surface. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1522-1523]

### Testability

- **NFR-T01**: F-AC6 must use a harness-controlled git seam, not live repository state. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1518-1518]
- **NFR-T02**: F-AC4 must prove both serialization parity and reviewer drift detection, not just one of those layers. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:83-83]

---

## L2: EDGE CASES

### D4 edge cases

- A save starts with matching rendered tier placeholders, but a later managed-frontmatter rewrite rehydrates frontmatter from a different source and leaves the bottom metadata block stale. That is the core failure shape this phase must eliminate. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-005.md:22-26]
- The reviewer currently checks payload-vs-frontmatter mismatch only. Phase 2 must cover the separate case where payload and frontmatter agree while the bottom metadata block still drifts. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-005.md:15-16] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:205-205]
- Historical capture-mode parity is not proof of a shared live D4 branch. The parity audit says the live capture flow renders directly and does not traverse the D4 owner identified for JSON-mode rewrites. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-025.md:28-28] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-025.md:57-57]

### D7 edge cases

- **Detached HEAD**: the accepted fix must preserve the extractor’s contract of `headRef = 'HEAD'`, `commitRef = <short SHA>`, and `isDetachedHead = true` instead of inventing a branch name. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-018.md:61-61] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-018.md:76-76]
- **Non-git directory**: the insertion must degrade safely to empty refs and `repository_state: unavailable`. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-018.md:20-20] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-018.md:63-63]
- **Shallow clone**: provenance extraction must continue to use the extractor’s bounded diff logic rather than inline new git shell calls. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-018.md:62-62] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-018.md:83-83]
- **Capture-mode non-regression**: D7 is JSON-mode-specific, and capture mode is already on the correct side of the enrichment gate. Phase 2 must not break that existing path while fixing JSON mode. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-025.md:31-31] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-025.md:61-61]

### Cross-cutting edge cases

- The phase must not accidentally absorb PR-5 or PR-6 behavior changes while touching shared workflow surfaces. The PR train freezes D2 and D3 into later work for a reason. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1158-1159]
- Phase 2 must not treat later guardrail work as already satisfied. Reviewer-wide CHECK-D1..D8 belongs to PR-9, not to this child packet. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1162-1162]

---

## 6. RISKS & DEPENDENCIES

| Dependency | Type | Status | Why It Matters |
|------------|------|--------|----------------|
| Parent phase map and handoff contract | Internal | Ready | Defines Phase 2 as P1, independent by ownership, and sets the Phase 2 → Phase 3 gate. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/spec.md:180-180] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/spec.md:198-198] |
| PR-3 owner map | Internal | Ready | Freezes the D4 implementation surface to `frontmatter-migration.ts`, `session-extractor.ts`, and `post-save-review.ts`. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1156-1156] |
| PR-4 owner map | Internal | Ready | Freezes the D7 implementation surface to `workflow.ts:658-659,877-923` and constrains the patch to the tiny accepted insertion. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1157-1157] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:197-198] |
| Stubbed git seam | Test harness | Required | F-AC6 is only acceptable through a harness-controlled seam rather than live git state. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1518-1518] |
| `validate.sh` on this child folder | Process | Required | Each phase must validate independently before packet-level integration. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/spec.md:187-190] |

<!-- ANCHOR:risks -->
### Risk Summary

| Risk | Impact | Mitigation |
|------|--------|------------|
| D4 fix leaves `frontmatter-migration.ts` as an implicit second writer | High | Enforce the SSOT contract through REQ-201 and F-AC4 evidence. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:191-192] |
| D7 fix grows beyond provenance-only scope | High | Keep the patch at the accepted tiny insertion and reject capture-branch reuse. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:197-198] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1538-1538] |
| Live repo state makes F-AC6 flaky | Medium | Use the required stubbed git seam. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1518-1518] |
| Phase scope expands into later PRs | Medium | Keep PR-5 through PR-9 out of the execution surface. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1158-1162] |
<!-- /ANCHOR:risks -->

---

### Prior Art

The canonical D4 root-cause pass established that the initial render writes one shared `IMPORTANCE_TIER`, while the later managed-frontmatter rewrite introduces the split and the reviewer still misses frontmatter-vs-metadata drift. Phase 2 inherits that exact diagnosis rather than reopening it. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-005.md:19-27]

The canonical D7 root-cause pass established that JSON mode skips the capture-only enrichment gate, which is why the git fields stay empty without ever exercising the extractor. Phase 2 inherits that diagnosis and the resulting provenance-only remedy. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-007.md:6-13] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-007.md:30-31]

Iteration 18 converted D7 from a design discussion into a constrained patch shape: use the existing extractor, keep the insertion tiny, preserve detached-HEAD and empty-result behavior, and do not reuse the broader capture branch. That appendix is the reason this phase treats the `≤10 LOC` requirement as a hard design boundary instead of an implementation guess. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-018.md:43-58] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-018.md:67-83]

Iteration 25 audited capture-mode parity and confirmed that D7 is JSON-mode-specific, while D4 should not be used as proof that the live capture path is broken the same way. That keeps Phase 2’s scope tight: fix JSON-mode D7, repair the shared D4 tooling surface, and avoid inventing extra capture-mode scope. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-025.md:31-31] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-025.md:57-57]

The master recommendations catalog and rollout appendix preserve the same ordering: single-owner metadata fixes first, behavior-sensitive heuristics later, and reviewer guardrails last. This child packet is the documentation embodiment of that sequence. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1522-1523] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1156-1162]

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Should the implementation preserve caller-supplied provenance when `headRef` or `commitRef` is already present, or should live git state always win for JSON mode? The parent appendix leaves this as an implementation-time question after the accepted patch shape. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-018.md:85-86]
- Does any post-phase historical migration need a separate parity audit for managed-frontmatter/backfill behavior, since the capture parity audit explicitly scoped D4 outside the live capture branch? [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-025.md:65-66]
<!-- /ANCHOR:questions -->
