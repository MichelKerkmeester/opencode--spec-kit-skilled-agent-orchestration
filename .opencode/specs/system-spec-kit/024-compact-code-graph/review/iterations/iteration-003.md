# Iteration 003 - Traceability

## Scope

- Dimension: `traceability`
- Reviewed surfaces:
  - `.opencode/specs/system-spec-kit/024-compact-code-graph/checklist.md`
  - `.opencode/skill/system-spec-kit/mcp_server/README.md`
  - `.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/18-session-resume-tool.md`
  - `.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/263-session-resume.md`
  - `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts`

## Findings

### P0

- None.

### P1

- None.

### P2

- P2-003: Public traceability surfaces for `session_resume` still describe the pre-ladder implementation. The feature catalog says the handler performs a `memory_context(mode=resume, profile=resume)` sub-call [SOURCE: .opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/18-session-resume-tool.md:14], and the manual playbook repeats that same validation target while also expecting `codeGraph.status in [ok, empty, error]` [SOURCE: .opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/263-session-resume.md:17] [SOURCE: .opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/263-session-resume.md:25]. The live handler now uses `buildResumeLadder()` for packet recovery and returns freshness states `fresh|stale|empty|error` [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:34] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:423] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:443]. That leaves operator docs and test prompts misaligned with the shipped recovery surface.
- P2-004: The root checklist still signs off most runtime and remediation claims with circular evidence pointers like "verified in implementation-summary.md" instead of direct code/test/command references [SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/checklist.md:74] [SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/checklist.md:87] [SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/checklist.md:125]. That weakens replayability for a deep review because the checklist often points back to a narrative summary rather than to the handler, test, or verification artifact that actually proves the box.

## Notes

- The package README is aligned with current recovery reality: it documents `session_bootstrap` as the canonical first-call surface and points operator-facing packet recovery back through `handover.md -> _memory.continuity -> packet docs` [SOURCE: .opencode/skill/system-spec-kit/mcp_server/README.md:587].
- Traceability drift is concentrated in packet-local verification artifacts and the feature/playbook mirrors, not in the current README/tool-reference wording.
