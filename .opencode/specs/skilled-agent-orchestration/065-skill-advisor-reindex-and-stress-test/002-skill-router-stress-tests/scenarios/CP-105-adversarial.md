---
cp_id: CP-105
category: F
category_name: adversarial-confusable
prompt: "create a test playbook for stressing this skill"
expected_top1_skill: "create:testing-playbook"
pass_criteria:
  top3_contains_create_testing_playbook: true
  create_testing_playbook_confidence_min: 0.60
  improve_agent_confidence_max: 0.50
  spec_kit_deep_review_confidence_max: 0.50
fail_criteria:
  missing_create_testing_playbook: true
  improve_agent_confidence_gte: 0.50
  spec_kit_deep_review_confidence_gte: 0.50
notes: "Confusable triggers include test, playbook, stress, and skill."
---

# CP-105 - Adversarial confusable (Category F)

Tests whether testing-playbook creation wins over adjacent skill-improvement and review concepts.
