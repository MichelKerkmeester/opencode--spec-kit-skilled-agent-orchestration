---
title: "...kit/026-graph-and-context-optimization/008-runtime-executor-hardening/003-system-hardening/001-initial-research/spec]"
description: "Research-wave child packet for 019-system-hardening. Dispatches the six Tier 1 candidates from scratch/deep-review-research-suggestions.md (DR-1, RR-1, RR-2, SSK-RR-1, SSK-DR-1, SSK-RR-2) through /spec_kit:deep-research :confirm and /spec_kit:deep-review :confirm. Produces a findings registry that future sibling implementation children consume."
trigger_phrases:
  - "019 initial research"
  - "019 research wave"
  - "019 tier 1 dispatch"
  - "system hardening research"
  - "findings registry research"
importance_tier: "critical"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/008-runtime-executor-hardening/003-system-hardening/001-initial-research"
    last_updated_at: "2026-04-18T17:15:00Z"
    last_updated_by: "claude-opus-4.7-1m"
    recent_action: "Research wave child packet scaffolded"
    next_safe_action: "Approve dispatch plan; start DR-1 or any parallel iteration per scratch-doc order"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "../spec.md"
      - "../../scratch/deep-review-research-suggestions.md"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->"
---
# Feature Specification: 019 Initial Research Wave

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

| Field | Value |
|-------|-------|
| **Parent Spec** | ../spec.md |
| **Predecessor** | (none; first child of 019) |
| **Successor** | 019/002-* (cluster-per-child, TBD after convergence) |

This packet coordinates six Tier 1 research and review dispatches surfaced by `../../scratch/deep-review-research-suggestions.md`. Per canonical sk-deep-research and sk-deep-review workflows, each dispatch owns its own packet state (`deep-research-state.jsonl`, `iterations/`, the research.md output). This packet is therefore a **coordination parent** — its six sub-packets (`001-006/`) each run one dispatch. Three are 026-scoped (DR-1, RR-1, RR-2); three are system-spec-kit-wide (SSK-RR-1, SSK-DR-1, SSK-RR-2).

Every dispatch uses the canonical skill-owned command surface (`/spec_kit:deep-research :auto` or `/spec_kit:deep-review :auto`) with executor `cli-codex gpt-5.4 high fast` per Gate 4 HARD-block. Iteration evidence lives under the canonical `026/research/019-system-hardening/001-initial-research/<NNN-slug>/` and `026/review/019-system-hardening/001-initial-research/<NNN-slug>/` trees via `resolveArtifactRoot()`. Per-sub-packet convergence produces findings that consolidate into this packet's Findings Registry after all six converge.

**Key Decisions**: Sub-packet per dispatch (canonical workflow requirement — see ADR-003 below). Wave-ordered dispatch per parent `019` ADR-001: Wave 1 (SSK-RR-2 + DR-1 for infrastructure surfacing), Wave 2 (RR-1 + RR-2 for 026-scoped research), Wave 3 (SSK-RR-1 + SSK-DR-1 for skill-wide audits). Record scratch-doc revision hash at first dispatch for later reconciliation.

**Critical Dependencies**: The scratch doc is authoritative at dispatch time. Each sub-packet's `plan.md §4.1` contains the actual `/spec_kit:deep-research :auto` / `/spec_kit:deep-review :auto` invocation. Any future scratch-doc revision must be reconciled with the affected sub-packet's dispatch record before changes take effect.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 (coordinated research; individual Tier 1 items carry their own severity) |
| **Status** | Spec Ready, Awaiting Dispatch |
| **Created** | 2026-04-18 |
| **Branch** | `main` |
| **Parent Packet** | `../` (019-system-hardening) |
| **Source Document** | `../../scratch/deep-review-research-suggestions.md` |
| **Scratch Doc Revision** | TBD — record commit hash at first dispatch time |
| **Iteration Budget (per item)** | Default 15; DR-1 and SSK-DR-1 reviews capped at 10; SSK-RR-1 extended to 15-20 (larger corpus) |
| **Research Output Root** | `../../research/019-system-hardening-001-initial-research/` |
| **Review Output Root** | `../../review/019-system-hardening-001-initial-research/` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The parent packet `../spec.md §2` enumerates six Tier 1 investigation items that remain unaddressed after the 2026-04-18 consolidation. Each has an explicit rationale and ready-to-dispatch prompt in `../../scratch/deep-review-research-suggestions.md`. Without a coordinated research wave, these items would either (a) drift into the backlog without execution, or (b) be executed ad-hoc, producing fragmented findings that are hard to cluster for implementation.

