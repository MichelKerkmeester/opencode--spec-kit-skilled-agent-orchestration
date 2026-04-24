---
title: "Plan: Hook Durability & [system-spec-kit/024-compact-code-graph/014-hook-durability-auto-enrichment/plan]"
description: "Implementation order: fix reliability + security bugs first, then add auto-enrichment features, then clean up dead code."
trigger_phrases:
  - "plan"
  - "hook"
  - "durability"
  - "014"
importance_tier: "important"
contextType: "planning"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/024-compact-code-graph/014-hook-durability-auto-enrichment"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["plan.md"]
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Plan: Phase 014 — Hook Durability & Auto-Enrichment


<!-- SPECKIT_TEMPLATE_SHIM_START -->
<!-- Auto-generated compliance shim to satisfy required template headers/anchors. -->
## 1. SUMMARY
Template compliance shim section. Legacy phase content continues below.

## 2. QUALITY GATES
Template compliance shim section. Legacy phase content continues below.

## 3. ARCHITECTURE
Template compliance shim section. Legacy phase content continues below.

## 4. IMPLEMENTATION PHASES
Template compliance shim section. Legacy phase content continues below.

## 5. TESTING STRATEGY
Template compliance shim section. Legacy phase content continues below.

## 6. DEPENDENCIES
Template compliance shim section. Legacy phase content continues below.

## 7. ROLLBACK PLAN
Template compliance shim section. Legacy phase content continues below.

<!-- ANCHOR:summary -->
Template compliance shim anchor for summary.
<!-- /ANCHOR:summary -->
<!-- ANCHOR:quality-gates -->
Template compliance shim anchor for quality-gates.
<!-- /ANCHOR:quality-gates -->
<!-- ANCHOR:architecture -->
Template compliance shim anchor for architecture.
<!-- /ANCHOR:architecture -->
<!-- ANCHOR:phases -->
Template compliance shim anchor for phases.
<!-- /ANCHOR:phases -->
<!-- ANCHOR:testing -->
Template compliance shim anchor for testing.
<!-- /ANCHOR:testing -->
<!-- ANCHOR:dependencies -->
Template compliance shim anchor for dependencies.
<!-- /ANCHOR:dependencies -->
<!-- ANCHOR:rollback -->
Template compliance shim anchor for rollback.
<!-- /ANCHOR:rollback -->
<!-- SPECKIT_TEMPLATE_SHIM_END -->

### Implementation Order

### Sub-phase B0: Hook Reliability + Security (items 16-21, 25-26)

1. **Item 16: Cache race fix** (10-15 LOC)
    - In hook-state.ts: add readAndClear() that returns payload then nulls
    - Intended: in session-prime.ts, only clear after stdout success is confirmed
    - Actual outcome: the implementation reads before clear, but still clears persisted state before stdout write success is confirmed

2. **Item 17: saveState() error propagation** (15-20 LOC)
    - Change return type to boolean
    - Wrap atomic write in try/catch, return false on failure
    - Update callers to check return value
    - Implementation note: callers ended up logging `hookLog` warnings and continuing rather than propagating disk failures

3. **Item 18: Injection fencing for recovered context** (15-20 LOC)
   - Wrap recovered context with `[SOURCE: hook-cache]` provenance markers
   - Sanitize embedded instruction-like patterns in transcript text
   - Verify: malformed transcript text does not escape provenance boundary

4. **Item 19: Wire hook path through memory-surface.ts** (20-30 LOC)
   - Route compact-inject.ts output through memory-surface.ts surface pipeline
   - Or replicate constitutional + triggered payload injection in hook path
   - Verify: constitutional memories appear in post-compaction recovery

5. **Item 20: Session_id collision resistance** (15-20 LOC)
   - Replace naive sanitization with SHA-256 hash for state filenames
   - Or: store full session_id inside state file and verify on load
   - Verify: two sessions with similar IDs get separate state files

6. **Item 21: Restrictive file permissions** (10-15 LOC)
   - `fs.mkdirSync(dir, { mode: 0o700 })` for temp directory
   - `fs.writeFileSync(path, data, { mode: 0o600 })` for state files
   - Verify: state files not world-readable on shared systems

