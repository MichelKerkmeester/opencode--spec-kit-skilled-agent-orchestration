---
title: "Implementation Summary: Code Graph Upgrades [template:level_3/implementation-summary.md]"
description: "Implementation closeout for 014-code-graph-upgrades."
trigger_phrases:
  - "014-code-graph-upgrades"
  - "implementation"
  - "summary"
importance_tier: "important"
contextType: "implementation"
---
# Implementation Summary: Code Graph Upgrades

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 014-code-graph-upgrades |
| **Completed** | 2026-04-09 |
| **Level** | 3 |
| **Implementation Commit** | `2837e157a` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The adopt-now runtime lane shipped on top of the existing Code Graph MCP surface. The implementation added an honest detector provenance taxonomy, evidence-tagged edge metadata with numeric confidence, bounded blast-radius traversal with explicit multi-file union semantics, and degree-based hot-file breadcrumbs on code-graph-owned outputs.

The packet kept packet `011` authoritative for trust-axis validation and packet `008` authoritative for startup, resume, compact, and response-surface nudges. No clustering, export, or routing-facade lane shipped in this run.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementation landed in `2837e157a` across the live code-graph runtime and its regression suite. The runtime work stayed bounded to:

- detector contracts and serialization in `lib/code-graph/`
- graph-local query and context outputs in `handlers/code-graph/`
- additive payload helpers in `lib/context/shared-payload.ts`
- targeted regression coverage in the code-graph vitest suite

The packet closeout then updated `tasks.md`, `checklist.md`, `spec.md`, and this summary to record the shipped scope, the ADR fences that stayed in force, and the remaining prototype-later deferrals.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep `011` authoritative for structural trust validation | Additive graph richness had to compose with the existing owner contract instead of replacing it. |
| Expose detector provenance separately from packet `011` trust axes | The graph needed the new `ast | structured | regex | heuristic` taxonomy without collapsing the validator-owned trust fields. |
| Keep startup, resume, compact, and response-surface nudges out of scope | Packet `008` already owns that lane, so `014` stayed graph-local. |
| Defer routing facade, Leiden clustering, and GraphML/Cypher exports | ADR-003 keeps those lanes prototype-later so the adopt-now packet stays executable and low-risk. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node_modules/.bin/vitest run tests/code-graph-indexer.vitest.ts tests/code-graph-query-handler.vitest.ts tests/graph-payload-validator.vitest.ts tests/code-graph-scan.vitest.ts tests/ensure-ready.vitest.ts tests/code-graph-context-handler.vitest.ts tests/structural-trust-axis.vitest.ts` | PASS (51 tests) |
| `npm run typecheck` | PASS |
| Packet `007` and `011` preflights re-verified before coding | PASS |
| `validate.sh --strict` | PASS (`Errors: 0  Warnings: 0`) |
| Packet memory artifact saved in `014-code-graph-upgrades/memory/` | PASS |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. The packet intentionally does not ship routing facades, Leiden clustering, GraphML/Cypher exports, or any new graph-only authority surface.
2. The runtime lane enriches code-graph-owned outputs only; startup, resume, compact, and response-surface nudges remain with packet `008`.
3. The parser fallback lane stayed bounded to the existing `SPECKIT_PARSER` selector and did not introduce a new lexical cascade subsystem in this run.
<!-- /ANCHOR:limitations -->
