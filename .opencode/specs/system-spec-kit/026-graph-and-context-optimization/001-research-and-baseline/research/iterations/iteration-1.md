# Iteration 1 — Gap Inventory

## Focus
Build a source-cited inventory of every unresolved, weakened, broken, or misclassified gap left by the 18-iteration legacy packet so later iterations can validate severity instead of re-discovering defect surface area.

## Actions Taken
- Read the original charter and exit-gap list in `deep-research-strategy.md`, especially the 26 first-pass gaps and the tag taxonomy contract. [SOURCE: deep-research-strategy.md:40-155]
- Read the full legacy state log to reconstruct the non-monotonic convergence path and the rigor-lane checkpoints from iter-9 through iter-18. [SOURCE: deep-research-state.jsonl:8-21]
- Read the canonical synthesis in `research.md`, focusing on the historical change log, the corrected Q-E/Q-F sections, the confidence statement, and the new pattern/moat sections used to judge what stayed unresolved. [SOURCE: research.md:1-15] [SOURCE: research.md:29-42] [SOURCE: research.md:221-305]
- Read the ranked recommendations, the registry summary, and the capability matrix to capture dependency drift, tag distribution, and baseline-score caveats. [SOURCE: recommendations.md:5-103] [SOURCE: findings-registry.json:5-38] [SOURCE: cross-phase-matrix.md:1-124]
- Read the rigor-lane artifacts that explicitly surfaced defects: skeptical review, gap re-attempt, citation audit, combo stress test, counter-evidence, final validation, and the v1-v2 diff. [SOURCE: iterations/iteration-9-skeptical-review.md:15-116] [SOURCE: iterations/iteration-10.md:8-80] [SOURCE: iterations/citation-audit-iter-11.json:8-419] [SOURCE: iterations/iteration-12.md:7-22] [SOURCE: iterations/iteration-16.md:16-24] [SOURCE: iterations/iteration-18.md:14-17] [SOURCE: archive/v1-v2-diff-iter-18.md:46-183]
- Used `view`, `rg`, and one read-only Python pass to count registry tags, enumerate the 6 broken / 3 mostly-solid citation findings, and confirm the current root registry still carries `31` `new-cross-phase` tags. [SOURCE: findings-registry.json:5-20] [SOURCE: iterations/citation-audit-iter-11.json:8-21] [SOURCE: iterations/citation-audit-iter-11.json:54-67] [SOURCE: iterations/citation-audit-iter-11.json:206-219] [SOURCE: iterations/citation-audit-iter-11.json:253-266] [SOURCE: iterations/citation-audit-iter-11.json:374-419]

