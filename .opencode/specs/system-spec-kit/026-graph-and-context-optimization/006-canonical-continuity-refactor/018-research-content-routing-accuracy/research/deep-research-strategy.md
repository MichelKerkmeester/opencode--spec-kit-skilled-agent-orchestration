# Deep Research Strategy - Session Tracking Template

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

Investigate whether the three-tier content router classifies canonical continuity saves correctly, which confusion pairs dominate the residual errors, and what specific code and prototype changes should fix those errors without broadening scope.

### Usage

- Init: seed the topic, packet-local research questions, and read-only boundaries from the packet spec.
- Per iteration: read the current focus, inspect code and runtime evidence, write one iteration artifact, append one JSONL record, then let the reducer refresh the machine-owned sections.
- Synthesis target: produce implementation-ready guidance for delivery/progress cue tuning, handover/drop relaxation, Tier3 wiring, prototype refreshes, and regression coverage.

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
- The baseline accuracy and threshold questions stay answered with code-backed evidence.
- The delivery/progress and handover/drop confusion seams each have concrete code-level remediation guidance.
- Tier3 wiring guidance names the exact missing constructor seam and the missing classifier adapter.
- Prototype and test coverage recommendations are specific enough to hand directly to phases `001`, `002`, and `003`.

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
- Reading the live floors and the delivery prototypes side by side was enough to turn cue asymmetry into exact regex candidates and a minimal guard condition. (iteration 21)
- Separating hard drop heuristics from softer prototype overlap made the handover problem materially more precise. (iteration 22)
- Treating the fetch helper and the router dependency interface as templates made the Tier3 wiring effort easy to size without touching runtime code. (iteration 23)
- A direct category-floor audit answered the zero-coverage question quickly and kept the final testing guidance honest. (iteration 24)
- The convergence wave stayed focused on exact patch shapes, so the final synthesis tightened implementation guidance instead of reopening settled questions. (iteration 25)

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
- Prototype overlap counting alone still understated the delivery bug until the live progress floor was modeled explicitly. (iteration 21)
- Looking only at the hard drop regex would have missed the resume-command overlap that lives in the prototype corpus. (iteration 22)
- Sizing phase `003` from the constructor callsite alone still underestimates the missing cache and env-contract work. (iteration 23)
- Category presence in tests is not the same thing as meaningful boundary coverage. (iteration 24)
- The earlier synthesis was still slightly too high-level for direct patch authoring, which is why this explicit convergence pass was needed. (iteration 25)

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

### Deferring the regression tests until after the cue/prototype fixes land. -- BLOCKED (iteration 19, 1 attempts)
- What was tried: Deferring the regression tests until after the cue/prototype fixes land.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Deferring the regression tests until after the cue/prototype fixes land.

### Expecting `negativeHints` to already act as a live penalty signal. -- BLOCKED (iteration 12, 1 attempts)
- What was tried: Expecting `negativeHints` to already act as a live penalty signal.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Expecting `negativeHints` to already act as a live penalty signal.

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

### Rebuilding the entire prototype library as the first remediation step. -- BLOCKED (iteration 17, 1 attempts)
- What was tried: Rebuilding the entire prototype library as the first remediation step.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Rebuilding the entire prototype library as the first remediation step.

### Recommending a blanket threshold increase as an unqualified improvement. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Recommending a blanket threshold increase as an unqualified improvement.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Recommending a blanket threshold increase as an unqualified improvement.

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

### Treating `append-section` and `update-in-place` as equally tolerant operations. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Treating `append-section` and `update-in-place` as equally tolerant operations.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating `append-section` and `update-in-place` as equally tolerant operations.

### Treating all categories as equally safe once the router selects a target doc. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Treating all categories as equally safe once the router selects a target doc.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating all categories as equally safe once the router selects a target doc.

### Treating command-first handover prose as harmless prototype decoration. -- BLOCKED (iteration 14, 1 attempts)
- What was tried: Treating command-first handover prose as harmless prototype decoration.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating command-first handover prose as harmless prototype decoration.

### Treating delivery confusion as a prototype-only issue. The heuristic floor in `scoreCategories()` is part of the bug. -- BLOCKED (iteration 11, 1 attempts)
- What was tried: Treating delivery confusion as a prototype-only issue. The heuristic floor in `scoreCategories()` is part of the bug.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating delivery confusion as a prototype-only issue. The heuristic floor in `scoreCategories()` is part of the bug.

### Treating every command mention inside a handover chunk as proof that the content is generic operator boilerplate. -- BLOCKED (iteration 13, 1 attempts)
- What was tried: Treating every command mention inside a handover chunk as proof that the content is generic operator boilerplate.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating every command mention inside a handover chunk as proof that the content is generic operator boilerplate.

### Treating phase `003` as a one-line constructor tweak in `memory-save.ts`. -- BLOCKED (iteration 15, 1 attempts)
- What was tried: Treating phase `003` as a one-line constructor tweak in `memory-save.ts`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating phase `003` as a one-line constructor tweak in `memory-save.ts`.

