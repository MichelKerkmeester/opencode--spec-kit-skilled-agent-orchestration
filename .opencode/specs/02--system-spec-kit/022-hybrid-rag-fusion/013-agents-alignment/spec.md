---
title: "013 — Agent Alignment: Runtime Lineage Truth Reconciliation"
description: "Reconcile the 013 agents-alignment packet and the last runtime-facing agent-doc drift to the live multi-runtime lineage used by OpenCode, ChatGPT, Claude, Codex, and Gemini."
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# 013 — Agent Alignment: Runtime Lineage Truth Reconciliation

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete (truth-reconciled) |
| **Created** | 2026-03-15 |
| **Updated** | 2026-03-21 |
| **Parent** | `022-hybrid-rag-fusion` |
| **Complexity** | 42/70 |
| **Parent Spec** | ../spec.md |
| **Predecessor** | ../012-command-alignment/spec.md |
| **Successor** | ../014-agents-md-alignment/spec.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The original `013-agents-alignment` packet described a simpler runtime model than the repository now uses. It treated `.opencode/agent/*.md` as a single canonical source copied directly to every runtime, but the live repo has split lineage:

- `.opencode/agent/*.md` is the base markdown family for the default OpenCode or Copilot profile and the closest markdown lineage for Claude and Gemini.
- `.opencode/agent/chatgpt/*.md` is a distinct ChatGPT markdown family.
- `.codex/agents/*.toml` is generated from the ChatGPT family, not from the base markdown family.
- `.gemini/agents/*.md` is the runtime-facing Gemini path, while `.gemini -> .agents` exposes the backing storage at `.agents/agents/*.md`.

The older packet also carried stale naming (research.md), a bulk-runtime-sync story that no longer matches the state of the repo, and it did not account for the remaining runtime-facing drift in `.gemini/workflows/delegate_agent.md` and the write-agent projections.

---

## Phase Navigation

| Field | Value |
|-------|-------|
| **Parent Spec** | ../spec.md |
| **Previous Phase** | ../012-command-alignment/spec.md |
| **Next Phase** | ../014-agents-md-alignment/spec.md |

### Purpose

Reconcile the `013` packet so it accurately documents the current runtime lineage, path conventions, and naming rules, while also closing the last runtime-facing agent-doc drift without claiming a full bulk sync.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Rewrite the canonical `013` packet to reflect the live runtime lineage.
- Document the two markdown source families and their downstream runtime targets.
- Record Codex generation from the ChatGPT family.
- Document Gemini's runtime-facing path together with the `.gemini -> .agents` storage detail.
- Normalize the packet on deep-research.md naming.
- Fix the remaining runtime-facing path and writer-surface drift in the scoped Gemini, Claude, ChatGPT, and Codex docs.

### Out of Scope

- Bulk-resynchronizing every runtime agent body
- Rewriting unrelated agent personas outside the scoped delegation/write surfaces
- MCP server, command, or skill changes
- Re-running historical bulk sync work

### Deliverables

| Deliverable | Description |
|-------------|-------------|
| `spec.md` | Reframed around the live lineage model |
| `plan.md` | Documents the reconciliation approach and verification |
| `tasks.md` | Records the audit, rewrite, and verification work |
| `checklist.md` | Verifies lineage, naming, path, and scope integrity |
| `implementation-summary.md` | Summarizes the truth-reconciled packet and verification |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Priority | Requirement |
|----|----------|-------------|
| AA-001 | P0 | The packet must describe **two source families**, not one |
| AA-002 | P0 | The packet must document `.opencode/agent/*.md` as the base markdown family for OpenCode/Copilot and the closest markdown lineage for Claude/Gemini |
| AA-003 | P0 | The packet must document `.opencode/agent/chatgpt/*.md` as the ChatGPT family that feeds `.codex/agents/*.toml` |
| AA-004 | P0 | The packet must use deep-research.md naming consistently |
| AA-005 | P0 | The packet must document `.gemini/agents/*.md` as the runtime-facing path and `.gemini -> .agents` as the storage detail |
| AA-006 | P1 | The packet must normalize runtime path-convention guidance |
| AA-007 | P1 | The packet must distinguish scoped runtime-doc closeout from bulk runtime sync work |
| AA-008 | P1 | The packet must verify the 9-file family counts across base, ChatGPT, Claude, Codex, and Gemini runtimes |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The packet consistently models dual-source lineage rather than a single canonical copy model.
- **SC-002**: The packet uses deep-research.md naming throughout its active docs.
- **SC-003**: Codex lineage from ChatGPT markdown is explicit.
- **SC-004**: Gemini runtime-facing and storage-facing paths are both documented without ambiguity.
- **SC-005**: The packet avoids claiming bulk runtime sync work while accurately recording the scoped runtime-doc closeout performed in this pass.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Old sync language survives in one canonical file | Mixed lineage story | Grep the full packet for stale naming and copy-model language |
| Risk | Gemini path wording stays ambiguous | Runtime docs remain confusing | Always pair `.gemini/agents/*.md` with the `.gemini -> .agents` storage note |
| Dependency | Live runtime directories | Needed to confirm counts and path conventions | Verify file counts across base, ChatGPT, Claude, Codex, and Gemini |
| Dependency | Current agent docs | Needed to confirm path-convention drift | Spot-check live runtime-facing docs before closing |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- This packet is a truth-reconciliation pass, not a runtime synchronization pass.
- Path conventions should be documented from the runtime reader's perspective first.
- Runtime lineage should be described in terms of families and downstream targets rather than one flat "canonical copy" story.
<!-- /ANCHOR:questions -->

---
