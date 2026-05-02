---
title: "Decision Record: Correctness [system-spec-kit/024-compact-code-graph/013-correctness-boundary-repair/decision-record]"
description: "Key decisions for endLine heuristic, DB singleton recovery, code_graph_context includeTrace boundary, and maxDepth semantics."
trigger_phrases:
  - "decision"
  - "record"
  - "correctness"
  - "decision record"
  - "013"
importance_tier: "important"
contextType: "planning"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: decision-record-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/024-compact-code-graph/013-correctness-boundary-repair"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["decision-record.md"]
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record-core | v2.2 -->
# Decision Record: Phase 013
Decision record anchor for structured retrieval.
<!-- SPECKIT_TEMPLATE_SHIM_START -->
<!-- Auto-generated compliance shim to satisfy required template headers/anchors. -->
## DR-000: Template Compliance Shim
Template compliance shim section. Legacy phase content continues below.

<!-- SPECKIT_TEMPLATE_SHIM_END -->

### DR-013-A: Brace-Counting Heuristic for endLine

**Decision:** Fix endLine using regex brace-counting, not tree-sitter AST
**Date:** 2026-03-31
**Context:** The endLine bug (all parsers set endLine=startLine) is a P0 blocker for CALLS edge detection and contentHash. Tree-sitter would also fix this but requires Phase 015 (WASM bundles, ~1.5MB).
**Rationale:**
- Brace-counting is ~60 LOC across 3 helpers, zero dependencies
- Tree-sitter is 200+ LOC with external WASM grammars
- The adapter interface (Phase 015) means the heuristic is replaceable
- String literals containing `{}` can shift the count, but this is rare in practice
**Impact:** Unblocks CALLS edge detection for all multi-line functions. Phase 015 tree-sitter will provide exact ranges.

### DR-013-B: Reset Singleton on initDb Failure

**Decision:** On initDb() error, reset both `db` and `dbPath` to null before rethrowing
**Date:** 2026-03-31
**Context:** The module-level singleton pattern means a failed init poisons all subsequent calls. Rethrowing alone leaves dbPath set, which can confuse getDb() callers.
**Rationale:**
- Full reset allows the next initDb() call to retry from scratch
- The alternative (lazy retry inside getDb()) adds complexity to every read path
- better-sqlite3 Database constructor can fail on corrupted files or permission issues
**Impact:** Transient failures (disk full, locked file) are now recoverable without process restart.

### DR-013-C: Document includeTrace as a Code-Graph-Specific Boundary

**Decision:** Document `includeTrace` as absent from `code_graph_context`, not as globally removed from `tool-schemas.ts`
**Date:** 2026-03-31
**Context:** Review F033 concerns the `code_graph_context` schema. `memory_context` and `memory_search` still expose `includeTrace`, while `code_graph_context` does not.
**Rationale:**
- The docs drift came from overstating a code-graph-specific omission as a global schema removal
- Memory tools still use `includeTrace` for provenance-rich retrieval, so global-removal wording is false
- The correct boundary is narrower: absent for `code_graph_context`, still present for memory tools
**Impact:** Phase 013 docs now distinguish code-graph schema reality from memory schema reality.

### DR-013-D: Strict maxDepth Boundary (>= not >)

**Decision:** Change transitive BFS depth check from `> maxDepth` to `>= maxDepth`
**Date:** 2026-03-31
**Context:** Review F026 found nodes leaking beyond maxDepth. With `>`, nodes at depth=maxDepth still expanded their edges, adding depth+1 results.
**Rationale:**
- maxDepth=2 should return nodes at depths 0, 1, 2 (inclusive) but not explore from depth=2
- The `>=` check stops expansion at the boundary while keeping boundary nodes in results
- Combined with symbolId deduplication, this eliminates both the leak and duplicate paths
**Impact:** Transitive query results are now bounded and deduplicated as callers expect.

### Context
Decision context and constraints are captured from the active phase deliverables.

### Consequences
This decision keeps packet behavior aligned with runtime truth and validation policy.

<!-- ANCHOR:adr-001 -->
ADR index anchor for structured retrieval.
<!-- /ANCHOR:adr-001 -->
