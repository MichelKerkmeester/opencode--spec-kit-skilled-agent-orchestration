# Research Iteration 009: Snapshot Export/Import Contract Design

## Focus

Use `opencode-lcm` to refine a graph-adjacent export/import contract for the current compact code graph runtime.

## Findings

### Our Main Portability Blocker Is Identity Coupling

The current graph derives structural identity from file paths:

- scanned files resolve to full paths [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts:1065-1067`]
- symbol IDs are generated from `filePath`, `fqName`, and kind [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/indexer-types.ts:68-74`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts:688-705`]
- `code_files.file_path` and `code_nodes.symbol_id` are unique keys [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts:28-57`]

That means raw graph dumps are not portable across worktrees without identity rewriting.

### `auto` Rehome Should Be Narrow

`opencode-lcm`'s `auto` worktree rehome is intentionally limited:

- only rehome if the snapshot came from exactly one worktree
- preserve multi-worktree snapshots unless explicitly forced

[SOURCE: `external/opencode-lcm-master/src/store-snapshot.ts:196-216`] [SOURCE: `external/opencode-lcm-master/src/store-snapshot.ts:545-570`]

That is a better default than broad implicit remapping.

### Structural Collisions And Content Dedupe Are Different Problems

The plugin separates:

- merge-mode identity collisions, which fail before writes
- content-addressed blob dedupe, which can safely `INSERT OR REPLACE`

[SOURCE: `external/opencode-lcm-master/src/store-snapshot.ts:196-216`] [SOURCE: `external/opencode-lcm-master/src/store.ts:915-920`] [SOURCE: `external/opencode-lcm-master/src/store-snapshot.ts:249-251`] [SOURCE: `external/opencode-lcm-master/src/store-snapshot.ts:290-291`]

We should carry the same distinction:

- structural identity conflicts should be hard failures
- graph-adjacent payload blobs can dedupe softly

### Import Must Be A Finalization Pipeline

`opencode-lcm` does not treat import as a plain copy. It finalizes by:

- backfilling blobs
- refreshing lineage / derived state
- refreshing indexes

[SOURCE: `external/opencode-lcm-master/src/store-snapshot.ts:335-338`]

Our future graph import flow needs the same notion of post-import repair/finalization.

## Recommendations

1. Export graph state with root-relative file paths and rehydratable symbol identities, not absolute path-derived IDs as canonical portable identity.
2. Expose import modes like `replace|merge` and `preserve|current|map`, with narrow `auto` behavior if added later.
3. Preflight collisions separately as:
   - `filePathConflicts`
   - `symbolIdConflicts`
   - `schemaMismatch`
   - `gitHeadMismatch`
4. Require post-import repair/recompute before imported graph state is considered live.

## Duplication Check

This is new relative to earlier packet research because it pins down the actual portability blocker:

- path-derived identity
- narrow auto-rehome semantics
- the difference between structural conflicts and content dedupe
- import finalization as a required stage, not an optional cleanup
