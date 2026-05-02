# Research Strategy

## Topic
UX Hooks Automation: assess need for refinement, upgrade, or bug fixes in implemented features

## Key Questions (remaining)
- [x] Q1: Are the UX hook modules (mutation-feedback.ts, response-hints.ts, memory-surface.ts) free of bugs, edge-case failures, or logic errors? **Answered**: 15 issues found (2 MODERATE, 7 LOW, 3 INFO, 1 KNOWN). No critical/blocking bugs; two MODERATE issues worth fixing (silently-ignored errors field, unsafe concepts cast).
- [x] Q2: Are the post-mutation hook integrations in save/update/delete/bulk-delete handlers robust? **Answered (GPT-5.4)**: 2 HIGH bugs found — (a) dedup/unchanged saves mutate DB despite suppressing hooks, (b) atomicSaveMemory diverges from normal save path on unchanged handling. 2 MEDIUM: hook errors silently swallowed; errors contract dead at handler boundary.
- [x] Q3: Is the context-server appendAutoSurfaceHints behavior correct and performant (NFR-P01: 250ms p95)? **Answered (Codex 5.3)**: Correctly placed before token-budget enforcement. autoSurfacedContext preserved. BUT latency risk unbounded — only pre-dispatch checked against 250ms, append/reparse has no p95 guard.
- [x] Q4: Is the checkpoint confirmName safety mechanism complete and resilient to bypass attempts? **Answered (Codex 5.3)**: Empty/null/case mismatch blocked. BUT whitespace-only names allowed. HIGH test contract gap — context-server.vitest doesn't test confirmName.
- [x] Q5: Are there refinement opportunities in the hooks architecture for the deferred follow-on work (structured response actions, success-hint composition)? **Answered (Iter 2)**: Barrel is clean. mutation-feedback.ts needs `actions` field + `errors` propagation for structured response actions. response-hints.ts already has the right extension point for success-hint composition via `composeSuccessHints`. No architectural overhaul needed.
- [x] Q6 (new): Does extractContextHint need per-element type validation for the concepts array? **Answered (Iter 2)**: Confirmed LOW -- unsafe `as string[]` cast without per-element check. Mitigated by Zod schema at MCP boundary. Trivial fix: `.filter(c => typeof c === 'string')`.
- [x] Q7 (new): Is the trigger_phrases column in the constitutional query intentionally selected for future use, or is it dead code? **Answered (Iter 2)**: Confirmed dead column selection. No downstream consumer reads `trigger_phrases` from constitutional memory results.
- [x] Q8 (new): Should the post-append hint latency be instrumented with a dedicated p95 guard (separate from pre-dispatch)? **Answered (Iter 2)**: No action needed. Post-append operations are CPU-bound (JSON parse + convergence loop), no I/O. Worst case <5ms. The 250ms guard on pre-dispatch is appropriate.
- [x] Q9 (new): Can the response object mutation risk in after-tool callbacks cause observable corruption? **Answered (Iter 3)**: THEORETICAL ONLY. The sole registered callback (extraction-adapter `handleAfterTool`) is read-only -- it serializes the result via `stringifyToolResult` and extracts session data but never mutates the result object. Microtask scheduling (`queueMicrotask`) ensures callbacks run AFTER the main pipeline's synchronous mutations complete. Downgraded from MEDIUM-3 to INFO. Defensive `Object.freeze` is a trivial P2 hardening.

## Answered Questions
- Q1 (iteration 1, Opus): 15 issues across 3 modules. Key: silently-ignored errors field (MODERATE), unsafe concepts cast (MODERATE).
- Q2 (iteration 1, GPT-5.4): 2 HIGH bugs in handler integration — dedup/unchanged save path inconsistency, atomicSave drift. 2 MEDIUM: swallowed errors, dead errors contract. **Iter 2 verification**: HIGH-1 CONFIRMED (applyPostInsertMetadata corrupts FSRS data for unchanged/duplicate saves). HIGH-2 PARTIALLY CONFIRMED (divergence is real but atomic path is actually better for unchanged -- real gap is missing applyPostInsertMetadata for ALL atomic save results).
- Q3 (iteration 1, Codex 5.3): appendAutoSurfaceHints correctly placed. Latency unbounded for post-append path. **Iter 2 follow-up**: Q8 answered -- no p95 guard needed for CPU-bound post-append.
- Q4 (iteration 1, Codex 5.3): confirmName mostly robust. Whitespace bypass, test contract gap.
- Q5 (iteration 2): Hooks architecture is extensible. mutation-feedback.ts needs `actions` + `errors` fields. response-hints.ts ready for success-hint composition. Barrel clean.
- Q6 (iteration 2): Confirmed LOW -- concepts cast without per-element validation. Mitigated by Zod.
- Q7 (iteration 2): Confirmed dead column selection in constitutional query. Harmless.
- Q8 (iteration 2): No dedicated p95 guard needed for post-append. CPU-bound ops <5ms.
- Q9 (iteration 3): THEORETICAL ONLY. Extraction-adapter callback is read-only; microtask scheduling is safe. Downgraded to INFO. Consolidated all findings into priority action plan (2 P0 bugs, 5 P1 refinements, 3 P2 upgrades, 7+ INFO).