## Findings
### Gap Inventory Table
| GAP-ID | Source | Phase | Prior Status (v2) | Evidence Chain v1→v2 | Candidate Severity | Cheapest Remediation |
|--------|--------|-------|-------------------|----------------------|--------------------|-----------------------|
| GAP-001 | first-pass-exit | 001 | partial | [SOURCE: deep-research-strategy.md:81-81] → [SOURCE: iteration-10.md:67-67] | P2 | Measure first-tool latency and fallback discoverability under `ENABLE_TOOL_SEARCH=true`. |
| GAP-002 | first-pass-exit | 001 | UNKNOWN-confirmed | [SOURCE: deep-research-strategy.md:82-82] → [SOURCE: iteration-10.md:54-57] | P1 | Recover chain-level retry examples or stop claiming causal attribution. |
| GAP-003 | first-pass-exit | 001 | partial | [SOURCE: deep-research-strategy.md:83-83] → [SOURCE: iteration-10.md:68-68] | P1 | Count `/clear` remedy overhead against the stale-resume baseline. |
| GAP-004 | first-pass-exit | 001 | partial | [SOURCE: deep-research-strategy.md:84-84] → [SOURCE: iteration-10.md:69-69] | P2 | Reconcile the 926/858 session and 11,357 denominator drift with explicit arithmetic. |
| GAP-005 | first-pass-exit | cross | partial | [SOURCE: deep-research-strategy.md:85-85] → [SOURCE: findings-registry.json:118-141] | P1 | Re-open the phase-001 vs phase-005 contract fit with corrected tagging and citations. |
| GAP-006 | first-pass-exit | 002 | closed | [SOURCE: deep-research-strategy.md:88-88] → [SOURCE: iteration-10.md:39-44] | P2 | Keep the closure but add provider-counted token benchmarking before any multiplier language. |
| GAP-007 | first-pass-exit | 002 | closed | [SOURCE: deep-research-strategy.md:89-89] → [SOURCE: findings-registry.json:164-179] | P2 | Treat tRPC/Fastify enrichment as a detector gap, not as evidence of broader contract maturity. |
| GAP-008 | first-pass-exit | 002 | corrected-closed | [SOURCE: deep-research-strategy.md:90-90] → [SOURCE: findings-registry.json:183-198] | P1 | Split `ast` from regex/brace-tracked provenance instead of overloading one label. |
| GAP-009 | first-pass-exit | 002 | closed | [SOURCE: deep-research-strategy.md:91-91] → [SOURCE: iteration-10.md:23-30] | P2 | Document the real workspace boundary and explicitly exclude nx/turbo/lerna/rush-only metadata. |
| GAP-010 | first-pass-exit | 002 | partial | [SOURCE: deep-research-strategy.md:92-92] → [SOURCE: iteration-10.md:70-70] | P1 | Add a blast-radius precision/recall harness before using schema-impact rhetoric. |
| GAP-011 | first-pass-exit | 003 | closed | [SOURCE: deep-research-strategy.md:95-95] → [SOURCE: iteration-10.md:32-37] | P2 | Preserve the closure: the 93% figure is estimate math, not a benchmark. |
| GAP-012 | first-pass-exit | 003 | closed | [SOURCE: deep-research-strategy.md:96-96] → [SOURCE: findings-registry.json:259-276] | P1 | Keep the privacy weakness explicit and avoid treating Mainframe as a portable source lane. |
| GAP-013 | first-pass-exit | 003 | partial | [SOURCE: deep-research-strategy.md:97-97] → [SOURCE: findings-registry.json:278-295] | P1 | Add atomic conflict semantics or clearly bound Matrix multi-agent writes as non-authoritative. |
| GAP-014 | first-pass-exit | 003 | partial | [SOURCE: deep-research-strategy.md:98-98] → [SOURCE: findings-registry.json:297-314] | P1 | Add webhook idempotency, secret rotation, and routed failure notification to close the lane. |
| GAP-015 | first-pass-exit | 003 | partial | [SOURCE: deep-research-strategy.md:99-99] → [SOURCE: findings-registry.json:316-333] | P1 | Add post-regeneration completion guarantees or explicitly downgrade repair-queue claims. |
| GAP-016 | first-pass-exit | 004 | closed | [SOURCE: deep-research-strategy.md:102-102] → [SOURCE: iteration-10.md:39-44] | P2 | Keep the closure: the 71.5x claim is heuristic unless token counting is grounded. |
| GAP-017 | first-pass-exit | 004 | closed | [SOURCE: deep-research-strategy.md:103-103] → [SOURCE: findings-registry.json:354-371] | P2 | Treat cache deletion/invalidation debt as a bounded maintenance lane, not solved infrastructure. |
| GAP-018 | first-pass-exit | 004 | closed | [SOURCE: deep-research-strategy.md:104-104] → [SOURCE: findings-registry.json:373-390] | P2 | Preserve the parity warning: Swift detection without extraction is still an honesty gap. |
| GAP-019 | first-pass-exit | 004 | partial | [SOURCE: deep-research-strategy.md:105-105] → [SOURCE: findings-registry.json:392-409] | P2 | Separate ranking semantics from report semantics for INFERRED confidence values. |
| GAP-020 | first-pass-exit | 004 | closed | [SOURCE: deep-research-strategy.md:106-106] → [SOURCE: iteration-10.md:46-52] | P2 | Keep the worked artifact labeled as non-reproducible multimodal evidence. |
| GAP-021 | first-pass-exit | 004 | UNKNOWN-confirmed | [SOURCE: deep-research-strategy.md:107-107] → [SOURCE: iteration-10.md:59-64] | P1 | Add before/after tool-choice telemetry or stop implying the hook changed behavior. |
| GAP-022 | first-pass-exit | 005 | closed | [SOURCE: deep-research-strategy.md:110-110] → [SOURCE: findings-registry.json:449-466] | P2 | Keep FTS fallback claims bounded to the runtime contract actually verified. |
| GAP-023 | first-pass-exit | 005 | partial | [SOURCE: deep-research-strategy.md:111-111] → [SOURCE: findings-registry.json:468-485] | P1 | Persist `transcript_path`, cache-token fields, and turn offsets before claiming analytics readiness. |
| GAP-024 | first-pass-exit | 005 | closed | [SOURCE: deep-research-strategy.md:112-112] → [SOURCE: findings-registry.json:487-504] | P2 | Replace inferred plugin-doc ownership with direct file proof or keep it marked absent. |
| GAP-025 | first-pass-exit | 005 | closed | [SOURCE: deep-research-strategy.md:113-113] → [SOURCE: findings-registry.json:506-523] | P2 | Align `_build_fallback_context()` docs with the implemented first-2/last-6 renderer. |
| GAP-026 | first-pass-exit | cross | partial | [SOURCE: deep-research-strategy.md:114-114] → [SOURCE: findings-registry.json:525-542] | P1 | Re-cite the `008-signal-extraction` conclusion with literal paths and stable source_phase metadata. |
| GAP-027 | iter-9 | deliverable | fixed | [SOURCE: iteration-9-skeptical-review.md:20-21] → [SOURCE: research.md:38-39] | P2 | Keep Claudest framed as the strongest pattern source, not the cleanest portable codebase. |
| GAP-028 | iter-9 | deliverable | fixed | [SOURCE: iteration-9-skeptical-review.md:26-28] → [SOURCE: research.md:30-34] | P2 | Keep matrix prose literal to scored rows instead of value-judgment language. |
| GAP-029 | iter-9 | deliverable | fixed | [SOURCE: iteration-9-skeptical-review.md:33-34] → [SOURCE: research.md:263-265] | P1 | Preserve the split between evidence-shape UNKNOWNs and measurement-bounded UNKNOWNs. |
| GAP-030 | iter-9 | roadmap | partial | [SOURCE: iteration-9-skeptical-review.md:39-40] → [SOURCE: recommendations.md:35-43] | P1 | Promote activation scaffolding from an implicit prerequisite to an explicit tracked work item. |
| GAP-031 | iter-9 | license | fixed | [SOURCE: iteration-9-skeptical-review.md:42-44] → [SOURCE: research.md:221-232] | P1 | Keep Q-E’s two-column portability rule as the authoritative standard. |
| GAP-032 | iter-9 | confidence | fixed | [SOURCE: iteration-9-skeptical-review.md:49-50] → [SOURCE: research.md:258-265] | P2 | Keep confidence anchored to correctness plus coverage, not coverage alone. |
| GAP-033 | iter-9 | registry | partial | [SOURCE: iteration-9-skeptical-review.md:54-58] → [SOURCE: iteration-18.md:15-17] | P1 | Re-run registry summary and tag validation after retagging cross-phase findings. |
| GAP-034 | iter-9 | registry | fixed | [SOURCE: iteration-9-skeptical-review.md:59-61] → [SOURCE: findings-registry.json:118-141] | P2 | Preserve the `adapt` downgrade for F-CROSS-005 unless stronger evidence appears. |
| GAP-035 | iter-9 | registry | partial | [SOURCE: iteration-9-skeptical-review.md:62-63] → [SOURCE: citation-audit-iter-11.json:8-21] | P2 | Replace table-row citations on token-reporting claims with method-section evidence. |
| GAP-036 | iter-9 | registry | partial | [SOURCE: iteration-9-skeptical-review.md:63-64] → [SOURCE: citation-audit-iter-11.json:206-219] | P2 | Re-cite the FTS cascade with runtime fallback evidence, not a one-line Q-C row. |
| GAP-037 | iter-9 | registry | fixed | [SOURCE: iteration-9-skeptical-review.md:64-65] → [SOURCE: archive/v1-v2-diff-iter-18.md:80-81] | P2 | Keep F-CROSS-055’s confidence provisional and evidence-backed. |
| GAP-038 | iter-9 | registry | partial | [SOURCE: iteration-9-skeptical-review.md:65-66] → [SOURCE: citation-audit-iter-11.json:253-266] | P2 | Strip “lanes that matter most” language from cross-phase routing claims. |
| GAP-039 | iter-9 | registry | fixed | [SOURCE: iteration-9-skeptical-review.md:66-67] → [SOURCE: archive/v1-v2-diff-iter-18.md:82-83] | P2 | Keep `ENABLE_TOOL_SEARCH` phrased as upstream evidence, not as live Public proof. |
| GAP-040 | iter-9 | registry | partial | [SOURCE: iteration-9-skeptical-review.md:67-68] → [SOURCE: citation-audit-iter-11.json:390-403] | P2 | De-duplicate F-CROSS-062 against adjacent overlay-packaging findings. |
| GAP-041 | iter-9 | registry | partial | [SOURCE: iteration-9-skeptical-review.md:68-69] → [SOURCE: citation-audit-iter-11.json:406-419] | P2 | Collapse cached-summary overlap between F-CROSS-065 and F-CROSS-046. |
| GAP-042 | iter-9 | recommendations | partial | [SOURCE: iteration-9-skeptical-review.md:74-75] → [SOURCE: recommendations.md:15-23] | P2 | Re-justify R2’s remaining `Depends on: R1` edge or make the policy gate explicit. |
| GAP-043 | iter-9 | recommendations | fixed | [SOURCE: iteration-9-skeptical-review.md:76-77] → [SOURCE: recommendations.md:35-43] | P1 | Keep R4’s activation-scaffold prerequisite explicit. |
| GAP-044 | iter-9 | recommendations | fixed | [SOURCE: iteration-9-skeptical-review.md:77-78] → [SOURCE: recommendations.md:45-53] | P2 | Preserve R5’s evidence split and R10 dependency; do not fall back to one trust scalar. |
| GAP-045 | iter-9 | recommendations | fixed | [SOURCE: iteration-9-skeptical-review.md:78-79] → [SOURCE: recommendations.md:55-63] | P2 | Keep R6 bounded to detector regression as a floor, not a proxy for user quality. |
| GAP-046 | iter-9 | recommendations | fixed | [SOURCE: iteration-9-skeptical-review.md:80-81] → [SOURCE: archive/v1-v2-diff-iter-18.md:104-112] | P2 | Preserve dependency-adjusted ordering language for R8. |
| GAP-047 | iter-9 | recommendations | fixed | [SOURCE: iteration-9-skeptical-review.md:82-82] → [SOURCE: archive/v1-v2-diff-iter-18.md:113-113] | P1 | Keep old R10 retired; replacement R10 is prerequisite contract work, not packaging. |
| GAP-048 | iter-9 | matrix | partial | [SOURCE: iteration-9-skeptical-review.md:90-95] → [SOURCE: research.md:221-232] | P2 | Keep ecosystem leakage and tie-break inferences out of future matrix renders. |
| GAP-049 | iter-11 | citation | fixed | [SOURCE: citation-audit-iter-11.json:54-67] → [SOURCE: iteration-17.md:21-22] | P1 | Preserve the literal-path repair for F-CROSS-064 and spot-check the content claim again. |
| GAP-050 | iter-11 | citation | fixed | [SOURCE: citation-audit-iter-11.json:175-188] → [SOURCE: iteration-17.md:21-22] | P1 | Keep F-CROSS-026 on literal folder paths and correct `source_phase` handling. |
| GAP-051 | iter-11 | citation | fixed | [SOURCE: citation-audit-iter-11.json:222-235] → [SOURCE: iteration-17.md:21-22] | P1 | Keep F-CROSS-005 on literal folder paths and add the intended phase-001 portability lines. |
| GAP-052 | iter-11 | citation | fixed | [SOURCE: citation-audit-iter-11.json:374-387] → [SOURCE: iteration-17.md:21-22] | P1 | Preserve the literal-path repair for F-CROSS-061. |
| GAP-053 | iter-11 | citation | fixed | [SOURCE: citation-audit-iter-11.json:390-403] → [SOURCE: iteration-17.md:21-22] | P1 | Preserve the literal-path repair for F-CROSS-062. |
| GAP-054 | iter-11 | citation | fixed | [SOURCE: citation-audit-iter-11.json:406-419] → [SOURCE: iteration-17.md:21-22] | P1 | Preserve the literal-path repair for F-CROSS-065. |
| GAP-055 | iter-11 | citation | mostly-solid | [SOURCE: citation-audit-iter-11.json:8-21] → [SOURCE: iteration-18.md:15-17] | P2 | Replace F-CROSS-036’s weak Q-C row with Q-A methodology evidence. |
| GAP-056 | iter-11 | citation | mostly-solid | [SOURCE: citation-audit-iter-11.json:206-219] → [SOURCE: iteration-18.md:15-17] | P2 | Replace F-CROSS-045’s weak Q-C row with phase-005 runtime fallback evidence. |
| GAP-057 | iter-11 | citation | mostly-solid | [SOURCE: citation-audit-iter-11.json:253-266] → [SOURCE: iteration-18.md:15-17] | P2 | Re-support F-CROSS-056 with matrix/runtime evidence instead of synthesis-only wording. |
| GAP-058 | iter-12 | combo | weakened | [SOURCE: iteration-12.md:7-12] → [SOURCE: research.md:237-241] | P1 | Only test Combo 1 on frozen resume corpora with freshness and fidelity gates. |
| GAP-059 | iter-12 | combo | falsified | [SOURCE: iteration-12.md:7-12] → [SOURCE: research.md:249-256] | P0 | Keep artifact-default structural packaging blocked until trust axes are separated. |
| GAP-060 | iter-18 | validation | failed | [SOURCE: iteration-18.md:14-17] → [SOURCE: archive/v1-v2-diff-iter-18.md:27-35] | P0 | Retag the over-assigned `new-cross-phase` findings and rerun registry validation. |
| GAP-061 | registry | 001 | partial | [SOURCE: iteration-10.md:11-20] → [SOURCE: findings-registry.json:42-58] | P2 | Keep Q2 open until first-tool latency is measured, not inferred from discoverability. |
| GAP-062 | registry | 001 | UNKNOWN-confirmed | [SOURCE: iteration-10.md:11-20] → [SOURCE: findings-registry.json:61-77] | P1 | Leave Q8 explicitly UNKNOWN unless new chain-level evidence appears. |
| GAP-063 | registry | 001 | partial | [SOURCE: iteration-10.md:11-20] → [SOURCE: findings-registry.json:80-96] | P1 | Close Q9 only after stale-resume costs include remediation overhead. |
| GAP-064 | registry | 001 | partial | [SOURCE: iteration-10.md:11-20] → [SOURCE: findings-registry.json:99-115] | P2 | Resolve the Reddit arithmetic with one auditable denominator narrative. |
| GAP-065 | registry | 002 | partial | [SOURCE: iteration-10.md:11-20] → [SOURCE: findings-registry.json:221-237] | P1 | Add a blast-radius quality corpus or keep false-positive claims qualitative. |
| GAP-066 | registry | 004 | UNKNOWN-confirmed | [SOURCE: iteration-10.md:11-20] → [SOURCE: findings-registry.json:430-447] | P1 | Add behavior-change telemetry before presenting the PreToolUse nudge as effective. |
| GAP-067 | registry | cross | incorrectly-tagged | [SOURCE: findings-registry.json:7-12] → [SOURCE: iteration-18.md:15-17] | P1 | Reclassify moat-style cross findings out of `new-cross-phase` before any reuse. |

