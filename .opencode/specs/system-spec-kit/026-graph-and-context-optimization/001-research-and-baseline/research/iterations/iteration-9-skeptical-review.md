# Iteration 9 — Skeptical Review of v1 Deliverables

> Iter-9 of 18. Critique-only. Does not modify v1 deliverables. Findings here feed iter-17 (v2 re-render).

## TL;DR
- `research.md` contains one factual overstatement: it says both remaining UNKNOWNs are measurement gaps, but `G1.Q8` is actually blocked by missing per-chain evidence, not measurement.
- `cross-phase-matrix.md` and `research.md` disagree on license certainty: the matrix scores CodeSight, Graphify, and Claudest as full `2`, while Q-E says all three remain `mixed` because license verification is incomplete.
- `findings-registry.json` violates its own charter schema twice: `F-CROSS-005` and `F-CROSS-026` are tagged `new-cross-phase` but still use numeric `source_phase`.
- The registry summary inherits that schema break: `new-cross-phase = 8`, but `by_source_phase.cross = 6`.
- `recommendations.md` drops prerequisite edges the roadmap itself established, especially for `R4` and `R10`.
- `R2` cites an unrelated finding (`F-CROSS-064`) for Stop-time summaries.
- Several registry findings use thin single-line citations into Q-C table rows that look brittle and under-justify the broader claim.
- v1 is useful, but not defensible as the final authoritative render without a v2 cleanup pass.

## research.md weaknesses

### Section 1 (Executive summary)
- No issues found

### Section 2 (The 5 systems in one paragraph each)
- (line 30) [WEAK | CONTRADICTION] Quote: "Claudest finished as the most practically reusable system" Issue: this collides with the matrix/runtime story, which treats CodeSight as the cleanest license/runtime fit. "Most practically reusable" is undefined and reads like source portability, not pattern composability. Suggested fix: narrow this to "most composition-friendly pattern source" or explicitly say "inside Spec Kit Memory."

### Section 3 (Token-honesty audit table)
- No issues found

### Section 4 (Capability matrix)
- (line 63) [WEAK] Quote: "Public dominates where it matters most to this packet" Issue: "matters most" is a value judgment not backed by a cited weighting rubric. The matrix proves scores on nine chosen capabilities, not a separate importance ranking. Suggested fix: replace with a literal statement about the scored rows only.
- (line 65) [OVERREACH] Quote: "No capability row is a true market gap." Issue: this is only true inside the nine-row rubric. The sentence reads broader than the instrument supports. Suggested fix: say "No row in this rubric is a true gap."

### Section 5 (Cross-phase findings)
- No issues found

### Section 6 (Per-phase gap closure log)
- (line 169) [CONTRADICTION] Quote: "both of the UNKNOWNs are measurement gaps" Issue: false. `G4.PT` is measurement-bounded, but `G1.Q8` is blocked by missing event-level examples and cause labels, which Section 11 states explicitly. Suggested fix: split the two UNKNOWN classes instead of flattening them into measurement.

### Section 7 (Composition risk analysis)
- No issues found

### Section 8 (Adoption roadmap with dependency graph)
- (line 260) [CONTRADICTION] Quote: "The first five concrete moves should be ... generate activation scaffolding" Issue: the roadmap elevates activation scaffolding into the first-five cluster, but `recommendations.md` contains no recommendation for that prerequisite even though `R4` depends on it implicitly. Suggested fix: either promote the scaffold into the ranked recommendations or stop calling it part of the first-five concrete moves.

### Section 9 (License + runtime feasibility)
- (lines 121-123) [CONTRADICTION] Quote: "none of the five systems qualified as fully source-portable" Issue: Section 4's matrix simultaneously scores CodeSight, Graphify, and Claudest as full `2` on license compatibility. The deliverable is using two incompatible standards without naming them. Suggested fix: separate "declared upstream license" from "snapshot-verified source portability."
- (lines 269-272) [CONTRADICTION] Quote: "license verification is incomplete" / "repo snapshot lacks a canonical `LICENSE` file" Issue: this directly undercuts the matrix's full-score treatment for the same systems. Suggested fix: make the matrix row use the same evidence standard as Q-E.

### Section 10 (Killer-combo analysis)
- No issues found

### Section 11 (Confidence statement + open questions)
- (line 309) [UNJUSTIFIED-CONFIDENCE] Quote: "Overall confidence: 0.94." Issue: that number is too strong for a deliverable set that still contains schema errors, dependency omissions, and a live scoring contradiction on license compatibility. Suggested fix: either lower the score or scope it narrowly to "question coverage" rather than "deliverable correctness."

## findings-registry.json weaknesses

