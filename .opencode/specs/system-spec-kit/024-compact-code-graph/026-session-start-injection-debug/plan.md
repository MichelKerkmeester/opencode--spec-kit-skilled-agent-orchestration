---
title: "Plan: Startup Context Injection Debug — Hook Runtime Brief + Sibling Handoff"
description: "Build a reusable startup brief helper for Claude/Gemini startup injection, keep hookless bootstrap work out of scope, and hand that contract to Phase 027."
trigger_phrases:
  - "startup injection plan"
  - "handleStartup fix"
  - "026 plan"
  - "cross-runtime priming"
importance_tier: "critical"
contextType: "planning"
---

# Plan: Startup Context Injection Debug — Hook Runtime Brief + Sibling Handoff

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (ESM, Node.js) |
| **Framework** | Claude Code hooks, Gemini CLI hooks, reusable startup-brief helper |
| **Storage** | SQLite (code-graph.sqlite), JSON (hook-state) |
| **Testing** | Manual verification for Claude/Gemini startup plus packet-boundary checks |

### Overview

Build a shared `buildStartupBrief()` function that reads the code graph DB and most recent hook state directly (no MCP round-trip). Wire it into:

1. **Claude hook** `handleStartup()` — stdout injection
2. **Gemini hook** `handleStartup()` — additionalContext injection
3. **Packet handoff** — explicitly defer hookless structural bootstrap surfaces to `027-opencode-structural-priming`

This follows the existing design principle (spec Phase 013): **hooks are transport, not business logic** — the shared function does the work, runtimes just deliver it. Hookless bootstrap contract work is no longer owned here.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear — hook startup is still static and underpowered
- [x] Root cause identified — hooks can't call MCP; hookless bootstrap contract must be separate
- [x] All dependencies exist and are deployed
- [x] Sibling boundary to `027-opencode-structural-priming` is mapped

### Definition of Done
- [x] Shared `buildStartupBrief()` returns graph outline + session continuity
- [x] Claude fresh session injects enriched startup
- [x] Gemini fresh session injects enriched startup
- [x] `026` no longer claims hookless `PrimePackage` / `session_bootstrap` payload ownership
- [x] Hook startup path stays within token/time budgets
- [x] No regression on compaction/resume/clear
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Shared Library + Startup Transport Adapters — one function builds the brief, and only hook-capable startup surfaces deliver it in this phase.

### Key Components

- **`startup-brief.ts`** (new, in `lib/code-graph/`): Shared function that reads graph DB + hook state directly. No MCP dependency. Returns `StartupBriefResult` with optional sections.
- **`hook-state.ts`** (modify): Add `loadMostRecentState()` — scans state dir by mtime for cross-session continuity.
- **`session-prime.ts`** (Claude, modify): `handleStartup()` calls shared function, formats as `OutputSection[]`.
- **`gemini/session-prime.ts`** (modify): Same — calls shared function.
- **Sibling handoff**: `027-opencode-structural-priming` owns any reuse of this helper for hookless bootstrap surfaces.

### Data Flow

```
                        buildStartupBrief()
                        ├── getStats()                → graph summary
                        ├── startup highlight query   → concise startup highlights
                        └── loadMostRecentState()     → last session spec folder + summary
                                     │
                     ┌───────────────┴───────────────┐
                     │                               │
            ┌────────▼────────┐             ┌────────▼────────┐
            │  Claude hook     │             │  Gemini hook     │
            │  handleStartup() │             │  handleStartup() │
            │  → stdout        │             │  → JSON stdout   │
            └──────────────────┘             └──────────────────┘

           Hookless bootstrap contract (`PrimePackage`, `session_bootstrap`)
           is analyzed here but implemented in `027-opencode-structural-priming`.
```

### Token Budget Allocation

**Hooks** (2000 total):

