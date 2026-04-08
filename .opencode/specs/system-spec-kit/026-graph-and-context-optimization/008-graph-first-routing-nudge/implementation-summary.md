---
title: "Implementation Summary: Graph-First Routing Nudge"
description: "Advisory-only structural routing nudges added to the existing startup, bootstrap, response-hint, and memory-context surfaces."
trigger_phrases:
  - "008-graph-first-routing-nudge"
  - "implementation"
  - "summary"
  - "structural routing nudge"
importance_tier: "important"
contextType: "implementation"
---
# Implementation Summary: Graph-First Routing Nudge

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 008-graph-first-routing-nudge |
| **Completed** | 2026-04-08 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Packet `008` now ships a narrow graph-first routing nudge without creating a new router. The runtime change stays inside the existing startup, bootstrap, response-hint, and `memory_context` surfaces. When graph readiness is truly ready, the server now emits an advisory metadata object and matching hint text for structural-first prompts that often misfire with Grep or Glob, such as callers, imports, dependencies, and outline lookups.

The packet also adds a frozen structural-task slice in `tests/graph-first-routing-nudge.vitest.ts`. That suite proves the nudge only fires when readiness and activation scaffolding are present, stays off for semantic queries, and never replaces bootstrap or resume authority.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The delivery stayed inside the bounded seam named in `spec.md`. I added a guarded helper in `context-server.ts` for likely structural misfires, layered a startup or resume hint into `session-prime.ts`, surfaced a separate advisory field in `session-bootstrap.ts`, and threaded the same metadata through `memory-context.ts` without changing the existing routed backend. The packet closeout then updated `plan.md`, `tasks.md`, and `checklist.md` to reflect the shipped runtime truth, recorded the exact verification commands used for sign-off, and confirmed that no parent tracker updates were required for this packet-local runtime closeout.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep the nudge advisory-only and store it as metadata | The packet needed to reuse existing response surfaces and avoid inventing a competing graph router. |
| Gate the nudge on ready graph state and activation scaffolding | Structural hints are only trustworthy when the graph is ready and the current surface already has the right bootstrap context. |
| Keep bootstrap `nextActions` authoritative | The research and packet spec both require `session_bootstrap()` and deeper resume flows to remain the owners of recovery guidance. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `cd .opencode/skill/system-spec-kit/mcp_server && TMPDIR=./.tmp/tsc-tmp npm run typecheck` | PASS |
| `cd .opencode/skill/system-spec-kit/mcp_server && TMPDIR=./.tmp/vitest-tmp npx vitest run tests/graph-first-routing-nudge.vitest.ts tests/shared-payload-certainty.vitest.ts tests/structural-trust-axis.vitest.ts tests/graph-payload-validator.vitest.ts tests/sqlite-fts.vitest.ts` | PASS (5 files, 38 tests) |
| `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh --strict .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-graph-first-routing-nudge` | PASS |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. This packet is classified 'No change' under `../001-research-graph-context-systems/006-research-memory-redundancy/spec.md` §3A. Structural routing nudges are orthogonal to the memory-save wrapper contract; no memory generator, collector, or template changes are introduced.
2. The startup and resume hook hint is intentionally generic because SessionStart priming has no user task yet. Task-shaped nudges still happen later on the response and `memory_context` surfaces.
3. The nudge only fires on ready graph state. Stale or missing structural context still falls back to the existing refresh guidance instead of speculating about tool routing.
<!-- /ANCHOR:limitations -->
