<!-- SNAPSHOT: copied from 015-save-flow-planner-first-trim/review/iterations/iteration-009.md on 2026-04-15. Authoritative source at original packet. -->

---
iteration: 9
dimension: "Docs vs runtime drift"
focus: "Verify planner-first save docs describe the live follow-up APIs, planner modes, and fallback semantics accurately"
timestamp: "2026-04-15T09:16:20Z"
runtime: "cli-copilot --effort high"
status: "insight"
findings:
  P0: 0
  P1: 2
  P2: 0
---

# Iteration 009

## Findings

### P1
1. **F007 — Packet docs still name the pre-015 follow-up tools instead of the shipped planner follow-up APIs.** The packet spec and plan say planner responses surface `memory_index_scan` and `refreshGraphMetadataForSpecFolder`, but the runtime now emits `reindexSpecDocs` and `refreshGraphMetadata` as the follow-up tool names. This is doc-runtime drift in the core operator contract because the planner payload no longer matches the packet’s published tool identifiers. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/015-save-flow-planner-first-trim/spec.md:155] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/015-save-flow-planner-first-trim/plan.md:128] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1637-1653]

**Remediation suggestion:** Update packet 015 docs to use the shipped follow-up API names (`refreshGraphMetadata`, `reindexSpecDocs`, `runEnrichmentBackfill`) so transcript prototypes and operator handoffs match the live planner payload.

2. **F008 — `ENV_REFERENCE.md` documents `hybrid` as a normal planner mode even though runtime still treats it as a future stub.** The env table presents `plan-only`, `full-auto`, and `hybrid` as the planner-mode choices, but the underlying implementation comment marks `hybrid` as “future mixed flows” and the live branch only distinguishes `full-auto` from every other value. Operators reading the env reference would reasonably infer a real third behavior that does not exist yet. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:98] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:123-135] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:2469-2470]

**Remediation suggestion:** Either mark `hybrid` as reserved/future in `ENV_REFERENCE.md` or remove it from the documented public choices until it has distinct runtime behavior.

## Ruled-out directions explored

- **Command docs are aligned on the default/fallback split.** `/memory:save` docs correctly describe planner-first default behavior, explicit `full-auto` fallback, and deferred freshness actions. [SOURCE: .opencode/command/memory/save.md:78-79] [SOURCE: .opencode/command/memory/save.md:131-144]
- **Packet decision record stays directionally aligned with runtime.** ADR text still matches the broad intent to defer enrichment and keep full-auto as an explicit operator choice. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/015-save-flow-planner-first-trim/decision-record.md:263-265]
- **AGENTS.md and top-level SKILL.md do not currently make conflicting planner-first claims.** The grep sweep found no packet-015 planner-contract statements there, so there is no contradiction to resolve in those surfaces.

## Evidence summary

- Operator-facing command docs: aligned.
- Packet-local spec/plan: stale tool names.
- ENV reference: overstated `hybrid` support.

## Novelty justification

This iteration added new signal by showing the code changes did not fully propagate into the packet/reference docs, leaving operators with stale follow-up names and a misleading planner-mode matrix.
