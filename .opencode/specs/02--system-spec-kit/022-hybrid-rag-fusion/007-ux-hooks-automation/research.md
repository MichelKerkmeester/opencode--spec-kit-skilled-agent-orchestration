---
title: "Research: UX Hook Improvement Opportunities"
description: "Evidence-based investigation of current MCP UX hooks, ranked improvements, and proposed new hooks."
status: "complete"
created: "2026-03-06"
updated: "2026-03-06"
---

# Research: UX Hook Improvement Opportunities

## 1. Metadata

| Field | Value |
|---|---|
| Research ID | `007-ux-hooks-automation-research-2026-03-06` |
| Status | Complete |
| Scope | Active spec folder, current hook modules, handler integrations, schemas, tests, and local docs |
| Writable artifact | `research.md` only |
| Confidence | Medium-High |

## 2. Investigation Report

### Request Summary

Investigate the current UX hook system in the system-spec-kit MCP server, identify concrete improvement opportunities, and propose genuinely useful new hooks grounded in the existing codebase and test surface. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-ux-hooks-automation/spec.md:38-60]

### Existing Hook Inventory

| Rank | Current hook/module | Current behavior | Evidence |
|---|---|---|---|
| 1 | `hooks/memory-surface.ts` | Provides `extractContextHint`, constitutional cache helpers, `autoSurfaceMemories`, `autoSurfaceAtToolDispatch`, and `autoSurfaceAtCompaction`; drives SK-004/TM-05 auto-surface behavior. | [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:42-80] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:132-218] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:241-277] |
| 2 | `hooks/mutation-feedback.ts` | Converts `MutationHookResult` into `postMutationHooks` data plus string hints about cache clears and tool cache invalidation. | [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/mutation-feedback.ts:5-53] |
| 3 | `hooks/response-hints.ts` | Parses the MCP JSON envelope in `content[0].text`, appends one auto-surface hint, and writes `meta.autoSurface`. | [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/response-hints.ts:21-68] |
| 4 | `handlers/mutation-hooks.ts` | Central post-mutation hook runner clears trigger, constitutional, graph, and coactivation caches and invalidates tool cache. | [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/mutation-hooks.ts:11-68] |
| 5 | `context-server.ts` integration | Runs memory-aware auto-surface or TM-05 tool-dispatch/compaction hooks before dispatch, then appends auto-surface hints on success only. | [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:278-304] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:369-373] |
| 6 | Save/update/delete/bulk-delete integrations | These mutation handlers call `runPostMutationHooks(...)`, build UX feedback, and return `data.postMutationHooks`. | [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1225-1239] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:242-275] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:209-244] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:205-244] |
| 7 | Schema support | New UX-hook-adjacent parameters currently exposed are `autoRepair` for `memory_health` and `confirmName` for `checkpoint_delete`. | [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:196-222] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:184-209] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:281-295] |
| 8 | Test coverage | Dedicated tests exist for hook helpers and TM-05 flows, but some integration assertions remain source-regex based and legacy export tests are stale/skipped. | [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/hooks-ux-feedback.vitest.ts:8-76] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:622-724] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1483-1500] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/modularization.vitest.ts:236-252] |

### Baseline Corrections

These follow-ons are no longer roadmap items because the current implementation and regression coverage already treat them as shipped behavior:

- Atomic save now returns `postMutationHooks` for successful non-duplicate saves, while still preserving partial-success guidance when indexing fails. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1405-1459] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:94-110]
- Duplicate-content save no-ops intentionally suppress false mutation feedback and instead report that caches were left unchanged. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1418-1459] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:68-91]
- Auto-surface hint appends now refresh `meta.tokenCount` after mutating the response envelope, so stale token metadata is already addressed. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/response-hints.ts:23-69] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:730-775] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/hooks-ux-feedback.vitest.ts:35-66]

### Top 10 Improvement Opportunities

