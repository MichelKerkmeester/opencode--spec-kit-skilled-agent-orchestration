---
title: "Implementation Plan - [02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/030-gate3-enforcement/plan]"
description: "Status: COMPLETE"
trigger_phrases:
  - "implementation"
  - "plan"
  - "gate"
  - "enforcement"
  - "030"
  - "gate3"
importance_tier: "important"
contextType: "decision"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan - Gate 3 Enforcement

> Step-by-step plan to implement multi-layered Gate 3 enforcement.

## Phase Overview

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | Create constitutional memory draft | COMPLETE |
| 2 | Update AGENTS.md | COMPLETE |
| 3 | Index constitutional memory | COMPLETE |
| 4 | Update skill documentation | COMPLETE |
| 5 | Testing | COMPLETE |
| 6 | Spec folder documentation | COMPLETE |

## Phase 1: Constitutional Memory Draft

**Status**: COMPLETE

**Goal**: Draft content for constitutional-tier memory.

**Deliverable**: `constitutional-memory-draft.md`

**Requirements Met**:
- [x] Under 500 tokens (~320 tokens)
- [x] Full question format: `**Spec Folder** (required): A) Existing | B) New | C) Update related | D) Skip`
- [x] Punchy, action-oriented language
- [x] Bypass patterns table with common rationalizations
- [x] Trigger phrases for memory_match_triggers()
- [x] References incident 017 for context

## Phase 2: Update AGENTS.md

**Status**: PENDING

**Goal**: Strengthen Gate 3 enforcement in the source document.

### 2.1 Add Failure Pattern #19

**Location**: Section 2, Common Failure Patterns table (after row 18)

**Content to add**:
```markdown
| 19  | Any | Skip Gate 3 on exciting tasks | "comprehensive", "fix all", "15 agents" | STOP → Ask spec folder question → Wait for A/B/C/D |
```

### 2.2 Add First Message Protocol

**Location**: Gate 3 section, after the gate box diagram (around line 130)

**Content to add**:
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

### 2.3 Update Self-Verification Checkbox

**Location**: Section 2, Self-Verification section (around line 145)

**Change from**:
```markdown
□ Did I detect file modification intent? → If YES, did I ask Q1 BEFORE using project tools?
```

**Change to**:
```markdown
□ STOP. File modification detected? Did I ask spec folder question? If NO → Ask NOW. Do not proceed.
```

## Phase 3: Index Constitutional Memory

**Status**: PENDING

**Goal**: Get constitutional memory into semantic memory index.

### Option A: Memory File (Preferred)

1. Create memory file in `.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/030-gate3-enforcement/memory`
2. Copy content from `constitutional-memory-draft.md` Memory Content section
3. Ensure anchor format: `<!-- ANCHOR:gate3-constitutional -->...<!-- /ANCHOR:gate3-constitutional -->`
4. Run `node .opencode/skill/system-memory/scripts/generate-context.js .opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/030-gate3-enforcement`
5. Manually update tier to constitutional via `memory_update()`

### Option B: Direct Index

1. Create memory directly via MCP tool if available
2. Set `importanceTier: "constitutional"`

### Verification Commands

```javascript
// Verify indexed
memory_list({ tier: "constitutional" })

// Verify triggers work
memory_match_triggers("fix all bugs in the codebase")

// Verify surfaces on any search
memory_search({ query: "unrelated topic" })
```

## Phase 4: Update Skill Documentation

**Status**: PENDING

**Goal**: Keep skill documentation synchronized with AGENTS.md changes.

### 4.1 Update system-memory/README.md

**Location**: After Section 1 Overview, or in a new "Constitutional Tier" subsection

**Content to add**:
```markdown
### Constitutional Tier for Gate 3 Enforcement

The constitutional tier can be used to create memories that **always surface** at the top of every search, regardless of query relevance. This is used for critical enforcement rules like Gate 3 (spec folder question).

**How it works:**
- Memories with `importanceTier: "constitutional"` bypass relevance filtering
- They appear first in search results (~500 token budget)
- Trigger phrases ensure they surface via `memory_match_triggers()`

**Example: Gate 3 Enforcement Memory**
A constitutional memory reminds the AI to always ask the spec folder question before file modifications. See `.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/030-gate3-enforcement` for implementation details.
```

### 4.2 Update system-memory/SKILL.md

**Location**: Section 1 or 2, where importance tiers are discussed

