---
title: "...-spec-kit/z_future/agentic-system-upgrade/001-research-agentic-systems/005-intellegix-code-agent-toolkit-master/spec]"
description: "Research packet for a 30-iteration study of the bundled Intellegix Code Agent Toolkit repository, focused on adoption guidance, refactor decisions, and Phase 3 UX, agent-system, command, and skill analysis for system-spec-kit."
trigger_phrases:
  - "005 intellegix research spec"
  - "intellegix code agent toolkit phase spec"
  - "agentic systems phase 005 spec"
importance_tier: "important"
contextType: "implementation"
---
# Feature Specification: 005-intellegix-code-agent-toolkit-master Research Phase

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Completed |
| **Created** | 2026-04-10 |
| **Phase Folder** | `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/005-intellegix-code-agent-toolkit-master/` |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`system-spec-kit` needs an evidence-backed understanding of how the bundled Intellegix Code Agent Toolkit compares to the current local command, skill, hook, memory, and orchestration surfaces. Without a dedicated research packet, proposed changes to lifecycle commands, spec-folder UX, gate machinery, sub-agent routing, and skills would remain speculative.

### Purpose

Produce a complete 30-iteration research packet that:
- preserves the original Phase 1 and Phase 2 findings,
- adds Phase 3 UX, command, agent, and skill analysis,
- updates the merged synthesis and dashboard,
- and closes with a strictly valid packet.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- `phase-research-prompt.md`
- the bundled external repository under `external/`
- iteration artifacts under `research/iterations/`
- the append-only state log in `research/deep-research-state.jsonl`
- the merged synthesis in `research/research.md`
- the dashboard in `research/deep-research-dashboard.md`
- this packet's baseline phase docs and closeout summary

### Out of Scope

- editing anything under `external/`
- runtime code, commands, agents, or skills outside this phase folder
- commits, releases, or cross-phase implementation work
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Add iterations 021-030 | Ten new iteration files exist with the required UX/System Design Analysis section |
| REQ-002 | Append Phase 3 state records | `research/deep-research-state.jsonl` contains phase `3` rows for iterations 021-030 |
| REQ-003 | Update merged synthesis and dashboard | `research/research.md` and `research/deep-research-dashboard.md` reflect all 30 iterations |
| REQ-004 | Keep writes inside the phase folder | No edits outside this phase packet are required |
| REQ-005 | Preserve read-only treatment of `external/` | No files under `external/` are modified |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- `SC-001`: All ten Phase 3 iteration files exist and are source-backed.
- `SC-002`: The state log, dashboard, and synthesis agree on totals and verdict counts.
- `SC-003`: The packet passes `validate.sh --strict`.
- `SC-004`: The final synthesis clearly distinguishes what to merge, simplify, redesign, add, keep, and reject.

### Acceptance Scenarios

- **Given** the packet is complete, **when** a maintainer opens `research/research.md`, **then** they can immediately see the combined totals and the highest-priority follow-on work.
- **Given** the packet is complete, **when** a maintainer opens `research/deep-research-dashboard.md`, **then** they can reconcile the dashboard rows with the JSONL state log and the Phase 3 verdict counts.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `phase-research-prompt.md` | Wrong framing would skew the research output | Re-read the prompt and patch broken references in-place |
| Dependency | Bundled `external/` checkout | Missing sources would reduce evidence quality | Use direct file reads and exact searches when semantic search is unavailable |
| Risk | Totals drift between iteration files, JSONL, and summaries | Report becomes internally inconsistent | Treat iteration artifacts plus JSONL as source of truth and regenerate summaries |
| Risk | Packet validation failures mask research completion | The phase cannot close cleanly | Repair packet-local docs and rerun strict validation |
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which follow-on packet should own the operator-shell redesign first?
- Should named work profiles replace Level 1/2/3+ language globally or only in the primary operator surface?
- How much backward compatibility should remain for the current slash-command split once a merged lifecycle surface exists?
<!-- /ANCHOR:questions -->
