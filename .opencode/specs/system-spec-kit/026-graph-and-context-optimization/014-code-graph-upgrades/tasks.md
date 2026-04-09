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

- [x] T001 Define the packet boundary against `007`, `008`, and `011`, with explicit non-overlap notes in spec, plan, and tasks. [SOURCE: ../001-research-graph-context-systems/002-codesight/research/research.md:905-906] [SOURCE: ../001-research-graph-context-systems/002-codesight/research/research.md:917-917] [EVIDENCE: 2837e157a touched only code-graph-local detector, payload, and query surfaces; no packet 008 or 011 runtime files were modified]
- [x] T002 Add detector provenance taxonomy and update detector contracts plus serialization. [SOURCE: ../001-research-graph-context-systems/002-codesight/research/research.md:899-900] [EVIDENCE: 2837e157a; vitest \"serializes structured and heuristic detector provenance honestly on regex-backed edges\"]
- [x] T003 Implement blast-radius depth-cap correction and multi-file union semantics. [SOURCE: ../001-research-graph-context-systems/002-codesight/research/research.md:910-911] [EVIDENCE: 2837e157a; vitest \"enforces blast-radius depth before inclusion and unions multiple source files\"; vitest \"returns only the seed node when blast-radius maxDepth is zero\"]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T011 Add honest degree-based hot-file breadcrumb fields on code-graph-owned outputs. [SOURCE: ../001-research-graph-context-systems/002-codesight/research/research.md:912-912] [EVIDENCE: 2837e157a; vitest \"enforces blast-radius depth before inclusion and unions multiple source files\"]
- [x] T012 Extend graph payload schema with evidence-tagged edges and numeric confidence backfill on existing owner contracts. [SOURCE: ../001-research-graph-context-systems/002-codesight/research/research.md:905-906] [EVIDENCE: 2837e157a; vitest \"adds nested edge evidence metadata without collapsing trust axes\"; vitest \"emits separate trust axes on code-graph payloads\"]
- [x] T013 Add regression fixtures that fail on detector-provenance regressions and blast-radius depth regressions. [SOURCE: ../001-research-graph-context-systems/002-codesight/research/research.md:899-900] [SOURCE: ../001-research-graph-context-systems/002-codesight/research/research.md:910-911] [EVIDENCE: 2837e157a; vitest suite passed for code-graph-indexer, code-graph-query-handler, code-graph-context-handler, code-graph-scan, ensure-ready, graph-payload-validator, and structural-trust-axis]
- [x] T014 If lexical fallback is included, add a graph-local capability selector plus a forced-degrade verification matrix. [SOURCE: ../001-research-graph-context-systems/002-codesight/research/research.md:916-916] [EVIDENCE: 2837e157a kept fallback bounded to the existing graph-local parser selector; vitest \"uses SPECKIT_PARSER to expose the requested backend without inventing a new routing surface\"]
- [x] T015 Optionally stage cluster metadata or export contracts behind explicit feature flags and non-authority wording. [SOURCE: ../001-research-graph-context-systems/002-codesight/research/research.md:908-909] [EVIDENCE: ADR-003 defer fence preserved in 2837e157a; no clustering, export, or routing-facade runtime files changed]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T021 Run strict validation, targeted runtime checks, and packet completion gates before any follow-on rollout claim. [SOURCE: ../001-research-graph-context-systems/002-codesight/research/research.md:899-917] [EVIDENCE: 2837e157a; bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-code-graph-upgrades --strict -> Errors: 0 Warnings: 0; vitest targeted suite passed 51 tests; npm run typecheck passed]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All nine roadmap tasks marked complete
- [x] No blocked items remain without explicit rationale
- [x] Strict packet validation passes cleanly
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Record**: See `decision-record.md`
<!-- /ANCHOR:cross-refs -->
