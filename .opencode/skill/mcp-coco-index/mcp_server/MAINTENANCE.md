# Upstream Sync Workflow

This document explains how to merge a new upstream `cocoindex-code` release into the spec-kit fork while preserving the 009 packet patches.

## When to sync

Sync when upstream releases a new version that contains:
- Bug fixes affecting the daemon, query path, or indexer
- New features that add value to the spec-kit workflow
- Security patches

You can check upstream releases at https://github.com/cocoindex-io/cocoindex-code/releases or via `pip index versions cocoindex-code`.

## How to sync

### Step 1: Run the sync helper

```bash
bash .opencode/skill/mcp-coco-index/scripts/update.sh [target-version]
```

If you omit `target-version`, the script uses the latest PyPI release. The script:
- Downloads the upstream tarball into a temp dir
- Diffs every Python file against our vendored copy
- Flags `indexer.py`, `query.py`, `schema.py` as PATCHED FILES (these need manual merging)
- Prints the 009 patch summary so you know what to re-apply
- Cleans up the temp dir on exit

### Step 2: Apply non-patched updates

For files marked `ⓘ updated upstream`:
```bash
cp /tmp/cocoindex-upstream-XXXXX/cocoindex_code/<file>.py \
   .opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/<file>.py
```

### Step 3: Manually merge patched files

For files marked `⚠ PATCHED FILE WITH UPSTREAM CHANGES`:
1. Open both versions side-by-side
2. Apply upstream's non-conflicting changes
3. Preserve our 009 patches (look for the `# Modified by spec-kit-skilled-agent-orchestration` header)
4. Re-apply the 009 patches on any new/changed code paths

The 009 patches per file:
- **indexer.py**: REQ-002 (`source_realpath` + `content_hash`) + REQ-004 (`path_class`)
- **query.py**: REQ-003 (over-fetch + dedup + `dedupedAliases`/`uniqueResultCount`) + REQ-005 (bounded reranking) + REQ-006 (`rankingSignals`)
- **schema.py**: REQ-002 + REQ-004 schema fields

### Step 4: Bump version

Edit `mcp_server/cocoindex_code/_version.py` AND `mcp_server/pyproject.toml`:
- New upstream version: `<new-version>+spec-kit-fork.0.1.0` (reset local segment)
- New patch on same upstream: `<same-version>+spec-kit-fork.0.X.Y` (bump local segment)

### Step 5: Update NOTICE

Append a new "Sync from upstream X.Y.Z" entry to `.opencode/skill/mcp-coco-index/NOTICE` with the date and any breaking changes.

### Step 6: Add CHANGELOG entry

Prepend a new entry to `.opencode/skill/mcp-coco-index/changelog/CHANGELOG.md` under the new version.

### Step 7: Reinstall + reindex

```bash
bash .opencode/skill/mcp-coco-index/scripts/install.sh
.opencode/skill/mcp-coco-index/mcp_server/.venv/bin/ccc reset
.opencode/skill/mcp-coco-index/mcp_server/.venv/bin/ccc index
.opencode/skill/mcp-coco-index/mcp_server/.venv/bin/ccc --version  # verify version string
```

### Step 8: Run acceptance probes

Per the plan §Verification:
```bash
ccc search "semantic search vector embedding implementation" --limit 10
# Expected: dedupedAliases > 0; ≤ 1 unique chunk per logical location

ccc search "code graph traversal callers query" --limit 10
# Expected: implementation source in top 3 results
```

### Step 9: Commit + push

One commit per sync — clear message format:
```
chore(mcp-coco-index): sync upstream cocoindex-code <version> [spec-kit-fork.<new>]
```

## Conflict resolution checklist

If you hit a true conflict where upstream changes the structure of a function we patched:

1. Take time to understand both changes — what is upstream trying to do?
2. If our 009 patch is still meaningful: re-apply on top of upstream's new structure
3. If upstream made our patch obsolete (rare but possible): remove the patch and update CHANGELOG with the regression note
4. If the conflict is unresolvable: open a GitHub issue against upstream describing the spec-kit use case + ask for a contract that supports both behaviors

## Skip-sync escape hatch

If a sync introduces too many conflicts and you need to ship: stay on the current `+spec-kit-fork.X.Y` version and document the deferred sync in NOTICE. Better to be one upstream release behind than to break the local 009 fixes.
