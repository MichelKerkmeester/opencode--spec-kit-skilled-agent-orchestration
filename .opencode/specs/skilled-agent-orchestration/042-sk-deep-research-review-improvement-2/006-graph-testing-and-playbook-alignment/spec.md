---
title: "Feature Specification: Graph Testing and Playbook Alignment [006]"
description: "Rigorous integration and stress testing for the coverage graph solution spanning CJS and TS/MCP layers, plus manual testing playbook updates for graph capabilities in sk-deep-research, sk-deep-review, and sk-improve-agent."
trigger_phrases:
  - "006"
  - "graph testing"
  - "playbook alignment"
  - "coverage graph integration tests"
  - "graph stress tests"
importance_tier: "important"
contextType: "planning"
---
# Feature Specification: Graph Testing and Playbook Alignment

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

## EXECUTIVE SUMMARY

The coverage graph solution built in 042 Phase 2 spans CJS modules (core, signals, convergence, contradictions) and a TS/MCP layer (coverage-graph-db.ts). Existing unit tests cover each layer individually, but there is no cross-layer integration testing to verify API contract alignment between CJS and TS, no stress testing for large graphs, and no manual testing playbook coverage for graph-related capabilities in the three deep-loop skills. This phase adds rigorous integration tests, stress tests, playbook test cases, and README updates.

**Key Decisions**: Integration tests use Vitest and import both CJS and TS modules to verify contract alignment at the type and value level. Stress tests target 1000+ nodes to validate performance boundaries. Playbook test cases follow the existing Given/When/Then format established in each skill's playbook.

**Critical Dependencies**: 042 Phase 2 coverage graph modules (coverage-graph-core.cjs, coverage-graph-signals.cjs, coverage-graph-convergence.cjs, coverage-graph-contradictions.cjs); 042 Phase 2 TS layer (coverage-graph-db.ts); existing manual testing playbooks in sk-deep-research, sk-deep-review, and sk-improve-agent.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-04-10 |
| **Branch** | `system-speckit/026-graph-and-context-optimization` |
| **Parent Packet** | `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/` |
| **Predecessor Phases** | `002-semantic-coverage-graph`, `005-agent-improver-deep-loop-alignment` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The coverage graph solution has unit tests for each layer (CJS core, CJS signals, CJS convergence, TS DB) but lacks cross-layer contract verification. Relation name sets, weight ranges, and convergence signal computation could drift between layers silently. Additionally, there are no performance/stress tests, and the three deep-loop skills' manual testing playbooks have no graph-specific test cases, leaving graph convergence signals and graph event emission untestable by operators.

### Purpose

1. Verify CJS-to-TS API contract alignment (same relation names, same weight ranges, same clamping behavior)
2. Verify namespace isolation across loop types (research, review, improvement)
3. Stress-test graph operations at scale (1000+ nodes)
4. Add manual testing playbook entries for graph convergence and graph event emission in each deep-loop skill
5. Update READMEs that are missing graph capability references
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:requirements -->
## 3. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-GT-001 | CJS-TS relation name alignment | Integration test verifies RESEARCH_RELATION_WEIGHTS keys match VALID_RELATIONS.research in coverage-graph-db.ts |
| REQ-GT-002 | CJS-TS review relation alignment | Integration test verifies REVIEW_RELATION_WEIGHTS keys match VALID_RELATIONS.review (accounting for TS-only relations ESCALATES, IN_DIMENSION, IN_FILE) |
| REQ-GT-003 | Weight clamping consistency | Integration test verifies both layers clamp to [0.0, 2.0] |
| REQ-GT-004 | Self-loop prevention | Integration test verifies both CJS insertEdge and TS CHECK constraint reject self-loops |
| REQ-GT-005 | Namespace isolation | Integration test verifies research, review, and improvement loop types operate in separate namespaces |
| REQ-GT-006 | Convergence signal alignment | Integration test verifies convergence computation produces consistent results across layers |
| REQ-GT-007 | Stress: 1000+ nodes | Stress test inserts 1000+ nodes with edges and verifies correctness and acceptable performance |
| REQ-GT-008 | Stress: contradiction scanning at scale | Stress test scans for contradictions in a 500+ edge graph |
| REQ-GT-009 | Playbook: research graph convergence | Manual test case validates graph convergence signals (sourceDiversity, evidenceDepth) act as STOP-blocking guards |
| REQ-GT-010 | Playbook: research graph events | Manual test case validates iterations emit graphEvents in JSONL |
| REQ-GT-011 | Playbook: review graph convergence | Manual test case validates graph convergence for review (dimensionCoverage, findingStability) |
| REQ-GT-012 | Playbook: review graph events | Manual test case validates review iterations emit graphEvents |
| REQ-GT-013 | Playbook: agent-improver graph tracking | Manual test cases for mutation coverage graph, trade-off detection, and candidate lineage |
| REQ-GT-014 | README updates | Skill READMEs reference graph capabilities where missing |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:scope -->
## 4. SCOPE

### In Scope

- Integration test file: `coverage-graph-integration.vitest.ts`
- Stress test file: `coverage-graph-stress.vitest.ts`
- 4 new manual testing playbook files (research: 2, review: 2)
- 3 new manual testing playbook files (agent-improver)
- README updates for sk-deep-research, sk-deep-review, sk-improve-agent

### Out of Scope

- Modifying graph module implementations
- Adding new graph features
- Changes to the MCP tool surface
- system-spec-kit README (already has comprehensive graph references)
<!-- /ANCHOR:scope -->