This packet exists to run all six iterations under one spec folder, with one findings registry, one dispatch log, and one convergence verdict.

### Purpose

Execute six Tier 1 iterations through the canonical skill-owned command surface. Consolidate findings. Produce an actionable remediation cluster map for future implementation children.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### 3.1 In Scope — Coordination of Six Sub-Packets

Dispatch order follows ADR-001 of parent `019` (Wave 1 → Wave 2 → Wave 3). Sub-packet folders are numbered by wave-dispatch order:

| # | Sub-packet | Tier 1 ID | Type | Wave | Budget |
|---|-----------|-----------|------|------|--------|
| 001 | `001-canonical-save-invariants/` | SSK-RR-2 | Deep Research | 1 | 12-15 |
| 002 | `002-delta-review-015/` | DR-1 | Deep Review | 1 | 7-10 |
| 003 | `003-q4-nfkc-robustness/` | RR-1 | Deep Research | 2 | 15-20 |
| 004 | `004-description-regen-strategy/` | RR-2 | Deep Research | 2 | 8-12 |
| 005 | `005-routing-accuracy/` | SSK-RR-1 | Deep Research | 3 | 12-15 |
| 006 | `006-template-validator-audit/` | SSK-DR-1 | Deep Review | 3 | 10-12 |

All sub-packets use executor `cli-codex gpt-5.4 high fast --executor-timeout=1800`. Each sub-packet's `plan.md §4.1` contains the canonical `/spec_kit:deep-research :auto` or `/spec_kit:deep-review :auto` dispatch command. This parent packet coordinates sequencing, wave gating, scratch-doc SHA recording, and consolidated findings.

### 3.2 Out of Scope

- Any implementation work. This packet produces findings + remediation proposals only. Actual code and doc changes belong to sibling implementation children (`019/002-*`, ...).
- Tier 2 and Tier 3 candidates from the scratch doc — unless a Tier 1 iteration surfaces evidence that requires them.
- Revising or re-scoping the scratch doc's Tier 1 selection mid-wave. If scope changes are needed, pause the wave and reconcile in a formal update.
- Numeric tuning of `MAX_RETRIES` or the 10-minute continuity threshold (Tier 3 `RR-3`) — blocked on telemetry window.

### 3.3 Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md` | Modify | Coordination parent — references sub-packets. |
| `plan.md` | Modify | Wave-gating plan; individual dispatches live in sub-packets. |
| `tasks.md` | Modify | Tasks per wave; sub-packet dispatch delegated. |
| `checklist.md` | Modify | Verification per wave + consolidated findings. |
| `decision-record.md` | Modify | ADR-003 sub-packet-per-dispatch + ADR-002 registry schema. |
| `implementation-summary.md` | Modify | Dispatch log + consolidated findings registry. |
| `001-006/` sub-packets | Create | One per Tier 1 item (Level 2, 5 docs each). |
| `026/research/019-system-hardening/001-initial-research/<NNN-slug>/` | Create via canonical command | Research iteration trees at dispatch time. |
| `026/review/019-system-hardening/001-initial-research/<NNN-slug>/` | Create via canonical command | Review iteration trees at dispatch time. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> Coordination parent of six sub-packets. Each sub-packet runs one canonical dispatch. Wave ordering enforced per ADR-001 of parent `019`.

