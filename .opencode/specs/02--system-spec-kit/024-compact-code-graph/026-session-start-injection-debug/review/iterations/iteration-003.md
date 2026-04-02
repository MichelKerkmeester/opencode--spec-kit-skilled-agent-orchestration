# Iteration 003 — Traceability

**Dimension:** D3 Traceability
**Status:** complete
**Agent:** Codex CLI GPT-5.4 (high reasoning)

## Findings

### P1-T01: Verification tasks T009/T010 marked complete without end-to-end startup evidence

**Severity:** P1
**Source:** `tasks.md:58`
**Evidence:** `- [x] T009 Claude fresh startup with graph DB → outline + continuity appear` and `- [x] T010 Gemini fresh startup → outline appears`, but tests in `tests/startup-brief.vitest.ts:49-91` only unit-test `buildStartupBrief()`, and `tests/hook-session-start.vitest.ts:27-123` covers compact-source handling and generic formatting — not either runtime's `handleStartup()` output.
**Impact:** Packet overstates traceable verification for Claude/Gemini startup-injection behavior.
**Fix:** Add runtime-level tests or captured manual evidence for fresh startup output; or mark T009/T010 incomplete until evidence exists.

### P1-T02: Timing verification (T014) claimed complete without measurable evidence

**Severity:** P1
**Source:** `tasks.md:63`
**Evidence:** `- [x] T014 Hook timing <500ms via logs` is marked complete but the packet contains no timing logs, profiling output, or instrumentation data.
**Impact:** Phase claims a latency gate passed with no traceable measurements.
**Fix:** Add timing instrumentation and cite resulting logs; or uncheck T014 and remove <500ms claim from closeout docs.

### P1-T03: Checklist items use prose evidence instead of [SOURCE: file:line] citations

**Severity:** P1
**Source:** `checklist.md:31`
**Evidence:** Checked items use free-form `[EVIDENCE: ...]` prose like `spec.md sections 2-4...` and `hooks/claude/session-prime.ts now calls...` rather than line-specific `[SOURCE: file:line]` citations. Items CHK-042 (line 76) and CHK-052 (line 86) have no evidence citation at all.
**Impact:** Verification checklist is not independently auditable at line level, weakening traceability.
**Fix:** Replace each evidence note with exact `[SOURCE: path:line]` citations; add missing citations for CHK-042 and CHK-052.

### P2-T04: Spec misstates buildStartupBrief() contract as returning "sections"

**Severity:** P2
**Source:** `spec.md:115`
**Evidence:** Spec/plan describe `buildStartupBrief()` as returning formatted sections, but the actual implementation returns structured data (`StartupBriefResult` with `graphOutline`, `sessionContinuity`, `graphSummary`, `graphState` fields). Hooks transform this data into sections.
**Impact:** Blurs boundary between shared helper and hook adapters in documentation.
**Fix:** Reword spec/plan to describe `buildStartupBrief()` as returning structured brief data consumed by hooks.

## Summary
**P0=0 P1=3 P2=1**

## Claim Adjudication

### P1-T01
- **Claim:** T009/T010 lack end-to-end test evidence
- **Evidence Refs:** tasks.md:58, tests/startup-brief.vitest.ts:49-91, tests/hook-session-start.vitest.ts:27-123
- **Counterevidence Sought:** Are there manual test logs or screenshots proving startup output?
- **Alternative Explanation:** Manual verification may have been done but not captured in the packet
- **Final Severity:** P1 — regardless of whether manual testing was done, the packet lacks traceable evidence
- **Confidence:** 0.85
- **Downgrade Trigger:** If manual test evidence is added to the packet

### P1-T02
- **Claim:** Timing gate lacks measurement evidence
- **Evidence Refs:** tasks.md:63
- **Counterevidence Sought:** Are there hook timing logs anywhere in the repo?
- **Alternative Explanation:** Hook timeout at 1800ms (shared.ts) implies timing was acceptable
- **Final Severity:** P1 — the timeout being set doesn't prove <500ms was measured
- **Confidence:** 0.85
- **Downgrade Trigger:** If timing measurements are captured and cited

### P1-T03
- **Claim:** Checklist evidence is not line-specific
- **Evidence Refs:** checklist.md:31, :76, :86
- **Counterevidence Sought:** Does the checklist spec require [SOURCE: file:line] format?
- **Alternative Explanation:** Prose evidence may be sufficient for Level 2 specs
- **Final Severity:** P1 — deep review standard requires auditable citations
- **Confidence:** 0.75
- **Downgrade Trigger:** If Level 2 spec standard explicitly allows prose evidence
