# Upstream Sync Workflow

> Steps for merging a new upstream `cocoindex-code` release into the spec-kit fork while preserving the 009 packet patches.

---

## 1. OVERVIEW

This guide explains how to pull a new upstream `cocoindex-code` release into the vendored soft-fork at `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/` without losing the 009 packet modifications. The workflow uses `scripts/update.sh` to surface diffs, then walks through manual merge, version bump, attribution updates, reinstall, and acceptance probes.

### When to Sync

Sync when upstream releases a new version that contains:

- Bug fixes affecting the daemon, query path, or indexer.
- New features that add value to the spec-kit workflow.
- Security patches.

Check upstream releases at https://github.com/cocoindex-io/cocoindex-code/releases or via `pip index versions cocoindex-code`.

---

## 2. SYNC STEPS

### Step 1: Run the Sync Helper

```bash
bash .opencode/skill/mcp-coco-index/scripts/update.sh [target-version]
```

Omit `target-version` to use the latest PyPI release. The script:

- Downloads the upstream tarball into a temp dir.
- Diffs every Python file against the vendored copy.
- Flags `indexer.py`, `query.py`, and `schema.py` as PATCHED FILES that need manual merging.
- Prints the 009 patch summary so the merger knows what to re-apply.
- Cleans up the temp dir on exit.

### Step 2: Apply Non-Patched Updates

For files marked `ⓘ updated upstream`:

```bash
cp /tmp/cocoindex-upstream-XXXXX/cocoindex_code/<file>.py \
   .opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/<file>.py
```

### Step 3: Manually Merge Patched Files

For files marked `⚠ PATCHED FILE WITH UPSTREAM CHANGES`:

1. Open both versions side-by-side.
2. Apply the upstream non-conflicting changes.
3. Preserve the 009 patches by locating the `# Modified by spec-kit-skilled-agent-orchestration` header.
4. Re-apply the 009 patches on any new or changed code paths.

The 009 patches per file:

- `indexer.py`: REQ-002 (`source_realpath` and `content_hash`) plus REQ-004 (`path_class`).
- `query.py`: REQ-003 (over-fetch and dedup with `dedupedAliases` and `uniqueResultCount`) plus REQ-005 (bounded reranking) plus REQ-006 (`rankingSignals`).
- `schema.py`: REQ-002 and REQ-004 schema fields.

### Step 4: Bump Version

Edit both `mcp_server/cocoindex_code/_version.py` and `mcp_server/pyproject.toml`:

- New upstream version: `<new-version>+spec-kit-fork.0.1.0` (resets the local segment).
- New patch on the same upstream: `<same-version>+spec-kit-fork.0.X.Y` (bumps the local segment).

### Step 5: Update NOTICE

Append a new "Sync from upstream X.Y.Z" entry to `.opencode/skill/mcp-coco-index/NOTICE` with the date and any breaking changes.

### Step 6: Add Changelog Entry

Prepend a new entry to `.opencode/skill/mcp-coco-index/changelog/CHANGELOG.md` under the new version.

### Step 7: Reinstall and Reindex

```bash
bash .opencode/skill/mcp-coco-index/scripts/install.sh
.opencode/skill/mcp-coco-index/mcp_server/.venv/bin/ccc reset
.opencode/skill/mcp-coco-index/mcp_server/.venv/bin/ccc index
.opencode/skill/mcp-coco-index/mcp_server/.venv/bin/ccc --version  # verify version string
```

### Step 8: Run Acceptance Probes

```bash
ccc search "semantic search vector embedding implementation" --limit 10
# Expected: dedupedAliases > 0, at most one unique chunk per logical location.

ccc search "code graph traversal callers query" --limit 10
# Expected: implementation source in the top 3 results.
```

### Step 9: Commit and Push

One commit per sync. Use the message format:

```
chore(mcp-coco-index): sync upstream cocoindex-code <version> [spec-kit-fork.<new>]
```

---

## 3. CONFLICT RESOLUTION

If upstream restructures a function the fork patches, true conflict resolution is needed:

1. Take time to understand both changes. What is upstream trying to do?
2. If the 009 patch is still meaningful, re-apply on top of the new structure.
3. If upstream made the patch obsolete (rare), remove the patch and add a regression note to the changelog.
4. If the conflict is unresolvable, open a GitHub issue against upstream describing the spec-kit use case and request a contract that supports both behaviors.

---

## 4. SKIP-SYNC ESCAPE HATCH

If a sync introduces too many conflicts and the fork needs to ship, stay on the current `+spec-kit-fork.X.Y` version and document the deferred sync in NOTICE. Better to be one upstream release behind than to break the local 009 fixes.

---

## 5. RELATED DOCUMENTS

| Document | Purpose |
|----------|---------|
| [`./README.md`](./README.md) | Folder overview and key reference |
| [`../NOTICE`](../NOTICE) | Apache 2.0 attribution and modification log |
| [`../changelog/CHANGELOG.md`](../changelog/CHANGELOG.md) | Per-version change history |
| [`../scripts/update.sh`](../scripts/update.sh) | Sync helper invoked in Step 1 |
| [`../scripts/install.sh`](../scripts/install.sh) | Editable install used in Step 7 |
