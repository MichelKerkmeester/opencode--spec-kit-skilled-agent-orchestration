# Iteration 19: Q7 tighter pass on cli-copilot executor attribution and recovery persistence

## Focus
Inspect the actual non-native executor audit code and reducer paths to verify whether `cli-copilot` executor attribution and recovery metadata survive failure, stuck-recovery, and partial-write cases in code rather than in documentation alone.

## Actions Taken
1. Read `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts` to confirm which `cli-copilot` fields can exist at runtime.
2. Read `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/executor-audit.ts` and `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts` to compare the documented audit promise against the enforced post-dispatch contract.
3. Read `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs` to see which recovery fields survive into reducer-owned registry and dashboard outputs.
4. Checked the active packet tail in `deep-research-state.jsonl` to align this iteration with the prior Q7 tightening work.

## Findings
- P1. Non-native executor attribution is still not a required persistence invariant. `appendExecutorAuditToLastRecord()` can add `executor: {kind, model, reasoningEffort, serviceTier}`, but `validateIterationOutputs()` only checks the caller-supplied required fields and never requires `executor`, so a Copilot iteration can pass post-dispatch validation without any executor audit block at all. Evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/executor-audit.ts:26-54`; `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts:5-10`; `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts:38-75`.
- P1. Partial-write or malformed-tail cases do not have an attribution-safe fallback. The audit helper rewrites only the last non-empty JSONL line and throws if that line is missing or malformed, so a truncated final record loses executor attribution instead of being preserved through a sidecar event or alternative write path. Evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/executor-audit.ts:31-53`.
- P2. Recovery metadata survives only through explicit event records, not through executor audit. The reducer rebuilds blocked-stop history from `type:"event"` / `event:"blocked_stop"` lines and rewrites dashboard recovery guidance from `recoveryStrategy`, while executor metadata is never read back into the registry or dashboard. That means stuck-recovery guidance can survive even when executor provenance does not. Evidence: `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:541-588`; `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:785-807`.
- P2. Copilot remains a thin audit surface even on success. The executor schema allows `cli-copilot` to carry only `model` and `timeoutSeconds`; unsupported fields are rejected, and the audit record builder fills `reasoningEffort` / `serviceTier` from nullable config values. In practice Copilot attribution can only reliably distinguish kind plus model, not richer execution policy. Evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts:19-36`; `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts:73-130`; `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/executor-audit.ts:7-13`.

## Questions Answered
- Q7 tightened: the codebase has a post-hoc executor audit helper, but Copilot autonomous-execution observability still depends on optional last-line mutation rather than a required iteration-record contract.
- Q7 tightened: blocked-stop recovery hints survive reducer passes, but they are executor-agnostic; recovery can remain explainable without proving which executor produced the originating iteration record.

## Questions Remaining
- Where is `appendExecutorAuditToLastRecord()` invoked in the production dispatch path for `cli-copilot`, and does that call happen before or after post-dispatch validation and exception handling?
- Do stuck-recovery and dispatch-failure paths append any executor-tagged event when the iteration line is absent or malformed, or do they only preserve generic blocked-stop recovery hints?
- Should Phase 019 promote `executor.kind` to a required field for non-native iteration records instead of treating audit as best-effort decoration?

## Next Focus
Inspect the production deep-loop dispatcher or wave executor call site that runs non-native CLIs, confirm the exact ordering of iteration append, validation, audit merge, and reducer sync, and check whether failure handlers persist executor attribution when no clean iteration line exists.