| Phase | Folder | Tier 1 | Wave | Status |
|-------|--------|--------|------|--------|
| 1 | `001-canonical-save-invariants/` | SSK-RR-2 | 1 | Planned |
| 2 | `002-delta-review-015/` | DR-1 | 1 | Planned |
| 3 | `003-q4-nfkc-robustness/` | RR-1 | 2 | Planned (blocked by Wave 1) |
| 4 | `004-description-regen-strategy/` | RR-2 | 2 | Planned (blocked by Wave 1) |
| 5 | `005-routing-accuracy/` | SSK-RR-1 | 3 | Planned (blocked by Wave 2) |
| 6 | `006-template-validator-audit/` | SSK-DR-1 | 3 | Planned (blocked by Wave 2) |

### Phase Transition Rules

- Each sub-packet MUST pass `validate.sh --strict --no-recursive` after convergence.
- Wave 2 dispatches are blocked until Wave 1 sub-packets converge.
- Wave 3 dispatches are blocked until Wave 2 sub-packets converge.
- If any sub-packet surfaces a P0 finding, parent continuity blocker is updated immediately and downstream waves pause for re-scoping.
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every iteration must dispatch via the canonical skill-owned command surface. | `plan.md` dispatch blocks use `/spec_kit:deep-research :confirm` or `/spec_kit:deep-review :confirm`. No direct `@deep-research` or `@deep-review` agent invocation. |
| REQ-002 | Scratch-doc revision must be recorded at dispatch time for reconciliation. | `implementation-summary.md §Dispatch Log` records the scratch-doc commit hash + timestamp at the first dispatch. |
| REQ-003 | All six iterations must reach convergence, explicit defer, or documented partial convergence. | `implementation-summary.md §Findings Registry` lists every Tier 1 ID with a convergence verdict (CONVERGED / DEFERRED / PARTIAL). |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Findings registry must classify each finding with severity (P0/P1/P2) and proposed remediation cluster. | Registry rows include `severity`, `proposed_cluster`, and optional `defer_reason`. |
| REQ-005 | If a P0 finding surfaces mid-wave, the packet must flag it immediately in continuity frontmatter. | `_memory.continuity.blockers` lists the P0 finding ID; `recent_action` describes the surfacing iteration. |
| REQ-006 | Registry must be machine-parseable. | Registry uses consistent markdown table format; optional `findings-registry.json` mirrors the markdown. |
<!-- /ANCHOR:requirements -->

---

### Acceptance Scenarios

**Given** dispatch time arrives, **when** the first iteration starts, **then** the scratch-doc commit hash is recorded in `implementation-summary.md §Dispatch Log`.

**Given** an iteration completes with zero findings, **when** it is recorded in the registry, **then** it is marked `NO-ACTION-REQUIRED` with evidence rather than dropped silently.

**Given** a P0 finding is surfaced mid-wave, **when** the packet continuity is next updated, **then** the P0 ID appears in `blockers` and `recent_action` describes the surfacing context.

**Given** all six iterations converge, **when** the findings registry is written, **then** every finding has a severity, a proposed cluster, and (if deferred) a defer reason.

**Given** the wave completes, **when** the user opens the summary, **then** the cluster-to-child mapping is explicit enough to create `019/002-*` packets directly from the registry.

**Given** two iterations produce overlapping findings, **when** the registry is written, **then** the duplicates are deduplicated with cross-references to both originating iterations rather than double-counted.

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All six iterations dispatch successfully through the canonical command surface.
- **SC-002**: At least five of six iterations converge to a findings verdict; any non-convergent item has a documented defer reason.
- **SC-003**: Findings registry exists and is machine-parseable.
- **SC-004**: Strict validation passes on the packet after convergence.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Canonical `/spec_kit:deep-research` and `/spec_kit:deep-review` command infrastructure | High | Gate 4; no workaround; SSK-RR-2 explicitly tests this infrastructure's invariants |
| Dependency | `cli-codex gpt-5.4 high fast` executor availability | Medium | Fallback: `cli-copilot` with 3-concurrent cap, or `native` (slower) per ADR in parent 017-sk-deep-cli-runtime-execution |
| Risk | One iteration produces a P0 finding | Medium | REQ-005 + `_memory.continuity.blockers` update; parent packet interrupts wave if needed |
| Risk | Iterations exceed budget without convergence | Medium | REQ-003 allows DEFERRED or PARTIAL verdict; no silent failure |
| Risk | Scratch doc modified mid-wave | Low | REQ-002 records revision at dispatch; later revisions reconciled explicitly |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: Iteration budget enforcement per item. No unbounded loops.