| Section | Budget | Priority |
|---------|--------|----------|
| Tool availability (existing) | ~200 | Always |
| Code graph outline | ~600 | When DB exists |
| Session continuity | ~200 | When state <24h exists |
| Stale warning (existing) | ~50 | When stale |
| Reserve | ~950 | Absorbed by truncation |

Hookless token budget work is deferred to `027-opencode-structural-priming`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Foundation (~35 LOC)

- [ ] Add `loadMostRecentState(): HookState | null` to `hook-state.ts`
  - Scan state dir, sort by mtime, load newest <24h
  - Return null if empty or all stale

- [ ] Add a startup-highlight query to `code-graph-db.ts`
  - Must fit the existing schema rather than assume a `parent_id` column
  - Returns concise, low-noise startup highlights suitable for hook output

### Phase 2: Shared Function (~40 LOC)

- [ ] Create `lib/code-graph/startup-brief.ts`
  - `buildStartupBrief(): StartupBriefResult`
  - Calls `getStats()` + startup-highlight query + `loadMostRecentState()`
  - Returns `{ graphOutline: string | null, sessionContinuity: string | null, graphSummary: { files, nodes, edges, lastScan } | null }`
  - All wrapped in try/catch — null on any failure
  - Graph outline format: "N files, M nodes, K edges. Last scan: [time].\nHighlights:\n- name (kind) — path\n..."
  - Continuity format: "Last session worked on: [spec folder]\nSummary: [text]"

### Phase 3: Hook Wiring (~30 LOC each)

- [ ] Claude `session-prime.ts:handleStartup()`
  - Dynamic import `startup-brief.ts` (same pattern as existing `getStats` import)
  - Call `buildStartupBrief()`
  - Insert graph outline section after tool listing, before stale warning
  - Insert continuity section after graph outline

- [ ] Gemini `gemini/session-prime.ts:handleStartup()`
  - Same wiring — shared function, format as sections

### Phase 4: Sibling Handoff

- [ ] Document that hookless bootstrap surfaces (`PrimePackage`, `session_bootstrap`) are owned by `027-opencode-structural-priming`
- [ ] Keep any helper design reusable without pre-committing Phase 027 payload details

### Phase 5: Verification

- [ ] Claude fresh startup with populated graph → outline + continuity appear
- [ ] Gemini fresh startup with populated graph → outline appears
- [ ] Fresh install (no graph DB) → graceful fallback, tool listing only
- [ ] No prior session state → no continuity section
- [ ] Compaction/resume/clear paths → unchanged
- [ ] Packet docs clearly distinguish `026-session-start-injection-debug` from `027-opencode-structural-priming`
- [ ] Hook timing <500ms typical (direct SQLite, no MCP)
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Method |
|-----------|-------|--------|
| Manual | Claude startup with graph DB | New session, verify system-reminder |
| Manual | Gemini startup with graph DB | New Gemini session, verify output |
| Manual | No graph DB | Delete code-graph.sqlite, verify fallback |
| Manual | Cross-session continuity | Stop session, start new, verify last session info |
| Manual | Compaction path | Trigger compaction, verify unchanged |
| Documentation | Packet boundary with Phase 027 | Spec/plan/tasks/checklist review |
| Manual | Timing | Check stderr logs / tool response latency |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `code-graph-db.ts` | Internal | Green | Dynamic import already in hooks |
| `hook-state.ts` | Internal | Green | Extends existing module |
| `027-opencode-structural-priming` | Sibling phase | Yellow | Owns hookless bootstrap contract work after this phase |
| SQLite (better-sqlite3) | External | Green | Already bundled |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Hook crashes or startup brief causes noisy startup output
- **Procedure**: Revert `handleStartup()` to static version (both hooks), remove `startup-brief.ts`, keep sibling Phase 027 untouched
- **Risk**: LOW — all new code is additive, wrapped in try/catch, existing fallback paths preserved
<!-- /ANCHOR:rollback -->

---

### Estimated LOC: ~90-120 across 4-5 files
### Estimated Effort: 2-4 hours
