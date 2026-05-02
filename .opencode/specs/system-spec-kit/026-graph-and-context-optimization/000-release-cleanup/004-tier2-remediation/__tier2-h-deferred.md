# Tier 2 H — DEFERRED (Human Action Required)

> **Status: BLOCKED ON HUMAN VERIFICATION**
> Source review: `../../../006-graph-impact-and-affordance-uplift/001-clean-room-license-audit/review/001-clean-room-license-audit-tier2-pt-01/review-report.md`
> Source verdict: **FAIL** — P0=1, P1=3, P2=1

## The P0

The Tier 2 H deep review surfaced a release-blocker P0 (F-001 in the source report):

> The audit substituted canonical PolyForm-Noncommercial 1.0.0 text for the actual `external/LICENSE` (which was gitignored and unavailable to the audit). The audit was then marked complete and unblocked siblings 002-005.

This means:
- The clean-room approval gate is NOT actually closed.
- The audit conclusion (PolyForm-NC obligations are met) is based on a canonical substitute, not the file the project ships.
- If the actual `external/LICENSE` differs from canonical PolyForm-NC text in any way (line endings, embedded copyright, custom modifications), the audit's clause-by-clause verification is invalid.
- Siblings 002-005 in the `006-graph-impact-and-affordance-uplift` packet were unblocked by this audit — if the audit is invalid, they need re-audit.

## Why this can't be auto-remediated

The actual `external/LICENSE` is **gitignored**. cli-codex (and Claude) cannot read files that are excluded from the working tree. Substituting canonical text again would just repeat the exact problem the review surfaced. This requires:

1. A human (with access to the actual filesystem outside the gitignore boundary) to physically read the shipped `external/LICENSE`.
2. A clause-by-clause verification against the canonical PolyForm-NC 1.0.0 text.
3. Documentation of any deltas (additional clauses, custom modifications, attribution boilerplate).

## Required human steps

1. **Locate the actual file**: from the project root, find the actual `external/LICENSE` (it may be in a sibling worktree, an unmounted submodule, or a manually-staged location). Confirm it exists.
2. **If file exists**:
   - Read it end-to-end.
   - Compare clause-by-clause against canonical PolyForm-Noncommercial 1.0.0: <https://polyformproject.org/licenses/noncommercial/1.0.0/>
   - Document any deltas in 006/001-clean-room-license-audit/decision-record.md as a new ADR.
   - If deltas exist that affect the audit's conclusions, redo the audit's clause-by-clause verification.
   - If no deltas, mark the audit as honestly verified (replace the canonical substitute with the actual text or a verifiable digest).
3. **If file does NOT exist**:
   - The project may have shipped without `external/LICENSE`, which is a separate compliance issue.
   - Document this in 006/001-clean-room-license-audit/decision-record.md.
   - Trigger remediation: either add the file, or remove the external code that requires it.
4. **Re-audit siblings**: open `006/002`, `006/003`, `006/004`, `006/005`. Each was unblocked by the audit. Confirm each is still appropriate given the verified license terms.

## Tracking

After human verification:
- Update 006/001/checklist.md to mark the audit honestly (with file digest evidence).
- Update 006/001/implementation-summary.md to reflect actual verification.
- Update this file's `Status` line to `RESOLVED` with date + verifier.

Sibling P1s in the source report (3 of them, listed below for reference) ALSO need attention but are scoped to the audit packet itself, not this deferred gate:
- F-002, F-003, F-004 — see source review-report.md §3 Active Finding Registry.

## Why we are not implementing the P1s here

The P0 invalidates the audit. Closing P1s before the P0 means polishing a doc that's about to be substantively rewritten. Better to close all 4 (P0 + 3 P1) in one human-led pass after verification.

---

**Last updated**: 2026-04-28
**Next review trigger**: When human reports verification result.
