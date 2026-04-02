---
title: "Spec: Startup Context Injection Debug — Hook Runtime Brief + Sibling Handoff"
description: "Isolate the startup injection gap for hook-capable runtimes, define a reusable startup brief helper, and hand off hookless structural bootstrap ownership to Phase 027."
trigger_phrases:
  - "startup injection"
  - "session start context"
  - "handleStartup"
  - "compact code graph injection"
  - "graph freshness empty"
  - "startup auto priming"
  - "026"
importance_tier: "critical"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_ADDENDUM: Phase - Child Header -->

| **Parent Spec** | ../spec.md |
| **Parent Plan** | ../plan.md |
| **Phase** | 26 of 27 |
| **Predecessor** | 025-tool-routing-enforcement |
| **Successor** | 027-opencode-structural-priming |
| **Handoff Criteria** | Hook-runtime startup injection path is isolated, reusable brief design is documented, and hookless structural bootstrap is handed off to `027-opencode-structural-priming` |

<!-- ANCHOR:phase-context -->
### Phase Context

This is **Phase 26** of the Compact Code Graph specification.

**Scope Boundary**: Startup priming path for hook-capable runtimes only — especially `handleStartup()` in Claude and Gemini plus the reusable startup brief helper those hooks can share.

**Dependencies**:
- Code graph DB (`code-graph-db.ts`) — deployed, provides stats and outline access
- Hook state (`hook-state.ts`) — deployed, provides `loadState()` with `lastSpecFolder`, `sessionSummary`
- Existing hook startup surfaces in Claude and Gemini
- `027-opencode-structural-priming` — owns the hookless structural bootstrap contract that follows from this phase

**Deliverables**:
- Shared `buildStartupBrief()` design for startup-capable runtimes
- Enhanced hook startup for Claude + Gemini
- Clear sibling handoff showing that non-hook structural bootstrap belongs to Phase 027
<!-- /ANCHOR:phase-context -->

---

# Spec: Startup Context Injection Debug — Hook Runtime Brief + Sibling Handoff

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-04-02 |
| **Branch** | `system-speckit/024-compact-code-graph` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The startup priming path is still broken or too thin where true startup injection should happen. Hook-capable runtimes currently start with a static overview instead of structural context, and hookless runtimes still rely on later bootstrap surfaces rather than true session-start injection.

| Runtime Class | Startup Mechanism | Current Output | Phase Ownership |
|---------------|-------------------|----------------|-----------------|
| **Claude Code** | Hook: `session-prime.ts:handleStartup()` | Static tool listing + stale warning | `026` |
| **Gemini CLI** | Hook: `gemini/session-prime.ts:handleStartup()` | Static tool listing | `026` |
| **Codex/Copilot and other hookless runtimes** | First tool call / bootstrap surfaces | Status-oriented priming, not true startup injection | `027` |

**Packet-level boundary**: `primeSessionIfNeeded()` and `session_bootstrap` are still important, but they are no longer the implementation surface for this phase. They are follow-on ownership for `027-opencode-structural-priming`, which defines the non-hook structural bootstrap contract.

**Root cause**: Hook scripts run as standalone Node processes and cannot call MCP tools. The older startup design assumed resume-style MCP retrieval from hook startup, which was architecturally impossible. What remains valid in this phase is a direct-read startup brief for hook-capable runtimes and a clean handoff for hookless flows.

**Observed impact**: Claude and Gemini startup still waste the opening turn on manual context loading, while hookless runtimes depend on later bootstrap behavior that needs its own separate contract work.

### Purpose

Define and validate the hook-runtime startup brief path for Claude and Gemini, then hand the hookless structural bootstrap contract to `027-opencode-structural-priming`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- **Shared function**: `buildStartupBrief()` — reads code graph DB + most recent hook state directly (no MCP round-trip)
- **Claude hook**: Enhance `session-prime.ts:handleStartup()` to call shared function
- **Gemini hook**: Enhance `gemini/session-prime.ts:handleStartup()` to call shared function
- **Cross-session state**: `loadMostRecentState()` in `hook-state.ts` to find prior session's cached state
- **Sibling handoff**: Document that hookless structural bootstrap belongs to `027-opencode-structural-priming`

### Out of Scope

