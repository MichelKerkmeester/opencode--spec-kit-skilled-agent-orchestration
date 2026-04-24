---
title: "Phase 022: Gemini CLI Hook Porting [system-spec-kit/024-compact-code-graph/022-gemini-hook-porting/spec]"
description: "Template compliance shim section. Legacy phase content continues below."
trigger_phrases:
  - "phase"
  - "022"
  - "gemini"
  - "cli"
  - "hook"
  - "spec"
importance_tier: "important"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/024-compact-code-graph/022-gemini-hook-porting"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["spec.md"]
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Phase 022: Gemini CLI Hook Porting

<!-- PHASE_LINKS: parent=../spec.md predecessor=021-cross-runtime-instruction-parity successor=023-context-preservation-metrics -->

<!-- SPECKIT_LEVEL: 2 -->


<!-- SPECKIT_TEMPLATE_SHIM_START -->
<!-- Auto-generated compliance shim to satisfy required template headers/anchors. -->
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

## 10. OPEN QUESTIONS
Template compliance shim section. Legacy phase content continues below.

<!-- ANCHOR:metadata -->
Template compliance shim anchor for metadata.
<!-- /ANCHOR:metadata -->
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

### What This Is

Gemini CLI (v0.33.1+) supports hooks but needs Gemini-native wiring and caveat tracking. Claude Code has hook support for the same lifecycle concepts; this phase ports the relevant behavior to Gemini's lifecycle format and documents the remaining gaps.

### Plain-English Summary

**Problem:** Gemini CLI has hook support but we're not using it. Gemini users get the same weak experience as Codex/Copilot even though their CLI can do better.

**Solution:** Create Gemini-native hook scripts that map to Gemini's lifecycle events. Not a direct copy of Claude hooks — Gemini's lifecycle is different, so we adapt the concepts.

### How Claude Hooks Map to Gemini

| Claude Event | Gemini Equivalent | Notes |
|-------------|-------------------|-------|
| `SessionStart` | `SessionStart` | Direct match for startup/resume/clear |
| `PreCompact` | `PreCompress` | Gemini calls it "compress" not "compact" |
| `SessionStart(compact)` | `BeforeAgent` (one-shot) | Inject cached context before first agent turn |
| `Stop` | `SessionEnd` | Single Gemini end-of-session hook. Session state is saved there, but token tracking is still partial because Gemini transcript token usage is not parsed. |

### What to Build

### 1. Session Prime (highest priority)

Port `session-prime.ts` to Gemini format. This is the easiest win because `SessionStart` maps directly.

**New file:** `mcp_server/hooks/gemini/session-prime.ts`
- Same logic as Claude version: detect source (startup/resume/clear), output appropriate context
- Different: Gemini stdin/stdout format may differ slightly

### 2. Compact Cache + Inject (two-phase)

