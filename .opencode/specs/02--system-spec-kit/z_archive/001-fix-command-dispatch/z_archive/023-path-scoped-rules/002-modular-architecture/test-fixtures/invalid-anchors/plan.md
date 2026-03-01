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
# Plan: Invalid Anchors Fixture

## Technical Context

Testing detection of malformed anchor tags in memory files.

## Architecture

Level 1 spec with memory folder containing invalid anchors.

## Implementation

1. Create Level 1 spec files
2. Add memory file with various anchor errors
3. Verify validation catches all issues
