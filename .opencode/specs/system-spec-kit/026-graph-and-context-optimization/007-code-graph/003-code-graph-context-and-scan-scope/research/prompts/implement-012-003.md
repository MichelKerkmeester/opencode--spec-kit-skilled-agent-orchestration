# Plan + Implement: Defense-in-Depth Cross-File Symbol Dedup (Packet 012/003)

You are implementing the follow-up to packet 012/002, which fixed the stale-gate bug but left a residual issue: live `code_graph_scan({incremental:false})` produces UNIQUE constraint failures on ~518 of 1,396 files (~37%), causing those files to have ZERO nodes persisted despite their `code_files` row reporting node_count > 0.

## CONTEXT (read first)

- **Research:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/007-deep-review-remediation-pt-04/research.md`
- **Prior packet:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-code-graph-package/003-code-graph-context-and-scan-scope/002-incremental-fullscan-recovery/`
- **Diagnostic finding:** Standalone parsing of all 1,858 candidate files via `parseFile()` produces ZERO cross-file symbol_id collisions (verified at `/tmp/collision-repro/simulate-db.mjs`). Yet the live MCP scan reproducibly fails on ~518 files with `UNIQUE constraint failed: code_nodes.symbol_id`. The discrepancy is unexplained but the fix is RUNTIME-INDEPENDENT defense-in-depth.

## SCOPE (Level 2 packet)

Path: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-code-graph-package/003-code-graph-context-and-scan-scope/003-cross-file-dedup-defense/`

Two layers of defense-in-depth (both required):

### Layer 1: Global cross-file dedup in `indexFiles()`

After all per-file `parseFile()` calls complete, before returning `results`, do ONE more sweep:

```typescript
// In indexFiles(), after the existing main loop and before/in place of
// the cross-file TESTED_BY edges block:

const globalSeenIds = new Set<string>();
for (const result of results) {
  const dedupedNodes: CodeNode[] = [];
  for (const node of result.nodes) {
    if (globalSeenIds.has(node.symbolId)) {
      // Drop: another file already owns this symbol_id this scan
      continue;
    }
    globalSeenIds.add(node.symbolId);
    dedupedNodes.push(node);
  }
  result.nodes = dedupedNodes;
}
```

Important constraints:
- This MUST run BEFORE the TESTED_BY cross-file edges loop (currently lines 1268-1290), because that loop builds `nodesByFile` from `result.nodes` and creates edges keyed by node.symbolId. If a node was dropped here, edges referencing it would point at nothing.
- Actually — preserve TESTED_BY edges that already exist. Move the global dedup AFTER the TESTED_BY edges block. The edges may reference dropped node IDs but that's a soft consistency issue (orphaned edges), not a UNIQUE crash.
- Update `result.nodes` (mutable ref) so downstream `result.nodes.length` reads see the deduped count.
- Optional: log the count of dropped nodes via `console.info` so operators see scope.

### Layer 2: `INSERT OR IGNORE` in `replaceNodes()`

In `code-graph/lib/code-graph-db.ts:308-312`:

```typescript
// BEFORE:
const insert = d.prepare(`
  INSERT INTO code_nodes (symbol_id, file_id, file_path, fq_name, kind, name,
    start_line, end_line, start_column, end_column, language, signature, docstring, content_hash)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

// AFTER:
const insert = d.prepare(`
  INSERT OR IGNORE INTO code_nodes (symbol_id, file_id, file_path, fq_name, kind, name,
    start_line, end_line, start_column, end_column, language, signature, docstring, content_hash)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);
