---
title: "Tasks [system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/004-memory-save-rewrite/tasks]"
description: "Completed task ledger covering audit + retirement (P013-), research (P014-), implementation (P015-), and remediation (P015-R). Task IDs preserve source-packet lineage for traceability."
trigger_phrases:
  - "tasks"
  - "memory save planner first"
  - "planner-first tasks"
  - "audit tasks"
  - "research tasks"
  - "implementation tasks"
  - "remediation tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/004-memory-save-rewrite"
    last_updated_at: "2026-04-15T10:00:01Z"
    last_updated_by: "cli-copilot"
    recent_action: "Rewrote task ledger as cohesive planner-first delivery sequence"
    next_safe_action: "Packet complete"
    blockers: []
    key_files:
      - "tasks.md"
      - "research/013-audit-snapshot/review-report.md"
      - "research/014-research-snapshot/research.md"
      - "review/015-deep-review-snapshot/review-report.md"
    session_dedup:
      fingerprint: "sha256:014-planner-first-tasks-2026-04-15"
      session_id: "014-planner-first-tasks-2026-04-15"
      parent_session_id: "014-planner-first-seed"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Task IDs preserve P013-/P014-/P015-/P015-R lineage so evidence cites the right artifact."
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
---
# Tasks: /memory:save Planner-First Default

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

## Task Notation
<!-- ANCHOR:notation -->

| Prefix | Meaning |
|--------|---------|
| `[x]` | Completed |
| `P013-` | Audit + retirement evidence |
| `P014-` | Relevance research evidence |
| `P015-` | Planner + trim implementation |
| `P015-R` | Deep-review remediation |
| `P014-` | Packet documentation consolidation work |

Task IDs preserve source-artifact lineage so every line of evidence cites the right artifact in `research/013-audit-snapshot/`, `research/014-research-snapshot/`, or `review/015-deep-review-snapshot/`.

---

<!-- /ANCHOR:notation -->
<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

### Audit + Retirement Tasks

- [x] **P013-R001** Define the audit question, classification rule, and iteration plan. Evidence: `research/013-audit-snapshot/primary-docs/spec.md`, `research/013-audit-snapshot/deep-review-strategy.md`
- [x] **P013-R002** Confirm the runtime still created `[spec]/memory/` and wrote `memory/*.md` on save. Evidence: `research/013-audit-snapshot/iterations/iteration-001.md`, `research/013-audit-snapshot/review-report.md`
- [x] **P013-R003** Confirm the runtime still read legacy `memory/*.md` for dedup and causal-link behavior. Evidence: `research/013-audit-snapshot/iterations/iteration-001.md`, `research/013-audit-snapshot/review-report.md`
- [x] **P013-R004** Confirm the runtime still indexed legacy `memory/*.md` into the vector DB. Evidence: `research/013-audit-snapshot/iterations/iteration-001.md`, `research/013-audit-snapshot/review-report.md`
- [x] **P013-R005** Audit MCP-layer behavior and confirm the independent contradiction lived in the script workflow, not in a second hidden write path. Evidence: `research/013-audit-snapshot/deep-review-strategy.md`
- [x] **P013-R006** Audit operator-facing docs for retirement-claim contradictions. Evidence: `research/013-audit-snapshot/review-report.md`
- [x] **P013-R007** Audit templates and worked examples for stale `memory/` guidance. Evidence: `research/013-audit-snapshot/iterations/iteration-007.md`, `research/013-audit-snapshot/review-report.md`
- [x] **P013-R008** Audit tests for retirement-violating expectations and stale fixtures. Evidence: `research/013-audit-snapshot/iterations/iteration-007.md`, `research/013-audit-snapshot/review-report.md`
- [x] **P013-R009** Identify the phantom save-side dedup contract and classify its defect family separately from the retirement contradiction. Evidence: `research/013-audit-snapshot/review-report.md`
- [x] **P013-R010** Produce the synthesis report with Path A, Path B, and Path C closure options. Evidence: `research/013-audit-snapshot/review-report.md`
- [x] **P013-R011** Land the retirement closure path reflected in v3.4.1.0. Evidence: `../../../../changelog/01--system-spec-kit/v3.4.1.0.md`

