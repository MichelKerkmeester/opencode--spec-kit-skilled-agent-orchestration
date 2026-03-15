---
title: "Plan: Invalid Anchors Fixture [invalid-anchors/plan]"
description: "Testing detection of malformed anchor tags in memory files."
trigger_phrases:
  - "plan"
  - "invalid"
  - "anchors"
  - "fixture"
importance_tier: "important"
contextType: "decision"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Plan: Invalid Anchors Fixture

<!-- ANCHOR:summary -->
## Technical Context

Testing detection of malformed anchor tags in memory files.

<!-- /ANCHOR:summary -->
## Architecture

Level 1 spec with memory folder containing invalid anchors.

## Implementation

1. Create Level 1 spec files
2. Add memory file with various anchor errors
3. Verify validation catches all issues
