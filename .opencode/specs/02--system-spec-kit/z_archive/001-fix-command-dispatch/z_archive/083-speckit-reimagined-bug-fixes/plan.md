---
title: "Implementation Plan: Spec Kit Bug Fixes [083-speckit-reimagined-bug-fixes/plan]"
description: "Phase 1: CRITICAL Fixes (P0)"
trigger_phrases:
  - "implementation"
  - "plan"
  - "spec"
  - "kit"
  - "bug"
  - "083"
  - "speckit"
importance_tier: "important"
contextType: "decision"
---
# Implementation Plan: Spec Kit Bug Fixes

> Phased approach to resolving all identified bugs in the Spec Kit v1.2.1.0 release.

---

## Document Information

| Field | Value |
|-------|-------|
| **Spec ID** | 083-speckit-reimagined-bug-fixes |
| **Phase** | Planning |
| **Estimated Effort** | 4-6 hours |
| **Priority** | High |

---

## 1. Implementation Strategy

### 1.1 Phased Approach

```
Phase 1: CRITICAL Fixes (P0)
    │ 7 bugs - Workflow-breaking issues
    │ Estimated: 1.5-2 hours
    ▼
Phase 2: HIGH Fixes (P1)  
    │ 8 bugs - Significant functionality issues
    │ Estimated: 1-1.5 hours
    ▼
Phase 3: MEDIUM Fixes (P2)
    │ 9 bugs - Documentation/consistency issues
    │ Estimated: 1 hour
    ▼
Phase 4: LOW Fixes (P3)
    │ 6 bugs - Minor cosmetic issues
    │ Estimated: 30 minutes
    ▼
Phase 5: Verification & Release
    │ Testing, CHANGELOG, version bump
    │ Estimated: 30 minutes
    ▼
COMPLETE
```

### 1.2 Parallel Execution Opportunities

| Phase | Parallelizable Tasks |
|-------|---------------------|
| Phase 1 | YAML path fixes can run in parallel across all files |
| Phase 2 | Step numbering fixes can be parallelized by command |
| Phase 3 | Tool reference fixes are independent |
| Phase 4 | All cosmetic fixes are independent |

---

## 2. Phase 1: CRITICAL Fixes (P0)

### 2.1 BUG-001: README ANCHOR Format

**Files to modify:**
- `.opencode/skill/system-spec-kit/README.md`

**Changes:**
```diff
Line 421:
- <!-- ANCHOR_END: decision-auth-flow -->
+ <!-- /ANCHOR: decision-auth-flow -->

Line 696:
- | ANCHOR tag mismatch   | Check every `ANCHOR:` has matching `ANCHOR_END:`    |
+ | ANCHOR tag mismatch   | Check every `ANCHOR:` has matching `/ANCHOR:`       |
```

**Verification:**
- Memory file parsing test
- ANCHOR extraction function test

---

### 2.2 BUG-002: Systematic YAML Path Error

**Files to modify (12 total):**

| File | Lines |
|------|-------|
| `.claude/commands/spec_kit/debug.md` | 345-346 |
| `.claude/commands/spec_kit/research.md` | 420-422 |
| `.claude/commands/spec_kit/complete.md` | 604-605 |
| `.claude/commands/spec_kit/implement.md` | 340-342 |
| `.claude/commands/spec_kit/plan.md` | 309-310 |
| `.claude/commands/spec_kit/resume.md` | 250-251 |
| `.claude/commands/spec_kit/handover.md` | 550 |

**Pattern:**
```diff
- `.opencode/command/spec_kit/assets/`
+ `.claude/commands/spec_kit/assets/`
```

**Verification:**
- File existence check at documented paths

---

### 2.3 BUG-003: Missing Steps in complete.md YAMLs

**Files to modify:**
- `.claude/commands/spec_kit/assets/spec_kit_complete_auto.yaml`
- `.claude/commands/spec_kit/assets/spec_kit_complete_confirm.yaml`

**Changes:**
1. Add `step_11_checklist_verify` section (P0/P1 verification)
2. Add `step_14_handover_check` section (session handover)
3. Renumber existing steps 11-12 to 12-13

