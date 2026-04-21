---
title: "027 - Skill Graph Daemon and Advisor Unification Tasks"
description: "Parent-level task tracker for the completed Phase 027 skill-graph daemon and advisor unification work."
trigger_phrases:
  - "027 tasks"
  - "advisor daemon tasks"
importance_tier: "high"
contextType: "task-list"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification"
    last_updated_at: "2026-04-21T15:42:05Z"
    last_updated_by: "codex-gpt-5.4"
    recent_action: "Already shipped"
    next_safe_action: "Keep validation green"
    completion_pct: 100
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Tasks: 027 - Skill Graph Daemon and Advisor Unification

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed with evidence |
| `[~]` | Deferred with reason |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Complete Phase 027 research synthesis (`implementation-summary.md` records 60 iterations and synthesis passes).
- [x] T002 Define child dependency chain (`plan.md` phase dependency table).
- [x] T003 Record architecture decisions (`decision-record.md` ADR-001).
- [x] T004 Ship validator ESM compatibility prerequisite (`implementation-summary.md` children convergence log).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T010 Implement narrow watcher defaults and freshness states (`implementation-summary.md` daemon freshness row).
- [x] T011 Implement workspace-scoped single-writer lease (`spec.md` REQ-002).
- [x] T020 Implement derived metadata extraction with provenance (`spec.md` REQ-004).
- [x] T021 Implement trust-lane separation and anti-stuffing caps (`spec.md` NFR-S01).
- [x] T022 Implement additive schema migration and rollback (`spec.md` REQ-005).
- [x] T030 Port advisor scoring to TypeScript (`implementation-summary.md` native scorer row).
- [x] T031 Implement five-lane fusion with semantic shadow weight at 0.00 (`decision-record.md` implementation notes).
- [x] T032 Preserve Python-correct decisions as the parity floor (`decision-record.md` implementation notes).
- [x] T040 Register advisor MCP tools (`spec.md` REQ-006).
- [x] T041 Keep Python and plugin compatibility paths active (`spec.md` REQ-007).
- [x] T042 Implement promotion gate evaluation (`spec.md` REQ-008).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T050 Child implementation tests passed during shipment (`implementation-summary.md` children convergence log).
- [x] T051 Parent implementation summary records all child convergence SHAs (`implementation-summary.md` children convergence log).
- [ ] T052 Parent strict validation exits 0 after the 2026-04-21 parity repair.
- [ ] T053 Phase 027 child parity validation exits 0 in the 2026-04-21 remediation pass.
- [ ] T054 Parent 009 remediation summary records final validation output.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

### Closing Status

- [x] Phase 027 implementation shipped across all seven children.
- [x] Continuity metadata refreshed to shipped state.
- [ ] Strict validation output refreshed after this remediation.

### Current Exit Criteria

- [ ] Phase 027 parent validation exits 0.
- [ ] Parent 009 remediation summary records this child parity gate.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`.
- **Plan**: See `plan.md`.
- **Checklist**: See `checklist.md`.
- **Decisions**: See `decision-record.md`.
- **Implementation Summary**: See `implementation-summary.md`.
<!-- /ANCHOR:cross-refs -->
