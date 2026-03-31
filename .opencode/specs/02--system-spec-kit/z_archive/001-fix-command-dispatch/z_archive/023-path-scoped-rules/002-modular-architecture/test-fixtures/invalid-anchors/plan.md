---
title: "...001-fix-command-dispatch/z_archive/023-path-scoped-rules/002-modular-architecture/test-fixtures/invalid-anchors/plan]"
description: "Testing detection of malformed anchor tags in memory files."
trigger_phrases:
  - "plan"
  - "invalid"
  - "anchors"
  - "fixture"
importance_tier: "important"
contextType: "planning"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Plan: Invalid Anchors Fixture

<!-- ANCHOR:summary -->
## Technical Context

Testing detection of malformed anchor tags in memory files.

<!-- /ANCHOR:summary -->
<!-- ANCHOR:architecture -->
## Architecture

Level 1 spec with memory folder containing invalid anchors.
<!-- /ANCHOR:architecture -->

## Implementation

1. Create Level 1 spec files
2. Add memory file with various anchor errors
3. Verify validation catches all issues