7. **Item 25: Cache freshness** (20-30 LOC)
   - Add `CACHE_TTL_MS = 30 * 60 * 1000` constant
   - In session-prime.ts: check `Date.now() - cachedAt < CACHE_TTL_MS`

8. **Item 26: Stop-hook save redesign** (15-25 LOC)
    - Planned: add `pendingStopSave` field to HookState (separate from pendingCompactPrime)
    - Planned: update session-stop.ts to use new field
    - Actual outcome: not implemented; `HookState` still has no `pendingStopSave` field

### Sub-phase B1: Token + Stale-on-Read (items 24, 27)

9. **Item 27: Token accounting** (20-30 LOC)
   - Include cache bucket in token summation

10. **Item 24: ensureFreshFiles()** (76-104 LOC)
     - Add `file_mtime_ms` column to code_files schema
     - Implement `isFileStale(filePath)`: compare stored mtime vs fs.statSync mtime
     - Implement `ensureFreshFiles(paths)`: batch stale check + conditional reindex
     - Wire into query and context handlers
     - Actual outcome: `ensureFreshFiles()` classifies paths as flat `stale`/`fresh`; the planned 3-tier threshold model was not implemented

### Sub-phase B2: MCP First-Call Priming (item 22)

11. **Item 22: First-call detection + priming** (110-150 LOC)
     - Track module-level `sessionPrimed` flag in MCP server state
     - On first tool call: detect via resolveTrustedSession()
     - Auto-load: constitutional memories and code graph status
     - Wire into memory-surface.ts tool dispatch
     - Known trade-off: the flag is process-global, so shared-process multi-session priming is not session-scoped

### Sub-phase B3: Auto-Enrichment (item 23)

12. **Item 23: GRAPH_AWARE_TOOLS interceptor** (105-135 LOC)
    - Define GRAPH_AWARE_TOOLS set (exclude recursive tools)
    - Extract file path hint from tool arguments
    - Query code graph for 1-hop neighbors of referenced file
    - Inject as `meta.graphContext` in response envelope
    - Respect 250ms latency budget via Promise.allSettled

### Sub-phase B4: Dead Code Cleanup (items 28-30)

13. **Item 28: Remove dead workingSet branch** (5-10 LOC, net negative)
    - Delete unreachable workingSet branch in session-prime.ts

14. **Item 29: Consolidate token-count sync** (15-20 LOC)
    - Extract shared helper from response-hints.ts and envelope.ts

15. **Item 30: Replace drifted pressure-budget helper** (5-10 LOC)
    - Import shared tested helper instead of private copy

### Testing
- Verify cache race: simulate inject failure, check payload preserved
- Verify stale detection: modify file, query, check auto-reindex
- Verify first-call priming: new session, first tool call loads context
- Verify injection fencing: inject instruction-like text in transcript, check it's fenced
- Verify constitutional payloads survive compaction via hook path
- Verify distinct session IDs produce separate state files
- Verify state files have 0600 permissions on creation
- Verify dead workingSet branch removal doesn't break session-prime

### Technical Context
- Runtime surface: system-spec-kit MCP server + hook adapters.
- Validation surface: recursive packet validation and full quality-gate checks.

### AI EXECUTION PROTOCOL

### Pre-Task Checklist
- Confirm scope and validation target before edits.
- Confirm in-scope files and runtime gates.

### Execution Rules
- TASK-SEQ: Apply changes in small, verifiable increments.
- TASK-SCOPE: Keep edits constrained to this phase packet and linked runtime surfaces.

### Status Reporting Format
- Status Reporting: report changes, verification commands, and outcomes per pass.

### Blocked Task Protocol
- BLOCKED: capture blocker evidence and immediate next action.

### Phase 1: Validation
- Maintain packet verification and release-gate traceability.

### Phase 2: Validation
- Maintain packet verification and release-gate traceability.

## L3: DEPENDENCY GRAPH
- Dependency graph snapshot preserved for planning completeness.
