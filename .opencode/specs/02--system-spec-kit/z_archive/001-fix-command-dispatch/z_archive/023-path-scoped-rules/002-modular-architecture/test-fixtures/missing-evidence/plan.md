---
title: "...01-fix-command-dispatch/z_archive/023-path-scoped-rules/002-modular-architecture/test-fixtures/missing-evidence/plan]"
description: "Testing detection of missing evidence tags on completed items."
trigger_phrases:
  - "plan"
  - "missing"
  - "evidence"
  - "fixture"
importance_tier: "important"
contextType: "decision"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Plan: Missing Evidence Fixture

<!-- ANCHOR:summary -->
## Technical Context

Testing detection of missing evidence tags on completed items.

<!-- /ANCHOR:summary -->
<!-- ANCHOR:architecture -->
## Architecture

Level 2 spec with checklist missing required evidence.
<!-- /ANCHOR:architecture -->

## Implementation

1. Create Level 2 spec files
2. Add checklist with completed P0/P1 items lacking evidence
3. Verify validation catches missing evidence
