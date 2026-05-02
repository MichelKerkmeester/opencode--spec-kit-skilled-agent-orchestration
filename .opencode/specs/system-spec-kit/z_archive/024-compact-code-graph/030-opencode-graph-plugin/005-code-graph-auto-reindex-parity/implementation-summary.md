---
title: "...-spec-kit/024-compact-code-graph/030-opencode-graph-plugin/005-code-graph-auto-reindex-parity/implementation-summary]"
description: "Phase 005 implements bounded code graph auto-reindex parity so structural reads now behave more like CocoIndex while still refusing inline full scans."
trigger_phrases:
  - "phase 5 implementation summary"
  - "auto reindex parity summary"
importance_tier: "important"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/024-compact-code-graph/030-opencode-graph-plugin/005-code-graph-auto-reindex-parity"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["implementation-summary.md"]
---
# Implementation Summary: Code Graph Auto-Reindex Parity

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-code-graph-auto-reindex-parity |
| **Completed** | 2026-04-04 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Phase 5 landed the bounded code graph auto-reindex parity runtime. Structural reads now mimic CocoIndex-style first-use refresh where safe: small stale sets refresh inline, safe post-commit HEAD drift can still self-heal through selective reindex, and large stale/full-scan situations stay bounded and report stale-readiness instead of forcing an inline full scan.

### Packet Deliverables

- Bounded inline refresh support in `lib/code-graph/ensure-ready.ts`
- Matching bounded-readiness wiring in `handlers/code-graph/query.ts` and `handlers/code-graph/context.ts`
- Refined HEAD-drift handling so small post-commit tracked-file deltas still use selective inline reindex
- New readiness metadata surfaced to structural read callers
- Focused tests for inline selective refresh and full-scan refusal
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The work followed the runtime plan directly:

1. Reuse `ensureCodeGraphReady()` instead of inventing a second freshness engine.
2. Split inline selective refresh from inline full-scan permission.
3. Enable bounded inline refresh in both structural handlers.
4. Add tests for fresh, selective-inline, and stale-refusal behavior.
5. Truth-sync the parent packet after runtime verification.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Make this a new child phase instead of overloading Phase 3 | The runtime gap was follow-on work, not retroactive reinterpretation of shipped graph ops |
| Reuse `ensureCodeGraphReady()` as the intended engine | The existing engine already contains the safety rails this phase should preserve |
| Keep inline full scans disabled on read paths | Structural reads should mimic CocoIndex-style freshness, not turn into unbounded rescans |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npx tsc --noEmit` in `.opencode/skill/system-spec-kit/mcp_server` | PASS |
| `TMPDIR=/Users/michelkerkmeester/.tmp/vitest-tmp npx vitest run tests/ensure-ready.vitest.ts tests/code-graph-query-handler.vitest.ts tests/code-graph-context-handler.vitest.ts` | PASS, including post-commit HEAD-drift refinement coverage |
| `npm run build` in `.opencode/skill/system-spec-kit/mcp_server` | PASS |
| Strict recursive packet validation | PASS |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Inline full scans remain intentionally disabled on read paths.** Large stale states, broad branch-switches, and empty-graph bootstrap still require an explicit `code_graph_scan`, which is by design.
2. **Freshness parity is behavioral, not identical implementation.** CocoIndex and the code graph still use different underlying engines and refresh mechanics, and empty-graph bootstrap still remains explicit on the code-graph side.
3. **P2 closeout items remain deferred.** This phase did not add load testing, a separate deployment runbook, or user-facing docs beyond packet truth-sync.
<!-- /ANCHOR:limitations -->
