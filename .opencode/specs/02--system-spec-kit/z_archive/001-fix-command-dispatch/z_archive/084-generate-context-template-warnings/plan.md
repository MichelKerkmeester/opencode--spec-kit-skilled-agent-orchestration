---
title: "Plan: Fix generate-context.js Issues [084-generate-context-template-warnings/plan]"
description: "Option A (Selected): Add snake_case aliases to vector-index.js exports"
trigger_phrases:
  - "plan"
  - "fix"
  - "generate"
  - "context"
  - "issues"
  - "084"
importance_tier: "important"
contextType: "decision"
---
# Plan: Fix generate-context.js Issues

## Approach

**Option A (Selected):** Add snake_case aliases to vector-index.js exports

This is the safest approach because:
1. Maintains backward compatibility with any code using camelCase
2. Fixes the immediate issue without risk of breaking other consumers
3. Follows the existing pattern (file already has some aliases)

## Implementation Steps

### Step 1: Add snake_case aliases to vector-index.js

Add these aliases to the `module.exports` block:

```javascript
// Snake_case aliases for backward compatibility
initialize_db: initialize_db,
get_db: get_db,
get_memory: get_memory,
```

### Step 2: Verify retry-manager.js works

Run `generate-context.js` to confirm the error is resolved.

### Step 3: Address template warnings (Optional)

Two options:
- **A) Suppress warnings** - Template renderer silently ignores missing variables
- **B) Remove unused placeholders** - Clean up the template

Recommend Option A since the V2.2 verification feature may be implemented later.

## Files to Modify

1. `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.js`
   - Add snake_case export aliases

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Breaking other consumers | Low | Medium | Only adding, not changing existing exports |
| Missing other snake_case calls | Low | Low | grep verified only these 3 are used |

## Verification

1. Run `generate-context.js` on a spec folder
2. Confirm no `get_db is not a function` error
3. Check retry processing completes
