---
cp_id: CP-102
category: C
category_name: low-confidence-honesty
prompt: "tell me a joke about distributed systems"
expected_behavior: "No confident skill match"
pass_criteria:
  top1_confidence_max: 0.50
fail_criteria:
  top1_confidence_gte: 0.50
notes: "Pure conversation should not force a high-confidence skill pick."
---

# CP-102 - Low-confidence honesty (Category C)

Tests whether the router correctly returns no confident skill match for ordinary conversation.
