## Code Review Summary

**Files reviewed**: 10 targeted files in `scripts/` (`core/workflow.ts`, `memory/generate-context.ts`, `utils/input-normalizer.ts`, `core/frontmatter-editor.ts`, `extractors/collect-session-data.ts`, `extractors/conversation-extractor.ts`, `extractors/session-extractor.ts`, `loaders/data-loader.ts`, `core/file-writer.ts`, plus `mcp_server` validation references for pattern comparison)
**Overall assessment**: REQUEST_CHANGES
**Baseline used**: `sk-code--review`
**Overlay skill used**: `sk-code--opencode`

## Findings

### P1-001 [P1] SIGINT/SIGTERM can leave the workflow lock stale while still reporting success
- **File**: `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:140-148`
- **Evidence**: `installSignalHandlers()` calls `process.exit(0)` directly on both `SIGTERM` and `SIGINT`. The workflow lock is only released in `withWorkflowRunLock()`'s `finally` block in `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:246-305`. If the process is interrupted during a save, the process exits with a success status before the `finally` block can run, leaving `.workflow-lock` behind. Future saves then wait 30 seconds and fall back to running without the cross-process lock (`core/workflow.ts:252-275`).
- **User impact**: interrupted saves can be reported as successful even though the workflow was aborted, and subsequent runs can serialize poorly because the stale lock is never cleaned up.
- **Recommended fix**: replace direct `process.exit(0)` handlers with a cancellation path that lets `runWorkflow()` unwind and release the lock, and return a non-zero exit status for interrupted runs.

### P1-002 [P1] Structured JSON saves are marked complete even when the payload explicitly contains pending next steps
- **File**: `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:351-365`, `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:446-450`, `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:615-650`
- **Evidence**: `determineSessionStatus()` returns `COMPLETED` for any file-sourced payload that has `sessionSummary` plus either `keyDecisions` or `nextSteps`, before blocker/pending-work heuristics run. `estimateCompletionPercent()` separately returns `95` for any file-sourced payload with `sessionSummary`. I reproduced this from the package root with `npx tsx -e "const mod = require('./extractors/collect-session-data.ts'); ..."`, which printed `status=COMPLETED` and `percent=95` for a payload whose only forward-looking signal was `nextSteps: ['ship the fix']`.
- **User impact**: partially finished sessions render as complete, which weakens handoff quality and can hide that explicit follow-up work is still pending.
- **Recommended fix**: treat `nextSteps` as pending-work evidence, move the JSON-mode shortcut after blocker/pending-work evaluation, and add unit coverage for file-sourced payloads that include `nextSteps` and/or blockers.

### P1-003 [P1] Empty `--json` input is misclassified as an unexpected failure and leaks a stack trace
- **File**: `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:314-316`, `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:552-563`
- **Evidence**: `parseStructuredJson()` throws `"--json requires a non-empty JSON object"`, but the `isExpected` regex only matches `"required a non-empty JSON object"`. Because the string does not match, the primary CLI path prints `Unexpected Error:` plus the full stack. I reproduced this with `npx tsx memory/generate-context.ts --json '' '<spec-folder>'`, which emitted the stack trace instead of a clean validation error.
- **User impact**: common input mistakes leak internal stack traces and look like crashes instead of normal validation failures.
- **Recommended fix**: stop relying on regexes over free-form error text in `main()`; use typed error codes/classes (the `mcp_server` already does this with `ToolSchemaValidationError` in `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:522-577`). At minimum, fix the message mismatch immediately.

### P2-001 [P2] `preflight`/`postflight` are supported by normalization but still warned as unknown-and-ignored fields
- **File**: `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:726-733`, `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:749-772`, `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:787-792`
- **Evidence**: `normalizeInputData()` copies top-level `preflight` and `postflight` through on the slow path, but `KNOWN_RAW_INPUT_FIELDS` omits both keys, so `validateInputData()` warns that each field "will be ignored". I reproduced this with `npx tsx -e "const mod = require('./utils/input-normalizer.ts'); ..."`, which printed warnings for both fields even though the normalizer later preserves them.
- **Pattern consistency note**: this drifts from the `mcp_server` pattern, where accepted inputs are declared up front and validated through structured schema errors instead of warning that supported fields are ignored (`mcp_server/schemas/tool-input-schemas.ts:522-577`).
- **Recommended fix**: add `preflight` and `postflight` to the known-field set and validate their top-level object shape so diagnostics match actual runtime behavior.

## Next Steps

1. Fix the three P1 issues before release: signal/lock cleanup, structured-save completion heuristics, and the brittle `isExpected` error matching in `generate-context.ts`.
2. Clean up the `preflight`/`postflight` validator drift while touching input handling, since it directly affects operator trust in JSON-mode diagnostics.
