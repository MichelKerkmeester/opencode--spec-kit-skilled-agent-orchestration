# Deep Research Strategy - Session Tracking Template

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

Investigate whether the content-routing remediation still solves the packet's original confusion seams after implementation landed, whether the always-on Tier 3 save path fail-opens correctly, whether the updated docs match shipped behavior, and what small follow-on changes would make the abbreviated-fragment story defensibly exceed 95%.

### Usage

- Init: seed the topic, packet-local research questions, and read-only boundaries from the packet spec.
- Per iteration: read the current focus, inspect code and runtime evidence, write one iteration artifact, append one JSONL record, then let the reducer refresh the machine-owned sections.
- Synthesis target: produce a post-implementation verification verdict covering benchmark deltas, Tier 3 runtime wiring, doc parity, prototype separation, and any remaining path to 95%+ short-fragment robustness.

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:topic -->
## 2. TOPIC
Content routing classification accuracy and remediation design

---

<!-- /ANCHOR:topic -->
<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] RQ-1: What is the classification accuracy of Tier1 hard rules? Which of the 7 rules fire most often, and do any produce false positives?
- [x] RQ-2: What is the Tier1->Tier2 escalation rate? What types of content trigger escalation (top1 below threshold, narrow margin, mixed signals)?
- [x] RQ-3: What are the confusion pairs between categories? (for example, does `narrative_progress` get confused with `task_update`?)
- [x] RQ-4: Are the 0.70/0.70/0.50 thresholds optimal, or would different values reduce escalation without losing accuracy?
- [x] RQ-5: What merge modes succeed vs fail for each category? Are there categories where the default merge mode is wrong?
- [x] RQ-6: How does the `routeAs` override interact with natural classification? Does override produce better or worse outcomes?
- [x] RQ-7: Which exact delivery-versus-progress cues cause the current misclassifications, and what delivery lexicon should be added?
- [x] RQ-8: Which handover patterns are currently pulled into `drop`, and how should the drop heuristic be relaxed?
- [x] RQ-9: What exact code is missing to wire Tier3 into `memory-save.ts`, and what latency or cost envelope does that imply?
- [x] RQ-10: Are the Tier2 prototype vectors well distributed across categories, especially at the delivery/progress and handover/drop boundaries?
- [x] RQ-11: Which routing categories and edge cases lack meaningful regression coverage today?
- [x] RQ-12: How did the post-implementation benchmark change, and what confusion pairs remain after the cue and prototype fixes?
- [x] RQ-13: Does the always-on Tier3 save path now route end to end with correct fail-open behavior?
- [x] RQ-14: Do `save.md`, `SKILL.md`, and `save_workflow.md` match the shipped router behavior line by line?
- [x] RQ-15: Are the refreshed prototypes actually well separated in embedding space after the targeted edits?
- [x] RQ-16: What is the smallest follow-on work that would make the abbreviated-fragment story credibly exceed 95%?

<!-- /ANCHOR:key-questions -->
<!-- ANCHOR:non-goals -->
## 4. NON-GOALS
- No source edits to router, handler, merge, validation, or tests.
- No historical memory-save corpus reconstruction.
- No packet-wide documentation refactor outside `research/`.

---

<!-- /ANCHOR:non-goals -->
<!-- ANCHOR:stop-conditions -->
## 5. STOP CONDITIONS
- The pre-implementation accuracy and remediation questions stay answered with code-backed evidence.
- The post-implementation benchmark produces a defensible accuracy verdict, including an explicit caveat about what part of the old corpus is exactly reproducible.
- The always-on Tier3 path is traced through the live save handler and verified with targeted tests, including fail-open behavior.
- The canonical save docs either match shipped router behavior or any drift is called out precisely.
- The remaining path to 95%+ is concrete enough to hand directly to a small follow-on routing pass.

---

<!-- /ANCHOR:stop-conditions -->
<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- RQ-1: What is the classification accuracy of Tier1 hard rules? Which of the 7 rules fire most often, and do any produce false positives?
- RQ-2: What is the Tier1->Tier2 escalation rate? What types of content trigger escalation (top1 below threshold, narrow margin, mixed signals)?
- RQ-3: What are the confusion pairs between categories? (for example, does `narrative_progress` get confused with `task_update`?)
- RQ-4: Are the 0.70/0.70/0.50 thresholds optimal, or would different values reduce escalation without losing accuracy?
- RQ-5: What merge modes succeed vs fail for each category? Are there categories where the default merge mode is wrong?
- RQ-6: How does the `routeAs` override interact with natural classification? Does override produce better or worse outcomes?
- RQ-7: Which exact delivery-versus-progress cues cause the current misclassifications, and what delivery lexicon should be added?
- RQ-8: Which handover patterns are currently pulled into `drop`, and how should the drop heuristic be relaxed?
- RQ-9: What exact code is missing to wire Tier3 into `memory-save.ts`, and what latency or cost envelope does that imply?
- RQ-10: Are the Tier2 prototype vectors well distributed across categories, especially at the delivery/progress and handover/drop boundaries?
- RQ-11: Which routing categories and edge cases lack meaningful regression coverage today?
- RQ-12: How did the post-implementation benchmark change, and what confusion pairs remain after the cue and prototype fixes?
- RQ-13: Does the always-on Tier3 save path now route end to end with correct fail-open behavior?
- RQ-14: Do `save.md`, `SKILL.md`, and `save_workflow.md` match the shipped router behavior line by line?
- RQ-15: Are the refreshed prototypes actually well separated in embedding space after the targeted edits?
- RQ-16: What is the smallest follow-on work that would make the abbreviated-fragment story credibly exceed 95%?

