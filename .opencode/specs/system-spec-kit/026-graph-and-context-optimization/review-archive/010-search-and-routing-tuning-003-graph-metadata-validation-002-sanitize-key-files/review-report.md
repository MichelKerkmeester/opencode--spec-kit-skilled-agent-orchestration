---
title: "Phase Review Report: 002-sanitize-key-files"
description: "10-iteration deep review of 002-sanitize-key-files. Verdict CONDITIONAL with 0 P0 / 0 P1 / 1 P2 findings."
importance_tier: "important"
contextType: "review-report"
---

# Phase Review Report: 002-sanitize-key-files

## 1. Overview

Ten iterations covered the `keepKeyFile()` predicate, the focused Vitest coverage, and a corpus audit over the active non-archived graph metadata files. Verdict `CONDITIONAL`: the parser change itself is sound and the active corpus now shows zero noisy `key_files` entries, but the default backfill sweep is broader than the verification scope used by this phase.

## 2. Findings

### P2

1. The default backfill dry-run does not reproduce the active-corpus verification scope that this phase relies on. `collectSpecFolders()` only excludes `memory`, `scratch`, `node_modules`, and dot-directories, so a raw dry-run refreshes `536` packets across active, archived, and future trees instead of the `360` active no-archive packets used for the zero-noise verification result. [SOURCE: .opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:16] [SOURCE: .opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:81] [SOURCE: dry-run output from `node .opencode/skill/system-spec-kit/scripts/dist/graph/backfill-graph-metadata.js --dry-run` on 2026-04-13]

## 3. Verification

- `npm exec --workspace=@spec-kit/mcp-server vitest run tests/graph-metadata-schema.vitest.ts tests/graph-metadata-integration.vitest.ts` passed with `16` tests green.
- Active no-archive corpus scan confirmed `0` noisy `key_files` entries, `0` duplicate entity names, and `0` packets over the `12`-phrase trigger cap.
- The parser still appends canonical packet docs after filtering, so the packet-local docs remain present in the reviewed outputs.

## 4. Recommended Remediation

- Add an explicit archive/future skip option to the backfill script, or document the active-corpus post-filter the packet expects operators to apply after a raw dry-run.
- Keep the zero-noise verification anchored to the active no-archive corpus until the script can emit both views directly.

## 5. Residual Risk

This is a reproducibility and operator-UX issue, not a defect in the predicate itself. The sanitized parser behavior verified cleanly in both the focused tests and the active corpus audit.
