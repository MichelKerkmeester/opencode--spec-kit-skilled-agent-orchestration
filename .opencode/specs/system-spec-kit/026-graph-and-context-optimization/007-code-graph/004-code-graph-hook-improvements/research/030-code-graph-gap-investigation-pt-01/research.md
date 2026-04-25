---
title: "...ion/009-hook-parity/013-code-graph-hook-improvements/research/030-code-graph-gap-investigation-pt-01/research]"
description: "This pass found 13 deduplicated missed files tied to packet 013’s code-graph + hook contract changes. Severity split: P1=9, P2=4. The missed surfaces are overwhelmingly docs, to..."
trigger_phrases:
  - "ion"
  - "009"
  - "hook"
  - "daemon"
  - "parity"
  - "research"
  - "030"
  - "code"
importance_tier: "normal"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-code-graph/004-code-graph-hook-improvements/research/030-code-graph-gap-investigation-pt-01"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["research.md"]
---
# Gap Investigation Research — 013

## Summary

This pass found 13 deduplicated missed files tied to packet `013`’s code-graph + hook contract changes. Severity split: `P1=9`, `P2=4`. The missed surfaces are overwhelmingly docs, tool metadata, and manual validation playbooks rather than hidden source-code defects. Recommendation: treat this as a follow-on doc-and-validation cleanup packet before the next operator-facing release or before using packet `013` as the canonical reference for code-graph startup/status/context behavior.

Important boundary note: `resource-map.md` and `checklist.md` reference `applied/T-*.md`, but those artifacts are missing on disk. To avoid false positives, this investigation conservatively excluded everything already named in `resource-map.md`, `tasks.md`, and `implementation-summary.md`.

## Missed Files Table

| Path | Relevance | Category | Needs Update Y/N |
|------|-----------|----------|------------------|
| `.opencode/skill/system-spec-kit/mcp_server/README.md` | Central MCP server reference still documents `code_graph_status` and `code_graph_context` at the pre-013 contract level. | README | Y |
| `.opencode/skill/system-spec-kit/mcp_server/code-graph/README.md` | Subsystem README still omits `graphQualitySummary`, blocked-read payloads, and structured `partialOutput` metadata. | README | Y |
| `.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md` | Install/troubleshooting guide mentions freshness/full-scan behavior but not the newer startup/status/context contract details. | Install guide | Y |
| `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts` | Public tool descriptions still advertise the old `code_graph_status` and `code_graph_context` contract summaries. | Config/schema | Y |
| `.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/08-code-graph-storage-query.md` | Feature page still points to stale test paths and counts-only status framing. | Feature catalog | Y |
| `.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/09-cocoindex-bridge-context.md` | Bridge page still points to stale test paths and omits the richer post-013 context contract. | Feature catalog | Y |
| `.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/24-code-graph-readiness-contract.md` | Readiness page stops at shared helper fields and does not mention the new blocked-read payload surface. | Feature catalog | Y |
| `.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/15-code-graph-auto-trigger.md` | Auto-trigger page still frames empty/stale outcomes purely as helper actions, not caller-visible blocked payloads. | Feature catalog | Maybe |
| `.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/250-session-start-startup.md` | Startup playbook validates the old startup contract and misses `graphQualitySummary` / payload assertions. | Manual testing | Y |
| `.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/254-code-graph-scan-query.md` | Storage/query playbook still uses stale test paths and counts-only `code_graph_status` checks. | Manual testing | Y |
| `.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/255-cocoindex-code-graph-routing.md` | Routing playbook still uses stale test paths and misses `partialOutput` / blocked-read expectations. | Manual testing | Y |
| `.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/260-code-graph-auto-trigger.md` | Auto-trigger playbook still validates action-only readiness rather than the new read-path payload contract. | Manual testing | Maybe |
| `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/README.md` | Handler-local README still summarizes `status.ts` and `context.ts` generically after the 013 contract changes. | README | Maybe |

## Why These Were Missed

Three patterns explain nearly all drift:

1. Packet `013` stayed implementation-close.
The packet resource map covered handlers, startup hooks, tests, packet docs, and `ENV_REFERENCE.md`, but it did not fan out into the repo’s secondary contract surfaces like READMEs, install docs, feature catalog, or manual testing playbooks.