<!-- /ANCHOR:answered-questions -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- Direct source inspection worked because the constants, rule library, and tests are all explicit and colocated. (iteration 1)
- Reading the cue table beside the target builder made it easy to see which mistakes would be classification errors versus merge-target errors. (iteration 2)
- Tracing the production callsite answered the runtime-versus-contract question much faster than speculating from prompt constants. (iteration 3)
- The decision function and trigger helper are compact enough that static inspection plus one runtime probe gave a full escalation model. (iteration 4)
- Measuring the live router against the shipped prototype library created an auditable synthetic corpus without inventing an external labeling scheme. (iteration 5)
- Concrete misclassification examples made it obvious which cues are over- or under-weighted. (iteration 6)
- Reading `buildCanonicalMergePayload()` alongside `buildTarget()` exposed which routing categories are logically easy versus operationally fragile. (iteration 7)
- The legality validator and merge operation complement each other, so reading both produced a reliable failure map. (iteration 8)
- Simulating threshold changes on recorded Tier1/Tier2 outputs made the tradeoff visible without pretending Tier3 is live when it is not. (iteration 9)
- Combining static code reading with a measured synthetic corpus avoided overfitting to either tests or speculation. (iteration 10)
- Reading the regex table beside the score floors made it obvious that delivery is under-specified in two separate places. (iteration 11)
- A lightweight token-overlap pass was enough to show that the corpus itself reinforces the ambiguity the heuristics struggle with. (iteration 12)
- Reading the score floors and the trigger-reason ladder together made the `drop` dominance obvious. (iteration 13)
- Prototype nearest-neighbor checks exposed a corpus-shape problem that the regex audit alone could not prove. (iteration 14)
- Searching for production references to the Tier3 contract quickly separated test-only behavior from runtime reality. (iteration 15)
- The latency budget and caching behavior are explicit enough in code to make a bounded operational estimate without live provider calls. (iteration 16)
- Looking at negative-hint frequencies and category-specific vocabulary clarified that the problem is concentrated, not widespread. (iteration 17)
- Reading router and handler tests side by side exposed the gap between contract coverage and save-path coverage. (iteration 18)
- Mapping each phase spec directly onto the exact lines and fixtures kept the guidance concrete. (iteration 19)
- The second wave stayed tightly scoped to fix design, so every iteration produced directly actionable implementation guidance. (iteration 20)
- Reading the live floors and the delivery prototypes side by side was enough to turn a vague "cue asymmetry" diagnosis into exact regex candidates. (iteration 21)
- Matching individual handover prototype sentences against the live drop regex separated the hard heuristic problem from the softer Tier 2 overlap. (iteration 22)
- Treating the fetch helper and the router dependency interface as templates made the missing wiring work easy to size without touching production code. (iteration 23)
- A direct coverage audit answered the zero-coverage question quickly and prevented another round of vague "tests are thin" language. (iteration 24)
- The final pass stayed focused on exact change surfaces, so it converged quickly instead of reopening settled debates. (iteration 25)
- Replaying the preserved subset kept the post-implementation comparison honest without mixing in the Tier 3 save-path change. (iteration 26)
- Explicitly splitting preserved versus reconstructed evidence kept the benchmark claims defensible. (iteration 27)
- Reading the handler seam and the router fallback logic together made the new runtime contract obvious without any code edits. (iteration 28)
- Narrowing the test run to the routing assertions answered the packet question without repo-wide test noise. (iteration 29)
- The docs are concise enough that a line-by-line read against the code surfaces parity quickly. (iteration 30)
- The workflow reference preserves the same conceptual chunks as the operator docs, so parity checking was fast once the code trace was already in hand. (iteration 31)
- A simple lexical-vector pass was enough to quantify whether the prototype library really spread the categories apart. (iteration 32)
- Nearest-neighbor inspection exposed the real prototype hotspots more clearly than centroid averages alone. (iteration 33)
- Pulling the benchmark, runtime, docs, and prototype signals together made the remaining scope much smaller and more honest. (iteration 34)
- The post-implementation wave answered the right follow-up questions instead of simply restating the pre-implementation research. (iteration 35)
- Replaying the exact preserved subset gave a direct apples-to-apples answer for the user’s post-fix verification ask. (iteration 36)
- The distilled identity probe was enough to prove the fix shape without widening into the noisy full handler suite. (iteration 37)
- A narrow final sweep answered the user’s “look for remaining edge cases” request without reopening settled packet history. (iteration 38)

