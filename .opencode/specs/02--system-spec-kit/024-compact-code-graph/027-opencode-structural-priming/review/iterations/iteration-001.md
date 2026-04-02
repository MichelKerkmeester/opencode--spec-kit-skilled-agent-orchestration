# Iteration 001 — Correctness

**Dimension:** D1 Correctness
**Status:** complete
**Agent:** Claude Opus 4.6 (direct code review)

## Findings

### P1-C01: session_resume produces duplicate hints for stale/empty graph

**Severity:** P1
**Source:** `handlers/session-resume.ts:104-109` + `handlers/session-resume.ts:128-130`
**Evidence:** Pre-existing graph hints at lines 104-109 fire alongside Phase 027 structural context hint at line 129. When graph is stale, BOTH fire:
- "Code graph is >24h old. Run `code_graph_scan` to refresh."
- "Structural context is stale. Call session_bootstrap to refresh."
**Impact:** Duplicate hints with conflicting advice — old hints recommend `code_graph_scan` while structural contract recommends `session_bootstrap` first.
**Fix:** Remove or update old graph hints (lines 104-109) to defer to the structural contract hint.

### P2-C02: buildStructuralBootstrapContract maps 'error' to 'missing' silently

**Severity:** P2
**Source:** `lib/session/session-snapshot.ts:152-154`
**Evidence:** The else branch catches both 'empty' and 'error', mapping both to 'missing'. Distinction between "no data" and "DB access failed" is lost.
**Impact:** Minor — recommended action is the same for both.
**Fix:** No code fix needed; documented as intentional in spec.

## Summary
**P0=0 P1=1 P2=1**

## Claim Adjudication

### P1-C01
- **Claim:** Duplicate hints create conflicting recovery guidance
- **Evidence Refs:** session-resume.ts:104-109, session-resume.ts:128-130
- **Counterevidence Sought:** Are old hints intentionally kept for backwards compatibility?
- **Alternative Explanation:** Phase 027 may have left old hints as fallback
- **Final Severity:** P1 — duplicate hints with conflicting advice is real usability issue
- **Confidence:** 0.85
- **Downgrade Trigger:** If old hints documented as intentionally retained