### Treating phase-anchor inference as the main handover failure driver. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Treating phase-anchor inference as the main handover failure driver.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating phase-anchor inference as the main handover failure driver.

### Treating the current test suite as sufficient because every category already has one positive-path assertion. -- BLOCKED (iteration 18, 1 attempts)
- What was tried: Treating the current test suite as sufficient because every category already has one positive-path assertion.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the current test suite as sufficient because every category already has one positive-path assertion.

### Treating the currently unwired Tier3 contract as the main source of routing inaccuracy. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Treating the currently unwired Tier3 contract as the main source of routing inaccuracy.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the currently unwired Tier3 contract as the main source of routing inaccuracy.

### Treating the implementation phases as independent. The code and test changes need to move together. -- BLOCKED (iteration 19, 1 attempts)
- What was tried: Treating the implementation phases as independent. The code and test changes need to move together.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the implementation phases as independent. The code and test changes need to move together.

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

### Using prototype count balance as a proxy for semantic separation. -- BLOCKED (iteration 17, 1 attempts)
- What was tried: Using prototype count balance as a proxy for semantic separation.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Using prototype count balance as a proxy for semantic separation.

### Assuming a reusable production `RouterCache` already exists and phase `003` only needs constructor wiring. -- BLOCKED (iteration 23, 1 attempts)
- What was tried: Assuming a reusable production `RouterCache` already exists and phase `003` only needs constructor wiring.
- Why blocked: Repo inspection found the interface and test doubles, but no non-test implementation.
- Do NOT retry: Assuming a reusable production `RouterCache` already exists and phase `003` only needs constructor wiring.

### Looking for a routing category with zero presence in `content-router.vitest.ts`. -- BLOCKED (iteration 24, 1 attempts)
- What was tried: Looking for a routing category with zero presence in `content-router.vitest.ts`.
- Why blocked: Every routing category already has at least one positive-path assertion; the real gap is adversarial boundary coverage.
- Do NOT retry: Looking for a routing category with zero presence in `content-router.vitest.ts`.

### Solving delivery confusion by adding one more rollout noun while leaving the current progress floor unconditional. -- BLOCKED (iteration 21, 1 attempts)
- What was tried: Solving delivery confusion by adding one more rollout noun while leaving the current progress floor unconditional.
- Why blocked: The dominant collision comes from sequencing and verification-order language plus the unconditional progress floor, not from one missing rollout noun.
- Do NOT retry: Solving delivery confusion by adding one more rollout noun while leaving the current progress floor unconditional.

### Treating category presence as equivalent to meaningful regression coverage. -- BLOCKED (iteration 24, 1 attempts)
- What was tried: Treating category presence as equivalent to meaningful regression coverage.
- Why blocked: The remaining failures are boundary-shaped and live outside the current happy-path assertions.
- Do NOT retry: Treating category presence as equivalent to meaningful regression coverage.

### Treating resume-command overlap as a hard-drop problem only. -- BLOCKED (iteration 22, 1 attempts)
- What was tried: Treating resume-command overlap as a hard-drop problem only.
- Why blocked: Part of the overlap lives in Tier 2 prototypes, not just the Tier 1 drop regex.
- Do NOT retry: Treating resume-command overlap as a hard-drop problem only.

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
- Treating resume-command overlap as a hard-drop problem only. (iteration 22)
- Assuming a reusable production `RouterCache` already exists and phase `003` only needs constructor wiring. (iteration 23)
- Looking for a routing category with zero presence in `content-router.vitest.ts`. (iteration 24)
- Treating category presence as equivalent to meaningful regression coverage. (iteration 24)
- Continuing the research loop instead of handing the packet back to implementation. (iteration 25)

<!-- /ANCHOR:ruled-out-directions -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Research is converged after the user-authorized extension through iteration 25. Implement phases `001`, `002`, and `003` in that order, then rerun the same synthetic corpus and the expanded router plus handler regression suite as an explicit before/after benchmark.

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:known-context -->
## 12. KNOWN CONTEXT
- The packet spec defines eight routing categories, four confidence-related constants, and six baseline accuracy questions for a synthetic-data investigation.
- The runtime save path is `memory-save.ts` -> `createContentRouter()` -> `anchorMergeOperation()` or thin continuity frontmatter upsert, depending on the routed category.
- Research stayed read-only and used synthetic payloads derived from current spec-doc-style content, not historical save records.
- The second research wave focused on remediation design for delivery/progress cues, handover/drop relaxation, Tier3 wiring, prototype quality, and test coverage.

---

<!-- /ANCHOR:known-context -->
<!-- ANCHOR:research-boundaries -->
## 13. RESEARCH BOUNDARIES
- Read-only, no historical saves, synthetic payloads from spec-doc content
- Max iterations: 20
- User-authorized convergence extension: iterations `21-25` completed without modifying the immutable config
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `new`, `resume`, `restart`
- Machine-owned sections: reducer controls Sections 3, 6-11
- Current generation: 1
- Started: 2026-04-13T04:51:24Z
<!-- /ANCHOR:research-boundaries -->
