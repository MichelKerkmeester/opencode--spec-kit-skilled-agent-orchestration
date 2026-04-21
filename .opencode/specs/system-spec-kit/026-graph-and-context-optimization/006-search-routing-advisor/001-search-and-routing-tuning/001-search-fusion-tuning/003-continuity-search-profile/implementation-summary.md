---
title: "Implementation Summary: Add Continuity Search Intent Profile"
description: "Adds a narrow internal-only continuity fusion profile and wires the adaptive-fusion path without expanding the public intent API."
trigger_phrases:
  - "continuity search profile"
  - "adaptive fusion continuity"
  - "internal continuity intent"
importance_tier: "important"
contextType: "implementation"
status: complete
closed_by_commit: 2958485d9f
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/001-search-fusion-tuning/003-continuity-search-profile"
    last_updated_at: "2026-04-13T00:00:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Added the continuity adaptive-fusion profile and threaded it through the internal pipeline path"
    next_safe_action: "Use the new profile for continuity-oriented evaluation only; treat any public intent expansion as a separate follow-on"
    key_files:
      - "implementation-summary.md"
      - ".opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts"
---
# Implementation Summary: Add Continuity Search Intent Profile

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

## Metadata

| Field | Value |
|-------|-------|
| Spec Folder | `003-continuity-search-profile` |
| Completed | `2026-04-13` |
| Level | `2` |

## What Was Built

This phase added a new internal `continuity` weight profile to adaptive fusion with the researched `0.52 / 0.18 / 0.07 / 0.23` semantic, keyword, recency, and graph weights. To keep the rollout narrow, the public search-intent unions and classifier/router surfaces were left untouched.

The internal search path now threads a separate `adaptiveFusionIntent` value so resume-oriented/profile-driven callers can request `'continuity'` for fusion without changing the externally reported `detectedIntent`. The shared package runtime export was also updated so the tested import surface sees the new profile immediately.

## Verification

| Check | Result |
|-------|--------|
| `cd .opencode/skill/system-spec-kit/mcp_server && npx tsc --noEmit` | PASS |
| `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/adaptive-fusion.vitest.ts tests/adaptive-ranking.vitest.ts tests/k-value-optimization.vitest.ts` | PASS (`3` files, `58` tests) |

## Notes

- The public intent API still exposes the existing 7-intent surface.
- Post-review remediation added a dedicated continuity MMR lambda so Stage 3 reranking keeps the new continuity profile’s ordering behavior instead of falling back to the generic default.
- `intent-classifier.ts`, `query-router.ts`, `artifact-routing.ts`, and their union-sensitive tests were intentionally left unchanged apart from the new continuity lambda regression assertion.
