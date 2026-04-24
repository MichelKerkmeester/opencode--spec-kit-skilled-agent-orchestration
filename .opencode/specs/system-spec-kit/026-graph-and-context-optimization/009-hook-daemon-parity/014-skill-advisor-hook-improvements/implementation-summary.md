---
template_source_marker: "<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->"
title: "Implementation Summary: Skill-Advisor Hook Improvements"
description: "Completed packet 014: OpenCode threshold/render parity, Codex shared-brief normalization, public MCP workspace/threshold semantics, and durable prompt-safe telemetry with outcome capture."
trigger_phrases:
  - "014 skill-advisor hook improvements complete"
  - "026/009/014 implementation"
importance_tier: "high"
contextType: "spec"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/014-skill-advisor-hook-improvements"
    last_updated_at: "2026-04-24T08:13:17Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "packet-014-implemented"
    next_safe_action: "track-external-build-blockers"
    blockers:
      - "Global package build still fails in unrelated files outside this packet scope"
    completion_pct: 100
---
# Implementation Summary: Skill-Advisor Hook Improvements

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

## Metadata
<!-- ANCHOR:metadata -->

| Field | Value |
| --- | --- |
| **Level** | 2 |
| **Status** | Complete |
| **Completed** | 2026-04-24T08:13:17Z |
| **Source** | `plan.md` + `../../research/014-skill-advisor-hook-improvements-pt-02/research.md` |
<!-- /ANCHOR:metadata -->

## What Was Built
<!-- ANCHOR:what-built -->

- OpenCode now uses one explicit threshold contract across plugin defaults, native bridge routing, fallback routing, and operator-facing bridge metadata.
- OpenCode native bridge rendering now flows through the shared `renderAdvisorBrief(...)` invariants instead of a bespoke formatter.
- Codex prompt submission and prompt-wrapper fallback now share the same builder, timeout, threshold, and durable-diagnostics contract.
- `advisor_recommend` and `advisor_validate` now accept explicit `workspaceRoot`, and both public outputs expose the effective state they used.
- `advisor_validate` now publishes aggregate-vs-runtime threshold semantics and a prompt-safe telemetry block, including accepted/corrected/ignored outcome totals.
- Hook diagnostics now persist to bounded JSONL sinks under the temp metrics root, and validator analysis can read those sinks back across processes.
### Files Changed

| Path | Scope |
| --- | --- |
| `.opencode/plugins/spec-kit-skill-advisor.js` | OpenCode threshold default parity |
| `.opencode/plugin-helpers/spec-kit-skill-advisor-bridge.mjs` | OpenCode threshold + render contract |
| `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/plugin-bridge.vitest.ts` | OpenCode parity regression coverage |
| `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts` | Codex shared-builder normalization + durable diagnostics |
| `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/prompt-wrapper.ts` | Codex fallback parity + durable diagnostics |
| `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/skill-advisor-brief.ts` | Shared threshold helpers |
| `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/render.ts` | Shared render threshold options |
| `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/schemas/advisor-tool-schemas.ts` | Public workspace/threshold/telemetry schemas |
| `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-recommend.ts` | Public workspace + threshold outputs |
| `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-validate.ts` | Threshold semantics + telemetry/outcomes |
| `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/README.md` | Public contract docs |
| `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/metrics.ts` | Durable diagnostics + outcomes |
| `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts` | Durable diagnostics sink wiring |
| `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/user-prompt-submit.ts` | Durable diagnostics sink wiring |
| `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/user-prompt-submit.ts` | Durable diagnostics sink wiring |
| `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md` | Hook/operator contract docs |
<!-- /ANCHOR:what-built -->

## How It Was Delivered
<!-- ANCHOR:how-delivered -->

The packet was executed in task order: first by reading the packet docs and research inputs, then by landing the shared threshold/result primitives that the runtime adapters depend on, then by wiring OpenCode, Codex, the public MCP handlers, and the telemetry surfaces onto that shared contract. Once the code paths were aligned, focused Vitest suites, direct hook/bridge smokes, validator/output smokes, and cross-consistency greps were run and captured into per-task applied reports.
<!-- /ANCHOR:how-delivered -->

## Key Decisions
<!-- ANCHOR:decisions -->

- Kept OpenCode’s native bridge route, but forced it through the same threshold object and shared renderer as the fallback path instead of preserving a custom formatter.
- Removed Codex’s bespoke prompt-time fast path rather than partially copying shared invariants into a second scorer branch.
- Preserved backward compatibility on public tool inputs by making `workspaceRoot` optional on input while making it explicit on output.
- Published aggregate validation thresholds separately from runtime routing thresholds so operator tooling can distinguish release gates from prompt-time routing behavior.
- Used prompt-safe bounded JSONL sinks in the temp directory for durable diagnostics and outcome totals so hook state survives process boundaries without persisting raw prompt text.
<!-- /ANCHOR:decisions -->

## Verification
<!-- ANCHOR:verification -->

| Check | Result | Notes |
| --- | --- | --- |
| OpenCode parity vitest | Pass | `./node_modules/.bin/vitest run ./skill-advisor/tests/compat/plugin-bridge.vitest.ts --reporter=dot` -> `Tests 4 passed (4)` |
| Validator vitest | Pass | `./node_modules/.bin/vitest run ./skill-advisor/tests/handlers/advisor-validate.vitest.ts --reporter=dot` -> `Tests 3 passed (3)` |
| Direct bridge smoke | Pass | Returned prompt-safe brief plus `workspaceRoot` and `effectiveThresholds` |
| Direct Codex smokes | Pass | Both entrypoints returned prompt-safe fail-open `{}` output with durable diagnostics |
| Direct handler smokes | Pass | `advisor_recommend` and `advisor_validate` returned the new public fields and telemetry totals |
| Cross-consistency grep | Pass | README, hook reference, and schema now agree on `workspaceRoot`, `effectiveThresholds`, and `thresholdSemantics` |
| Full package build | Fail | Blocked by unrelated pre-existing TypeScript errors in `hooks/claude/hook-state.ts`, `lib/context/shared-payload.ts`, and `code-graph/lib/code-graph-context.ts` outside this packet scope |
<!-- /ANCHOR:verification -->

## Known Limitations
<!-- ANCHOR:limitations -->

- The repository-wide `npm --prefix .opencode/skill/system-spec-kit/mcp_server run build` remains blocked by unrelated packet-external TypeScript errors, so full-package build parity could not be re-established inside this scope lock.
- The current workspace reports stale advisor freshness during direct hook/bridge smokes, so the verification evidence exercised prompt-safe stale/fallback behavior rather than a live daemon path.
<!-- /ANCHOR:limitations -->
