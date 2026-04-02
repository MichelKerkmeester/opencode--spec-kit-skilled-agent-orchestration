# Iteration 002 — Security

**Dimension:** D2 Security
**Status:** complete
**Agent:** Codex CLI GPT-5.4 (high reasoning)

## Findings

### P1-S01: Cross-session startup continuity leaks recent session summary into any new hook session

**Severity:** P1
**Source:** `lib/code-graph/startup-brief.ts:90`
**Evidence:** `buildSessionContinuity()` calls `loadMostRecentState()` and injects `state.lastSpecFolder` and `state.sessionSummary.text` into the startup brief. Both hooks unconditionally surface that brief on session start (`claude/session-prime.ts:118-135`, `gemini/session-prime.ts:100-117`). Keyed only by project temp-state recency, not by session or actor.
**Impact:** A newly started session can receive another session's spec folder and summary — trust-boundary violation and information leak across concurrent sessions in the same workspace.
**Fix:** Bind continuity to the current session only, or require an explicit handoff token scoped to the active runtime/session.

### P1-S02: Gemini compact recovery injects cached payload without sanitization

**Severity:** P1
**Source:** `hooks/gemini/session-prime.ts:65`
**Evidence:** Gemini compact path emits `{ title: 'Recovered Context (Post-Compression)', content: payload }` directly into `additionalContext` (`gemini/session-prime.ts:196-201`). Unlike Claude, it does not call `sanitizeRecoveredPayload()` / `wrapRecoveredCompactPayload()`.
**Impact:** Cached compact payload containing prompt-like lines or hostile transcript content would be surfaced as startup context — prompt-injection persistence channel across compaction boundaries.
**Fix:** Apply the same sanitization/provenance wrapping used by Claude before writing Gemini `additionalContext`.

### P2-S03: Hook state JSON deserialized as trusted without schema validation

**Severity:** P2
**Source:** `hooks/claude/hook-state.ts:60`
**Evidence:** Both `loadState()` and `loadMostRecentState()` do `JSON.parse(raw) as HookState` (`hook-state.ts:60-61`, `98-99`) with no runtime validation of field types, lengths, or allowed shape.
**Impact:** Malformed/tampered state file can inject arbitrary strings into `lastSpecFolder`, `sessionSummary`, or `pendingCompactPrime`, which are surfaced to the model.
**Fix:** Validate parsed state with a strict runtime schema before use; clamp field sizes; treat invalid state as absent.

### P2-S04: loadMostRecentState() has TOCTOU window

**Severity:** P2
**Source:** `hooks/claude/hook-state.ts:74`
**Evidence:** `readdirSync(dir)` → `statSync(filePath)` to pick `newestPath` → later `readFileSync(newestPath)`. Another hook process can update/replace files between those steps.
**Impact:** Startup continuity can become nondeterministic under concurrent hook activity. Amplifies cross-session leakage (P1-S01).
**Fix:** Use atomic "current session continuity" pointer, or verify inode/mtime after read.

## Summary
**P0=0 P1=2 P2=2**

## Claim Adjudication

### P1-S01
- **Claim:** Cross-session information leakage via most-recent-state
- **Evidence Refs:** startup-brief.ts:90, claude/session-prime.ts:118-135, gemini/session-prime.ts:100-117
- **Counterevidence Sought:** Is cross-session continuity intentional for single-user workflows?
- **Alternative Explanation:** By design, showing "last session worked on X" aids continuity for solo developers
- **Final Severity:** P1 — even for single-user, concurrent sessions in the same workspace create a real leak
- **Confidence:** 0.80
- **Downgrade Trigger:** If spec explicitly documents single-session-only constraint

### P1-S02
- **Claim:** Gemini missing sanitization on compact recovery
- **Evidence Refs:** gemini/session-prime.ts:65, gemini/session-prime.ts:196-201
- **Counterevidence Sought:** Does Gemini have its own sanitization elsewhere?
- **Alternative Explanation:** Gemini was implemented later and may have been intentionally simplified
- **Final Severity:** P1 — absence of sanitization is a gap regardless of intent
- **Confidence:** 0.90
- **Downgrade Trigger:** If Gemini runtime applies sanitization at a different layer
