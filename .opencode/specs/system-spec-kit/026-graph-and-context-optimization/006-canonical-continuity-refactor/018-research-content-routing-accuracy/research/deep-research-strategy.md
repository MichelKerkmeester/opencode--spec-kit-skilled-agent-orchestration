# Deep Research Strategy - Session Tracking Template

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

Investigate whether the three-tier content router classifies canonical continuity saves correctly, where it escalates, which confusion pairs remain, and whether the current confidence floors are the right tradeoff for the currently wired runtime.

### Usage

- Init: seed the topic, six packet research questions, and read-only boundaries from the packet spec.
- Per iteration: read the current focus, inspect code and runtime evidence, write one iteration artifact, append one JSONL record, then let the reducer refresh the machine-owned sections.
- Synthesis target: produce an implementation-ready recommendation for routing thresholds, routing cue tuning, merge-mode safety, and `routeAs` override handling.

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:topic -->
## 2. TOPIC
Content routing classification accuracy and threshold optimization

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
- All six research questions have evidence-backed answers tied to code or measured runtime behavior.
- Confusion pairs and escalation reasons are documented with at least one concrete example each.
- Threshold recommendations distinguish between the currently wired runtime and the not-yet-wired Tier3 contract.

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

### Assuming the prototype library is sparse or skewed toward one category. It is balanced by count. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Assuming the prototype library is sparse or skewed toward one category. It is balanced by count.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Assuming the prototype library is sparse or skewed toward one category. It is balanced by count.

### Blaming delivery and handover failures on Tier2. In the key examples, Tier2 preferred the expected class but never got a chance because Tier1 accepted early or `drop` cues dominated. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Blaming delivery and handover failures on Tier2. In the key examples, Tier2 preferred the expected class but never got a chance because Tier1 accepted early or `drop` cues dominated.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Blaming delivery and handover failures on Tier2. In the key examples, Tier2 preferred the expected class but never got a chance because Tier1 accepted early or `drop` cues dominated.

### Historical save-log mining. The packet scope and current memory model explicitly require synthetic payloads instead. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Historical save-log mining. The packet scope and current memory model explicitly require synthetic payloads instead.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Historical save-log mining. The packet scope and current memory model explicitly require synthetic payloads instead.

### Looking for a hidden `classifyWithTier3` injection elsewhere in the non-test server code. The only production callsite creates the router without one. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Looking for a hidden `classifyWithTier3` injection elsewhere in the non-test server code. The only production callsite creates the router without one.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a hidden `classifyWithTier3` injection elsewhere in the non-test server code. The only production callsite creates the router without one.

### Making accuracy claims from prototype count balance alone. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Making accuracy claims from prototype count balance alone.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Making accuracy claims from prototype count balance alone.

### Recommending a blanket threshold increase as an unqualified improvement. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Recommending a blanket threshold increase as an unqualified improvement.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Recommending a blanket threshold increase as an unqualified improvement.

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

### Treating phase-anchor inference as the main handover failure driver. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Treating phase-anchor inference as the main handover failure driver.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating phase-anchor inference as the main handover failure driver.

### Treating the currently unwired Tier3 contract as the main source of routing inaccuracy. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Treating the currently unwired Tier3 contract as the main source of routing inaccuracy.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the currently unwired Tier3 contract as the main source of routing inaccuracy.

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

<!-- /ANCHOR:ruled-out-directions -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Open an implementation phase that tunes delivery and handover cue weighting, adds regression tests for the identified confusion pairs, and wires Tier3 only if the team wants LLM-backed disambiguation in the live save path.

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:known-context -->
## 12. KNOWN CONTEXT
- The packet spec defines eight routing categories, four confidence-related constants, and six research questions for a synthetic-data investigation.
- The runtime save path is `memory-save.ts` -> `createContentRouter()` -> `anchorMergeOperation()` or thin continuity frontmatter upsert, depending on the routed category.
- Research must stay read-only and use synthetic payloads derived from current spec-doc-style content, not historical save records.

---

<!-- /ANCHOR:known-context -->
<!-- ANCHOR:research-boundaries -->
## 13. RESEARCH BOUNDARIES
- Read-only, no historical saves, synthetic payloads from spec-doc content
- Max iterations: 10
- Convergence threshold: 0.05
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `new`, `resume`, `restart`
- Machine-owned sections: reducer controls Sections 3, 6, 7-11
- Current generation: 1
- Started: 2026-04-13T04:51:24Z
<!-- /ANCHOR:research-boundaries -->
