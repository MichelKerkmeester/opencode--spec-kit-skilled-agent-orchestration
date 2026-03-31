---
title: "...-system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/056-spec-kit-references-reorganization/decision-record]"
description: "Reorganize the system-spec-kit skill's references/ folder from a flat structure into logical sub-folders, following the pattern established in the workflows-code skill improvement."
trigger_phrases:
  - "decision"
  - "record"
  - "system"
  - "spec"
  - "kit"
  - "decision record"
  - "056"
importance_tier: "important"
contextType: "planning"
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: system-spec-kit References Reorganization

<!-- ANCHOR:decision -->
## Decision

Reorganize the `system-spec-kit` skill's `references/` folder from a flat structure into logical sub-folders, following the pattern established in the `workflows-code` skill improvement.
<!-- /ANCHOR:decision -->

## Status

**Proposed** - Pending implementation

<!-- ANCHOR:context -->
## Context

The `system-spec-kit` skill is a core skill used across all spec folder operations. Its `references/` folder contains multiple markdown files covering different domains (memory system, validation, templates, workflows). Currently, all files exist at the root level of `references/`, making it difficult to:

1. Quickly find relevant documentation
2. Understand the relationship between files
3. Navigate the skill's resources efficiently

The `workflows-code` skill recently underwent a similar reorganization (spec 001-workflows-code-codebase-alignment) with positive results, establishing a pattern worth following.
<!-- /ANCHOR:context -->

<!-- ANCHOR:decision -->
## Decision Drivers

- **Consistency**: Other skills use organized sub-folder structures
- **Discoverability**: Flat structures scale poorly as documentation grows
- **Maintainability**: Logical groupings make updates easier
- **User Experience**: Clearer navigation improves skill usability
<!-- /ANCHOR:decision -->

## Alternatives Considered

### Alternative 1: Keep Flat Structure

**Pros:**
- No migration effort required
- No risk of broken links
- Familiar to current users

**Cons:**
- Continues scalability problem
- Inconsistent with other skills
- Harder to navigate as files grow

**Decision:** Rejected - does not address the core problem

### Alternative 2: Different Grouping Strategy

**Pros:**
- Could optimize for different use cases
- Flexibility in organization

**Cons:**
- No established pattern to follow
- Higher risk of poor choices
- Requires more analysis time

**Decision:** Rejected - prefer proven pattern from workflows-code

### Alternative 3: Sub-folder Organization (Selected)

**Pros:**
- Follows proven pattern from workflows-code
- Improves navigation and discoverability
- Scales well for future additions
- Consistent with skill system conventions

**Cons:**
- Requires path updates in SKILL.md
- One-time migration effort
- Potential for temporary broken links during migration

**Decision:** Selected - benefits outweigh costs

## Trade-offs

| Factor | Before | After |
|--------|--------|-------|
| Navigation | Difficult (flat) | Easy (organized) |
| Discoverability | Poor | Good |
| Migration Effort | None | One-time |
| Consistency | Low | High |
| Maintenance | Harder | Easier |

<!-- ANCHOR:consequences -->
## Consequences

### Positive

- Improved skill usability
- Easier maintenance and updates
- Consistent with other skills
- Better documentation organization

### Negative

- One-time migration effort
- Need to update all SKILL.md path references
- Brief period of potential confusion during transition

### Neutral

- File content remains unchanged
- Skill functionality unaffected
- Git history preserved with git mv
<!-- /ANCHOR:consequences -->

## Implementation Notes

1. Use `git mv` to preserve file history
2. Update SKILL.md paths systematically
3. Verify all links before considering complete
4. Document final structure in implementation-summary.md

## References

- `.opencode/specs/03--commands-and-skills/z_archive/001-code-workflows-codebase-alignment/` - Pattern reference
- `.opencode/skill/system-spec-kit/SKILL.md` - Target file for updates
- `.opencode/skill/system-spec-kit/references/` - Target folder for reorganization
