# Constitutional Memory Draft - Gate 3 Enforcement

> Draft content for a constitutional-tier memory that surfaces at the top of every memory search.

## Frontmatter (for indexing)

```yaml
importance_tier: constitutional
context_type: decision
trigger_phrases:
  # Implementation keywords
  - fix
  - implement
  - create
  - modify
  - update
  - refactor
  - change
  - edit
  - write
  - add
  - remove
  - delete
  # Scope indicators
  - comprehensive
  - all bugs
  - multiple files
  - codebase
  - entire
  - full
  - everything
  # Agent patterns
  - parallel agents
  - 15 agents
  - 10 agents
  - dispatch agents
  - opus agents
  # Action phrases
  - analyze and fix
  - find and fix
  - fix all
  - update all
  - modify all
  - check and fix
```

## Memory Content

```markdown
<!-- ANCHOR:gate3-constitutional -->

# GATE 3 - HARD BLOCK

**Before ANY file modification, you MUST ask:**

**Spec Folder** (required): A) Existing | B) New | C) Update related | D) Skip

**Then WAIT for the answer. Do not proceed without it.**

## When This Applies

ANY of these triggers:
- User asks to fix, implement, modify, update, create, or refactor
- User mentions comprehensive, all bugs, multiple files, codebase
- You're about to use Edit, Write, or Task tools for implementation
- The task feels exciting, large, or urgent

## Common Bypass Patterns - DO NOT DO THESE

| Bypass Attempt | Why It's Wrong |
|----------------|----------------|
| "Let me analyze first, then ask" | NO. Ask first, analyze after. |
| "This is just a quick fix" | NO. All fixes need documentation. |
| "I'll create the spec folder after" | NO. That defeats the purpose. |
| "The task is exciting/urgent" | NO. Urgency is exactly why you MUST ask. |
| "It's obvious which folder to use" | NO. Let the user decide. |
| "I already know what to do" | NO. Process exists for a reason. |

## Why This Matters

Large tasks are exactly when documentation matters most:
- More files = more to track
- More changes = more to verify
- More context = more to lose on compaction
- No spec folder = no recovery path

The 017-comprehensive-bug-fix incident: 63+ bugs fixed, 25+ files modified, spec folder created AFTER. Don't repeat this.

**Ask first. Always.**

<!-- /ANCHOR:gate3-constitutional -->
```

## Token Count

- Content: ~320 tokens
- Within 500 token constitutional budget: YES

## Anchor ID

`gate3-constitutional`

Direct load: `memory_load({ specFolder: "018-gate3-enforcement", anchorId: "gate3-constitutional" })`

## Expected Behavior After Indexing

**1. Top of Every Search**
```javascript
memory_search({ query: "how does auth work" })
// Gate 3 memory appears FIRST, regardless of query
```

**2. Trigger Phrase Matching**
```javascript
memory_match_triggers("fix all bugs in the codebase")
// Returns Gate 3 memory due to "fix" and "all bugs" triggers
```

**3. Constitutional Tier List**
```javascript
memory_list({ tier: "constitutional" })
// Shows this memory
```

## Pre-Index Review

- [ ] Content under 500 tokens
- [ ] Trigger phrases cover implementation keywords
- [ ] Bypass patterns address actual failure modes
- [ ] Question format matches AGENTS.md Gate 3 exactly
- [ ] Anchor format correct (ANCHOR:id)
- [ ] References the incident (017) for context
- [ ] Tone is firm and unambiguous

## Implementation Notes

1. Index with `importanceTier: "constitutional"` - critical for auto-surfacing
2. Test with `memory_match_triggers()` for implementation keywords
3. Verify appears at top of unrelated searches
4. Update bypass patterns as new rationalizations are discovered