<!-- /ANCHOR:what-worked -->
<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- Relying on the spec wording did not work because the packet question text has already drifted from the implementation. (iteration 1)
- Prototype labels alone were not enough; the negative hints and example phrasing matter for understanding likely confusions. (iteration 2)
- Reading tests first would have overstated Tier3 importance because the tests intentionally exercise injected behavior the live handler does not yet use. (iteration 3)
- It is easy to overread `manual_retry`; the name sounds like escalation even when the flow never leaves Tier1. (iteration 4)
- Looking only at overall accuracy hides the real hotspots, because the strong structured categories mask weaker delivery and handover performance. (iteration 5)
- Category-level averages were too coarse to explain why handover and delivery underperform. (iteration 6)
- Looking only at the router API hid the fact that one category name can fan out into very different payload requirements by packet level. (iteration 7)
- Router target selection alone could not explain write failures because several rejections happen after routing. (iteration 8)
- A single "best" threshold point is misleading because the accuracy gain is category-specific and comes with extra refusals. (iteration 9)
- Threshold tuning alone could not solve the category-specific cue collisions that dominate the remaining errors. (iteration 10)
- Prototype labels alone hid the real issue because the live heuristics never read those labels. (iteration 11)
- Prototype count balance obscured the fact that the actual wording clusters together. (iteration 12)
- Looking only at the cue text missed how the numeric floor prevents later recovery. (iteration 13)
- Prototype labels such as "handover" or "drop" were not meaningful enough by themselves; the actual chunk text carried the overlap. (iteration 14)
- The existing phase spec understates the amount of missing plumbing because it only names the call site and the router, not the absent client implementation. (iteration 15)
- The current code does not expose real ambiguous-call counts, so the exact production hit rate remains unmeasured. (iteration 16)
- Prototype counts initially made the library look healthier than it is. (iteration 17)
- Category happy-path tests created a false sense of completeness because the fragile boundary cases live outside those samples. (iteration 18)
- The original phase specs were accurate at the theme level but too compressed to drive implementation without this extra pass. (iteration 19)
- The research packet did not start with explicit remediation questions, which forced the second wave to retrofit them after the first synthesis. (iteration 20)
- Counting prototype overlap without tracing the floor logic still understated why progress wins in practice. (iteration 21)
- Looking only at the heuristic tables would have missed the resume-command overlap living in the prototype corpus. (iteration 22)
- Looking only at `memory-save.ts:1008` still underestimates the missing cache and env-contract work. (iteration 23)
- Category-name counting alone would have overstated confidence because the missing cases are boundary-shaped, not absence-shaped. (iteration 24)
- The earlier synthesis was still a little too high-level for direct patch authoring, which is why this convergence pass was worth doing. (iteration 25)
- The earlier compact-variant generator was not preserved as an artifact, so only the full, first-sentence, and test-style slices are strictly reproducible. (iteration 26)
- The compact-only replay is too sensitive to reconstruction choices to serve as a hard before-after metric. (iteration 27)
- Looking at the router alone would have missed the now-unconditional handler entrypoint. (iteration 28)
- The broader handler suite mixes routing work with separate atomic-save rollback and concurrency scenarios. (iteration 29)
- The save docs do not preserve every low-level threshold detail, so code still has to be the authority for exact acceptance behavior. (iteration 30)
- Environmental wording is easy to overread as a hard runtime guarantee when the code intentionally fail-opens instead. (iteration 31)
- Counts and labels still hide how much shared narrative vocabulary the categories retain. (iteration 32)
- Prototype distance by itself cannot tell whether the live router now compensates correctly for the remaining overlap. (iteration 33)
- It is tempting to treat any remaining error as proof that the original seams still need work, but the residual categories have shifted. (iteration 34)
- The original compact-generator gap prevents one neat single-number story across all 132 prior samples. (iteration 35)
- Looking only at raw category equality would have hidden the fact that `DR-05-s1` still fails as a refusal-floor miss. (iteration 36)
- Full end-to-end handler execution would have added unrelated database and suite noise for a question that was really about routed identity. (iteration 37)
- Historical review artifacts still contain now-stale wording, so broad repository sweeps are noisy unless scoped to active operator-facing surfaces. (iteration 38)

<!-- /ANCHOR:what-failed -->
<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### Assuming `manual_retry` means a forced escalation. In code it is the neutral/default reason after a non-blocked Tier1 result. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Assuming `manual_retry` means a forced escalation. In code it is the neutral/default reason after a non-blocked Tier1 result.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Assuming `manual_retry` means a forced escalation. In code it is the neutral/default reason after a non-blocked Tier1 result.

### Assuming `routeAs` makes any classified chunk merge-safe regardless of target and merge-mode validity. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Assuming `routeAs` makes any classified chunk merge-safe regardless of target and merge-mode validity.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Assuming `routeAs` makes any classified chunk merge-safe regardless of target and merge-mode validity.

### Assuming a reusable production `RouterCache` already exists and phase `003` only needs to pass it through. -- BLOCKED (iteration 23, 1 attempts)
- What was tried: Assuming a reusable production `RouterCache` already exists and phase `003` only needs to pass it through.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Assuming a reusable production `RouterCache` already exists and phase `003` only needs to pass it through.

### Assuming balanced prototype counts are enough to prevent confusion in Tier2. -- BLOCKED (iteration 12, 1 attempts)
- What was tried: Assuming balanced prototype counts are enough to prevent confusion in Tier2.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Assuming balanced prototype counts are enough to prevent confusion in Tier2.

### Assuming hard rules are the dominant driver of routing quality. On this corpus they are precise but relatively rare. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Assuming hard rules are the dominant driver of routing quality. On this corpus they are precise but relatively rare.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Assuming hard rules are the dominant driver of routing quality. On this corpus they are precise but relatively rare.

### Assuming merge safety is fully captured by the router's category-to-target map. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Assuming merge safety is fully captured by the router's category-to-target map.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Assuming merge safety is fully captured by the router's category-to-target map.

### Assuming metadata-only and task updates share the same failure profile because both report `update-in-place`. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Assuming metadata-only and task updates share the same failure profile because both report `update-in-place`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Assuming metadata-only and task updates share the same failure profile because both report `update-in-place`.

### Assuming that always-on Tier 3 makes every canonical save network-dependent. -- BLOCKED (iteration 28, 1 attempts)
- What was tried: Assuming that always-on Tier 3 makes every canonical save network-dependent.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Assuming that always-on Tier 3 makes every canonical save network-dependent.

### Assuming the current 2-second timeout is automatically safe for arbitrarily long routed save bodies. -- BLOCKED (iteration 16, 1 attempts)
- What was tried: Assuming the current 2-second timeout is automatically safe for arbitrarily long routed save bodies.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Assuming the current 2-second timeout is automatically safe for arbitrarily long routed save bodies.

### Assuming the prototype library is sparse or skewed toward one category. It is balanced by count. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Assuming the prototype library is sparse or skewed toward one category. It is balanced by count.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Assuming the prototype library is sparse or skewed toward one category. It is balanced by count.

### Assuming there is already a hidden production caller for `buildTier3Prompt()`. -- BLOCKED (iteration 15, 1 attempts)
- What was tried: Assuming there is already a hidden production caller for `buildTier3Prompt()`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Assuming there is already a hidden production caller for `buildTier3Prompt()`.

