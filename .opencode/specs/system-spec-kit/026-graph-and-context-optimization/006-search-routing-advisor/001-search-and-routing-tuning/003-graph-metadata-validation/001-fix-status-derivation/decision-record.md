---
title: "Fix Graph Metadata Status Derivation - Decision Record"
status: complete
---
# Decision Record
## ADR-001: Use the Safer Checklist-Aware Completion Fallback
**Context:** The status derivation code now keeps override and ranked frontmatter precedence before falling back to implementation-summary/checklist evidence.
**Decision:** Keep override and frontmatter precedence in `mcp_server/lib/graph/graph-metadata-parser.ts:986-1013`, then promote to `complete` only when `checklist.md` is absent or evaluates as complete in `mcp_server/lib/graph/graph-metadata-parser.ts:1019-1040`.
**Rationale:** This matches the packet contract more closely than the one-line shortcut and avoids creating checklist-backed false positives.
**Consequences:** `deriveStatus()` grows a small helper, parser tests must cover the three fallback cases explicitly, and a later phase can revisit whether a distinct `in_progress` fallback is worth adding.
