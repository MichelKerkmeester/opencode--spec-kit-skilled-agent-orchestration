---
title: "Task Breakdown [skilled-agent-orchestration/041-sk-recursive-agent-loop/002-sk-recursive-agent-full-skill/tasks]"
description: "Ordered task list for upgrading sk-improve-agent from the phase 001 MVP into a benchmark-backed full-skill system."
trigger_phrases:
  - "agent improvement full skill tasks"
  - "benchmark harness tasks"
importance_tier: "normal"
contextType: "general"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/041-sk-recursive-agent-loop/002-sk-recursive-agent-full-skill"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["tasks.md"]
---
# Tasks: Agent Improvement Full Skill

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable or grouped workstream |
| `[B]` | Blocked |

**Task Format**: `T-###: Description` with scoped file references where relevant.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T-001: Create `spec.md` for the phase `002` Level 3 packet
- [x] T-002: Create `plan.md` with benchmark-first full-skill phases
- [x] T-003: Create `tasks.md` for the phase `002` packet
- [x] T-004: Create `checklist.md` with planning and implementation gates
- [x] T-005: Create `decision-record.md` for the next-stage architectural choices
- [x] T-006: Create `implementation-summary.md` as a planning-stage stub
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Handover Benchmark Harness

- [x] T-010: Define the fixture input corpus for handover benchmarking
- [x] T-011: Define benchmark scoring expectations and stable pass/fail rules
- [x] T-012: Add harness scripts or runner extensions under `.opencode/skill/sk-improve-agent/scripts/`
- [x] T-013: Create packet-local benchmark evidence layout under this packet
- [x] T-014: Verify repeatability across at least two benchmark runs

---

### Runtime Generalization

- [x] T-020: Generalize runtime config and manifest schema for target profiles
- [x] T-021: Add target-profile templates and reference docs
- [x] T-022: Update reducer/reporting logic to distinguish target families
- [x] T-023: Keep manifest-backed canonical-target enforcement intact during refactor

---

### Second Structured Target

- [x] T-030: Choose one second structured target with a deterministic contract
- [x] T-031: Add a target profile and evaluator contract for the second target
- [x] T-032: Run one bounded experiment cycle against the second target
- [x] T-033: Document why the second target is safe enough for this phase

---

### Reporting and Controls

- [x] T-040: Improve dashboard reporting for regressions, ties, and infra failures
- [x] T-041: Add no-go conditions and stop rules for unstable runs
- [x] T-042: Add clearer operator summaries for best-known state per target

---

### Packaging and Operator Guidance

- [x] T-050: Define downstream mirror-sync workflow without mixing it into experiment evidence
- [x] T-051: Add target-onboarding documentation
- [x] T-052: Update command and skill docs for the stronger full-skill model
- [x] T-053: Define what still remains out of scope after this packet

---

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T-060: Run strict validation on this packet and fix structural issues
- [x] T-061: Re-run invalid-target guardrail checks after runtime expansion
- [x] T-062: Verify benchmark evidence and second-target evidence are both present
- [x] T-063: Use a parallel review pass before claiming completion
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Follow-on Level 3 planning docs exist and are synchronized.
- [x] Benchmark-backed handover evaluation is implemented.
- [x] One second structured target is onboarded safely.
- [x] Full-skill guardrails remain intact after expansion.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Parent Packet**: See `../`
- **Previous Phase**: See `../001-sk-improve-agent-mvp/`
- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decision Record**: See `decision-record.md`
<!-- /ANCHOR:cross-refs -->