### Blaming delivery and handover failures on Tier2. In the key examples, Tier2 preferred the expected class but never got a chance because Tier1 accepted early or `drop` cues dominated. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Blaming delivery and handover failures on Tier2. In the key examples, Tier2 preferred the expected class but never got a chance because Tier1 accepted early or `drop` cues dominated.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Blaming delivery and handover failures on Tier2. In the key examples, Tier2 preferred the expected class but never got a chance because Tier1 accepted early or `drop` cues dominated.

### Continuing the research loop again before deciding whether short-fragment robustness is worth another targeted code pass. -- BLOCKED (iteration 35, 1 attempts)
- What was tried: Continuing the research loop again before deciding whether short-fragment robustness is worth another targeted code pass.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Continuing the research loop again before deciding whether short-fragment robustness is worth another targeted code pass.

### Continuing the research loop instead of handing the packet back to implementation. -- BLOCKED (iteration 25, 1 attempts)
- What was tried: Continuing the research loop instead of handing the packet back to implementation.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Continuing the research loop instead of handing the packet back to implementation.

### Counting `DR-05-s1` as a clean pass because the category stays `drop` even though it still refuses below the floor. -- BLOCKED (iteration 36, 1 attempts)
- What was tried: Counting `DR-05-s1` as a clean pass because the category stays `drop` even though it still refuses below the floor.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Counting `DR-05-s1` as a clean pass because the category stays `drop` even though it still refuses below the floor.

### Deferring the regression tests until after the cue/prototype fixes land. -- BLOCKED (iteration 19, 1 attempts)
- What was tried: Deferring the regression tests until after the cue/prototype fixes land.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Deferring the regression tests until after the cue/prototype fixes land.

### Expecting `negativeHints` to already act as a live penalty signal. -- BLOCKED (iteration 12, 1 attempts)
- What was tried: Expecting `negativeHints` to already act as a live penalty signal.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Expecting `negativeHints` to already act as a live penalty signal.

### Expecting another research pass to change the phase order or revive threshold tuning as the primary fix. -- BLOCKED (iteration 25, 1 attempts)
- What was tried: Expecting another research pass to change the phase order or revive threshold tuning as the primary fix.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Expecting another research pass to change the phase order or revive threshold tuning as the primary fix.

### Expecting prototype refreshes alone to remove the need for heuristic boundary rules in the narrative categories. -- BLOCKED (iteration 33, 1 attempts)
- What was tried: Expecting prototype refreshes alone to remove the need for heuristic boundary rules in the narrative categories.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Expecting prototype refreshes alone to remove the need for heuristic boundary rules in the narrative categories.

### Historical save-log mining. The packet scope and current memory model explicitly require synthetic payloads instead. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Historical save-log mining. The packet scope and current memory model explicitly require synthetic payloads instead.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Historical save-log mining. The packet scope and current memory model explicitly require synthetic payloads instead.

### Keeping `git diff` in the same severity class as transcript wrappers and table-of-contents scaffolding. -- BLOCKED (iteration 13, 1 attempts)
- What was tried: Keeping `git diff` in the same severity class as transcript wrappers and table-of-contents scaffolding.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Keeping `git diff` in the same severity class as transcript wrappers and table-of-contents scaffolding.

### Looking for a hidden `classifyWithTier3` injection elsewhere in the non-test server code. The only production callsite creates the router without one. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Looking for a hidden `classifyWithTier3` injection elsewhere in the non-test server code. The only production callsite creates the router without one.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a hidden `classifyWithTier3` injection elsewhere in the non-test server code. The only production callsite creates the router without one.

### Looking for a missing category or stale Tier 3 flag claim in the primary save docs after the doc-alignment phase was already shipped. -- BLOCKED (iteration 30, 1 attempts)
- What was tried: Looking for a missing category or stale Tier 3 flag claim in the primary save docs after the doc-alignment phase was already shipped.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a missing category or stale Tier 3 flag claim in the primary save docs after the doc-alignment phase was already shipped.

### Looking for a new same-path identity collision after the fix; the helper now resolves continuity identity onto the canonical host doc and anchor explicitly. -- BLOCKED (iteration 37, 1 attempts)
- What was tried: Looking for a new same-path identity collision after the fix; the helper now resolves continuity identity onto the canonical host doc and anchor explicitly.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a new same-path identity collision after the fix; the helper now resolves continuity identity onto the canonical host doc and anchor explicitly.

### Looking for a routing category that is completely absent from `content-router.vitest.ts`. -- BLOCKED (iteration 24, 1 attempts)
- What was tried: Looking for a routing category that is completely absent from `content-router.vitest.ts`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a routing category that is completely absent from `content-router.vitest.ts`.

### Looking for a second hidden doc drift after the save docs already agree on categories, tiers, boundaries, and context rules. -- BLOCKED (iteration 31, 1 attempts)
- What was tried: Looking for a second hidden doc drift after the save docs already agree on categories, tiers, boundaries, and context rules.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a second hidden doc drift after the save docs already agree on categories, tiers, boundaries, and context rules.

### Looking for the old delivery and handover confusion pairs in the preserved replay after the implemented cue and prototype changes. -- BLOCKED (iteration 26, 1 attempts)
- What was tried: Looking for the old delivery and handover confusion pairs in the preserved replay after the implemented cue and prototype changes.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for the old delivery and handover confusion pairs in the preserved replay after the implemented cue and prototype changes.

### Looking only at `RULE_CUES` without tracing the extra progress floor in `scoreCategories()`. -- BLOCKED (iteration 11, 1 attempts)
- What was tried: Looking only at `RULE_CUES` without tracing the extra progress floor in `scoreCategories()`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking only at `RULE_CUES` without tracing the extra progress floor in `scoreCategories()`.

