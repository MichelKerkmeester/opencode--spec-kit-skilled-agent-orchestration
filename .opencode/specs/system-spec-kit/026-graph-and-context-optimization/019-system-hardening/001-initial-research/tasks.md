---
title: "Tasks: 019 Initial Research Wave"
description: "Task breakdown for the 019/001 research wave."
trigger_phrases:
  - "019 research wave tasks"
  - "tier 1 dispatch tasks"
importance_tier: "critical"
contextType: "tasks"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/019-system-hardening/001-initial-research"
    last_updated_at: "2026-04-18T17:15:00Z"
    last_updated_by: "claude-opus-4.7-1m"
    recent_action: "Tasks scaffolded"
    next_safe_action: "Charter approval, then begin T010 (record scratch-doc SHA)"
    key_files: ["tasks.md"]

---
# Tasks: 019 Initial Research Wave

<!-- SPECKIT_LEVEL: 3 -->
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

**Task Format**: `T### Description`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Scaffold packet docs (spec.md, plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md). [SOURCE: spec.md §3 Files to Change]
- [ ] T002 Record scratch-doc commit hash in `implementation-summary.md §Dispatch Log`. [SOURCE: spec.md REQ-002]
- [ ] T003 Confirm `cli-codex gpt-5.4 high fast` executor availability. [SOURCE: plan.md §2 Definition of Ready]
- [ ] T004 Charter approval (parent + this child).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Sub-Packet Coordination

Per ADR-003, each Tier 1 dispatch runs in its own sub-packet (001-006). This parent packet coordinates wave gating only.

### Wave 1 — Infrastructure Surfacing

- [ ] T010 [P] Navigate to `001-canonical-save-invariants/` and invoke its `plan.md §4.1` dispatch command. [SOURCE: 001-canonical-save-invariants/plan.md §4.1]
- [ ] T011 [P] Navigate to `002-delta-review-015/` and invoke its `plan.md §4.1` dispatch command. [SOURCE: 002-delta-review-015/plan.md §4.1]
- [ ] T012 Converge both; read each sub-packet's `implementation-summary.md §Findings` and confirm convergence verdict.

### Wave 2 — 026-Scoped Research (after Wave 1)

- [B] T020 [P] Dispatch `003-q4-nfkc-robustness/` (blocked by Wave 1 convergence). [SOURCE: 003-q4-nfkc-robustness/plan.md §4.1]
- [B] T021 [P] Dispatch `004-description-regen-strategy/` (blocked by Wave 1 convergence). [SOURCE: 004-description-regen-strategy/plan.md §4.1]
- [ ] T022 Converge both.

### Wave 3 — Skill-Wide Audits (after Wave 2)

- [B] T030 [P] Dispatch `005-routing-accuracy/` (blocked by Wave 2 convergence). [SOURCE: 005-routing-accuracy/plan.md §4.1]
- [B] T031 [P] Dispatch `006-template-validator-audit/` (blocked by Wave 2 convergence). [SOURCE: 006-template-validator-audit/plan.md §4.1]
- [ ] T032 Converge both.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Consolidation

- [ ] T040 Consolidate findings from all six iterations into `implementation-summary.md §Findings Registry`. [SOURCE: spec.md REQ-004]
- [ ] T041 Classify every finding with severity (P0/P1/P2) and proposed remediation cluster. [SOURCE: spec.md REQ-004]
- [ ] T042 Deduplicate findings across iterations; cross-reference overlapping entries. [SOURCE: spec.md §8 Edge Cases]
- [ ] T043 (Optional) Mirror registry to machine-readable `findings-registry.json`. [SOURCE: spec.md REQ-006]
- [ ] T044 Run strict validation on this packet.
- [ ] T045 Update parent packet `../implementation-summary.md` §How It Was Delivered with wave outcome.
- [ ] T046 Update parent continuity (`../spec.md` / `../implementation-summary.md` _memory.continuity).
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] T002 scratch-doc SHA recorded.
- [ ] T010-T032 all six iterations converge (or defer with documented reason).
- [ ] T040-T042 findings registry complete and classified.
- [ ] T044 strict validation passes.
- [ ] T045 parent packet updated with wave outcome.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan (with dispatch blocks)**: See `plan.md §4.1`
- **Verification Checklist**: See `checklist.md`
- **Decision Record**: See `decision-record.md`
- **Parent Packet**: `../spec.md`, `../tasks.md`
- **Source Document**: `../../scratch/deep-review-research-suggestions.md`
<!-- /ANCHOR:cross-refs -->