### Audit Finding Families Preserved

- [x] **P013-F001-F007** Preserve the runtime write and read path contradiction. Evidence: `research/013-audit-snapshot/review-report.md`
- [x] **P013-F008-F016** Preserve the document and reference contradiction family. Evidence: `research/013-audit-snapshot/review-report.md`
- [x] **P013-F017-F021** Preserve the phantom dedup-contract family and its closure context. Evidence: `research/013-audit-snapshot/review-report.md`
- [x] **P013-F022-F025** Preserve the defense-in-depth and template-drift tail. Evidence: `research/013-audit-snapshot/review-report.md`
- [x] **P013-F026-F040** Preserve the post-cutover follow-up wave captured in r2 strategy and release alignment. Evidence: `research/013-audit-snapshot/deep-review-strategy.md`, `../../../../changelog/01--system-spec-kit/v3.4.1.0.md`

---

<!-- /ANCHOR:phase-1 -->
<!-- ANCHOR:phase-2 -->
### Relevance Research Tasks

### Research Questions (Q1-Q10)

- [x] **P014-Q1** Resolve which save-flow subsystems are truly load-bearing. Evidence: `research/014-research-snapshot/findings-registry.json`, `research/014-research-snapshot/research.md`
- [x] **P014-Q2** Resolve whether planner-first `/memory:save` can replace default-path automation. Evidence: `research/014-research-snapshot/findings-registry.json`, `research/014-research-snapshot/research.md`
- [x] **P014-Q3** Resolve which quality checks still prevent real defects. Evidence: `research/014-research-snapshot/findings-registry.json`
- [x] **P014-Q4** Resolve whether immediate reindex is a correctness requirement or a freshness concern. Evidence: `research/014-research-snapshot/findings-registry.json`
- [x] **P014-Q5** Resolve whether graph-metadata refresh must stay coupled to every save. Evidence: `research/014-research-snapshot/findings-registry.json`
- [x] **P014-Q6** Resolve whether entity extraction and cross-doc linking still earn save-time cost. Evidence: `research/014-research-snapshot/findings-registry.json`
- [x] **P014-Q7** Resolve whether reconsolidation-on-save remains proportionate. Evidence: `research/014-research-snapshot/findings-registry.json`
- [x] **P014-Q8** Resolve whether the router classifier stack is over-fitted. Evidence: `research/014-research-snapshot/findings-registry.json`
- [x] **P014-Q9** Resolve whether trigger harmonization must stay synchronous. Evidence: `research/014-research-snapshot/findings-registry.json`
- [x] **P014-Q10** Resolve whether continuity validation still matters more than save-flow ownership. Evidence: `research/014-research-snapshot/findings-registry.json`

### Research Iteration Ledger

