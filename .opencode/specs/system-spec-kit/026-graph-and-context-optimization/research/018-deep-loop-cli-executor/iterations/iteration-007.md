# Iteration 007

## Focus

Q6: AsyncLocalStorage caller-context propagation edge cases. Inspect whether the Phase 017/018 caller-context path survives common async boundaries such as `setTimeout`, `Promise.all`, and deferred event-loop handoffs, or whether there are still execution paths where `getCallerContext()` silently falls back to `null`.

## Actions Taken

1. Read the transport binding implementation in `mcp_server/lib/context/caller-context.ts` and the request wrapper in `mcp_server/context-server.ts` to confirm where `runWithCallerContext()` begins and ends.
2. Read the dedicated propagation suite in `mcp_server/tests/caller-context.vitest.ts` to verify which async boundaries are actually covered by shipped tests.
3. Read the live consumer in `mcp_server/handlers/session-resume.ts` plus the auth tests in `mcp_server/tests/session-resume-auth.vitest.ts` to determine whether current production use reads caller context only at handler entry or after deferred callbacks.
4. Searched the non-test runtime tree for `getCallerContext()` and related async callback primitives (`setImmediate`, `queueMicrotask`, `setTimeout`, watcher/event callbacks) to identify untested handoff shapes that could matter in future consumers.

## Findings

### P1. The currently shipped caller-context path survives the async boundaries it claims to support, and the only live consumer reads the context before any deferred handoff

Reproduction path:
- Read `mcp_server/lib/context/caller-context.ts`.
- Read `mcp_server/context-server.ts` around the `runWithCallerContext(callerContext, async () => dispatchTool(name, args))` dispatch wrap.
- Read `mcp_server/tests/caller-context.vitest.ts`.
- Read `mcp_server/handlers/session-resume.ts` around `const callerCtx = getCallerContext();`.

Evidence:
- `runWithCallerContext()` is a thin `AsyncLocalStorage.run(ctx, fn)` wrapper, so the request-scoped store begins exactly around MCP tool dispatch and encloses the whole awaited handler execution.
- The shipped tests explicitly prove propagation across `await`, into `setTimeout` callbacks, and across concurrent `Promise.all` runs without cross-run leakage.
- Repo-wide non-test usage shows `getCallerContext()` is currently consumed only by `handleSessionResume()`, and that read happens immediately at handler entry, not inside a later timer, watcher, or event-emitter callback.

Impact:
- For the current production path, there is no checked-in evidence that `setTimeout` or `Promise.all` causes the Phase 017/018 caller-context path to collapse to `null`.
- The practical risk for Phase 019 is therefore lower than the prompt hypothesis suggests for today's consumer set.

Risk-ranked remediation candidates:
- P1: carry forward the conclusion that the present session-resume binding path is stable across the tested async boundaries.
- P2: keep future consumers on the same pattern: read or assert caller context at the handler boundary before introducing deferred callback shapes.

### P1. The hardening gap is no longer the tested async boundaries; it is the untested detached-callback surface

Reproduction path:
- Read `mcp_server/tests/caller-context.vitest.ts`.
- Search the runtime for `setImmediate`, `queueMicrotask`, watcher callbacks, and `getCallerContext()`.

Evidence:
- The propagation suite covers `await`, `setTimeout`, nested runs, and `Promise.all`, but it does not exercise `setImmediate`, `queueMicrotask`, event-emitter callbacks, file-watcher callbacks, or a callback captured inside the run and invoked later from a different async resource.
- `context-server.ts` itself contains deferred callback surfaces such as `queueMicrotask`, `setImmediate`, debounce timers, and watcher `.on(...)` handlers, proving those callback shapes exist in the runtime even though they do not currently call `getCallerContext()`.
- Because the only consumer today is immediate-entry `session_resume`, the missing coverage is latent rather than a confirmed bug.

Impact:
- Q6 is only partially answered: common boundaries named in the prompt are covered for the current design, but "all async handoffs" is still too broad a claim.
- Phase 019 should frame the remaining risk as a future-consumer contract gap, not as a demonstrated regression in the existing session-resume path.

Risk-ranked remediation candidates:
- P1: add one focused test each for `setImmediate`, `queueMicrotask`, and "captured callback invoked after the enclosing run returns" so the contract is explicit.
- P2: document that detached event-emitter or watcher callbacks must not assume caller context unless they are created and consumed wholly inside the request-scoped run.

### P2. `getCallerContext()` still permits silent `null` fallback, so a missing binding degrades to permissive behavior unless callers opt into `requireCallerContext()`

Reproduction path:
- Read `mcp_server/lib/context/caller-context.ts`.
- Read `mcp_server/handlers/session-resume.ts`.
- Read `mcp_server/tests/session-resume-auth.vitest.ts`.

Evidence:
- `getCallerContext()` returns `storage.getStore() ?? null` and does not log or throw on missing context.
- `handleSessionResume()` uses `getCallerContext()` rather than `requireCallerContext()`, then enforces mismatch rejection only when both `args.sessionId` and `callerCtx?.sessionId` are non-null.
- The shipped auth tests intentionally treat `callerContext.sessionId === null` as an allowed path, which is necessary for stdio's vacuous transport session but also means an accidentally unbound caller context would look similar at runtime.

Impact:
- The remaining failure mode is less "AsyncLocalStorage loses context across `setTimeout`/`Promise.all`" and more "missing binding is observationally close to intentional null-session transports."
- That makes diagnostics weaker for future consumers: a lost context can silently degrade into the same branch used for benign stdio/null-session cases.

Risk-ranked remediation candidates:
- P1: add optional diagnostic telemetry or a debug-only assertion when `getCallerContext()` returns `null` inside handlers that expect transport binding.
- P2: preserve `getCallerContext()` for stdio-tolerant paths, but prefer `requireCallerContext()` or an explicit helper for handlers where null should never occur post-dispatch.

## Questions Answered

- Q6. Does AsyncLocalStorage caller-context propagation survive across all async boundaries (`setTimeout`, `Promise.all`, event loop migrations`)?
  Partially answered: the checked-in implementation and tests support `await`, `setTimeout`, nested runs, and concurrent `Promise.all` without cross-run leakage, and the only live consumer reads context immediately at handler entry. There is no checked-in evidence of a current bug on those common boundaries. The unanswered portion is the detached-callback surface (`setImmediate`, `queueMicrotask`, event emitters, watcher callbacks, or callbacks invoked after the enclosing run has returned`), which is not covered by tests and would matter mainly for future consumers.

## Questions Remaining

- Does Node's AsyncLocalStorage behavior remain stable for the untested detached-callback shapes this runtime already uses (`setImmediate`, `queueMicrotask`, watcher callbacks) when those callbacks actually read caller context?
- Should Phase 019 tighten the consumer contract so handlers that rely on transport identity call `requireCallerContext()` instead of tolerating a silent `null` store?
- Is there a safe way to distinguish intentional stdio/null-session transport cases from accidental missing-binding regressions in telemetry?

## Next Focus

Q7: Copilot autonomous-execution hardening preconditions. Inspect what observability or recovery assumptions still differ between Copilot and the other CLI executors after Cluster E, and whether any remaining gaps would block reliable unattended execution in Phase 019.
