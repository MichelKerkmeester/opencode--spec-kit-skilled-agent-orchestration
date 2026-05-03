---
cp_id: CP-104
category: E
category_name: novel-phrasing
prompt: "preserve everything we figured out today so the next session doesn't lose it"
expected_top3_skill_set: ["memory:save"]
pass_criteria:
  top3_contains_memory_save: true
  memory_save_confidence_min: 0.60
fail_criteria:
  missing_memory_save: true
notes: "Tests semantic match beyond literal save/context tokens."
---

# CP-104 - Novel phrasing (Category E)

Tests whether context-preservation intent routes to memory save without literal trigger words.