| Rank | Improvement | Current behavior | Proposed behavior | Confidence | Evidence |
|---|---|---|---|---|---|
| 1 | Upgrade from string-only hints to structured actions | The envelope contract is still `hints: string[]`, and hook helpers can only append advisory text. | Add machine-readable action objects or `meta.actions` so clients can render buttons, next steps, severity, and dedupe logic. | High | [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/envelope.ts:22-37] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/envelope.ts:94-126] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/response-hints.ts:35-69] |
| 2 | Centralize success-hint generation beyond mutations | Save, checkpoint, health, index, validation, and learning handlers still build ad hoc hint arrays manually. | Introduce a shared success-hint composer layer so common patterns are consistent, deduplicated, and testable. | High | [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1281-1339] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:126-176] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:483-525] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:625-648] |
| 3 | Replace manual hook wiring with a small registry/pipeline | The current system still uses direct imports and manual calls from handlers and `context-server.ts`; there is no single registry or composition point. | Add a lightweight hook registry per lifecycle (`pre-dispatch`, `post-mutation`, `response-append`) to reduce missed paths and simplify future expansion. | Medium-High | [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/index.ts:5-7] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:278-304] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:369-373] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:242-243] |
| 4 | Normalize post-mutation context payloads | Save/delete/bulk-delete pass richer context than update, and mutation-specific payload shapes still vary by handler. | Standardize a shared context object (`operation`, `memoryIds`, `specFolder`, `filePath`, `counts`, `checkpointName`) for all mutations. | High | [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1225-1239] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:242-263] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:209-236] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:205-236] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1418-1459] |
| 5 | Create a dedicated hook contract/types module | Hook types are split across `mutation-hooks.ts`, `envelope.ts`, and tool arg types, which keeps the hook contract scattered. | Move shared hook contracts into `hooks/types.ts` or similar and make docs/tests point at that source of truth. | Medium-High | [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/mutation-hooks.ts:11-18] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/envelope.ts:11-27] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/README.md:37-51] |
| 6 | Harden `appendAutoSurfaceHints()` for richer envelopes | The helper now refreshes `meta.tokenCount`, but it still only touches `content[0].text`, assumes JSON, and provides counts without rationale. | Support multi-part responses, merge richer metadata safely, and carry surfaced-memory rationale or non-fatal parse telemetry. | High | [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/response-hints.ts:23-69] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/hooks-ux-feedback.vitest.ts:35-78] |
| 7 | Add first-class hook telemetry | Current hook latency is returned for mutations, but there is no shared execution record for which hooks ran, skipped, or failed. | Emit per-hook telemetry into response metadata and/or observability streams for tuning false positives and latency. | Medium | [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/mutation-hooks.ts:20-67] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:292-303] [CITATION: NONE - inference from missing shared telemetry contract in reviewed hook/envelope files] |
| 8 | Add configurable hook policies per tool/lifecycle | TM-05 budgets are fixed at 4000 and disablement is only boolean per helper call; there is no per-tool policy or throttling layer. | Introduce per-tool hook policies for budgets, max surfaced items, opt-out behavior, and future rate limiting. | Medium | [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:51-58] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:194-258] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:58-65] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:182-219] |
| 9 | Expand auto-surface explanations beyond count summaries | Current success hints explain how many memories surfaced, but not why those specific memories were selected. | Attach surfaced-memory rationale such as constitutional directive vs trigger phrase vs compaction preservation. | Medium-High | [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/response-hints.ts:43-64] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:149-163] |
| 10 | Retire legacy modularization/export assertions in favor of live contract checks | Runtime behavior is covered, but the remaining skipped/stale modularization checks still carry legacy assumptions and weaken change detection. | Replace regex/export assertions with live barrel/runtime checks that validate the current hook surface. | Medium-High | [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/modularization.vitest.ts:236-252] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/index.ts:5-7] |

### Top 10 New Hook Proposals

