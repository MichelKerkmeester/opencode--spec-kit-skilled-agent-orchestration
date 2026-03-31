---
title: "...x-command-dispatch/z_archive/023-path-scoped-rules/002-modular-architecture/test-fixtures/invalid-priority-tags/plan]"
description: "Testing detection of malformed priority tags in checklists."
trigger_phrases:
  - "plan"
  - "invalid"
  - "priority"
  - "tags"
  - "fixture"
importance_tier: "important"
contextType: "decision"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Plan: Invalid Priority Tags Fixture

<!-- ANCHOR:summary -->
## Technical Context

Testing detection of malformed priority tags in checklists.

<!-- /ANCHOR:summary -->
<!-- ANCHOR:architecture -->
## Architecture

Level 2 spec with intentionally broken checklist format.
<!-- /ANCHOR:architecture -->

## Implementation

1. Create Level 2 spec files
2. Add checklist with various formatting errors
3. Verify validation catches all issues
