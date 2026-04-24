---
title: "...outing-advisor/001-search-and-routing-tuning/003-graph-metadata-validation/001-fix-status-derivation/decision-record]"
description: 'title: "Fix Graph Metadata Status Derivation - Decision Record"'
trigger_phrases:
  - "outing"
  - "advisor"
  - "001"
  - "search"
  - "and"
  - "decision record"
  - "fix"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/003-graph-metadata-validation/001-fix-status-derivation"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["decision-record.md"]
status: complete
---
# Decision Record
## ADR-001: Use the Safer Checklist-Aware Completion Fallback
**Context:** The status derivation code now keeps override and ranked frontmatter precedence before falling back to implementation-summary/checklist evidence.
**Decision:** Keep override and frontmatter precedence in `mcp_server/lib/graph/graph-metadata-parser.ts:986-1013`, then promote to `complete` only when `checklist.md` is absent or evaluates as complete in `mcp_server/lib/graph/graph-metadata-parser.ts:1019-1040`.
**Rationale:** This matches the packet contract more closely than the one-line shortcut and avoids creating checklist-backed false positives.
**Consequences:** `deriveStatus()` grows a small helper, parser tests must cover the three fallback cases explicitly, and a later phase can revisit whether a distinct `in_progress` fallback is worth adding.
