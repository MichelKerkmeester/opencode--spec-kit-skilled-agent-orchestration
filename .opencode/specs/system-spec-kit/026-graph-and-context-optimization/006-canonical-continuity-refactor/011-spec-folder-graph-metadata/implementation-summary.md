---
title: "Implementation Summary: 018 / 011 — graph-metadata.json rollout"
description: "Implementation closeout for the graph-metadata.json schema, refresh, indexing, backfill, and workflow adoption rollout."
trigger_phrases: ["018 011 implementation summary", "graph metadata rollout implementation", "graph metadata closeout"]
importance_tier: "important"
contextType: "implementation"
status: "complete"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "018/011-spec-folder-graph-metadata"
    last_updated_at: "2026-04-12T00:00:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Completed rollout and closeout"
    next_safe_action: "Release handoff"
    key_files: ["implementation-summary.md", "checklist.md", "tasks.md", "plan.md"]
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->
# Implementation Summary

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 011-spec-folder-graph-metadata |
| **Status** | Complete |
| **Completed** | 2026-04-12 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Packet `011` now ships a root-level `graph-metadata.json` contract for every spec-folder root under `.opencode/specs/`. The rollout added a schema-backed parser, canonical-save refresh, discovery and search indexing support, causal-edge projection, packet-aware ranking hints, full backfill coverage, validation hooks, and command-surface adoption.

### Schema and Parser

The MCP server now owns `graph-metadata-schema.ts` and `graph-metadata-parser.ts`. The schema enforces `schema_version: 1`, packet lineage fields, a preserved `manual` relationship section, and a regenerated `derived` section with trigger phrases, topics, key files, entities, timestamps, and source documents. The parser validates existing files, rejects incompatible versions, preserves `manual.*`, rebuilds `derived.*`, and writes atomically through a temp-file plus rename flow.

### Canonical Save Refresh

Canonical save now refreshes graph metadata as part of the workflow instead of relying on a separate manual step. The save path derives trigger phrases, status, importance tier, causal summary, key files, parent-child packet identity, and source document coverage from the packet docs and current save payload. Manual relationships survive repeated saves.

### Indexing and Graph Integration

The discovery and indexing stack now recognizes `graph-metadata.json` as `document_type='graph_metadata'`. Packet metadata becomes searchable content, packet-oriented ranking can boost graph metadata rows for resume and dependency-oriented queries, and `manual.depends_on`, `manual.supersedes`, and `manual.related_to` project into `causal_edges` through the existing processor.

### Backfill and Workflow Adoption

A new `scripts/graph/backfill-graph-metadata.ts` script performs dry-run reporting and real writes across all packet roots, including historical and archived folders. Packet creation now scaffolds an empty `graph-metadata.json`, completion docs describe final status and timestamp updates, and validation now checks graph metadata presence with warning-first rollout semantics.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The rollout landed in the same order the packet planned. Phase 1 created the schema, parser, and dedicated tests. Phase 2 integrated refresh into canonical save, then extended discovery, indexing, search, and causal-edge processing. Phase 3 added the backfill CLI and review-flag reporting so historical packet quality could be handled without inventing relationships. Phase 4 executed the backfill across the full `.opencode/specs` tree. Phase 5 adopted the file across plan, complete, resume, validation, and scripts documentation.

One shared-package fix was required during verification: `shared/embeddings/factory.ts` needed a supported provider-name normalization change so the MCP server build would pass cleanly and export the updated API surface used by the scripts workspace.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep `graph-metadata.json` as one root-level packet file | It restores packet graph state without reviving packet-local memory sprawl or creating another spec-doc family |
| Preserve `manual` and rebuild `derived` | Human relationships must survive automation, while derived fields must stay current with canonical docs |
| Reuse existing indexing and causal-edge systems | Packet graph metadata needed to stay additive to current search and graph contracts, not fork them |
| Keep presence validation warning-first | Backfill had to prove whole-tree coverage before any stronger enforcement would be safe |
| Leave manual relationship arrays empty on backfill | The user explicitly required no invented packet relationships, so historical rollout only derives fields that can be grounded in packet docs |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npm run --workspace=@spec-kit/mcp-server typecheck` | PASS |
| `npm run --workspace=@spec-kit/mcp-server build` | PASS |
| `npm run --workspace=@spec-kit/scripts typecheck` | PASS |
| `npm run build --workspace=@spec-kit/scripts` | PASS |
| `node mcp_server/node_modules/vitest/vitest.mjs run mcp_server/tests/graph-metadata-schema.vitest.ts mcp_server/tests/graph-metadata-integration.vitest.ts scripts/tests/graph-metadata-refresh.vitest.ts scripts/tests/graph-metadata-backfill.vitest.ts --config mcp_server/vitest.config.ts` | PASS |
| `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/011-spec-folder-graph-metadata --strict` | PASS |
| `bash .opencode/skill/system-spec-kit/scripts/spec/check-completion.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/011-spec-folder-graph-metadata --strict` | PASS |
| `find .opencode/specs -type f -name graph-metadata.json | wc -l` | PASS at rollout time with 515 files; current review count is 516 after later packet creation |

### Backfill Coverage

The final backfill apply summary refreshed all `515` detected spec-folder roots under `.opencode/specs` at rollout time. The current review count is `516` because a later child packet now also carries a root `graph-metadata.json`; review flags were still emitted only for historically ambiguous packets, and the original backfill run completed without inventing manual relationships.

### 10-Iteration Deep Review

The post-implementation review covered ten passes:

1. Schema correctness: the shipped contract matches the packet spec and keeps versioned validation explicit.
2. Parser robustness: invalid JSON, version mismatch, manual preservation, and archive-path cases are covered.
3. Save-path integration: canonical save refreshes graph metadata through the workflow hook.
4. Index integration: graph metadata is discoverable, indexable, and causal-edge aware.
5. Backfill coverage: the rollout backfill reached `515/515` packet-root coverage at implementation time, and the current tree now contains `516` graph-metadata files after subsequent packet creation.
6. Test coverage: four new test files passed with ten tests total.
7. Doc accuracy: relevant command and scripts docs were updated for the new lifecycle.
8. Typecheck and build: both workspaces passed.
9. Retroactive validation: five random backfilled files were inspected and found structurally accurate.
10. Final sweep: no remaining implementation loose ends were left in the shipped surfaces.

The review did surface a few implementation fixes during the run, and they were closed before final verification. The key ones were quoted-array parsing for trigger phrases, key-file cleanup to avoid wildcard junk, archive-path support in graph refresh, backfill root resolution, and the validation helper's Node argv handling.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. Historical packets with sparse or ambiguous docs still receive review flags such as `ambiguous_status`, `missing_summary`, or `prose_relationship_hints`. The backfill reports them instead of guessing.
2. Manual relationship arrays start empty unless a packet already had explicit graph metadata. This is deliberate and preserves the no-invented-edges rule.
3. Presence validation is still warning-first by design, even though full-tree coverage has now been proven. Tightening that rule would be a separate policy change.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skill/sk-doc/references/hvr_rules.md
-->
