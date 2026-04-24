---
title: "...-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/005-006-campaign-findings-remediation/tasks]"
description: "Task ledger for 005-006 Campaign Findings Remediation."
trigger_phrases:
  - "tasks 005 006 campaign findings remediation"
importance_tier: "important"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/005-006-campaign-findings-remediation"
    last_updated_at: "2026-04-21T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Generated task ledger"
    next_safe_action: "Work tasks by severity"
    completion_pct: 0
---
# Tasks: 005-006 Campaign Findings Remediation
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

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [P0] Confirm consolidated findings source is readable — Evidence: consolidated-findings.md parsed into 10 themes, 274 tasks generated.
- [x] T002 [P0] Verify severity counts against the source report — Evidence: P0=7, P1=165, P2=102 confirmed from consolidated-findings.md.
- [x] T003 [P1] Identify target source phases before implementation edits — Evidence: per-theme tasks.md files mapped CF ids to source phases.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

Theme status after flattening (details in implementation-summary.md Sub-phase summaries):

- [B] T010 [P0] 001-graph-and-metadata-quality (79 findings, 18% done) — Blocked: CF-108 requires source-packet writes outside current authority. 4 code fixes verified (CF-181, CF-071, CF-133, CF-116).
- [B] T011 [P0] 002-spec-structure-and-validation (60 findings, 20% done) — Blocked: CF-207 recursive validation fails on historical packet docs outside write boundary. CF-176 (graph health) closed.
- [ ] T012 [P0] 003-evidence-references-and-replayability (46 findings) — Not started. Awaiting write authority.
- [x] T013 [P1] 004-migration-lineage-and-identity-drift (42 findings) — Complete. validate.sh --strict --no-recursive exits 0.
- [ ] T014 [P0] 005-packet-state-continuity-and-closeout (17 findings) — Not started. Awaiting write authority.
- [x] T015 [P0] 006-routing-accuracy-and-classifier-behavior (15 findings) — Complete. All P0/P1 closed, P2 deferred. validate.sh exits 0.
- [x] T016 [P1] 007-skill-advisor-packaging-and-graph (7 findings) — Complete. All P1 closed, P2 deferred. validate.sh exits 0.
- [x] T017 [P1] 008-search-fusion-and-reranker-tuning (5 findings) — Complete. All P1 closed, P2 deferred. validate.sh exits 0.
- [x] T018 [P1] 009-security-and-guardrails (2 findings) — Complete. CF-183, CF-186 closed. validate.sh exits 0.
- [x] T019 [P1] 010-telemetry-measurement-and-rollout-controls (1 finding) — Complete. CF-271 closed. validate.sh exits 0.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T900 [P0] Run strict packet validation
- [ ] T901 [P1] Update graph metadata after implementation
- [ ] T902 [P1] Add implementation summary closeout evidence
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]` or explicitly deferred
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See spec.md
- **Plan**: See plan.md
<!-- /ANCHOR:cross-refs -->
