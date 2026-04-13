---
title: "Sanitize Key Files in Graph Metadata - Decision Record"
status: complete
---
# Decision Record
## ADR-001: Use an Explicit Allowlist-and-Reject Predicate Before Merge
**Context:** `../research/research.md:241-270` froze the exact key-file predicate and showed the best results come from rejecting junk tokens before `deriveKeyFiles()` merges and truncates references.
**Decision:** Apply an explicit regex-plus-allowlist predicate to `referenced` and `fallbackRefs`, then append canonical packet docs after filtering.
**Rationale:** This removes the highest-volume junk classes while preserving canonical spec-doc entries and avoids turning the phase into a path-resolution project.
**Consequences:** Some non-canonical historical references will now be dropped at runtime, corpus verification must use the wave-3 predicate result as the source of truth, and any migration for older persisted data remains separate.
