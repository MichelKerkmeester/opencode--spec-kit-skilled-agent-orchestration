## Iteration 07
### Focus
Concurrency verification debt: re-read Gate C verification claims and the current test suites to see whether the shipped evidence actually exercises the routed concurrent-save guarantees.

### Findings
- The full handler-level concurrent atomic-save test is explicitly skipped because the existing harness cannot model real file promotion and DB serialization for the contract being claimed. Evidence: `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:2728-2732`
- The active unit concurrency test only proves that `atomicIndexMemory()` serializes two writes when the dependency layer already provides `persistedContent`; it does not run the real routed canonical-merge preparation path that reads the target doc before locking. Evidence: `.opencode/skill/system-spec-kit/mcp_server/tests/atomic-index-memory.vitest.ts:225-296`
- Gate C still marks the concurrent-save acceptance scenario as complete, so the packet overstates verification relative to the actually executed test surface. Evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/003-continuity-refactor-gates/003-gate-c-writer-ready/spec.md:123-136`

### New Questions
- Can the skipped handler-level concurrency test be converted into a real integration test that exercises `buildCanonicalAtomicPreparedSave()` under contention?
- Should the Gate C packet downgrade the acceptance scenario until routed concurrent-save coverage exists?
- Are there other save-path guarantees currently proven only with dependency-injected unit tests rather than end-to-end fixtures?
- Would the routed stale-read issue from Iteration 05 have been caught immediately if this skipped test were active?

### Status
converging
