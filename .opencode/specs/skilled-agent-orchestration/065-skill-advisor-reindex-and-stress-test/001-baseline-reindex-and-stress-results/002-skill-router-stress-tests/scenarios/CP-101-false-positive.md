---
cp_id: CP-101
category: B
category_name: false-positive-resistance
prompt: "save the file I'm working on"
expected_behavior: "memory:save should NOT be top1"
pass_criteria:
  memory_save_confidence_max: 0.50
  top1_is_not_memory_save: true
fail_criteria:
  memory_save_confidence_gte: 0.50
  memory_save_top1: true
notes: "The word save is confusable; memory:save is for context preservation, not file writes."
---

# CP-101 - False-positive resistance (Category B)

Tests whether the router avoids treating ordinary file-save language as a context-preservation memory save.
