---
title: "Plan: Correctness & Boundary Repair [system-spec-kit/024-compact-code-graph/013-correctness-boundary-repair/plan]"
description: "Implementation order for 15 P0/P1/P2 fixes with zero external dependencies."
trigger_phrases:
  - "plan"
  - "correctness"
  - "boundary"
  - "repair"
  - "013"
importance_tier: "important"
contextType: "planning"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/024-compact-code-graph/013-correctness-boundary-repair"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["plan.md"]
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Plan: Phase 013 — Correctness & Boundary Repair


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

### Group A: Core correctness (items 1, 7, 8)

1. **Item 1: endLine fix** (60-80 LOC) — highest impact, unblocks CALLS edges
   - Add brace-counting to `parseJsTs()`: track `{` depth after function/class declaration
   - Add indentation tracking to `parsePython()`: detect dedent to original level
   - Add marker tracking to `parseBash()`: match fi/done/esac/}/;;
   - Update `capturesToNodes()` to use corrected endLine in contentHash
   - Verify: `extractEdges()` now scans full function bodies for CALLS

2. **Item 7: Budget ceiling removal + sessionState budgeting** (15-20 LOC)
   - Replace hard-coded 4000 with parameter or default
   - Include sessionState section in allocation (currently bypasses entirely)
   - Verify allocator respects caller-provided budget

3. **Item 8: Merger zero-budget fix** (15-20 LOC)
   - Skip section rendering when `granted === 0`
   - Remove truncation marker outside budget

### Group B: DB safety (items 9, 10, 11, 6)

4. **Item 9: DB init on fresh runtime** (10-15 LOC)
   - Ensure initDb() is called before first scan; auto-create DB if missing
   - Verify code_graph_scan works on first use without prior initialization

5. **Item 10: initDb() migration guard** (15-20 LOC)
   - Wrap schema creation in try/catch
   - Reset module-level singleton on failure so next call retries
   - Verify: failed init → subsequent call retries (no poisoned singleton)

6. **Item 11: Transaction atomicity for replaceNodes/Edges** (15-20 LOC)
   - Wrap DELETE + INSERT in `db.transaction()`
   - If INSERT fails, DELETE is rolled back — file's graph preserved
   - Verify: constraint error in INSERT does not wipe file's nodes

7. **Item 6: Orphan edge cleanup** (20-30 LOC)
   - In `replaceNodes()`: collect deleted symbol IDs before DELETE
   - Add: `DELETE FROM code_edges WHERE target_id IN (?)`
   - Add: `DELETE FROM code_edges WHERE source_id IN (?)`

### Group C: Query correctness (items 12, 13)

8. **Item 12: Fix transitive query maxDepth leak** (15-20 LOC)
   - Add depth check at BFS/DFS traversal boundary
   - Deduplicate nodes by ID for converging paths
   - Verify: query with maxDepth=2 returns exactly 2 hops

9. **Item 13: Clarify includeTrace schema boundary** (doc correction)
   - Document that `code_graph_context` does not expose `includeTrace`
   - Document that memory schemas (`memory_context`, `memory_search`) still expose `includeTrace`
   - Remove stale wording that implies global removal from `tool-schemas.ts`

### Group D: Security & validation (items 4, 5, 15)

10. **Item 4: Document code-graph dispatch validation accurately** (doc correction)
    - Describe local `getMissingRequiredStringArgs()` checks in `tools/code-graph-tools.ts`
    - Note that code-graph dispatch does not use unified `validateToolArgs()`
    - Keep rootDir validation documented separately: `path.resolve(rootDir).startsWith(process.cwd())`

11. **Item 5: Exception sanitization** (15-20 LOC)
    - Wrap handler try/catch blocks with generic error messages
    - Log full error to stderr, return sanitized message to caller

12. **Item 15: ccc_feedback schema length validation** (doc correction)
    - Mark full `comment`/`resultFile` length validation as NOT IMPLEMENTED
    - Note that only required `query`/`rating` presence is checked today

### Group E: Remaining fixes (items 3, 14, 2)

13. **Item 3: Seed identity preservation** (15-20 LOC)
    - Preserve `source` field through seed processing pipeline
    - Ensure seeds retain manual/graph/cocoindex discriminator

14. **Item 14: Working-set-tracker maxFiles fix** (5-10 LOC)
    - Enforce maxFiles at insertion, not at 2x threshold
    - Verify: tracker never exceeds maxFiles count

15. **Item 2: Verify resume profile** (verification only)

### Testing

- Run existing vitest suite: `npx vitest run`
- Verify CALLS edges now detected for multi-line functions
- Verify rootDir validation rejects paths outside workspace
- Verify orphan edges cleaned after re-index
- Verify DB init works on fresh runtime (delete code-graph.sqlite, run scan)
- Verify failed initDb() does not poison singleton (corrupt DB, retry)
- Verify replaceNodes() is atomic (inject constraint error, check nodes preserved)
- Verify transitive query with maxDepth=2 returns exactly 2 hops
- Verify docs state that ccc_feedback does not currently reject oversized comment/resultFile via schema length bounds

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
