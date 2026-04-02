# Iteration 004 — Maintainability

**Dimension:** D4 Maintainability
**Status:** complete
**Agent:** Codex CLI GPT-5.4 (high reasoning)

## Findings

### P1-M01: SessionStart behavior duplicated across Claude and Gemini with drift

**Severity:** P1
**Source:** `hooks/claude/session-prime.ts:45`; `hooks/gemini/session-prime.ts:41`
**Evidence:** Both files reimplement `handleCompact`, `handleStartup`, `handleResume`, `handleClear`, and the same `switch (source)` dispatch, but the bodies are no longer aligned. Claude sanitizes and wraps recovered payloads (`sanitizeRecoveredPayload`, `wrapRecoveredCompactPayload`) and applies `calculatePressureAdjustedBudget(...)`, while Gemini injects raw `payload` and truncates against a fixed `budget`.
**Impact:** Every startup-behavior change has to be hand-copied into two near-identical handlers. A third runtime will almost certainly fork again instead of extending one shared flow.
**Fix:** Move source-to-sections logic into a shared runtime-agnostic module returning `OutputSection[]` plus budget metadata; keep only transport-specific output code per runtime.

### P1-M02: Shared startup brief coupled to Claude-specific state naming

**Severity:** P1
**Source:** `lib/code-graph/startup-brief.ts:8`
**Evidence:** The supposedly shared builder imports `loadMostRecentState` from `../../hooks/claude/hook-state.js`, while tests lock state shape to Claude terminology (`speckit-claude-hooks`, `claudeSessionId`) at `tests/hook-state.vitest.ts:49` and `:94`.
**Impact:** Adding another hook runtime requires routing through Claude-named modules, obscuring ownership and making extension harder.
**Fix:** Extract hook state into a runtime-neutral shared module; leave Claude/Gemini adapters to map runtime-specific identifiers at the edge.

### P2-M03: Dynamic imports add unnecessary optional-dependency complexity

**Severity:** P2
**Source:** `hooks/claude/session-prime.ts:26`; `hooks/gemini/session-prime.ts:32`
**Evidence:** Both handlers do `await import('../../lib/code-graph/startup-brief.js')` behind swallowed `catch {}` blocks. But `startup-brief.ts` already handles graph failures internally and returns `graphState: 'missing'`.
**Impact:** Dependency flow is harder to follow; fallback behavior is split between modules.
**Fix:** Prefer static imports for `buildStartupBrief`; centralize optional loading if still required for packaging.

### P2-M04: StartupBriefResult contract declared three times

**Severity:** P2
**Source:** `lib/code-graph/startup-brief.ts:17`; `hooks/claude/session-prime.ts:19`; `hooks/gemini/session-prime.ts:25`
**Evidence:** `startup-brief.ts` exports `StartupBriefResult`, but both hook handlers redefine the same shape locally as `type StartupBrief = { graphOutline: ... graphState: ... }`.
**Impact:** Contract changes require updating three places, increasing drift risk.
**Fix:** Import `type StartupBriefResult` from `startup-brief.ts` into both handlers.

## Summary
**P0=0 P1=2 P2=2**

## Claim Adjudication

### P1-M01
- **Claim:** Handler duplication has already drifted
- **Evidence Refs:** session-prime.ts:45 (Claude), session-prime.ts:41 (Gemini)
- **Counterevidence Sought:** Are the differences intentional per-runtime adaptations? Claude has pressure-adjusted budgets which Gemini may not need.
- **Alternative Explanation:** Gemini is newer and intentionally simpler. Divergence may be by design.
- **Final Severity:** P1 — the core dispatch logic is identical and drift is accidental, even if some specialization is intentional
- **Confidence:** 0.75
- **Downgrade Trigger:** If design doc explicitly states runtimes should diverge independently

### P1-M02
- **Claim:** Shared builder coupled to Claude-specific paths
- **Evidence Refs:** startup-brief.ts:8 (import path), hook-state.vitest.ts:49,94 (Claude naming)
- **Counterevidence Sought:** Is hook-state.ts actually shared infrastructure that just lives under claude/?
- **Alternative Explanation:** Claude was first runtime, so shared code naturally lives there.
- **Final Severity:** P1 — coupling is real regardless of historical reason
- **Confidence:** 0.80
- **Downgrade Trigger:** If hook-state.ts is explicitly documented as shared infrastructure