### Security

- **NFR-S01**: RR-1 and SSK-RR-1 research artifacts (exploit constructions, classifier error corpora) stay local to `research/`. Do not publish externally.
- **NFR-S02**: P0 findings that surface mid-wave trigger immediate continuity updates rather than end-of-wave consolidation.

### Reliability

- **NFR-R01**: Iteration state machines (deep-research-state.jsonl, deep-review-state.jsonl) are the canonical progress source. Parent packet continuity reflects them but does not override them.
- **NFR-R02**: Findings registry is write-once-per-iteration; amendments require an appended revision block, not silent overwrite.

---

## 8. EDGE CASES

### Data Boundaries

- If the scratch doc has drifted from repo state, record both the scratch-doc revision AND the current main SHA in the dispatch log.
- If two Tier 1 iterations surface the same finding, deduplicate in the registry with cross-references to both originating iteration files.

### Error Scenarios

- If the canonical command infrastructure is broken (SSK-RR-2 could surface this), record the failure as a P0 finding and halt dispatch until addressed.
- If an iteration produces malformed output that can't be consolidated, mark that item as `PARTIAL` with the raw output preserved in the registry appendix.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 18/25 | Six parallel iterations across two command surfaces |
| Risk | 12/25 | Mostly informational; data-integrity surfaces in RR-1/SSK-RR-2 increase risk |
| Research | 20/20 | Pure research wave |
| Multi-Agent | 4/15 | Single-agent dispatch per iteration |
| Coordination | 12/15 | Dispatch coordination + findings registry consolidation |
| **Total** | **66/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Executor (cli-codex) unavailable during dispatch window | M | L | Fallback kinds per 017 matrix |
| R-002 | P0 data-integrity finding requires mid-wave interruption | H | L | REQ-005 + continuity update |
| R-003 | Findings registry drifts from iteration evidence | M | L | REQ-006 + review step T032 in parent tasks.md |
| R-004 | Multiple iterations surface overlapping findings | M | M | Dedup with cross-references; consolidated cluster definition |

---

## 11. USER STORIES

### US-001: Researcher needs one coordinated dispatch surface (Priority: P0)

**As a** researcher, **I want** one child packet that holds all six Tier 1 dispatches, **so that** I can track progress and convergence without juggling six separate packet folders.

**Acceptance Criteria**:
1. Given the packet is open, When I check §3 In Scope, Then I see all six iterations with budget and executor defaults.
2. Given an iteration completes, When I update the registry, Then the parent packet recognizes it as progress.

---

### US-002: Implementer needs a clean cluster-to-finding map (Priority: P1)

**As an** implementer planning `019/002-*`, **I want** the findings registry to group findings by proposed cluster, **so that** I can scope each child packet directly from the registry.

**Acceptance Criteria**:
1. Given the registry is written, When I group rows by `proposed_cluster`, Then every cluster has at least one finding with severity and evidence links.

---

## 12. OPEN QUESTIONS

- **Q-001**: Should iterations dispatch sequentially or in parallel? Proposal: parallel where Copilot 3-concurrent cap allows. See `plan.md §Dispatch Strategy`.
- **Q-002**: Should SSK-RR-2 (canonical-save invariants) run first, given that its findings could affect how the packet itself saves findings? Proposal: dispatch SSK-RR-2 first to surface infrastructure risks early. See `decision-record.md §ADR-001`.
- **Q-003**: What level of executor fallback is acceptable for each iteration? Proposal: cli-codex default; fall back to native rather than Copilot for audit iterations (to avoid 3-concurrent cap interference).
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent Packet**: `../spec.md`
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Source Document**: `../../scratch/deep-review-research-suggestions.md`
