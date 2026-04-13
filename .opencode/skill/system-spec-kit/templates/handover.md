---
title: "Session Handover Document [template:handover.md]"
description: "Session handover template for preserving context and enabling seamless continuation across sessions."
trigger_phrases:
  - "session"
  - "handover"
  - "document"
  - "template"
importance_tier: "normal"
contextType: "general"
---
# Session Handover Document

Session handover template for preserving context and enabling seamless continuation across sessions.

<!-- SPECKIT_TEMPLATE_SOURCE: handover | v1.0 -->

---

<!-- ANCHOR:when-to-use -->
## WHEN TO USE THIS TEMPLATE

**Use handover.md when:**
- Ending a session with incomplete work that needs continuation
- Context needs to be preserved for a future session (same or different agent)
- Transitioning work between team members or AI sessions
- Complex multi-session features requiring state preservation
- Session compaction detected and recovery needed

**Status values:** draft | in_progress | review | complete | archived
<!-- /ANCHOR:when-to-use -->

---

<!-- ANCHOR:handover-summary -->
## 1. Handover Summary

- **From Session:** [YOUR_VALUE_HERE: session_id or date]
- **To Session:** [YOUR_VALUE_HERE: next_session]
- **Phase Completed:** [YOUR_VALUE_HERE: RESEARCH / PLANNING / IMPLEMENTATION]
- **Handover Time:** [YOUR_VALUE_HERE: timestamp]
<!-- /ANCHOR:handover-summary -->

---

<!-- ANCHOR:context-transfer -->
## 2. Context Transfer

### 2.1 Key Decisions Made
| Decision     | Rationale | Impact                 |
| ------------ | --------- | ---------------------- |
| [YOUR_VALUE_HERE: decision_1] | [YOUR_VALUE_HERE: why] | [YOUR_VALUE_HERE: files/areas affected] |
| [YOUR_VALUE_HERE: decision_2] | [YOUR_VALUE_HERE: why] | [YOUR_VALUE_HERE: files/areas affected] |

### 2.2 Blockers Encountered
| Blocker     | Status          | Resolution/Workaround |
| ----------- | --------------- | --------------------- |
| [YOUR_VALUE_HERE: blocker_1] | [YOUR_VALUE_HERE: resolved/open] | [YOUR_VALUE_HERE: how it was handled] |

### 2.3 Files Modified
| File        | Change Summary | Status                 |
| ----------- | -------------- | ---------------------- |
| [YOUR_VALUE_HERE: file_path] | [YOUR_VALUE_HERE: what changed] | [YOUR_VALUE_HERE: complete/in_progress] |
<!-- /ANCHOR:context-transfer -->

---

<!-- ANCHOR:next-session -->
## 3. For Next Session

### 3.1 Recommended Starting Point
- **File:** [YOUR_VALUE_HERE: file:line_number]
- **Context:** [YOUR_VALUE_HERE: what to focus on first]

### 3.2 Priority Tasks Remaining
1. [YOUR_VALUE_HERE: highest_priority_task]
2. [YOUR_VALUE_HERE: second_priority_task]
3. [YOUR_VALUE_HERE: third_priority_task]

### 3.3 Critical Context to Load
- [ ] Indexed save or continuity target: use `generate-context.js` for indexed saves. Edit `_memory.continuity` frontmatter in `implementation-summary.md` for quick continuity updates.
- [ ] Spec file: `spec.md` (sections [YOUR_VALUE_HERE: X, Y, Z])
- [ ] Plan file: `plan.md` (phase [YOUR_VALUE_HERE: N])
<!-- /ANCHOR:next-session -->

---

<!-- ANCHOR:validation-checklist -->
## 4. Validation Checklist

Before handover, verify:
- [ ] All in-progress work committed or stashed
- [ ] Current context saved via `generate-context.js` or `_memory.continuity` in `implementation-summary.md`
- [ ] No breaking changes left mid-implementation
- [ ] Tests passing (if applicable)
- [ ] This handover document is complete
<!-- /ANCHOR:validation-checklist -->

---

<!-- ANCHOR:session-notes -->
## 5. Session Notes

[YOUR_VALUE_HERE: free-form notes for next session]
<!-- /ANCHOR:session-notes -->

---

<!-- ANCHOR:template-instructions -->
## TEMPLATE INSTRUCTIONS

**How to use this template:**
1. Fill in all `[YOUR_VALUE_HERE: ...]` placeholders with actual values
2. Complete all validation checklist items before handover
3. Ensure memory file is saved with current context
4. Prioritize tasks clearly for next session
5. Remove placeholder text after filling in content

**Common mistakes to avoid:**
- Handover without saving memory context
- Incomplete validation checklist
- Vague task descriptions that lose context
- Missing file references or line numbers

**Related templates:**
- Use with `/spec_kit:handover` command for automated context saving
- Reference `handover.md`, `_memory.continuity` in `implementation-summary.md`, and canonical spec docs for context recovery
- Link to spec.md, plan.md, and tasks.md for complete picture
- Run `generate-context.js` before handover when the session also needs an indexed save
<!-- /ANCHOR:template-instructions -->

---

<!--
  REPLACE SAMPLE CONTENT IN FINAL OUTPUT
  - This template contains placeholders and examples
  - Replace them with actual content
-->
