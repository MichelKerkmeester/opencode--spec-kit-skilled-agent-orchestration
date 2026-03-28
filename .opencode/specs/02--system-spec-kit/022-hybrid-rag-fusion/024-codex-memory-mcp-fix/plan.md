---
title: "Implementation Plan: Codex Memory MCP Fix"
description: "This plan creates a focused Level 3 packet that backfills the landed Codex startup remediation and turns the remaining broader cleanup into an explicit execution backlog."
trigger_phrases:
  - "codex memory mcp fix plan"
  - "startup remediation packet plan"
  - "broader remediation backlog plan"
  - "spec_kit_memory codex follow-on"
importance_tier: "important"
contextType: "implementation"
---
# Implementation Plan: Codex Memory MCP Fix

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, JSON, TypeScript, JSON/TOML launcher configs |
| **Framework** | Spec-kit packet workflow plus Node-based MCP server |
| **Storage** | SQLite (`context-index.sqlite`) and packet-local spec docs |
| **Testing** | Packet validation plus previously verified build, Vitest, full core suite, and startup smoke evidence |

### Overview

This turn does not land new runtime code. It creates a new Level 3 packet that retroactively documents the already-landed Codex `spec_kit_memory` startup remediation, records the caveat fix that followed it, and sets up a broader backlog so future runtime or docs work can resume from a clean scope boundary instead of extending `020-pre-release-remediation`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement is clear: Codex startup failure and broader remediation ambiguity are both defined.
- [x] Success criteria are measurable: packet exists, validates, and carries concrete next tasks.
- [x] Dependencies are identified: `020` review artifacts, launcher configs, startup logger behavior, and caveat-fix surfaces.

### Definition of Done
- [x] New `024` packet scaffold created under `022-hybrid-rag-fusion`.
- [x] Spec, plan, tasks, checklist, decision record, summary, README, and `description.json` are populated with live context.
- [ ] Future runtime backlog items are executed and re-verified in a later wave.
<!-- /ANCHOR:quality-gates -->

---

### AI Execution Protocol

### Pre-Task Checklist

- Confirm the edit stays inside `024-codex-memory-mcp-fix` packet creation or its explicitly listed backlog.
- Re-read `../020-pre-release-remediation/review/review-report.md` before claiming any broader status change.
- Keep packet wording tied to current validation or already-recorded remediation evidence.
- Re-run packet-local validation after structural edits.

### Execution Rules

| Rule ID | Rule | Why |
|---------|------|-----|
| AI-SCOPE-001 | Keep this packet focused on the Codex MCP slice and its next backlog | Prevents `024` from quietly absorbing the whole `020` program |
| AI-TRUTH-001 | Distinguish landed narrow fixes from the still-open broader remediation program | Prevents false release-readiness signals |
| AI-EVID-001 | Only mark packet checks complete when packet validation or current-session evidence exists | Keeps checklist state auditable |
| AI-HANDOFF-001 | Push future runtime work into explicit tasks instead of vague notes | Makes the next implementation wave immediately actionable |

### Status Reporting Format

- Start state: which packet surfaces are being edited and which broader backlog items are being carried forward.
- Work state: which spec docs changed and whether validator issues remain.
- End state: validator result, metadata checks, and any still-open warnings or follow-up tasks.

### Blocked Task Protocol

1. If packet prose starts to contradict `../020-pre-release-remediation/review/review-report.md`, stop and preserve the broader canonical review truth.
2. If template validation fails, fix anchors and section headers before making more content changes.
3. If future runtime scope outgrows focused Codex MCP remediation, record the boundary and open a new numbered packet instead of overloading `024`.

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Focused remediation packet with retroactive evidence capture and forward-looking backlog control.

### Key Components
- **Retroactive Evidence Layer**: Documents the landed writable DB-path fix, stderr-only logging fix, and caveat-fix surfaces.
- **Backlog Mapping Layer**: Pulls the relevant broader unresolved work out of `020` and expresses it as concrete to-do tasks.
- **Packet Identity Layer**: Adds `description.json`, README context, and cross-references so resume flows can find this packet directly.

### Data Flow