2. The on-disk packet evidence is incomplete.
`resource-map.md` and `checklist.md` both cite `applied/T-*.md`, but those files do not exist on disk. That likely reduced the visibility of “what else should have moved” during closeout and forced this investigation to reconstruct the exclusion baseline from `tasks.md` and `implementation-summary.md`.

3. The post-013 changes were mostly contract enrichments, not new tools.
Because `graphQualitySummary`, `selectedCandidate`, blocked read payloads, startup payload transport, and `partialOutput` are incremental contract enrichments, adjacent docs that summarize the same tools were easy to leave untouched unless someone explicitly searched for those field names repo-wide.

## Recommended Resource Map Updates

Add the following as `Cited` or `Analyzed` entries to packet `013`’s [`resource-map.md`](../../007-code-graph/004-code-graph-hook-improvements/resource-map.md):

- `.opencode/skill/system-spec-kit/mcp_server/README.md`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/README.md`
- `.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md`
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`
- `.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/08-code-graph-storage-query.md`
- `.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/09-cocoindex-bridge-context.md`
- `.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/24-code-graph-readiness-contract.md`
- `.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/15-code-graph-auto-trigger.md`
- `.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/250-session-start-startup.md`
- `.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/254-code-graph-scan-query.md`
- `.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/255-cocoindex-code-graph-routing.md`
- `.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/260-code-graph-auto-trigger.md`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/README.md`

## Recommended Implementation Updates

High-confidence follow-up edits:

- Update `.opencode/skill/system-spec-kit/mcp_server/README.md` so `code_graph_status` documents `graphQualitySummary` and `code_graph_context` documents blocked-read plus `partialOutput` behavior.
- Update `.opencode/skill/system-spec-kit/mcp_server/code-graph/README.md` and `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/README.md` to reflect post-013 status/context/query surfaces.
- Update `.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md` troubleshooting and behavior notes with the 013-era contract vocabulary.
- Update `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts` descriptions so generated/public tool metadata matches the real outputs.
- Refresh feature catalog pages `08`, `09`, and `24` under `22--context-preservation-and-code-graph/` with the live test paths and richer context/status/readiness contract details.
- Refresh manual testing playbooks `250`, `254`, and `255` so startup, status, and routing validation cover `graphQualitySummary`, blocked read payloads, and `partialOutput`.

Lower-confidence follow-up edits:

- Decide whether `15-code-graph-auto-trigger.md` and `260-code-graph-auto-trigger.md` should stay helper-centric or explicitly teach the read-path blocked contract now visible to callers.

## Evidence Trail

- Iteration 01 established that the direct implementation surfaces changed, but the central README/install/schema family did not. It also recorded the failed-but-attempted semantic-search path: `mcp__cocoindex_code__.search(...)` returned runtime-side cancellation, and `ccc search ...` failed because the sandbox could not write the CocoIndex daemon log.
- Iteration 02 showed the strongest feature-catalog drift: stale test paths (`mcp_server/tests/...`) and readiness/context pages that stop short of 013’s richer user-visible payloads.
- Iteration 03 confirmed the same pattern in operator playbooks: startup, status, and routing scenarios still validate pre-013 behavior and old test locations.
- Iteration 04 rechecked the exclusion boundary against `resource-map.md`, `tasks.md`, and `implementation-summary.md`, then added one last handler-local README candidate and confirmed no additional implementation files surfaced.

## Convergence Report

Convergence was reached by iteration 4. New information dropped from `0.64` to `0.12`, and the final pass found only one extra low-confidence README file instead of another new file family. The investigation is saturated enough to drive a follow-on cleanup packet without another deep-research loop.

## References

- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/004-code-graph-hook-improvements/resource-map.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/004-code-graph-hook-improvements/spec.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/004-code-graph-hook-improvements/tasks.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/004-code-graph-hook-improvements/implementation-summary.md`
- `.opencode/skill/system-spec-kit/mcp_server/README.md`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/README.md`
- `.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md`
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/README.md`
- `.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/08-code-graph-storage-query.md`
- `.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/09-cocoindex-bridge-context.md`
- `.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/24-code-graph-readiness-contract.md`
- `.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/15-code-graph-auto-trigger.md`
- `.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/250-session-start-startup.md`
- `.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/254-code-graph-scan-query.md`
- `.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/255-cocoindex-code-graph-routing.md`
- `.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/260-code-graph-auto-trigger.md`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-context-handler.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-query-handler.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts`
