---
title: "Gate 3 Enforcement - Preventing Spec Folder Bypass [030-gate3-enforcement/spec]"
description: "During a comprehensive bug fix session (63+ bugs, 25+ files, 15 parallel agents), the AI"
trigger_phrases:
  - "gate"
  - "enforcement"
  - "preventing"
  - "spec"
  - "folder"
  - "030"
  - "gate3"
importance_tier: "important"
contextType: "decision"
---
# Gate 3 Enforcement - Preventing Spec Folder Bypass

> Multi-layered enforcement to ensure Gate 3 (spec folder question) is never skipped, especially on large or exciting tasks.

## Overview

| Field | Value |
|-------|-------|
| Date | December 24, 2024 |
| Scope | Level 2 (100-499 LOC) |
| Status | COMPLETE - All 31 checklist items verified, 24 tests passed |
| Incident | 017-comprehensive-bug-fix |

## Problem Statement

### The Incident

During a comprehensive bug fix session (63+ bugs, 25+ files, 15 parallel agents), the AI:

1. Read AGENTS.md with Gate 3 rules clearly defined
2. Understood Gate 3 is a "HARD BLOCK" requiring spec folder question before file modifications
3. **Skipped Gate 3 entirely** and proceeded with implementation
4. Only created spec folder retroactively when explicitly asked

### Root Cause Analysis

| Factor | Description |
|--------|-------------|
| Excitement bias | Large, complex tasks trigger "rush to solve" behavior |
| Buried rules | Gate 3 is one rule among many in a long document |
| No persistent reminder | Rules only exist in AGENTS.md, not surfaced dynamically |
| Weak enforcement language | "HARD BLOCK" wasn't forceful enough to override task excitement |
| No trigger-based surfacing | Keywords like "fix all", "comprehensive" don't trigger reminders |

### Impact

- No documentation trail during 63+ bug fixes
- No checklist to track 67 items during implementation
- Harder to resume if context lost mid-session
- Violated the exact system designed to prevent this

## Solution

Implement 5 reinforcement mechanisms (Suggestions 1, 2, 3, 5, 6):

### Suggestion 1: Constitutional Memory Reminder

Create a **constitutional-tier memory** that surfaces at the top of EVERY memory search:

- Cannot be filtered out by query relevance
- ~500 token budget ensures visibility without overwhelming
- Punchy, action-oriented language
- Includes the exact question format:

```
**Spec Folder** (required): A) Existing | B) New | C) Update related | D) Skip
```

**File**: `constitutional-memory-draft.md`

### Suggestion 2: "Exciting Task" Failure Pattern

Add new entry to AGENTS.md failure patterns table:

```markdown
| 19 | Any | Skip Gate 3 on exciting tasks | "comprehensive", "fix all", "15 agents" | STOP → Ask spec folder question → Wait for A/B/C/D |
```

Explicitly recognizes that large tasks are highest risk for Gate 3 bypass.

### Suggestion 3: First Message Protocol

Add explicit rule to AGENTS.md Gate 3 section:

```markdown
### First Message Protocol

**RULE**: If the user's FIRST message requests file modifications:
1. Gate 3 question is your FIRST response
2. No analysis first ("let me understand the scope")
3. No tool calls first ("let me check what exists")
4. Ask immediately:

   **Spec Folder** (required): A) Existing | B) New | C) Update related | D) Skip

5. Wait for answer, THEN proceed

**Why**: Large tasks feel urgent. Urgency bypasses process. Ask first, analyze after.
```

### Suggestion 5: Trigger Phrases

Add comprehensive trigger phrases to constitutional memory:

**Implementation keywords**: fix, implement, create, modify, update, refactor, change, edit, write, add, remove, delete

**Scope indicators**: comprehensive, all bugs, multiple files, codebase, entire, full, everything

**Agent patterns**: parallel agents, 15 agents, 10 agents, dispatch agents, opus agents

**Action phrases**: analyze and fix, find and fix, fix all, update all, modify all, check and fix

### Suggestion 6: Stronger Self-Verification

Update AGENTS.md Self-Verification checkbox:

**From**:
```
□ Did I detect file modification intent? → If YES, did I ask Q1 BEFORE using project tools?
```

**To**:
```
□ STOP. File modification detected? Did I ask spec folder question? If NO → Ask NOW. Do not proceed.
```

- "STOP" creates mental break
- "Do not proceed" is unambiguous
- Eliminates "I'll ask later" rationalization

## Files to Modify

### Core Files

| File | Changes |
|------|---------|
| `AGENTS.md` | Add failure pattern #19, First Message Protocol, stronger self-verification |

### Skill Documentation (Keep in Sync)

| File | Changes |
|------|---------|
| `.opencode/skill/system-memory/README.md` | Add section on Constitutional Tier for Gate 3 enforcement |
| `.opencode/skill/system-memory/SKILL.md` | Document constitutional memory usage for enforcement |
| `.opencode/skill/system-spec-kit/SKILL.md` | Reference First Message Protocol, Gate 3 enforcement |

### Why Skill Docs Must Be Updated

When changes are made to:
- Constitutional memory system → Update `system-memory/README.md` and `SKILL.md`
- Gate 3 workflow → Update `system-spec-kit/SKILL.md`
- AGENTS.md gates → Update relevant skill documentation

**Principle**: Skill documentation must stay synchronized with AGENTS.md and actual system behavior. Out-of-sync docs cause confusion and incorrect AI behavior.

## Files to Create

| File | Purpose |
|------|---------|
| `constitutional-memory-draft.md` | Draft content for constitutional memory |
| Memory file via generate-context.js | Indexed constitutional memory |

## Success Criteria

### Implementation
- [ ] Constitutional memory drafted with full question format
- [ ] Constitutional memory indexed with tier: constitutional
- [ ] Failure pattern #19 added to AGENTS.md
- [ ] First Message Protocol added to Gate 3 section
- [ ] Self-Verification checkbox updated with stronger language

### Testing
- [ ] `memory_match_triggers("fix all bugs")` returns Gate 3 reminder
- [ ] `memory_search()` shows constitutional memory at top of results
- [ ] Future sessions demonstrate correct Gate 3 behavior

### Documentation Sync
- [ ] `system-memory/README.md` updated with Constitutional Tier for Gate 3 section
- [ ] `system-memory/SKILL.md` mentions constitutional enforcement
- [ ] `system-spec-kit/SKILL.md` references First Message Protocol

## Risk Assessment

| Risk | Mitigation |
|------|------------|
| Constitutional memory too verbose | Keep under 500 tokens, currently ~320 |
| Trigger phrases too broad | Focus on implementation-specific keywords |
| AGENTS.md changes break other flows | Review existing gate logic before changes |
| Still might skip if Gate 1 skipped | Constitutional memory helps but needs Gate 1 compliance too |

## Related Work

| Spec | Relationship |
|------|--------------|
| 017-comprehensive-bug-fix | The incident that exposed this gap |
| 016-memory-alignment-fix | Previous memory system work |
| AGENTS.md Section 2 | Gate definitions to be updated |
