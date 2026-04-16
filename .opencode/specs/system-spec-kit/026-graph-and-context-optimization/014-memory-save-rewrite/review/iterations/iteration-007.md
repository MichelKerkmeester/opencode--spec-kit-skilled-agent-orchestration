<!-- SNAPSHOT: copied from 015-save-flow-planner-first-trim/review/iterations/iteration-007.md on 2026-04-15. Authoritative source at original packet. -->

---
iteration: 7
dimension: "Dead-branch audit"
focus: "Find computed-but-dropped values, success-shaped no-ops, and unimplemented planner-mode branches in save-flow trim files"
timestamp: "2026-04-15T09:01:40Z"
runtime: "cli-copilot --effort high"
status: "insight"
findings:
  P0: 0
  P1: 1
  P2: 1
---

# Iteration 007

## Findings

### P1
1. **F004 — Planner-default saves can skip enrichment but still report all enrichment steps as successful.** When planner-default mode disables save-time enrichment, `runPostInsertEnrichmentIfEnabled()` returns a synthetic `enrichmentStatus` with every field set to `true` even though it never called `runPostInsertEnrichment()`. `buildIndexResult()` only warns when some enrichment flags are `false`, so this branch turns a real “deferred enrichment” no-op into a success-shaped result with no warning surface. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:206-225] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:2341-2363] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:309-316]

**Remediation suggestion:** Return an explicit skipped/deferred status (or at least one false/sentinel flag plus a warning) when planner-default mode bypasses enrichment, so callers can distinguish “pipeline succeeded” from “pipeline intentionally not run.”

### P2
1. **F005 — `hybrid` planner mode is exposed as configuration, but current runtime collapses it into the same behavior as `plan-only`.** `resolveSavePlannerMode()` and workflow options advertise `hybrid` as a supported value for future mixed flows, but the active branches only special-case `full-auto`; all non-`full-auto` values, including `hybrid`, follow the planner/default path. This is a documented future extension rather than a live regression, but it is still a dead config value today. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:123-135] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:288-291] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:2469-2470] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:2917-2919]

**Remediation suggestion:** Either downgrade `hybrid` to documentation-only until the mixed-flow branch exists, or add a distinct runtime branch so the exposed mode is behaviorally real.

## Ruled-out directions explored

- **Reconsolidation gating is live, not dead plumbing.** The bridge now keys save-time reconsolidation off `plannerMode === 'full-auto'` or the explicit flag, and the gated branch still reaches real reconsolidation and assistive-review logic when enabled. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:175-183] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:378-381]
- **Quality-loop advisory mode is an intentional downgrade, not an unreachable branch.** Advisory mode returns a non-fixing score surface that is consumed by planner responses, while full-auto still enables auto-fix via the same function. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:588-705] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1252-1254]
- **Planner follow-up actions are wired to real tools.** `refreshGraphMetadata`, `reindexSpecDocs`, and enrichment/reconsolidation follow-ups all resolve to concrete runtime entry points instead of orphaned action labels. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1600-1680]

## Evidence summary

- One success-shaped no-op remains in post-insert enrichment status reporting.
- One documented-but-unimplemented planner mode (`hybrid`) remains exposed.
- No additional dead branches were confirmed in reconsolidation, workflow follow-ups, or quality-loop mode switching.

## Novelty justification

This iteration added new signal by separating genuine dead/no-op behavior from intentional planner-first deferrals, which exposed one hidden observability gap and one explicit future-extension stub.