### Schema-level
- (line 80) [SCHEMA] `F-CROSS-005` is tagged `new-cross-phase` but uses `"source_phase": 1`. The charter explicitly reserves numeric phases for single-phase findings and `"cross"` for cross-phase findings. Suggested fix: set `source_phase` to `"cross"`.
- (line 458) [SCHEMA] `F-CROSS-026` repeats the same mistake with `"source_phase": 5`. Suggested fix: set `source_phase` to `"cross"`.
- (lines 1231-1244) [SCHEMA | INTERNAL-CONSISTENCY] `summary.by_tag.new-cross-phase = 8`, but `summary.by_source_phase.cross = 6`. That mismatch is the visible symptom of the two misclassified findings above. Suggested fix: recompute summary counts after fixing source_phase classification.

### Per-finding (top 30 issues only)
- `F-CROSS-005` (line 80): [UNJUSTIFIED-CONFIDENCE] Issue: this is a cross-phase closure recorded at `confidence: 0.45` but still marked `recommendation: "adopt"`. That is too strong for a design-contract-only closure. Suggested fix: downgrade to `adapt` or `defer`, or raise evidence depth.
- `F-CROSS-026` (line 458): [SCHEMA | LABEL-DRIFT] Issue: the finding is explicitly cross-phase in title and tag, but the numeric source-phase encoding makes downstream aggregation wrong. Suggested fix: normalize it to `"cross"`.
- `F-CROSS-036` (line 650): [STALE-CITATION-LIKELY] Issue: the only evidence pointer is `research/iterations/q-c-composition-risk.md:31-31`, which is a one-line table row about fit/risk, not the actual token-reporting methodology. Suggested fix: point this finding at Q-A's methodology lines instead.
- `F-CROSS-045` (line 828): [STALE-CITATION-LIKELY] Issue: this finding leans on `q-c-composition-risk.md:40-40`, again a single-row table citation, even though the real claim is about runtime search fallback semantics. Suggested fix: cite the richer phase-5/Q-D evidence directly.
- `F-CROSS-055` (line 1026): [UNJUSTIFIED-CONFIDENCE] Issue: `confidence: 0.94` is too aggressive for a normative policy conclusion derived from one synthesis file, especially while nearby deliverables still disagree on gating semantics. Suggested fix: lower confidence or add corroborating evidence pointers.
- `F-CROSS-056` (line 1044): [WEAK-CLAIM] Issue: the rationale says Public leads the lanes "that matter most," which hard-codes an uncited priority judgment into a registry finding. Suggested fix: strip the priority language and stick to the scored rows.
- `F-CROSS-061` (line 1140): [WEAK-CLAIM] Issue: "already the baseline win in Public" reads like a live Public fact, but the evidence is phase-1 interpretation rather than current-turn runtime proof. Suggested fix: phrase it as "phase-1 concluded" unless direct Public evidence is added.
- `F-CROSS-062` (line 1158): [DUPLICATE/OVERLAP] Issue: this materially overlaps `F-CROSS-029` ("Per-tool profile overlay split") and reads like the same packaging concept restated in implementation-language form. Suggested fix: merge or distinguish the two findings.
- `F-CROSS-065` (line 1212): [DUPLICATE/OVERLAP] Issue: this duplicates the substance of `F-CROSS-046` ("Cached context_summary SessionStart fast path") and inflates the registry with a second startup-cache finding. Suggested fix: merge into one canonical cached-summary finding.

## recommendations.md weaknesses

### Per-recommendation
- `R1`: [None] No issues found.
- `R2`: [EVIDENCE-MISMATCH | DEPENDENCY-DRIFT] Issue: it cites `F-CROSS-064`, which is about evidence labeling, not Stop-time summaries; it also adds `Depends on: R1` even though the roadmap does not make Stop-time summary computation depend on the token-reporting rule. Suggested fix: replace `F-CROSS-064` with a summary-specific finding and remove the invented dependency unless intentionally policy-gated.
- `R3`: [None] No issues found.
- `R4`: [MISSING-DEP-EDGE] Issue: it says `Depends on: none`, but the roadmap makes the graph-first hook depend on generated `.mcp.json` scaffolding/setup hints. Suggested fix: add the missing dependency or add the missing prerequisite recommendation.
- `R5`: [UNDER-EVIDENCED] Issue: the title and acceptance criterion promise provenance/evidence fields, but the evidence block cites only `F-CROSS-028` and `F-CROSS-041`, not the actual evidence-tagging findings (`F-CROSS-037` / `F-CROSS-064`). Suggested fix: either narrow the recommendation to validator + AST/regex honesty or cite the evidence-tagging finding directly.
- `R6`: [SCOPE-BLUR] Issue: the recommendation is nominally about a regression harness, but its evidence block pulls in `F-CROSS-033` (SQLAlchemy AST extraction), which is a different expansion candidate. Suggested fix: keep the recommendation purely about harnessing or rename it to cover both sequencing rails.
- `R7`: [None] No issues found.
- `R8`: [RANKING-GAP] Issue: this is described elsewhere as the top combo with a `9/10` score, but it sits at rank 8 without explaining that rank reflects prerequisite order rather than raw score. Suggested fix: explicitly state that the list is dependency-adjusted, not score-sorted.
- `R9`: [None] No issues found.
- `R10`: [MISSING-DEP-EDGE] Issue: it depends on `R5, R6`, but the static-artifact-plus-overlay finding it cites (`F-CROSS-030`) depends on the overlay split finding (`F-CROSS-029`), which no recommendation owns. Suggested fix: add an overlay-packaging prerequisite or revise the evidence set.

