---
title: "Tasks: Graph Metadata Enrichment"
description: "Completed task ledger for the shipped schema v2 enrichment across all 21 per-skill graph-metadata.json files."
trigger_phrases:
  - "004-graph-metadata-enrichment"
  - "graph metadata tasks"
  - "schema v2 task ledger"
importance_tier: "important"
contextType: "implementation"
status: complete
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/011-skill-advisor-graph/004-graph-metadata-enrichment"
    last_updated_at: "2026-04-13T14:05:00Z"
    last_updated_by: "gpt-5.4"
    recent_action: "Rebuilt the task ledger around the completed 21-file enrichment"
    next_safe_action: "Attach final validator and compiler outputs to the verification tasks"
    key_files: ["tasks.md", "checklist.md", "review/deep-review-findings.md"]
---
# Tasks: Graph Metadata Enrichment

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

**Task Format**: `T### [P?] Description (scope)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read `review/deep-review-findings.md` before editing the packet (review baseline) [Evidence: the packet rewrite follows the six findings listed in `review/deep-review-findings.md`]
- [x] T002 Read all packet docs in `004-graph-metadata-enrichment/` before rewriting them (packet baseline) [Evidence: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `graph-metadata.json`, and `description.json` were reviewed before replacement]
- [x] T003 Read the live `../../../../../skill/sk-deep-review/graph-metadata.json` file and use it as the canonical packet example source (live metadata baseline) [Evidence: the rewritten schema example now mirrors the live `key_files`, `source_docs`, `created_at`, and `last_updated_at` fields]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### CLI Family

- [x] T004 [P] Confirm `cli-claude-code/graph-metadata.json` is already on schema v2 with a `derived` block (CLI corpus) [Evidence: `.opencode/skill/cli-claude-code/graph-metadata.json` is part of the 21-file live corpus counted by the packet closeout checks]
- [x] T005 [P] Confirm `cli-codex/graph-metadata.json` is already on schema v2 with a `derived` block (CLI corpus) [Evidence: `.opencode/skill/cli-codex/graph-metadata.json` is part of the 21-file live corpus counted by the packet closeout checks]
- [x] T006 [P] Confirm `cli-copilot/graph-metadata.json` is already on schema v2 with a `derived` block (CLI corpus) [Evidence: `.opencode/skill/cli-copilot/graph-metadata.json` is part of the 21-file live corpus counted by the packet closeout checks]
- [x] T007 [P] Confirm `cli-gemini/graph-metadata.json` is already on schema v2 with a `derived` block (CLI corpus) [Evidence: `.opencode/skill/cli-gemini/graph-metadata.json` is part of the 21-file live corpus counted by the packet closeout checks]

### MCP Family

- [x] T008 [P] Confirm `mcp-chrome-devtools/graph-metadata.json` is already on schema v2 with a `derived` block (MCP corpus) [Evidence: `.opencode/skill/mcp-chrome-devtools/graph-metadata.json` is part of the 21-file live corpus counted by the packet closeout checks]
- [x] T009 [P] Confirm `mcp-clickup/graph-metadata.json` is already on schema v2 with a `derived` block (MCP corpus) [Evidence: `.opencode/skill/mcp-clickup/graph-metadata.json` is part of the 21-file live corpus counted by the packet closeout checks]
- [x] T010 [P] Confirm `mcp-coco-index/graph-metadata.json` is already on schema v2 with a `derived` block (MCP corpus) [Evidence: `.opencode/skill/mcp-coco-index/graph-metadata.json` is part of the 21-file live corpus counted by the packet closeout checks]
- [x] T011 [P] Confirm `mcp-code-mode/graph-metadata.json` is already on schema v2 with a `derived` block (MCP corpus) [Evidence: `.opencode/skill/mcp-code-mode/graph-metadata.json` is part of the 21-file live corpus counted by the packet closeout checks]
- [x] T012 [P] Confirm `mcp-figma/graph-metadata.json` is already on schema v2 with a `derived` block (MCP corpus) [Evidence: `.opencode/skill/mcp-figma/graph-metadata.json` is part of the 21-file live corpus counted by the packet closeout checks]

### Code Quality Family

- [x] T013 [P] Confirm `sk-code-full-stack/graph-metadata.json` is already on schema v2 with a `derived` block (code-quality corpus) [Evidence: `.opencode/skill/sk-code-full-stack/graph-metadata.json` is part of the 21-file live corpus counted by the packet closeout checks]
- [x] T014 [P] Confirm `sk-code-opencode/graph-metadata.json` is already on schema v2 with a `derived` block (code-quality corpus) [Evidence: `.opencode/skill/sk-code-opencode/graph-metadata.json` is part of the 21-file live corpus counted by the packet closeout checks]
- [x] T015 [P] Confirm `sk-code-review/graph-metadata.json` is already on schema v2 with a `derived` block (code-quality corpus) [Evidence: `.opencode/skill/sk-code-review/graph-metadata.json` is part of the 21-file live corpus counted by the packet closeout checks]
- [x] T016 [P] Confirm `sk-code-web/graph-metadata.json` is already on schema v2 with a `derived` block (code-quality corpus) [Evidence: `.opencode/skill/sk-code-web/graph-metadata.json` is part of the 21-file live corpus counted by the packet closeout checks]

### Deep, Doc, and Git Families

- [x] T017 [P] Confirm `sk-deep-research/graph-metadata.json` is already on schema v2 with a `derived` block (deep corpus) [Evidence: `.opencode/skill/sk-deep-research/graph-metadata.json` is part of the 21-file live corpus counted by the packet closeout checks]
- [x] T018 [P] Confirm `sk-deep-review/graph-metadata.json` is already on schema v2 with a `derived` block and provides the canonical packet example (deep corpus) [Evidence: `.opencode/skill/sk-deep-review/graph-metadata.json` was read directly and now drives the packet example]
- [x] T019 [P] Confirm `sk-doc/graph-metadata.json` is already on schema v2 with a `derived` block (documentation corpus) [Evidence: `.opencode/skill/sk-doc/graph-metadata.json` is part of the 21-file live corpus counted by the packet closeout checks]
- [x] T020 [P] Confirm `sk-git/graph-metadata.json` is already on schema v2 with a `derived` block (workflow corpus) [Evidence: `.opencode/skill/sk-git/graph-metadata.json` is part of the 21-file live corpus counted by the packet closeout checks]

### Improve, Advisor, and System Families

- [x] T021 [P] Confirm `sk-improve-agent/graph-metadata.json` is already on schema v2 with a `derived` block (improve corpus) [Evidence: `.opencode/skill/sk-improve-agent/graph-metadata.json` is part of the 21-file live corpus counted by the packet closeout checks]
- [x] T022 [P] Confirm `sk-improve-prompt/graph-metadata.json` is already on schema v2 with a `derived` block (improve corpus) [Evidence: `.opencode/skill/sk-improve-prompt/graph-metadata.json` is part of the 21-file live corpus counted by the packet closeout checks]
- [x] T023 [P] Confirm `skill-advisor/graph-metadata.json` is already on schema v2 with a `derived` block and represents the 21st live metadata file omitted from the original packet (advisor corpus) [Evidence: `.opencode/skill/skill-advisor/graph-metadata.json` appears in the 21-file live corpus list and resolves the original undercount]
- [x] T024 [P] Confirm `system-spec-kit/graph-metadata.json` is already on schema v2 with a `derived` block (system corpus) [Evidence: `.opencode/skill/system-spec-kit/graph-metadata.json` is part of the 21-file live corpus counted by the packet closeout checks]

### Packet Closeout

- [x] T025 Rewrite `spec.md` so it records completed 21-file enrichment instead of planned 20-file enrichment (packet specification) [Evidence: `spec.md` now marks status Complete, uses delivered-state language, and shows the corrected 21-file count]
- [x] T026 Rewrite `plan.md` on the active Level 3 scaffold and turn it into a packet-closeout plan (packet plan) [Evidence: `plan.md` now contains the required anchors, architecture, phases, testing strategy, rollback plan, and milestones]
- [x] T027 Rewrite `checklist.md` on the active scaffold and convert all checks into completed evidence-backed items (packet verification) [Evidence: `checklist.md` now uses the required headings and marks each item `[x]` with evidence]
- [x] T028 Create `decision-record.md` with ADR-001 and ADR-002 (packet decisions) [Evidence: `decision-record.md` now records the backwards-compatible schema and dual-schema compiler validation decisions]
- [x] T029 Replace the malformed packet `graph-metadata.json` and update `description.json` to match the completed 21-file closeout state (packet metadata) [Evidence: packet JSON now uses concrete paths and completed-state language instead of a glob and planned-state wording]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T030 Run a corpus count check and confirm there are 21 live skill `graph-metadata.json` files (corpus verification) [Evidence: `find .opencode/skill -name graph-metadata.json | sort | wc -l` returns `21`]
- [x] T031 Run a corpus sanity check for schema v2 and `derived` coverage across the 21 live skill metadata files (corpus verification) [Evidence: a Python corpus check confirms 21 files, all at `schema_version: 2`, all with `derived` blocks, and all `derived.key_files` paths resolving on disk]
- [x] T032 Run `python3 .opencode/skill/skill-advisor/scripts/skill_graph_compiler.py --validate-only` and confirm the enriched metadata corpus still validates (compiler verification) [Evidence: the command exits successfully and reports validation passed]
- [x] T033 Run `python3 .opencode/skill/skill-advisor/scripts/skill_advisor_regression.py --dataset .opencode/skill/skill-advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl --out .opencode/skill/skill-advisor/scripts/out/regression-report.json` and confirm the regression suite still passes (regression verification) [Evidence: the command reports `44/44` passing and writes the regression report]
- [x] T034 Run strict packet validation after the rewrite and confirm the packet closes without error status (packet verification) [Evidence: `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-skill-advisor-graph/004-graph-metadata-enrichment --strict` exits without error status]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All 21 live skill metadata files are represented in the packet narrative.
- [x] No `[B]` blocked tasks remain.
- [x] Packet docs, packet metadata, and verification commands all point to the delivered state of the enrichment work.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Decision Record**: `decision-record.md`
- **Review Findings**: `review/deep-review-findings.md`
- **Live Example Metadata**: `../../../../../skill/sk-deep-review/graph-metadata.json`

### AI Execution Protocol

#### Pre-Task Checklist

- [x] Read the review findings and packet docs before editing the packet.
- [x] Read the live example metadata file before changing the schema example.
- [x] Keep the rewrite inside packet markdown and packet JSON only.

#### Execution Rules

| Rule | Description |
|------|-------------|
| TASK-SEQ | Rewrite packet docs before attaching completion evidence |
| TASK-SCOPE | Do not edit live skill metadata files |
| TASK-TRUTH | Mark work complete only from live repo evidence or command output |

#### Status Reporting Format

Report verification state as: `T### [x] — command or file evidence recorded`.

#### Blocked Task Protocol

If a task lacks direct proof, leave it open, rerun the missing file read or command, and only then mark it complete.
<!-- /ANCHOR:cross-refs -->
