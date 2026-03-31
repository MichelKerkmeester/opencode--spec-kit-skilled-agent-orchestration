---
title: "Implementation Plan: Codex Memory MCP Fix [02--system-spec-kit/022-hybrid-rag-fusion/024-codex-memory-mcp-fix/plan]"
description: "This plan updates the focused Level 3 packet so it truthfully captures the landed Codex startup remediation, the in-session DB-isolation fix, and the remaining broader cleanup as explicit follow-on recommendations."
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
| **Testing** | Packet validation plus focused Vitest, full core suite, and alignment verification evidence from this session |

### Overview

This packet update truth-syncs a focused Level 3 remediation slice after the session landed new runtime code in `vector-index-store.ts` and its regression test. The packet now records the already-landed Codex startup remediation, the newly landed DB-isolation fix for `initializeDb(':memory:')` and custom-path flows, the caveat fix that followed it, and the broader follow-on recommendations so future runtime or docs work can resume from a clean scope boundary instead of extending `020-pre-release-remediation`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement is clear: Codex startup failure and broader remediation ambiguity are both defined.
- [x] Success criteria are measurable: packet exists, validates, and carries concrete next-wave recommendations.
- [x] Dependencies are identified: `020` review artifacts, launcher configs, startup logger behavior, and caveat-fix surfaces.

### Definition of Done
- [x] New `024` packet scaffold created under `022-hybrid-rag-fusion`.
- [x] Spec, plan, tasks, checklist, decision record, summary, README, and `description.json` are populated with live context.
- [x] Landed runtime work and still-open broader follow-ons are described separately and truthfully.
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
| AI-SCOPE-001 | Keep this packet focused on the Codex MCP slice and its recorded next-wave recommendations | Prevents `024` from quietly absorbing the whole `020` program |
| AI-TRUTH-001 | Distinguish landed narrow fixes from the still-open broader remediation program | Prevents false release-readiness signals |
| AI-EVID-001 | Only mark packet checks complete when packet validation or current-session evidence exists | Keeps checklist state auditable |
| AI-HANDOFF-001 | Push future runtime work into explicit follow-on recommendations instead of vague notes | Makes the next implementation wave immediately actionable |

### Status Reporting Format

- Start state: which packet surfaces are being edited and which broader follow-on items are being carried forward.
- Work state: which spec docs changed and whether validator issues remain.
- End state: validator result, metadata checks, and any later-wave follow-on recommendations that remain outside packet completion.

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
- **Retroactive Evidence Layer**: Documents the landed writable DB-path fix, stderr-only logging fix, DB-isolation fix, and caveat-fix surfaces.
- **Backlog Mapping Layer**: Pulls the relevant broader unresolved work out of `020` and expresses it as concrete later-wave recommendations.
- **Packet Identity Layer**: Adds `description.json`, README context, and cross-references so resume flows can find this packet directly.

### Data Flow

```
current remediation evidence
    -> runtime fix lands in vector-index-store + regression tests
    -> packet truth-sync in 024
    -> packet-local validation
    -> closed packet plus remaining follow-on recommendations
    -> later runtime and docs execution waves
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Retrospective Evidence Capture
- [x] Confirm the landed Codex startup remediation, the DB-isolation fix surfaces, and the follow-up caveat fix surfaces.
- [x] Read `020-pre-release-remediation` to identify which broader items still matter for this focused packet.
- [x] Decide to create a new numbered packet instead of expanding `020`.

### Phase 2: Packet Authoring
- [x] Update the existing `024-codex-memory-mcp-fix` packet so it reflects the landed runtime fix truthfully.
- [x] Replace stale packet claims with current session root cause, fix, and verification evidence.
- [x] Keep `description.json` and packet identity aligned to the same remediation slice.

### Phase 3: Packet Verification And Handoff
- [x] Validate the packet locally and fix any anchor/template drift.
- [x] Leave future runtime, docs, and release-control work captured as explicit follow-on recommendations outside this packet's completion gate.
- [x] Document that any later implementation wave owns its own memory-save and handoff lifecycle.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Packet validation | Ensure the new Level 3 packet is template-compliant | `.opencode/skill/system-spec-kit/scripts/spec/validate.sh --no-recursive` |
| Runtime evidence check | Capture the root-cause fix and current-session verification evidence in packet docs | `npx vitest run tests/vector-index-store-remediation.vitest.ts tests/handler-memory-list-edge.vitest.ts tests/handler-memory-health-edge.vitest.ts tests/handler-memory-search.vitest.ts`; `npm run test:core`; `python3 .opencode/skill/sk-code--opencode/scripts/verify_alignment_drift.py --root .opencode/skill/system-spec-kit/mcp_server` |
| Future runtime verification | Re-run focused suites plus broader checks when later-wave implementation lands | focused `npx vitest`, `npm run test:core`, alignment drift, manual startup smoke as needed |
| Metadata validation | Confirm `description.json` parses and matches packet slug | `jq empty` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `../020-pre-release-remediation/review/review-report.md` | Internal | Green | Without it, backlog mapping could drift from the canonical broader review |
| Codex and sibling launcher config surfaces | Internal | Green | Future parity work cannot be scoped honestly |
| Existing runtime evidence from the current remediation session | Internal | Green | Packet would lose the factual basis for its remediation claims |
| `vector-index-store.ts` active-connection promotion change | Internal | Green | The packet would not be able to describe the DB-isolation fix accurately |
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
<!-- ANCHOR:dependencies -->
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
<!-- /ANCHOR:dependencies -->
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
- [x] Packet scope stays limited to the narrow Codex/spec_kit_memory remediation slice and packet truth-sync.
- [x] Landed runtime code is described accurately without expanding the packet into unrelated backlog implementation.
- [x] Future runtime waves must capture fresh evidence before they mark later-wave follow-on items complete.

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
landed runtime evidence -> 024 packet scope -> tasks/checklist -> future runtime/docs wave
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
| M2 | Packet content truth-synced | Stale docs-only claims removed and remediation evidence captured | Completed in this turn |
| M3 | Packet validated | `validate.sh --no-recursive` passes | Completed in this turn |
| M4 | Follow-on recommendations captured | Later-wave runtime, docs, and release-control work is recorded without blocking packet closeout | Completed in this turn |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:architecture -->
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

<!-- /ANCHOR:architecture -->
---
