---
title: "Implementation Summary: FTS Capability Cascade Floor"
description: "Closeout for packet 010, covering truthful FTS capability detection, lexical-path response metadata, and the frozen forced-degrade matrix."
trigger_phrases:
  - "010-fts-capability-cascade-floor"
  - "implementation"
  - "summary"
importance_tier: "normal"
contextType: "implementation"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 010-fts-capability-cascade-floor |
| **Completed** | 2026-04-08 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Packet `010` now hardens the lexical capability floor that the research train called for. `sqlite-fts.ts` no longer collapses FTS availability into a single yes-or-no check: it now distinguishes `compile_probe_miss`, `missing_table`, `no_such_module_fts5`, and `bm25_runtime_failure`, while still preserving the existing degraded retrieval behavior.

`memory_search` now surfaces that truth directly on the response envelope with `lexicalPath` and `fallbackState`, so downstream readers do not need to guess whether the lexical lane ran through FTS5 or was unavailable for the request. The packet-local tests freeze all four degrade cases, and the runtime search README now documents the same vocabulary that packet `002-implement-cache-warning-hooks` depends on.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The delivery stayed inside the bounded owner surfaces from `spec.md`: first I hardened the FTS probe and runtime error classification in `sqlite-fts.ts`, then I threaded the resulting lexical metadata into `memory-search.ts` without changing the existing result shape. After that I extended the focused Vitest coverage for the four forced-degrade states plus the handler response envelope, updated the search README to match runtime truth, and closed the packet docs so phase `002` has a clear predecessor contract instead of an inferred one.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Use `PRAGMA compile_options` plus `memory_fts` presence as the FTS capability floor | That keeps compile-probe miss separate from a missing table, which was the core truthfulness requirement in R7. |
| Surface `lexicalPath` and `fallbackState` directly on `memory_search` data | Phase `002` and later consumers need an explicit contract in the response envelope, not an inference from warnings or empty lexical results. |
| Mark degraded lexical execution as `unavailable` | The packet was meant to harden runtime truth, not claim a hidden fallback lane that never actually executes lexical retrieval. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `cd .opencode/skill/system-spec-kit/mcp_server && TMPDIR=./.tmp/tsc-tmp npm run typecheck` | PASS |
| `cd .opencode/skill/system-spec-kit/mcp_server && TMPDIR=./.tmp/vitest-tmp npx vitest run tests/sqlite-fts.vitest.ts tests/handler-memory-search.vitest.ts tests/shared-payload-certainty.vitest.ts tests/structural-trust-axis.vitest.ts` | PASS |
| `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh --strict .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-fts-capability-cascade-floor` | PASS |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. `lexicalPath` currently emits `fts5` or `unavailable` for this runtime seam. The broader response schema can represent `like`, but packet `010` does not claim that lane here.
2. This packet only hardens capability truth and response metadata. It does not add broader search features or user-facing search workflow changes.
3. **006-memory-redundancy alignment** This packet is classified **"No change"** under `../001-research-graph-context-systems/006-research-memory-redundancy/spec.md` Section 3A. Retrieval-lane hardening is independent from generated memory-body duplication, so no changes to the memory save generator, collector, body template, or memory-template-contract are introduced by this packet. Canonical narrative ownership stays in `decision-record.md` and `implementation-summary.md`; memory files remain compact retrieval wrappers pointing at canonical docs per the wrapper-contract runtime shipped by packet `003-memory-quality-issues/006-memory-duplication-reduction` (commit `7f0c0572a`).
<!-- /ANCHOR:limitations -->