| Rank | Proposed hook | Why it is useful now | Recommended initial scope | Confidence | Evidence |
|---|---|---|---|---|---|
| 1 | `hooks/response-actions.ts` | The current response system still cannot express actionable UI affordances beyond strings. | Append structured actions alongside `hints` for all success/error envelopes. | High | [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/envelope.ts:22-37] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/envelope.ts:158-193] |
| 2 | `hooks/success-hint-composer.ts` | Follow-up hints are still scattered across handlers, which keeps copy, ordering, and dedupe rules inconsistent. | Consolidate success-message composition for checkpoint, health, index, validation, and learning flows. | High | [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1281-1339] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:126-176] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:625-648] |
| 3 | `hooks/checkpoint-lifecycle-hints.ts` | Checkpoint create/list/restore/delete each handcraft follow-up commands and safety hints. | Standardize restore/delete next steps, empty-state guidance, and destructive-operation safety copy. | High | [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:126-176] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:255-305] |
| 4 | `hooks/health-remediation.ts` | `memory_health` already produces repair state, warnings, and remedial text; the logic is valuable but isolated. | Normalize repair actions, warnings, and explicit operator commands for FTS/divergent-alias issues. | High | [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:296-347] |
| 5 | `hooks/index-scan-remediation.ts` | `memory_index_scan` has a rich remediation surface for failures, stale deletes, dedup, and divergence reconcile. | Convert scan results into ranked next actions and structured remediation metadata. | High | [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:483-525] |
| 6 | `hooks/preflight-remediation.ts` | `memory_save` dry-run and preflight failure responses already encode next actions that would benefit from reuse. | Normalize dry-run pass/fail hints, bypass guidance, and validation detail summaries. | High | [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1150-1197] |
| 7 | `hooks/learning-history-guidance.ts` | Learning history has lightweight hints today and no dedicated hook abstraction. | Add trend-based next actions for missing postflight, regression detection, and spec-level follow-up. | Medium-High | [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:625-648] |
| 8 | `hooks/auto-surface-explanations.ts` | Auto-surface hints currently explain counts only, not why specific memories surfaced. | Attach surfaced-memory rationale such as constitutional directive vs trigger phrase vs compaction preservation. | Medium-High | [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/response-hints.ts:43-64] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:149-163] |
| 9 | `hooks/hook-telemetry.ts` | There is no reusable, centralized execution trace for hook behavior today. | Record hook name, lifecycle, latency, skip reason, and failure mode for debugging and tuning. | Medium | [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/mutation-hooks.ts:20-67] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:292-303] [CITATION: NONE - inference from missing dedicated telemetry hook module] |
| 10 | `hooks/hook-policy.ts` | Hook budgets and disablement behavior are still hard-coded at call sites. | Centralize per-tool lifecycle budgets, max surfaced items, and opt-out rules. | Medium | [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:51-58] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:194-258] |

### Recommended Priority Order

1. Structured response actions
2. Shared success-hint composer
3. Hook registry/pipeline
4. Hook contract/types module
5. Checkpoint lifecycle hook
6. Health remediation hook
7. Index scan remediation hook
8. Response hint hardening and explanations
9. First-class hook telemetry
10. Tool/lifecycle hook policy controls

## 3. Executive Overview

The current UX hook system is still intentionally small, but the baseline is stronger than the original roadmap now suggests: atomic-save feedback parity, duplicate-save no-op cleanup, refreshed auto-surface token metadata, README export alignment, and end-to-end appended-envelope assertions are already in place. The highest-value future work is no longer parity cleanup; it is richer response contracts, shared hint composition, and broader lifecycle orchestration that make the current hook surface easier to extend without drift. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1418-1459] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:68-110] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/response-hints.ts:23-69] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:730-775] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/README.md:41-51]

```text
Tool call
  -> context-server pre-dispatch auto-surface
  -> handler business logic
  -> optional post-mutation hook runner
  -> response envelope
  -> response-hints append auto-surface meta
```

## 4. Core Architecture

The architecture has three current hook loci:

1. Pre-dispatch and compaction surfacing in `context-server.ts`. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:278-304]
2. Post-mutation cache invalidation in `handlers/mutation-hooks.ts`. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/mutation-hooks.ts:20-67]
3. Success-envelope enrichment in `hooks/response-hints.ts`. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/response-hints.ts:21-68]

This architecture is functional but manually composed, which is why some adjacent flows gained hook UX and others still rely on isolated `hints: string[]` blocks. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1281-1339] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:126-176]

## 5. Technical Specifications

Current hook-facing contracts are:

- `MutationHookResult` with latency and cache-clear booleans. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/mutation-hooks.ts:11-18]
- MCP envelopes with `summary`, `data`, `hints`, and `meta`. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/envelope.ts:22-27]
- `memory_health.autoRepair` and `checkpoint_delete.confirmName` as the only schema-level UX-hook-adjacent controls added in this phase. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:196-222]

## 6. Constraints & Limitations

- The public response contract is string-hint based, which limits client UX richness. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/envelope.ts:22-37]
- Auto-surface hint appending depends on JSON text in the first content item only. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/response-hints.ts:21-28]
- Atomic save intentionally allows partial-success states because file write and async indexing are not fully atomic. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1346-1353]
- Legacy modularization/export checks still trail the active runtime surface, which raises maintenance cost for broader hook rollout even though the README itself is now aligned. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/README.md:41-51] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/modularization.vitest.ts:236-252]

## 7. Integration Patterns

The repeated pattern today is "handler-local business logic -> build local hints -> optionally splice in hook feedback." That pattern appears in save, update, delete, and bulk delete, while other handlers like checkpoint, health, index, validation, and learning keep their own bespoke hint logic. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1281-1339] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:249-275] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:126-176] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:483-525]

## 8. Implementation Guide

### Option A: Incremental hook expansion

- Extend the current helper approach with targeted new hooks for response actions, checkpoint lifecycle, health remediation, index remediation, and shared hint composition.
- Pros: Low migration risk, preserves current handler structure, fastest value. 
- Cons: Still leaves manual composition unless paired with a shared hint composer.
- Confidence: High. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:126-305] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/envelope.ts:22-37]

### Option B: Small lifecycle registry

- Add a tiny registry for `pre-dispatch`, `post-mutation`, and `response-append` hooks, then migrate helpers into it.
- Pros: Better consistency, fewer missed integrations, easier telemetry.
- Cons: Larger refactor, touches core dispatch and multiple handlers.
- Confidence: Medium-High. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:278-304] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:369-373]

Recommendation: start with Option A for the top three priorities, then adopt Option B only after the contract and coverage gaps are closed. [CITATION: NONE - synthesis from ranked findings above]

## 9. Code Examples

Representative current pattern:

- Save path returns `postMutationHooks` plus many local hints. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1225-1239] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1281-1339]
- Response append path mutates envelope JSON after dispatch. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/response-hints.ts:21-68]
- Context server injects `autoSurfacedContext` only on successful responses. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:369-373]

## 10. Testing & Debugging

What is covered:

- Helper-level tests for mutation feedback and response-hint append behavior. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/hooks-ux-feedback.vitest.ts:8-76]
- Regression coverage for duplicate-content no-op handling and atomic-save feedback behavior in the save path. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:68-110]
- Runtime harness coverage for TM-05 tool-dispatch and compaction routing, including appended success-envelope hints. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:622-775]
- Extensive unit coverage for dual-scope hook budgets and skip rules. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:58-176]

Main gaps:

- There is still no regression coverage for richer envelope variants such as multi-part content or metadata-merge cases in `appendAutoSurfaceHints()`. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/response-hints.ts:23-69] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/hooks-ux-feedback.vitest.ts:35-78]
- Legacy export coverage is skipped and stale. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/modularization.vitest.ts:236-252]

## 11. Performance

The current hook system already bakes in token-budget thinking, especially for TM-05, with fixed 4000-token budgets for tool dispatch and compaction hooks. This suggests hook expansion should prefer richer metadata over larger surfaced payloads. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:51-58] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:58-76]