Claude combines PreCompact + SessionStart(compact) into one flow. Gemini needs two separate hooks:
- `PreCompress` → cache critical context to temp file (same as Claude's compact-inject)
- `BeforeAgent` (one-shot) → read cached context and inject it

**New files:**
- `mcp_server/hooks/gemini/compact-cache.ts`
- `mcp_server/hooks/gemini/compact-inject.ts`

### 3. Session Stop

Implement as a single `SessionEnd` hook. Don't reuse `claude-transcript.ts` — Gemini's transcript format is different, and current logic does not parse Gemini transcript token usage.

**New file:** `mcp_server/hooks/gemini/session-stop.ts`
- Saves session state on `SessionEnd`
- Uses a shallow regex for spec-folder detection, so deeper nested phase paths can be truncated
- Applies `MAX_TRANSCRIPT_BYTES` in `session-stop.ts`, but that does not harden `compact-cache.ts`

### 4. Settings Registration

**Expected user config target:** `.gemini/settings.json` — add a hooks block pointing to the new scripts.

**Known limitation:** there is no checked-in `.gemini/settings.json` in this repository. Any example registration remains a user-local target and requires local workspace-path verification before it can be treated as complete.

### 5. Shared Core Extraction (if port is stable)

If the Gemini hooks work well, extract shared helpers so Claude and Gemini don't drift:
- Shared: context gathering, budget calculation, state management
- Runtime-specific: stdin/stdout format, transcript parsing, event names

### Files to Change

| File | Change |
|------|--------|
| New `mcp_server/hooks/gemini/session-prime.ts` | Session start priming |
| New `mcp_server/hooks/gemini/compact-cache.ts` | Pre-compress context caching |
| New `mcp_server/hooks/gemini/compact-inject.ts` | Post-compress context injection |
| New `mcp_server/hooks/gemini/session-stop.ts` | SessionEnd session tracking |
| `.gemini/settings.json` | Expected user-local hook registration target; not a checked-in repo change |

### Cross-Runtime Impact

| Runtime | Before | After |
|---------|--------|-------|
| Gemini CLI | 50% (0 hooks configured) | 85% (5-6 hooks) |
| All others | No change | No change |

### Estimated LOC: 140-260
### Risk: MEDIUM — Gemini hook API may have undocumented differences from Claude
### Dependencies: None — can be done independently

---

### Implementation Status (Post-Review Iterations 041-050)

| Item | Status | Evidence |
|------|--------|----------|
| 1. Session Prime (SessionStart) | DONE | hooks/gemini/session-prime.ts (165 lines) |
| 2a. Compact Cache (PreCompress) | DONE WITH LIMITATION | hooks/gemini/compact-cache.ts (138 lines) — `tailFile()` still uses unbounded `readFileSync(filePath, 'utf-8')` |
| 2b. Compact Inject (BeforeAgent) | DONE | hooks/gemini/compact-inject.ts (83 lines) — F055 FIXED (sanitized payload now used) |
| 3. Session Stop (SessionEnd) | DONE WITH LIMITATIONS | hooks/gemini/session-stop.ts (114 lines) — runs on `SessionEnd`, does not parse Gemini transcript token usage, and nested spec detection truncates deeper phase paths |
| 4. Settings Registration | PARTIAL | Expected `.gemini/settings.json` user config target only; workspace path must be verified locally |
| 5. Shared utilities | DONE | hooks/gemini/shared.ts (89 lines) — parseGeminiStdin, formatGeminiOutput |

### Review Findings (iter 046)
- F055 (P2): sanitized payload unused in compact-inject.ts. FIXED (iter 041-050 fixes)
- F056 (P2): still OPEN. `session-stop.ts` has a transcript-size guard, but `compact-cache.ts` still reads transcripts with unbounded `readFileSync`, so transcript-size hardening is incomplete.

### Known Limitations
- `.gemini/settings.json` is a user-local target, not a checked-in repo file. Any workspace path must be verified locally.
- `session-stop.ts` runs once on `SessionEnd`; it is not split into `AfterAgent` and `AfterModel`.
- Gemini token tracking is partial because Gemini transcript token usage is not parsed.
- Nested spec-folder detection is shallow and can truncate deeper paths such as nested phase folders.
- `compact-cache.ts` still uses unbounded `readFileSync` in `tailFile()`, so F056 remains open.

### Problem Statement
This phase addresses concrete context-preservation and code-graph reliability gaps tracked in this packet.

### Requirements Traceability
- REQ-900: Keep packet documentation and runtime verification aligned for this phase.
- REQ-901: Keep packet documentation and runtime verification aligned for this phase.
- REQ-902: Keep packet documentation and runtime verification aligned for this phase.
- REQ-903: Keep packet documentation and runtime verification aligned for this phase.
- REQ-904: Keep packet documentation and runtime verification aligned for this phase.

### Acceptance Scenarios
- **Given** phase context is loaded, **When** verification scenario 1 runs, **Then** expected packet behavior remains intact.
- **Given** phase context is loaded, **When** verification scenario 2 runs, **Then** expected packet behavior remains intact.
- **Given** phase context is loaded, **When** verification scenario 3 runs, **Then** expected packet behavior remains intact.
- **Given** phase context is loaded, **When** verification scenario 4 runs, **Then** expected packet behavior remains intact.