```
current remediation evidence
    -> packet creation in 024
    -> packet-local validation
    -> future resume from tasks/checklist
    -> later runtime and docs execution waves
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Retrospective Evidence Capture
- [x] Confirm the landed Codex startup remediation and the follow-up caveat fix surfaces.
- [x] Read `020-pre-release-remediation` to identify which broader items still matter for this focused packet.
- [x] Decide to create a new numbered packet instead of expanding `020`.

### Phase 2: Packet Authoring
- [x] Create `024-codex-memory-mcp-fix` from the Level 3 scaffold.
- [x] Replace template placeholders with packet-specific content.
- [x] Add `description.json` for packet identity and indexing.

### Phase 3: Packet Verification And Handoff
- [ ] Validate the packet locally and fix any anchor/template drift.
- [ ] Leave future runtime, docs, and release-control work queued as explicit tasks.
- [ ] Save memory and handoff context after a later implementation wave, not during this packet-creation turn.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Packet validation | Ensure the new Level 3 packet is template-compliant | `.opencode/skill/system-spec-kit/scripts/spec/validate.sh --no-recursive` |
| Runtime reference check | Preserve earlier evidence for build, targeted Vitest, full `test:core`, and startup smoke | Existing current-session verification results |
| Future runtime verification | Re-run targeted suites and smoke checks when backlog items land | `npm run build`, `npx vitest`, `npm run test:core`, manual startup smoke |
| Metadata validation | Confirm `description.json` parses and matches packet slug | `jq empty` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `../020-pre-release-remediation/review/review-report.md` | Internal | Green | Without it, backlog mapping could drift from the canonical broader review |
| Codex and sibling launcher config surfaces | Internal | Green | Future parity work cannot be scoped honestly |
| Existing runtime evidence from the current remediation session | Internal | Green | Packet would lose the factual basis for its retroactive claims |
| Spec-kit validator | Internal | Green | Packet cannot be closed as usable if validation fails |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The new packet misstates scope, contradicts `020`, or fails local validation.
- **Procedure**: Revert the `024-codex-memory-mcp-fix` folder changes and recreate the packet with corrected content. If a future runtime wave lands bad Codex MCP changes, revert those runtime files separately and keep this packet as historical planning evidence.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (evidence capture) -> Phase 2 (packet authoring) -> Phase 3 (validation and handoff)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Evidence capture | Current session context and `020` review artifacts | Packet authoring |
| Packet authoring | Evidence capture | Validation and handoff |
| Validation and handoff | Packet authoring | Future runtime execution waves |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Evidence capture | Medium | 20-30 minutes |
| Packet authoring | Medium | 30-45 minutes |
| Validation and handoff | Low | 10-20 minutes |
| **Total** | | **60-95 minutes** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Packet scope stays limited to retroactive documentation and backlog control.
- [x] No new runtime code is bundled into this turn.
- [ ] Future runtime waves must capture fresh evidence before they mark backlog items complete.

### Rollback Procedure
1. Remove or revert the `024-codex-memory-mcp-fix` packet if its scope is wrong.
2. Recreate the packet from the Level 3 scaffold if anchors or template rules were broken.
3. Keep any previously landed runtime fixes untouched unless the runtime evidence itself is invalidated.
4. Refresh packet-local validation after any corrective edit.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: Revert only packet-local markdown and JSON metadata files.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
020 canonical review
      |
      v
024 packet scope -> tasks/checklist -> future runtime/docs wave
      |
      v
packet validation
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Packet scope definition | `020` review artifacts and current session evidence | Accurate narrative | Backlog mapping, ADR |
| Packet docs | Scope definition | Resume-ready packet | Validation |
| Validation | Packet docs | Usable Level 3 packet | Future implementation wave |
| Future runtime wave | Packet docs and backlog | New runtime evidence | Completion claims |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Review current remediation evidence and `020` backlog** - 20 minutes - CRITICAL
2. **Author packet-local docs with real content** - 30 minutes - CRITICAL
3. **Validate packet and correct template drift** - 15 minutes - CRITICAL

**Total Critical Path**: 65 minutes

**Parallel Opportunities**:
- README and `description.json` can be finalized while packet body content is being refined.
- Future runtime backlog items can be split into runtime, docs, and release-control waves after this packet is validated.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Packet scaffold created | `024` exists with Level 3 files | Completed in this turn |
| M2 | Packet content backfilled | All placeholders removed and backlog captured | Completed in this turn |
| M3 | Packet validated | `validate.sh --no-recursive` passes | Completed in this turn |
| M4 | Future runtime wave starts | One or more pending backlog items begin implementation with fresh evidence | Later remediation session |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Open a focused Codex remediation packet instead of expanding `020`

**Status**: Accepted

**Context**: The Codex startup fix and its follow-up caveat fix were real and already verified, but the broader `020` packet intentionally kept an overall open verdict.

**Decision**: Create `024-codex-memory-mcp-fix` to own the retroactive Codex MCP slice and the next backlog for related broader cleanup.

**Consequences**:
- We gain a precise resume point for Codex-focused work.
- We keep `020` as the broader remediation source of truth.

**Alternatives Rejected**:
- Extend `020` further: rejected because it keeps the Codex slice buried inside a packet that intentionally remains broader and incomplete.

---
