# Test Results: DR-020 through DR-023

**Playbook version:** v1.1.0
**Date:** 2026-03-24
**Operator:** Claude Opus 4.6 (automated)
**Scope:** Quality Guard contract consistency across convergence.md, loop_protocol.md, auto.yaml, state_format.md

---

## DR-020: Quality Guard -- Source Diversity
**Status:** PASS

**Evidence:**
- convergence.md line 110: Guard table row defines "Source Diversity | Every answered question must cite >= 2 independent sources | Block STOP, log guard_violation"
- convergence.md lines 124-126: Pseudocode checks `len(sources) < 2` and pushes `{ guard: "source_diversity", question: q }`
- convergence.md line 139: "If it returns passed: false, override the action to CONTINUE and resume the loop"
- auto.yaml lines 238-242 (step_check_convergence step 6): `guardResult = checkQualityGuards(state, strategy); if not guardResult.passed: decision = "CONTINUE"`
- state_format.md line 234: Example event `{"type":"event","event":"guard_violation","guard":"source_diversity","question":"Q1","detail":"Only 1 source for Q1",...}`
- state_format.md line 237: `source_diversity` listed in supported guard values
- loop_protocol.md lines 97-107 (Step 2c): "If any guard fails: override decision to CONTINUE" with guard_violation logging

**Issues:** None. All four files are consistent on guard name, rule definition (>= 2 independent sources), violation event schema, and STOP-to-CONTINUE override behavior.

---

## DR-021: Quality Guard -- Focus Alignment
**Status:** PASS (with minor observation)

**Evidence:**
- convergence.md line 111: Guard table row defines "Focus Alignment | Answered questions must map to original key questions from initialization | Block STOP, log guard_violation"
- convergence.md lines 127-128: Pseudocode checks `q not in strategy.originalKeyQuestions` and pushes `{ guard: "focus_alignment", question: q }`
- convergence.md line 117: Prose says "Compare answered question labels against the initial key questions stored in strategy.md at initialization"
- auto.yaml lines 238-242: Same checkQualityGuards block; override to CONTINUE if not passed
- state_format.md line 237: `focus_alignment` listed in supported guard values
- loop_protocol.md lines 97-107 (Step 2c): Same override flow for all guards

**Issues:**
- MINOR: convergence.md pseudocode references `strategy.originalKeyQuestions` as a named field, but state_format.md section 4 (Strategy File) does not explicitly define an `originalKeyQuestions` field. The strategy template uses "Key Questions (remaining)" and "Answered Questions" as section names. The convergence.md prose (line 117) clarifies the intent ("initial key questions stored in strategy.md at initialization"), so the semantic contract is clear, but the pseudocode field name does not map to a literal strategy.md structure. This is a documentation gap, not a behavioral contradiction. Verdict: not a contract failure.

---

## DR-022: Quality Guard -- No Single-Weak-Source
**Status:** PASS (with minor observation)

**Evidence:**
- convergence.md line 112: Guard table row defines "No Single-Weak-Source | No answered question can rely solely on one source with sourceStrength == 'tentative' | Block STOP, log guard_violation"
- convergence.md lines 129-130: Pseudocode checks `len(sources) == 1 and sources[0].strength == "tentative"` and pushes `{ guard: "single_weak_source", question: q }`
- state_format.md lines 184-194: sourceStrength classification table defines three levels: `primary` (authoritative, counts toward coverage), `secondary` (corroborating, counts toward coverage), `tentative` (single source/unverified, does NOT count toward coverage)
- state_format.md line 237: `single_weak_source` listed in supported guard values
- auto.yaml lines 238-242: Same checkQualityGuards override block
- loop_protocol.md lines 97-107 (Step 2c): Same override flow

**Issues:**
- MINOR: convergence.md pseudocode accesses `sources[0].strength` as a property on source objects, but state_format.md line 193 says sourceStrength is annotated inline in iteration file markdown as `(sourceStrength: primary)` and in JSONL is "tracked implicitly through the newInfoRatio." The `collectSources()` function would need to parse markdown annotations to populate a `.strength` property. This is an implementation ambiguity (how does the guard extract strength data at runtime?) rather than a contract contradiction -- the rule and expected behavior are consistent across all four files.

---

## DR-023: Composite Convergence Passes but Guard Fails -- CONTINUE Override
**Status:** PASS

**Evidence:**
- convergence.md lines 165-174 (Decision Priority): Step 4 = "Composite convergence (3-signal weighted vote, threshold 0.60)", Step 4.5 = "Quality guards (binary checks -- if composite says STOP but guards fail, override to CONTINUE)". Ordering is explicit.
- convergence.md lines 104-139: checkQualityGuards pseudocode returns `{ passed: false, violations }` on any violation; prose at line 139 says "override the action to CONTINUE and resume the loop"
- auto.yaml lines 238-242 (step_check_convergence step 6): `if decision == "STOP": guardResult = checkQualityGuards(state, strategy); if not guardResult.passed: log "Quality guard failed..."; decision = "CONTINUE"`. Full override path present.
- loop_protocol.md lines 97-107 (Step 2c): "When the convergence algorithm returns STOP: 1. Run quality guard checks... 4. If any guard fails: override decision to CONTINUE". Line 106: "The loop continues until BOTH convergence AND quality guards pass simultaneously."
- state_format.md lines 229-237: guard_violation event schema has guard, question, detail, timestamp fields. Example provided.

**Issues:**
- MINOR (wording only): state_format.md line 237 says guard_violation events "are informational and do not halt the loop, but the orchestrator may use them to adjust subsequent iteration focus." This is technically correct (the events are informational; the guard *system* performs the override, not the events themselves), but the phrasing could be misread as "guards have no effect on the STOP decision." The convergence.md and auto.yaml are unambiguous about the override, so this is a clarity concern, not a contract contradiction.

---

## Summary

| Scenario | Status | Contract Consistency |
|----------|--------|---------------------|
| DR-020 | PASS | Full alignment across all 4 files |
| DR-021 | PASS | Minor: `originalKeyQuestions` field name in pseudocode has no literal counterpart in strategy template |
| DR-022 | PASS | Minor: `sources[0].strength` access pattern underdefined for markdown-annotated sourceStrength |
| DR-023 | PASS | Minor: state_format.md wording on guard_violation could be clearer about override semantics |

**Overall verdict:** All four scenarios PASS. The quality guard contract is internally consistent across convergence.md, loop_protocol.md, auto.yaml, and state_format.md. Three minor documentation observations were noted -- none represent behavioral contradictions or contract failures.
