---
title: "Implementation [system-spec-kit/024-compact-code-graph/030-opencode-graph-plugin/002-opencode-transport-adapter/plan]"
description: "This phase delivered the OpenCode transport contract and the live plugin hook layer. The Level 3 plan records that shipped boundary and the evidence that proves the plugin stayed thin."
trigger_phrases:
  - "opencode transport adapter plan"
  - "packet 030"
  - "level 3"
importance_tier: "important"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/024-compact-code-graph/030-opencode-graph-plugin/002-opencode-transport-adapter"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["plan.md"]
---
# Implementation Plan: OpenCode Transport Adapter

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript runtime helpers, JavaScript plugin file, JSON config, Vitest |
| **Framework** | OpenCode plugin lifecycle hooks and packet-024 session handlers |
| **Storage** | Existing packet-024 retrieval stack remains the source of truth |
| **Testing** | Build, typecheck, plugin syntax check, JSON validation, and targeted transport/plugin tests |

### Overview
This phase delivered the OpenCode transport contract and the live plugin hook layer. The Level 3 plan records that shipped boundary and the evidence that proves the plugin stayed thin.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Scope is documented and bounded
- [x] Success criteria are measurable
- [x] Dependencies are identified

### Definition of Done
- [x] Runtime claims remain unchanged in meaning
- [x] Level 3 docs are clean and validator-friendly
- [x] This phase closeout is evidence-backed
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Thin transport plugin layer

### Key Components
- **Event capture shim**: records lightweight routing hints
- **System transform injector**: adds startup digest content
- **Messages transform injector**: adds bounded current-turn context
- **Compaction injector**: adds continuity note without conflating it with current retrieval
- **Diagnostic tool**: exposes `spec_kit_compact_code_graph_status`

### Data Flow
Shared payloads from Phase 1 are translated into OpenCode-specific injection parts. The plugin does not decide retrieval policy; it only maps already-shaped data into lifecycle hooks and exposes a bounded diagnostic surface.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Hook Inventory
- [x] Confirm the four target hooks and their responsibilities
- [x] Map which payload type belongs to each hook

### Phase 2: Adapter Boundary
- [x] Define the shared transport/public interface
- [x] Define dedupe and budget boundaries
- [x] Register the live plugin in `opencode.json`

### Phase 3: Verification
- [x] Verify plugin syntax and configuration
- [x] Verify handler outputs include transport data
- [x] Verify plugin tests remain green
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Build | Plugin bridge and handler wiring compile cleanly | `npm run build` |
| Type Safety | Adapter helper, plugin, and handler wiring compile cleanly | `npm run typecheck` |
| Runtime Tests | Adapter helper, live plugin, and handler output stay green | `npx vitest run tests/opencode-transport.vitest.ts tests/code-graph-ops-hardening.vitest.ts tests/session-resume.vitest.ts tests/session-bootstrap.vitest.ts tests/opencode-plugin.vitest.ts` |
| Syntax | Plugin file parses as valid JavaScript | `node --check .opencode/plugins/spec-kit-compact-code-graph.js` |
| Config | OpenCode config parses with the plugin entry | `jq empty opencode.json` |
<!-- /ANCHOR:testing -->

---

### AI EXECUTION PROTOCOL

### Pre-Task Checklist
- Confirm shared payloads remain the source for all hook blocks.
- Confirm runtime claims come from the existing Phase 2 implementation summary.
- Confirm all Level 3 docs stay truthful and evidence-backed.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| `DOC-SCOPE` | Keep edits inside the packet or phase folder. |
| `TRUTH-FIRST` | Preserve the existing runtime claims from implementation evidence. |
| `VALIDATE-LAST` | Use strict recursive validation as the final closeout gate. |

### Status Reporting Format
- `in-progress`: note which doc set is being repaired or validated.
- `blocked`: note the validator error or missing evidence plus the next action.
- `completed`: note changed files and the final validation result.

### Blocked Task Protocol
- If validation fails, keep the phase open and repair the documented blocker before claiming completion.
- If a checklist or ADR entry cannot be supported by evidence, defer it explicitly rather than fabricating completion.

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 1 shared contract | Internal | Green | Adapter would otherwise invent its own semantics |
| OpenCode plugin lifecycle and registration | Internal | Green | Hook mapping would become speculative or unshipped |
| Parent research synthesis | Internal | Green | Transport boundary could drift from packet rationale |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Documentation drifts from the shipped runtime scope or validation fails.
- **Procedure**: Move any extra retrieval or storage behavior back into shared payloads or future follow-on packets and keep this phase transport-only.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Hook Inventory ──► Adapter Boundary ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Hook Inventory | Phase 1 shared contract | Adapter Boundary |
| Adapter Boundary | Hook Inventory | Verification |
| Verification | Adapter Boundary | Phase 3 graph ops |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Hook Inventory | Medium | Completed in shipped plugin work |
| Adapter Boundary | Medium | Completed in shipped plugin work |
| Verification | Medium | Completed with targeted runtime checks |
| **Total** |  | **Phase 2 complete** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Baseline evidence identified
- [x] Validation gate selected
- [x] Scope boundaries documented

### Rollback Procedure
1. Restore the affected docs from the packet-local backup or version control baseline.
2. Reapply only the bounded phase wording and validator-required sections.
3. Rerun validation.
4. Confirm the final packet state before removing any temporary baselines.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: Restore the affected docs and rerun validation.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
Shared Payloads ──► Transport Contract ──► OpenCode Plugin Hooks
Session Handlers ─────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Shared Payloads | Phase 1 | Transport contract inputs | Plugin hooks |
| Session Handlers | Shared payload outputs | Resume/bootstrap transport data | Plugin hooks |
| Plugin Hooks | Transport contract | Live startup/message/compaction injection | Phase 3 graph ops |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. Map payloads to the four target hooks - completed - CRITICAL
2. Register the live plugin and config entry - completed - CRITICAL
3. Verify plugin, handler, and config behavior - completed - CRITICAL

**Total Critical Path**: One completed phase-specific execution path

**Parallel Opportunities**:
- Evidence capture and documentation cleanup can happen in parallel once the runtime work is complete.
- Checklist and ADR closeout can proceed after the phase narrative is stable.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Transport contract defined | One contract shapes all hook blocks | Completed |
| M2 | Live plugin registered | Plugin file and `opencode.json` entry shipped | Completed |
| M3 | Transport surface verified | Plugin tests, syntax check, and config validation passed | Completed |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Ship a Real Plugin While Keeping It Transport-Only

**Status**: Accepted

**Context**: The packet needed live OpenCode hook registration, but the plugin could not become a second backend.

**Decision**: Phase 2 ships the plugin and transport contract while explicitly leaving retrieval, storage, and graph hardening elsewhere.

**Consequences**:
- Positive: OpenCode gets a real hook layer.
- Negative: follow-on work must keep using shared contracts rather than extending the plugin indiscriminately.

**Alternatives Rejected**:
- Folding this work into another layer: rejected because it would blur the phase boundary.
