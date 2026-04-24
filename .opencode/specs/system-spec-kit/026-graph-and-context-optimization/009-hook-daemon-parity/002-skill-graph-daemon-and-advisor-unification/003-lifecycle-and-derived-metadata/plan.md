---
title: "...zation/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/003-lifecycle-and-derived-metadata/plan]"
description: "Phased implementation plan for lifecycle + derived metadata."
trigger_phrases:
  - "zation"
  - "009"
  - "hook"
  - "daemon"
  - "parity"
  - "plan"
  - "003"
  - "lifecycle"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/003-lifecycle-and-derived-metadata"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["plan.md"]
---
# Plan: 027/002

## Phases

1. **Contract** — read research.md §5 Track B + §13.3 Track F + Y1/Y3. Read `lib/freshness/generation.ts` (from 027/001). No code.
2. **Schema** — Zod schema for v2 `derived` block. Validator + migration types.
3. **Extraction pipeline** — `lib/derived/extract.ts` + `provenance.ts`. Unit tests.
4. **Trust lanes + anti-stuffing** — `lib/derived/trust-lanes.ts` + `anti-stuffing.ts`. Unit + adversarial fixture tests.
5. **Lifecycle primitives** — `age-haircut.ts`, `supersession.ts`, `archive-handling.ts`, `schema-migration.ts`. Unit tests per primitive.
6. **Corpus stats** — `lib/corpus/df-idf.ts`. Startup recompute + debounced updates.
7. **Integration with daemon** — watcher (027/001) fires re-index → derived refresh → generation bump. End-to-end test.
8. **Lifecycle fixtures** — export under `tests/fixtures/lifecycle/` for 027/003 consumption.
9. **Verify** — focused suite + parent implementation-summary update.

## Dispatch

Single `/spec_kit:implement :auto` on `../` with `:spec-folder=.../027/003-lifecycle-and-derived-metadata/` AFTER 027/001 lands.

## Verification

- Unit suite: `npx vitest run mcp_server/skill-advisor/tests/derived/** tests/lifecycle/** tests/corpus/**`
- Integration: watcher → re-index → derived refresh within 10s
- Rollback test: v2 → v1 → reindex → all authored fields preserved
- TS build clean

## Risk mitigations from research §10 + §13.7

- **R3** derived inflation → trust lanes + caps + corpus precision checks
- **R4** keyword stuffing → anti-stuffing module + adversarial fixtures
- **R9** lifecycle fixtures for 027/003 parity coverage
