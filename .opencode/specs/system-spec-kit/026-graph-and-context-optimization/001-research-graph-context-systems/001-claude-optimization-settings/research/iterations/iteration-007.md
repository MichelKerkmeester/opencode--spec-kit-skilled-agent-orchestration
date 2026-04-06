# Iteration 007 -- Residual gap closure, contradiction sweep, and confidence scoring

## Iteration metadata
- run: 7
- focus: Q2/Q3/Q5/Q8 gap closure + contradiction sweep + confidence scoring
- timestamp: 2026-04-06T10:35:00Z
- toolCallsUsed: 8
- status: insight
- newInfoRatio: 0.24
- findingsCount: 2

## Residual gap closure
| Q# | Iteration-006 gap statement (verbatim) | Iteration-007 disposition |
|---|---|---|
| 2 | "I5-F1 and I5-F2 define the risk inventory, but Public still lacks repo-local A/B evidence for first-tool latency, discoverability, and workflow ergonomics." | **Exhausted -- post does not contain enough evidence to close further.** The source only says deferred loading "lazy-loads the rest on demand" and reports token savings; it does not report first-tool latency, discoverability, fallback rate, or task-completion ergonomics. [SOURCE: `external/reddit_post.md:17-24`] |
| 3 | "I1-F2 establishes cache expiry as the dominant directional waste source, and I4-F3 preserves the denominator mismatch, but Public still lacks local modeling/calibration." | **Closed for synthesis by Finding F1.** The post is strong enough to define the right modeling frame even though repo-local calibration still needs local telemetry. |
| 5 | "I1-F6, I4-F1, and I4-F5 define the telemetry-first method, but the repo still lacks a local disable threshold beyond usage plus impact review." | **Closed for synthesis by Finding F2.** The post does give a tighter disable-review threshold than "usage plus impact review" alone. |
| 8 | "I3-F3 and I5-F3 clarify guardrail implications, but root-cause partitioning between prompt quality, workflow design, and messaging remains open." | **Exhausted -- post does not contain enough evidence to close further.** The source reports only "31 failed-edit-then-retry sequences"; it never attributes those chains among prompt quality, workflow design, or messaging. [SOURCE: `external/reddit_post.md:62-62`] |

## Findings
### Finding F1: Q3 should be modeled as a three-layer dominance claim, not a single percentage
- Source passage (anchor): paragraph beginning "54% of my turns (6,152 out of 11,357) followed an idle gap longer than 5 minutes."; paragraph beginning "The auditor flags "cache cliffs" specifically:"; paragraph beginning "Estimated waste: 12.3 million tokens that counted against my usage for zero value."
- Source quote: "54% of my turns (6,152 out of 11,357) followed an idle gap longer than 5 minutes."; "232 of those across 858 sessions..."; "Estimated waste: 12.3 million tokens... roughly 7.5% of my total input budget..." [SOURCE: `external/reddit_post.md:40-46`]
- What it documents: The post does not rely on one noisy denominator. It gives three distinct signals for cache-expiry dominance: **behavioral prevalence** (54% of measured turns), **event severity** (232 cliff events), and **budget exposure** (12.3M tokens, ~7.5% of total input budget).
- Why it closes the gap: This is enough evidence to stop looking for a better source-side framing. Final synthesis should model cache expiry with those three layers together, while keeping the 926-vs-858 and 11,357-vs-18,903 denominator mismatches explicit instead of collapsing them into one "true" rate.
- Recommendation label: adopt now
- Category: synthesis methodology
- Affected area in this repo: `research/research.md` Q3 answer and final prioritization narrative
- Residual limit: This closes the **research-model** gap, not the **repo-local calibration** gap. Public still needs local telemetry before claiming local prevalence or local dollar impact.

