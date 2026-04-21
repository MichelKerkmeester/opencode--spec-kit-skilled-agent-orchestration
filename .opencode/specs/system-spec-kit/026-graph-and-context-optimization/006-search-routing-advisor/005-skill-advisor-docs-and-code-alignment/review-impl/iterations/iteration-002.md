# Iteration 002 - Security

## Prior State Read

Read `deep-review-impl-state.jsonl`, `deep-review-impl-findings-registry.json`, and `iteration-001.md`. Active findings entering this pass: P1=2, P0=0.

## Verification

- Re-ran scoped vitest: 19 files, 155 tests passed.
- Re-checked git history for scoped files; no commits after `9810ad65d5` appeared in the reviewed file set.
- Used `rg` to trace `createCodexWrappedPrompt`, `promptWrapper`, `wrappedPrompt`, `serializeAdvisorHookDiagnosticRecord`, and diagnostic `skillLabel` use.

## Findings

### P1-SEC-001 - Codex fallback wraps advisor text inside an HTML comment without escaping comment terminators

Evidence:

- `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/prompt-wrapper.ts:104` constructs the wrapped prompt as `<!-- advisor brief: ${brief} -->\n${prompt}`.
- `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/prompt-wrapper.ts:178` to `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/prompt-wrapper.ts:180` returns that wrapper directly to the runtime.
- `.opencode/skill/system-spec-kit/mcp_server/tests/codex-prompt-wrapper.vitest.ts:97` to `.opencode/skill/system-spec-kit/mcp_server/tests/codex-prompt-wrapper.vitest.ts:99` lock in the raw HTML-comment format, but no test covers a brief containing `-->`.

Expected: text inserted into an HTML comment prompt boundary should either reject or escape `--` / `-->`, or use a delimiter format that cannot be closed by advisor content.

Actual: the wrapper interpolates `brief` directly. If a future renderer, dependency injection path, or repository-authored label produces `-->`, the advisor block can terminate early and expose remaining advisor text as ordinary prompt content.

Severity: P1 security. This is a prompt-boundary injection risk in the Codex fallback path.

### P2-SEC-002 - Hook diagnostics accept unsanitized skill labels into stderr JSONL

Evidence:

- `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/user-prompt-submit.ts:126` to `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/user-prompt-submit.ts:131` select `sharedPayload.metadata.skillLabel` or `result.recommendations[0]?.skill` without local sanitization.
- `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/user-prompt-submit.ts:203` to `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/user-prompt-submit.ts:211` emit that label into diagnostics.
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/metrics.ts:227` copies `input.skillLabel` into the diagnostic record when truthy.
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/metrics.ts:249` validates only that `skillLabel` is a string.

Expected: diagnostic skill labels should use the same single-line, instruction-shaped-label rejection used at model-visible boundaries, or should be omitted when not already validated.

Actual: JSONL serialization keeps the record structurally valid, but an instruction-shaped or control-bearing label can still be written to stderr diagnostics. Existing tests check forbidden field names, not label sanitization.

Severity: P2 security. The blast radius is diagnostic output rather than model-visible prompt injection, but it weakens the stated prompt/privacy boundary.

## Ruled Out

- `shared-payload.ts` rejects `user-prompt` source refs and `sha256:` prompt fingerprints in source refs; no spec-doc-only privacy finding was counted.
- `subprocess.ts` sends the prompt over stdin, not argv, so shell argument leakage was not found in this pass.

## Churn

Net-new findings this iteration: P1=1, P2=1. Severity-weighted new-findings ratio: 0.60.
