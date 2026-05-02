---
title: "Decision Record: Hook [system-spec-kit/024-compact-code-graph/014-hook-durability-auto-enrichment/decision-record]"
description: "Key decisions for session hashing, injection fencing, first-call priming, and graph enrichment timeout."
trigger_phrases:
  - "decision"
  - "record"
  - "hook"
  - "decision record"
  - "014"
importance_tier: "important"
contextType: "planning"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: decision-record-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/024-compact-code-graph/014-hook-durability-auto-enrichment"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["decision-record.md"]
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record-core | v2.2 -->
# Decision Record: Phase 014
Decision record anchor for structured retrieval.
<!-- SPECKIT_TEMPLATE_SHIM_START -->
<!-- Auto-generated compliance shim to satisfy required template headers/anchors. -->
## DR-000: Template Compliance Shim
Template compliance shim section. Legacy phase content continues below.

<!-- SPECKIT_TEMPLATE_SHIM_END -->

### DR-014-A: SHA-256 Session ID Hashing

**Decision:** Replace naive character sanitization with SHA-256 hash (16-char hex) for state filenames
**Date:** 2026-03-31
**Context:** Review F027 found that `.replace(/[^a-zA-Z0-9_-]/g, '_')` aliases distinct session IDs onto the same file. Two sessions with IDs like `ses/123` and `ses_123` would share state.
**Rationale:**
- SHA-256 gives collision resistance of 2^64 with 16 hex chars
- Deterministic: same input always produces same filename
- No information leakage: session ID not recoverable from hash
- Alternative (store full ID inside file, verify on load) adds I/O on every access
**Impact:** Distinct sessions always get separate state files. Existing state files become inaccessible (acceptable since they're ephemeral temp files).

### DR-014-B: Provenance Markers over Content Rewriting

**Decision:** Fence recovered content with `[SOURCE: hook-cache]` markers rather than attempting full content sanitization
**Date:** 2026-03-31
**Context:** Review F009 found transcript text replayed as trusted "Recovered Context" without injection fencing. An attacker-influenced transcript could inject instructions.
**Rationale:**
- Full sanitization is fragile (too aggressive = useful content stripped, too lenient = instructions pass through)
- Provenance markers let downstream consumers distinguish hook-recovered from fresh context
- Instruction-like pattern stripping (`You are`, `SYSTEM:`, etc.) is defense-in-depth, not primary defense
- Markers are machine-readable for future automated trust decisions
**Impact:** Recovered context clearly labeled as hook-cached. Known instruction patterns stripped as additional safety layer.

### DR-014-C: Module-Level Flag for Session Priming

**Decision:** Use a simple `let sessionPrimed = false` module-level flag, not persistent state
**Date:** 2026-03-31
**Context:** MCP first-call priming (Item 22) needs to detect the first tool call in a session across all 5 runtimes.
**Rationale:**
- Module-level flag resets on MCP server restart, which is operationally acceptable even though it is not a true session boundary
- Persistent state (DB or file) would require cleanup logic and could prime stale sessions
- The flag is idempotent: priming twice causes no harm (constitutional memories are cached)
- No external dependencies: works identically on all runtimes
**Impact:** The implementation is process-global, not truly session-scoped. If multiple sessions share one MCP server process, only the first session is primed until reset or restart. Server restart mid-session still causes re-priming, which remains acceptable.

### DR-014-D: 250ms Timeout for Graph Enrichment

**Decision:** Use `Promise.race` with 250ms timeout for tool-dispatch graph enrichment
**Date:** 2026-03-31
**Context:** Item 23 enriches non-graph tool responses with 1-hop graph neighbors. Graph queries are normally fast (<50ms) but DB initialization or large graphs could be slow.
**Rationale:**
- 250ms is imperceptible in tool response latency (tools typically take 500ms-2s)
- Hard timeout prevents graph issues from degrading the primary tool experience
- Returns status metadata (`ok`, `timeout`, `unavailable`) so callers can log/monitor
- Alternative (no timeout, async-only) risks blocking the response indefinitely
**Impact:** Graph enrichment is best-effort. Never slows down a tool call by more than 250ms.

### Context
Decision context and constraints are captured from the active phase deliverables.

### Consequences
This decision keeps packet behavior aligned with runtime truth and validation policy.

<!-- ANCHOR:adr-001 -->
ADR index anchor for structured retrieval.
<!-- /ANCHOR:adr-001 -->