- MCP tool calls from hooks — architecture constraint, not solvable here
- Modifying compaction path (`source=compact`) — already working
- CocoIndex queries from hooks — requires MCP, not available in hooks
- New hook events or Claude Code / Gemini API changes
- `PrimePackage`, `session_bootstrap`, and other hookless bootstrap payload changes — owned by `027-opencode-structural-priming`

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/lib/code-graph/startup-brief.ts` | Create | Shared `buildStartupBrief()` — reads graph DB + hook state, returns sections |
| `mcp_server/hooks/claude/session-prime.ts` | Modify | `handleStartup()` calls shared function |
| `mcp_server/hooks/gemini/session-prime.ts` | Modify | `handleStartup()` calls shared function |
| `mcp_server/hooks/claude/hook-state.ts` | Modify | Add `loadMostRecentState()` |
| `../027-opencode-structural-priming/spec.md` | Reference | Receives hookless bootstrap contract ownership after this phase |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Shared `buildStartupBrief()` returns graph outline + session continuity | Function returns structured sections from direct DB reads |
| REQ-002 | Claude hook injects graph outline at session start | Fresh Claude session shows structural context in system-reminder |
| REQ-003 | Gemini hook injects graph outline at session start | Fresh Gemini session shows structural context |
| REQ-004 | Hookless bootstrap ownership is handed off cleanly to Phase 027 | `026` docs explicitly remove ownership of `PrimePackage` / `session_bootstrap` payload changes and point to `027-opencode-structural-priming` |
| REQ-005 | All paths stay within token budgets | Hooks: 2000 tokens, MCP: existing `TOOL_DISPATCH_TOKEN_BUDGET` |
| REQ-006 | All hook paths complete within timeout | Hooks: 1800ms target with graceful fallback |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Graceful degradation when code graph DB missing/empty | Falls back to current static output (no crash) |
| REQ-008 | Graceful degradation when no prior session state | Omits continuity section |
| REQ-009 | `loadMostRecentState()` finds newest state file <24h old | Returns most recent `HookState` by mtime or null |
| REQ-010 | Startup brief helper design is reusable without forcing Phase 027 implementation details | Helper contract is documented as startup-capable and Phase 027 can reuse it later if appropriate |
| REQ-011 | No regression on compaction/resume/clear paths | Existing behavior unchanged |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Claude fresh session shows code graph outline (file count, top symbols, staleness)
- **SC-002**: Gemini fresh session shows equivalent structural context
- **SC-003**: `026` no longer claims ownership of hookless bootstrap payload work and points that work to `027-opencode-structural-priming`
- **SC-004**: Hook runtime paths show "Last session: [spec folder] — [summary]" when prior state exists
- **SC-005**: No regression on compaction/resume/clear for startup-capable runtimes

### Acceptance Scenarios

- **Given** Claude starts a fresh session with a ready code graph, **When** `handleStartup()` runs, **Then** startup output includes a compact structural brief instead of only the static tool listing.
- **Given** Gemini starts a fresh session with a ready code graph, **When** startup output is injected, **Then** the same startup brief concepts appear without relying on MCP calls.
- **Given** the code graph DB is missing or empty, **When** startup hooks run, **Then** they degrade to explicit guidance rather than crashing or implying injection succeeded.
- **Given** this phase completes its design work, **When** packet ownership is reviewed, **Then** hookless bootstrap payload changes are clearly handed to `027-opencode-structural-priming`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Code graph DB not initialized (fresh install) | No graph section | Graceful fallback — `getStats()` handles missing DB |
| Risk | False positive from empty graph DB | Could misattribute to injection vs indexing | Include empty-state comparison in verification |
| Risk | Hook timeout on large DB | Truncated output | Budget + timeout guards in shared.ts |
| Risk | Cross-session state stale (days old) | Misleading continuity | Age check — skip if >24h old |
| Risk | Overlap with `027-opencode-structural-priming` | Packet churn and duplicate implementation | Keep `026` limited to hook startup injection and helper design; defer hookless payload contract to `027` |
| Dependency | `code-graph-db.ts` dynamic import | Already in session-prime.ts:21-27 | Reuse existing pattern |
| Dependency | Hook state directory exists | Required for cross-session lookup | `ensureStateDir()` already called |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None at this phase level. Hookless bootstrap behavior and first-tool-call contract are owned by `027-opencode-structural-priming`.
<!-- /ANCHOR:questions -->
