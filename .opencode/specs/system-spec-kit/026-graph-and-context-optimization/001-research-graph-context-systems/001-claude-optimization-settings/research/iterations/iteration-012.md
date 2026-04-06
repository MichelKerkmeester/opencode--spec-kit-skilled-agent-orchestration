# Iteration 012 -- Post-skeptical tier re-rating for F1-F24

## Iteration metadata
- run: 12
- focus: tier re-rating + recommendation flips + synthesis amendment list
- status: thought
- findingsCount: 0
- newInfoRatio: 0.28
- constraint note: no new source findings introduced; this pass only re-rates the ledger using iterations 009-011

## A. Updated tier table for F1-F24

| F-id | Title (short) | Original tier | New tier | Original recommendation | New recommendation | Reason for change | Net confidence |
|---|---|---|---:|---|---|---|---:|
| F1 | `ENABLE_TOOL_SEARCH` baseline win | 1 | 1 | adopt now | adopt now | no change | 4 |
| F2 | Do not overclaim deferred-loading gains | 1 | 1 | adopt now | adopt now | no change | 5 |
| F3 | Model cache expiry with 3 signals | 2 | 3 | adopt now | adopt now | F21 weakens the post's hard arithmetic, so this stays useful as qualitative framing but loses some priority as a quantitative claim. | 3 |
| F4 | Keep idle timestamp in `session-stop.js` | 2 | 2 | prototype later | prototype later | Iterations 009 and 011 clarified that this boundary still holds, but only after F19/F20 establish the contract and replay scaffold. | 4 |
| F5 | `UserPromptSubmit` stale warning | 2 | 4 | prototype later | prototype later | Iteration 011 shows this is still the highest-UX-risk prototype and should stay behind the contract and replay prerequisites. | 3 |
| F6 | Put resume warning in `session-prime.js` | 2 | 2 | prototype later | prototype later | Iterations 009 and 011 make the path more concrete, but they also show it depends on F19/F20/F7/F4 first. | 4 |
| F7 | Reuse shared hook-state seam | 2 | 2 | prototype later | prototype later | no change | 4 |
| F8 | Do not move warning ownership into `compact-inject.js` | 2 | 3 | reject | reject | Iterations 009-011 reinforce the boundary, but this is less urgent than the prerequisite contract work it protects. | 5 |
| F9 | Prefer clear-and-rehydrate over blind stale resume | 3 | 4 | adopt now | prototype later | F22 shows the preferred remedy bundle is not net-costed, so this should be validated locally before it stays as strong workflow guidance. | 3 |
| F10 | Reinforce native-tool routing first | 3 | 2 | adopt now | adopt now | Existing repo alignment plus the skeptical pass make this a clearer docs-first priority than several speculative prototype lanes. | 5 |
| F11 | Treat redundant rereads as cache-amplified waste | 3 | 3 | adopt now | adopt now | F18 shows the repo still lacks the telemetry to call this locally proven, so the framing stays but the confidence softens. | 3 |
| F12 | Break edit-retry chains after first miss | 3 | 3 | adopt now | adopt now | no change | 4 |
| F13 | Preserve denominator mismatches explicitly | 3 | 1 | adopt now | adopt now | F21 turns denominator discipline from a nice-to-have honesty rule into an audit-critical synthesis safeguard. | 5 |
| F14 | Offline-first transcript auditor | 4 | 2 | prototype later | prototype later | F18 shows the auditor is a prerequisite validation asset for much of the ledger, even though implementation still belongs to phase 005. | 5 |
| F15 | Disable-review queue needs reasons, not low-usage only | 4 | 4 | prototype later | prototype later | F23 adds another prerequisite layer rather than making this more immediate. | 3 |
| F16 | Keep Claude JSONL as guarded adapter only | 4 | 2 | reject as core infra; prototype later as adapter | reject as core infra; prototype later as adapter | Skeptical and validation evidence both strengthen this as a hard architectural boundary, not a background caution. | 5 |
| F17 | Share schema/dashboard layers, not one parser | 4 | 4 | prototype later | prototype later | Portability is still conditional and remains unvalidated outside Claude-specific evidence. | 3 |
| F18 | Current hook telemetry cannot validate most of the ledger | n/a | 2 | n/a | prototype later | This becomes a near-term validation planning constraint because it blocks honest local confirmation for F11/F12/F15/F17. | 5 |
| F19 | Idle-timestamp contract is a prerequisite | n/a | 1 | n/a | prototype later | Iterations 009 and 011 make this the first dependency edge for the hook-warning branch. | 5 |
| F20 | Shared hook replay harness is the missing scaffold | n/a | 1 | n/a | prototype later | One reusable replay harness now clearly unlocks F4/F5/F6/F7/F8/F16 instead of repeated one-off validation work. | 5 |
| F21 | Headline arithmetic is too inconsistent for ledger-grade totals | n/a | 1 | n/a | adopt now | This correction needs to land in synthesis before downstream recommendations inherit rhetorical token and dollar totals as if they were reconciled facts. | 5 |
| F22 | Remedy bundle is not net-costed | n/a | 2 | n/a | adopt now | This is an immediate synthesis caveat, but it is less blocking than F21 because it mainly narrows remedy framing rather than invalidating the entire dataset summary. | 4 |
| F23 | Skill-disable review needs a baseline window contract | n/a | 3 | n/a | adopt now | This should be adopted as a planning guardrail now, even though the actual queue implementation remains late-phase work. | 4 |
| F24 | Hook replay must isolate side effects | n/a | 1 | n/a | adopt now | Prototype evidence can be polluted without isolated `TMPDIR` and autosave neutralization, so this becomes an immediate rule for any follow-on validation work. | 5 |