- [x] **P014-ITER001** Establish the post-retirement wrapper and workflow call graph. Evidence: `research/014-research-snapshot/iterations/iteration-001.md`
- [x] **P014-ITER002** Continue subsystem classification. Evidence: `research/014-research-snapshot/iterations/iteration-002.md`
- [x] **P014-ITER003** Continue subsystem classification. Evidence: `research/014-research-snapshot/iterations/iteration-003.md`
- [x] **P014-ITER004** Continue subsystem classification. Evidence: `research/014-research-snapshot/iterations/iteration-004.md`
- [x] **P014-ITER005** Continue subsystem classification. Evidence: `research/014-research-snapshot/iterations/iteration-005.md`
- [x] **P014-ITER006** Continue subsystem classification. Evidence: `research/014-research-snapshot/iterations/iteration-006.md`
- [x] **P014-ITER007** Continue subsystem classification. Evidence: `research/014-research-snapshot/iterations/iteration-007.md`
- [x] **P014-ITER008** Continue subsystem classification. Evidence: `research/014-research-snapshot/iterations/iteration-008.md`
- [x] **P014-ITER009** Continue subsystem classification. Evidence: `research/014-research-snapshot/iterations/iteration-009.md`
- [x] **P014-ITER010** Continue subsystem classification. Evidence: `research/014-research-snapshot/iterations/iteration-010.md`
- [x] **P014-ITER011** Continue subsystem classification. Evidence: `research/014-research-snapshot/iterations/iteration-011.md`
- [x] **P014-ITER012** Continue subsystem classification. Evidence: `research/014-research-snapshot/iterations/iteration-012.md`
- [x] **P014-ITER013** Continue subsystem classification. Evidence: `research/014-research-snapshot/iterations/iteration-013.md`
- [x] **P014-ITER014** Continue subsystem classification. Evidence: `research/014-research-snapshot/iterations/iteration-014.md`
- [x] **P014-ITER015** Continue subsystem classification. Evidence: `research/014-research-snapshot/iterations/iteration-015.md`
- [x] **P014-ITER016** Continue subsystem classification. Evidence: `research/014-research-snapshot/iterations/iteration-016.md`
- [x] **P014-ITER017** Continue subsystem classification. Evidence: `research/014-research-snapshot/iterations/iteration-017.md`
- [x] **P014-ITER018** Continue subsystem classification. Evidence: `research/014-research-snapshot/iterations/iteration-018.md`
- [x] **P014-ITER019** Final synthesis preparation. Evidence: `research/014-research-snapshot/iterations/iteration-019.md`
- [x] **P014-ITER020** Publish the trim-targeted synthesis report. Evidence: `research/014-research-snapshot/iterations/iteration-020.md`, `research/014-research-snapshot/research.md`

### Research Verdicts

- [x] **P014-V001** Keep the canonical atomic writer intact. Evidence: `research/014-research-snapshot/findings-registry.json`
- [x] **P014-V002** Keep routed record identity intact. Evidence: `research/014-research-snapshot/findings-registry.json`
- [x] **P014-V003** Keep the content-router category contract while trimming classifier scope. Evidence: `research/014-research-snapshot/findings-registry.json`
- [x] **P014-V004** Keep thin continuity validation and upsert logic. Evidence: `research/014-research-snapshot/findings-registry.json`
- [x] **P014-V005** Trim Tier 3 routing from the default path. Evidence: `research/014-research-snapshot/research.md`
- [x] **P014-V006** Trim quality-loop auto-fix from the default path while preserving hard checks. Evidence: `research/014-research-snapshot/research.md`
- [x] **P014-V007** Defer reconsolidation-on-save from the default path. Evidence: `research/014-research-snapshot/research.md`
- [x] **P014-V008** Defer post-insert enrichment from the default path. Evidence: `research/014-research-snapshot/research.md`
- [x] **P014-V009** Move reindex and graph refresh to explicit follow-up work when possible. Evidence: `research/014-research-snapshot/research.md`

---

<!-- /ANCHOR:phase-2 -->
<!-- ANCHOR:phase-3 -->
## Phase 2: Implementation

### Implementation Tasks (43 total)