## What Worked
- [Iter 1] Direct source reading of all 4 hook modules + shared types file. Cross-referencing MutationHookResult interface against its consumer revealed the silently-ignored errors field.
- [Iter 1] Systematic per-module audit with severity classification produced 15 actionable findings (Opus).
- [Iter 1] 3-agent wave (Opus + GPT-5.4 + Codex 5.3) covered Q1-Q4 in a single iteration, yielding 23 total findings.
- [Iter 1] GPT-5.4 deep handler trace discovered the highest-severity bugs (dedup path inconsistency, atomicSave drift) by following call chains through response-builder.ts and db-helpers.ts.
- [Iter 1] Codex 5.3 ran actual tests (344/344 pass) to confirm test coverage gaps are real.
- [Iter 2] Precise line-by-line call-chain tracing through memory-save.ts -> dedup.ts -> db-helpers.ts conclusively verified HIGH-1 (the guard `typeof result.id === 'number' && result.id > 0` is the root cause). Following the exact return values from dedup functions proved the ID is always a positive integer.
- [Iter 2] Comparing both save paths side-by-side (normal at line 977 vs atomic at line 1165) revealed the nuance: the atomic path is actually BETTER for unchanged saves because it lacks the applyPostInsertMetadata call.
- [Iter 2] Reading response-hints.ts convergence loop code answered Q8 definitively -- CPU-bound operations with a 5-iteration safety cap need no I/O-based p95 guard.
- [Iter 3] Direct reading of extraction-adapter.ts `handleAfterTool` resolved Q9 in ~3 tool calls. Confirming the callback uses `stringifyToolResult` (read-only serialization) and never writes to the result object was conclusive.
- [Iter 3] Consolidation of all 23+ findings into a single priority action plan with effort estimates provides clear actionable output for the spec folder.

## What Failed
- [Iter 1] N/A -- first iteration, all approaches were productive.
- [Iter 2] Q9 deferred due to tool budget -- would need context-server.ts callback registration code.

## Exhausted Approaches (do not retry)
[None yet]

## Next Focus
All 9 key questions answered. Research is substantially complete. Convergence expected -- next iteration would likely yield newInfoRatio < 0.10. Remaining marginal-value investigations:
- Verify no existing tests cover HIGH-1 dedup/unchanged path
- Check for open TODOs related to identified findings
- But these are diminishing returns and should trigger convergence detection.

## Known Context
- Spec status: "complete" (implemented 2026-03-13), all 31 tasks completed
- Known limitations: (1) Runtime stderr orphan-entry noise, (2) 1024 vs 768 embedding-dimension mismatch for memory indexing
- Deferred items: structured response actions, wider success-hint composition
- Key files: handlers/memory-save.ts, memory-crud-update.ts, memory-crud-delete.ts, memory-bulk-delete.ts, memory-crud-health.ts, checkpoints.ts; hooks/mutation-feedback.ts, response-hints.ts, memory-surface.ts, index.ts; context-server.ts; handlers/mutation-hooks.ts, memory-crud-types.ts
- 525 tests passing across 9 Vitest files; MCP SDK stdio smoke validated 28 tools
- Review scores: R1=90/100, R2=98/100 with two P1 findings fixed (Windows path regex, unsanitized repair.errors)
- 23 findings from iteration 1 wave (3 HIGH, 4 MEDIUM, 2 MODERATE, 7 LOW, 3 INFO, 1 KNOWN)

## Research Boundaries
- Max iterations: 10
- Convergence threshold: 0.05
- Progressive synthesis: true
- research/research.md ownership: workflow-owned canonical synthesis output
- Current segment: 1
- Started: 2026-03-19T07:10:00.000Z
