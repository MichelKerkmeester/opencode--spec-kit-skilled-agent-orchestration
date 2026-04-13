---
title: "Fix Graph Metadata Status Derivation - Decision Record"
status: complete
---
# Decision Record
## ADR-001: Use the Safer Checklist-Aware Completion Fallback
**Context:** `../research/research.md:291-324` showed the one-line "implementation-summary means complete" rule would also promote 63 folders that still have incomplete checklists, even though it correctly fixes the larger high-confidence subset.
**Decision:** Keep override and frontmatter precedence in `mcp_server/lib/graph/graph-metadata-parser.ts:498-510`, then promote to `complete` only when `checklist.md` is absent or evaluates as complete.
**Rationale:** This matches the packet contract more closely than the one-line shortcut and avoids creating checklist-backed false positives.
**Consequences:** `deriveStatus()` grows a small helper, parser tests must cover the three fallback cases explicitly, and a later phase can revisit whether a distinct `in_progress` fallback is worth adding.