### Tag Taxonomy Analysis
The tag problem is narrower than “the v2 conclusions are wrong,” but broader than a cosmetic lint failure. Iter-18’s validation target was `15` `new-cross-phase` findings for the iter-15 patterns plus iter-13 hidden prerequisites, yet the registry carried `31` such tags, leaving `16` excess tags across the 88-finding v2 baseline, or about **18.2%** incorrectly tagged. The current root registry still reports the same `31` `new-cross-phase` tags even after later closeout folding, so the taxonomy defect was never actually retired. [SOURCE: iteration-18.md:15-17] [SOURCE: archive/v1-v2-diff-iter-18.md:27-35] [SOURCE: findings-registry.json:5-20]

The likeliest over-assigned block is the eight iter-13 moat findings, because iter-17 added `4` patterns, `8` moats, and `11` hidden prerequisites, while the validator only budgeted the pattern+prerequisite set. Those moat findings describe existing Public substrate, not discoveries that “emerged only from cross-comparison,” so they should move off `new-cross-phase`. The moat findings that merely re-prove already-shipped Public owners (canonical recovery, five-channel fusion, eval stack, split-topology contract) fit `phase-1-confirmed`; the moat findings that materially deepen the pre-existing baseline with new evidence depth (cross-runtime startup pipeline, constitutional tier/state cognition, governance surfaces, runtime capability staging) fit `phase-1-extended`. [SOURCE: iteration-17.md:21-23] [SOURCE: archive/v1-v2-diff-iter-18.md:51-60] [SOURCE: research.md:297-305]

