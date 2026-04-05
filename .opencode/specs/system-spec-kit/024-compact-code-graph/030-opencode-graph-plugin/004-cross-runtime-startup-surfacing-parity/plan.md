---
title: "Implementation Plan: Cross-Runtime Startup Surfacing Parity [system-spec-kit/024-compact-code-graph/030-opencode-graph-plugin/004-cross-runtime-startup-surfacing-parity]"
description: "This phase delivered the runtime/config changes that make startup/session-context surfacing feel consistent across the repo-managed CLI runtimes. The Level 3 plan records that work while preserving the important differences between hook-capable and hookless runtimes."
trigger_phrases:
  - "cross-runtime startup surfacing parity plan"
  - "packet 030"
  - "level 3"
importance_tier: "important"
contextType: "implementation"
---
# Implementation Plan: Cross-Runtime Startup Surfacing Parity

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript hook/runtime adapters, TOML/JSON config, Markdown |
| **Framework** | Packet 024 compact code graph startup surfacing across OpenCode, Claude, Gemini, Copilot, and Codex |
| **Storage** | Existing runtime config folders plus packet 030 docs |
| **Testing** | Hook/runtime tests, config validation, and strict packet validation |

### Overview
This phase delivered the runtime/config changes that make startup/session-context surfacing feel consistent across the repo-managed CLI runtimes. The Level 3 plan records that work while preserving the important differences between hook-capable and hookless runtimes.
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
Reference-led runtime parity pass

### Key Components
- **OpenCode reference surface**: plugin startup digest and session-context blocks
- **Hook-capable runtime adapters**: Claude and Gemini session-prime outputs plus the Copilot banner hook
- **Hookless runtime guidance surface**: Codex startup/bootstrap output through `context-prime`
- **Shared startup brief contract**: reusable startup wording and status lines

### Data Flow
The startup brief and recovery cues are defined once, then rendered through runtime-specific adapters. OpenCode remains the baseline implementation while Claude, Gemini, Copilot, and Codex all surface the same top-level startup shape.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Runtime Inventory
- [x] Confirm the exact startup/session-context sections OpenCode injects
- [x] Confirm the current Claude/Gemini/Copilot/Codex startup surfaces

### Phase 2: Parity Design
- [x] Define the common startup sections and recovery cues
- [x] Map runtime-specific differences for hook-capable versus hookless CLIs

### Phase 3: Verification
- [x] Verify runtime/config updates
- [x] Verify startup parity still preserves runtime-specific truth
- [x] Record packet-local closeout evidence
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Hook Runtime | Claude and Gemini startup output stays aligned with the parity contract | `TMPDIR=/Users/michelkerkmeester/.tmp/vitest-tmp npx vitest run tests/startup-brief.vitest.ts tests/hook-session-start.vitest.ts` |
| Config Validation | Runtime configuration files remain valid after startup-surfacing changes | `python3.11` TOML parse of `.codex/agents/context-prime.toml` and `jq empty .github/hooks/superset-notify.json` |
| Smoke Runs | Startup banner/output remains correct across runtime entry points | `printf` pipes through built hook scripts and `context-prime` validation |
<!-- /ANCHOR:testing -->

---

### AI EXECUTION PROTOCOL

### Pre-Task Checklist
- Confirm OpenCode remains the reference surface.
- Confirm parity claims come from the existing Phase 4 implementation summary and validation evidence.
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
| .opencode/plugins/spec-kit-compact-code-graph.js | Internal | Green | OpenCode parity reference would be unclear without it |
| Hook entry points and `startup-brief.ts` | Internal | Green | Parity could drift from the shared startup surface |
| .codex/agents/context-prime.toml` and Copilot local banner config | Internal | Green | Codex and Copilot parity path would become inaccurate |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Documentation drifts from the shipped runtime scope or validation fails.
- **Procedure**: Revert the parity-specific runtime/config changes, keep OpenCode as the reference, and re-scope the follow-on without touching phases 001-003.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Runtime Inventory ──► Parity Design ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Runtime Inventory | Phase 3 complete | Parity Design |
| Parity Design | Runtime Inventory | Verification |
| Verification | Parity Design | Packet closeout |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Runtime Inventory | Medium | Completed in runtime/config work |
| Parity Design | Medium | Completed in runtime/config work |
| Verification | Medium | Completed with targeted hook/config checks |
| **Total** |  | **Phase 4 complete** |
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
OpenCode Reference ──► Shared Startup Surface ──► Claude/Gemini/Copilot
                       └──────────────────────► Codex Bootstrap
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| OpenCode Reference | Phase 2 complete | Reference startup shape | Parity work |
| Shared Startup Surface | OpenCode reference + startup-brief | Reusable startup block | Claude/Gemini/Copilot/Codex |
| Runtime Adapters | Shared startup surface | Runtime-specific output | Packet closeout |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. Confirm the OpenCode reference startup shape - completed - CRITICAL
2. Apply parity updates to runtime-specific entry points - completed - CRITICAL
3. Verify startup parity with tests and config checks - completed - CRITICAL

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
| M1 | Reference inventory complete | OpenCode and other runtime startup paths are mapped | Completed |
| M2 | Parity shipped | Claude, Gemini, Copilot, and Codex all surface the shared startup block | Completed |
| M3 | Parity verified | Tests, config validation, and packet validation passed | Completed |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Center Startup Parity on the Shared Startup Surface

**Status**: Accepted

**Context**: The repo needed startup consistency across runtimes without pretending all runtimes had the same hook model.

**Decision**: Phase 4 reuses the shared startup brief and keeps Codex bootstrap-based while the hook-capable runtimes use hooks.

**Consequences**:
- Positive: startup feels consistent across runtimes.
- Negative: runtime-specific differences still need to be documented explicitly.

**Alternatives Rejected**:
- Folding this work into another layer: rejected because it would blur the phase boundary.