### Looking only at router tests and ignoring the handler path where Tier3 would actually be wired. -- BLOCKED (iteration 18, 1 attempts)
- What was tried: Looking only at router tests and ignoring the handler path where Tier3 would actually be wired.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking only at router tests and ignoring the handler path where Tier3 would actually be wired.

### Making accuracy claims from prototype count balance alone. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Making accuracy claims from prototype count balance alone.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Making accuracy claims from prototype count balance alone.

### Opening a new remediation phase for the `metadata_only` fix itself. -- BLOCKED (iteration 38, 1 attempts)
- What was tried: Opening a new remediation phase for the `metadata_only` fix itself.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Opening a new remediation phase for the `metadata_only` fix itself.

### Rebuilding the entire prototype library as the first remediation step. -- BLOCKED (iteration 17, 1 attempts)
- What was tried: Rebuilding the entire prototype library as the first remediation step.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Rebuilding the entire prototype library as the first remediation step.

### Recommending a blanket threshold increase as an unqualified improvement. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Recommending a blanket threshold increase as an unqualified improvement.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Recommending a blanket threshold increase as an unqualified improvement.

### Removing all command language from handover guidance. Real handover notes legitimately contain commands; the fix is to demote the soft ones, not ban them. -- BLOCKED (iteration 22, 1 attempts)
- What was tried: Removing all command language from handover guidance. Real handover notes legitimately contain commands; the fix is to demote the soft ones, not ban them.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Removing all command language from handover guidance. Real handover notes legitimately contain commands; the fix is to demote the soft ones, not ban them.

### Reopening the delivery/progress or handover/drop remediation plan as the primary next step. -- BLOCKED (iteration 34, 1 attempts)
- What was tried: Reopening the delivery/progress or handover/drop remediation plan as the primary next step.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reopening the delivery/progress or handover/drop remediation plan as the primary next step.

### Reopening the threshold debate as the primary path forward before the cue, prototype, and test fixes land. -- BLOCKED (iteration 20, 1 attempts)
- What was tried: Reopening the threshold debate as the primary path forward before the cue, prototype, and test fixes land.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reopening the threshold debate as the primary path forward before the cue, prototype, and test fixes land.

### Rewriting the drop corpus as the main fix for handover/drop confusion. -- BLOCKED (iteration 14, 1 attempts)
- What was tried: Rewriting the drop corpus as the main fix for handover/drop confusion.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Rewriting the drop corpus as the main fix for handover/drop confusion.

### Searching for a fifth hidden escalation reason. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Searching for a fifth hidden escalation reason.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Searching for a fifth hidden escalation reason.

### Shipping a threshold-only fix as the sole remediation. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Shipping a threshold-only fix as the sole remediation.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Shipping a threshold-only fix as the sole remediation.

### Solving delivery confusion by adding one more rollout noun while leaving the current progress floor unconditional. -- BLOCKED (iteration 21, 1 attempts)
- What was tried: Solving delivery confusion by adding one more rollout noun while leaving the current progress floor unconditional.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Solving delivery confusion by adding one more rollout noun while leaving the current progress floor unconditional.

### Treating `append-section` and `update-in-place` as equally tolerant operations. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Treating `append-section` and `update-in-place` as equally tolerant operations.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating `append-section` and `update-in-place` as equally tolerant operations.

### Treating `same-pass` as sufficient by itself. The overlap spans sequencing, pending-until-verification language, and synchronized-surface wording. -- BLOCKED (iteration 21, 1 attempts)
- What was tried: Treating `same-pass` as sufficient by itself. The overlap spans sequencing, pending-until-verification language, and synchronized-surface wording.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating `same-pass` as sufficient by itself. The overlap spans sequencing, pending-until-verification language, and synchronized-surface wording.

### Treating a missing exact compact-generator replay as a blocker to drawing a useful post-implementation verdict. -- BLOCKED (iteration 35, 1 attempts)
- What was tried: Treating a missing exact compact-generator replay as a blocker to drawing a useful post-implementation verdict.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating a missing exact compact-generator replay as a blocker to drawing a useful post-implementation verdict.

### Treating all categories as equally safe once the router selects a target doc. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Treating all categories as equally safe once the router selects a target doc.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating all categories as equally safe once the router selects a target doc.

### Treating category presence as equivalent to meaningful regression coverage. -- BLOCKED (iteration 24, 1 attempts)
- What was tried: Treating category presence as equivalent to meaningful regression coverage.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating category presence as equivalent to meaningful regression coverage.

### Treating centroid distance alone as a proxy for live routed accuracy. -- BLOCKED (iteration 32, 1 attempts)
- What was tried: Treating centroid distance alone as a proxy for live routed accuracy.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating centroid distance alone as a proxy for live routed accuracy.

### Treating command-first handover prose as harmless prototype decoration. -- BLOCKED (iteration 14, 1 attempts)
- What was tried: Treating command-first handover prose as harmless prototype decoration.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating command-first handover prose as harmless prototype decoration.

### Treating delivery confusion as a prototype-only issue. The heuristic floor in `scoreCategories()` is part of the bug. -- BLOCKED (iteration 11, 1 attempts)
- What was tried: Treating delivery confusion as a prototype-only issue. The heuristic floor in `scoreCategories()` is part of the bug.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating delivery confusion as a prototype-only issue. The heuristic floor in `scoreCategories()` is part of the bug.

### Treating documentation parity as the missing ingredient in the residual accuracy story. -- BLOCKED (iteration 34, 1 attempts)
- What was tried: Treating documentation parity as the missing ingredient in the residual accuracy story.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating documentation parity as the missing ingredient in the residual accuracy story.

### Treating every command mention inside a handover chunk as proof that the content is generic operator boilerplate. -- BLOCKED (iteration 13, 1 attempts)
- What was tried: Treating every command mention inside a handover chunk as proof that the content is generic operator boilerplate.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating every command mention inside a handover chunk as proof that the content is generic operator boilerplate.

