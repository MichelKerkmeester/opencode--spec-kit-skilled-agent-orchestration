---
title: "Plan: Startup Highlights Remediation [system-spec-kit/024-compact-code-graph/028-startup-highlights-remediation/plan]"
description: "Implementation plan for 3 P1 fixes: deduplication, path exclusion, incoming-call heuristic in queryStartupHighlights()."
trigger_phrases:
  - "startup highlights plan"
  - "028 plan"
importance_tier: "important"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/024-compact-code-graph/028-startup-highlights-remediation"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["plan.md"]
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

# Plan: Startup Highlights Remediation

<!-- ANCHOR:summary -->
## 1. SUMMARY

Single-file SQL rewrite in `queryStartupHighlights()` with a 3-CTE chain:
1. `filtered_nodes` — apply path exclusion WHERE clauses
2. `aggregated` — GROUP BY display fields with incoming-call-count
3. `ranked` — ROW_NUMBER() OVER (PARTITION BY file_path) for diversity (existing P2 fix)
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- Keep the fix scoped to `queryStartupHighlights()` and the focused test coverage needed to prove the ranking/filtering behavior.
- Preserve the sibling diversity rule already established in the startup brief path.
- Revalidate with strict packet validation plus the existing targeted test/build evidence before closing.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
SQL Query Rewrite — modify the existing `queryStartupHighlights()` function in place. No new modules or interfaces.

### CTE Chain Design

```sql
WITH filtered_nodes AS (
  -- R2: Exclude vendored/test paths
  SELECT n.symbol_id, n.name, n.kind, n.file_path, n.start_line
  FROM code_nodes n
  WHERE n.kind IN ('class', 'function', 'method', 'interface', 'type_alias', 'module')
    AND n.file_path NOT LIKE '%/site-packages/%'
    AND n.file_path NOT LIKE '%/node_modules/%'
    AND n.file_path NOT LIKE '%/.venv/%'
    AND n.file_path NOT LIKE '%/vendor/%'
    AND n.file_path NOT LIKE '%/dist/%'
    AND n.file_path NOT LIKE '%/build/%'
    AND n.file_path NOT LIKE '%/__pycache__/%'
    AND n.file_path NOT LIKE '%/tests/%'
    AND n.file_path NOT LIKE '%/test_%'
    AND n.file_path NOT LIKE '%__tests__%'
),
aggregated AS (
  -- R1: Deduplicate by display fields
  -- R3: Count INCOMING calls (target_id = symbol_id)
  SELECT
    fn.name,
    fn.kind,
    fn.file_path,
    MIN(fn.start_line) as start_line,
    COALESCE(SUM(CASE WHEN UPPER(e.edge_type) = 'CALLS' THEN 1 ELSE 0 END), 0) as call_count
  FROM filtered_nodes fn
  LEFT JOIN code_edges e ON e.target_id = fn.symbol_id
  GROUP BY fn.name, fn.kind, fn.file_path
),
ranked AS (
  -- Diversity: max 2 per file (from P2-002 fix)
  SELECT *, ROW_NUMBER() OVER (
    PARTITION BY file_path
    ORDER BY call_count DESC, start_line ASC
  ) as file_rank
  FROM aggregated
)
SELECT name, kind, file_path, call_count
FROM ranked
WHERE file_rank <= 2
ORDER BY call_count DESC, start_line ASC
LIMIT ?
```

### Key Change: Edge Direction
- **Before**: `LEFT JOIN code_edges e ON e.source_id = n.symbol_id` (outgoing calls)
- **After**: `LEFT JOIN code_edges e ON e.target_id = fn.symbol_id` (incoming calls)

This surfaces nodes that are *called by* many others — the most depended-upon symbols.
<!-- /ANCHOR:architecture -->

### Technical Context

- The query lives in `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-db.ts`.
- The runtime consumer already expects compact startup highlights rather than a large report payload.
- Validation for this phase is documentation-heavy, but runtime proof still depends on build/test evidence from the underlying implementation.

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Verify Existing Call-Edge Orientation

Confirm the graph edge contract before changing ranking semantics so the remediation cannot flip the heuristic the wrong way.

Before changing from `source_id` to `target_id`, confirm that the tree-sitter parser creates CALLS edges with `source_id = caller, target_id = callee`. If reversed, adjust the join accordingly.

Check: `code_edges` table — find a known function call and verify source/target assignment.

### Phase 2: Rewrite And Re-rank Startup Highlights

Replace the current query with the 3-CTE chain above. Compose with the existing diversity CTE (from P2-002 fix) — the `ranked` CTE replaces the existing `ranked_highlights` CTE.

### Phase 3: Verify Runtime Output

Add test in `startup-brief.vitest.ts`:
- Insert test data with: project file, vendored file, test file, duplicate symbol names
- Verify: no duplicates in output, no vendored/test paths, ranking by incoming calls
- Verify: diversity limit (max 2 per file)

Run `queryStartupHighlights(5)` against the live database and confirm the top-5 are recognizable project symbols, not test harnesses or vendored code.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- Focused runtime validation through `startup-brief.vitest.ts`
- TypeScript/build verification for the workspace
- Live query check against the current database to confirm no duplicates or vendored/test pollution
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Existing P2-002 diversity CTE behavior from the startup brief work
- `code_edges` table directionality remaining `source_id = caller`, `target_id = callee`
- `startup-brief.vitest.ts` test infrastructure and current workspace build tooling
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

The change is confined to a single SQL query. Rollback = revert the function body to the pre-change version. No schema changes, no new tables, no migrations.
<!-- /ANCHOR:rollback -->
