---
# SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2
title: "Tasks: Stress-Test Rerun v1.0.2"
template_source: "SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2"
description: "Task ledger for the v1.0.2 stress-test re-run: Setup phase covers pre-flight + dispatch script mirroring + I2 weak-quality preamble; Implementation phase covers 30-cell dispatch + per-cell scoring with fork-telemetry assertions and delta classification; Verification phase covers findings synthesis + frozen-baseline forward pointer + memory re-index."
trigger_phrases:
  - "010 stress-test rerun tasks"
  - "v1.0.2 sweep tasks"
  - "T001 daemon attestation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/010-stress-test-rerun-v1-0-2"
    last_updated_at: "2026-04-28T20:00:00Z"
    last_updated_by: "codex-gpt-5.5"
    recent_action: "Strict validator hygiene update"
    next_safe_action: "Run recursive strict validator"
    blockers: []
    key_files:
      - "tasks.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Tasks: Stress-Test Rerun v1.0.2

---

<!-- ANCHOR:notation -->
## Task Notation

> Task notation: open / in progress / complete / blocked. Each task cites its REQ from the spec. Single scorer (this AI session).

Task ID format: T###. The first digit denotes the phase: T0xx = Setup, T1xx = Implementation dispatch, T2xx = Implementation scoring, T3xx = Verification.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

> Pre-flight daemon attestation, dispatch-script mirroring, and the deterministic I2 weak-quality preamble. Hard gate: cells do not dispatch until all four daemon-attestation probes pass.

### T001 — Daemon-version attestation
- REQ: REQ-001
- Action: invoke the cocoindex CLI version check
- PASS: stdout contains the spec-kit-fork version substring
- FAIL: missing fork substring → ABORT, run the skill installer, restart MCP-owning client, retry
- Artifact: pre-flight log first line

### T002 — Memory-context smoke probe (covers REQ-008 + REQ-013)
- REQ: REQ-001 + REQ-013
- Action: invoke memory_context with input "Semantic Search" mode "auto" and trace inclusion enabled
- PASS: response carries token-budget enforcement fields populated; intent telemetry classification fields present
- FAIL: any field missing → daemon hasn't picked up rebuilt dist → ABORT
- Artifact: pre-flight log probe-output block

### T003 — Code-graph + causal-graph attestation
- REQ: REQ-001
- Action: invoke code_graph_status AND memory_causal_stats
- PASS code-graph: freshness fresh, freshnessAuthority live
- PASS causal-graph: all six by_relation keys present, health agrees with meetsTarget, deltaByRelation populated, balanceStatus populated
- FAIL: any check fails → ABORT
- Artifact: pre-flight log final block

### T004 — Mirror dispatch scripts and prompt corpus from v1.0.1
- REQ: REQ-002 (precondition for dispatch)
- Action: copy the three dispatch scripts plus the run orchestrator plus the nine prompt files from the v1.0.1 design folder into this packet's scripts subfolder
- PASS: dispatch scripts plus prompt files all present in this packet
- Note: scripts inherit cli-copilot concurrency cap of 3 plus cli-codex service-tier fast from v1.0.1 — DO NOT modify those constants

### T005 — Apply REQ-014 weak-quality preamble to the I2 prompt
- REQ: REQ-014
- Action: edit the I2 prompt to prepend a deterministic preamble that guarantees memory_search returns weak quality (a query for a non-existent canonical phrase with a unique date marker)
- PASS: I2 prompt opens with the preamble; rest of the v1.0.1 prompt text preserved verbatim
- Note: this is the load-bearing change for SC-003 — without it REQ-011 cannot be exercised reliably
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

> 30-cell dispatch (27 base plus 3 ablation), then per-cell scoring under the v1.0.1 4-dimension rubric with fork-telemetry assertions and delta classification.

### Dispatch tasks

### T101-T109 — cli-codex × 9 scenarios
- REQ: REQ-002
- Action: dispatch S1 S2 S3 Q1 Q2 Q3 I1 I2 I3 against cli-codex with the v1.0.1 invocation template
- Artifacts per cell: prompt input, captured stdout, dispatch metadata, score skeleton
- Concurrency: unlimited

### T111-T119 — cli-copilot × 9 scenarios
- REQ: REQ-002
- Action: dispatch all nine scenarios against cli-copilot
- Concurrency guard: pgrep-f-copilot count below three before each launch — 2-second backoff loop until gate clears

### T121-T129 — cli-opencode × 9 scenarios (general agent)
- REQ: REQ-002
- Action: dispatch all nine scenarios against cli-opencode general agent

### T130 — cli-opencode-pure × 3 ablation (S1 S2 S3 only, context agent)
- REQ: REQ-002 ablation arm
- Action: dispatch S1 S2 S3 against cli-opencode context agent
- Note: matches v1.0.1 ablation pattern verbatim

