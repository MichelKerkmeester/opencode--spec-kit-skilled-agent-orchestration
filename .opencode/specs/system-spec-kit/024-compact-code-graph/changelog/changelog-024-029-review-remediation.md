---
title: "Changelog: Review Remediation [024/029]"
description: "Chronological changelog for the Packet 024 review-remediation phase."
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

## 2026-04-03

### Added
- Real `nextActions` output in `session_bootstrap`, so the recovery handler now matches the public contract already described in the runtime docs and tool schema.
- Formal `outputSchema` on the `session_bootstrap` tool definition documenting the full response shape (`resume`, `health`, `structuralContext`, `hints`, `nextActions`), plus the optional `outputSchema` field on `ToolDefinition`.
- A focused Claude stop-hook regression test covering ambiguous transcript detection, preserved active spec-folder state, safe fallback behavior when transcript evidence is not authoritative, and retargeting when the user switches to a new unambiguous packet.
- Explicit Structural Context guidance in the Claude and Codex `context-prime` agent definitions to keep non-OpenCode runtime guidance aligned with the shipped bootstrap contract.

### Changed
- Gemini compact recovery now wraps recovered context with the shared provenance fence instead of injecting plain recovered text.
- The shared structural bootstrap builder now enforces the documented 500-token ceiling instead of treating that limit as advisory.
- Claude stop-hook autosave now retargets to a new unambiguous packet when the transcript tail shows the session has moved, instead of keeping a stale autosave destination.
- Phase 021 and root Packet 024 docs were truth-synced to the bootstrap-first public recovery flow, current shipped evidence, and the completed Phase 029 closeout.
- The Packet 024 phase map now includes `029-review-remediation`, and the `028-startup-highlights-remediation` packet now links forward to this successor phase.
- Checklist evidence for CHK-010 now references the formal output schema instead of only the handler behavior; CHK-012 evidence now describes the actual presence-based validation mechanism (`state.lastSpecFolder` + `state.sessionSummary`).

### Removed
- The ignored stray `030-opencode-plugin/` folder that strict spec validation was misclassifying as a real phase folder.

### Files Changed

| File | What changed |
|------|--------------|
| `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts` | Added real `nextActions` generation to the bootstrap response. |
| `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts` | Added optional `outputSchema` field to `ToolDefinition` interface; added formal output schema to `session_bootstrap` documenting `resume`, `health`, `structuralContext`, `hints`, and `nextActions`. |
| `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts` | Wrapped compact recovery output with the shared provenance fence. |
| `.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts` | Enforced the documented structural bootstrap token ceiling. |
| `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts` | Hardened autosave packet selection so ambiguous transcript-only matches are not treated as authoritative and new unambiguous packet switches retarget autosave correctly. |
| `.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts` | Updated bootstrap coverage for the new `nextActions` contract. |
| `.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts` | Added coverage for the structural contract token-budget ceiling. |
| `.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-stop.vitest.ts` | Added focused regression tests for stop-hook spec-folder detection behavior. |
| `.claude/agents/context-prime.md` | Added explicit Structural Context guidance. |
| `.codex/agents/context-prime.md` | Added explicit Structural Context guidance. |
| `.codex/agents/context-prime.toml` | Added Structural Context output guidance to the Codex TOML agent definition. |
| `.opencode/specs/system-spec-kit/024-compact-code-graph/021-cross-runtime-instruction-parity/spec.md` | Truth-synced the public recovery contract to the bootstrap-first flow. |
| `.opencode/specs/system-spec-kit/024-compact-code-graph/021-cross-runtime-instruction-parity/implementation-summary.md` | Updated the implementation summary to match the current recovery contract. |
| `.opencode/specs/system-spec-kit/024-compact-code-graph/028-startup-highlights-remediation/spec.md` | Linked Phase 028 forward to Phase 029 as its successor. |
| `.opencode/specs/system-spec-kit/024-compact-code-graph/spec.md` | Added Phase 029 to the parent phase map and handoff chain. |
| `.opencode/specs/system-spec-kit/024-compact-code-graph/implementation-summary.md` | Refreshed root packet evidence so Phase 015 and 016 status matches shipped reality. |
| `.opencode/specs/system-spec-kit/024-compact-code-graph/029-review-remediation/spec.md` | Marked the remediation packet complete with resolved decisions. |
| `.opencode/specs/system-spec-kit/024-compact-code-graph/029-review-remediation/plan.md` | Closed the implementation plan and definition-of-done items. |
| `.opencode/specs/system-spec-kit/024-compact-code-graph/029-review-remediation/tasks.md` | Marked remediation tasks complete. |
| `.opencode/specs/system-spec-kit/024-compact-code-graph/029-review-remediation/checklist.md` | Tightened CHK-010 and CHK-012 evidence to match actual implementation mechanisms. |
| `.opencode/specs/system-spec-kit/024-compact-code-graph/029-review-remediation/implementation-summary.md` | Recorded delivered work, decisions, and verification results for the phase. |

### Verification
- `TMPDIR=/Users/michelkerkmeester/.tmp/vitest-tmp npx vitest run tests/session-bootstrap.vitest.ts tests/structural-contract.vitest.ts tests/hook-session-start.vitest.ts tests/hook-session-stop.vitest.ts` passed with 4 files and 20 tests.
- `npm run typecheck` passed for `.opencode/skill/system-spec-kit/mcp_server`.
- `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/024-compact-code-graph/029-review-remediation --strict` passed.
- `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/024-compact-code-graph --strict --no-recursive` passed after the phase-link cleanup.