- [x] **P015-T001** Add planner-default and fallback flag definitions. Evidence: `review/015-deep-review-snapshot/primary-docs/tasks.md`
- [x] **P015-T002** Document planner, fallback, and deferred follow-up flags. Evidence: `review/015-deep-review-snapshot/primary-docs/tasks.md`
- [x] **P015-T003** Add planner response interfaces and follow-up action types. Evidence: `review/015-deep-review-snapshot/primary-docs/tasks.md`
- [x] **P015-T004** Add planner response serialization helpers. Evidence: `review/015-deep-review-snapshot/primary-docs/tasks.md`
- [x] **P015-T005** Add planner blocker and advisory response helpers. Evidence: `review/015-deep-review-snapshot/primary-docs/tasks.md`
- [x] **P015-T006** Make `generate-context.ts` request planner-first behavior by default. Evidence: `review/015-deep-review-snapshot/primary-docs/tasks.md`
- [x] **P015-T007** Update `/memory:save` docs for planner-first default and fallback. Evidence: `review/015-deep-review-snapshot/primary-docs/tasks.md`
- [x] **P015-T008** Make `memory-save.ts` return planner output by default with explicit fallback. Evidence: `review/015-deep-review-snapshot/primary-docs/tasks.md`
- [x] **P015-T009** Update aggregate `memory-save` tests for planner-default behavior. Evidence: `review/015-deep-review-snapshot/primary-docs/tasks.md`
- [x] **P015-T010** Update handler tests for non-mutating default responses and blocker reporting. Evidence: `review/015-deep-review-snapshot/primary-docs/tasks.md`
- [x] **P015-T011** Update CLI target-authority tests for planner-default execution. Evidence: `review/015-deep-review-snapshot/primary-docs/tasks.md`
- [x] **P015-T012** Create focused planner-first regression coverage. Evidence: `review/015-deep-review-snapshot/primary-docs/tasks.md`
- [x] **P015-T013** Trim default Tier 3 participation while preserving category contract. Evidence: `review/015-deep-review-snapshot/primary-docs/tasks.md`
- [x] **P015-T014** Reduce the Tier 2 prototype library to the remaining useful coverage. Evidence: `review/015-deep-review-snapshot/primary-docs/tasks.md`
- [x] **P015-T015** Update content-router tests for deterministic Tier 1 or Tier 2 default behavior. Evidence: `review/015-deep-review-snapshot/primary-docs/tasks.md`
- [x] **P015-T016** Update runtime routing tests so low-confidence cases refuse or warn instead of invoking Tier 3. Evidence: `review/015-deep-review-snapshot/primary-docs/tasks.md`
- [x] **P015-T017** Update intent-routing tests so route overrides stay auditable after the trim. Evidence: `review/015-deep-review-snapshot/primary-docs/tasks.md`
- [x] **P015-T018** Retire default-path auto-fix retries while preserving advisory output. Evidence: `review/015-deep-review-snapshot/primary-docs/tasks.md`
- [x] **P015-T019** Preserve hard structural blockers while downgrading score-heavy quality layers. Evidence: `review/015-deep-review-snapshot/primary-docs/tasks.md`
- [x] **P015-T020** Update quality-loop tests for advisory-default behavior. Evidence: `review/015-deep-review-snapshot/primary-docs/tasks.md`
- [x] **P015-T021** Update save-quality-gate tests for preserved hard blockers. Evidence: `review/015-deep-review-snapshot/primary-docs/tasks.md`
- [x] **P015-T022** Update pipeline-enforcement tests so the planner path still surfaces legality blockers. Evidence: `review/015-deep-review-snapshot/primary-docs/tasks.md`
- [x] **P015-T023** Gate reconsolidation-on-save behind explicit flags or fallback. Evidence: `review/015-deep-review-snapshot/primary-docs/tasks.md`
- [x] **P015-T024** Move default-path enrichment into explicit follow-up behavior. Evidence: `review/015-deep-review-snapshot/primary-docs/tasks.md`
- [x] **P015-T025** Preserve same-path lineage while reducing default PE work. Evidence: `review/015-deep-review-snapshot/primary-docs/tasks.md`
- [x] **P015-T026** Keep chunking as a size-driven fallback instead of a default dependency. Evidence: `review/015-deep-review-snapshot/primary-docs/tasks.md`
- [x] **P015-T027** Move unconditional graph refresh and spec-doc reindex out of planner-default saves. Evidence: `review/015-deep-review-snapshot/primary-docs/tasks.md`
- [x] **P015-T028** Expose explicit follow-up indexing entry points. Evidence: `review/015-deep-review-snapshot/primary-docs/tasks.md`
- [x] **P015-T029** Keep graph refresh callable as an explicit follow-up. Evidence: `review/015-deep-review-snapshot/primary-docs/tasks.md`
- [x] **P015-T030** Update reconsolidation-bridge tests for explicit opt-in behavior. Evidence: `review/015-deep-review-snapshot/primary-docs/tasks.md`
- [x] **P015-T031** Update reconsolidation tests to prove the default path no longer triggers reconsolidation. Evidence: `review/015-deep-review-snapshot/primary-docs/tasks.md`
- [x] **P015-T032** Update assistive-reconsolidation tests so assistive recommendations remain deferred or fallback-only. Evidence: `review/015-deep-review-snapshot/primary-docs/tasks.md`
- [x] **P015-T033** Update chunking tests for size-driven fallback behavior. Evidence: `review/015-deep-review-snapshot/primary-docs/tasks.md`
- [x] **P015-T034** Update graph-refresh tests for explicit follow-up behavior. Evidence: `review/015-deep-review-snapshot/primary-docs/tasks.md`
- [x] **P015-T035** Update memory-save integration tests for planner-default plus fallback end-to-end behavior. Evidence: `review/015-deep-review-snapshot/primary-docs/tasks.md`
- [x] **P015-T036** Update planner UX regression tests for readable, action-oriented output. Evidence: `review/015-deep-review-snapshot/primary-docs/tasks.md`
- [x] **P015-T037** Update thin-continuity tests to prove normalization and upsert parity. Evidence: `review/015-deep-review-snapshot/primary-docs/tasks.md`
- [x] **P015-T038** Prototype planner-first behavior against three real session transcripts. Evidence: `review/015-deep-review-snapshot/primary-docs/tasks.md`, `scratch/transcripts-snapshot/`
- [x] **P015-T039** Run per-file doc validation for the packet docs. Evidence: `review/015-deep-review-snapshot/primary-docs/tasks.md`
- [x] **P015-T040** Run strict packet validation and capture follow-on defects. Evidence: `review/015-deep-review-snapshot/primary-docs/tasks.md`
- [x] **P015-T041** Review structural parity between `/memory:save`, `AGENTS.md`, and the system-spec-kit skill doc. Evidence: `review/015-deep-review-snapshot/primary-docs/tasks.md`
- [x] **P015-T042** Review fallback safety against `atomic-index-memory.ts` and `create-record.ts`. Evidence: `review/015-deep-review-snapshot/primary-docs/tasks.md`
- [x] **P015-T043** Review transcript mismatches and convert unresolved issues into follow-on tasks if needed. Evidence: `review/015-deep-review-snapshot/primary-docs/tasks.md`