### Treating F7 as a hidden fix for the `research_finding` versus `metadata_only` classification seam. -- BLOCKED (iteration 37, 1 attempts)
- What was tried: Treating F7 as a hidden fix for the `research_finding` versus `metadata_only` classification seam.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating F7 as a hidden fix for the `research_finding` versus `metadata_only` classification seam.

### Treating historical packet-doc flag mentions as evidence of an active documentation regression in the shipped save surfaces. -- BLOCKED (iteration 38, 1 attempts)
- What was tried: Treating historical packet-doc flag mentions as evidence of an active documentation regression in the shipped save surfaces.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating historical packet-doc flag mentions as evidence of an active documentation regression in the shipped save surfaces.

### Treating phase `003` as a one-line constructor tweak in `memory-save.ts`. -- BLOCKED (iteration 15, 1 attempts)
- What was tried: Treating phase `003` as a one-line constructor tweak in `memory-save.ts`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating phase `003` as a one-line constructor tweak in `memory-save.ts`.

### Treating phase-anchor inference as the main handover failure driver. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Treating phase-anchor inference as the main handover failure driver.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating phase-anchor inference as the main handover failure driver.

### Treating resume-command language as the same thing as transcript or wrapper boilerplate. -- BLOCKED (iteration 22, 1 attempts)
- What was tried: Treating resume-command language as the same thing as transcript or wrapper boilerplate.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating resume-command language as the same thing as transcript or wrapper boilerplate.

### Treating the `metadata_only` target fix as a silent routing-accuracy change. -- BLOCKED (iteration 36, 1 attempts)
- What was tried: Treating the `metadata_only` target fix as a silent routing-accuracy change.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the `metadata_only` target fix as a silent routing-accuracy change.

### Treating the absence of the original compact-variant generator as a reason to skip post-implementation benchmarking. -- BLOCKED (iteration 26, 1 attempts)
- What was tried: Treating the absence of the original compact-variant generator as a reason to skip post-implementation benchmarking.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the absence of the original compact-variant generator as a reason to skip post-implementation benchmarking.

### Treating the current test suite as sufficient because every category already has one positive-path assertion. -- BLOCKED (iteration 18, 1 attempts)
- What was tried: Treating the current test suite as sufficient because every category already has one positive-path assertion.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the current test suite as sufficient because every category already has one positive-path assertion.

### Treating the currently unwired Tier3 contract as the main source of routing inaccuracy. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Treating the currently unwired Tier3 contract as the main source of routing inaccuracy.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the currently unwired Tier3 contract as the main source of routing inaccuracy.

### Treating the endpoint-availability wording nuance as a substantive documentation mismatch. -- BLOCKED (iteration 31, 1 attempts)
- What was tried: Treating the endpoint-availability wording nuance as a substantive documentation mismatch.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the endpoint-availability wording nuance as a substantive documentation mismatch.

### Treating the env contract choice as free. Reuse-versus-new-env naming is a real scope decision inside the wiring phase. -- BLOCKED (iteration 23, 1 attempts)
- What was tried: Treating the env contract choice as free. Reuse-versus-new-env naming is a real scope decision inside the wiring phase.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the env contract choice as free. Reuse-versus-new-env naming is a real scope decision inside the wiring phase.

### Treating the handler change as proof that Tier 3 necessarily decides every routed save. -- BLOCKED (iteration 28, 1 attempts)
- What was tried: Treating the handler change as proof that Tier 3 necessarily decides every routed save.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the handler change as proof that Tier 3 necessarily decides every routed save.

### Treating the implementation phases as independent. The code and test changes need to move together. -- BLOCKED (iteration 19, 1 attempts)
- What was tried: Treating the implementation phases as independent. The code and test changes need to move together.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the implementation phases as independent. The code and test changes need to move together.

### Treating the packet as still documentation-drifted just because earlier research was written before implementation landed. -- BLOCKED (iteration 30, 1 attempts)
- What was tried: Treating the packet as still documentation-drifted just because earlier research was written before implementation landed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the packet as still documentation-drifted just because earlier research was written before implementation landed.

### Treating the reconstructed compact replay as a strict substitute for the earlier 132-sample benchmark. -- BLOCKED (iteration 27, 1 attempts)
- What was tried: Treating the reconstructed compact replay as a strict substitute for the earlier 132-sample benchmark.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the reconstructed compact replay as a strict substitute for the earlier 132-sample benchmark.

### Treating the refreshed hotspot prototypes as still behaviorally broken just because their embeddings remain close. -- BLOCKED (iteration 33, 1 attempts)
- What was tried: Treating the refreshed hotspot prototypes as still behaviorally broken just because their embeddings remain close.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the refreshed hotspot prototypes as still behaviorally broken just because their embeddings remain close.

### Treating the routing-only Tier 3 tests as redundant now that the handler wiring exists in code. -- BLOCKED (iteration 29, 1 attempts)
- What was tried: Treating the routing-only Tier 3 tests as redundant now that the handler wiring exists in code.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the routing-only Tier 3 tests as redundant now that the handler wiring exists in code.

### Treating the spec's "7 rules" text as authoritative. The code clearly ships eight hard rules today. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Treating the spec's "7 rules" text as authoritative. The code clearly ships eight hard rules today.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the spec's "7 rules" text as authoritative. The code clearly ships eight hard rules today.

### Treating the Tier3 prompt as active production behavior in the current canonical save path. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Treating the Tier3 prompt as active production behavior in the current canonical save path.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the Tier3 prompt as active production behavior in the current canonical save path.

### Treating Tier2 as independent from target selection. The prototype scorer still inherits the same `buildTarget()` mapping as Tier1 and Tier3. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Treating Tier2 as independent from target selection. The prototype scorer still inherits the same `buildTarget()` mapping as Tier1 and Tier3.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating Tier2 as independent from target selection. The prototype scorer still inherits the same `buildTarget()` mapping as Tier1 and Tier3.

