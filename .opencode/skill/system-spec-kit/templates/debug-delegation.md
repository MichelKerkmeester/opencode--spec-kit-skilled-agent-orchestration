---
title: "Debug Delegation Report [template:debug-delegation.md]"
description: "Debug delegation template for escalating stuck issues to specialized debugging agents after 3+ failed attempts."
trigger_phrases:
  - "debug"
  - "delegation"
  - "report"
  - "template"
  - "debug delegation"
importance_tier: "normal"
contextType: "general"
---
# Debug Delegation Report

Debug delegation template for escalating stuck issues to specialized debugging agents after 3+ failed attempts.

<!-- SPECKIT_TEMPLATE_SOURCE: debug-delegation | v1.0 -->

---

<!-- ANCHOR:when-to-use -->
## WHEN TO USE THIS TEMPLATE

**Use debug-delegation.md when:**
- Primary agent has attempted 3+ fixes without success
- Issue requires specialized debugging expertise
- Error pattern suggests need for different approach
- Escalating to a debugging specialist model
- Documenting failed attempts for knowledge transfer

**Status values:** Draft | In Progress | Review | Complete | Archived
<!-- /ANCHOR:when-to-use -->

---

<!-- ANCHOR:delegation-metadata -->
**Date:** [AUTO: timestamp]
**Task ID:** [YOUR_VALUE_HERE: task_id]
**Delegated By:** [YOUR_VALUE_HERE: agent_id]
**Attempts Before Delegation:** [YOUR_VALUE_HERE: attempt_count]
<!-- /ANCHOR:delegation-metadata -->

<!-- ANCHOR:problem-summary -->
## 1. PROBLEM SUMMARY

### Error Category
[YOUR_VALUE_HERE: syntax_error | type_error | runtime_error | test_failure | build_error | lint_error]

### Error Message
```
[YOUR_VALUE_HERE: full_error_output]
```

### Affected Files
- [YOUR_VALUE_HERE: file_path_1]
- [YOUR_VALUE_HERE: file_path_2]
<!-- /ANCHOR:problem-summary -->

<!-- ANCHOR:attempted-fixes -->
## 2. ATTEMPTED FIXES

### Attempt 1
- **Approach:** [YOUR_VALUE_HERE: description]
- **Result:** [YOUR_VALUE_HERE: failed_because]
- **Diff:** [YOUR_VALUE_HERE: code_diff_or_link]

### Attempt 2
- **Approach:** [YOUR_VALUE_HERE: description]
- **Result:** [YOUR_VALUE_HERE: failed_because]

### Attempt 3
- **Approach:** [YOUR_VALUE_HERE: description]
- **Result:** [YOUR_VALUE_HERE: failed_because]
<!-- /ANCHOR:attempted-fixes -->

<!-- ANCHOR:context-for-specialist -->
## 3. CONTEXT FOR SPECIALIST

### Relevant Code Section
```[YOUR_VALUE_HERE: language]
[YOUR_VALUE_HERE: code_snippet]
```

### Related Documentation
- [YOUR_VALUE_HERE: doc_references]

### Hypothesis
[YOUR_VALUE_HERE: current_theory_about_root_cause]
<!-- /ANCHOR:context-for-specialist -->

<!-- ANCHOR:recommended-next-steps -->
## 4. RECOMMENDED NEXT STEPS

1. [YOUR_VALUE_HERE: suggested_action_1]
2. [YOUR_VALUE_HERE: suggested_action_2]
<!-- /ANCHOR:recommended-next-steps -->

<!-- ANCHOR:handoff-checklist -->
## 5. HANDOFF CHECKLIST

- [ ] All attempted fixes documented
- [ ] Error logs attached
- [ ] Reproduction steps provided
- [ ] Environment details included
<!-- /ANCHOR:handoff-checklist -->

---

<!-- ANCHOR:template-instructions -->
## TEMPLATE INSTRUCTIONS

**How to use this template:**
1. Fill in all `[YOUR_VALUE_HERE: ...]` placeholders with actual values
2. Document ALL attempted fixes before delegation (minimum 3)
3. Include full error messages and stack traces
4. Provide exact reproduction steps
5. Remove placeholder text after filling in content

**Common mistakes to avoid:**
- Delegating before attempting 3 fixes
- Omitting error context or stack traces
- Vague descriptions of attempted fixes
- Missing reproduction steps

**Related templates:**
- Use after exhausting fixes in current session
- Create memory file to preserve context for specialist
- Reference spec.md and plan.md for original requirements
- Update tasks.md with delegation status
<!-- /ANCHOR:template-instructions -->

---

<!--
  REPLACE SAMPLE CONTENT IN FINAL OUTPUT
  - This template contains placeholders and examples
  - Replace them with actual content
-->
