---
title: "...it/026-graph-and-context-optimization/009-hook-daemon-parity/013-code-graph-hook-improvements/implementation-summary]"
description: "Packet 013 implementation closeout for resolver correctness, blocked-read handling, graph-quality observability, startup payload parity, and bounded context contracts."
trigger_phrases:
  - "013 implementation summary"
  - "code-graph hook improvements closeout"
importance_tier: "important"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/013-code-graph-hook-improvements"
    last_updated_at: "2026-04-24T10:09:30Z"
    last_updated_by: "codex"
    recent_action: "packet-closeout-complete"
    next_safe_action: "review-validator-residuals"
    blockers:
      - "validate.sh still reports pre-existing template/link issues in spec.md, plan.md, and tasks.md, which were out of scope for this packet."
    key_files:
      - "implementation-summary.md"
      - "checklist.md"
      - "resource-map.md"
      - "review/review-report.md"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The startup parity fix kept the builder shared payload and transported a compact serialized derivative through Claude, Gemini, Copilot, and Codex runtime hooks, with direct startup regressions covering all four."
completed_at: "2026-04-24"
level: 2
source_docs:
  - "plan.md"
  - "../../research/013-code-graph-hook-improvements-pt-02/research.md"
status: "Complete"
template_source_marker: "implementation-summary-core | v2.2"
---
# Implementation Summary: Code-Graph Hook Improvements

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|---|---|
| Level | 2 |
| Status | Complete |
| Completed | 2026-04-24 |
| Source | `plan.md` + `../../research/013-code-graph-hook-improvements-pt-02/research.md` |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## What Was Built

The packet hardened code-graph CALLS resolution so ambiguous `handle*` subjects now select callable implementation nodes instead of wrapper shadows, and it made query/context reads fail explicitly when readiness requires a suppressed full scan. It also preserved CocoIndex ranking fidelity through seed resolution, cleared stale edge-enrichment summaries on null-summary scans, surfaced `graphQualitySummary` through status/startup readers, transported a compact startup shared-payload contract through Claude, Gemini, Copilot, and Codex runtime hooks, and turned `deadlineMs` plus `partialOutput` into real context response metadata.

### Files Changed

| Path | Summary |
|---|---|
| `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/query.ts` | Operation-aware subject resolution, selected-candidate metadata, blocked query contract |
| `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/context.ts` | Blocked context contract, deadline defaults, richer anchor metadata |
| `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/seed-resolver.ts` | CocoIndex score/snippet/range/provider preservation and ranking |
| `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-context.ts` | Deadline enforcement and structured partial-output metadata |
| `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-db.ts` | Graph-quality readers and enrichment-summary clearing helper |
| `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/scan.ts` | Null-summary clearing on successful scans |
| `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/status.ts` | `graphQualitySummary` reader exposure |
| `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/startup-brief.ts` | Graph-quality startup rendering and startup shared-payload transport |
| `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts` | Startup payload contract section |
| `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts` | Startup payload contract section |
| `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/session-prime.ts` | Startup payload contract banner transport |
| `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/session-start.ts` | Startup payload contract transport for Codex |
| `.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-query-handler.vitest.ts` | Resolver ambiguity and blocked-read regressions |
| `.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-context-handler.vitest.ts` | Blocked-read, seed-fidelity, and partial-output regressions |
| `.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-scan.vitest.ts` | Overwrite-then-clear enrichment summary regression |
| `.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts` | Claude, Gemini, and Copilot startup payload contract regressions |
| `.opencode/skill/system-spec-kit/mcp_server/tests/codex-session-start-hook.vitest.ts` | Codex startup payload contract regression |
| `.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md` | Operator note for `graphQualitySummary` |
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The work stayed inside the packet’s declared target files and followed the research buckets directly: first by encoding the missing regressions, then by tightening the query/context contracts and metadata transport, and finally by running the exact Vitest suites, grep checks, and packet validation steps named in `tasks.md`.
This checkout does not include a packet-local `applied/` ledger, so the auditable packet evidence is the on-disk task plan, this summary, `checklist.md`, `resource-map.md`, and the packet review artifacts under `review/`.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## Key Decisions

- Kept the startup `sharedPayload` contract and transported a compact serialized derivative through runtime adapters instead of deleting the builder-level contract.
- Used operation-specific edge counts plus callable-kind preference to resolve ambiguous CALLS/import subjects, which directly addresses the wrapper-shadow regression without changing the underlying graph schema.
- Returned `status: "blocked"` for suppressed `full_scan` reads so callers get an explicit contract instead of misreading empty graph answers as valid absence.
- Preserved CocoIndex semantic score as the primary seed-ordering signal and graph confidence as the fallback/tie-break layer.
- Exposed bounded-work behavior as structured `partialOutput` metadata rather than relying only on truncation text markers.
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## Verification

| Check | Result | Evidence |
|---|---|---|
| Focused Vitest packet suites | Pass | `5` files, `39` tests |
| Targeted eslint on modified files | Pass | `npx eslint ...` over all touched packet files |
| TypeScript compile (`mcp_server`) | Pass | `npx tsc --noEmit` |
| Cross-consistency grep | Pass | `full_scan`, `selectedCandidate`, `graphQualitySummary`, `sharedPayload`, `deadlineMs`, `partialOutput`, `graphAnswersOmitted` all found in expected surfaces |
| Packet-local audit trail | Pass | `tasks.md`, `implementation-summary.md`, `checklist.md`, `resource-map.md`, `review/review-report.md`, and `review/deep-review-findings-registry.json` are present in this checkout |
| Workspace `npm run check --workspace=@spec-kit/mcp-server` | Fail | blocked by unrelated pre-existing lint errors in untouched files |
| Packet validator | Fail | residual immutable-doc issues in `spec.md`, `plan.md`, and `tasks.md` |
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## Known Limitations

- `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh ... --strict` still fails because `spec.md`, `plan.md`, and `tasks.md` contain pre-existing template-anchor/template-source/link issues, and this packet explicitly disallowed modifying those files.
- `npm run check --workspace=@spec-kit/mcp-server` still fails on unrelated repo-wide lint issues in untouched files outside this packet.
<!-- /ANCHOR:limitations -->