```

This means:
- If `symbol_id` already exists in DB (from another file's row), the INSERT is silently skipped instead of raising UNIQUE constraint violation.
- The transaction completes; this file's other non-conflicting nodes still persist.
- Worst case: a few nodes are lost when their symbol_id collides cross-file (fixed by Layer 1 anyway). Best case: catastrophic 518-file failure becomes zero failures.
- Tradeoff: `replaceNodes` no longer rolls back on UNIQUE; bug in symbol_id generation would silently lose nodes. Layer 1 makes this an extreme corner case.

## DELIVERABLES

### A. NEW SPEC FOLDER (Level 2)

Create `003-cross-file-dedup-defense/` with canonical Level 2 docs:
- `spec.md` — problem (residual UNIQUE failures), scope (Layer 1 + Layer 2), requirements, non-goals
- `plan.md` — phase breakdown, dependencies
- `tasks.md` — T-001 through T-007 with file paths and expected diff sizes
- `checklist.md` — P0/P1 with measurable acceptance: zero `UNIQUE constraint failed` in scan errors[], filesIndexed should be ≥ 1300
- `decision-record.md` — ADR for "Why defense-in-depth instead of root-cause investigation" + "Why INSERT OR IGNORE over INSERT REPLACE"
- `description.json` + `graph-metadata.json` (copy/adapt from 012/002 sibling)

Validate: `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh <new-spec-folder> --strict` MUST exit 0.

### B. SOURCE PATCHES

T-001 — `lib/structural-indexer.ts`: Insert global dedup loop AFTER the TESTED_BY edges block (after current line 1290), BEFORE `return results` (current line 1292). Loop deduplicates `result.nodes` across all results. Log dropped count.

T-002 — `lib/code-graph-db.ts:308-312`: Change `INSERT INTO` to `INSERT OR IGNORE INTO` in the `replaceNodes` insert prepared statement.

### C. TESTS

T-003 — Add test in `tests/structural-contract.vitest.ts`:
```typescript
describe('indexFiles cross-file dedup (Layer 1)', () => {
  it('drops nodes whose symbol_id collides with previously-processed file', async () => {
    // Mock 2 IndexerConfig results sharing one symbol_id
    // Run indexFiles; assert second file has the colliding node removed
  });
  it('preserves all nodes when no cross-file collision', async () => { ... });
  it('logs dropped count', async () => { ... });
});
```

T-004 — Add test in `tests/code-graph-db.vitest.ts` (or wherever DB is tested):
```typescript
describe('replaceNodes INSERT OR IGNORE (Layer 2)', () => {
  it('does not throw UNIQUE constraint when colliding symbol_id from another file_id is already in DB', () => {
    // Setup: insert node with symbol_id X under file_id 1
    // Call replaceNodes(2, [{symbolId: X, ...}]) — should NOT throw
    // Assert: original row for file_id 1 with symbol_id X still exists; file_id 2 has 0 rows for X
  });
  it('still inserts non-conflicting nodes from same call', () => { ... });
});
```

### D. BUILD + VERIFY

```bash
cd .opencode/skill/system-spec-kit/mcp_server
npm run build
npx vitest run tests/structural-contract.vitest.ts tests/tree-sitter-parser.vitest.ts tests/code-graph-db.vitest.ts
```

Confirm dist updated. Confirm new tests pass + all existing tests pass.

### E. IMPLEMENTATION SUMMARY

`003-cross-file-dedup-defense/implementation-summary.md` with:
- Per-task changes
- Test counts before/after
- Acceptance criteria deferred to operator (live scan post-restart should report `errors: []` and `filesIndexed >= 1300`)
- `_memory.continuity` block

Run `validate.sh --strict` again post-implementation.

## CONSTRAINTS

- **DO NOT** modify packet 012, 012/001, or 012/002 source artifacts (cite them, don't edit).
- **DO NOT** commit or push.
- **DO NOT** restart the MCP server.
- **DO NOT** change generateSymbolId, capturesToNodes inner dedup, or attachFilePath logic — those are correct as shipped in 012/002.
- Use conventional commits format only IF you commit (you should NOT commit per above).

## ACCEPTANCE (this run is "done" when)

1. Spec docs exist + validate.sh --strict exits 0.
2. Both source patches applied (verify via grep for "globalSeenIds" and "INSERT OR IGNORE").
3. Vitest exits 0 with new tests included.
4. Build succeeds; dist contains the patches.
5. implementation-summary.md exists with `_memory.continuity` block.

Report: paths created/modified, test counts (before/after), build status, and the operator step (MCP restart + scan) needed to verify zero UNIQUE errors.

## START NOW

Read research.md first, then 012/002 implementation-summary.md, then create + patch + test + build + summarize.