**Template for step_11_checklist_verify:**
```yaml
step_11_checklist_verify:
  name: "Checklist Verification"
  description: "Verify P0/P1 checklist items with evidence"
  agent: "@review"
  actions:
    - "Load checklist.md from spec folder"
    - "Verify all P0 items marked [x] with evidence"
    - "Verify all P1 items marked [x] or deferred with approval"
    - "Generate verification report"
  success_criteria:
    - "All P0 items verified"
    - "All P1 items verified or approved for deferral"
```

---

### 2.4 BUG-004: Missing PREFLIGHT/POSTFLIGHT in implement.md YAMLs

**Files to modify:**
- `.claude/commands/spec_kit/assets/spec_kit_implement_auto.yaml`
- `.claude/commands/spec_kit/assets/spec_kit_implement_confirm.yaml`

**Changes:**
1. Add `step_5_5_preflight` section before step_6
2. Add `step_7_5_postflight` section before step_8

**Template for preflight:**
```yaml
step_5_5_preflight:
  name: "Pre-Flight Quality Gate"
  description: "Validate before development begins"
  actions:
    - "Check ANCHOR tag pairs valid"
    - "Verify no duplicate content"
    - "Confirm token budget within limits"
  success_criteria:
    - "All pre-flight checks pass"
```

---

### 2.5 BUG-005: Invalid Task Tool Parameter

**Files to modify:**
- `.claude/commands/spec_kit/handover.md`
- `.opencode/agent/handover.md`

**Changes:**
```diff
Lines 398-401, 475 (handover.md):
- Task(subagent_type="handover", model="sonnet", prompt=...)
+ Task(subagent_type="handover", description="Session handover", prompt=...)

Lines 51-59 (agent/handover.md):
- Task(subagent_type: "handover", model: "sonnet", prompt: "...")
+ Task(subagent_type: "handover", description: "Session handover", prompt: "...")
```

---

### 2.6 BUG-006: Step Misalignment in complete.md

**Files to modify:**
- `.claude/commands/spec_kit/assets/spec_kit_complete_auto.yaml`
- `.claude/commands/spec_kit/assets/spec_kit_complete_confirm.yaml`

**Changes:**
```diff
Current step_11_completion → Rename to step_12_completion
Current step_12_save_context → Rename to step_13_save_context
Add new step_11_checklist_verify
Add new step_14_handover_check
```

---

### 2.7 BUG-007: Invalid Confidence Steps in resume.md

**Files to modify:**
- `.claude/commands/spec_kit/assets/spec_kit_resume_auto.yaml`

**Changes:**
```diff
Line 96:
- key_steps: [1, 3, 5]
+ key_steps: [1, 2, 4]
```

---

## 3. Phase 2: HIGH Fixes (P1)

### 3.1 BUG-008: Phantom WebSearch Tool

**File:** `.claude/commands/memory/research.md`
**Line:** 4

**Investigation needed:** Verify if WebSearch exists. If not:
```diff
- allowed-tools: Read, Write, Edit, Bash, Grep, Glob, Task, WebFetch, WebSearch
+ allowed-tools: read, write, edit, bash, grep, glob, task, webfetch
```

---

### 3.2 BUG-009: Session Detection Mismatch

**File:** `.claude/commands/spec_kit/assets/spec_kit_resume_*.yaml`

**Changes:**
Add 4-tier detection to `session_detection.priority_order`:
1. CLI argument
2. Semantic memory search via `memory_search()`
3. Trigger phrase matching via `memory_match_triggers()`
4. Glob by mtime (fallback)

---

### 3.3 BUG-010: YAML Contradiction in handover.md

**File:** `.claude/commands/spec_kit/handover.md`

**Options:**
- A) Remove line 258 claim about not using YAML
- B) Keep YAML reference and update line 258

**Recommended:** Option A - Remove contradictory statement

---

### 3.4 BUG-011: Section Mismatch in handover

**File:** `.claude/commands/spec_kit/assets/spec_kit_handover_full.yaml`

**Changes:**
Update YAML to use 5-section structure matching command file:
1. Handover Summary
2. Context Transfer
3. For Next Session
4. Validation Checklist
5. Session Notes

---

### 3.5 BUG-012: README Step Count Wrong

**File:** `.opencode/skill/system-spec-kit/README.md`

**Changes:**
```diff
Line 196:
- | `/spec_kit:complete`  | 12    | Full end-to-end workflow          |
+ | `/spec_kit:complete`  | 14    | Full end-to-end workflow          |

Line 198:
- | `/spec_kit:implement` | 8     | Execute pre-planned work          |
+ | `/spec_kit:implement` | 9     | Execute pre-planned work          |
```