### T131 — Verify all 30 cells produced artifacts with exit_code 0
- REQ: REQ-002
- Action: enumerate per-cell dispatch metadata; confirm exit codes are zero across all 30
- PASS: 30/30 zero exit code

### Scoring tasks

### T201 — Author the score template
- REQ: REQ-003 + REQ-004 + REQ-008..013
- Action: write a score template file under this packet's scripts subfolder describing the v1.0.1 4-dim rubric table, the Fork-Telemetry Assertions sub-section, the Delta-vs-v1.0.1 classification, and the Narrative paragraph
- PASS: template file exists and matches the structure described in the spec REQ-003 / REQ-004 sections

### T202-T210 — Score the 30 cells (one task per scenario row)
- REQ: REQ-003 + REQ-004 + REQ-008..013
- Per-scenario sub-tasks:
  - T202 — score S1 cells; REQ-008 fork-telemetry
  - T203 — score S2 cells; REQ-008 fork-telemetry
  - T204 — score S3 cells; REQ-008 fork-telemetry
  - T205 — score Q1 cells (no ablation); REQ-009 fallback-decision
  - T206 — score Q2 cells; REQ-013 token-budget
  - T207 — score Q3 cells; REQ-010 path-class rerank
  - T208 — score I1 cells; REQ-012 intent telemetry
  - T209 — score I2 cells; REQ-011 response policy plus REQ-012 intent telemetry — HEADLINE: SC-003 lives here
  - T210 — score I3 cells; REQ-012 intent telemetry
- PASS per cell: rubric table summing 0-8, Fork-Telemetry Assertions PASS/FAIL/N-A per applicable REQ, Delta classification line, Narrative paragraph

### T211 — Verify zero unresolved REGRESSION cells
- REQ: REQ-006
- Action: enumerate score files; collect any cell classified REGRESSION; for each, document one of: (a) measurement artifact, (b) known regression already tracked, OR (c) escalate as P0 follow-up
- PASS: zero REGRESSION cells unresolved
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

> Findings synthesis, frozen-baseline forward pointer, HANDOVER status update, validator run, and memory DB re-index.

### T301 — Author findings document
- REQ: REQ-005 + REQ-015 + REQ-017
- Action: write findings document with the v1.0.1 findings shape PLUS new v1.0.2 sections: executive summary, per-scenario comparison table with v1.0.1-baseline plus v1.0.2-score plus delta plus classification columns, per-CLI averages side-by-side, per-packet verdict table covering all seven remediation packets, cross-reference back to remediation packets, novel findings, recommendations including potential v1.0.3 rubric calibration if saturation observed, methodology
- PASS: findings document exists; per-packet verdict table covers all seven remediation packets; per-CLI averages match the score aggregation

### T302 — Append forward-pointer to v1.0.1 findings
- REQ: REQ-007
- Action: append a SINGLE trailing line to the v1.0.1 findings document at the predecessor packet pointing readers to this packet's findings
- PASS: git diff shows ONLY the one inserted line at file end; zero deletions or modifications above it

### T303 — Update HANDOVER-deferred §2.1 from Scaffolded to Closed
- REQ: REQ-005
- Action: update §2.1 status field from Scaffolded to Closed with closure evidence; append §1 closed-since-original-handover row with date plus closure evidence summary
- PASS: §2.1 reflects closure; closed table has new row

### T304 — Run validate.sh strict on this packet
- REQ: SC-006
- Action: run the spec-kit validator strict mode on this packet folder
- PASS: zero blocking errors

### T305 — Memory DB re-index for this packet
- REQ: REQ-016
- Action: invoke memory_index_scan with this packet's specFolder path
- PASS: scan returns success with indexed file count above zero
- Note: enables semantic memory_search on this packet's content from future sessions
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

| Gate | Tasks | Required for |
|------|-------|--------------|
| Pre-flight gate | T001-T005 | Phase 2 entry |
| Dispatch gate | T101-T131 | Scoring entry |
| Score gate | T201-T211 | Phase 3 entry |
| Synthesis gate | T301-T305 | Packet ship |

Headline acceptance: SC-001 (≥1 WIN per packet 003-009) + SC-003 (I2 cli-opencode ≥6/8) + SC-007 (frozen baseline preserved). All three together close HANDOVER-deferred §2.1 with green evidence.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: this packet's spec document at the packet root (REQ definitions and success criteria)
- Plan: this packet's plan document (architecture, phases, dependencies, rollback)
- Checklist: this packet's checklist document (P0/P1/P2 quality gates)
- v1.0.1 baseline: predecessor packet at sibling 001-search-intelligence-stress-test (corpus, rubric, dispatch matrix, baseline scores)
- Daemon-rebuild contract: sibling 008-mcp-daemon-rebuild-protocol (live-probe template for T001-T003)
- HANDOVER-deferred §2.1: parent phase folder (this packet closes that follow-up when findings ship)
<!-- /ANCHOR:cross-refs -->
