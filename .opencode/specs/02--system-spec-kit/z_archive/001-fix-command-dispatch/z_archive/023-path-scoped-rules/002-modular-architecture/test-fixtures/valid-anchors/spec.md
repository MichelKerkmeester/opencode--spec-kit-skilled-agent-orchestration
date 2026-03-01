---
title: "Spec: Valid Anchors Fixture [valid-anchors/spec]"
description: "This fixture tests properly paired ANCHOR tags in memory files."
trigger_phrases:
  - "spec"
  - "valid"
  - "anchors"
  - "fixture"
importance_tier: "important"
contextType: "decision"
---
# Spec: Valid Anchors Fixture

| Field       | Value                    |
|-------------|--------------------------|
| Level       | 1                        |
| Status      | Complete                 |
| Created     | 2024-12-25               |

## Problem Statement

This fixture tests properly paired ANCHOR tags in memory files.

## Requirements

- All ANCHOR tags must have matching closing tags
- Anchor IDs must be consistent between open and close

## Scope

Test fixture for anchor validation.