---

### 3.6 BUG-013: Reference to Non-Existent Step

**File:** `.claude/commands/spec_kit/implement.md`
**Line:** 440

**Change:**
```diff
- routes Step 11 (Checklist Verification)
+ routes Step 7 (Checklist Verification)
```

---

### 3.7 BUG-014: Duplicate Step Number

**File:** `.claude/commands/spec_kit/implement.md`
**Lines:** 74 & 76

**Change:**
```diff
Line 74:
- 6. First item
+ 6. First item

Line 76:
- 6. Second item
+ 7. Second item
```

---

### 3.8 BUG-015: Agent File Orphaned References

**File:** `.opencode/agent/speckit.md`
**Lines:** 419-420

**Change:**
```diff
- | `/memory:why`        | Decision lineage            | `.opencode/command/memory/why.md`          |
- | `/memory:correct`    | Learning from mistakes      | `.opencode/command/memory/correct.md`      |
+ | `/memory:learn correct` | Learning from mistakes   | `.claude/commands/memory/learn.md`         |
```

---

## 4. Phase 3: MEDIUM Fixes (P2)

### 4.1 BUG-016: Outdated Section References in learn.md

**File:** `.claude/commands/memory/learn.md`

**Changes:**
```diff
Line 43:
- │   │   └─→ CORRECTION WORKFLOW (Section 13)
+ │   │   └─→ CORRECTION WORKFLOW (Section 17)

Line 48:
- │   │   └─→ UNDO WORKFLOW (Section 14)
+ │   │   └─→ UNDO WORKFLOW (Section 18)

Line 53:
- │   │   └─→ HISTORY VIEW (Section 15)
+ │   │   └─→ HISTORY VIEW (Section 19)
```

---

### 4.2 BUG-017: Wrong Tool for sortBy

**File:** `.claude/commands/memory/continue.md`
**Lines:** 283-289

**Change:**
```diff
- spec_kit_memory_memory_search({
+ spec_kit_memory_memory_list({
    query: "*",
    limit: 1,
    sortBy: "updated_at",
    includeContent: true
  })
```

---

### 4.3 BUG-018: Short Tool Names in Matrix

**File:** `.claude/commands/memory/continue.md`
**Lines:** 123-127

**Change:**
```diff
- │ DETECTION       │ memory_search(query: "session")     │
+ │ DETECTION       │ spec_kit_memory_memory_search(...)  │
```

---

### 4.4 BUG-019: Fictional Model Name

**File:** `.claude/commands/spec_kit/debug.md`
**Line:** 57

**Change:**
```diff
- │    A) Codex - OpenAI GPT-5.2-Codex (Recommended)               │
+ │    A) Codex - OpenAI models (Recommended)                      │
```

---

### 4.5 BUG-020-024: Additional Fixes

See tasks.md for detailed implementation of remaining P2 items.

---

## 5. Phase 4: LOW Fixes (P3)

See tasks.md for all P3 fixes.

---

## 6. Phase 5: Verification & Release

### 6.1 Testing Checklist

- [ ] Run all commands with `:auto` mode
- [ ] Run all commands with `:confirm` mode
- [ ] Verify YAML paths resolve correctly
- [ ] Test memory file parsing with new ANCHOR format
- [ ] Verify Task tool invocations work
- [ ] Check step numbering is consistent

### 6.2 Documentation Updates

- [ ] Update CHANGELOG.md with all fixes
- [ ] Version bump to 1.2.2.0
- [ ] Update implementation-summary.md

### 6.3 Release Checklist

- [ ] All tests passing
- [ ] Code review complete
- [ ] Documentation updated
- [ ] Git commit with proper message
- [ ] Tag version 1.2.2.0

---

## 7. Rollback Plan

If issues are discovered post-implementation:

1. **Immediate**: Git revert to previous commit
2. **Partial**: Cherry-pick only working fixes
3. **Documentation**: Revert README/CHANGELOG changes independently

---

## 8. Communication Plan

| Milestone | Notification |
|-----------|--------------|
| Phase 1 Complete | Internal team |
| All Phases Complete | Commit message |
| Release | CHANGELOG update |
