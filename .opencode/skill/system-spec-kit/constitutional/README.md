---
title: "Constitutional Memory System"
description: "Always-surface rules and critical context that MUST be visible to AI agents on every interaction."
trigger_phrases:
  - "constitutional memory"
  - "always-surface rules"
  - "constitutional tier"
---

# Constitutional Memory System

> Always-surface rules and critical context that MUST be visible to AI agents on every interaction.

The constitutional tier is the highest importance level in the Spec Kit Memory system. Constitutional memories **always appear at the top of search results**, regardless of query relevance, ensuring critical rules and constraints are never forgotten or bypassed.

---

## TABLE OF CONTENTS
<!-- ANCHOR:table-of-contents -->

- [1. OVERVIEW](#1--overview)
- [2. QUICK START](#2--quick-start)
- [3. STRUCTURE](#3--structure)
- [4. FEATURES](#4--features)
- [5. CONFIGURATION](#5--configuration)
- [6. CREATING CONSTITUTIONAL MEMORIES](#6--creating-constitutional-memories)
- [7. CUSTOMIZATION](#7--customization)
- [8. USAGE EXAMPLES](#8--usage-examples)
- [9. TROUBLESHOOTING](#9--troubleshooting)
- [10. RELATED DOCUMENTS](#10--related-documents)
- [11. SUMMARY](#11--summary)

---

<!-- /ANCHOR:table-of-contents -->

## 1. OVERVIEW
<!-- ANCHOR:overview -->

### What is the constitutional/ Directory?

The `constitutional/` directory contains memory files that are **always surfaced** at the top of every `memory_search()` result. These are operational rules, safety constraints and critical context that AI agents must always have access to, regardless of what they're searching for.

Think of constitutional memories as the "system prompt" for your memory system: rules that apply globally and should never be forgotten.

### Key Statistics

| Metric | Value | Description |
|--------|-------|-------------|
| Token Budget | ~2000 | Maximum tokens for constitutional memories per search |
| Search Boost | 3.0x | Multiplier applied to constitutional results |
| Decay | Never | Constitutional memories don't decay over time |
| Auto-Expire | Never | Constitutional memories are permanent |
| Trigger Latency | <50ms | Fast phrase matching for proactive surfacing |

### Key Features

| Feature | Description |
|---------|-------------|
| **Always Surfaces** | Included at top of every `memory_search` result by default |
| **Fixed Similarity** | Returns `similarity: 100` regardless of query relevance |
| **Response Flag** | `isConstitutional: true` in search results |
| **Trigger Matching** | Fast phrase matching for proactive surfacing |
| **ANCHOR Format** | Section-level retrieval (implemented in v1.7.2) |

### How Constitutional Differs from Other Tiers

| Tier | Search Boost | Decay | Auto-Expire | Always Surfaces |
|------|--------------|-------|-------------|-----------------|
| **constitutional** | 3.0x | No | Never | **Yes** |
| critical | 2.0x | No | Never | No |
| important | 1.5x | No | Never | No |
| normal | 1.0x | Yes (90-day) | Never | No |
| temporary | 0.5x | Yes (7-day) | 7 days | No |
| deprecated | 0.0x | N/A | Manual | No |

**Key Difference**: Only constitutional memories appear in EVERY search result. Other tiers only appear when relevant to the query.

---

<!-- /ANCHOR:overview -->

## 2. QUICK START
<!-- ANCHOR:quick-start -->

### 30-Second Setup

```bash
# 1. Navigate to constitutional directory
cd .opencode/skill/system-spec-kit/constitutional/

# 2. Create a new constitutional memory file
touch my-rule.md

# 3. Add required frontmatter and content (see template below)
```

### Minimal Template

```markdown
---
title: "MY RULE TITLE"
importanceTier: constitutional
contextType: decision
triggerPhrases:
  - keyword1
  - keyword2
---

# My Rule Title

Your rule content here...
```

### Verify Installation

```bash
# Check constitutional files exist
ls .opencode/skill/system-spec-kit/constitutional/

# Expected output:
# gate-enforcement.md
# README.md
```

### First Use

After creating a constitutional memory:

1. **Restart the MCP server** (or run `memory_index_scan`)
2. **Run any search**: your constitutional memory will appear at the top
3. **Verify** with `memory_search({ query: "anything" })`. Check for `isConstitutional: true`

---

<!-- /ANCHOR:quick-start -->

## 3. STRUCTURE
<!-- ANCHOR:structure -->

### Directory Layout

```
constitutional/
├── README.md              # This documentation file
├── gate-enforcement.md    # Edge cases (compaction, continuation) + gate cross-reference
└── [your-rules].md        # Custom constitutional memories
```

### File Naming Conventions

| Pattern | Example | Use Case |
|---------|---------|----------|
| `{topic}.md` | `gate-enforcement.md` | General rules |
| `{domain}-rules.md` | `security-rules.md` | Domain-specific rules |
| `{project}-constraints.md` | `api-constraints.md` | Project-specific constraints |

### Required vs Optional Files

| File | Required | Purpose |
|------|----------|---------|
| `gate-enforcement.md` | Recommended | Edge cases (compaction, continuation) + gate cross-reference |
| `README.md` | Recommended | This documentation |
| Custom files | Optional | Your domain-specific rules |

---

<!-- /ANCHOR:structure -->

## 4. FEATURES
<!-- ANCHOR:features -->

### 4.1 Always-Surface Behavior

Constitutional memories are **automatically included** at the top of every `memory_search()` result.

**How it works:**

```typescript
// When you call:
memory_search({ query: "authentication flow" })

// The system:
// 1. Fetches ALL constitutional memories first
// 2. Adds them to the top of results with similarity: 100
// 3. Then adds query-relevant results below
```

**Control:**

```typescript
// To disable constitutional surfacing (rare):
memory_search({ 
  query: "...", 
  includeConstitutional: false  // Default is true
})
```

### 4.2 Trigger Phrase Matching

Constitutional memories support **fast trigger phrase matching** (<50ms) for proactive surfacing.

**How it works:**

1. Define trigger phrases in YAML frontmatter
2. When user message contains a trigger phrase, the memory surfaces
3. No embedding generation required. Pure string matching

**Example triggers:**

```yaml
triggerPhrases:
  - fix
  - implement
  - create
  - modify
  - spec folder
```

When a user says "fix the login bug", the memory with "fix" trigger surfaces immediately.

### 4.3 ANCHOR Format

Constitutional memories use ANCHOR markers for **section-level retrieval**.

> **Implemented (v1.7.2):** ANCHOR tags are now fully indexed and support section-level retrieval. Use the `anchors` parameter in `memory_search()` to retrieve specific sections with 58-90% token savings.

**Format:**

```markdown
<!-- ANCHOR:section-id -->
## Section Title

Content here...

<!-- /ANCHOR:section-id -->
```

**Benefits:**

- Load specific sections instead of entire files
- Reduce token usage in context windows
- Enable granular search results

### 4.4 Token Budget Management

Constitutional memories are limited to **~2000 tokens total** per search to prevent context overflow.

**How it works:**

1. System calculates token count for each constitutional memory
2. Memories are added in order until budget is reached
3. Remaining memories are truncated or excluded

**Best Practice:** Keep individual constitutional memories concise. Split large rule sets into multiple focused files.

---

<!-- /ANCHOR:features -->

## 5. CONFIGURATION
<!-- ANCHOR:configuration -->

### 5.1 YAML Frontmatter Requirements

Every constitutional memory file MUST have this frontmatter:

```yaml
---
title: "DESCRIPTIVE TITLE"           # Required: Human-readable title
importanceTier: constitutional       # Required: Must be "constitutional"
contextType: decision                # Required: decision, research, implementation, etc.
triggerPhrases:                      # Recommended: Fast matching phrases
  - phrase1
  - phrase2
---
```

### 5.2 Frontmatter Fields

| Field | Required | Type | Description |
|-------|----------|------|-------------|
| `title` | Yes | string | Human-readable title for search results |
| `importanceTier` | Yes | string | Must be `constitutional` |
| `contextType` | Yes | string | Category: `decision`, `research`, `implementation`, `discovery`, `general` |
| `triggerPhrases` | Recommended | string[] | Keywords for fast matching |

### 5.3 Trigger Phrase Configuration

**Best Practices for Trigger Phrases:**

| Do | Don't |
|----|-------|
| Use specific action words | Use common words like "the", "a" |
| Include domain terminology | Use overly broad terms |
| Add common misspellings | Add phrases longer than 3 words |
| Keep list focused (10-50 phrases) | Add hundreds of phrases |

**Example, Gate 3 Triggers:**

```yaml
triggerPhrases:
  # File modification actions
  - fix
  - implement
  - create
  - modify
  - update
  - change
  - edit
  - refactor
  - write
  - add
  - remove
  - delete
  - rename
  - move
  # Explicit references
  - spec folder
  - gate 3
```

---

<!-- /ANCHOR:configuration -->

## 6. CREATING CONSTITUTIONAL MEMORIES
<!-- ANCHOR:creating-memories -->

### Step-by-Step Guide

#### Step 1: Identify the Rule

Ask yourself:
- Does this rule apply to EVERY interaction?
- Would forgetting this rule cause significant problems?
- Is this a safety constraint or hard requirement?

If yes to all, constitutional tier is appropriate.

#### Step 2: Create the File

```bash
# Create file in constitutional directory
touch .opencode/skill/system-spec-kit/constitutional/<rule-name>.md
```

#### Step 3: Add Frontmatter

```yaml
---
title: "MY RULE - DESCRIPTIVE TITLE"
importanceTier: constitutional
contextType: decision
triggerPhrases:
  - relevant
  - keywords
  - here
---
```

#### Step 4: Add Content

```markdown
# My Rule Title

> Brief description of what this rule enforces.

## Rule Details

Your rule content here...

## Quick Reference

| Trigger | Action |
|---------|--------|
| ... | ... |
```

#### Step 5: Index the Memory

```bash
# Option 1: Restart MCP server (auto-indexes on startup)
# Option 2: Manual index
memory_index_scan({ force: true })

# Option 3: Index single file
memory_save({ filePath: ".opencode/skill/system-spec-kit/constitutional/<rule-name>.md" })
```

#### Step 6: Verify

```typescript
// Search for anything - your rule should appear at top
memory_search({ query: "test" })

// Check for isConstitutional: true in results
```

### Complete Template

```markdown
<!-- TEMPLATE: constitutional_memory.md v1.0 -->
---
title: "RULE TITLE - BRIEF DESCRIPTION"
importanceTier: constitutional
contextType: decision
triggerPhrases:
  # Action triggers
  - action1
  - action2
  # Domain triggers
  - domain_term1
  - domain_term2
---

# RULE TITLE

> One-line description of what this rule enforces.

These rules are HARD BLOCKS. No exceptions.

---

## RULE DETAILS

### Rule 1: Name

**TRIGGER:** When this condition occurs

**ACTION:**
1. Step one
2. Step two
3. Step three

**RATIONALE:** Why this rule exists

---

### Rule 2: Name

**TRIGGER:** When this condition occurs

**ACTION:**
1. Step one
2. Step two

---

## QUICK REFERENCE

| Rule | Trigger | Action | Type |
|------|---------|--------|------|
| Rule 1 | condition | action | HARD |
| Rule 2 | condition | action | SOFT |

---

## SELF-CHECK

```
[ ] Did I check condition 1?
[ ] Did I verify condition 2?
[ ] Am I following the rule?
```

---

*Constitutional Memory: Always surfaces at top of search results*
*Location: .opencode/skill/system-spec-kit/constitutional/*
```

---

<!-- /ANCHOR:creating-memories -->

## 7. CUSTOMIZATION
<!-- ANCHOR:customization -->

### 7.1 Adding New Trigger Phrases

Edit the `triggerPhrases` array in the YAML frontmatter:

```yaml
triggerPhrases:
  # Existing phrases
  - fix
  - implement
  # Add new phrases
  - deploy
  - release
  - publish
```

After editing, re-index:

```typescript
memory_save({ 
  filePath: ".opencode/skill/system-spec-kit/constitutional/gate-enforcement.md",
  force: true 
})
```

### 7.2 Modifying Existing Rules

1. **Edit the file** directly in the constitutional directory
2. **Preserve ANCHOR format**: ensure opening and closing tags match
3. **Re-index** after changes

```bash
# Edit the file
vim .opencode/skill/system-spec-kit/constitutional/gate-enforcement.md

# Re-index
memory_index_scan({ force: true })
```

### 7.3 Creating Domain-Specific Constitutional Memories

**Example: Security Rules**

```markdown
---
title: "SECURITY RULES - MANDATORY CHECKS"
importanceTier: constitutional
contextType: decision
triggerPhrases:
  - password
  - authentication
  - authorization
  - token
  - secret
  - credential
  - api key
  - security
---

# Security Rules

## NEVER Commit Secrets

**TRIGGER:** Any file containing passwords, API keys or tokens

**ACTION:**
1. STOP immediately
2. Remove secret from file
3. Add to .gitignore
4. Use environment variables instead
```

### 7.4 Disabling Constitutional Surfacing

For specific searches where you don't want constitutional memories:

```typescript
memory_search({ 
  query: "specific topic",
  includeConstitutional: false  // Disable for this search only
})
```

**Warning:** This should be rare. Constitutional memories exist for safety.

---

<!-- /ANCHOR:customization -->

## 8. USAGE EXAMPLES
<!-- ANCHOR:usage-examples -->

### Example 1: Gate Enforcement (Default)

The default `gate-enforcement.md` enforces the spec folder question:

```markdown
### GATE 3: SPEC FOLDER BEFORE FILE MODIFICATIONS [HARD BLOCK]

**TRIGGER:** Any intent to create, edit, delete, fix, implement, update, rename or move files.

**REQUIRED ACTION:**

STOP and ASK before using Read/Edit/Write/Bash:

> **Spec Folder:** A) Existing | B) New | C) Update related | D) Skip

WAIT for user's answer. THEN proceed.
```

### Example 2: Project-Specific Constraints

```markdown
---
title: "API CONSTRAINTS - RATE LIMITS"
importanceTier: constitutional
contextType: decision
triggerPhrases:
  - api
  - request
  - fetch
  - call
---

# API Constraints

## Rate Limits

- Maximum 100 requests per minute
- Batch operations preferred over individual calls
- Always implement exponential backoff

## Required Headers

Every API call MUST include:
- `Authorization: Bearer {token}`
- `X-Request-ID: {uuid}`
```

### Example 3: Multi-Section Constitutional Memory

```markdown
---
title: "CODE QUALITY RULES"
importanceTier: constitutional
contextType: decision
triggerPhrases:
  - code
  - function
  - class
  - implement
---

## Naming Conventions

- camelCase for variables and functions
- PascalCase for classes
- SCREAMING_SNAKE_CASE for constants

## Testing Requirements

- All public functions must have tests
- Minimum 80% code coverage
- Integration tests for API endpoints
```

---

<!-- /ANCHOR:usage-examples -->

## 9. TROUBLESHOOTING
<!-- ANCHOR:troubleshooting -->

### Common Issues

#### Constitutional Memory Not Surfacing

**Symptom:** Your constitutional memory doesn't appear in search results

**Causes and Solutions:**

| Cause | Solution |
|-------|----------|
| File not indexed | Run `memory_index_scan({ force: true })` |
| Wrong `importanceTier` | Verify frontmatter has `importanceTier: constitutional` |
| Invalid ANCHOR format | Check opening/closing ANCHOR tags match |
| MCP server not restarted | Restart the MCP server |

#### Trigger Phrases Not Matching

**Symptom:** `memory_match_triggers()` doesn't return your memory

**Causes and Solutions:**

| Cause | Solution |
|-------|----------|
| Phrases not indexed | Re-index with `force: true` |
| Case sensitivity | Triggers are case-insensitive, but check spelling |
| Phrase too long | Keep triggers to 1-3 words |

#### Token Budget Exceeded

**Symptom:** Some constitutional memories are truncated

**Solution:**
1. Split large files into smaller, focused files
2. Use ANCHOR sections to enable partial loading
3. Keep individual memories under 200 tokens

### Diagnostic Commands

```bash
# Check constitutional files exist
ls -la .opencode/skill/system-spec-kit/constitutional/

# Verify file has correct frontmatter
head -20 .opencode/skill/system-spec-kit/constitutional/gate-enforcement.md

# Check database for constitutional memories
sqlite3 .opencode/skill/system-spec-kit/mcp_server/database/context-index.sqlite \
  "SELECT id, title, importance_tier FROM memory_index WHERE importance_tier = 'constitutional';"

# Test trigger matching
memory_match_triggers({ prompt: "fix the bug" })
```

### Quick Fixes

| Problem | Quick Fix |
|---------|-----------|
| Not surfacing | `memory_index_scan({ force: true })` |
| Wrong tier | Edit frontmatter, re-index |
| Broken anchors | Validate ANCHOR pairs match |
| Stale cache | Restart MCP server |

---

<!-- /ANCHOR:troubleshooting -->

## 10. RELATED DOCUMENTS
<!-- ANCHOR:related -->

### Internal Documentation

| Document | Location | Purpose |
|----------|----------|---------|
| SKILL.md | `../SKILL.md` | Complete skill documentation |
| README.md | `../README.md` | Skill overview (1800+ lines) |
| MCP Server README | `../mcp_server/README.md` | MCP tools documentation |
| Importance Tiers | `../mcp_server/lib/scoring/importance-tiers.ts` | Tier configuration (source) |

### Reference Files

| Document | Location | Purpose |
|----------|----------|---------|
| Gate Enforcement | `./gate-enforcement.md` | Default constitutional memory |
| Save Workflow | `../references/memory/save_workflow.md` | Memory save workflows |
| Trigger Config | `../references/memory/trigger_config.md` | Trigger phrase configuration |

### External Resources

| Resource | URL |
|----------|-----|
| MCP Protocol | https://modelcontextprotocol.io/ |
| nomic-embed-text | https://huggingface.co/nomic-ai/nomic-embed-text-v1.5 |

---

<!-- /ANCHOR:related -->

## 11. SUMMARY
<!-- ANCHOR:summary -->

Constitutional memories are the **highest priority** context in the Spec Kit Memory system:

- **Always surface** at the top of every search result
- **Never decay**: permanent importance
- **3.0x search boost**: highest priority
- **~2000 token budget**: keep them concise
- **Trigger matching**: proactive surfacing in <50ms

Use constitutional tier for:
- Gate enforcement rules
- Safety constraints
- Hard blockers
- Global project rules

**Remember:** Constitutional memories are powerful. Use them sparingly for rules that truly must ALWAYS be visible.

---

*Documentation version: 1.0 | Last updated: 2025-12-27*

<!-- /ANCHOR:summary -->
