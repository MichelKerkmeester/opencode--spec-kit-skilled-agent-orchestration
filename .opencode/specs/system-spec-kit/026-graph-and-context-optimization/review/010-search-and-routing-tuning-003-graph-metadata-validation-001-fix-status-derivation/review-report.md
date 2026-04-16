---
title: "Phase Review Report: 001-fix-status-derivation"
description: "10-iteration deep review of 001-fix-status-derivation. Verdict CONDITIONAL with 0 P0 / 0 P1 / 1 P2 findings."
importance_tier: "important"
contextType: "review-report"
---

# Phase Review Report: 001-fix-status-derivation

## 1. Overview

Ten iterations covered the status fallback logic, the focused Vitest coverage, and an active-corpus verification pass over the non-archived graph metadata files. Verdict `CONDITIONAL`: the phase delivered the intended checklist-aware fallback and the expected `210 complete / 88 in_progress / 59 planned` active-corpus buckets, but the parser still preserves three non-canonical frontmatter status spellings verbatim.

## 2. Findings

### P2

1. Explicit frontmatter statuses are not normalized before they are persisted back into graph metadata. `deriveStatus()` returns the first ranked status string verbatim, and the schema still accepts any non-empty string, so mixed-case values like `"Complete"`, `"In Progress"`, and `"completed"` survive the backfill and create extra status buckets in the active corpus. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:587] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts:36] [SOURCE: .opencode/specs/system-spec-kit/022-hybrid-rag-fusion/003-constitutional-learn-refactor/graph-metadata.json:43] [SOURCE: .opencode/specs/system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/graph-metadata.json:43] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/015-full-playbook-execution/graph-metadata.json:43]

## 3. Verification

- `npm exec --workspace=@spec-kit/mcp-server vitest run tests/graph-metadata-schema.vitest.ts tests/graph-metadata-integration.vitest.ts` passed with `16` tests green.
- Active no-archive corpus scan confirmed `360` graph-metadata files, `210` canonical `complete`, `88` canonical `in_progress`, `59` canonical `planned`, and only `3` non-canonical leftovers.
- No checklist-backed false-positive promotion was reproduced during the review.

## 4. Recommended Remediation

- Normalize explicit frontmatter statuses to the canonical graph metadata vocabulary before returning them from `deriveStatus()`.
- If alternate spellings are intentionally supported, document that compatibility layer and normalize it in the reporting queries that consume `derived.status`.

## 5. Residual Risk

This is a bounded reporting and consistency issue, not a correctness failure in the new checklist-aware fallback. The active corpus impact is currently limited to three packets, but any new mixed-case frontmatter status will continue to create an extra bucket until normalization is centralized.