### Milestone Roll-Up

- [x] **P015-M1** Planner contract and flag plumbing complete. Evidence: `review/015-deep-review-snapshot/primary-docs/plan.md`, `review/015-deep-review-snapshot/primary-docs/tasks.md`
- [x] **P015-M2** Routing trim complete. Evidence: `review/015-deep-review-snapshot/primary-docs/plan.md`, `review/015-deep-review-snapshot/primary-docs/tasks.md`
- [x] **P015-M3** Quality-loop retirement with hard checks complete. Evidence: `review/015-deep-review-snapshot/primary-docs/plan.md`, `review/015-deep-review-snapshot/primary-docs/tasks.md`
- [x] **P015-M4** Reconsolidation, enrichment, and follow-up API extraction complete. Evidence: `review/015-deep-review-snapshot/primary-docs/plan.md`, `review/015-deep-review-snapshot/primary-docs/tasks.md`
- [x] **P015-M5** Regression sweep, transcript prototypes, and packet closeout complete. Evidence: `review/015-deep-review-snapshot/primary-docs/plan.md`, `review/015-deep-review-snapshot/primary-docs/implementation-summary.md`

---

### Deep-Review Remediation Tasks

- [x] **P015-R001** Resolve the router-preservation contradiction by documenting the scoped `content-router.ts` exception. Evidence: `review/015-deep-review-snapshot/review-report.md`, `review/015-deep-review-snapshot/primary-docs/decision-record.md`
- [x] **P015-R002** Restore full-auto safety parity by reinstating `POST_SAVE_FINGERPRINT`. Evidence: `review/015-deep-review-snapshot/review-report.md`, `review/015-deep-review-snapshot/primary-docs/implementation-summary.md`
- [x] **P015-R003** Promote template-contract failures to planner blockers instead of advisories. Evidence: `review/015-deep-review-snapshot/review-report.md`, `review/015-deep-review-snapshot/primary-docs/implementation-summary.md`
- [x] **P015-R004** Make deferred enrichment skip return explicit deferred status instead of success-shaped status. Evidence: `review/015-deep-review-snapshot/review-report.md`, `review/015-deep-review-snapshot/primary-docs/implementation-summary.md`
- [x] **P015-R005** Mark `hybrid` as reserved and document that it still behaves like `plan-only`. Evidence: `review/015-deep-review-snapshot/review-report.md`, `../../../../changelog/01--system-spec-kit/v3.4.1.0.md`
- [x] **P015-R006** Add follow-up API execution-level coverage. Evidence: `review/015-deep-review-snapshot/review-report.md`, `review/015-deep-review-snapshot/primary-docs/implementation-summary.md`
- [x] **P015-R007** Update packet docs to use the shipped follow-up tool names. Evidence: `review/015-deep-review-snapshot/review-report.md`
- [x] **P015-R008** Update env references so `hybrid` is described honestly. Evidence: `review/015-deep-review-snapshot/review-report.md`
- [x] **P015-R009** Update release notes so router scope and hybrid support are described honestly. Evidence: `review/015-deep-review-snapshot/review-report.md`, `../../../../changelog/01--system-spec-kit/v3.4.1.0.md`

