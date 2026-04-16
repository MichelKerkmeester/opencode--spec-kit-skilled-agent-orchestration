# Iteration 11 — Citation accuracy audit (top 30)

## Method
- Selection: 30 load-bearing findings weighted by recommendation evidence, killer-combo participation, cross-phase synthesis anchor status, and iter-9 suspicion flags.
- Pattern: open each cited range literally, compare the underlying text against the finding title plus rationale, then classify as accurate, weak, drifted, or missing.

## Audit summary
| Severity | Count |
|---|---:|
| solid | 21 |
| mostly-solid | 3 |
| needs-fix | 0 |
| broken | 6 |

## Worst citations (top 5)
- F-CROSS-064: "Evidence labeling is a transport-level guarantee, not a UI convention" vs actual content: the cited file path `phase-4/research/research.md` does not exist literally in this checkout.
  Verdict: missing
  Fix: use `004-graphify/research/research.md:633-633`
- F-CROSS-026: "Public's 008-signal-extraction packet is a monolithic extractor unification, not an auditor/discoverer split" vs actual content: the cited file path `phase-5/research/research.md` does not exist literally in this checkout.
  Verdict: missing
  Fix: use `research/iterations/iteration-3.md:129-133` or `005-claudest/research/research.md:219-235` plus the 008 packet citation
- F-CROSS-065: "Cached summary fast path turns startup recall into a DB lookup" vs actual content: the cited file path `phase-5/research/research.md` does not exist literally in this checkout.
  Verdict: missing
  Fix: use `005-claudest/research/research.md:171-185`
- F-CROSS-061: "ENABLE_TOOL_SEARCH is already the baseline win in Public" vs actual content: the cited file path `phase-1/research/research.md` does not exist literally in this checkout.
  Verdict: missing
  Fix: use `001-claude-optimization-settings/research/research.md:36-47`
- F-CROSS-036: "Benchmark-honest token reporting" vs actual content: the cited row is a one-line Q-C synthesis row, while the real methodology lives in Q-A.
  Verdict: weak
  Fix: use `research/iterations/q-a-token-honesty.md:115-125`

## Patterns observed
- All 6 broken citations are literal `phase-N/...` aliases that do not exist as files in this packet checkout; they need real folder-path replacements before reuse.
- 2 of the 3 weak citations use one-line Q-C table rows as stand-ins for richer methodology or runtime-contract evidence.
- The remaining weak citation (`F-CROSS-056`) uses matrix dominance rows for a normative "these lanes matter most, so reinforce routing" inference that is only partly stated in the cited range.

## Handoff to iter-12
- iter-12 will stress-test killer combos.
- Findings with broken citations should NOT be used as combo evidence in v2 until their paths are repaired.
- Weak-but-important findings should prefer the richer phase or Q-A/Q-F source ranges before they are promoted into combo or recommendation evidence.