**Content to add**:
```markdown
### Constitutional Tier Usage

The `constitutional` tier is reserved for memories that must ALWAYS surface:
- Gate enforcement rules (e.g., Gate 3 spec folder question)
- Project-wide constraints
- Critical workflow reminders

**Create via**: `memory_update({ id: X, importanceTier: "constitutional" })`

Constitutional memories appear at the top of every `memory_search()` result, ensuring critical context is never missed.
```

### 4.3 Update system-spec-kit/SKILL.md

**Location**: Gate 3 section or Integration Points

**Content to add**:
```markdown
### First Message Protocol (Gate 3)

When a user's FIRST message requests file modifications:
1. Gate 3 question is your FIRST response
2. No analysis or tool calls first
3. Ask: `**Spec Folder** (required): A) Existing | B) New | C) Update related | D) Skip`
4. Wait for answer, then proceed

This is enforced by a constitutional-tier memory that surfaces automatically.
See `.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/030-gate3-enforcement` for details.
```

### Documentation Sync Principle

**Rule**: When updating AGENTS.md gates or enforcement mechanisms:
1. Identify affected skills (system-memory, system-spec-kit, etc.)
2. Update their README.md and SKILL.md files
3. Ensure terminology and behavior descriptions match

Out-of-sync documentation causes AI confusion and incorrect behavior.

## Phase 5: Testing

**Status**: PENDING

**Goal**: Verify all enforcement mechanisms work.

### Test Matrix

| Test ID | Input | Expected Result |
|---------|-------|-----------------|
| T1 | `memory_search({ query: "random" })` | Gate 3 memory at top |
| T2 | `memory_match_triggers("fix multiple files")` | Returns Gate 3 memory |
| T3 | `memory_match_triggers("comprehensive analysis")` | Returns Gate 3 memory |
| T4 | `memory_match_triggers("implement new feature")` | Returns Gate 3 memory |
| T5 | `memory_match_triggers("15 agents")` | Returns Gate 3 memory |
| T6 | `memory_list({ tier: "constitutional" })` | Shows Gate 3 memory |

### Manual Verification

Start new conversation, send:
> "Analyze the codebase and fix all bugs you find"

**Expected behavior**:
1. AI calls `memory_match_triggers()` (Gate 1)
2. Constitutional memory surfaces with Gate 3 reminder
3. AI asks: `**Spec Folder** (required): A) Existing | B) New | C) Update related | D) Skip`
4. AI waits for answer before proceeding

### Failure Pattern Verification

In new conversation, verify AI recognizes these as Gate 3 triggers:
- "Fix all bugs" → Should ask spec folder
- "Comprehensive refactor" → Should ask spec folder
- "Use 15 agents to analyze" → Should ask spec folder
- "Implement this feature" → Should ask spec folder

## Phase 5: Documentation

**Status**: PENDING

**Goal**: Complete spec folder documentation.

### Tasks

1. Update spec.md success criteria with completion status
2. Update checklist.md with completion status
3. Generate session memory via generate-context.js
4. Mark spec as COMPLETE

## Execution Order

```
Phase 1: Constitutional memory draft ────────────────── COMPLETE
    │
    ▼
Phase 2: Update AGENTS.md ───────────────────────────── PENDING
    │   ├── 2.1 Add failure pattern #19
    │   ├── 2.2 Add First Message Protocol
    │   └── 2.3 Update Self-Verification
    │
    ▼
Phase 3: Index constitutional memory ────────────────── PENDING
    │   ├── Create memory file
    │   ├── Index with generate-context.js
    │   └── Update tier to constitutional
    │
    ▼
Phase 4: Testing ────────────────────────────────────── PENDING
    │   ├── Trigger phrase tests
    │   ├── Search surfacing tests
    │   └── Manual behavior verification
    │
    ▼
Phase 5: Documentation ──────────────────────────────── PENDING
        └── Update all docs, generate memory
```

<!-- ANCHOR:rollback -->
## Rollback Plan

If enforcement is too aggressive:

1. **Downgrade tier**: `memory_update({ id: X, importanceTier: "critical" })`
2. **Reduce triggers**: Remove broad phrases that cause false positives
3. **Soften language**: Update Self-Verification wording
4. **Revert AGENTS.md**: Remove failure pattern #19 if too restrictive

Constitutional memories can be adjusted without full removal.
<!-- /ANCHOR:rollback -->
