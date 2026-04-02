---
title: "Implementation Plan: OpenCode Structural Priming"
description: "Plan the non-hook runtime work needed to define and wire a shared structural bootstrap contract for OpenCode-first startup and recovery flows."
trigger_phrases:
  - "opencode structural priming plan"
  - "non-hook bootstrap plan"
  - "027 structural priming plan"
importance_tier: "important"
contextType: "planning"
---

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

# Implementation Plan: OpenCode Structural Priming

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Node.js, Spec Kit MCP server |
| **Framework** | Non-hook CLI bootstrap and recovery flows |
| **Storage** | Session snapshot state + code graph SQLite |
| **Testing** | Manual runtime verification plus response-contract checks |

### Overview

This phase extends the hookless bootstrap line from phases 018 and 024 so non-hook runtimes get structural context automatically, not only when the model decides to inspect code graph tools. OpenCode is the primary target: first-turn guidance, auto-prime payloads, and recovery surfaces should make compact structural context available by default and point to the canonical next step when the digest is degraded or absent.

Two planning decisions are locked here:
1. OpenCode receives stronger wording, but all non-hook runtimes share the same payload schema.
2. `session_health` actively recommends `session_bootstrap` when structural context is stale or missing.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Parent packet and related siblings reviewed (`018`, `024`, existing `027`)
- [x] Scope separated from startup-injection work owned elsewhere in the packet
- [x] Non-hook runtime target named explicitly with OpenCode as primary example
- [x] Structural bootstrap contract decisions locked before implementation

### Definition of Done
- [x] Auto-prime/bootstrap flows include compact structural context for non-hook runtimes when graph data exists
- [x] First-turn guidance tells OpenCode what was auto-injected and what to call when structural context is missing
- [x] Recovery wording across `session_bootstrap`, `session_resume`, and `session_health` is consistent
- [x] Parent packet docs register `027-opencode-structural-priming` and distinguish it from `026-session-start-injection-debug`
- [x] Verification artifacts cover both ready and degraded graph states
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Shared structural-bootstrap contract layered onto existing hookless recovery surfaces.

### Key Components
- **`context-server.ts`**: emits first-turn/runtime instructions that describe the bootstrap contract
- **`memory-surface.ts`**: enriches auto-prime payloads with structural digest + targeted hints
- **`session-bootstrap.ts`**: becomes the canonical rich bootstrap surface for non-hook runtimes
- **`session-resume.ts` + `session-health.ts`**: reinforce the same recovery vocabulary when startup context is stale or incomplete
- **OpenCode runtime guidance**: documents how non-hook sessions should interpret and use the above surfaces

### Structural Contract

All non-hook surfaces share one structural bootstrap contract with these fields:

| Field | Meaning | Required |
|-------|---------|----------|
| `status` | `ready`, `stale`, or `missing` structural state | Yes |
| `summary` | Compact structural digest sentence | Yes |
| `highlights` | 0-5 concise structural bullets | No |
| `recommendedAction` | Canonical next recovery step | Yes |
| `sourceSurface` | Emitting surface name | Yes |

Contract rules:
- OpenCode-first wording is allowed, but the payload shape is identical for all non-hook runtimes.
- `session_bootstrap` is the primary recommendation for stale/missing structural context.
- `session_resume` and `session_health` mirror the same contract instead of inventing alternate wording paths.
- The structural contract itself should target 250-400 tokens and never exceed 500 tokens.

### Data Flow

OpenCode session starts → first tool call or bootstrap flow triggers auto-prime/session bootstrap → response includes compact structural digest + freshness + next-step guidance → if context is stale or absent, `session_health`/`session_resume` point back to the same structural recovery path instead of requiring manual graph-tool selection.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Structural Bootstrap Contract
- [ ] Define the compact structural digest fields shared by auto-prime and `session_bootstrap`
- [ ] Reuse existing snapshot/freshness helpers from Phase 024 where possible
- [ ] Document degradation behavior for missing or stale graph data
- [ ] Register `027-opencode-structural-priming` in the parent packet phase map and handoff table

### Phase 2: OpenCode First-Turn Guidance
- [ ] Update startup instructions to explain what structural context is auto-injected for non-hook runtimes
- [ ] Make OpenCode the primary wording example while keeping the contract reusable for other non-hook CLIs
- [ ] Ensure guidance prefers bootstrap/resume recovery paths over ad hoc manual graph-tool decisions

### Phase 3: Recovery Surface Alignment
- [ ] Align `session_bootstrap`, `session_resume`, and `session_health` wording and next actions
- [ ] Add response hints when only partial structural context is available
- [ ] Verify startup-injection work remains separate from this non-hook structural contract

### Phase 4: Verification
- [ ] Verify ready-state contract across auto-prime and `session_bootstrap`
- [ ] Verify stale-state contract recommends `session_bootstrap`
- [ ] Verify missing-state contract omits highlights and uses explicit absence messaging
- [ ] Verify OpenCode-first wording remains compatible with other non-hook runtimes
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Manual | OpenCode first turn with ready graph | OpenCode + MCP responses |
| Manual | OpenCode first turn with missing/stale graph | OpenCode + `session_health` |
| Manual | Resume after context drift | `session_resume`, `session_bootstrap` |
| Contract | Shared schema and wording consistency across surfaces | MCP handler/unit verification |
| Documentation | Parent packet registration and sibling distinction | `rg`, spec review |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `018-non-hook-auto-priming` | Internal | Yellow | First-call transport exists, but payload is still status-only |
| `024-hookless-priming-optimization` | Internal | Yellow | Bootstrap/session helpers exist, but structural contract is not yet unified |
| Code graph freshness/status data | Internal | Green | Required to decide whether structural digest is trustworthy |
| `026-session-start-injection-debug` | Sibling phase | Yellow | Must stay separate to avoid mixing startup-injection and non-hook bootstrap responsibilities |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: First-turn guidance becomes noisy, misleading, or conflicts with hook-runtime startup behavior
- **Procedure**: Remove the new structural-bootstrap wording from non-hook surfaces and fall back to the current Phase 024 bootstrap contract
- **Recovery**: Keep the packet as documentation for a narrowed follow-up if only part of the contract proves useful
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Phase 1 (Structural Contract) ──► Phase 2 (OpenCode Guidance) ──► Phase 3 (Recovery Alignment)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Structural Contract | 018, 024 | OpenCode Guidance, Recovery Alignment |
| OpenCode Guidance | Structural Contract | Recovery Alignment |
| Recovery Alignment | Structural Contract, OpenCode Guidance | Verification |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Structural Contract | Medium | 2-4 hours |
| OpenCode Guidance | Medium | 2-3 hours |
| Recovery Alignment | Medium | 2-4 hours |
| **Total** |  | **6-11 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Capture current non-hook startup wording and payload examples
- [x] Confirm hook-runtime startup behavior is unchanged
- [x] Identify where OpenCode-specific wording diverges from other runtimes

### Rollback Procedure
1. Remove structural digest injection from the affected non-hook bootstrap surface
2. Restore the prior Phase 024 bootstrap/session wording
3. Re-run manual OpenCode startup checks and confirm recovery guidance still works
4. Document whether the failed change was due to payload size, ambiguity, or overlap with sibling phase 027

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A — response-contract and instruction changes only
<!-- /ANCHOR:enhanced-rollback -->
