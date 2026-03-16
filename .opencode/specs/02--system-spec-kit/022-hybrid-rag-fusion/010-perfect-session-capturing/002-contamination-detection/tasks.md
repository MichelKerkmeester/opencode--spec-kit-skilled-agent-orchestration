---
title: "Tasks: Contamination Detection [template:level_1/tasks.md]"
---
# Tasks: Contamination Detection

<!-- SPECKIT_LEVEL: 2 -->
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
## Phase 1: Setup — Extend V8 Rules

- [ ] T001 Add frontmatter parsing to V8 — extract `trigger_phrases` and `key_topics` arrays (`scripts/validators/validate-memory-quality.ts`) — REQ-001
- [ ] T002 Check extracted frontmatter values against the foreign-spec identifier set (`scripts/validators/validate-memory-quality.ts`) — REQ-001
- [ ] T003 Add non-dominant signal detection: flag when 1-2 foreign-spec mentions appear across 2+ different specs (`scripts/validators/validate-memory-quality.ts`) — REQ-002
- [ ] T004 Preserve existing V8 body-content detection alongside new frontmatter checks (`scripts/validators/validate-memory-quality.ts`) — REQ-001
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation — V9 Patterns, Noise Config, and Audit Logging

### Broaden V9 Patterns

- [ ] T005 Audit current 3-pattern V9 denylist and document what it catches (`scripts/validators/validate-memory-quality.ts`) — REQ-003
- [ ] T006 Add patterns for template residue (`[NAME]`, `[placeholder]`), generic stubs (`Untitled`, `Draft`, `TODO`), and spec-number-only titles (`scripts/validators/validate-memory-quality.ts`) — REQ-003
- [ ] T007 Test new patterns against existing golden memories to verify zero false positives — REQ-003

### Wire noise.patterns Config

- [ ] T008 Read `noise.patterns` from `content-filter` config at initialization (`scripts/lib/content-filter.ts`) — REQ-005
- [ ] T009 Apply config-driven patterns during content filtering alongside hardcoded rules (`scripts/lib/content-filter.ts`) — REQ-005
- [ ] T010 Ensure config-driven patterns do not override safety-critical hardcoded rules (`scripts/lib/content-filter.ts`) — REQ-005

### Add 3-Stage Audit Logging

- [ ] T011 Define `ContaminationAuditRecord` interface: `{ stage, timestamp, patternsChecked, matchesFound, actionsTaken, passedThrough }` — REQ-004
- [ ] T012 Emit audit record at extractor scrub point (`scripts/extractors/collect-session-data.ts`) — REQ-004
- [ ] T013 Emit audit record at content-filter point (`scripts/lib/content-filter.ts`) — REQ-004
- [ ] T014 Emit audit record at post-render point (`scripts/renderers/`) — REQ-004
- [ ] T015 Aggregate audit records for downstream quality reporting — REQ-004
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T016 Unit test: V8 frontmatter foreign-spec detection — REQ-001
- [ ] T017 [P] Unit test: V8 non-dominant signal detection (1-2 mentions across 2+ specs) — REQ-002
- [ ] T018 [P] Unit test: V9 expanded pattern set — no false positives on golden memories — REQ-003
- [ ] T019 [P] Unit test: `noise.patterns` config wiring in content-filter — REQ-005
- [ ] T020 Integration test: end-to-end contamination detection with audit trail across 3 stages — REQ-004
- [ ] T021 Run full Vitest suite and confirm all tests pass — SC-001, SC-002
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] Cross-spec contamination with <3 foreign mentions detected and flagged (SC-001)
- [ ] Audit trail shows detection coverage at each pipeline stage (SC-002)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Dependency**: 001-quality-scorer-unification (R-01) must provide contamination penalty support before detection feeds into scoring
<!-- /ANCHOR:cross-refs -->
