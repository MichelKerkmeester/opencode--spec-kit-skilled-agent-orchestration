---
cp_id: CP-103
category: D
category_name: multi-skill-workflow
prompt: "create a new agent then run a deep review on it"
expected_top3_skill_set: ["create:agent", "spec_kit:deep-review"]
pass_criteria:
  top3_contains_create_agent: true
  top3_contains_spec_kit_deep_review: true
  both_confidences_min: 0.50
fail_criteria:
  missing_create_agent: true
  missing_deep_review: true
notes: "Compositional prompts test whether router collapses to one skill incorrectly."
---

# CP-103 - Multi-skill workflow (Category D)

Tests whether the router keeps both requested capabilities visible in top-3 recommendations.
