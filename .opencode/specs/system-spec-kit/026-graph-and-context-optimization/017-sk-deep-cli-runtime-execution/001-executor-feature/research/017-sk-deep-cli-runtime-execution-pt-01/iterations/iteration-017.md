# Iteration 017

## Focus

Q6: inspect whether AsyncLocalStorage caller-context propagation survives common async boundaries such as `setTimeout`, `Promise.all`, and deferred event-loop handoffs, or whether some Phase 017/018 paths still silently drop `getCallerContext()`.

## Actions Taken

1. Read the caller-context implementation in [caller-context.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/caller-context.ts:1) to confirm the exact contract: a thin `AsyncLocalStorage<MCPCallerContext>` wrapper with `runWithCallerContext()`, `getCallerContext()`, and `requireCallerContext()`.
2. Read the transport dispatch boundary in [context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1009) plus the `afterToolCallbacks` scheduling point in [context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:396) to see which work executes inside the ALS scope and which work is scheduled after the wrapper returns.
3. Read the only live consumer in [session-resume.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:450) and verified that `getCallerContext()` is read once at handler entry, before the rest of the resume pipeline fans out.
4. Read the checked-in tests in [caller-context.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/caller-context.vitest.ts:1) and [session-resume-auth.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-resume-auth.vitest.ts:1), then ran `npx vitest run tests/caller-context.vitest.ts tests/session-resume-auth.vitest.ts` inside `.opencode/skill/system-spec-kit/mcp_server` to confirm the shipped coverage still passes.
5. Ran a local Node probe against [caller-context.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/caller-context.ts:1) that exercised `queueMicrotask`, `setImmediate`, `setTimeout`, `node:timers/promises.setTimeout`, and mixed `Promise.all` branches under one `runWithCallerContext()` call to verify whether the current runtime keeps the store alive across those handoffs.

## Findings

### P1. I found no current Phase 017/018 path where `getCallerContext()` silently drops across the investigated async boundaries

Reproduction path:
- Read [context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1009).
- Read [session-resume.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:450).
- Read [caller-context.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/caller-context.vitest.ts:66).
- Run `npx vitest run tests/caller-context.vitest.ts tests/session-resume-auth.vitest.ts` in `.opencode/skill/system-spec-kit/mcp_server`.

Evidence:
- The transport layer wraps `dispatchTool(name, args)` inside `await runWithCallerContext(callerContext, async () => dispatchTool(name, args))`, so the entire tool invocation executes inside one ALS scope.
- The only live runtime consumer of `getCallerContext()` in the MCP server tree is `handleSessionResume()`, which snapshots `const callerCtx = getCallerContext();` at handler entry and then uses the captured value for the rest of the auth and resume flow. That means later async fan-out inside `session_resume` does not repeatedly depend on ALS lookup.
- Checked-in tests already prove propagation across `await` boundaries, `setTimeout(...)`, and concurrent `Promise.all([...runWithCallerContext(...)])` runs without cross-leakage.
- The targeted vitest run passed: `2` files, `20` tests, `0` failures.
- The live runtime probe returned `"probe-session"` for `queueMicrotask`, `setImmediate`, `setTimeout`, `node:timers/promises.setTimeout`, and all three mixed `Promise.all` branches, then returned `null` outside the wrapper, which matches the intended scope semantics.

Impact:
- Q6 is answered for the currently shipped Phase 017/018 auth path: the repo evidence supports that caller context survives the named async boundaries well enough for the current `session_resume` binding check.
- There is no checked-in evidence of a present silent-drop bug on this surface.

Risk-ranked remediation candidates:
- P1: no immediate code change required for the current shipped `session_resume` auth boundary.
- P2: keep the current minimal surface area by avoiding new late-stage `getCallerContext()` reads inside deeper helper stacks unless they also gain explicit regression coverage.

### P2. The remaining risk is coverage drift, not a reproduced bug: the repo does not assert every deferred handoff that future consumers might rely on

Reproduction path:
- Read [caller-context.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/caller-context.vitest.ts:1).
- Read [context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:396).
- Read [response-builder.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:404).

Evidence:
- The checked-in caller-context suite covers `await`, `setTimeout`, nested runs, failure cleanup, and concurrent runs, but it does not contain an explicit regression test for `setImmediate`, `queueMicrotask`, or `node:timers/promises`.
- `runAfterToolCallbacks(...)` is invoked after the `runWithCallerContext(...)` dispatch wrapper returns, and it schedules work with `queueMicrotask(...)`. Today that callback path does not call `getCallerContext()`, so nothing breaks. But if a future callback starts reading transport context there, it will be outside the current wrapper boundary and outside the current test contract.
- `response-builder.ts` schedules async embedding retry work with `setImmediate(...)` while still inside handler execution. The runtime probe suggests ALS would survive if this path ever needed caller context, but the repo does not currently encode that as a regression test.

Impact:
- The present design is safe mainly because the consumer surface is tiny: one synchronous read at the top of `session_resume`.
- The brittle part is future expansion. The next regression is more likely to come from adding a second consumer in a deferred callback than from ALS failing under the already-probed primitives.

Risk-ranked remediation candidates:
- P2: add one focused regression test that covers `setImmediate`, `queueMicrotask`, and `node:timers/promises.setTimeout` in [caller-context.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/caller-context.vitest.ts:1) so the runtime probe becomes checked-in evidence.
- P2: document at the caller-context boundary that any post-dispatch callback path needing caller identity must either capture it eagerly or schedule its work from inside `runWithCallerContext(...)`, not after the wrapper returns.

## Questions Answered

- Q6: yes. For the currently shipped Phase 017/018 surface, AsyncLocalStorage caller-context propagation survives the investigated async boundaries, and I did not find a current path that silently drops `getCallerContext()`.
- The strongest reason this stays safe is architectural: only `session_resume` consumes caller context, and it snapshots it immediately at handler entry.

## Questions Remaining

- Should Phase 019 promote the runtime-only `setImmediate` and `queueMicrotask` probe into checked-in regression tests so this evidence stops depending on ad hoc verification?
- Is any future Phase 019/020 work planning to read caller context from `afterToolCallbacks` or other post-dispatch callbacks, where the current wrapper boundary would no longer protect it automatically?
- Do Copilot-specific autonomous paths in Q7 introduce any new deferred callback consumers that would widen the current one-handler caller-context surface?

## Next Focus

Q7: inspect the remaining Copilot-specific observability and autonomous-execution hardening gaps after Cluster E, especially whether any executor-specific callback or recovery path widens the current transport-context surface without comparable tests.