## 12. Security

Current UX-hook-related safety features already include:

- `checkpoint_delete.confirmName` for destructive confirmation. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:277-305]
- Non-fatal auto-surface failures in `context-server.ts`, reducing cascade risk from hook errors. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:286-303]

Any new hook work should preserve these safety properties and avoid introducing blocking behavior for advisory UX-only hooks. [CITATION: NONE - inference from current non-fatal design]

## 13. Maintenance

Maintenance risk is now concentrated in duplicated hint logic and legacy verification artifacts rather than README drift. The runtime hook surface is small enough to manage today, but it will drift again if contracts and export checks remain distributed across handlers, envelope helpers, and stale modularization tests. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/README.md:41-51] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/modularization.vitest.ts:236-252] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1281-1339]

## 14. API Reference

| API | Type | Notes | Evidence |
|---|---|---|---|
| `MEMORY_AWARE_TOOLS` | `Set<string>` | Controls recursion avoidance for auto-surface. | [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:42-49] |
| `autoSurfaceMemories(contextHint)` | hook helper | Core surfacing path for constitutional + trigger-based memories. | [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:132-169] |
| `autoSurfaceAtToolDispatch(toolName, toolArgs, options)` | lifecycle hook | TM-05 pre-dispatch path for non-memory-aware tools. | [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:175-218] |
| `autoSurfaceAtCompaction(sessionContext, options)` | lifecycle hook | TM-05 compaction path for resume flows. | [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:224-258] |
| `runPostMutationHooks(operation, context)` | lifecycle hook | Clears caches and invalidates tool cache after mutation. | [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/mutation-hooks.ts:20-67] |
| `buildMutationHookFeedback(operation, hookResult)` | formatter hook | Shapes mutation feedback data and string hints. | [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/mutation-feedback.ts:7-53] |
| `appendAutoSurfaceHints(result, autoSurfacedContext)` | response hook | Mutates MCP JSON envelope with auto-surface hint and `meta.autoSurface`. | [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/response-hints.ts:21-68] |

## 15. Troubleshooting

| Symptom | Likely cause | Recommended check | Evidence |
|---|---|---|---|
| Modularization/export checks fail while runtime behavior looks correct | Legacy export assertions still reflect an older hook surface | Compare `tests/modularization.vitest.ts` with `hooks/index.ts` and the current README exports before assuming runtime drift. | [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/modularization.vitest.ts:236-252] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/index.ts:5-7] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/README.md:41-51] |
| Auto-surface hint missing from success response | Envelope not parseable from `content[0].text` or hook no-op | Reproduce with a JSON envelope and inspect `appendAutoSurfaceHints()`. | [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/response-hints.ts:21-68] |
| Expected mutation feedback is missing on a save response | The save may be a duplicate-content no-op, which intentionally suppresses `postMutationHooks` and leaves caches untouched | Check `data.status` and current duplicate-save hints before treating the absence of hook feedback as a regression. | [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1418-1459] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:68-91] |

## 16. Acknowledgements

Research sources:

- Active spec and plan documents. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-ux-hooks-automation/spec.md:38-60] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-ux-hooks-automation/plan.md:33-99]
- Hook modules, handler integrations, schemas, envelope utilities, and tests listed throughout this report.

Tools used: local code search and file inspection only; no external web sources were required because the request was codebase-grounded and the needed evidence was present in-repo. [CITATION: NONE - process note]

## 17. Appendix & Changelog

### Evidence Quality

- Grade A: direct code and spec citations used for all concrete behavior claims.
- Grade B: none needed.
- Grade C: explicit inferences marked where recommendations extend beyond currently implemented contracts.

### Changelog

- 2026-03-06: Initial research artifact created for UX hook opportunity analysis.
- 2026-03-06: Refreshed roadmap to remove already-implemented follow-ons and re-rank only remaining hook expansion opportunities.
