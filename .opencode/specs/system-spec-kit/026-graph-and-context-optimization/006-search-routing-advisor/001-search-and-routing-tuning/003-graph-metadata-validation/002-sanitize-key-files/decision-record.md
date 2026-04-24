---
title: "...h-routing-advisor/001-search-and-routing-tuning/003-graph-metadata-validation/002-sanitize-key-files/decision-record]"
description: 'title: "Sanitize Key Files in Graph Metadata - Decision Record"'
trigger_phrases:
  - "routing"
  - "advisor"
  - "001"
  - "search"
  - "and"
  - "decision record"
  - "002"
  - "sanitize"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/003-graph-metadata-validation/002-sanitize-key-files"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["decision-record.md"]
status: complete
---
# Decision Record
## ADR-001: Use an Explicit Allowlist-and-Reject Predicate Before Merge
**Context:** `../research/research.md:241-270` froze the exact key-file predicate and showed the best results come from rejecting junk tokens before `deriveKeyFiles()` merges and truncates references.
**Decision:** Apply an explicit regex-plus-allowlist predicate to `referenced` and `fallbackRefs`, then append canonical packet docs after filtering.
**Rationale:** This removes the highest-volume junk classes while preserving canonical spec-doc entries and avoids turning the phase into a path-resolution project.
**Consequences:** Some non-canonical historical references will now be dropped at runtime, corpus verification must use the wave-3 predicate result as the source of truth, and any migration for older persisted data remains separate.
