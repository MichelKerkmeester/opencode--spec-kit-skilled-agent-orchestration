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

- [x] T001 Define the packet boundary against `007`, `008`, and `011`, with explicit non-overlap notes in spec, plan, and tasks. [SOURCE: spec.md:31] [SOURCE: decision-record.md:89] [EVIDENCE: runtime changes stayed inside `mcp_server/lib/context/`, `mcp_server/lib/code-graph/`, and `mcp_server/handlers/code-graph/` only.]
- [x] T002 Add detector provenance taxonomy and update detector contracts plus serialization. [SOURCE: ../001-research-graph-context-systems/002-codesight/research/research.md:899-900] [SOURCE: ../../../../../skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:31] [SOURCE: ../../../../../skill/system-spec-kit/mcp_server/handlers/code-graph/scan.ts:35] [EVIDENCE: vitest `keeps detector provenance separate from the parser trust-axis vocabulary`; vitest `keeps detector provenance honest for fallback lanes`]
- [x] T003 Implement blast-radius depth-cap correction and multi-file union semantics. [SOURCE: ../001-research-graph-context-systems/002-codesight/research/research.md:910-911] [SOURCE: ../../../../../skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:239] [EVIDENCE: vitest `enforces blast-radius depth before inclusion and unions multiple source files`; vitest `keeps blast-radius depth caps and explicit union behavior stable`]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T011 Add honest degree-based hot-file breadcrumb fields on code-graph-owned outputs. [SOURCE: ../001-research-graph-context-systems/002-codesight/research/research.md:912-912] [SOURCE: ../../../../../skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:207] [EVIDENCE: vitest `enforces blast-radius depth before inclusion and unions multiple source files` checks advisory `changeCarefullyReason` output on the high-degree node only]
- [x] T012 Extend graph payload schema with evidence-tagged edges and numeric confidence backfill on current graph-owned contracts. [SOURCE: ../001-research-graph-context-systems/002-codesight/research/research.md:905-906] [SOURCE: ../../../../../skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:117] [SOURCE: ../../../../../skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:561] [EVIDENCE: query-handler snapshots expose `edgeEvidenceClass` and `numericConfidence`, and shared-payload validation accepts the additive graph-local fields.]
- [x] T013 Add regression fixtures that fail on detector-provenance regressions and blast-radius depth regressions. [SOURCE: ../001-research-graph-context-systems/002-codesight/research/research.md:899-900] [SOURCE: ../001-research-graph-context-systems/002-codesight/research/research.md:910-911] [SOURCE: ../../../../../skill/system-spec-kit/scripts/tests/graph-upgrades-regression-floor.vitest.ts.test.ts:48] [EVIDENCE: frozen script-side floor now fails on provenance drift or blast-radius depth leakage]
- [ ] DEFERRED T014 If lexical fallback is included, add a graph-local capability selector plus a forced-degrade verification matrix. [SOURCE: ../001-research-graph-context-systems/002-codesight/research/research.md:916-916] [EVIDENCE: `handlers/code-graph/query.ts` has no lexical fallback cascade to harden in this run, so no capability selector or degrade matrix shipped]
- [ ] DEFERRED T015 Optionally stage cluster metadata or export contracts behind explicit feature flags and non-authority wording. [SOURCE: ../001-research-graph-context-systems/002-codesight/research/research.md:908-909] [SOURCE: decision-record.md:166] [EVIDENCE: ADR-003 kept clustering, GraphML/Cypher export, and routing-facade work prototype-later and out of this rollout]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T021 Run strict validation, targeted runtime checks, and packet completion gates before any follow-on rollout claim. [SOURCE: ../001-research-graph-context-systems/002-codesight/research/research.md:899-917] [EVIDENCE: final verification ran `npm run typecheck`, the required mcp_server and scripts vitest suites, and `validate.sh --strict` for packet 014]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All required roadmap tasks are complete and deferred optional tasks are documented explicitly
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