## cross-phase-matrix.md weaknesses

### Score weaknesses
- (`License compatibility`, `002 CodeSight`) score = `2` at lines 17 and 87. Issue: Q-E later says CodeSight is still `mixed` because the snapshot lacks canonical license verification. A full score is not consistent with the final legal/runtime standard.
- (`License compatibility`, `004 Graphify`) score = `2` at lines 17 and 89. Issue: same problem; the matrix treats declared MIT evidence as fully sufficient while Q-E explicitly does not.
- (`License compatibility`, `005 Claudest`) score = `2` at lines 17 and 90. Issue: same contradiction again, and this one is especially visible because `research.md` also calls Claudest license evidence incomplete.
- (`Multimodal support`, `005 Claudest`) score = `1` at line 36. Issue: the point is awarded by pulling in marketplace/plugin ecosystem breadth rather than the core system being scored. That is ecosystem leakage.
- (`Code AST coverage`, `Public`) score = `1` at line 28. Issue: the rationale says Public "clearly has deeper structural graph behavior than Graphify" but then keeps the score conservative because parser internals were not reopened. The prose and the score rationale are pulling in opposite directions.

### Dominance weaknesses
- (`License compatibility`) dominant = `002 CodeSight (tie 004/005)` at line 92. Issue: the tie-break rests on an inference about fit while the packet's own Q-E lane says all three remain evidence-incomplete for direct source portability.
- (`Memory / continuity`) dominant = `Public (tie 005)` at line 65. Issue: the tie-break may be reasonable, but it is not derived from a scored sub-rubric; the matrix would be cleaner if this stayed an explicit tie.

## Cross-deliverable contradictions

- `research.md` Section 9 says none of the systems are fully source-portable in this checkout, while `cross-phase-matrix.md` gives full `2` license-compatibility scores to CodeSight, Graphify, and Claudest.
- `research.md` line 169 says both UNKNOWNs are measurement gaps, while `research.md` Section 11 itself explains that `G1.Q8` is blocked by missing cause-labeled examples, not measurement.
- `research.md` line 260 elevates activation scaffolding into the first-five move set, while `recommendations.md` has no corresponding recommendation and `R4` pretends it has no prerequisites.
- `findings-registry.json` encodes 8 `new-cross-phase` findings by tag but only 6 `cross` findings by `source_phase`, so the same deliverable disagrees with itself before any downstream consumer touches it.

## Severity classification

| Severity | Count | Examples |
|---|---:|---|
| MUST-FIX (factually wrong / contradiction / missing citation) | 8 | `research.md:169`; `cross-phase-matrix.md:17,87-92` vs `research.md:121-123,269-272`; `recommendations.md:R4` |
| SHOULD-FIX (weak claim / overreach / drift) | 10 | `research.md:30`; `findings-registry.json:F-CROSS-036`; `recommendations.md:R8` |
| NICE-TO-FIX (style / clarity / phrasing) | 4 | `recommendations.md:R5`; `recommendations.md:R6`; `cross-phase-matrix.md:36` |

## Net assessment

v1 is materially useful, but it is not defensible as the final authoritative packet in its current state. The strongest parts are the synthesis direction, the topology-preserving adoption logic, and the refusal to over-inherit token-saving claims. The weakest parts are not merely stylistic: the registry has a real schema error, the gap log contains a false sentence, the recommendations lose prerequisite edges, and the matrix/license lane conflicts with the narrative legal gate.

The v2 priority is straightforward: fix structural correctness first, then tighten language. Specifically: normalize cross-phase `source_phase`, recompute the registry summary, reconcile the matrix with Q-E on license scoring, repair recommendation dependencies/evidence pointers, and downgrade any confidence language that overstates what the evidence actually proves. After that, the packet can be defended as a strong synthesis artifact. Without that pass, it remains a good working draft rather than a stable final render.
