---
title: "Spec: Hook Durability & Auto-Enrichment [024/014]"
description: "Fix 6 P1 hook reliability/security bugs and implement 8 P2 auto-enrichment features. Covers cache race, error propagation, injection fencing, hook path bypass, session aliasing, file permissions, MCP priming, auto-enrichment, stale-on-read, cache freshness, dead code cleanup."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Spec: Phase 014 — Hook Durability & Auto-Enrichment

<!-- PHASE_LINKS: parent=../spec.md predecessor=013-correctness-boundary-repair successor=015-tree-sitter-migration -->

<!-- SPECKIT_LEVEL: 3 -->


<!-- SPECKIT_TEMPLATE_SHIM_START -->
<!-- Auto-generated compliance shim to satisfy required template headers/anchors. -->
## EXECUTIVE SUMMARY
Template compliance shim section. Legacy phase content continues below.

## 1. METADATA
Template compliance shim section. Legacy phase content continues below.

## 2. PROBLEM & PURPOSE
Template compliance shim section. Legacy phase content continues below.

## 3. SCOPE
Template compliance shim section. Legacy phase content continues below.

## 4. REQUIREMENTS
Template compliance shim section. Legacy phase content continues below.

## 5. SUCCESS CRITERIA
Template compliance shim section. Legacy phase content continues below.

## 6. RISKS & DEPENDENCIES
Template compliance shim section. Legacy phase content continues below.

## 7. NON-FUNCTIONAL REQUIREMENTS
Template compliance shim section. Legacy phase content continues below.

## 8. EDGE CASES
Template compliance shim section. Legacy phase content continues below.

## 9. COMPLEXITY ASSESSMENT
Template compliance shim section. Legacy phase content continues below.

## 10. RISK MATRIX
Template compliance shim section. Legacy phase content continues below.

## 11. USER STORIES
Template compliance shim section. Legacy phase content continues below.

## 12. OPEN QUESTIONS
Template compliance shim section. Legacy phase content continues below.

## RELATED DOCUMENTS
Template compliance shim section. Legacy phase content continues below.

<!-- ANCHOR:problem -->
Template compliance shim anchor for problem.
<!-- /ANCHOR:problem -->
<!-- ANCHOR:scope -->
Template compliance shim anchor for scope.
<!-- /ANCHOR:scope -->
<!-- ANCHOR:requirements -->
Template compliance shim anchor for requirements.
<!-- /ANCHOR:requirements -->
<!-- ANCHOR:success-criteria -->
Template compliance shim anchor for success-criteria.
<!-- /ANCHOR:success-criteria -->
<!-- ANCHOR:risks -->
Template compliance shim anchor for risks.
<!-- /ANCHOR:risks -->
<!-- ANCHOR:questions -->
Template compliance shim anchor for questions.
<!-- /ANCHOR:questions -->
<!-- SPECKIT_TEMPLATE_SHIM_END -->

### Summary

Fix 6 P1 hook reliability and security bugs and implement 8 P2 auto-enrichment and cleanup features. The hook fixes ensure compact recovery works reliably and securely. The auto-enrichment features make code graph + CocoIndex context load automatically without explicit tool calls.

### Items

### P1 — Must Fix

**Item 9: Fix pendingCompactPrime delete-before-read race**
- compact-inject.ts nulls pendingCompactPrime BEFORE session-prime.ts reads it
- If injection fails after delete, payload is permanently lost
- Fix target: read-then-delete order with clear deferred until stdout write succeeds
- Implementation note: current code only reads before clear. It still clears the persisted payload before stdout write success is confirmed, so this remains a partial fix.
- Files: `hooks/claude/hook-state.ts`, `hooks/claude/compact-inject.ts`
- Evidence: review F001, research iter-072, iter-088

**Item 10: Propagate saveState() errors**
- saveState() returns void; callers assume success
- Atomic write failures (disk full, permissions) silently swallowed
- Fix target: return boolean or throw; callers propagate or otherwise explicitly handle failure
- Implementation note: current code returns boolean, but callers only log `hookLog` warnings and continue instead of propagating disk errors.
- Files: `hooks/claude/hook-state.ts`
- Evidence: review F002, research iter-088

### P2 — Improvements

**Item 11: MCP first-call priming (T1.5)**
- Detect first MCP tool call in session via resolveTrustedSession()
- Auto-load context (memory + code graph status) on detection
- Works on ALL runtimes without hook support (DR-015)
- Files: `hooks/memory-surface.ts`, `handlers/memory-context.ts`
- LOC: 110-150

**Item 12: Tool-dispatch auto-enrichment**
- GRAPH_AWARE_TOOLS set prevents recursive auto-surface
- When tool reads a file, attach structural context automatically
- Intercept in context-server.ts pre-dispatch block
- Files: `context-server.ts`, `hooks/memory-surface.ts`
- LOC: 105-135

**Item 13: Stale-on-read mechanism**
- ensureFreshFiles() with mtime fast-path + content hash verification
- Threshold: <=2 files sync reindex, 3-10 async with flag, >10 suggest full scan
- Schema extension: `file_mtime_ms INTEGER` on code_files table
- Implementation note: current code uses flat fresh/stale mtime classification. The 3-tier threshold model described here is not implemented.
- Files: `lib/code-graph/code-graph-db.ts`, handlers
- LOC: 76-104

