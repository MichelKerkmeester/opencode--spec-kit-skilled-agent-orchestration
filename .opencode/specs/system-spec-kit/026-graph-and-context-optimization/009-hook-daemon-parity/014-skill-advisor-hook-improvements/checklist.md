---
title: "...tem-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/014-skill-advisor-hook-improvements/checklist]"
description: "Evidence-backed implementation checklist for packet 014 skill-advisor runtime parity, MCP surface normalization, and telemetry durability."
trigger_phrases:
  - "014 skill-advisor checklist"
  - "026/009/014 verification"
importance_tier: "important"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core + level2-verify | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/014-skill-advisor-hook-improvements"
    last_updated_at: "2026-04-24T10:44:39Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "rg-019-codex-evidence-relinked"
    next_safe_action: "continue-review-gap-remediation-packet"
    completion_pct: 100
template_source_marker: "<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core + level2-verify | v2.2 -->"
---
# Verification Checklist: Skill-Advisor Hook Improvements

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core + level2-verify | v2.2 -->

---

## Verification Protocol
<!-- ANCHOR:protocol -->

### P0 - Blockers

- [x] REQ-001 OpenCode and Codex runtime entrypoints share the packet-014 threshold/render contract. [Evidence: `implementation-summary.md` "What Was Built" bullets 1-3 and "Key Decisions" bullets 1-2.]
- [x] REQ-002 Public advisor MCP surfaces expose explicit workspace and threshold state. [Evidence: `implementation-summary.md` "What Was Built" bullets 4-5 and "Verification" rows for direct handler smokes and cross-consistency grep.]
- [x] REQ-003 Prompt-safe diagnostics and outcome totals persist beyond process-local stderr output. [Evidence: `implementation-summary.md` "What Was Built" bullet 6 plus the "Verification" rows for validator vitest and direct handler smokes.]
<!-- /ANCHOR:protocol -->

## Pre-Implementation
<!-- ANCHOR:pre-impl -->

### P1 - Required

- [x] REQ-004 Focused verification covers the shipped runtime, MCP, and telemetry surfaces. [Evidence: `implementation-summary.md` "Verification" rows for OpenCode parity vitest, validator vitest, direct bridge smoke, Codex hook + wrapper verification, and direct handler smokes.]
- [x] REQ-005 Packet lineage remains internally consistent after implementation. [Evidence: `spec.md` Section 2 and Section 6 plus `implementation-summary.md` metadata `Source` field.]

### Task Tracking

Packet-local `applied/T-###.md` reports are not present in this checkout. The task rows below therefore cite the surviving packet ledger in `tasks.md`, `implementation-summary.md`, and repo-local test files that actually exist on disk.

- [x] [P1] T-001 Add OpenCode threshold/render regression scaffolds. [Evidence: `tasks.md` Phase 1 `T-001`; `implementation-summary.md` Files Changed rows for `.opencode/plugins/spec-kit-skill-advisor.js`, `.opencode/plugin-helpers/spec-kit-skill-advisor-bridge.mjs`, and `plugin-bridge.vitest.ts`.]
- [x] [P1] T-002 Add Codex shared-brief parity fixtures. [Evidence: `tasks.md` Phase 1 `T-002`; `implementation-summary.md` Files Changed rows for `hooks/codex/user-prompt-submit.ts`, `hooks/codex/prompt-wrapper.ts`, and `skill-advisor/lib/skill-advisor-brief.ts`.]
- [x] [P1] T-003 Establish explicit workspaceRoot and threshold-semantic baseline assertions. [Evidence: `tasks.md` Phase 1 `T-003`; `implementation-summary.md` Files Changed rows for `schemas/advisor-tool-schemas.ts`, `handlers/advisor-recommend.ts`, `handlers/advisor-validate.ts`, and `README.md`.]
- [x] [P1] T-004 Capture durable-diagnostics and outcome-event baseline expectations. [Evidence: `tasks.md` Phase 1 `T-004`; `implementation-summary.md` Files Changed rows for `skill-advisor/lib/metrics.ts` and the runtime hook adapters.]
- [x] [P1] T-005 Implement OpenCode effective-threshold unification. [Evidence: `tasks.md` Phase 2 `T-005`; `implementation-summary.md` Files Changed rows for `.opencode/plugins/spec-kit-skill-advisor.js`, `.opencode/plugin-helpers/spec-kit-skill-advisor-bridge.mjs`, `skill-advisor/lib/skill-advisor-brief.ts`, and `references/hooks/skill-advisor-hook.md`.]
- [x] [P1] T-006 Route OpenCode native rendering onto shared brief invariants. [Evidence: `tasks.md` Phase 2 `T-006`; `implementation-summary.md` Files Changed rows for `.opencode/plugin-helpers/spec-kit-skill-advisor-bridge.mjs`, `skill-advisor/lib/render.ts`, and `plugin-bridge.vitest.ts`.]
- [x] [P1] T-007 Normalize the Codex prompt-time fast path against the shared builder. [Evidence: `tasks.md` Phase 2 `T-007`; `implementation-summary.md` Files Changed rows for `hooks/codex/user-prompt-submit.ts`, `hooks/codex/prompt-wrapper.ts`, and `skill-advisor/lib/skill-advisor-brief.ts`.]
- [x] [P1] T-008 Add explicit workspace selection across public advisor tools. [Evidence: `tasks.md` Phase 2 `T-008`; `implementation-summary.md` Files Changed rows for `schemas/advisor-tool-schemas.ts`, `handlers/advisor-recommend.ts`, `handlers/advisor-validate.ts`, and `README.md`.]
- [x] [P1] T-009 Publish aggregate-vs-runtime threshold semantics in validation outputs. [Evidence: `tasks.md` Phase 2 `T-009`; `implementation-summary.md` Files Changed rows for `handlers/advisor-validate.ts`, `schemas/advisor-tool-schemas.ts`, and `README.md`.]
- [x] [P1] T-010 Add a durable prompt-safe diagnostics sink and health surface. [Evidence: `tasks.md` Phase 2 `T-010`; `implementation-summary.md` Files Changed rows for `skill-advisor/lib/metrics.ts` and the Claude, Gemini, Copilot, and Codex hook adapters.]
- [x] [P1] T-011 Add accepted/corrected/ignored outcome capture. [Evidence: `tasks.md` Phase 2 `T-011`; `implementation-summary.md` What Was Built bullet on outcome totals plus Files Changed rows for `skill-advisor/lib/metrics.ts`, `handlers/advisor-validate.ts`, and `schemas/advisor-tool-schemas.ts`.]
- [x] [P1] T-012 Run OpenCode parity regressions. [Evidence: `implementation-summary.md` Verification row `OpenCode parity vitest`.]
- [x] [P1] T-013 Run Codex parity regressions. [Evidence: `implementation-summary.md` verification row `Codex hook + wrapper verification`; `.opencode/skill/system-spec-kit/mcp_server/tests/codex-user-prompt-submit-hook.vitest.ts`; `.opencode/skill/system-spec-kit/mcp_server/tests/codex-prompt-wrapper.vitest.ts`]
- [x] [P1] T-014 Run validator and cross-consistency checks. [Evidence: `implementation-summary.md` Verification rows `Validator vitest` and `Cross-consistency grep`.]
- [x] [P1] T-015 Run telemetry persistence and outcome-learning verification. [Evidence: `implementation-summary.md` Verification row `Direct handler smokes`.]
<!-- /ANCHOR:pre-impl -->