### Finding F2: Q5's strongest post-backed disable threshold is a two-stage triage, not raw low-usage auto-disable
- Source passage (anchor): paragraph beginning "Covered above, but the dashboard makes it starker."
- Source quote: "42 skills loaded in my setup. 19 of them had 2 or fewer invocations across the entire 858-session dataset." and "The dashboard has a "skills to consider disabling" table that flags low-usage skills automatically with a reason column (never used, low frequency, errors on every run)." [SOURCE: `external/reddit_post.md:50-54`]
- What it documents: The post's actual disable signal is not just `<=2 invocations`. It uses a **reasoned review queue**: never used, low frequency, or errors on every run.
- Why it closes the gap: This is the missing threshold refinement. In synthesis, Public can say the strongest post-backed evidence for disable review is **never used** or **errors on every run**; **low frequency alone** should enter human impact review rather than trigger automatic disablement. That is a stronger and more faithful rule than "usage plus impact review" without explicit source-backed buckets.
- Recommendation label: adopt now
- Category: telemetry policy
- Affected area in this repo: Q5 answer, later telemetry rubric, and any future "skills to consider disabling" table
- Residual limit: The post supplies the review buckets, not Public's local counts. Repo-local application still depends on transcript or equivalent usage telemetry.

## Cross-iteration contradiction sweep
No new **factual** contradiction surfaced across iterations 1-6 beyond the already-preserved 926-vs-858 and 11,357-vs-18,903 source discrepancies. The issues below are recommendation-label drift or scope-splitting drift, not evidence disagreement.

| Pair / finding | Apparent disagreement | Assessment | Recommendation-label correction |
|---|---|---|---|
| I1-F4 vs iteration-006 tier table / S3 | Iteration 001 labeled fresh-session recovery **prototype later**, while iteration 006 promotes it to **adopt now via workflow guidance**. | Not a source conflict. The post clearly supports the workflow preference now; only enforced warning-hook UX remains prototype work. | **Correct label:** adopt now for workflow guidance; prototype later only for hook enforcement. |
| I3-F4 vs iteration-006 tier table | Iteration 003 labeled the layered reducer-first enforcement model **adopt now**; iteration 006 tiers it as **prototype later**. | This is a scope split. The architecture principle is strong now, but the actual reducer/telemetry implementation is still instrumentation-heavy and format-fragile. | **Correct label:** prototype later for implementation; adopt-now only as synthesis guidance. |
| I4-F2 vs iteration-006 tier table | Iteration 004 labeled undocumented Claude JSONL dependence **reject**; iteration 006 rephrased it as **prototype later with fail-closed parser guards**. | The evidence supports both halves depending on what is being labeled. The repo should reject JSONL as **core stable infra**, but a guarded adapter remains prototype-worthy. | **Correct label:** reject as core infra; prototype later as a guarded adapter. |
| I5-F3 vs iteration-006 tier table | Iteration 005 labeled edit-chain breaking **prototype later**; iteration 006 promotes it to **adopt now via guardrail messaging**. | Not a factual conflict. The post supports immediate wording changes after first miss; only telemetry and chain counting remain later work. | **Correct label:** adopt now for guardrail messaging; prototype later for sequence telemetry. |
| I1-F3 vs I2-F1 / I2-F3 | Iteration 001 treated the three-hook bundle as only a partial fit, while iteration 002 marked Stop and SessionStart placement **adopt now**. | No contradiction after decomposition. Iteration 001 assessed the bundle; iteration 002 split the bundle and found two hooks fit current ownership boundaries while `UserPromptSubmit` remains prototype-only. | **Recommendation label remains valid once decomposed.** |

## Confidence scoring for synthesis short list
Selected using the highest-priority items first from iteration 006's tier table.

| Finding ref | Confidence (1-5) | Rationale |
|---|---:|---|
| I1-F1 | 5 | Directly quoted from the post and directly verified against `.claude/settings.local.json`, with little interpretation risk. |
| I5-F1 | 4 | Strong repo-state claim, but still depends on unrun local A/B validation before any repo-local performance conclusion. |
| I5-F2 | 5 | High-confidence negative claim: the post truly does not report latency, discoverability, or ergonomics evidence. |
| I5-F4 | 5 | Strong because the post names one explicit config and then shifts to hook behavior; that boundary is textually clear. |
| I1-F2 | 4 | Cache expiry dominance is strongly supported, but denominator mismatch lowers precision for exact prevalence claims. |
| I1-F3 | 4 | Hook-surface fit is well grounded in repo files, but the post's proposed UX is explicitly unshipped and partially speculative. |
| I2-F1 | 5 | Existing async Stop ownership and shared state file make the integration recommendation directly evidence-backed. |
| I2-F2 | 4 | The architectural fit is solid, but the one-time soft-block UX still lacks runtime proof and shipped precedent. |
