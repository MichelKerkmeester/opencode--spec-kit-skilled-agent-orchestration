---
title: "013 — Agent Alignment: Runtime Lineage Truth [02--system-spec-kit/022-hybrid-rag-fusion/013-agents-alignment/spec]"
description: "Reconcile the 013 agents-alignment packet and remaining runtime-facing agent-doc drift to the live multi-runtime lineage used by OpenCode, ChatGPT, Claude, Codex, and Gemini."
trigger_phrases:
  - "013"
  - "agent"
  - "alignment"
  - "runtime"
  - "lineage"
  - "spec"
  - "agents"
importance_tier: "important"
contextType: "decision"
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
| **Status** | Complete (lineage truth-reconciled + content aligned + reality-verified) |
| **Created** | 2026-03-15 |
| **Updated** | 2026-03-25 |
| **Parent** | `022-hybrid-rag-fusion` |
| **Complexity** | 48/70 (re-justified after Pass 2 scope expansion: 50-file review + 15-file remediation across 5 runtimes; Level 2 remains appropriate as this is documentation reconciliation, not architectural change) |
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

The older packet also carried stale naming (the older `research` filename convention), a bulk-runtime-sync story that no longer matches the state of the repo, and it did not account for the runtime-facing drift in `.gemini/workflows/delegate_agent.md` plus partially reconciled write-agent projection guidance.

---

### Phase Navigation

| Field | Value |
|-------|-------|
| **Parent Spec** | ../spec.md |
| **Parent Plan** | ../plan.md |
| **Previous Phase** | ../012-command-alignment/spec.md |
| **Next Phase** | ../014-agents-md-alignment/spec.md |

### Purpose

Reconcile the `013` packet so it accurately documents the current runtime lineage, path conventions, and naming rules, while documenting write-agent routing closeout as partial rather than fully complete and avoiding any bulk-sync claim.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

**Pass 1 — Lineage Truth Reconciliation (completed 2026-03-21):**
- Rewrite the canonical `013` packet to reflect the live runtime lineage.
- Document the two markdown source families and their downstream runtime targets.
- Record Codex generation from the ChatGPT family.
- Document Gemini's runtime-facing path together with the `.gemini -> .agents` storage detail.
- Normalize the packet on `deep-research` naming.
- Reconcile runtime-facing path drift in the scoped Gemini, Claude, ChatGPT, and Codex docs.

**Pass 2 — Content Alignment Remediation (completed 2026-03-25):**
- Deep review of all 10 agent definitions across 5 runtimes (50 files) for content alignment with 022-hybrid-rag-fusion changes.
- Remove stale @explore references from orchestrate LEAF lists and NDP examples.
- Add @deep-review to orchestrate LEAF lists (existed but was missing from dispatch).
- Fix dead `sk-code` path → `sk-code--review` in orchestrate resource tables.
- Align the live memory routing surface in orchestrate suggestion and resource tables, including `/memory:search` and `/memory:manage shared`.
- Add `/memory:manage shared` to speckit command tables.
- Fix stale `/memory:learn` label in codex speckit.
- Port canonical claim-adjudication packet and review JSONL schema into all 5 deep-review agents.

### Out of Scope

- Bulk-resynchronizing every runtime agent body beyond the targeted remediations
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

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The packet must describe two source families, not one (legacy `AA-001`) | The active docs distinguish the base markdown family from the ChatGPT family |
| REQ-002 | The packet must document `.opencode/agent/*.md` as the base markdown family for OpenCode/Copilot and the closest markdown lineage for Claude/Gemini (legacy `AA-002`) | The packet names the base family and its downstream relationship explicitly |
| REQ-003 | The packet must document `.opencode/agent/chatgpt/*.md` as the ChatGPT family that feeds `.codex/agents/*.toml` (legacy `AA-003`) | Codex lineage is described as generated from the ChatGPT family |
| REQ-004 | The packet must use `deep-research` naming consistently (legacy `AA-004`) | No active packet docs rely on the older `research` naming for this scope |
| REQ-005 | The packet must document `.gemini/agents/*.md` as the runtime-facing path and `.gemini -> .agents` as the storage detail (legacy `AA-005`) | Gemini runtime-facing and storage-facing paths are both described without ambiguity |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | The packet must normalize runtime path-convention guidance (legacy `AA-006`) | Runtime-facing paths are described first, with storage details called out separately where needed |
| REQ-007 | The packet must distinguish scoped runtime-doc closeout from bulk runtime sync work (legacy `AA-007`) | The packet records the scoped Gemini/write-agent closeout without claiming a global runtime resync |
| REQ-008 | The packet must verify the 10-file family counts across base, ChatGPT, Claude, Codex, and Gemini runtimes (legacy `AA-008`) | The packet retains the verified file-family count evidence used in the reconciliation pass |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The packet consistently models dual-source lineage rather than a single canonical copy model.
- **SC-002**: The packet uses `deep-research` naming throughout its active docs.
- **SC-003**: Codex lineage from ChatGPT markdown is explicit.
- **SC-004**: Gemini runtime-facing and storage-facing paths are both documented without ambiguity.
- **SC-005**: The packet avoids claiming bulk runtime sync work and clearly labels write-agent routing as partially reconciled where evidence is incomplete.

### Acceptance Scenarios

**Given** the packet is read as the source of truth for runtime lineage, **when** a reviewer compares the described families, **then** they see separate base and ChatGPT authoring families rather than one flat canonical-copy model.

**Given** a reviewer checks Codex lineage, **when** they read the packet, **then** `.codex/agents/*.toml` is described as downstream of `.opencode/agent/chatgpt/*.md`.

**Given** a reviewer checks Gemini path guidance, **when** they read the packet, **then** `.gemini/agents/*.md` is presented as the runtime-facing path and `.gemini -> .agents` is presented as the storage detail.

**Given** a reviewer checks the scope notes, **when** they read the packet, **then** the write-agent routing work is described as scoped closeout rather than a full runtime sync claim.
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