### Treating Tier3 cost as the main blocker before measuring the ambiguous-call rate. -- BLOCKED (iteration 16, 1 attempts)
- What was tried: Treating Tier3 cost as the main blocker before measuring the ambiguous-call rate.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating Tier3 cost as the main blocker before measuring the ambiguous-call rate.

### Treating Tier3 wiring as the fix for delivery/progress and handover/drop by itself. -- BLOCKED (iteration 20, 1 attempts)
- What was tried: Treating Tier3 wiring as the fix for delivery/progress and handover/drop by itself.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating Tier3 wiring as the fix for delivery/progress and handover/drop by itself.

### Trying to infer the exact earlier compact-variant generator from the current packet state alone. -- BLOCKED (iteration 27, 1 attempts)
- What was tried: Trying to infer the exact earlier compact-variant generator from the current packet state alone.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Trying to infer the exact earlier compact-variant generator from the current packet state alone.

### Using balanced prototype counts as proof that the refreshed corpus is now semantically well separated. -- BLOCKED (iteration 32, 1 attempts)
- What was tried: Using balanced prototype counts as proof that the refreshed corpus is now semantically well separated.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Using balanced prototype counts as proof that the refreshed corpus is now semantically well separated.

### Using prototype count balance as a proxy for semantic separation. -- BLOCKED (iteration 17, 1 attempts)
- What was tried: Using prototype count balance as a proxy for semantic separation.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Using prototype count balance as a proxy for semantic separation.

### Using the full handler suite as the primary signal for this question when unrelated atomic-save failure-injection tests still fail elsewhere in the file. -- BLOCKED (iteration 29, 1 attempts)
- What was tried: Using the full handler suite as the primary signal for this question when unrelated atomic-save failure-injection tests still fail elsewhere in the file.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Using the full handler suite as the primary signal for this question when unrelated atomic-save failure-injection tests still fail elsewhere in the file.

