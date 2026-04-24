---
title: "...optimization/008-runtime-executor-hardening/003-system-hardening/002-canonical-save-hardening/implementation-summary]"
description: "Implementation summary for canonical-save hardening Waves A-C: save-lineage runtime parity, packet-root remediation, and validator rollout."
trigger_phrases:
  - "canonical save hardening summary"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/008-runtime-executor-hardening/003-system-hardening/002-canonical-save-hardening"
    last_updated_at: "2026-04-18T22:20:00Z"
    last_updated_by: "codex-gpt-5.4"
    recent_action: "Completed Waves A-C implementation and targeted verification"
    next_safe_action: "Orchestrator review, optional broad-suite triage, and commit"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->"
---
# Implementation Summary: Canonical-Save Hardening

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

Canonical-save hardening Waves A-C are implemented in the working tree. Targeted runtime and validator regressions pass, and the recursive 026 canonical-save validator pack passes with the requested 007-010 grandfathering window.

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-canonical-save-hardening |
| **Completed** | 2026-04-18 |
| **Level** | 2 |
| **Estimated Effort** | 3-5 days |
| **Executor** | cli-codex gpt-5.4 high fast |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

- **Wave A — Save-lineage runtime parity:** `refreshGraphMetadata()` now accepts `GraphMetadataRefreshOptions` at the public indexing API and forwards options to the resolved-folder implementation. The canonical-save workflow now passes one shared `{ now, saveLineage: 'same_pass' }` object into the graph refresh path so fresh canonical saves persist `derived.save_lineage`.
- **Wave B — Packet-root remediation:** coordination-parent `spec.md` files were added for 007, 008, 009, and 010. `generate-context.js` refreshed their `description.json` and `graph-metadata.json`; all four now have non-empty `derived.source_docs` and `save_lineage: "same_pass"`.
- **Wave C — Validator rollout:** a new canonical-save validator rule bridge plus CommonJS helper implements `CANONICAL_SAVE_ROOT_SPEC_REQUIRED`, `CANONICAL_SAVE_SOURCE_DOCS_REQUIRED`, `CANONICAL_SAVE_LINEAGE_REQUIRED`, `CANONICAL_SAVE_PACKET_IDENTITY_NORMALIZED`, and `CANONICAL_SAVE_DESCRIPTION_GRAPH_FRESHNESS`. `validate.sh` now lists, canonicalizes, dispatches, and selected-rule-runs those logical rules.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

- Updated source runtime surfaces first: `.opencode/skill/system-spec-kit/mcp_server/api/indexing.ts` and `.opencode/skill/system-spec-kit/scripts/core/workflow.ts`.
- Added focused regressions for API option forwarding and workflow-level persisted `same_pass` lineage.
- Authored the four coordination-parent root specs using the Level 2 spec pattern and refreshed metadata with `generate-context.js` for each root packet.
- Added the canonical-save validator shell entrypoint, helper implementation, synthetic fixture coverage, and 026-tree recursive validation coverage.
- Updated packet-local tasks and checklist with evidence while leaving commit/push and broad-baseline items open for the orchestrator.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- The canonical-save validator uses one shell entrypoint plus a CommonJS helper. This keeps `validate.sh` integration bash-compatible while allowing robust JSON parsing and packet normalization logic.
- `CANONICAL_SAVE_PACKET_IDENTITY_NORMALIZED` and `CANONICAL_SAVE_DESCRIPTION_GRAPH_FRESHNESS` are soft detectors for this rollout: they report drift/skew but do not block the pass/fail result yet.
- The hard-lineage cutoff and temporary 007-010 allowlist cutoff are both documented as `2026-05-01T00:00:00Z`.
- Commit and push tasks remain open because the dispatch explicitly reserved committing for the orchestrator.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

- `node mcp_server/node_modules/vitest/vitest.mjs run mcp_server/tests/follow-up-api.vitest.ts mcp_server/tests/graph-metadata-integration.vitest.ts mcp_server/tests/graph/graph-metadata-lineage.vitest.ts --config mcp_server/vitest.config.ts` — 3 files passed, 19 tests passed.
- `node scripts/node_modules/vitest/vitest.mjs run scripts/tests/workflow-canonical-save-metadata.vitest.ts scripts/tests/canonical-save-validation.vitest.ts --config mcp_server/vitest.config.ts` — 2 files passed, 11 tests passed, 1 skipped.
- `SPECKIT_RULES='CANONICAL_SAVE_ROOT_SPEC_REQUIRED,CANONICAL_SAVE_SOURCE_DOCS_REQUIRED,CANONICAL_SAVE_LINEAGE_REQUIRED,CANONICAL_SAVE_PACKET_IDENTITY_NORMALIZED,CANONICAL_SAVE_DESCRIPTION_GRAPH_FRESHNESS' bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization --recursive --strict --verbose` — RESULT PASSED, 19 phases, 0 errors, 0 warnings.
- Dist evidence verified with `rg`: `mcp_server/dist/api/indexing.js` forwards options, `scripts/dist/core/workflow.js` emits `saveLineage: 'same_pass'`, and graph parser/schema dist files include `save_lineage`.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- The broader workspace `npm run build` / full-suite baseline is not claimed green. Earlier attempts hit unrelated TypeScript baseline failures outside this packet, including description/schema and folder-discovery files already dirty in the working tree.
- The packet's own strict baseline validation had inherited doc-anchor/reference and sandbox `tsx` execution blockers before this dispatch. This implementation therefore verified the newly introduced canonical-save rule subset directly and updated checklist/tasks with that distinction.
- `T009`, `T016`, and `T024` remain open because the user explicitly instructed not to commit or push.
<!-- /ANCHOR:limitations -->
