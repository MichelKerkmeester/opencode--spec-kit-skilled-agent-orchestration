---
cp_id: CP-100
category: A
category_name: ambiguous-routing
prompt: "I need to figure out what's wrong with my code"
expected_top1_skill_set: ["sk-deep-review", "sk-code-review", "simplify", "security-review"]
pass_criteria:
  top1_in_expected_set: true
  top1_confidence_max: 0.85
  top1_confidence_min: 0.40
fail_criteria:
  top1_outside_expected_set: true
notes: "Truly ambiguous prompt - should NOT yield 0.95 single-pick"
---

# CP-100 - Ambiguous routing (Category A)

Tests whether the router acknowledges genuine ambiguity by NOT collapsing to a single high-confidence pick.