<!-- /ANCHOR:exhausted-approaches -->
<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- Historical save-log mining. The packet scope and current memory model explicitly require synthetic payloads instead. (iteration 1)
- Treating the spec's "7 rules" text as authoritative. The code clearly ships eight hard rules today. (iteration 1)
- Assuming the prototype library is sparse or skewed toward one category. It is balanced by count. (iteration 2)
- Treating Tier2 as independent from target selection. The prototype scorer still inherits the same `buildTarget()` mapping as Tier1 and Tier3. (iteration 2)
- Looking for a hidden `classifyWithTier3` injection elsewhere in the non-test server code. The only production callsite creates the router without one. (iteration 3)
- Treating the Tier3 prompt as active production behavior in the current canonical save path. (iteration 3)
- Assuming `manual_retry` means a forced escalation. In code it is the neutral/default reason after a non-blocked Tier1 result. (iteration 4)
- Searching for a fifth hidden escalation reason. (iteration 4)
- Assuming hard rules are the dominant driver of routing quality. On this corpus they are precise but relatively rare. (iteration 5)
- Making accuracy claims from prototype count balance alone. (iteration 5)
- Blaming delivery and handover failures on Tier2. In the key examples, Tier2 preferred the expected class but never got a chance because Tier1 accepted early or `drop` cues dominated. (iteration 6)
- Treating phase-anchor inference as the main handover failure driver. (iteration 6)
- Assuming metadata-only and task updates share the same failure profile because both report `update-in-place`. (iteration 7)
- Treating all categories as equally safe once the router selects a target doc. (iteration 7)
- Assuming merge safety is fully captured by the router's category-to-target map. (iteration 8)
- Treating `append-section` and `update-in-place` as equally tolerant operations. (iteration 8)
- Assuming `routeAs` makes any classified chunk merge-safe regardless of target and merge-mode validity. (iteration 9)
- Recommending a blanket threshold increase as an unqualified improvement. (iteration 9)
- Shipping a threshold-only fix as the sole remediation. (iteration 10)
- Treating the currently unwired Tier3 contract as the main source of routing inaccuracy. (iteration 10)
- Looking only at `RULE_CUES` without tracing the extra progress floor in `scoreCategories()`. (iteration 11)
- Treating delivery confusion as a prototype-only issue. The heuristic floor in `scoreCategories()` is part of the bug. (iteration 11)
- Assuming balanced prototype counts are enough to prevent confusion in Tier2. (iteration 12)
- Expecting `negativeHints` to already act as a live penalty signal. (iteration 12)
- Keeping `git diff` in the same severity class as transcript wrappers and table-of-contents scaffolding. (iteration 13)
- Treating every command mention inside a handover chunk as proof that the content is generic operator boilerplate. (iteration 13)
- Rewriting the drop corpus as the main fix for handover/drop confusion. (iteration 14)
- Treating command-first handover prose as harmless prototype decoration. (iteration 14)
- Assuming there is already a hidden production caller for `buildTier3Prompt()`. (iteration 15)
- Treating phase `003` as a one-line constructor tweak in `memory-save.ts`. (iteration 15)
- Assuming the current 2-second timeout is automatically safe for arbitrarily long routed save bodies. (iteration 16)
- Treating Tier3 cost as the main blocker before measuring the ambiguous-call rate. (iteration 16)
- Rebuilding the entire prototype library as the first remediation step. (iteration 17)
- Using prototype count balance as a proxy for semantic separation. (iteration 17)
- Looking only at router tests and ignoring the handler path where Tier3 would actually be wired. (iteration 18)
- Treating the current test suite as sufficient because every category already has one positive-path assertion. (iteration 18)
- Deferring the regression tests until after the cue/prototype fixes land. (iteration 19)
- Treating the implementation phases as independent. The code and test changes need to move together. (iteration 19)
- Reopening the threshold debate as the primary path forward before the cue, prototype, and test fixes land. (iteration 20)
- Treating Tier3 wiring as the fix for delivery/progress and handover/drop by itself. (iteration 20)
- Solving delivery confusion by adding one more rollout noun while leaving the current progress floor unconditional. (iteration 21)
- Treating `same-pass` as sufficient by itself. The overlap spans sequencing, pending-until-verification language, and synchronized-surface wording. (iteration 21)
- Removing all command language from handover guidance. Real handover notes legitimately contain commands; the fix is to demote the soft ones, not ban them. (iteration 22)
- Treating resume-command language as the same thing as transcript or wrapper boilerplate. (iteration 22)
- Assuming a reusable production `RouterCache` already exists and phase `003` only needs to pass it through. (iteration 23)
- Treating the env contract choice as free. Reuse-versus-new-env naming is a real scope decision inside the wiring phase. (iteration 23)
- Looking for a routing category that is completely absent from `content-router.vitest.ts`. (iteration 24)
- Treating category presence as equivalent to meaningful regression coverage. (iteration 24)
- Continuing the research loop instead of handing the packet back to implementation. (iteration 25)
- Expecting another research pass to change the phase order or revive threshold tuning as the primary fix. (iteration 25)
- Looking for the old delivery and handover confusion pairs in the preserved replay after the implemented cue and prototype changes. (iteration 26)
- Treating the absence of the original compact-variant generator as a reason to skip post-implementation benchmarking. (iteration 26)
- Treating the reconstructed compact replay as a strict substitute for the earlier 132-sample benchmark. (iteration 27)
- Trying to infer the exact earlier compact-variant generator from the current packet state alone. (iteration 27)
- Assuming that always-on Tier 3 makes every canonical save network-dependent. (iteration 28)
- Treating the handler change as proof that Tier 3 necessarily decides every routed save. (iteration 28)
- Treating the routing-only Tier 3 tests as redundant now that the handler wiring exists in code. (iteration 29)
- Using the full handler suite as the primary signal for this question when unrelated atomic-save failure-injection tests still fail elsewhere in the file. (iteration 29)
- Looking for a missing category or stale Tier 3 flag claim in the primary save docs after the doc-alignment phase was already shipped. (iteration 30)
- Treating the packet as still documentation-drifted just because earlier research was written before implementation landed. (iteration 30)
- Looking for a second hidden doc drift after the save docs already agree on categories, tiers, boundaries, and context rules. (iteration 31)
- Treating the endpoint-availability wording nuance as a substantive documentation mismatch. (iteration 31)
- Treating centroid distance alone as a proxy for live routed accuracy. (iteration 32)
- Using balanced prototype counts as proof that the refreshed corpus is now semantically well separated. (iteration 32)
- Expecting prototype refreshes alone to remove the need for heuristic boundary rules in the narrative categories. (iteration 33)
- Treating the refreshed hotspot prototypes as still behaviorally broken just because their embeddings remain close. (iteration 33)
- Reopening the delivery/progress or handover/drop remediation plan as the primary next step. (iteration 34)
- Treating documentation parity as the missing ingredient in the residual accuracy story. (iteration 34)
- Continuing the research loop again before deciding whether short-fragment robustness is worth another targeted code pass. (iteration 35)
- Treating a missing exact compact-generator replay as a blocker to drawing a useful post-implementation verdict. (iteration 35)
- Counting `DR-05-s1` as a clean pass because the category stays `drop` even though it still refuses below the floor. (iteration 36)
- Treating the `metadata_only` target fix as a silent routing-accuracy change. (iteration 36)
- Looking for a new same-path identity collision after the fix; the helper now resolves continuity identity onto the canonical host doc and anchor explicitly. (iteration 37)
- Treating F7 as a hidden fix for the `research_finding` versus `metadata_only` classification seam. (iteration 37)
- Opening a new remediation phase for the `metadata_only` fix itself. (iteration 38)
- Treating historical packet-doc flag mentions as evidence of an active documentation regression in the shipped save surfaces. (iteration 38)

<!-- /ANCHOR:ruled-out-directions -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
None. Stop early and hand the packet back as converged unless the team explicitly chooses the optional short-fragment follow-on.

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:known-context -->
## 12. KNOWN CONTEXT
- The packet spec defines eight routing categories, four confidence-related constants, and six baseline accuracy questions for a synthetic-data investigation.
- The runtime save path is `memory-save.ts` -> `createContentRouter()` -> `anchorMergeOperation()` or thin continuity frontmatter upsert, depending on the routed category.
- Research stayed read-only and used synthetic payloads derived from current spec-doc-style content, not historical save records.
- The second research wave focused on remediation design for delivery/progress cues, handover/drop relaxation, Tier3 wiring, prototype quality, and test coverage.
- Phases `001`, `002`, `003`, and `004` are now implemented, reviewed, and documentation-aligned, so the active question is post-implementation verification rather than design guidance.
- The exact preserved replay improved materially, but the old compact-fragment generator was not preserved as an artifact, so compact-only comparisons must be treated as diagnostic.
- The remaining residual errors have shifted into research/metadata overlap and ultra-short telemetry fragments rather than the original delivery or handover seams.

---

<!-- /ANCHOR:known-context -->
<!-- ANCHOR:research-boundaries -->
## 13. RESEARCH BOUNDARIES
- Read-only, no historical saves, synthetic payloads from spec-doc content
- Max iterations: 20
- User-authorized convergence extension: iterations `21-35` completed without modifying the immutable config
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `new`, `resume`, `restart`
- Machine-owned sections: reducer controls Sections 3, 6-11
- Current generation: 1
- Started: 2026-04-13T04:51:24Z
<!-- /ANCHOR:research-boundaries -->