## B. Recommendation flips

Only one finding changed recommendation label in this pass.

- F9: `adopt now -> prototype later`
  - justification: iteration 009 already framed F9 as a matched-run hypothesis rather than a settled local result, and iteration 010 F22 showed the post's preferred `/clear` plus plugin-memory remedy bundle was never net-costed.

## C. Tier 0 (urgent) candidates

No Tier 0 candidates are recommended in this pass.

The closest near-urgent items are F13, F19, F20, F21, and F24, but they do not yet require a separate "block-all-downstream-work" flag because iteration 013 can still absorb the synthesis corrections and dependency ordering before implementation work starts.

## D. Confidence delta on selected high-impact findings

- F1: lowered. Iteration 009 kept the recommendation but downgraded confidence from "validated local win" language to "still credible, but unmeasured in this repo."
- F3: lowered. Iteration 010 F21 weakens the token and dollar arithmetic beneath the cache-expiry rhetoric, so the three-signal frame remains useful but less quantitatively trustworthy.
- F4: lowered. Iteration 009 kept the Stop-hook boundary, but it reduced confidence by making the idle-timestamp contract an unproven prerequisite instead of an assumed easy extension.
- F11: lowered. Iteration 009 F18 shows the repo cannot honestly call reread waste locally confirmed without a richer transcript-audit harness.
- F14: raised. Iterations 009 and 011 moved the auditor from a general future nice-to-have into a concrete prerequisite validation asset with a scoped prototype lane.
- F16: held steady. Iterations 009-011 strengthen the same guarded-adapter conclusion, but the finding was already at maximum confidence.

## E. Synthesis amendment list

- section.1: add a skeptical-summary sentence that the post remains directionally useful but its headline token and dollar totals are not ledger-grade because of F21 and the un-netted remedy bundle in F22.
- section.4.ordering: re-order the findings by the new tier map so F13/F19/F20/F21/F24 are treated as top-priority follow-up material instead of later-tier background.
- section.4.F3: revise the wording so the three-signal cache model is framed as qualitative synthesis guidance, not as numerically settled budget accounting.
- section.4.F9: downgrade the current clear-and-rehydrate guidance from strong adoption language to conditional, local-validation-needed language.
- section.4.F13: explicitly cross-link denominator-preservation language to F21 so the mismatch is treated as an audit boundary, not just a footnote.
- section.4.F14: add that the auditor is now a prerequisite validation asset for multiple findings, while keeping implementation provenance in phase `005-claudest`.
- section.4.F15: add the F23 baseline-window and denominator-contract requirement before any disable-review queue can be considered honest.
- section.4.F16: strengthen the fail-closed guarded-adapter boundary with explicit parser-fragility language and coverage expectations.
- section.4.F18-F24: add new finding subsections for F18-F24 using the iteration 009-011 evidence, with F21/F22 placed before the prototype-design findings so skeptical corrections land before dependency planning.
- section.8: add a short paragraph that portability and observability claims must separate source-specific adapters from shared reporting layers and must not inherit unreconciled source totals.
- section.9: update the cross-phase boundary notes so F14 stays in phase `005-claudest`, F5/F15 remain separate later-phase work, and F19/F20/F24 are named as phase-001 follow-up prerequisites.
- section.10: add explicit risk bullets for F21 denominator inconsistency, F22 net-cost omission, and F24 prototype side-effect pollution.
- section.11: add open questions for plugin-overhead net costing, baseline-window definition for skill review, and the exact artifact boundary the replay harness must isolate.

## F. New-finding status

No new findings were created in iteration 012. This is a cross-iteration synthesis pass only, so `findingsCount=0` and `status=thought` are intentional.

{"type":"iteration","run":12,"status":"thought","focus":"tier re-rating + recommendation flips + synthesis amendment list","findingsCount":0,"newInfoRatio":0.28,"toolCallsUsed":8,"timestamp":"2026-04-06T12:38:18Z","agent":"cli-codex:gpt-5.4:high"}
