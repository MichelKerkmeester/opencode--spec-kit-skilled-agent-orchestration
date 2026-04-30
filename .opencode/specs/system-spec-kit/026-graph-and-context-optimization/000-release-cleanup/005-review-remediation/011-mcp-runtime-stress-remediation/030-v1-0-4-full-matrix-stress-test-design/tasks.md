---
title: "Tasks: v1.0.4 Full-Matrix Stress Test Execution Phase"
template_source: "SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2"
description: "Future execution-phase task ledger for the full-matrix stress test. These tasks are not executed by this design packet."
trigger_phrases:
  - "full matrix stress tasks"
  - "v1.0.4 execution phase tasks"
  - "future stress runner tasks"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/030-v1-0-4-full-matrix-stress-test-design"
    last_updated_at: "2026-04-29T11:40:34Z"
    last_updated_by: "codex"
    recent_action: "Future execution tasks authored"
    next_safe_action: "Execution phase starts at T001 only after a new execution target is approved"
    blockers: []
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:030-full-matrix-tasks"
      session_id: "030-full-matrix-design"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Tasks: v1.0.4 Full-Matrix Stress Test Execution Phase

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending future execution |
| `[x]` | Completed in design phase |
| `[P]` | Parallelizable after dependencies pass |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (artifact or scope)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

### Design Packet Closure

- [x] T000 Read catalog, playbook, prior research, prior stress packet, templates, PP-1/PP-2 harness evidence, and CLI skill surfaces.
- [x] T000A Author design packet docs and metadata.
- [x] T000B Run strict validator on this packet.

### Execution Pre-Flight

- [ ] T001 Create or authorize the execution packet and restate target authority.
- [ ] T002 Freeze `matrix-manifest.json` from `corpus-plan.md`.
- [ ] T003 Smoke one harmless cell per executor: cli-codex, cli-copilot, cli-gemini, cli-claude-code, cli-opencode, native, inline.
- [ ] T004 Record executor readiness, auth blockers, versions, models, reasoning effort, and timeout defaults.
- [ ] T005 Validate that disposable sandbox paths exist for write/destructive cells.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Aggregator and Schema Setup

- [ ] T006 Define normalized cell-result JSONL schema.
- [ ] T007 Implement or select the meta-aggregator that reads cell JSONL and emits sidecar/findings/summary.
- [ ] T008 [P] Add schema tests for `NA`, `SKIP`, `UNAUTOMATABLE`, fixture-only, and scored cells.
- [ ] T009 [P] Add aggregate math tests: denominator excludes `NA`/`SKIP` and includes only scored applicable cells.

### Per-Feature Batches

- [ ] T010 Run F1 spec-folder workflow batch.
- [ ] T011 Run F2 skill advisor + skill graph batch.
- [ ] T012 Run F3 `memory_search` batch.
- [ ] T013 Run F4 `memory_context` batch.
- [ ] T014 Run F5 `code_graph_query` batch.
- [ ] T015 Run F6 `code_graph_scan` / verify batch.
- [ ] T016 Run F7 causal graph batch.
- [ ] T017 Run F8 CocoIndex search batch.
- [ ] T018 Run F9 continuity / generate-context batch.
- [ ] T019 Run F10 deep-research / deep-review batch.
- [ ] T020 Run F11 hooks batch.
- [ ] T021 Run F12 validators batch.
- [ ] T022 Run F13 stress-test cycle pattern batch.
- [ ] T023 Run F14 W3-W13 search features batch.

### Aggregation and Findings

- [ ] T024 Run the meta-aggregator over all cell JSONL.
- [ ] T025 Produce the full findings markdown artifact for v1.0.4.
- [ ] T026 Produce `findings-rubric-v1-0-4-full.json`.
- [ ] T027 Produce `measurements/full-matrix-summary.json`.
- [ ] T028 Produce executor and feature coverage tables listing `PASS`, `FAIL`, `SKIP`, `UNAUTOMATABLE`, and `NA`.
- [ ] T029 Record comparability block: v1.0.2, v1.0.3, and packet 029 are directional only; this full matrix is baseline `full-matrix-v1`.

### Adversarial Regression Review

- [ ] T030 Identify every dropped same-cell score compared with any prior full-matrix sidecar.
- [ ] T031 Run Hunter -> Skeptic -> Referee on every candidate REGRESSION.
- [ ] T032 Patch findings and sidecar with final REGRESSION dispositions.
- [ ] T033 Escalate P0/P1 findings into a follow-up remediation packet only after the review block confirms them.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Verification and Closeout

- [ ] T034 Validate all JSON/JSONL artifacts parse.
- [ ] T035 Validate sidecar aggregate math.
- [ ] T036 Validate no unauthorized runtime, harness, prior packet, or unrelated workspace files were modified.
- [ ] T037 Run `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh <execution-packet> --strict`.
- [ ] T038 Author execution packet implementation summary.
- [ ] T039 Save execution-phase continuity as complete.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

For the future execution packet:

- [ ] All applicable cells have result rows.
- [ ] `NA`, `SKIP`, and `UNAUTOMATABLE` counts are explicit.
- [ ] Findings, rubric, and measurements exist.
- [ ] Every candidate REGRESSION has Hunter -> Skeptic -> Referee.
- [ ] Strict validator exits 0.

For this design packet:

- [x] The execution task ledger is complete and intentionally pending.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Corpus Plan**: See `corpus-plan.md`
- **Decision Records**: See `decision-record.md`

### AI Execution Protocol

#### Pre-Task Checklist

- [ ] Confirm the active execution packet target authority before T001.
- [ ] Read this packet's `spec.md`, `plan.md`, `corpus-plan.md`, and `decision-record.md` before authoring execution code or artifacts.
- [ ] Run executor smoke before freezing scored matrix rows.
- [ ] Confirm no stress execution starts from this design packet without explicit authorization.

#### Execution Rules

| Rule | Description |
|------|-------------|
| TASK-SEQ | Execute T001-T039 in order unless the task is marked `[P]` and dependencies are complete. |
| TASK-SCOPE | Future execution writes must stay inside the authorized execution packet and approved sandbox paths. |
| TASK-EVIDENCE | Every completed execution task must cite artifacts, command output, or normalized cell rows. |
| TASK-REGRESSION | Every candidate REGRESSION requires Hunter -> Skeptic -> Referee before publication. |

#### Status Reporting Format

Report status as `T### STATUS - evidence-or-blocker`, where `STATUS` is `PENDING`, `IN_PROGRESS`, `PASS`, `SKIP`, `BLOCKED`, or `FAIL`.

#### Blocked Task Protocol

If a task is `BLOCKED`, stop dependent tasks, preserve transcripts, record the concrete blocker, and mark affected cells `SKIP`, `NA`, or `UNAUTOMATABLE` rather than substituting another executor.
<!-- /ANCHOR:cross-refs -->