### Citation Audit Status
All **6/6 broken citations** from iter-11 were fixed at the path-grammar level by iter-17: the assembly pass explicitly normalized broken `phase-N/` literals to `00N-folder/` paths, and iter-18 then validated that no broken literal paths remained. What still remains unverified is not the broken-path set, but the **3 “mostly-solid” findings** whose evidence stayed thin after the repair pass: `F-CROSS-036` (benchmark-honest token reporting), `F-CROSS-045` (runtime FTS capability cascade), and `F-CROSS-056` (Public query leadership / routing claim). Those three need stronger content-level citations even though their file paths now resolve. [SOURCE: citation-audit-iter-11.json:8-21] [SOURCE: citation-audit-iter-11.json:206-219] [SOURCE: citation-audit-iter-11.json:253-266] [SOURCE: iteration-17.md:21-22] [SOURCE: iteration-18.md:15-17]

### Non-Monotonic Convergence Observation
The composite path was non-monotonic by construction, not by noise: `0.94` at iter-7/8 reflected question coverage, iter-9’s skeptical review honestly reset the score to `0.62`, the citation/gap repair lane rebuilt to `0.80`, iter-12’s combo falsification dropped it again to `0.67`, and the Public-inventory plus v2 assembly lane recovered to `0.82`/`0.83` before final validation nudged it back to `0.82`. The score moved whenever a new audit changed what “confidence” meant, so the oscillation signals changing evaluation standards as much as changing evidence volume. [SOURCE: deep-research-state.jsonl:8-21] [SOURCE: archive/v1-v2-diff-iter-18.md:135-156]

That makes the final `0.82` look more like a **provisional local plateau** than a stable convergence floor. The last step did have low `newInfoRatio` (`0.08`), but it also surfaced a still-open blocking defect in the registry taxonomy, and the preceding v2 assembly step was still adding non-trivial new information (`0.29`). One low-info validation pass after a fresh assembly is not enough to call the packet stably converged; it is enough to say the remaining uncertainty is concentrated in deliverable hygiene and recommendation survivability rather than in raw comparative reading. [SOURCE: deep-research-state.jsonl:19-21] [SOURCE: iteration-18.md:14-17] [SOURCE: archive/v1-v2-diff-iter-18.md:179-183]

## Questions Answered
- [ ] Q1: Outstanding gaps — **partially answered** (inventory complete; severity column is candidate-only until iter-3 validates)
- [ ] Q2, Q3, Q4, Q5: unchanged

## Questions Remaining
- [ ] Q2. Convergence quality
- [ ] Q3. Blind spots (beyond gaps already self-identified)
- [ ] Q4. Recommendation survival
- [ ] Q5. Cheapest next research/implementation action

## Next Focus
Iteration 2 — Convergence quality audit (score + evidence + tag taxonomy remediation). Defer severity firming to iter-3.
