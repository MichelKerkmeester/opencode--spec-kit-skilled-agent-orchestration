---
title: "Tasks: Code Graph Upgrades [template:level_3/tasks.md]"
description: "Task breakdown for 014-code-graph-upgrades."
trigger_phrases:
  - "014-code-graph-upgrades"
  - "tasks"
importance_tier: "important"
contextType: "tasks"
---
# Tasks: Code Graph Upgrades

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

- [ ] T001 Define the packet boundary against `007`, `008`, and `011`, with explicit non-overlap notes in spec, plan, and tasks. [SOURCE: ../001-research-graph-context-systems/002-codesight/research/research.md:905-906] [SOURCE: ../001-research-graph-context-systems/002-codesight/research/research.md:917-917]
- [ ] T002 Add detector provenance taxonomy and update detector contracts plus serialization. [SOURCE: ../001-research-graph-context-systems/002-codesight/research/research.md:899-900]
- [ ] T003 Implement blast-radius depth-cap correction and multi-file union semantics. [SOURCE: ../001-research-graph-context-systems/002-codesight/research/research.md:910-911]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T011 Add honest degree-based hot-file breadcrumb fields on code-graph-owned outputs. [SOURCE: ../001-research-graph-context-systems/002-codesight/research/research.md:912-912]
- [ ] T012 Extend graph payload schema with evidence-tagged edges and numeric confidence backfill on existing owner contracts. [SOURCE: ../001-research-graph-context-systems/002-codesight/research/research.md:905-906]
- [ ] T013 Add regression fixtures that fail on detector-provenance regressions and blast-radius depth regressions. [SOURCE: ../001-research-graph-context-systems/002-codesight/research/research.md:899-900] [SOURCE: ../001-research-graph-context-systems/002-codesight/research/research.md:910-911]
- [ ] T014 If lexical fallback is included, add a graph-local capability selector plus a forced-degrade verification matrix. [SOURCE: ../001-research-graph-context-systems/002-codesight/research/research.md:916-916]
- [ ] T015 Optionally stage cluster metadata or export contracts behind explicit feature flags and non-authority wording. [SOURCE: ../001-research-graph-context-systems/002-codesight/research/research.md:908-909]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T021 Run strict validation, targeted runtime checks, and packet completion gates before any follow-on rollout claim. [SOURCE: ../001-research-graph-context-systems/002-codesight/research/research.md:899-917]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All nine roadmap tasks marked complete
- [ ] No blocked items remain without explicit rationale
- [ ] Strict packet validation passes cleanly
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Record**: See `decision-record.md`
<!-- /ANCHOR:cross-refs -->