## Code Quality
<!-- ANCHOR:code-quality -->

- [x] Focused OpenCode parity suite passed. [Evidence: `implementation-summary.md` Verification row `OpenCode parity vitest`.]
- [x] Focused validator suite passed. [Evidence: `implementation-summary.md` Verification row `Validator vitest`.]
- [x] Full-package build blocker documented honestly. [Evidence: `implementation-summary.md` verification table.]
<!-- /ANCHOR:code-quality -->

## Testing
<!-- ANCHOR:testing -->

- [x] Direct bridge smoke returned the unified threshold metadata. [Evidence: `implementation-summary.md` Verification row `Direct bridge smoke`.]
- [x] Codex verification evidence covers both prompt-safe fail-open output and success-path brief injection. [Evidence: `implementation-summary.md` verification row `Codex hook + wrapper verification`; `.opencode/skill/system-spec-kit/mcp_server/tests/codex-user-prompt-submit-hook.vitest.ts`; `.opencode/skill/system-spec-kit/mcp_server/tests/codex-prompt-wrapper.vitest.ts`]
- [x] Direct handler/output smokes returned the new public fields and telemetry totals. [Evidence: `implementation-summary.md` Verification row `Direct handler smokes`.]
<!-- /ANCHOR:testing -->

## Security
<!-- ANCHOR:security -->

- [x] Durable telemetry is documented as prompt-safe and bounded. [Evidence: `implementation-summary.md` What Was Built bullet on prompt-safe telemetry plus the Key Decisions bullet on bounded JSONL sinks.]
- [x] Public outputs are documented to expose `workspaceRoot` and effective threshold state without prompt bodies. [Evidence: `implementation-summary.md` What Was Built bullet on explicit `workspaceRoot`; `implementation-summary.md` Verification row `Direct handler smokes`.]
<!-- /ANCHOR:security -->

## Documentation
<!-- ANCHOR:docs -->

- [x] Public README now documents `workspaceRoot`, `effectiveThresholds`, and `thresholdSemantics`. [Evidence: `implementation-summary.md` Files Changed row for `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/README.md`; `implementation-summary.md` Verification row `Cross-consistency grep`.]
- [x] Hook reference now documents the plugin-helper bridge path and the `0.8 / 0.35` OpenCode contract. [Evidence: `implementation-summary.md` Files Changed row for `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md`.]
<!-- /ANCHOR:docs -->

## File Organization
<!-- ANCHOR:file-org -->

- [x] Packet-local `applied/T-###.md` reports are absent in this checkout, so verification depends on `tasks.md`, `implementation-summary.md`, and this checklist instead of a per-task ledger. [Evidence: `resource-map.md` Specs entry for `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/014-skill-advisor-hook-improvements/applied/` marked `MISSING`.]
- [x] Packet implementation summary was written. [Evidence: `implementation-summary.md`]
- [x] Packet verification checklist was written. [Evidence: this file]
<!-- /ANCHOR:file-org -->

## Verification Summary
<!-- ANCHOR:summary -->

- [x] Packet closeout docs still map work across T-001 through T-015 via `tasks.md` plus the surviving implementation summary sections, but not via packet-local applied reports. [Evidence: `tasks.md`; `implementation-summary.md` What Was Built, Files Changed, and Verification sections; `resource-map.md` Specs entry for the missing `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/014-skill-advisor-hook-improvements/applied/`.]
- [x] The remaining validation failure is documented as packet-external and outside the allowed edit scope (`spec.md`, `plan.md`, `tasks.md`). [Evidence: `implementation-summary.md` Verification row `Full package build`.]
<!-- /ANCHOR:summary -->
