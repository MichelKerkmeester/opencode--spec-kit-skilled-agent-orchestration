---
title: "...dvisor/001-search-and-routing-tuning/003-graph-metadata-validation/004-normalize-legacy-files/implementation-summary]"
description: "Narrows graph-metadata backfill traversal to active packets by default while preserving an explicit archive opt-in."
trigger_phrases:
  - "graph metadata active only"
  - "backfill include archive"
  - "normalize legacy graph metadata traversal"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/003-graph-metadata-validation/004-normalize-legacy-files"
    last_updated_at: "2026-04-13T00:00:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Restricted graph-metadata backfill to active packets by default and added explicit archive controls"
    next_safe_action: "Use --include-archive only for deliberate historical sweeps"
    key_files:
      - "implementation-summary.md"
      - ".opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts"
closed_by_commit: 2958485d9f
status: complete
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->"
---
# Implementation Summary: Normalize Legacy Graph Metadata Files

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

## Metadata

| Field | Value |
|-------|-------|
| Spec Folder | `004-normalize-legacy-files` |
| Completed | `2026-04-13` |
| Level | `2` |

## What Was Built

This post-review remediation tightened the graph-metadata backfill traversal so active packets are the default corpus. `scripts/graph/backfill-graph-metadata.ts` now skips `z_archive` and `z_future` folders unless the operator explicitly opts back in with `--include-archive`, and the CLI accepts `--active-only` as the explicit active-corpus mode.

The script regression suite now proves both sides of the contract: default traversal ignores archived packets, while the archive-inclusive path still finds the full historical corpus when requested.

## Verification

| Check | Result |
|-------|--------|
| `cd .opencode/skill/system-spec-kit/scripts && npx tsc --noEmit` | PASS |
| `cd .opencode/skill/system-spec-kit && NODE_PATH=./mcp_server/node_modules ./mcp_server/node_modules/.bin/vitest run scripts/tests/graph-metadata-backfill.vitest.ts` | PASS (`1` file, `3` tests) |
| `node scripts/dist/graph/backfill-graph-metadata.js --active-only` | PASS |

## Notes

- This fix is intentionally operational rather than schema-level. Existing archive packets still backfill correctly when `--include-archive` is supplied.
- The script-local `npx vitest` entrypoint still fails in this workspace because `vitest.config.ts` resolves `vitest/config` through the skill-root dependency graph; the repo-local binary plus `NODE_PATH=./mcp_server/node_modules` is the passing path that matches the current environment.
