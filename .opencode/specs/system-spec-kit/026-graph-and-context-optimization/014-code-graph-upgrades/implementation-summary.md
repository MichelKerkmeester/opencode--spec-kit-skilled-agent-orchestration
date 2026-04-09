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
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Packet `014` now ships the adopt-now code-graph runtime lane instead of staying planning-only. The implementation added a dedicated detector provenance vocabulary, fixed blast-radius depth handling at traversal time, exposed explicit multi-file union mode, and surfaced low-authority hot-file breadcrumbs on graph-owned outputs.

The payload layer now carries additive `edgeEvidenceClass` and `numericConfidence` metadata on the existing owner contracts. That enrichment survives the real `session_resume` to `session_bootstrap` path without weakening packet `011`'s structural-trust validation.

### Detector Provenance and Serialization

`shared-payload.ts` now exports `DetectorProvenance`, guards, assertions, and a compatibility mapper back to packet `006`'s `ParserProvenance` vocabulary. Scan and context handlers serialize detector provenance summary data instead of relying on loose strings or implicit parser labels.

### Bounded Blast Radius and Advisory Breadcrumbs

`code_graph_query` now stops traversal before nodes beyond `maxDepth` are included. Explicit `unionMode: 'multi'` merges multiple source files without duplicating results, and high-degree files now get an advisory `hotFileBreadcrumb` that says to change carefully without introducing any new authority score.

### Additive Edge Evidence Enrichment

Shared payload sections can now carry `graphEdgeEnrichment` with `edgeEvidenceClass` and `numericConfidence`. Query responses emit the fields directly, scan stores the latest summary, and resume/bootstrap preserve the enrichment on existing payload owners.

### Frozen Regression Floor

The packet adds a dedicated script-side regression floor for provenance honesty and blast-radius depth behavior. That keeps detector regressions and traversal regressions frozen under the same discipline packet `007` established.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The work started by lifting the planning-only fence in `spec.md`, then implementing the required lanes in order. Lane A added the detector provenance contract and scan/context serialization hooks. Lane B corrected blast-radius traversal and made multi-file union explicit. Lane C layered advisory hot-file breadcrumbs on the same graph-owned response shape. Lane D added additive edge evidence metadata and carried it through resume/bootstrap without replacing packet `011`'s trust contract. Lane E closed the loop with a frozen regression-floor fixture under the scripts-side harness.

After the runtime work was stable, the packet docs were rewritten to match what actually shipped, what stayed deferred, and how the boundaries with packets `007`, `008`, and `011` were preserved.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Reuse packet `006` trust axes instead of extending them directly | `DetectorProvenance` needed a richer graph-local vocabulary, but packet `011` still expects the existing `ParserProvenance` contract. The compatibility mapper keeps both truths intact. |
| Enforce blast-radius depth in the traversal loop | A post-filter would still walk out-of-bound nodes and could leak them through future response shapes. Cutting traversal at `maxDepth` fixes the root cause instead of the symptom. |
| Keep hot-file breadcrumbs advisory only | The breadcrumb is meant to warn about blast radius, not to compete with packet `011`'s trust envelope or invent a new authority scale. |
| Preserve edge enrichment through resume/bootstrap additively | Existing owner surfaces already carry the trust contract, so the enrichment needed to ride along on those payloads rather than creating a graph-only parallel contract. |
| Defer lexical fallback cascades, clustering, and export work | `code_graph_query` has no lexical fallback cascade today, and ADR-003 keeps clustering and export work prototype-later so the adopt-now lane stays bounded. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `cd .opencode/skill/system-spec-kit/mcp_server && TMPDIR=./.tmp/tsc-tmp npm run typecheck` | PASS |
| `cd .opencode/skill/system-spec-kit/mcp_server && TMPDIR=./.tmp/vitest-tmp npx vitest run tests/shared-payload-certainty.vitest.ts tests/structural-trust-axis.vitest.ts tests/graph-payload-validator.vitest.ts tests/graph-first-routing-nudge.vitest.ts tests/sqlite-fts.vitest.ts tests/hook-state.vitest.ts tests/hook-session-start.vitest.ts tests/handler-memory-search.vitest.ts tests/publication-gate.vitest.ts tests/code-graph-query-handler.vitest.ts tests/code-graph-context-handler.vitest.ts tests/code-graph-scan.vitest.ts` | PASS |
| `cd .opencode/skill/system-spec-kit/scripts && TMPDIR=./.tmp/vitest-tmp npx vitest run tests/detector-regression-floor.vitest.ts.test.ts tests/session-cached-consumer.vitest.ts.test.ts tests/warm-start-bundle-benchmark.vitest.ts.test.ts tests/graph-upgrades-regression-floor.vitest.ts.test.ts` | PASS |
| `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh --strict .opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-code-graph-upgrades` | PASS |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. `code_graph_query` still has no lexical fallback cascade, so Lane F stayed not applicable in this run. If a lexical fallback is added later, it still needs its own capability selector and forced-degrade matrix.
2. Clustering, routing facade, GraphML or Cypher export, and rationale-node support remain prototype-later per ADR-003 and did not ship here.
3. Packet `014` enriches graph-local outputs plus additive resume/bootstrap preservation only. Startup, compact, and response-surface routing nudges still belong to packet `008`.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skill/sk-doc/references/hvr_rules.md
-->
