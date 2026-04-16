# Iteration 26 - security - commands

## Dispatcher
- iteration: 26 of 50
- dispatcher: cli-copilot gpt-5.4 high (code review v1)
- timestamp: 2026-04-16T06:10:47Z

## Files Reviewed
- `.opencode/command/spec_kit/assets/spec_kit_resume_auto.yaml`
- `.opencode/command/spec_kit/assets/spec_kit_resume_confirm.yaml`
- `.opencode/command/spec_kit/resume.md`
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-list.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-list-edge.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts`
- `.opencode/skill/system-spec-kit/scripts/tests/test-phase-command-workflows.js`

## Findings - New
### P0 Findings
- None.

### P1 Findings
#### P1-026-01 [P1] `/spec_kit:resume` session detection can disclose cross-scope memory metadata before a folder is resolved
- File: `.opencode/command/spec_kit/assets/spec_kit_resume_auto.yaml:50-55` (`session_detection.tier_details`), `.opencode/command/spec_kit/assets/spec_kit_resume_confirm.yaml:50-55` (`session_detection.tier_details`), `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-list.ts:113-155` (`handleMemoryList`)
- Evidence: both resume workflows use `memory_list({ limit: 3, sortBy: 'updated_at' })` and then `memory_match_triggers({ prompt: 'resume work session context' })` before a `spec_folder` is known. `memory_list` has no `tenantId` / `userId` / `agentId` inputs in either its schema or arg type (`tool-schemas.ts:222-225`, `memory-crud-types.ts:32-39`), and its SQL only filters on `parent_id` and optional `spec_folder`, then returns `spec_folder`, `title`, and `file_path` for recent memories (`memory-crud-list.ts:113-155`). `memory_match_triggers` does support governed filtering, but only when the caller supplies scope fields (`memory-triggers.ts:111-115,290-325`); the resume YAMLs do not pass them. In any shared/governed memory index, auto-detecting a session can therefore surface another tenant/user/agent's packet metadata before the operator has chosen a folder.
- Recommendation: replace the `memory_list` fallback with a scope-aware discovery path, and thread tenant/user/agent scope through the trigger fallback before any pre-selection memory lookup runs.

```json
{
  "claim": "The resume command's pre-folder session-detection fallbacks bypass governed scope isolation and can reveal other users' spec-folder metadata in shared deployments.",
  "evidenceRefs": [
    ".opencode/command/spec_kit/assets/spec_kit_resume_auto.yaml:50-55",
    ".opencode/command/spec_kit/assets/spec_kit_resume_confirm.yaml:50-55",
    ".opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:222-225",
    ".opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:32-39",
    ".opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-list.ts:113-155",
    ".opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:111-115",
    ".opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:290-325"
  ],
  "counterevidenceSought": "Checked whether resume.md, tool schemas, or the MCP handlers auto-inject tenant/user/agent scope for these calls; none of the direct memory_list path does, and trigger filtering is conditional on caller-supplied scope.",
  "alternativeExplanation": "Single-tenant local installs will not notice this because all memories belong to the same trust boundary.",
  "finalSeverity": "P1",
  "confidence": 0.96,
  "downgradeTrigger": "Downgrade if the host runtime wraps every memory_list and memory_match_triggers invocation with mandatory server-side tenant/user/agent scoping outside this repository."
}
```

### P2 Findings
- `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-list-edge.vitest.ts:33-125` only exercises sort/limit/offset/specFolder behavior, while `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts:282-328` explicitly covers governed scope filtering. There is no comparable regression test for the `memory_list` leg used by `/spec_kit:resume`, so the leak above is currently invisible to the automated test suite.
- `.opencode/skill/system-spec-kit/scripts/tests/test-phase-command-workflows.js:95-122` validates that the resume YAMLs exist and mention phase-folder behavior, but it does not assert any security contract around scoped memory discovery. That keeps command-workflow smoke tests green even if the resume assets keep calling unsafe pre-folder discovery tools.

## Traceability Checks
- `resume.md:11-16,247-252` still dispatches exclusively to the two live resume YAML assets, and those YAMLs implement the documented recovery ladder of `handover.md -> _memory.continuity -> supporting spec docs` before MCP enrichment (`spec_kit_resume_auto.yaml:69-97`, `spec_kit_resume_confirm.yaml:69-102`). That part of the implementation matches the live command contract.
- The suggested `spec_kit_start_*` assets are not present in the current command tree, so this iteration reviewed the active resume surface only.

## Confirmed-Clean Surfaces
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:883-925` — `executeResumeStrategy()` stays packet-local once `specFolder` is known; it resolves canonical docs directly and does not fan out into broad memory discovery.
- `.opencode/command/spec_kit/resume.md:11-16,247-252` — the live entrypoint only loads `spec_kit_resume_auto.yaml` or `spec_kit_resume_confirm.yaml`; no active runtime reference back to deleted `start` assets was found here.

## Next Focus
- Inspect the pre-folder phases of `/spec_kit:plan --intake-only` and `/spec_kit:complete` for the same pattern: unscoped memory discovery or mutation-capable fallback tools before the target packet is established.