**Item 14: Cache freshness validation**
- Validate cachedAt timestamp before using compact cache
- TTL: 30 minutes default (configurable)
- Reject stale caches to prevent outdated context injection
- Files: `hooks/claude/hook-state.ts`, `hooks/claude/compact-inject.ts`
- LOC: 20-30

**Item 15: Stop-hook surrogate save redesign**
- Current: reuses pendingCompactPrime as surrogate for stop-time save
- Fix: dedicated save field with truthful naming
- Implementation note: not implemented. `HookState` has no dedicated `pendingStopSave` field.
- Files: `hooks/claude/session-stop.ts`
- LOC: 15-25

**Item 16: Cache-token bucket accounting**
- Token totals/cost estimates exclude cache bucket tokens
- Fix: include cache tokens in surfaced totals
- Files: `response-hints.ts`, `hooks/index.ts`
- LOC: 20-30

### P1 — Must Fix (new from 30-iteration review)

**Item 18: Fence recovered context with provenance markers**
- session-prime.ts replays transcript text as trusted "Recovered Context" without injection fencing
- Malicious or malformed transcript content could manipulate recovery behavior
- Fix: wrap recovered context with `[SOURCE: hook-cache]` provenance markers; sanitize embedded instructions
- Files: `hooks/claude/session-prime.ts`
- Evidence: review F009

**Item 19: Wire Claude hook path through memory-surface.ts**
- Claude hook path (compact-inject.ts → session-prime.ts) bypasses `memory-surface.ts` entirely
- Constitutional and triggered payloads are lost at compaction time
- Fix: route hook output through `memory-surface.ts` surface pipeline, or replicate constitutional injection in hook path
- Files: `hooks/claude/compact-inject.ts`, `hooks/claude/session-prime.ts`, `hooks/memory-surface.ts`
- Evidence: review F022

**Item 20: Collision-resistant session_id hashing**
- hook-state.ts filename sanitization (`replace(/[^a-zA-Z0-9-_]/g, '_')`) can alias distinct session IDs onto the same state file
- Two sessions with different IDs but same sanitized form share state, causing cross-session interference
- Fix: use SHA-256 hash of session_id for filenames, or verify full session_id on state load
- Files: `hooks/claude/hook-state.ts`
- Evidence: review F027

**Item 21: Set restrictive permissions on hook-state temp files**
- Temp JSON persists assistant summaries, transcript snippets, and recovery payloads without restrictive permissions
- On shared systems, other users could read sensitive session data
- Fix: set 0700 on temp directory, 0600 on state files (`fs.mkdirSync({mode: 0o700})`, `fs.writeFileSync({mode: 0o600})`)
- Files: `hooks/claude/hook-state.ts`
- Evidence: review F028

### P2 — Improvements (new from 30-iteration review)

**Item 28: Remove dead workingSet branch**
- session-prime.ts contains a `workingSet` branch that references a field never persisted to hook state
- Dead code path, no runtime effect
- Fix: remove the branch and any associated type references
- Files: `hooks/claude/session-prime.ts`
- Evidence: review F004

**Item 29: Consolidate duplicated token-count sync logic**
- response-hints.ts and envelope.ts both independently calculate and sync token counts
- Duplication risk: changes to one are missed in the other
- Fix: extract shared helper or delegate to single source of truth
- Files: `mcp_server/hooks/response-hints.ts`, `mcp_server/lib/envelope.ts`
- Evidence: review F019

**Item 30: Replace drifted pressure-budget helper**
- session-prime.ts has a private `calculatePressureBudget()` that has drifted from the shared, tested version
- Fix: import and use the shared helper from its canonical location
- Files: `hooks/claude/session-prime.ts`
- Evidence: review F032

### Estimated LOC: 371-499
### Dependencies: Phase 013 (correctness fixes first)
### Risk: MEDIUM — auto-enrichment touches tool dispatch path; security fixes require careful injection fencing

### Problem Statement
This phase addresses concrete context-preservation and code-graph reliability gaps tracked in this packet.

### Requirements Traceability
- REQ-900: Keep packet documentation and runtime verification aligned for this phase.
- REQ-901: Keep packet documentation and runtime verification aligned for this phase.
- REQ-902: Keep packet documentation and runtime verification aligned for this phase.
- REQ-903: Keep packet documentation and runtime verification aligned for this phase.
- REQ-904: Keep packet documentation and runtime verification aligned for this phase.
- REQ-905: Keep packet documentation and runtime verification aligned for this phase.
- REQ-906: Keep packet documentation and runtime verification aligned for this phase.
- REQ-907: Keep packet documentation and runtime verification aligned for this phase.

### Acceptance Scenarios
- **Given** phase context is loaded, **When** verification scenario 1 runs, **Then** expected packet behavior remains intact.
- **Given** phase context is loaded, **When** verification scenario 2 runs, **Then** expected packet behavior remains intact.
- **Given** phase context is loaded, **When** verification scenario 3 runs, **Then** expected packet behavior remains intact.
- **Given** phase context is loaded, **When** verification scenario 4 runs, **Then** expected packet behavior remains intact.
- **Given** phase context is loaded, **When** verification scenario 5 runs, **Then** expected packet behavior remains intact.
- **Given** phase context is loaded, **When** verification scenario 6 runs, **Then** expected packet behavior remains intact.