---

## Phase 3: Verification

### Packet Consolidation Work

- [x] **P014-T001** Create the packet directory structure and snapshot folders. Evidence: packet tree
- [x] **P014-T002** Copy audit artifacts into `research/013-audit-snapshot/`. Evidence: packet tree
- [x] **P014-T003** Copy research artifacts into `research/014-research-snapshot/`. Evidence: packet tree
- [x] **P014-T004** Copy deep-review artifacts into `review/015-deep-review-snapshot/`. Evidence: packet tree
- [x] **P014-T005** Copy transcript artifacts into `scratch/transcripts-snapshot/`. Evidence: packet tree
- [x] **P014-T006** Add snapshot headers to every copied Markdown file. Evidence: copied snapshot files
- [x] **P014-T007** Author unified primary docs that tell the full delivery sequence. Evidence: packet primary docs
- [x] **P014-T008** Generate metadata and packet-local changelog. Evidence: `description.json`, `graph-metadata.json`, `changelog/**`
- [x] **P014-T009** Validate packet docs and strict packet compliance. Evidence: validator output

---

<!-- /ANCHOR:phase-3 -->
<!-- ANCHOR:completion -->
## Completion Criteria

- [x] 43 of 43 implementation tasks complete with 0 blocked
- [x] 9 of 9 deep-review findings resolved (3 P0, 5 P1, 1 P2)
- [x] Planner-default runtime tests pass (non-mutating default)
- [x] Full-auto fallback tests pass (atomic mutation + rollback + `POST_SAVE_FINGERPRINT` parity)
- [x] Three real session transcripts prototype planner-first behavior without unexpected drops or wrong-anchor outcomes
- [x] `/memory:save` docs, `ENV_REFERENCE.md`, templates, and v3.4.1.0 release notes align on default/opt-in/reserved/fallback vocabulary
- [x] Packet primary docs pass `validate_document.py`; packet passes `validate.sh --strict`

---

<!-- /ANCHOR:completion -->
<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Decisions**: `decision-record.md`
- **Implementation Summary**: `implementation-summary.md`

### AI Execution Protocol

#### Pre-Task Checklist

- [x] Read audit + research + review artifacts before authoring packet docs
- [x] Keep packet canonical docs grounded in source evidence
- [x] Cite source-packet evidence using the snapshot folders or release notes

#### Execution Rules

| Rule | Description |
|------|-------------|
| TASK-ORDER | Preserve audit → research → implementation → remediation order |
| TASK-EVIDENCE | Use snapshot or sibling packet references that resolve from packet root |
| TASK-SCOPE | Do not claim runtime work that was not actually shipped |

#### Status Reporting Format

Report task state as `P013-R001 [x] - description` or the matching packet-prefixed ID.

#### Blocked Task Protocol

If a packet task is blocked, record the blocker inside this packet and patch the relevant docs or metadata. Source packets remain untouched.
<!-- /ANCHOR:cross-refs -->
